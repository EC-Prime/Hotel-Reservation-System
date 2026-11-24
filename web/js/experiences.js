document.addEventListener('DOMContentLoaded', () => {
  renderExperienceRooms();
  bindExperienceFavorites();
  bindExperienceForms();
});

const favoriteRoomIds = loadFavoriteRoomIds();
let experienceSort = 'featured';
let showFavoritesOnly = false;

function renderExperienceRooms() {
  const roomGrid = document.getElementById('experiencesRoomGrid');
  if (!roomGrid || typeof ROOMS_DATA === 'undefined') return;

  const rooms = ROOMS_DATA
    .map((room, index) => ({ room, index }))
    .filter(({ room }) => !showFavoritesOnly || favoriteRoomIds.has(room.roomId))
    .sort((a, b) => {
      if (experienceSort === 'favorites') {
        return Number(favoriteRoomIds.has(b.room.roomId)) - Number(favoriteRoomIds.has(a.room.roomId))
          || a.index - b.index;
      }
      if (experienceSort === 'price-low') {
        return Number(a.room.pricePerNight) - Number(b.room.pricePerNight) || a.index - b.index;
      }
      const badgeRank = { FEATURED: 3, RECOMMENDED: 2, POPULAR: 1 };
      return (badgeRank[b.room.badge] || 0) - (badgeRank[a.room.badge] || 0) || a.index - b.index;
    })
    .map(({ room }) => room);

  if (!rooms.length) {
    roomGrid.innerHTML = `
      <div class="experiences-empty-state">
        <i class="fas fa-heart" aria-hidden="true"></i>
        <p>No saved stays yet. Tap a heart to add a room to your favourites on this device.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  rooms.forEach((room) => {
    const isFavorite = favoriteRoomIds.has(room.roomId);
    const card = document.createElement('article');
    card.className = 'experiences-room-card';
    card.classList.toggle('is-favorite', isFavorite);

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
    favoriteButton.setAttribute('aria-pressed', String(isFavorite));
    favoriteButton.setAttribute('aria-label', `${isFavorite ? 'Remove' : 'Save'} ${room.title} ${isFavorite ? 'from' : 'to'} your favourites on this device`);

    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'fas fa-heart';
    favoriteIcon.setAttribute('aria-hidden', 'true');
    favoriteButton.append(favoriteIcon);

    const content = document.createElement('div');
    content.className = 'experiences-room-content';

    const category = document.createElement('p');
    category.className = 'experiences-room-category';
    category.textContent = `${room.roomType} · ROOM ${room.roomNumber}`;

    if (room.badge) {
      const badge = document.createElement('span');
      badge.className = `badge-tag experiences-room-badge badge-${String(room.badge).toLowerCase()}`;
      badge.textContent = room.badge;
      content.append(category, badge);
    } else {
      content.append(category);
    }

    const title = document.createElement('h3');
    title.textContent = room.title;

    const description = document.createElement('p');
    description.className = 'experiences-room-description';
    description.textContent = room.description;

    const details = document.createElement('p');
    details.className = 'experiences-room-details';
    details.textContent = `${room.sizeSqm} m² · ${room.bedType} · ${room.view}`;

    const savedState = document.createElement('p');
    savedState.className = 'experiences-room-saved-state';
    savedState.textContent = isFavorite ? 'Saved to your favourites' : 'Save this stay for later';

    const link = document.createElement('a');
    link.className = 'experiences-room-link btn-view-details';
    link.href = `rooms.html?roomId=${encodeURIComponent(room.roomId)}`;
    link.textContent = 'View details';
    link.setAttribute('aria-label', `View ${room.title}`);

    content.append(title, description, details, savedState, link);
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

  const sortSelect = document.getElementById('experienceSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      experienceSort = sortSelect.value;
      renderExperienceRooms();
    });
  }

  const favoritesFilter = document.getElementById('experienceFavoritesOnly');
  if (favoritesFilter) {
    favoritesFilter.addEventListener('click', () => {
      showFavoritesOnly = !showFavoritesOnly;
      favoritesFilter.setAttribute('aria-pressed', String(showFavoritesOnly));
      renderExperienceRooms();
    });
  }

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

    try {
      localStorage.setItem('royalHavenFavoriteRoomIds', JSON.stringify([...favoriteRoomIds]));
    } catch {
      showToast('Favourite saved for this page only; browser storage is unavailable.', 'urgent');
    }

    renderExperienceRooms();
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