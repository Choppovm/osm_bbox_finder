const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    draw: {
        polygon: false,
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false,
        rectangle: true
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function (e) {
    drawnItems.clearLayers();
    const layer = e.layer;
    drawnItems.addLayer(layer);

    const bounds = layer.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const bboxText = `
    Min Longitude (West): ${sw.lng.toFixed(6)}
    Min Latitude (South): ${sw.lat.toFixed(6)}
    Max Longitude (East): ${ne.lng.toFixed(6)}
    Max Latitude (North): ${ne.lat.toFixed(6)}
    `;
    document.getElementById("bbox-coords").textContent = bboxText;
});

function copyToClipboard() {
    const text = document.getElementById("bbox-coords").textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Bounding box copied to clipboard!");
    });
}
