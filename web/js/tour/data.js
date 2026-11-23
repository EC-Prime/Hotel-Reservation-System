/**
 * Royal Haven 3D Tour — hotel layout, room mapping and content.
 * Conceptual visualisation. Architectural dimensions are plausible, not surveyed.
 */

export const FLOOR_H = 3.7;
export const ROOM_H = 3.32;
export const SLAB = 0.28;

export const LEVELS = [
  { index: 1, y: 0, name: 'Lobby & Garden', short: 'Lobby' },
  { index: 2, y: 3.7, name: 'Second Floor', short: 'Level 2' },
  { index: 3, y: 7.4, name: 'Third Floor', short: 'Level 3' }
];

export const BUILDING = { x0: -30, x1: 30, z0: -18, z1: 6 };
export const WING = { x0: -32, x1: -10, z0: 6, z1: 21 };
export const SPA = { x0: 18, x1: 30, z0: 6, z1: 18 };
export const POOL = { x0: -7, x1: 14, z0: 8, z1: 15 };
export const LOBBY_VOID = { x0: -7, x1: 7, z0: -17, z1: -6 };
export const CORE = { x0: 0, x1: 6.6, z0: -6, z1: -1.6 };

export const PALETTES = [
  {
    key: 'garden',
    name: 'Garden Sand',
    wall: '#d8cfbf',
    wallDeep: '#c4b8a4',
    accent: '#6e7450',
    accentSoft: '#a5a887',
    textile: '#a45f42',
    textileSoft: '#c98c6b',
    wood: '#7b5b3f',
    woodDark: '#4e3a29',
    stone: '#d8cfc0',
    metal: '#b08b4f',
    runner: '#8d4f38',
    rug: '#c7b28f',
    curtain: '#d9d2c3',
    art: ['#a45f42', '#6e7450', '#d8cfbf', '#c9a35e']
  },
  {
    key: 'atrium',
    name: 'Atrium Sage',
    wall: '#d7d3c8',
    wallDeep: '#bcb5a6',
    accent: '#7c8872',
    accentSoft: '#abb39a',
    textile: '#7c6757',
    textileSoft: '#b49b87',
    wood: '#6b4e38',
    woodDark: '#433025',
    stone: '#cfc8bb',
    metal: '#a88a53',
    runner: '#5f6b58',
    rug: '#b7ab90',
    curtain: '#c9c4b7',
    art: ['#7c8872', '#7c6757', '#d7d3c8', '#b08b4f']
  },
  {
    key: 'ocean',
    name: 'Ocean Bronze',
    wall: '#d7d3ca',
    wallDeep: '#b9b3a7',
    accent: '#355c5c',
    accentSoft: '#7b9a95',
    textile: '#a9835b',
    textileSoft: '#c8a985',
    wood: '#5b4435',
    woodDark: '#382a21',
    stone: '#d4cec2',
    metal: '#b3925a',
    runner: '#2f5151',
    rug: '#c0b397',
    curtain: '#d3cec3',
    art: ['#355c5c', '#a9835b', '#d7d3ca', '#7b9a95']
  }
];

/* --------------------------------------------------------------------------
   Guest room bays
   Every room is built with its window on local +Z and door on local -Z.
   rot = Math.PI flips the room so the door faces the south corridor (garden
   wing north rooms) while the window faces the pool.
   -------------------------------------------------------------------------- */
