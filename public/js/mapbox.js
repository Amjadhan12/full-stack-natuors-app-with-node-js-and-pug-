/* eslint-disable */


// export const displayMap=locations =>
// {
//   maboxgl.accessToken='';

// var map=new L.map({
//   container: 'map',
//   style: 'mapbox://styles/mapbox/streets-v11',
//   scrollZoom:false
//   // center: [-118.12412,34.12342],
//   // zoom: 10,
//   // interactive:false
// })

// const bounds=new L.map.LngLatBounds();

// locations.forEach(loc =>
// {
//   //create marker
//   const el=document.createElement('div');
//   el.className('marker');

//   //Add marker
//   new L.map.Marker({
//     element: el,
//     anchor: 'bottom',
//   }).setLngLat(loc.coordinates).addTo(map);

//   //Add poup
//   new L.map.Popup({
//     offset:30
//   }).setLngLat(loc.coordinates).setHTML(`<P>Day ${loc.day}: ${loc.description}</p>`).addTo(map)

//   //Extend map bounds to include includes current locations
//   bounds.extend(loc.coordinates)
// })

// map.fitBounds(bounds,{
//   padding: {
//     top: 200,
//     bottom: 150,
//     left: 100,
//     right:100
//   }
// });

// }
