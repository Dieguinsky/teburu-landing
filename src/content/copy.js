export const BRAND = 'Estudio Teburu'

export const BRAND_SHORT = 'Teburu'

export const HERO_TAGLINE = 'Dale vida a tu idea'

export const BRAND_SHORT_JP = 'テブル'

export const HERO_TAGLINE_JP = 'あなたのアイデアに命を吹き込む'

export const NAV_ITEMS_ES = [
  { to: '/', label: 'Home', end: true },
  { to: '/servicios', label: 'Servicios' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/estudio', label: 'Estudio' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/reservar', label: 'Reservar' },
  { to: '/portafolio', label: 'Portafolio' },
  { to: '/faq', label: 'FAQ' },
]

export const NAV_ITEMS_JP = [
  { to: '/', label: 'ホーム', end: true },
  { to: '/servicios', label: 'サービス' },
  { to: '/nosotros', label: 'について' },
  { to: '/estudio', label: 'スタジオ' },
  { to: '/contacto', label: 'お問い合わせ' },
  { to: '/reservar', label: '予約' },
  { to: '/portafolio', label: 'ポートフォリオ' },
  { to: '/faq', label: 'よくある質問' },
]

export const SERVICES = [
  {
    title: 'Música',
    text: 'Grabación, producción, mezcla y masterización en una sala tratada acústicamente, con preamps Apollo y microfonía profesional. Desde una sesión express hasta un álbum completo.',
    anchor: 'musica',
  },
  {
    title: 'Podcast',
    text: 'Grabación de podcast en el estudio o a domicilio, con acústica tratada, edición y postproducción lista para streaming, más clips para redes sociales.',
    anchor: 'podcast',
  },
  {
    title: 'Audiovisual',
    text: 'Cobertura de eventos, contenido para redes sociales y registro multicámara de sesiones en vivo, con edición y entrega lista para publicar.',
    anchor: 'audiovisual',
  },
]

export const HOME_INTRO = {
  title: 'Tu música, en buenas manos',
  textBefore: 'En',
  textAfter:
    'grabamos, producimos y mezclamos con el mismo cuidado que le pondríamos a nuestra propia música: equipamiento profesional, criterio técnico y un espacio pensado para que la creatividad fluya sin interrupciones.',
  welcome: '¿Listo/a para grabar tu próximo proyecto?',
  cta: 'Conoce el equipo',
}

export const HOME_WELCOME = {
  titleBefore: 'Bienvenido a',
  features: [
    {
      icon: '◉',
      title: 'Equipamiento profesional',
      text: 'Preamps Apollo, microfonía de estudio y monitoreo de referencia para que cada grabación suene lista para el siguiente paso.',
    },
    {
      icon: '★',
      title: 'Equipo con oficio',
      text: 'Productores, ingenieros y artistas con trayectoria en la escena musical chilena, involucrados en cada etapa del proceso.',
    },
    {
      icon: '◎',
      title: 'Ambiente sin apuro',
      text: 'Sesiones pensadas para que te concentres en la música, con la flexibilidad de horario que necesita cada proyecto.',
    },
  ],
}

export const HOME_STUDIO = {
  title: 'Conoce el estudio',
  text: 'Una sala acústicamente tratada, equipamiento profesional y un ambiente pensado para que la sesión fluya de principio a fin.',
  cta: 'Ver el estudio',
}

export const HOME_AGENDA = {
  eyebrow: 'Reservas',
  title: 'Reservar el estudio es muy sencillo',
  text: 'Elige el servicio, la fecha y el horario que más te acomode directamente desde nuestra agenda. Si tienes dudas, también puedes escribirnos.',
  cta: 'Reservar ahora',
}

export const HOME_REEL = {
  title: 'Lo último en Instagram',
  text: 'Así se vive una sesión en Teburu. Síguenos para más contenido.',
  cta: 'Síguenos en Instagram',
  url: 'https://www.instagram.com/reel/DXpw2qxkfxB/',
}

export const HOME_LOCATION = {
  title: 'Encuéntranos',
  text: 'Visítanos en pleno centro de Santiago. Si tienes dudas antes de venir, escríbenos por WhatsApp o Instagram.',
  address: "Av. Libertador Bernardo O'Higgins 351, Santiago",
  cta: 'Cómo llegar',
}

export const SERVICIOS_INTRO = {
  title: 'Fuente de creatividad a tu disposición',
  paragraphs: [
    `En ${BRAND} combinamos equipamiento de alto nivel con un ambiente pensado para la creatividad. Trabajamos proyectos de todos los géneros con la misma dedicación, ya sea una sesión express o una producción de largo aliento.`,
    'Desde la grabación hasta el mastering, te acompañamos en cada etapa con criterio técnico y sensibilidad artística. Conocemos el panorama musical chileno y sabemos lo que se necesita para que tu música suene profesional.',
  ],
}