export const ROOM_LAYOUT = [
  // Garden wing — ground floor, 101–106
  { number: '101', floor: 1, type: 'single', x0: -32, x1: -25, z0: 6, z1: 11.8, rot: Math.PI, palette: 0, view: 'Pool Courtyard', wing: 'garden' },
  { number: '102', floor: 1, type: 'single', x0: -25, x1: -18, z0: 6, z1: 11.8, rot: Math.PI, palette: 0, view: 'Pool Courtyard', wing: 'garden' },
  { number: '103', floor: 1, type: 'single', x0: -18, x1: -11, z0: 6, z1: 11.8, rot: Math.PI, palette: 0, view: 'Pool Courtyard', wing: 'garden' },
  { number: '104', floor: 1, type: 'deluxe', x0: -32, x1: -25, z0: 14.6, z1: 21, rot: 0, palette: 0, view: 'Garden & Coast', wing: 'garden' },
  { number: '105', floor: 1, type: 'deluxe', x0: -25, x1: -18, z0: 14.6, z1: 21, rot: 0, palette: 0, view: 'Private Garden', wing: 'garden' },
  { number: '106', floor: 1, type: 'deluxe', x0: -18, x1: -11, z0: 14.6, z1: 21, rot: 0, palette: 0, view: 'Garden & Coast', wing: 'garden' },

  // Second floor — 201–206
  { number: '201', floor: 2, type: 'deluxe', x0: -30, x1: -21, z0: -1, z1: 6, rot: 0, palette: 1, view: 'Ocean Balcony', wing: 'south' },
  { number: '202', floor: 2, type: 'deluxe', x0: -21, x1: -12, z0: -1, z1: 6, rot: 0, palette: 1, view: 'Ocean Balcony', wing: 'south' },
  { number: '203', floor: 2, type: 'terrace', x0: -12, x1: 1, z0: -1, z1: 6, rot: 0, palette: 1, view: 'Private Terrace & Ocean', wing: 'south' },
  { number: '204', floor: 2, type: 'junior', x0: 1, x1: 11, z0: -1, z1: 6, rot: 0, palette: 1, view: 'Corner Ocean Panorama', wing: 'south' },
  { number: '205', floor: 2, type: 'single', x0: 11, x1: 16.5, z0: -1, z1: 6, rot: 0, palette: 1, view: 'Courtyard & Side Sea', wing: 'south' },
  { number: '206', floor: 2, type: 'single', x0: 16.5, x1: 22, z0: -1, z1: 6, rot: 0, palette: 1, view: 'Courtyard & Side Sea', wing: 'south' },

  // Third floor — 301–308
  { number: '301', floor: 3, type: 'deluxe', x0: -30, x1: -24, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Ocean Horizon', wing: 'south' },
  { number: '302', floor: 3, type: 'deluxe', x0: -24, x1: -18, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Quiet Harbour', wing: 'south' },
  { number: '303', floor: 3, type: 'penthouse', x0: -18, x1: -7, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Skyline, Bay & Terrace', wing: 'south' },
  { number: '304', floor: 3, type: 'penthouse', x0: -7, x1: 4, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Sunset Coastline', wing: 'south' },
  { number: '305', floor: 3, type: 'deluxe', x0: 4, x1: 10, z0: -1, z1: 6, rot: 0, palette: 2, view: 'High Sky & Sea', wing: 'south' },
  { number: '306', floor: 3, type: 'deluxe', x0: 10, x1: 16, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Quiet Bay Vista', wing: 'south' },
  { number: '307', floor: 3, type: 'single', x0: 16, x1: 23, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Skyline Terrace', wing: 'south' },
  { number: '308', floor: 3, type: 'single', x0: 23, x1: 30, z0: -1, z1: 6, rot: 0, palette: 2, view: 'Panoramic Skyline', wing: 'south' }
];

export const ROOM_TYPE_LABELS = {
  single: 'Serenade Single',
  deluxe: 'Deluxe Double',
  junior: 'Junior Suite',
  terrace: 'Terrace Suite',
  penthouse: 'Penthouse Suite'
};

export const ROOM_TYPE_DETAILS = {
  single: { bed: 'Queen bed', capacity: 1, extra: 'Writing desk · armchair · rain shower' },
  deluxe: { bed: 'King bed', capacity: 2, extra: 'Lounge seating · tub & rain shower · balcony or patio' },
  junior: { bed: 'King bed + sleeper lounge', capacity: 4, extra: 'Living area · kitchenette · dressing room' },
  terrace: { bed: 'King bed + sleeper lounge', capacity: 4, extra: 'Private terrace · kitchenette · marble spa bath' },
  penthouse: { bed: 'King bed + lounge', capacity: 4, extra: 'Two bathrooms · butler pantry · wraparound terrace' }
};

export const SERVICE_DATA = [
  {
    id: 'reception',
    title: 'Reception & Concierge',
    eyebrow: 'AT YOUR SERVICE · LEVEL 1',
    floor: 1,
    hours: 'Open 24 hours',
    capacity: 'Concierge, luggage & valet',
    position: { x: 4.4, y: 1.4, z: -8.6 },
    view: { x: 3.4, y: 1.62, z: -13.5, yaw: -0.35, pitch: -0.03 },
    image: 'images/experience-service.webp',
    gallery: ['images/experience-service.webp', 'images/experience-wifi.jpg'],
    description: 'A warm welcome, an unhurried check-in and a concierge who knows the coast. Arrivals are met beneath the porte-cochère and bags are taken to your room before you reach the lift.',
    amenities: ['24-hour front desk', 'Personal concierge', 'Luggage & valet', 'Airport transfers', 'Late check-out on request'],
    cta: 'Plan your arrival',
    link: 'contact.html',
    icon: 'fa-bell-concierge'
  },
  {
    id: 'restaurant',
    title: 'Salt & Cedar Restaurant',
    eyebrow: 'COASTAL DINING · LEVEL 1',
    floor: 1,
    hours: 'Breakfast 07:00–10:30 · Dinner 18:00–22:30',
    capacity: '64 seats · private dining for 12',
    position: { x: 19, y: 1.4, z: -6 },
    view: { x: 16, y: 1.62, z: -2.5, yaw: 2.6, pitch: -0.04 },
    image: 'images/experience-dining.webp',
    gallery: ['images/experience-dining.webp', 'images/experience-dining-service.jpg', 'images/experience-champagne.jpg'],
    description: 'A relaxed, light-filled room of oak, linen and hand-thrown ceramics. The menu follows the tide and the garden, with an open kitchen pass and a table set for long evenings.',
    amenities: ['Seasonal coastal menu', 'Open kitchen', 'Sommelier list', 'Garden terrace', 'Private dining room', 'Children’s menu'],
    cta: 'Reserve a table',
    link: 'contact.html',
    icon: 'fa-utensils'
  },
  {
    id: 'bar',
    title: 'The Lantern Bar',
    eyebrow: 'COCKTAILS & SMALL PLATES · LEVEL 1',
    floor: 1,
    hours: '16:00 – midnight',
    capacity: '28 seats',
    position: { x: 26.2, y: 1.4, z: -12.4 },
    view: { x: 23, y: 1.62, z: -13, yaw: -1.1, pitch: -0.02 },
    image: 'images/service-bar.webp',
    gallery: ['images/service-bar.webp', 'images/experience-champagne.jpg'],
    description: 'A low-lit corner of the restaurant for aperitifs, local gin and a final glass before bed. Brass, dark timber and a record player that guests are welcome to choose.',
    amenities: ['Coastal cocktails', 'Local gins', 'Small plates', 'Vinyl library', 'Terrace seating'],
    cta: 'See the drinks list',
    link: 'experiences.html',
    icon: 'fa-martini-glass'
  },
  {
    id: 'lounge',
    title: 'The Reading Lounge',
    eyebrow: 'A QUIET CORNER · LEVEL 1',
    floor: 1,
    hours: 'Open all day',
    capacity: 'Library · fireplace · honesty bar',
    position: { x: -20.5, y: 1.4, z: -8 },
    view: { x: -20, y: 1.62, z: -13, yaw: 0.2, pitch: -0.02 },
    image: 'images/experience-coffee.jfif',
    gallery: ['images/experience-coffee.jfif', 'images/experience-champagne.jpg'],
    description: 'Deep sofas, old novels and the quiet crackle of the fireplace. Coffee and tea are always ready; the honesty bar opens after lunch.',
    amenities: ['Library', 'Fireplace', 'Honesty bar', 'Board games', 'All-day coffee'],
    cta: 'Explore experiences',
    link: 'experiences.html',
    icon: 'fa-book-open'
  },
  {
    id: 'pool',
    title: 'The Horizon Pool',
    eyebrow: 'POOL TERRACE · LEVEL 1',
    floor: 1,
    hours: '07:00 – 21:00',
    capacity: '21 m pool · 24 loungers · 3 cabanas',
    position: { x: 3.5, y: 1.2, z: 11.6 },
    view: { x: 2, y: 1.62, z: 5.8, yaw: 2.95, pitch: -0.03 },
    image: 'images/experience-pool.avif',
    gallery: ['images/experience-pool.avif', 'images/service-pool.avif'],
    description: 'A long, quiet pool set between the garden wing and the spa. Teak decking, linen umbrellas and cabanas with curtains pulled against the afternoon sun.',
    amenities: ['21 m heated pool', 'Teak sun deck', 'Private cabanas', 'Poolside service', 'Towels & robes', 'Outdoor shower'],
    cta: 'Plan a pool day',
    link: 'experiences.html',
    icon: 'fa-water-ladder'
  },
  {
    id: 'spa',
    title: 'Haven Spa & Wellness',
    eyebrow: 'TREATMENTS & THERMAL SUITE · LEVEL 1',
    floor: 1,
    hours: '09:00 – 20:00',
    capacity: '3 treatment rooms · sauna · steam',
    position: { x: 24, y: 1.4, z: 10.5 },
    view: { x: 24, y: 1.62, z: 7.5, yaw: 2.9, pitch: -0.02 },
    image: 'images/experience-spa.webp',
    gallery: ['images/experience-spa.webp', 'images/service-spa.webp', 'images/experience-service.webp'],
    description: 'A calm sequence of warm stone, steam and salt. Arrive early for the thermal suite, then drift into a treatment room scented with cedar and coastal fennel.',
    amenities: ['Three treatment rooms', 'Cedar sauna', 'Steam room', 'Plunge pool', 'Relaxation lounge', 'Couples treatments'],
    cta: 'Reserve a treatment',
    link: 'experiences.html',
    icon: 'fa-spa'
  },
  {
    id: 'fitness',
    title: 'The Movement Studio',
    eyebrow: 'FITNESS & STRETCH · LEVEL 2',
    floor: 2,
    hours: 'Open 24 hours',
    capacity: 'Cardio · weights · yoga mats',
    position: { x: -22, y: 5.1, z: -12 },
    view: { x: -22, y: 5.32, z: -17, yaw: 0.1, pitch: -0.02 },
    image: 'images/experience-fitness.webp',
    gallery: ['images/experience-fitness.webp', 'images/experience-wifi.jpg'],
    description: 'A small, well-equipped studio with garden light and everything needed for a short session before breakfast. Mats, bands and a quiet corner for stretching.',
    amenities: ['Technogym cardio', 'Free weights', 'Yoga mats', 'Towels & water', 'Open 24 hours'],
    cta: 'See wellness experiences',
    link: 'experiences.html',
    icon: 'fa-dumbbell'
  },
  {
    id: 'sunset',
    title: 'Sunset Deck',
    eyebrow: 'ROOFTOP · LEVEL 3',
    floor: 3,
    hours: '12:00 – 22:00 · weather permitting',
    capacity: 'Lounge · fire table · 40 guests',
    position: { x: 2, y: 8.6, z: -10 },
    view: { x: 6, y: 9.02, z: -15, yaw: 2.6, pitch: 0.02 },
    image: 'images/experience-champagne.jpg',
    gallery: ['images/experience-champagne.jpg', 'images/experience-dining-service.jpg'],
    description: 'The top of the house: a pergola, a fire table and a long view over the pool to the water. Blankets and a small bar cart arrive before sundown.',
    amenities: ['Fire table', 'Pergola lounge', 'Bar cart', 'Sunset views', 'Blankets', 'Private hire'],
    cta: 'Enquire about the deck',
    link: 'contact.html',
    icon: 'fa-sun'
  },
  {
    id: 'lift',
    title: 'The Glass Lift',
    eyebrow: 'ALL FLOORS',
    floor: 1,
    hours: '24 hours',
    capacity: 'Levels 1–3',
    position: { x: 4.6, y: 1.4, z: -4.8 },
    view: { x: 4.6, y: 1.62, z: -2.2, yaw: 0, pitch: 0 },
    image: 'images/experience-service.webp',
    gallery: [],
    description: 'A quiet glass lift rises through the lobby, opening onto the guest corridors on levels 2 and 3.',
    amenities: ['Step-free access', 'Levels 1–3', 'Braille controls', 'Emergency call'],
    cta: '',
    link: '',
    icon: 'fa-elevator',
    kind: 'lift'
  },
  {
    id: 'stairs',
    title: 'The Feature Stair',
    eyebrow: 'ALL FLOORS',
    floor: 1,
    hours: '24 hours',
    capacity: 'Levels 1–3',
    position: { x: 1.2, y: 1.4, z: -4.4 },
    view: { x: 1.2, y: 1.62, z: -1.6, yaw: 0, pitch: 0 },
    image: 'images/experience-service.webp',
    gallery: [],
    description: 'A sculptural stone stair with a brass handrail, wrapped around the lobby atrium and lit from above.',
    amenities: ['Stone treads', 'Brass handrail', 'Levels 1–3'],
    cta: '',
    link: '',
    icon: 'fa-stairs',
    kind: 'stairs'
  }
];

export const SERVICE_BY_ID = Object.fromEntries(SERVICE_DATA.map(s => [s.id, s]));

/* Walkable floor rectangles (metres). These keep the guest on real floors and
   create natural door thresholds instead of invisible box collisions. */
const roomWalkRects = ROOM_LAYOUT.map(r => ({
  floor: r.floor,
  x0: r.x0 + 0.45, x1: r.x1 - 0.45,
  z0: r.z0 + 0.45, z1: r.z1 - 0.45,
  room: r.number
}));

const roomThresholds = ROOM_LAYOUT.map(r => {
  const w = r.x1 - r.x0;
  const d = r.z1 - r.z0;
  const doorX = r.rot ? (r.x0 + r.x1) / 2 - (w / 2 - 1.45) : (r.x0 + r.x1) / 2 + (w / 2 - 1.45);
  const doorZ = r.rot ? r.z1 : r.z0;
  return { floor: r.floor, x0: doorX - 0.8, x1: doorX + 0.8, z0: doorZ - 0.75, z1: doorZ + 0.75, room: r.number };
});

export const WALK_ZONES = [
  // ---- Level 1 ------------------------------------------------
  { floor: 1, x0: -7.1, x1: 7.1, z0: -17.3, z1: 5.6, name: 'Lobby' },
  { floor: 1, x0: 7.0, x1: 29.2, z0: -17.3, z1: 4.2, name: 'Restaurant' },
  { floor: 1, x0: -29.2, x1: -7.0, z0: -17.3, z1: 4.2, name: 'Lounge' },
  { floor: 1, x0: -7.1, x1: 7.1, z0: 3.8, z1: 6.4, name: 'Garden doors' },
  { floor: 1, x0: 7.0, x1: 29.2, z0: 3.6, z1: 6.2, name: 'Restaurant terrace' },
  { floor: 1, x0: -29.2, x1: -7.0, z0: 3.6, z1: 6.2, name: 'Lounge garden doors' },
  { floor: 1, x0: -30.2, x1: -9.8, z0: -18.2, z1: 6.2, name: 'Main corridor' },
  { floor: 1, x0: -31.4, x1: -9.8, z0: 5.9, z1: 12.0, name: 'Garden wing corridor' },
  { floor: 1, x0: -31.4, x1: -9.8, z0: 12.0, z1: 14.8, name: 'Garden wing corridor' },
  { floor: 1, x0: -9.8, x1: -6.8, z0: 5.8, z1: 14.8, name: 'Pool colonnade' },
  { floor: 1, x0: -8.0, x1: 17.6, z0: 5.8, z1: 7.8, name: 'Pool deck' },
  { floor: 1, x0: -8.0, x1: 17.6, z0: 15.2, z1: 17.6, name: 'Pool deck' },
  { floor: 1, x0: 14.2, x1: 17.6, z0: 7.5, z1: 15.5, name: 'Pool deck' },
  { floor: 1, x0: -8.0, x1: -6.8, z0: 7.5, z1: 15.5, name: 'Pool deck' },
  { floor: 1, x0: 17.4, x1: 30.2, z0: 5.8, z1: 18.2, name: 'Spa' },
  { floor: 1, x0: -33, x1: 31, z0: 17.4, z1: 21.8, name: 'Garden promenade' },
  // ---- Level 2 ------------------------------------------------
  { floor: 2, x0: -30.2, x1: 30.2, z0: -4.8, z1: -0.7, name: 'South corridor' },
  { floor: 2, x0: -30.2, x1: -7.2, z0: -18.2, z1: -4.4, name: 'West gallery' },
  { floor: 2, x0: 7.2, x1: 30.2, z0: -18.2, z1: -4.4, name: 'East gallery' },
  { floor: 2, x0: -7.2, x1: 7.2, z0: -5.6, z1: -4.4, name: 'Atrium bridge' },
  { floor: 2, x0: 22.2, x1: 30.2, z0: -1.0, z1: 6.0, name: 'East lounge' },
  // ---- Level 3 ------------------------------------------------
  { floor: 3, x0: -30.2, x1: 30.2, z0: -4.8, z1: -0.7, name: 'South corridor' },
  { floor: 3, x0: -30.2, x1: 30.2, z0: -18.0, z1: -4.4, name: 'Sunset Deck' }
].concat(roomWalkRects, roomThresholds);

export const ROOM_BY_NUMBER = Object.fromEntries(ROOM_LAYOUT.map(r => [r.number, r]));

/* Collision boxes deliberately cover only large furniture, so movement stays
   comfortable while the room still feels solid. They are generated per-room. */
export function roomDoor(r) {
  const w = r.x1 - r.x0;
  const d = r.z1 - r.z0;
  const cx = (r.x0 + r.x1) / 2;
  const cz = (r.z0 + r.z1) / 2;
  const localX = w / 2 - 1.45;
  const x = r.rot ? cx - localX : cx + localX;
  const z = r.rot ? r.z1 : r.z0;
  return { x, z, rot: r.rot, w, d, cx, cz };
}

export function roomView(r) {
  const door = roomDoor(r);
  const insideZ = r.rot ? r.z1 - 1.9 : r.z0 + 1.9;
  return {
    x: door.x,
    y: LEVELS[r.floor - 1].y + 1.62,
    z: insideZ,
    yaw: r.rot ? Math.PI : 0,
    pitch: -0.02
  };
}
