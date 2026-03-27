<?php
require_once '../connexion.php';
require 'auth.php';

// Vérification de l'ID du membre
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: gestion_membre.php');
    exit;
}

$id = (int) $_GET['id'];

// Récupération des données du membre
$stmt = $pdo->prepare("SELECT * FROM membre WHERE id = ?");
$stmt->execute([$id]);
$membre = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$membre) {
    header('Location: gestion_membre.php');
    exit;
}

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = trim($_POST['nom'] ?? '');
    $prenom = trim($_POST['prenom'] ?? '');
    $instrument = trim($_POST['instrument'] ?? '');
    $biographie = trim($_POST['biographie'] ?? '');
    $date_naissance = $_POST['date_naissance'] ?? '';
    $formation = $_POST['formation'] ?? '';
    $experience = $_POST['experience'] ?? '';
    $repertoire = $_POST['repertoire'] ?? '';

    // Validation
    if ($nom === '') $errors[] = "Le nom est obligatoire.";
    if ($prenom === '') $errors[] = "Le prénom est obligatoire.";
    if ($instrument === '') $errors[] = "L'instrument est obligatoire.";

    // Gestion du fichier photo
    $photoData = $membre['photo']; // Garder la photo existante par défaut
    if (!empty($_FILES['photo']['tmp_name'])) {
        $fileTmp = $_FILES['photo']['tmp_name'];
        $fileType = mime_content_type($fileTmp);
        if (strpos($fileType, 'image/') !== 0) {
            $errors[] = "Le fichier photo doit être une image.";
        } else {
            $photoData = file_get_contents($fileTmp);
        }
    }

    // Conversion des listes en JSON
    $formation_json = null;
    $experience_json = null;
    $repertoire_json = null;

    if (!empty($formation)) {
        $formation_array = array_filter(array_map('trim', explode("\n", $formation)));
        $formation_json = json_encode($formation_array);
    }

    if (!empty($experience)) {
        $experience_array = array_filter(array_map('trim', explode("\n", $experience)));
        $experience_json = json_encode($experience_array);
    }

    if (!empty($repertoire)) {
        $repertoire_array = array_filter(array_map('trim', explode("\n", $repertoire)));
        $repertoire_json = json_encode($repertoire_array);
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare("UPDATE membre SET nom = ?, prenom = ?, instrument = ?, photo = ?, biographie = ?, date_naissance = ?, formation = ?, experience = ?, repertoire = ? WHERE id = ?");
        $stmt->execute([$nom, $prenom, $instrument, $photoData, $biographie, $date_naissance, $formation_json, $experience_json, $repertoire_json, $id]);
        header('Location: gestion_membre.php');
        exit;
    }
}
// Validation des données formation, experience et repertoire
if (!empty($formation)) {
    if (!is_array(json_decode($formation_json)) && $formation !== $formation_text) {
        $errors[] = "Le format de la formation n'est pas valide.";
    }
}

if (!empty($experience)) {
    if (!is_array(json_decode($experience_json)) && $experience !== $experience_text) {
        $errors[] = "Le format de l'expérience n'est pas valide.";
    }
}

if (!empty($repertoire)) {
    if (!is_array(json_decode($repertoire_json)) && $repertoire !== $repertoire_text) {
        $errors[] = "Le format du répertoire n'est pas valide.";
    }
}


// Conversion des données JSON en texte pour l'affichage
$formation_text = '';
$experience_text = '';
$repertoire_text = '';

if ($membre['formation']) {
    $formation_array = json_decode($membre['formation'], true);
    if ($formation_array) {
        $formation_text = implode("\n", $formation_array);
    }
}

if ($membre['experience']) {
    $experience_array = json_decode($membre['experience'], true);
    if ($experience_array) {
        $experience_text = implode("\n", $experience_array);
    }
}

if ($membre['repertoire']) {
    $repertoire_array = json_decode($membre['repertoire'], true);
    if ($repertoire_array) {
        $repertoire_text = implode("\n", $repertoire_array);
    }
}

require '../include/header.php';
?>

<style>
body {
    background-color: #f4f4f4;
    color: #333;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    margin-left: 20px;
}

body.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
}

.main {
    margin-left: 220px; /* largeur sidebar */
    padding: 30px 40px;
    min-height: 100vh;
    box-sizing: border-box;
    background: white;
}

body.dark-mode .main {
    background-color: #1e1e1e;
    color: #e0e0e0;
}

form {
    background: white;
    padding: 25px 30px;
    border-radius: 8px;
    max-width: 800px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
}

body.dark-mode form {
    background-color: #2c2c2c;
    color: #e0e0e0;
}

.form-section {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

body.dark-mode .form-section {
    border-bottom-color: #444;
}

.form-section:last-child {
    border-bottom: none;
}

.form-section h3 {
    color: #4f46e5;
    margin-bottom: 15px;
    font-size: 1.2rem;
}

body.dark-mode .form-section h3 {
    color: #6b73ff;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 15px;
}

@media (max-width: 768px) {
    .form-row {
        grid-template-columns: 1fr;
    }
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}

body.dark-mode label {
    color: #e0e0e0;
}

input[type="text"],
input[type="date"],
input[type="file"],
textarea {
    width: 100%;
    padding: 10px 12px;
    margin-top: 6px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
}

body.dark-mode input[type="text"],
body.dark-mode input[type="date"],
body.dark-mode input[type="file"],
body.dark-mode textarea {
    background-color: #3a3a3a;
    color: #f0f0f0;
    border: 1px solid #555;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus {
    border-color: #4f46e5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

textarea {
    min-height: 100px;
    resize: vertical;
}

.photo-preview {
    margin-top: 10px;
    text-align: center;
}

.photo-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    border: 2px solid #4f46e5;
}

.help-text {
    font-size: 0.9rem;
    color: #666;
    margin-top: 5px;
}

body.dark-mode .help-text {
    color: #aaa;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

button[type="submit"],
.btn-secondary {
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    transition: background-color 0.3s ease;
}

button[type="submit"] {
    background-color: #4f46e5;
    color: white;
    border: none;
    font-weight: 600;
}

button[type="submit"]:hover {
    background-color: #3b3bbf;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
    border: none;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

/* Conteneur bouton toggle thème */
.theme-toggle-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

#theme-toggle {
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    padding: 10px 20px;
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s;
    user-select: none;
}

#theme-toggle:hover {
    background-color: #e0e0e0;
}

body.dark-mode #theme-toggle {
    background: #333;
    border-color: #555;
    color: #eee;
}

