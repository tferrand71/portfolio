<?php
require_once '../connexion.php';
require 'auth.php';
require '../include/header.php';
include 'slidebar.php';

$errors = [];
$success = false;
$uploadedCount = 0;

// Fonction pour convertir une image en WebP
function convertToWebP($sourcePath, $destinationPath, $quality = 80) {
    $imageInfo = getimagesize($sourcePath);
    if (!$imageInfo) {
        return false;
    }
    
    $mimeType = $imageInfo['mime'];
    
    switch ($mimeType) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $image = imagecreatefrompng($sourcePath);
            // Préserver la transparence pour PNG
            imagealphablending($image, false);
            imagesavealpha($image, true);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            // Si c'est déjà WebP, on copie juste le fichier
            return copy($sourcePath, $destinationPath);
        default:
            return false;
    }
    
    if (!$image) {
        return false;
    }
    
    // Convertir en WebP
    $result = imagewebp($image, $destinationPath, $quality);
    imagedestroy($image);
    
    return $result;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérifier si des fichiers ont été uploadés
    if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
        $errors[] = "Aucun fichier n'a été sélectionné";
    } else {
        $uploadDir = '../images/bdd/';
        
        // Créer le répertoire s'il n'existe pas
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                $errors[] = "Impossible de créer le répertoire de destination";
            }
        }
        
        // Traiter chaque fichier
        $fileCount = count($_FILES['images']['name']);
        
        for ($i = 0; $i < $fileCount; $i++) {
            // Vérifier s'il y a une erreur pour ce fichier
            if ($_FILES['images']['error'][$i] !== UPLOAD_ERR_OK) {
                $errors[] = "Erreur lors du téléchargement du fichier " . $_FILES['images']['name'][$i];
                continue;
            }
            
            // Vérifier le type de fichier
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            $fileType = mime_content_type($_FILES['images']['tmp_name'][$i]);
            
            if (!in_array($fileType, $allowedTypes)) {
                $errors[] = "Type de fichier non autorisé pour " . $_FILES['images']['name'][$i] . ". Types acceptés: JPG, PNG, GIF, WEBP";
                continue;
            }
            
            // Vérifier la taille du fichier (max 10Mo)
            if ($_FILES['images']['size'][$i] > 10 * 1024 * 1024) {
                $errors[] = "Le fichier " . $_FILES['images']['name'][$i] . " est trop volumineux (max 10Mo)";
                continue;
            }
            
            // Récupérer le titre pour cette image
            $titre = isset($_POST['titres'][$i]) && !empty(trim($_POST['titres'][$i])) 
                ? trim($_POST['titres'][$i]) 
                : pathinfo($_FILES['images']['name'][$i], PATHINFO_FILENAME);
            
            if (strlen($titre) > 255) {
                $titre = substr($titre, 0, 255);
            }
            
            // Générer un nom de fichier unique en WebP
            $newFilename = uniqid() . '.webp';
            $uploadPath = $uploadDir . $newFilename;
            
            // Convertir et sauvegarder en WebP
            if (convertToWebP($_FILES['images']['tmp_name'][$i], $uploadPath)) {
                try {
                    // Enregistrer en base de données
                    $stmt = $pdo->prepare("INSERT INTO galerie (titre, chemin, type_mime) VALUES (?, ?, ?)");
                    $stmt->execute([$titre, $uploadPath, 'image/webp']);
                    
                    $uploadedCount++;
                } catch (PDOException $e) {
                    $errors[] = "Erreur lors de l'enregistrement de " . $_FILES['images']['name'][$i] . " : " . $e->getMessage();
                    // Supprimer le fichier en cas d'erreur BDD
                    if (file_exists($uploadPath)) {
                        unlink($uploadPath);
                    }
                }
            } else {
                $errors[] = "Erreur lors de la conversion de " . $_FILES['images']['name'][$i] . " en WebP";
            }
        }
        
        if ($uploadedCount > 0) {
            $success = true;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajouter des Images - Dashboard</title>
    <style>
        /* Reset simple */
        * {
            box-sizing: border-box;
        }
        
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
            background-color: #f5f7fa;
            color: #222;
            transition: background-color 0.3s, color 0.3s;
        }

        /* Dark mode sur body */
        body.dark-mode {
            background-color: #121212;
            color: #ddd;
        }

        /* Sidebar - doit correspondre à votre sidebar existante */
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 240px;
            background-color: #1f2937;
            color: white;
            padding: 1rem;
            overflow-y: auto;
        }
        
        body.dark-mode .sidebar {
            background-color: #222831;
        }
        
        .page-wrapper {
            display: flex;
            min-height: 100vh;
        }
        
        .main-content {
            margin-left: 240px;
            padding: 2rem;
            min-height: 100vh;
            background-color: #fff;
            transition: background-color 0.3s, color 0.3s;
            flex: 1;
        }
        
        body.dark-mode .main-content {
            background-color: #1e1e1e;
            color: #ddd;
        }
        
        .upload-form {
            max-width: 1000px;
            margin: 0 auto;
            background: #f8f8f8;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            transition: background-color 0.3s, color 0.3s;
        }
        
        body.dark-mode .upload-form {
            background: #2c2c2c;
            color: #ddd;
            box-shadow: 0 0 15px rgba(255,255,255,0.1);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .file-input-wrapper {
            border: 2px dashed #ddd;
            padding: 20px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
            background-color: #fafafa;
        }
        
        body.dark-mode .file-input-wrapper {
            border-color: #555;
            background-color: #333;
            color: #ddd;
        }
        
        .file-input-wrapper:hover {
            border-color: #333;
            background-color: #f0f0f0;
        }
        
        body.dark-mode .file-input-wrapper:hover {
            border-color: #777;
            background-color: #444;
        }
        
        .file-input-wrapper.dragover {
            border-color: #4f46e5;
            background-color: #e3f2fd;
        }
        
        body.dark-mode .file-input-wrapper.dragover {
            border-color: #6366f1;
            background-color: #1e293b;
        }
        
        .preview-container {
            margin-top: 20px;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .preview-item {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            background: #f9f9f9;
            transition: background-color 0.3s, border-color 0.3s;
        }
        
        body.dark-mode .preview-item {
            border-color: #555;
            background: #333;
            color: #ddd;
        }
        
        .preview-item img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        
        .preview-item input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 12px;
            background-color: #fff;
            color: #333;
            transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }
        
        body.dark-mode .preview-item input {
            background-color: #444;
            color: #ddd;
            border-color: #666;
        }
        
        .preview-item .remove-btn {
            width: 100%;
            margin-top: 5px;
            padding: 6px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.3s;
        }
        
        .preview-item .remove-btn:hover {
            background: #c82333;
        }
        
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            border: 1px solid;
        }
        
        .alert-success {
            background: #e8f5e9;
            color: #2e7d32;
            border-color: #a5d6a7;
        }
        
        body.dark-mode .alert-success {
            background-color: #1b4620;
            color: #a5d6a7;
            border-color: #2e7d32;
        }
        
        .alert-error {
            background: #ffebee;
            color: #c62828;
            border-color: #ef9a9a;
        }
        
        body.dark-mode .alert-error {
            background-color: #4a1c1c;
            color: #ef9a9a;
            border-color: #c62828;
        }
        
        .btn {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-right: 10px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        
        .btn-primary {
            background: #4f46e5;
            color: white;
        }
        
        .btn-primary:hover {
            background: #3b3bbf;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #545b62;
        }
        
        .btn-success {
            background: #28a745;
            color: white;
        }
        
        .btn-success:hover {
            background: #218838;
        }
        
        .upload-info {
            background: #e9ecef;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
            transition: background-color 0.3s, border-color 0.3s;
        }
        
        body.dark-mode .upload-info {
            background: #2d3748;
            border-color: #4a5568;
            color: #e2e8f0;
        }
        
        .upload-info h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        body.dark-mode .upload-info h3 {
            color: #f7fafc;
        }
        
        .upload-info ul {
            margin: 0;
            padding-left: 20px;
        }
        
        .upload-info li {
            margin-bottom: 5px;
        }

        /* Bouton toggle */
        #theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.3s;
            font-weight: bold;
        }
        
        body.dark-mode #theme-toggle {
            background: #333;
            border-color: #555;
            color: #ddd;
        }

        /* Titre principal */
        h1 {
            color: #333;
            margin-bottom: 1.5rem;
        }
        
        body.dark-mode h1 {
            color: #f7fafc;
        }
    </style>
