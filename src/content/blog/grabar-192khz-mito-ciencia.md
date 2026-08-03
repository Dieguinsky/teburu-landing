---
title: "¿Grabar a 192kHz suena mejor? Lo que dice la ciencia (y por qué en Teburu no seguimos esa moda)"
description: "Repasamos la evidencia técnica y los papers de audio detrás del mito de que más sample rate y más bit depth siempre significan mejor sonido."
date: "2026-07-23"
author: "Diego Novoa"
---

Es común escuchar que grabar a 192kHz o 24 bits es sinónimo de "calidad de estudio real", y que cualquier cosa por debajo de eso es conformarse. El marketing de interfaces y conversores ha empujado esa idea por años. El problema es que la evidencia técnica no la respalda del todo.

## Lo que dice la ciencia del muestreo

El teorema de muestreo de Nyquist-Shannon establece que para reproducir fielmente una señal de audio hasta 20kHz (el límite superior de la audición humana), alcanza con una frecuencia de muestreo de 40kHz. El estándar de 44.1kHz ya incluye margen sobre ese límite; 48kHz (el estándar de video/broadcast) también.

Monty Montgomery, ingeniero de Xiph.org (la organización detrás de códecs abiertos como Vorbis y Opus), publicó un análisis técnico extenso al respecto —["24/192 Music Downloads are Very Silly Indeed"](https://people.xiph.org/~xiphmont/demo/neil-young.html)— donde demuestra con medición y no con opinión que grabar o distribuir a 192kHz no aporta fidelidad audible adicional para un oyente humano, y que en algunos escenarios de conversión puede introducir más ruido de intermodulación ultrasónico, no menos.

## Entonces, ¿por qué existe la moda?

Porque 192kHz "se ve" mejor en una hoja de specs, igual que los megapíxeles en una cámara. Vender un número más alto es más fácil que explicar psicoacústica. Y porque hay usos legítimos y distintos al de "fidelidad": sample rates altos sí tienen sentido en producción para pitch-shifting extremo, time-stretching agresivo o ciertos procesos de diseño de sonido — no para que la mezcla final suene "más pura".

## Lo que sí importa más que el número

- La calidad de la conversión A/D en el momento de la captura (el conversor, no el número de la ficha técnica).
- El micrófono y su posicionamiento respecto a la fuente.
- El manejo de ruido de piso y de la sala.
- El criterio de quien graba, más que el archivo resultante.

## El contraargumento: "mejor grabar en la frecuencia más alta posible, por si acaso"

Es un argumento de "future-proofing": si el almacenamiento es barato, ¿por qué no grabar siempre al máximo posible, para no tener que lamentarlo después? Tiene sentido en apariencia, pero ignora dos costos reales. El primero es de cómputo: procesar plugins (sobre todo los que emulan comportamiento no lineal, como saturación o compresión análoga) a 192kHz exige varias veces más potencia de procesamiento que a 48kHz, lo que se traduce en menos plugins simultáneos o más latencia durante la sesión misma —un costo que sí se siente en el momento, a cambio de una fidelidad que, como muestra la medición de Xiph.org, no es audible. El segundo es de flujo de trabajo: archivos más pesados, sesiones más lentas de cargar, más espacio de respaldo, sin ningún beneficio sonoro que lo compense en el 99% de los casos de uso.

Grabar más alto "por si acaso" no es gratis — tiene un costo real en la sesión de hoy a cambio de un beneficio hipotético que la evidencia técnica no respalda.

## Cómo trabajamos esto en Teburu

En nuestra sala grabamos con una interfaz Universal Audio Apollo x4 Gen 2 a las frecuencias de muestreo estándar de la industria (44.1kHz/48kHz a 24 bits), que es lo que efectivamente se usa en el 99% de los lanzamientos comerciales, streaming incluido. Preferimos invertir el tiempo de sesión en microfonía, posicionamiento y interpretación — las variables que sí determinan cómo suena una grabación — antes que en un número de specs que no vas a poder escuchar. Puedes revisar el resto de nuestro equipamiento en [Nuestro Estudio](/estudio) o ver nuestros [Servicios](/servicios) para agendar tu próxima sesión.
