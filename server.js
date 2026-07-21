const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');
const LETTER_FILE = path.join(__dirname, 'letter.txt');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Helper to serve static files
function serveStaticFile(res, urlPath) {
    const filePath = path.join(PUBLIC_DIR, urlPath);
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end(`File not found: ${urlPath}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}

const server = http.createServer((req, res) => {
    const urlPathname = req.url.split('?')[0];

    if (urlPathname === '/') {
        // Read current state
        let state = { viewed: false };
        try {
            if (fs.existsSync(STATE_FILE)) {
                state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
            }
        } catch (e) {
            console.error("Error reading state.json", e);
        }

        if (!state.viewed) {
            // Mark as viewed
            try {
                fs.writeFileSync(STATE_FILE, JSON.stringify({ viewed: true }, null, 2), 'utf8');
            } catch (e) {
                console.error("Error writing state.json", e);
            }

            // Read letter content
            let letterContent = "Carta no encontrada.";
            try {
                if (fs.existsSync(LETTER_FILE)) {
                    letterContent = fs.readFileSync(LETTER_FILE, 'utf8');
                }
            } catch (e) {
                console.error("Error reading letter.txt", e);
            }

            // Format letter content to preserve line breaks
            let formattedLetter = letterContent.split('\n').map(line => `<p>${line}</p>`).join('');

            // Reemplazar "gordas" por un span interactivo usando CLASE (porque puede aparecer varias veces)
            formattedLetter = formattedLetter.replace(/gordas/g, '<span class="gordas-trigger" style="color: var(--accent); cursor: pointer; text-decoration: underline; font-weight: bold;">gordas</span>');

            // Send Letter Page
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(getLetterHTML(formattedLetter));

        } else {
            // Already viewed - Send Error Page
            res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(getErrorHTML());
        }
    } else if (urlPathname.startsWith('/public/')) {
        serveStaticFile(res, urlPathname.replace('/public/', ''));
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

function getLetterHTML(content) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hola te amo</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/public/style.css?v=${Date.now()}">
</head>
<body class="letter-page">
    <div class="tulips-container" id="tulips-container"></div>
    <div class="card-container">
        <div class="card">
            <div class="card-content">
                ${content}
            </div>
            <div class="seal">❤</div>
        </div>
    </div>
    
    <!-- Modal for image popup -->
    <div id="image-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="/public/gordas.png" alt="Cartman en scooter" id="modal-image">
        </div>
    </div>
    
    <script src="/public/main.js?v=${Date.now()}"></script>
</body>
</html>`;
}

function getErrorHTML() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enlace expirado</title>
    <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/public/style.css">
</head>
<body class="error-page">
    <div class="error-container">
        <div class="error-icon">🥀</div>
        <h1>Esta página ya no está disponible</h1>
        <p>hola amor ya se borró porq me daba verguenza haber hecho esto tan cursi te amo.</p>
    </div>
</body>
</html>`;
}

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Para resetear el estado y volver a ver la carta, abre state.json y cambia "viewed": true por "viewed": false, o simplemente borra el archivo state.json.');
});
