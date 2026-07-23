import { useState, useRef, useEffect, useCallback } from "react";
import { audioTracks } from "../../assets/audioTracks";
import { AB_COMPARATOR, AB_COMPARATOR_TRACKS } from "../../content/copy";
import "./ABMasterComparator.scss";

function formatTime(s) {
  const m = Math.floor(s / 60);
  return m + ":" + Math.floor(s % 60).toString().padStart(2, "0");
}

function rmsLevel(buffer) {
  const data = buffer.getChannelData(0);
  let sum = 0;
  for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
  return Math.sqrt(sum / data.length);
}

export default function ABMasterComparator() {
  const [current, setCurrent] = useState("A");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [trackMeta, setTrackMeta] = useState({ name: "Elige un track", sub: "Selecciona una pista para comparar" });
  const [statusText, setStatusText] = useState("elige un track para comenzar");
  const [loudnessText, setLoudnessText] = useState("");
  const [vuLevels, setVuLevels] = useState(new Array(32).fill(0));

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const buffersRef = useRef({ A: null, B: null });
  const sourceRef = useRef(null);
  const startTimeRef = useRef(0);
  const pauseOffsetRef = useRef(0);
  const durationRef = useRef(0);
  const rafRef = useRef(null);
  const vuRafRef = useRef(null);
  const wfCanvasRef = useRef(null);
  const currentRef = useRef("A");
  const animateVURef = useRef(null);
  const updateProgressRef = useRef(null);

  useEffect(() => {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioCtxRef.current.createGain();
    gainNodeRef.current.gain.value = 0.85;
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 64;
    analyserRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioCtxRef.current.destination);
    return () => {
      if (sourceRef.current) try { sourceRef.current.stop(); } catch { /* already stopped */ }
      audioCtxRef.current.close();
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(vuRafRef.current);
    };
  }, []);

  useEffect(() => { currentRef.current = current; }, [current]);

  const drawWaveform = useCallback((buffer, which) => {
    const canvas = wfCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth * (window.devicePixelRatio || 1);
    const H = 80;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    if (!buffer) {
      ctx.fillStyle = "rgba(232,232,232,0.15)";
      ctx.fillRect(0, H / 2 - 1, W, 2);
      return;
    }
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / W);
    ctx.fillStyle = which === "A" ? "rgba(232,232,232,0.35)" : "#d48212";
    for (let i = 0; i < W; i++) {
      let max = 0;
      for (let j = 0; j < step; j++) {
        const v = Math.abs(data[i * step + j] || 0);
        if (v > max) max = v;
      }
      const h = max * H * 0.9;
      ctx.fillRect(i, (H - h) / 2, 1, h);
    }
  }, []);

  const animateVU = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const bars = 32;
    const step = Math.floor(data.length / bars);
    const levels = Array.from({ length: bars }, (_, i) => data[i * step] / 255);
    setVuLevels(levels);
    vuRafRef.current = requestAnimationFrame(() => animateVURef.current());
  }, []);
  useEffect(() => { animateVURef.current = animateVU; }, [animateVU]);

  const stopPlayback = useCallback(() => {
    if (sourceRef.current) try { sourceRef.current.stop(); } catch { /* already stopped */ }
    sourceRef.current = null;
    pauseOffsetRef.current = 0;
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(vuRafRef.current);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setVuLevels(new Array(32).fill(0));
  }, []);

  const updateProgress = useCallback(() => {
    const elapsed = audioCtxRef.current.currentTime - startTimeRef.current + pauseOffsetRef.current;
    const dur = durationRef.current;
    const pct = dur ? Math.min(elapsed / dur, 1) : 0;
    setProgress(pct * 100);
    setCurrentTime(elapsed);
    if (elapsed >= dur) { stopPlayback(); return; }
    rafRef.current = requestAnimationFrame(() => updateProgressRef.current());
  }, [stopPlayback]);
  useEffect(() => { updateProgressRef.current = updateProgress; }, [updateProgress]);

  const playBuffer = useCallback((which, offset) => {
    const buf = buffersRef.current[which];
    if (!buf) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(analyserRef.current);
    src.start(0, offset);
    sourceRef.current = src;
    startTimeRef.current = ctx.currentTime;
    durationRef.current = buf.duration;
    setDuration(buf.duration);
    setIsPlaying(true);
    animateVU();
    updateProgress();
  }, [animateVU, updateProgress]);

  const togglePlay = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!buffersRef.current[currentRef.current]) {
      setStatusText("elige un track primero");
      return;
    }
    if (isPlaying) {
      pauseOffsetRef.current += ctx.currentTime - startTimeRef.current;
      if (sourceRef.current) try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current = null;
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(vuRafRef.current);
      setIsPlaying(false);
      setVuLevels(new Array(32).fill(0));
    } else {
      playBuffer(currentRef.current, pauseOffsetRef.current);
    }
  }, [isPlaying, playBuffer]);

  const seek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newOffset = pct * (durationRef.current || 0);
    pauseOffsetRef.current = newOffset;
    setProgress(pct * 100);
    setCurrentTime(newOffset);
    if (isPlaying) {
      if (sourceRef.current) try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current = null;
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(vuRafRef.current);
      playBuffer(currentRef.current, newOffset);
    }
  }, [isPlaying, playBuffer]);

  const handleFlipToggle = useCallback(() => {
    const which = currentRef.current === "A" ? "B" : "A";
    const wasPlaying = isPlaying;
    const savedOffset = wasPlaying
      ? pauseOffsetRef.current + (audioCtxRef.current.currentTime - startTimeRef.current)
      : pauseOffsetRef.current;
    if (isPlaying) {
      if (sourceRef.current) try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current = null;
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(vuRafRef.current);
      setIsPlaying(false);
      setVuLevels(new Array(32).fill(0));
    }
    setCurrent(which);
    currentRef.current = which;
    drawWaveform(buffersRef.current[which], which);
    if (buffersRef.current[which]) {
      const dur = buffersRef.current[which].duration;
      const newOffset = Math.min(savedOffset, dur);
      pauseOffsetRef.current = newOffset;
      durationRef.current = dur;
      setDuration(dur);
      setProgress(dur ? (newOffset / dur) * 100 : 0);
      setCurrentTime(newOffset);
      setStatusText(which === "A" ? "escuchando — original sin masterizar" : "escuchando — master teburu");
      if (wasPlaying) playBuffer(which, newOffset);
    }
  }, [isPlaying, drawWaveform, playBuffer]);

  const loadTrack = useCallback((trackId) => {
    const pair = audioTracks[trackId];
    if (!pair || trackId === selectedTrackId) return;
    const ctx = audioCtxRef.current;
    // Deferred to a microtask so this whole callback runs as an async
    // continuation rather than synchronously inside whatever triggered it
    // (mount effect or click handler) before setting any state.
    Promise.resolve().then(async () => {
      stopPlayback();
      setIsLoadingTrack(true);
      setStatusText("cargando pistas…");
      try {
        const [antesBuf, despuesBuf] = await Promise.all([
          fetch(pair.antes).then((r) => r.arrayBuffer()).then((buf) => ctx.decodeAudioData(buf)),
          fetch(pair.despues).then((r) => r.arrayBuffer()).then((buf) => ctx.decodeAudioData(buf)),
        ]);
        buffersRef.current.A = antesBuf;
        buffersRef.current.B = despuesBuf;
        setSelectedTrackId(trackId);
        setCurrent("A");
        currentRef.current = "A";
        durationRef.current = antesBuf.duration;
        setDuration(antesBuf.duration);
        setProgress(0);
        setCurrentTime(0);
        const track = AB_COMPARATOR_TRACKS.find((t) => t.id === trackId);
        setTrackMeta({
          name: track ? track.title : trackId,
          sub: `${formatTime(antesBuf.duration)}  ·  ${(antesBuf.sampleRate / 1000).toFixed(1)}kHz  ·  ${antesBuf.numberOfChannels}ch`,
        });
        const rA = rmsLevel(antesBuf);
        const rB = rmsLevel(despuesBuf);
        const dbA = 20 * Math.log10(Math.max(rA, 1e-10));
        const dbB = 20 * Math.log10(Math.max(rB, 1e-10));
        const diff = dbB - dbA;
        setLoudnessText(
          `RMS — original: ${dbA.toFixed(1)} dBFS  ·  master: ${dbB.toFixed(1)} dBFS  ·  ganancia: ${diff >= 0 ? "+" : ""}${diff.toFixed(1)} dB`
        );
        drawWaveform(antesBuf, "A");
        setStatusText("escuchando — original sin masterizar");
        setIsLoadingTrack(false);
      } catch {
        setStatusText("no se pudo cargar este track");
        setIsLoadingTrack(false);
      }
    });
  }, [selectedTrackId, stopPlayback, drawWaveform]);

  useEffect(() => {
    if (AB_COMPARATOR_TRACKS.length > 0) loadTrack(AB_COMPARATOR_TRACKS[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (gainNodeRef.current) gainNodeRef.current.gain.value = v;
  };

  const vuBarColor = (v) => {
    if (v > 0.85) return "#ff4444";
    if (v > 0.6) return "#d48212";
    if (v > 0.1) return "#148474";
    return "rgba(232,232,232,0.1)";
  };

  return (
    <section className="ab-comparator-section">
      <div className="ab-comparator-section__inner">
        <h2 className="section-title ab-comparator-section__title">{AB_COMPARATOR.title}</h2>
        <p className="ab-comparator-section__desc">{AB_COMPARATOR.description}</p>

        <div className="ab-root">
          <div className="ab-track-header">
            <div className="ab-track-title">
              <h2>{trackMeta.name}</h2>
              <p>{trackMeta.sub}</p>
            </div>
            <div className={`ab-mode-badge ${current === "A" ? "pre" : "post"}`}>
              {current === "A" ? "ORIGINAL" : "MASTER TEBURU"}
            </div>
          </div>

          <div className="ab-track-select">
            <label className="ab-track-select__label" htmlFor="ab-track-select-input">
              elige un track
            </label>
            <select
              id="ab-track-select-input"
              className="ab-track-select__input"
              value={selectedTrackId ?? ""}
              onChange={(e) => loadTrack(e.target.value)}
              disabled={isLoadingTrack}
            >
              {AB_COMPARATOR_TRACKS.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.title}
                </option>
              ))}
            </select>
          </div>

          <div className="ab-waveform-wrap">
            <div className="ab-waveform-label">
              {current === "A" ? "forma de onda — original" : "forma de onda — master teburu"}
            </div>
            <canvas ref={wfCanvasRef} style={{ width: "100%", height: 80, display: "block" }} />
            <div className="ab-progress-bar" style={{ left: `${progress}%` }} />
          </div>

          <div className="ab-vu-row">
            {vuLevels.map((v, i) => (
              <div key={i} className="ab-vu-bar" style={{ background: vuBarColor(v) }} />
            ))}
          </div>
          <div className="ab-loudness">{loudnessText}</div>

          <div className="ab-controls-row">
            <button
              className={`ab-play-btn ${isPlaying ? "playing" : ""}`}
              onClick={togglePlay}
              title="Play / Pause"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <div className="ab-seek-wrap">
              <div className="ab-seek-track" onClick={seek}>
                <div className="ab-seek-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="ab-time-row">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="ab-volume-row">
              <span style={{ color: "rgba(232,232,232,0.4)", fontSize: 16 }}>🔉</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </div>

          <div className="ab-toggle-section">
            <div className="ab-toggle-label">comparador a/b</div>
            <div
              className="ab-flip-toggle"
              onClick={handleFlipToggle}
              role="switch"
              aria-checked={current === "B"}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleFlipToggle(); } }}
            >
              <span className={`ab-flip-label-text ${current === "A" ? "is-original" : "is-master"}`}>
                {current === "A" ? "ORIGINAL" : "MASTER TEBURU"}
              </span>
              <div className={`ab-flip-pill ${current === "A" ? "state-original" : "state-master"}`}>
                {current === "A" ? "ORIGINAL" : "MASTER TEBURU"}
              </div>
            </div>
            <div className="ab-status-row">
              <div className={`ab-dot ${selectedTrackId ? "live" : ""}`} />
              <span>{statusText}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