.error {
    color: #e3342f;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
}

body.dark-mode .error {
    background-color: #2d1b1b;
    border-color: #721c24;
    color: #f8d7da;
}
</style>

<?php include 'slidebar.php'; ?>

<div class="main">
    <div class="theme-toggle-container">
        <button id="theme-toggle" class="theme-toggle">🌙 Mode sombre</button>
    </div>

    <h1>✏️ Modifier le membre</h1>

    <?php if (!empty($errors)): ?>
        <div class="error">
            <ul style="margin: 0; padding-left: 20px;">
                <?php foreach ($errors as $err): ?>
                    <li><?= htmlspecialchars($err) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="" method="post" enctype="multipart/form-data">
        <!-- Informations de base -->
        <div class="form-section">
            <h3>Informations de base</h3>
            
            <div class="form-row">
                <label for="nom">Nom :
                    <input type="text" id="nom" name="nom" required value="<?= htmlspecialchars($membre['nom']) ?>">
                </label>
                <label for="prenom">Prénom :
                    <input type="text" id="prenom" name="prenom" required value="<?= htmlspecialchars($membre['prenom']) ?>">
                </label>
            </div>

            <div class="form-row">
                <label for="instrument">Instrument :
                    <input type="text" id="instrument" name="instrument" required value="<?= htmlspecialchars($membre['instrument']) ?>">
                </label>
                <label for="date_naissance">Date de naissance :
                    <input type="date" id="date_naissance" name="date_naissance" value="<?= htmlspecialchars($membre['date_naissance'] ?? '') ?>">
                </label>
            </div>

            <label for="photo">Photo :
                <input type="file" id="photo" name="photo" accept="image/*">
                <div class="help-text">Laissez vide pour conserver la photo actuelle</div>
                <?php if ($membre['photo']): ?>
                    <div class="photo-preview">
                        <?php $base64 = base64_encode($membre['photo']); ?>
                        <img src="data:image/jpeg;base64,<?= $base64 ?>" alt="Photo actuelle">
                        <div class="help-text">Photo actuelle</div>
                    </div>
                <?php endif; ?>
            </label>
        </div>

        <!-- Biographie -->
        <div class="form-section">
            <h3>Biographie</h3>
            <label for="biographie">Biographie :
                <textarea id="biographie" name="biographie" placeholder="Décrivez le parcours musical du membre..."><?= htmlspecialchars($membre['biographie'] ?? '') ?></textarea>
                <div class="help-text">Une description détaillée du parcours musical et de l'expérience du membre</div>
            </label>
        </div>

        <!-- Formation -->
        <div class="form-section">
            <h3>Formation</h3>
            <label for="formation">Formation musicale :
                <textarea id="formation" name="formation" placeholder="Conservatoire National Supérieur de Musique de Paris&#10;Master en Interprétation Musicale&#10;Formation en direction d'orchestre"><?= htmlspecialchars($formation_text) ?></textarea>
                <div class="help-text">Une formation par ligne</div>
            </label>
        </div>

        <!-- Expérience -->
        <div class="form-section">
            <h3>Expérience</h3>
            <label for="experience">Expérience professionnelle :
                <textarea id="experience" name="experience" placeholder="Membre de l'orchestre depuis 2015&#10;Soliste dans plusieurs concerts majeurs&#10;Professeur au conservatoire régional"><?= htmlspecialchars($experience_text) ?></textarea>
                <div class="help-text">Une expérience par ligne</div>
            </label>
        </div>

        <!-- Répertoire -->
        <div class="form-section">
            <h3>Répertoire</h3>
            <label for="repertoire">Répertoire :
                <textarea id="repertoire" name="repertoire" placeholder="Musique classique : Mozart, Beethoven, Bach&#10;Musique romantique : Chopin, Liszt, Brahms&#10;Musique contemporaine : œuvres du XXe siècle"><?= htmlspecialchars($repertoire_text) ?></textarea>
                <div class="help-text">Un style ou période par ligne</div>
            </label>
        </div>

        <div class="form-actions">
            <button type="submit">💾 Enregistrer les modifications</button>
            <a href="gestion_membre.php" class="btn-secondary">❌ Annuler</a>
        </div>
    </form>
</div>

<script>
const toggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialisation mode
if (localStorage.getItem('theme') === 'dark' || (prefersDark && !localStorage.getItem('theme'))) {
    document.body.classList.add('dark-mode');
    toggle.textContent = '☀️ Mode clair';
} else {
    toggle.textContent = '🌙 Mode sombre';
}

toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const darkMode = document.body.classList.contains('dark-mode');
    toggle.textContent = darkMode ? '☀️ Mode clair' : '🌙 Mode sombre';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
});
</script>