export const STUDIO_SERVICES = [
  {
    id: 'hora-estudio',
    title: 'Sesión de estudio (3 horas)',
    description:
      'Reserva el estudio por 3 horas con acceso a sala de grabación, preamps Apollo y monitoreo profesional, más acompañamiento de un ingeniero en sesión. Ideal para vocales, overdubs o sesiones puntuales que no requieren una jornada completa.',
    imageKey: 'horaEstudio',
  },
  {
    id: 'media-jornada',
    title: 'Doble Jornada (6 horas)',
    description:
      'Bloque de 6 horas para desarrollar tu proyecto con calma: grabación de banda completa, preproducción o sesiones intensivas con acompañamiento técnico durante toda la jornada.',
    imageKey: 'mediaJornada',
  },
  {
    id: 'jornada-completa',
    title: 'Triple Jornada (9 horas)',
    description:
      'Día completo en el estudio para álbumes, EPs o producciones ambiciosas que requieren varias tomas, instrumentos o invitados. Máximo enfoque creativo sin interrupciones ni cortes de sesión.',
    imageKey: 'jornadaCompleta',
  },
  {
    id: 'produccion',
    title: 'Producción Musical',
    description:
      'Acompañamiento creativo y técnico desde la idea hasta la premezcla: arreglos, dirección artística, elección de sonidos y captura de cada toma junto a un productor con trayectoria en la escena musical chilena.',
    imageKey: 'produccion',
  },
  {
    id: 'mezcla',
    title: 'Mezcla',
    description:
      'Balance, espacialidad y color sonoro para que cada elemento de tu música tenga su lugar en el mix, con hasta dos rondas de ajustes según tus referencias y el estilo del tema.',
    imageKey: 'mezcla',
  },
  {
    id: 'mastering',
    title: 'Masterización',
    description:
      'Pulido final para streaming o CD: loudness, ecualización y cohesión entre pistas, entregado en los formatos que necesites para distribuir tu música.',
    imageKey: 'mastering',
  },
]

export const PODCAST_SERVICES = [
  {
    id: 'podcast-estudio',
    title: 'Podcast en el estudio',
    description:
      'Grabación de tu podcast en nuestra sala tratada acústicamente, con microfonía profesional, cámaras multiplano e iluminación lista para video podcast. Incluye edición y entrega en audio y/o video para tus plataformas.',
    imageKey: 'podcastAudio',
  },
  {
    id: 'podcast-domicilio',
    title: 'Podcast a domicilio',
    description:
      'Llevamos equipo de audio y video a tu locación para grabar el podcast donde te acomode: oficina, evento o set propio. Mismo estándar de calidad de audio e imagen que en el estudio, con postproducción incluida.',
    imageKey: 'podcastVideo',
  },
  {
    id: 'podcast-clips',
    title: 'Clips',
    description:
      'Edición de tu episodio en clips cortos y piezas verticales optimizadas para Instagram, TikTok y YouTube Shorts, pensados para darle más alcance a cada capítulo.',
    imageKey: 'podcastReels',
  },
  {
    id: 'podcast-streaming',
    title: 'Streaming',
    description:
      'Transmisión en vivo de tu podcast o sesión en YouTube, Twitch o Instagram, con switching multicámara, audio en tiempo real y acompañamiento técnico durante la transmisión.',
    imageKey: 'podcastStreaming',
  },
]

export const SERVICIOS_MUSICA_CTAS = [
  { label: 'Agenda tu hora', to: '/reservar' },
  { label: 'Cotiza tu proyecto', to: '/contacto' },
]

export const SERVICIOS_PODCAST_CTAS = [{ label: 'Cotiza tu podcast', to: '/cotizador' }]

export const AUDIOVISUAL_SERVICES = [
  {
    id: 'cobertura-eventos',
    title: 'Cobertura de eventos',
    description:
      'Registro multicámara de lanzamientos, showcases y eventos en vivo, con edición posterior y entrega de piezas listas para redes o archivo del evento.',
    imageKey: 'coberturaEventos',
  },
  {
    id: 'redes-sociales',
    title: 'Redes sociales',
    description:
      'Producción de contenido audiovisual pensado para tus redes: fotografía, video y clips editados a la medida de cada plataforma para fortalecer tu presencia digital.',
    imageKey: 'redesSociales',
  },
  {
    id: 'sesiones-vivo',
    title: 'Sesiones en vivo',
    description:
      'Grabación en vivo de sesiones musicales con captura multicámara y audio en alta calidad, ideal para videoclips en formato sesión o contenido de lanzamiento.',
    imageKey: 'sesionesVivo',
  },
]

