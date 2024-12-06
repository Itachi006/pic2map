// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Default world view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Handle file input
document.getElementById('imageInput').addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) {
        document.getElementById('errorMessage').textContent = "No file selected!";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const exif = EXIF.readFromBinaryFile(e.target.result);

        console.log("Metadata found:", exif); // Log metadata for debugging

        if (exif && exif.GPSLatitude && exif.GPSLongitude) {
            // Convert GPS coordinates to decimal
            const toDecimal = (coord, ref) => {
                let decimal = coord[0] + coord[1] / 60 + coord[2] / 3600;
                return (ref === "S" || ref === "W") ? decimal * -1 : decimal;
            };

            const lat = toDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
            const lng = toDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);

            // Update map
            map.setView([lat, lng], 13);
            L.marker([lat, lng]).addTo(map).bindPopup(`Coordinates: ${lat}, ${lng}`).openPopup();
            document.getElementById('errorMessage').textContent = "";
        } else {
            document.getElementById('errorMessage').textContent = "No GPS metadata found in this image!";
        }
    };

    reader.readAsArrayBuffer(file);
});

// Handle manual coordinate input
document.getElementById('plotCoords').addEventListener('click', () => {
    const input = document.getElementById('manualCoords').value;
    const [lat, lng] = input.split(',').map(Number);

    if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 13);
        L.marker([lat, lng]).addTo(map).bindPopup(`Coordinates: ${lat}, ${lng}`).openPopup();
        document.getElementById('errorMessage').textContent = "";
    } else {
        alert("Invalid coordinates! Please use the format: Latitude, Longitude");
    }
});
