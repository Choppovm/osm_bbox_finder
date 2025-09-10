const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        polyline: true,
        circle: true,
        marker: true,
        circlemarker: true,
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

    let bboxText = "";

    if (layer.getBounds) {
        const bounds = layer.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        bboxText = `
        Min Longitude (West): ${sw.lng.toFixed(6)}
        Min Latitude (South): ${sw.lat.toFixed(6)}
        Max Longitude (East): ${ne.lng.toFixed(6)}
        Max Latitude (North): ${ne.lat.toFixed(6)}
        `;
    }
    else if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        const point = layer.getLatLng();
        bboxText = `
        Marker Location:
        Latitude: ${point.lat.toFixed(6)}
        Longitude: ${point.lng.toFixed(6)}
        `;
    }
    else if (layer instanceof L.Polyline) {
        const latlngs = layer.getLatLngs().flat();
        const lats = latlngs.map(p => p.lat);
        const lngs = latlngs.map(p => p.lng);
        const minLat = Math.min(...lats).toFixed(6);
        const maxLat = Math.max(...lats).toFixed(6);
        const minLng = Math.min(...lngs).toFixed(6);
        const maxLng = Math.max(...lngs).toFixed(6);

        bboxText = `
        Polyline Bounding Box:
        Min Longitude (West): ${minLng}
        Min Latitude (South): ${minLat}
        Max Longitude (East): ${maxLng}
        Max Latitude (North): ${maxLat}
        `;
    }
    else {
        bboxText = "Shape type not recognized.";
    }
    document.getElementById("bbox-coords").textContent = bboxText;
});

function copyToClipboard() {
    const text = document.getElementById("bbox-coords").textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}
