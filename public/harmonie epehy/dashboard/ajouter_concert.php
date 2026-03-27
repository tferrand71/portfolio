<?php
require_once '../connexion.php';
require_once 'auth.php';

$error = '';
$success = false;
$titre = $date = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $date = $_POST['date'] ?? '';
    $titre = $_POST['titre'] ?? '';
    $affiche = $_FILES['affiche']['tmp_name'] ?? null;

    if ($date && $titre && $affiche) {
        // Vérifier le type de fichier
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($affiche);
        
        if (in_array($fileType, $allowedTypes)) {
            // Vérifier la taille (max 10Mo)
            if ($_FILES['affiche']['size'] <= 10 * 1024 * 1024) {
                $afficheData = file_get_contents($affiche);
                $stmt = $pdo->prepare("INSERT INTO concert (date, titre, affiche) VALUES (?, ?, ?)");
                if ($stmt->execute([$date, $titre, $afficheData])) {
                    $success = true;
                } else {
                    $error = "Erreur lors de l'ajout du concert.";
                }
            } else {
                $error = "L'affiche est trop volumineuse (max 10Mo).";
            }
        } else {
            $error = "Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP.";
        }
    } else {
        $error = "Veuillez remplir tous les champs.";
    }
}

require '../include/header.php';
?>

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
        color: #222;
        transition: background-color 0.3s, color 0.3s;
        background-color: #121212; /* ou #fff si en mode clair */
    overflow-x: hidden; /* évite le débordement horizontal */
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

    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .header-actions h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
        transition: color 0.3s;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    body.dark-mode .header-actions h1 {
        color: #f7fafc;
    }

    .button-add,
    .btn {
        padding: 10px 20px;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        cursor: pointer;
        font-size: 14px;
    }

    .button-add:hover,
    .btn:hover {
        background-color: #3b3bbf;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
    }

    .btn-secondary {
        background-color: #6c757d;
    }

    .btn-secondary:hover {
        background-color: #545b62;
    }

    .btn-success {
        background-color: #28a745;
    }

    .btn-success:hover {
        background-color: #218838;
    }

    .form-container {
        max-width: 700px;
        margin: 0 auto;
        background: #f8f8f8;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: background-color 0.3s, color 0.3s;
    }
    
    body.dark-mode .form-container {
        background: #2c2c2c;
        color: #ddd;
        box-shadow: 0 2px 15px rgba(255,255,255,0.1);
    }

    .form-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .form-header h2 {
        margin: 0;
        color: #333;
        font-size: 1.5rem;
        transition: color 0.3s;
    }
    
    body.dark-mode .form-header h2 {
        color: #f7fafc;
    }

    .form-header .subtitle {
        margin-top: 8px;
        color: #666;
        font-size: 1rem;
        transition: color 0.3s;
    }
    
    body.dark-mode .form-header .subtitle {
        color: #a0a0a0;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: bold;
        color: #333;
        transition: color 0.3s;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    body.dark-mode .form-group label {
        color: #f7fafc;
    }

    .required {
        color: #dc3545;
    }

    input[type="text"],
    input[type="date"],
    input[type="file"] {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 15px;
        background-color: #fff;
        color: #333;
        transition: all 0.3s ease;
    }
    
    body.dark-mode input[type="text"],
    body.dark-mode input[type="date"],
    body.dark-mode input[type="file"] {
        background-color: #444;
        color: #ddd;
        border-color: #666;
    }

    input[type="text"]:focus,
    input[type="date"]:focus,
    input[type="file"]:focus {
        border-color: #4f46e5;
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    body.dark-mode input[type="text"]:focus,
    body.dark-mode input[type="date"]:focus,
    body.dark-mode input[type="file"]:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .file-upload-area {
        border: 2px dashed #ddd;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
        background-color: #fafafa;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    body.dark-mode .file-upload-area {
        border-color: #555;
        background-color: #333;
        color: #ddd;
    }

    .file-upload-area:hover {
        border-color: #4f46e5;
        background-color: #f0f0f0;
    }
    
    body.dark-mode .file-upload-area:hover {
        border-color: #6366f1;
        background-color: #444;
    }

    .file-upload-area.dragover {
        border-color: #4f46e5;
        background-color: #e3f2fd;
    }
    
    body.dark-mode .file-upload-area.dragover {
        border-color: #6366f1;
        background-color: #1e293b;
    }

    .file-upload-area input[type="file"] {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        top: 0;
        left: 0;
    }

    .file-upload-content {
        pointer-events: none;
    }

    .file-upload-icon {
        font-size: 3rem;
        margin-bottom: 10px;
        color: #666;
    }
    
    body.dark-mode .file-upload-icon {
        color: #a0a0a0;
    }

    .file-upload-text {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 5px;
        color: #333;
    }
    
    body.dark-mode .file-upload-text {
        color: #f7fafc;
    }

    .file-upload-subtext {
        font-size: 0.9rem;
        color: #666;
    }
    
    body.dark-mode .file-upload-subtext {
        color: #a0a0a0;
    }

    .file-preview {
        margin-top: 15px;
        text-align: center;
        display: none;
    }

    .file-preview img {
        max-width: 300px;
        max-height: 200px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .file-preview .file-info {
        margin-top: 10px;
        font-size: 0.9rem;
        color: #666;
    }
    
    body.dark-mode .file-preview .file-info {
        color: #a0a0a0;
    }

    .alert {
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 8px;
        border: 1px solid;
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

    .form-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
    }

    .info-box {
        background: #e3f2fd;
        border: 1px solid #90caf9;
        color: #1565c0;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        transition: background-color 0.3s, color 0.3s, border-color 0.3s;
    }
    
    body.dark-mode .info-box {
        background: #1e3a5f;
        border-color: #3a5998;
        color: #90caf9;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .main-content {
            margin-left: 0;
            padding: 1rem;
        }
        
        .form-container {
            padding: 20px;
        }
        
        .header-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .form-actions {
            flex-direction: column;
        }
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

    /* Animation pour les alertes */
    .alert {
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .page-wrapper {
    display: flex;
    min-height: 100vh;
    background-color: inherit;
}
body.dark-mode .page-wrapper {
    background-color: #121212;
}

</style>

<?php include 'slidebar.php'; ?>

<div class="page-wrapper">
    <main class="main-content">
        <div class="header-actions">
            <h1>🎵 Ajouter un concert</h1>
            <a href="gestion_concert.php" class="button-add">← Retour à la liste</a>
        </div>

        <div class="form-container">
            <div class="form-header">
                <h2>🎤 Nouveau concert</h2>
                <div class="subtitle">Ajoutez un nouveau concert avec son affiche</div>
            </div>

            <div class="info-box">
                <strong>ℹ️ Informations importantes :</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>📊 <strong>Formats acceptés :</strong> JPG, PNG, GIF, WEBP</li>
                    <li>💾 <strong>Taille maximale :</strong> 10Mo</li>
                    <li>🖼️ <strong>Dimensions recommandées :</strong> 1080x1350px (portrait)</li>
                </ul>
            </div>

            <?php if ($success): ?>
                <div class="alert alert-success">
                    ✅ <strong>Concert ajouté avec succès !</strong>
                    <div style="margin-top: 15px;">
                        <a href="gestion_concert.php" class="btn btn-primary">Voir la liste</a>
                        <button onclick="resetForm()" class="btn btn-success">Ajouter un autre concert</button>
                    </div>
                </div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="alert alert-error">
                    <strong>❌ Erreur :</strong> <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>

            <form method="POST" enctype="multipart/form-data" id="concert-form" <?= $success ? 'style="display:none;"' : '' ?>>
                <div class="form-group">
                    <label for="titre">
                        🎵 Titre du concert <span class="required">*</span>
                    </label>
                    <input type="text" 
                           id="titre" 
                           name="titre" 
                           required 
                           value="<?= htmlspecialchars($titre) ?>"
                           placeholder="Ex: Concert de Noël 2024">
                </div>

                <div class="form-group">
                    <label for="date">
                        📅 Date du concert <span class="required">*</span>
                    </label>
                    <input type="date" 
                           id="date" 
                           name="date" 
                           required 
                           value="<?= htmlspecialchars($date) ?>"
                           min="<?= date('Y-m-d') ?>">
                </div>

                <div class="form-group">
                    <label for="affiche">
                        🖼️ Affiche du concert <span class="required">*</span>
                    </label>
                    <div class="file-upload-area" id="upload-area">
                        <input type="file" 
                               id="affiche" 
                               name="affiche" 
                               accept="image/*" 
                               required>
                        <div class="file-upload-content">
                            <div class="file-upload-icon">📎</div>
                            <div class="file-upload-text">Cliquez ou déposez votre affiche ici</div>
                            <div class="file-upload-subtext">
                                Formats: JPG, PNG, GIF, WEBP (max 10Mo)
                            </div>
                        </div>
                    </div>
                    <div class="file-preview" id="file-preview">
                        <img id="preview-image" src="" alt="Aperçu">
                        <div class="file-info" id="file-info"></div>
                    </div>
                </div>

                <div class="form-actions">
    <button type="submit" class="btn btn-primary">
        ✅ Ajouter le concert
    </button>
    <a href="gestion_concert.php" class="btn btn-secondary">
        ❌ Annuler / ↩️ Retour
    </a>
</div>

            </form>
        </div>
    </main>
</div>

<button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>

<script>
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

    // Gestion de l'upload de fichier
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('affiche');
    const filePreview = document.getElementById('file-preview');
    const previewImage = document.getElementById('preview-image');
    const fileInfo = document.getElementById('file-info');

    // Drag & Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect(files[0]);
        }
    }

    // Sélection de fichier
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        // Vérifier le type
        if (!file.type.startsWith('image/')) {
            alert('⚠️ Veuillez sélectionner un fichier image.');
            return;
        }

        // Vérifier la taille
        if (file.size > 10 * 1024 * 1024) {
            alert('⚠️ Le fichier est trop volumineux (max 10Mo).');
            return;
        }

        // Afficher l'aperçu
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            fileInfo.innerHTML = `
                <strong>${file.name}</strong><br>
                Taille: ${(file.size / 1024 / 1024).toFixed(2)} Mo<br>
                Type: ${file.type}
            `;
            filePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Validation du formulaire
    const form = document.getElementById('concert-form');
    form.addEventListener('submit', function(e) {
        const titre = document.getElementById('titre').value.trim();
        const date = document.getElementById('date').value;
        const affiche = document.getElementById('affiche').files[0];

        if (!titre) {
            e.preventDefault();
            alert('⚠️ Veuillez saisir un titre pour le concert.');
            document.getElementById('titre').focus();
            return;
        }

        if (!date) {
            e.preventDefault();
            alert('⚠️ Veuillez sélectionner une date pour le concert.');
            document.getElementById('date').focus();
            return;
        }

        // Vérifier que la date n'est pas dans le passé
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            e.preventDefault();
            alert('⚠️ La date du concert ne peut pas être dans le passé.');
            document.getElementById('date').focus();
            return;
        }

        if (!affiche) {
            e.preventDefault();
            alert('⚠️ Veuillez sélectionner une affiche pour le concert.');
            return;
        }
    });

    // Fonction pour réinitialiser le formulaire
    function resetForm() {
        document.getElementById('concert-form').reset();
        document.getElementById('concert-form').style.display = 'block';
        filePreview.style.display = 'none';
        document.querySelector('.alert-success').style.display = 'none';
    }

    // Auto-focus sur le premier champ
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('titre').focus();
    });
</script>

<?php require '../include/footer.php'; ?>