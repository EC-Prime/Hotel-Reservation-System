document.addEventListener('DOMContentLoaded', () => {
  renderExperienceRooms();
  bindExperienceFavorites();
  bindExperienceForms();
});

const favoriteRoomIds = loadFavoriteRoomIds();

function renderExperienceRooms() {
  const roomGrid = document.getElementById('experiencesRoomGrid');
  if (!roomGrid || typeof ROOMS_DATA === 'undefined') return;

  const fragment = document.createDocumentFragment();

  ROOMS_DATA.forEach((room) => {
    const card = document.createElement('article');
    card.className = 'experiences-room-card';

    const image = document.createElement('img');
    image.className = 'experiences-room-image';
    image.src = room.image;
    image.alt = room.title;
    image.loading = 'lazy';
    image.width = 800;
    image.height = 600;

    const favoriteButton = document.createElement('button');
    favoriteButton.className = 'experiences-favorite-button';
    favoriteButton.type = 'button';
    favoriteButton.dataset.roomId = String(room.roomId);
    favoriteButton.setAttribute('aria-pressed', String(favoriteRoomIds.has(room.roomId)));
    favoriteButton.setAttribute('aria-label', `${favoriteRoomIds.has(room.roomId) ? 'Remove' : 'Save'} ${room.title} ${favoriteRoomIds.has(room.roomId) ? 'from' : 'to'} favorites`);

    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'fas fa-heart';
    favoriteIcon.setAttribute('aria-hidden', 'true');
    favoriteButton.append(favoriteIcon);

    const content = document.createElement('div');
    content.className = 'experiences-room-content';

    const category = document.createElement('p');
    category.className = 'experiences-room-category';
    category.textContent = `${room.roomType} · ROOM ${room.roomNumber}`;

    const title = document.createElement('h3');
    title.textContent = room.title;

    const description = document.createElement('p');
    description.className = 'experiences-room-description';
    description.textContent = room.description;

    const details = document.createElement('p');
    details.className = 'experiences-room-details';
    details.textContent = `${room.sizeSqm} m² · ${room.bedType} · ${room.view}`;

    const link = document.createElement('a');
    link.className = 'experiences-room-link';
    link.href = `rooms.html?roomId=${encodeURIComponent(room.roomId)}`;
    link.textContent = 'View room';
    link.setAttribute('aria-label', `View ${room.title}`);

    content.append(category, title, description, details, link);
    card.append(image, favoriteButton, content);
    fragment.append(card);
  });

  roomGrid.replaceChildren(fragment);
}

function loadFavoriteRoomIds() {
  try {
    const storedIds = JSON.parse(localStorage.getItem('royalHavenFavoriteRoomIds') || '[]');
    return new Set(Array.isArray(storedIds) ? storedIds.map(Number).filter(Number.isFinite) : []);
  } catch {
    return new Set();
  }
}

function bindExperienceFavorites() {
  const roomGrid = document.getElementById('experiencesRoomGrid');
  if (!roomGrid) return;

  roomGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.experiences-favorite-button');
    if (!button) return;

    const roomId = Number(button.dataset.roomId);
    const isFavorite = favoriteRoomIds.has(roomId);
    if (isFavorite) {
      favoriteRoomIds.delete(roomId);
    } else {
      favoriteRoomIds.add(roomId);
    }

    button.setAttribute('aria-pressed', String(!isFavorite));
    const room = ROOMS_DATA.find((item) => item.roomId === roomId);
    if (room) {
      button.setAttribute('aria-label', `${isFavorite ? 'Save' : 'Remove'} ${room.title} ${isFavorite ? 'to' : 'from'} favorites`);
    }

    button.classList.remove('is-animating');
    void button.offsetWidth;
    button.classList.add('is-animating');

    try {
      localStorage.setItem('royalHavenFavoriteRoomIds', JSON.stringify([...favoriteRoomIds]));
    } catch {
      // Keep the favorite active for this page session when storage is unavailable.
    }
  });
}

function bindExperienceForms() {
  const forms = [
    ['spaBookingForm', 'Spa booking request received. Our team will confirm shortly.'],
    ['boutiqueBookingForm', 'Boutique appointment request received. Our team will confirm shortly.']
  ];

  forms.forEach(([formId, successMessage]) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('.booking-status');
      if (status) status.textContent = successMessage;
      form.reset();
    });
  });
}