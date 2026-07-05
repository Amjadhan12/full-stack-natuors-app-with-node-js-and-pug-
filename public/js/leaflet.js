/* eslint-disable */

export const displayMap = (locations) => {
  // Initialize the map centered on a default location
  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView([0, 0], 2);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Create bounds object to fit all locations
  const bounds = L.latLngBounds();

  locations.forEach(loc => {
    // Create custom marker element
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker to map
    const marker = L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .openPopup();

    // Extend bounds to include this location
    bounds.extend([loc.coordinates[1], loc.coordinates[0]]);
  });

  // Fit map to show all markers with padding
  map.fitBounds(bounds, {
    padding: [100, 100]
  });
};
