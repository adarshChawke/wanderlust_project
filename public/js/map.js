mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});




// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: "#fe424d" })
    .setLngLat(listing.geometry.coordinates)// logitude and latitude coordinates are basically from Listing.geomerty.coordinates
     .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h4>${listing.title}</h4> <p> Exact location provided after booking. </p>`))
    .addTo(map);