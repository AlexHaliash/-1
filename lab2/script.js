document.querySelector('.upload-btn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const tableBody = document.querySelector('#resultTable tbody');
    tableBody.innerHTML = ''; // Clear table before loading new files

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            return; // Skip non-image files
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = function() {
            // Get image metadata
            const width = img.width;
            const height = img.height;

            // Assuming default resolution for now (72 DPI for most images)
            const resolution = 72;

            // Color depth logic (basic assumption)
            const colorDepth = file.type === 'image/gif' ? '8-bit (GIF)' : '24-bit';

            // Placeholder for compression (needs more complex handling for each format)
            const compression = 'N/A'; // This needs further implementation depending on file type

            // Add data to table
            const row = `<tr>
                            <td>${file.name}</td>
                            <td>${width} x ${height}</td>
                            <td>${resolution} dpi</td>
                            <td>${colorDepth}</td>
                            <td>${compression}</td>
                        </tr>`;
            tableBody.innerHTML += row;

            URL.revokeObjectURL(url); // Clean up URL object
        };

        img.src = url;
    });
});