export const SERVICIOS_AUDIOVISUAL_CTAS = [
  { label: 'Cotiza tu producción audiovisual', to: '/contacto' },
]

export const ESTUDIO_INTRO = {
  title: 'Un espacio pensado para grabar sin fricciones',
  paragraphs: [
    'La sala de grabación de Teburu combina acústica tratada, equipamiento profesional y un ambiente relajado para que la sesión fluya. Cada rincón está pensado para que te concentres en tocar, cantar o producir — nosotros nos encargamos del resto.',
    'Trabajamos con una selección de equipamiento pensada para cubrir cualquier fuente, desde vocales y guitarras hasta batería completa, teclados y sesiones de podcast.',
  ],
}

export const ESTUDIO_GEAR = [
  {
    category: 'Microfonía',
    items: [
      'Warm Audio WA-8000 (válvula)',
      '4 clones de Shure SM7B, ensamblados a mano en el estudio',
      'Rode NT1-A modificado con cápsula RK-47',
      'Behringer C112 (dinámico para bombo)',
      'Par calibrado de condensador cardioide de diafragma pequeño',
      'Microfonía dinámica y de condensador adicional para coros, vientos y necesidades puntuales de cada sesión',
    ],
  },
  {
    category: 'Interfaz y preamplificación',
    items: ['Universal Audio Apollo x4 Gen 2', 'Behringer ADA8200 V2 Ultragain Pro-8 Digital'],
  },
  {
    category: 'Monitoreo',
    items: [
      'Focal Twin6 Be',
      'Yamaha HS5',
      'Avantone Mix Cube (tercera referencia)',
      'Audio-Technica ATH-M40x',
      '2× Audio-Technica ATH-M50x',
      'Behringer Powerplay HA8000 V2 (distribución de audífonos)',
    ],
  },
  {
    category: 'Cómputo y software',
    items: [
      'Mac Mini M1 (16GB / 1TB)',
      'Ableton Live Suite 12',
      'Suites de plugins UAD, Waves e iZotope, entre otras, para un resultado a nivel de la industria',
    ],
  },
  {
    category: 'Teclados e instrumentos',
    items: ['Nektar GXP88', 'Órgano Yamaha Electone A-55'],
  },
  {
    category: 'Infraestructura',
    items: [
      'Furman M-10x E (acondicionador de energía)',
      'Cableado armado a mano en el mismo estudio, con control de calidad propio en cada conexión',
    ],
  },
]

export const ESTUDIO_VIDEO_GEAR = {
  title: 'Cámara y video',
  text: 'Producción audiovisual multicámara para sesiones en vivo, video podcast y contenido para redes.',
  items: [
    '3 cámaras Sony (configuración multicámara predeterminada)',
    'Set de lentes Sony',
    'Difusores de luz',
    'Foco de 200W con softbox',
  ],
}

export const AB_COMPARATOR = {
  title: 'Escucha la diferencia',
  description: 'Compara el antes y el después de una masterización real hecha en Teburu.',
}

export const AB_COMPARATOR_TRACKS = [
  { id: 'demo', title: 'Track de muestra' },
  { id: 'triangulo', title: 'Onda triangular (prueba)' },
]

export const NOSOTROS_INTRO = {
  paragraphs: [
    `En ${BRAND} somos un estudio de grabación ubicado en Chile, conformado por productores, ingenieros y artistas con trayectoria en la industria musical nacional.`,
    'Nuestro equipo combina formación académica, experiencia en producción y sensibilidad artística para acompañar cada proyecto con dedicación y criterio técnico.',
  ],
}

export const TEAM_MEMBERS = [
  {
    id: 'diego',
    name: 'Diego Novoa',
    alias: 'Panda',
    role: 'Fundador · Ingeniero de sonido · Productor musical',
    bio: 'Licenciado en Teoría Musical y Literatura UC. Fundador de Estudio Teburu.',
    imageKey: 'diego',
  },
  {
    id: 'jose',
    name: 'José Tomás Musalem',
    role: 'Editor de video · Fotógrafo · RR.SS.',
    bio: 'Periodista de la Universidad de Chile. Encargado de contenido audiovisual y redes sociales.',
    imageKey: 'jose',
  },
  {
    id: 'pablo',
    name: 'Pablo Silva',
    alias: 'Quevdor',
    role: 'Compositor · Letrista · Artista',
    bio: 'Artista fundador del estudio. Compositor y letrista con proyectos propios y colaboraciones.',
    imageKey: 'pablo',
  },
]

