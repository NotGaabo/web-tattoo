import { appointmentService, tattooArtistService } from './api';

const TONES = [
  'from-[#d8b46a] via-[#8b6b35] to-[#1a1a1a]',
  'from-[#9f9f9f] via-[#5c5c5c] to-[#111111]',
  'from-[#e3c58b] via-[#7a6642] to-[#090909]',
  'from-[#b8b8b8] via-[#4f4f4f] to-[#121212]',
];

const STUDIO_PROFILE = {
  name: 'Skin Art Tattoo',
  handle: '@skinarttattooshop1',
  instagramUrl: 'https://www.instagram.com/skinarttattooshop1/',
  hours: 'L-D · 10:00am - 7:00pm',
  phone: '809-714-7813',
  accentLine: 'Negro profundo, plata editorial y dorado premium inspirado en feed tattoo.',
};

const FALLBACK_ARTISTS = [
  {
    id: 1,
    name: '@carlos.ink',
    legalName: 'Carlos Martinez',
    specialization: 'Realismo black and grey',
    years_of_experience: 12,
    biography: 'Retratos, sombreado suave y piezas de alto detalle para sesiones premium.',
    rating: 4.9,
    reviewCount: 145,
    total_completed_appointments: 230,
    location: 'Cabina Blackroom',
    skills: ['Realismo', 'Retrato', 'Black & Grey'],
    portfolio: [],
  },
  {
    id: 2,
    name: '@luna.ink',
    legalName: 'Luna Gonzalez',
    specialization: 'Fine line y minimal',
    years_of_experience: 8,
    biography: 'Lineas finas, micro tattoos y composiciones delicadas con acabado limpio.',
    rating: 4.8,
    reviewCount: 98,
    total_completed_appointments: 184,
    location: 'Private Room',
    skills: ['Fine Line', 'Minimal', 'Ornamental'],
    portfolio: [],
  },
  {
    id: 3,
    name: '@david.flash',
    legalName: 'David Silva',
    specialization: 'Traditional y neo traditional',
    years_of_experience: 10,
    biography: 'Flash curado, color controlado y tatuajes con lectura fuerte desde lejos.',
    rating: 4.7,
    reviewCount: 112,
    total_completed_appointments: 201,
    location: 'Main Floor',
    skills: ['Traditional', 'Color', 'Flash'],
    portfolio: [],
  },
  {
    id: 4,
    name: '@sofia.gold',
    legalName: 'Sofia Ruiz',
    specialization: 'Cover ups y piezas artisticas',
    years_of_experience: 9,
    biography: 'Cover ups pensados, composiciones fluidas y sesiones con enfoque editorial.',
    rating: 4.9,
    reviewCount: 156,
    total_completed_appointments: 244,
    location: 'Golden Booth',
    skills: ['Cover Up', 'Watercolor', 'Custom'],
    portfolio: [],
  },
];