</head>
<body>
    <div class="page-wrapper">
        <div class="main-content">
            <div class="upload-form">
                <h1>📷 Ajouter des Images</h1>

                <div class="upload-info">
                    <h3>ℹ️ Informations importantes :</h3>
                    <ul>
                        <li>✅ <strong>Conversion automatique :</strong> Toutes les images seront automatiquement converties au format WebP</li>
                        <li>📁 <strong>Dossier de sauvegarde :</strong> ../images/bdd/</li>
                        <li>📊 <strong>Types acceptés :</strong> JPG, PNG, GIF, WEBP</li>
                        <li>💾 <strong>Taille maximale :</strong> 10Mo par fichier</li>
                        <li>🔢 <strong>Upload multiple :</strong> Vous pouvez sélectionner plusieurs images à la fois</li>
                    </ul>
                </div>

                <?php if ($success): ?>
                    <div class="alert alert-success">
                        ✅ <?php echo $uploadedCount; ?> image(s) ajoutée(s) avec succès et convertie(s) en WebP !
                        <div style="margin-top: 15px;">
                            <a href="galerie.php" class="btn btn-primary">Voir la galerie</a>
                            <button onclick="resetForm()" class="btn btn-success">Ajouter d'autres images</button>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if (!empty($errors)): ?>
                    <div class="alert alert-error">
                        <ul style="margin: 0; padding-left: 20px;">
                            <?php foreach ($errors as $error): ?>
                                <li>❌ <?php echo htmlspecialchars($error); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <form action="" method="post" enctype="multipart/form-data" id="upload-form" <?php echo $success ? 'style="display:none;"' : ''; ?>>
                    <div class="form-group">
                        <label for="images">Sélectionner les images *</label>
                        <div class="file-input-wrapper" id="drop-zone">
                            <input type="file" id="images" name="images[]" accept="image/*" multiple onchange="previewImages(event)" required style="display: none;">
                            <div>
                                📁 Cliquez ou déposez vos images ici
                                <div style="font-size: 0.9em; color: #666; margin-top: 8px;">
                                    <strong>Sélection multiple possible</strong><br>
                                    Types acceptés: JPG, PNG, GIF, WEBP (max 10Mo chacune)<br>
                                    <em>→ Conversion automatique en WebP</em>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="preview-container" class="preview-container" style="display: none;">
                        <!-- Les aperçus seront ajoutés ici par JavaScript -->
                    </div>

                    <div style="margin-top: 20px;" id="form-actions" style="display: none;">
                        <button type="submit" class="btn btn-primary">💾 Enregistrer toutes les images</button>
                        <button type="button" onclick="clearAllPreviews()" class="btn btn-secondary">🗑️ Tout effacer</button>
                        <a href="gestion_galerie.php" class="btn btn-secondary">↩ Retour</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>

    <script>
        let selectedFiles = [];

        function previewImages(event) {
            const files = Array.from(event.target.files);
            selectedFiles = files;
            displayPreviews();
        }

        function displayPreviews() {
            const container = document.getElementById('preview-container');
            const formActions = document.getElementById('form-actions');
            
            if (selectedFiles.length === 0) {
                container.style.display = 'none';
                formActions.style.display = 'none';
                return;
            }

            container.innerHTML = '';
            container.style.display = 'grid';
            formActions.style.display = 'block';

            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Aperçu ${index + 1}">
                        <input type="text" name="titres[]" placeholder="Titre (optionnel)" 
                               value="${file.name.split('.')[0]}">
                        <button type="button" class="remove-btn" onclick="removePreview(${index})">
                            ❌ Supprimer
                        </button>
                        <div style="font-size: 11px; color: #666; margin-top: 3px;">
                            ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} Mo)
                            <br>→ Sera converti en WebP
                        </div>
                    `;
                    container.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            });

            updateDropZoneText();
        }

        function removePreview(index) {
            selectedFiles.splice(index, 1);
            updateFileInput();
            displayPreviews();
        }

        function clearAllPreviews() {
            selectedFiles = [];
            document.getElementById('images').value = '';
            displayPreviews();
            resetDropZone();
        }

        function updateFileInput() {
            const input = document.getElementById('images');
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            input.files = dt.files;
        }

        function updateDropZoneText() {
            const dropZone = document.getElementById('drop-zone');
            const text = dropZone.querySelector('div div');
            if (selectedFiles.length > 0) {
                text.innerHTML = `
                    📁 ${selectedFiles.length} image(s) sélectionnée(s)
                    <div style="font-size: 0.9em; color: #666; margin-top: 8px;">
                        <strong>Cliquez pour en ajouter d'autres</strong><br>
                        Types acceptés: JPG, PNG, GIF, WEBP (max 10Mo chacune)<br>
                        <em>→ Conversion automatique en WebP</em>
                    </div>
                `;
            }
        }

        function resetDropZone() {
            const dropZone = document.getElementById('drop-zone');
            const text = dropZone.querySelector('div div');
            text.innerHTML = `
                📁 Cliquez ou déposez vos images ici
                <div style="font-size: 0.9em; color: #666; margin-top: 8px;">
                    <strong>Sélection multiple possible</strong><br>
                    Types acceptés: JPG, PNG, GIF, WEBP (max 10Mo chacune)<br>
                    <em>→ Conversion automatique en WebP</em>
                </div>
            `;
        }

        function resetForm() {
            document.getElementById('upload-form').reset();
            document.getElementById('upload-form').style.display = 'block';
            clearAllPreviews();
            document.querySelector('.alert-success').style.display = 'none';
        }

        // Drag and drop functionality
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('images');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('dragover');
        }

        function unhighlight(e) {
            dropZone.classList.remove('dragover');
        }

        dropZone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = Array.from(dt.files);
            
            // Ajouter aux fichiers existants
            selectedFiles = selectedFiles.concat(files);
            updateFileInput();
            displayPreviews();
        }

        dropZone.addEventListener('click', () => fileInput.click());

        // Gestion de la sélection multiple via le clic
        fileInput.addEventListener('change', function(e) {
            const newFiles = Array.from(e.target.files);
            selectedFiles = selectedFiles.concat(newFiles);
            displayPreviews();
        });

        // Gestion du thème
        const toggle = document.getElementById('theme-toggle');
        const body = document.body;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (localStorage.getItem('theme') === 'dark' || (prefersDark && !localStorage.getItem('theme'))) {
            body.classList.add('dark-mode');
            toggle.textContent = '☀️ Mode clair';
        }

        toggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                toggle.textContent = '☀️ Mode clair';
                localStorage.setItem('theme', 'dark');
            } else {
                toggle.textContent = '🌙 Mode sombre';
                localStorage.setItem('theme', 'light');
            }
        });
    </script>
</body>
</html>