export const NOSOTROS_JOIN = {
  title: '¿Te gustaría formar parte del equipo de Teburu?',
  subtitle: 'Siempre estamos buscando gente en:',
  roles: ['Edición de video', 'Producción musical', 'Ingeniería en audio'],
}

export const CONTACT_INFO = {
  title: 'Contacto',
  subtitle: '¡Te esperamos para hacer música juntos!',
  description:
    'Completa el formulario y te responderemos a la brevedad con cotización y disponibilidad para tu proyecto.',
  email: 'estudio.teburu@gmail.com',
  socialLabel: '¡Búscanos en redes sociales!',
  instagram: 'https://www.instagram.com/estudio.teburu/',
  whatsapp: '+56 9 6899 8905',
}

export const BOOKING_STEPS = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'extras', label: 'Extras del servicio' },
  { id: 'agenda', label: 'Fecha y hora' },
  { id: 'pago', label: 'Pago' },
]

// Horario de citas de Google (Appointment Schedule). Es quien realmente agenda
// y ordena el Google Calendar del estudio: calcula bloques y días hábiles según
// la configuración real y captura nombre, correo e invitados en su formulario.
// Formato embebible: URL pública (sin /u/0) + `?gv=true`.
export const BOOKING_CALENDAR_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1T3tzfPRW9sbv5I4UViCZUT0hICIZBpqnSloKVb_TMOkV2GY4H-EFDysm9JsU0nzFKQefBc6Nu?gv=true'

// Datos para el pago por transferencia electrónica.
export const BOOKING_TRANSFER = {
  holder: 'Estudio Teburu SpA',
  rut: '78.211.002-0',
  bank: 'Banco BCI',
  accountType: 'Cuenta corriente',
  accountNumber: '80969782',
  email: 'estudio.teburu@gmail.com',
}

export const BOOKING_SERVICES = [
  {
    id: 'grabacion-express-1h',
    title: 'Grabación express (1 hora)',
    duration: '1h',
    description: 'Alquiler del estudio durante 1h. Ideal para sesiones puntuales y tomas rápidas.',
    price: 50000,
  },
  {
    id: 'sesion-3h',
    title: 'Sesión de estudio (3 horas)',
    duration: '3h',
    description: 'Alquiler del estudio durante 3h. Incluye asistencia en sesión presencial.',
    price: 120000,
  },
  {
    id: 'sesion-6h',
    title: 'Doble Jornada (6 horas)',
    duration: '6h',
    description: 'Bloque doble para grabación o preproducción con acompañamiento técnico.',
    price: 220000,
  },
  {
    id: 'sesion-9h',
    title: 'Triple Jornada (9 horas)',
    duration: '9h',
    description: 'Día completo en el estudio para álbumes, EPs o producciones ambiciosas.',
    price: 300000,
  },
]

export const BOOKING_EXTRAS = [
  { id: 'master', label: 'Master', price: 80000 },
  { id: 'mezcla', label: 'Mezcla', price: 150000 },
  { id: 'mezcla-master', label: 'Mezcla + Master', price: 200000 },
]

export const ARTISTS_SECTION = {
  title: 'Artistas y lanzamientos',
  text: 'Parte de la música producida, grabada y masterizada en Teburu: proyectos de artistas independientes listos para streaming.',
  cta: 'Ver portafolio',
}

export const PORTAFOLIO_MUSIC = {
  title: 'Música',
  description: 'Selección de trabajos producidos, mezclados y masterizados en Teburu.',
  spotifyPlaylistUrl: 'https://open.spotify.com/embed/playlist/16XW9VJAH5TfqlA0N89ric?utm_source=generator',
}

export const PORTAFOLIO_AUDIOVISUAL = {
  title: 'Audiovisual',
  description: 'Producciones de podcast, video podcast y contenido para redes sociales.',
  items: [
    {
      id: 'av-podcast',
      title: 'Sesiones en Vivo',
      text: 'Grabación en vivo de sesiones musicales con captura multicámara y audio en alta calidad.',
      imageKey: 'podcast',
    },
    {
      id: 'av-video',
      title: 'Video Podcast',
      text: 'Grabación multicámara con postproducción completa para YouTube y plataformas.',
      imageKey: 'videoPodcast',
    },
    {
      id: 'av-reels',
      title: 'Reels & Shorts',
      text: 'Clips verticales y piezas cortas optimizadas para Instagram, TikTok y YouTube Shorts.',
      imageKey: 'reels',
    },
  ],
}