function slugify(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeHandle(value = '') {
  const cleaned = value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/[/?#].*$/, '')
    .replace(/^@/, '')
    .trim();

  return cleaned ? `@${cleaned.toLowerCase()}` : '';
}

function extractHandle(value = '') {
  const match = value.match(/@\w[\w._-]*/);
  return match ? normalizeHandle(match[0]) : '';
}

function buildHandleFromName(name = '', index = 0) {
  const compact = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join('.');

  return normalizeHandle(compact || `artist.${index + 1}`);
}

export function handleToArtistName(handle = '') {
  const normalized = normalizeHandle(handle).replace(/^@/, '');

  if (!normalized) {
    return '';
  }

  const prepared = normalized
    .replace(/(ink|tattoo|tattoos|flash|art|studio|supply)$/i, ' $1')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return prepared
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function parseExperience(value) {
  const numeric = Number.parseInt(String(value || ''), 10);
  return Number.isFinite(numeric) ? numeric : 0;
}

function buildPortfolioPlaceholders(artist, index) {
  return Array.from({ length: 3 }, (_, offset) => ({
    id: `${artist.id}-fallback-${offset}`,
    title: `${artist.displayName} Session ${offset + 1}`,
    badge: artist.skills[offset] || artist.specialization,
    imageUrl: '',
    tone: TONES[(index + offset) % TONES.length],
  }));
}

function normalizePortfolio(portfolio, artist, index) {
  if (!Array.isArray(portfolio) || !portfolio.length) {
    return buildPortfolioPlaceholders(artist, index);
  }

  return portfolio.slice(0, 6).map((item, offset) => ({
    id: `${artist.id}-portfolio-${offset}`,
    title: `${artist.displayName} Piece ${offset + 1}`,
    badge: artist.skills[offset] || artist.specialization,
    imageUrl: typeof item === 'string' ? item : item?.imageUrl || item?.url || '',
    tone: TONES[(index + offset) % TONES.length],
  }));
}

function normalizeArtistRecord(record, index) {
  const extractedHandle = extractHandle(record.name || '');
  const handle = normalizeHandle(
    record.instagramHandle || record.instagram || extractedHandle || buildHandleFromName(record.legalName || record.name, index),
  );
  const hasHandleName = Boolean(extractedHandle);
  const displayName = hasHandleName ? handleToArtistName(handle) : record.name || handleToArtistName(handle);
  const experienceYears = parseExperience(record.years_of_experience || record.experience);
  const specialization = record.specialization || record.specialty || 'Custom tattoo';
  const skills = Array.isArray(record.skills) && record.skills.length
    ? record.skills
    : specialization.split(/,| y | and /i).map((skill) => skill.trim()).filter(Boolean);
  const biography = stripHtml(record.biography || record.description || '');
  const artist = {
    id: record.id || index + 1,
    displayName: displayName || record.legalName || 'Guest Artist',
    handle,
    legalName: record.legalName || (hasHandleName ? record.fullName || '' : record.name || ''),
    specialization,
    biography: biography || 'Custom sessions, detalle fino y direccion visual premium para cada pieza.',
    experienceYears,
    experienceLabel: experienceYears ? `${experienceYears} anos` : 'Agenda premium',
    rating: Number(record.rating || record.average_rating || 4.8),
    reviewCount: Number(record.reviewCount || record.total_reviews || 84),
    completedAppointments: Number(record.total_completed_appointments || 96),
    location: record.location || 'Studio Floor',
    skills: skills.slice(0, 4),
    socialUrl: handle ? `https://www.instagram.com/${handle.replace('@', '')}/` : STUDIO_PROFILE.instagramUrl,
    avatarUrl: record.avatarUrl || '/skin-art-symbol.svg',
    tone: TONES[index % TONES.length],
  };

  artist.portfolio = normalizePortfolio(record.portfolio, artist, index);
  return artist;
}

function buildGallery(artists) {
  const items = artists.flatMap((artist) =>
    artist.portfolio.slice(0, 3).map((piece, index) => ({
      id: `${artist.id}-gallery-${index}`,
      artistId: artist.id,
      artistName: artist.displayName,
      artistHandle: artist.handle,
      style: piece.badge,
      title: piece.title,
      imageUrl: piece.imageUrl,
      tone: piece.tone,
    })),
  );

  return items.slice(0, 9);
}

function buildHighlights(artists) {
  const counts = new Map();

  artists.forEach((artist) => {
    artist.skills.forEach((skill) => {
      counts.set(skill, (counts.get(skill) || 0) + 1);
    });
  });

  const highlights = Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 5)
    .map(([label, total], index) => ({
      id: slugify(label),
      label,
      caption: `${total} artistas lo trabajan`,
      tone: TONES[index % TONES.length],
    }));

  if (highlights.length >= 5) {
    return highlights;
  }

  return [
    ...highlights,
    {
      id: 'consultas',
      label: 'Consultas',
      caption: 'Idea, referencia y tamano',
      tone: TONES[1],
    },
    {
      id: 'aftercare',
      label: 'Aftercare',
      caption: 'Cuidado posterior premium',
      tone: TONES[2],
    },
  ].slice(0, 5);
}

function formatSlot(value) {
  if (!value) {
    return '';
  }

  const parsed = new Date(String(value).replace(' ', 'T'));

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildAppointmentSlots(artists, availabilityMap = new Map()) {
  return artists.slice(0, 4).map((artist, index) => {
    const slots = availabilityMap.get(artist.id) || [];
    const firstSlot = Array.isArray(slots) ? slots[0] : '';
    const nextSlot = typeof firstSlot === 'string'
      ? formatSlot(firstSlot)
      : formatSlot(firstSlot?.start || firstSlot?.datetime || firstSlot?.appointment_datetime);

    return {
      id: `slot-${artist.id}`,
      artistId: artist.id,
      artistName: artist.displayName,
      artistHandle: artist.handle,
      artistSpecialization: artist.specialization,
      responseTime: index % 2 === 0 ? 'Respuesta en 24h' : 'Confirmacion por DM',
      nextSlot: nextSlot || ['Hoy · 6:30 PM', 'Manana · 11:00 AM', 'Viernes · 4:00 PM', 'Sabado · 1:30 PM'][index],
      deposit: ['30% reserva', 'Consulta previa incluida', 'Agenda flexible', 'Flash priority'][index],
    };
  });
}

function buildFallbackData() {
  const artists = FALLBACK_ARTISTS.map((artist, index) => normalizeArtistRecord(artist, index));
  return {
    studio: STUDIO_PROFILE,
    artists,
    gallery: buildGallery(artists),
    highlights: buildHighlights(artists),
    appointmentSlots: buildAppointmentSlots(artists),
    lastSync: new Date().toISOString(),
    source: 'fallback',
  };
}

async function fetchArtistsFromApi() {
  const artists = await tattooArtistService.getAll();

  if (!Array.isArray(artists) || !artists.length) {
    return [];
  }

  const profiles = await Promise.all(
    artists.map(async (artist) => {
      if (!artist?.id) {
        return artist;
      }

      try {
        const profile = await tattooArtistService.getProfile(artist.id);
        return { ...artist, ...profile };
      } catch (error) {
        return artist;
      }
    }),
  );

  return profiles.map((artist, index) => normalizeArtistRecord(artist, index));
}

async function fetchAvailability(artists) {
  const entries = await Promise.all(
    artists.map(async (artist) => {
      try {
        const slots = await appointmentService.getAvailable(artist.id);
        return [artist.id, slots];
      } catch (error) {
        return [artist.id, []];
      }
    }),
  );

  return new Map(entries);
}

export async function loadStudioMcpData() {
  const fallback = buildFallbackData();

  try {
    const artists = await fetchArtistsFromApi();

    if (!artists.length) {
      return fallback;
    }

    const availabilityMap = await fetchAvailability(artists);

    return {
      studio: STUDIO_PROFILE,
      artists,
      gallery: buildGallery(artists),
      highlights: buildHighlights(artists),
      appointmentSlots: buildAppointmentSlots(artists, availabilityMap),
      lastSync: new Date().toISOString(),
      source: 'live',
    };
  } catch (error) {
    return {
      ...fallback,
      error: error instanceof Error ? error.message : 'No se pudo sincronizar el studio feed.',
    };
  }
}

export function getFallbackStudioMcpData() {
  return buildFallbackData();
}