export const FAQ_INFO = {
  title: 'Preguntas Frecuentes',
  subtitle: 'Resolvemos las dudas más comunes sobre grabar música, podcast y contenido audiovisual en Teburu.',
}

export const FAQ_ITEMS = [
  {
    id: 'cuanto-cuesta-grabar',
    question: '¿Cuánto cuesta grabar en un estudio de grabación en Santiago?',
    answer:
      `En ${BRAND} los valores parten desde $50.000 + IVA por una Grabación Express de 1 hora, hasta $300.000 + IVA por una Triple Jornada de 9 horas para producciones más grandes. La mezcla y la masterización se cotizan por separado. Puedes ver el detalle completo de precios y reservar directamente en nuestra página de Reservar.`,
  },
  {
    id: 'que-incluye-sesion',
    question: '¿Qué incluye una sesión de estudio en Teburu?',
    answer:
      'Cada bloque de estudio incluye acceso a la sala de grabación tratada acústicamente, preamps Apollo, microfonía profesional y monitoreo de referencia, además de acompañamiento de un ingeniero en sesión. No necesitas traer equipo propio salvo tu instrumento personal si tienes uno específico.',
  },
  {
    id: 'principiante',
    question: '¿Puedo grabar si es mi primera vez o no tengo experiencia en estudio?',
    answer:
      'Sí. Muchos de nuestros proyectos son de artistas que graban por primera vez. Nuestro equipo de productores e ingenieros te acompaña durante toda la sesión para que el proceso sea claro y sin apuro, independiente de tu nivel de experiencia.',
  },
  {
    id: 'cuanto-cuesta-podcast',
    question: '¿Cuánto cuesta grabar un podcast?',
    answer:
      'El valor depende del formato: podcast en el estudio, a domicilio, clips para redes o streaming en vivo. Cada uno tiene un alcance distinto, así que te recomendamos escribirnos con el detalle de tu proyecto (frecuencia, duración, formato de entrega) para enviarte una cotización a la medida a través de nuestro cotizador de podcast.',
  },
  {
    id: 'podcast-domicilio',
    question: '¿Graban podcast a domicilio o solo en el estudio?',
    answer:
      'Ambas opciones están disponibles. Podemos grabar tu podcast en nuestra sala tratada acústicamente en Santiago, o llevar el equipo de audio y video a tu locación (oficina, evento o set propio) manteniendo el mismo estándar de calidad.',
  },
  {
    id: 'mezcla-master-incluido',
    question: '¿La mezcla y la masterización están incluidas en el precio de la sesión?',
    answer:
      'No, se cotizan como servicios adicionales independientes del alquiler del estudio. Esto te permite grabar en Teburu y decidir después si quieres que mezclemos y masterericemos tu proyecto nosotros, o llevarte tus archivos para trabajarlos en otro lugar.',
  },
  {
    id: 'donde-estan-ubicados',
    question: '¿Dónde está ubicado el estudio?',
    answer: `${BRAND} está ubicado en ${HOME_LOCATION.address}, en pleno centro de Santiago.`,
  },
  {
    id: 'como-reservo',
    question: '¿Cómo reservo una hora de estudio?',
    answer:
      'Puedes reservar directamente desde nuestra página de Reservar, eligiendo el servicio, la fecha y el horario disponible en nuestra agenda. Si tienes dudas antes de reservar, también puedes escribirnos por correo o WhatsApp.',
  },
  {
    id: 'servicios-audiovisuales',
    question: '¿Qué servicios audiovisuales ofrecen además de audio?',
    answer:
      'Ofrecemos cobertura de eventos, producción de contenido para redes sociales y grabación multicámara de sesiones en vivo, con edición y entrega lista para publicar. Puedes ver el detalle en la sección Audiovisual de nuestra página de Servicios.',
  },
  {
    id: 'proyecto-fuera-de-lista',
    question: 'Mi proyecto no calza exactamente con los servicios listados, ¿igual pueden ayudarme?',
    answer:
      'Sí. Trabajamos proyectos de todos los géneros y formatos, desde una sesión express hasta una producción de largo aliento. Escríbenos por el formulario de contacto contándonos de qué se trata tu proyecto y te responderemos con una propuesta a la medida.',
  },
]

export const COTIZADOR_INFO = {
  title: 'Cotizador',
  subtitle: 'Cotiza tu podcast',
  description:
    'Estamos terminando de armar el cotizador online para que puedas simular el valor de tu producción de podcast. Mientras tanto, escríbenos y te enviamos una cotización a la medida.',
}
