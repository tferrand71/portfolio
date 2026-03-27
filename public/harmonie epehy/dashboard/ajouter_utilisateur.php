<?php
require_once '../connexion.php';
require 'auth.php';

$userRole = $_SESSION['role'] ?? '';

if (!in_array($userRole, ['admin', 'président'])) {
    header('HTTP/1.1 403 Forbidden');
    echo "Accès refusé.";
    exit;
}

$errors = [];
$username = $password = $mail = $nom = $prenom = $num = $role = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $mail = trim($_POST['mail'] ?? '');
    $nom = trim($_POST['nom'] ?? '');
    $prenom = trim($_POST['prenom'] ?? '');
    $num = trim($_POST['num'] ?? '');
    $role = $_POST['role'] ?? '';

    if ($username === '') {
        $errors[] = "Le nom d'utilisateur est obligatoire.";
    }
    if ($password === '') {
        $errors[] = "Le mot de passe est obligatoire.";
    }
    if ($mail === '' || !filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'email est invalide.";
    }
    if ($nom === '') {
        $errors[] = "Le nom est obligatoire.";
    }
    if ($prenom === '') {
        $errors[] = "Le prénom est obligatoire.";
    }
    if ($role === '') {
        $errors[] = "Le rôle est obligatoire.";
    }

    if ($userRole === 'président' && in_array($role, ['admin', 'chef'])) {
        $errors[] = "Vous n'êtes pas autorisé à créer un utilisateur avec ce rôle.";
    }

    // Vérifier si username ou mail existent déjà
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM utilisateurs WHERE username = ? OR mail = ?");
    $stmt->execute([$username, $mail]);
    $count = $stmt->fetchColumn();
    if ($count > 0) {
        $errors[] = "Nom d'utilisateur ou email déjà utilisé.";
    }

    if (empty($errors)) {
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO utilisateurs (username, password, mail, nom, prenom, num, role) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$username, $passwordHash, $mail, $nom, $prenom, $num ?: null, $role]);

        header('Location: gestion_utilisateur.php?ajout=ok');
        exit;
    }
}

$roles_disponibles = ['admin', 'président', 'chef', 'contact'];
if ($userRole === 'président') {
    $roles_disponibles = ['président', 'chef', 'contact'];
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

    .form-container {
        max-width: 720px;
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

    .page-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .page-header h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
        transition: color 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    body.dark-mode .page-header h1 {
        color: #f7fafc;
    }

    .page-header .subtitle {
        margin-top: 8px;
        color: #666;
        font-size: 1.1rem;
        transition: color 0.3s;
    }
    
    body.dark-mode .page-header .subtitle {
        color: #a0a0a0;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group.full-width {
        grid-column: 1 / -1;
    }

    label {
        margin-bottom: 8px;
        font-weight: bold;
        color: #333;
        transition: color 0.3s;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    body.dark-mode label {
        color: #f7fafc;
    }

    .required {
        color: #dc3545;
    }

    input[type="text"],
    input[type="password"],
    input[type="email"],
    select {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 15px;
        background-color: #fff;
        color: #333;
        transition: all 0.3s ease;
    }
    
    body.dark-mode input[type="text"],
    body.dark-mode input[type="password"],
    body.dark-mode input[type="email"],
    body.dark-mode select {
        background-color: #444;
        color: #ddd;
        border-color: #666;
    }

    input[type="text"]:focus,
    input[type="password"]:focus,
    input[type="email"]:focus,
    select:focus {
        border-color: #4f46e5;
        outline: none;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
    
    body.dark-mode input[type="text"]:focus,
    body.dark-mode input[type="password"]:focus,
    body.dark-mode input[type="email"]:focus,
    body.dark-mode select:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .role-selector {
        position: relative;
    }

    .role-selector select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 12px center;
        background-repeat: no-repeat;
        background-size: 16px;
        padding-right: 40px;
    }

    .form-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
    }

    .btn {
        padding: 12px 24px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: #4f46e5;
        color: white;
    }

    .btn-primary:hover {
        background: #3b3bbf;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
    }

    .btn-secondary {
        background: #6c757d;
        color: white;
    }

    .btn-secondary:hover {
        background: #545b62;
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

    .alert ul {
        margin: 0;
        padding-left: 20px;
    }

    .alert li {
        margin-bottom: 5px;
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

    .role-info {
        font-size: 0.9rem;
        color: #666;
        margin-top: 5px;
        font-style: italic;
    }
    
    body.dark-mode .role-info {
        color: #a0a0a0;
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
        
        .form-grid {
            grid-template-columns: 1fr;
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

    /* Animation pour les erreurs */
    .alert-error {
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

    /* Indicateur de force du mot de passe */
    .password-strength {
        margin-top: 5px;
        height: 4px;
        background: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .password-strength-bar {
        height: 100%;
        width: 0%;
        transition: all 0.3s ease;
        border-radius: 2px;
    }

    .strength-weak { background: #dc3545; width: 25%; }
    .strength-fair { background: #fd7e14; width: 50%; }
    .strength-good { background: #ffc107; width: 75%; }
    .strength-strong { background: #28a745; width: 100%; }
</style>

<?php include 'slidebar.php'; ?>

<div class="page-wrapper">
    <main class="main-content">
        <div class="form-container">
            <div class="page-header">
                <h1>
                    👤 Ajouter un utilisateur
                </h1>
                <div class="subtitle">Créer un nouveau compte utilisateur</div>
            </div>

            <?php if ($userRole === 'président'): ?>
                <div class="info-box">
                    <strong>ℹ️ Information :</strong> En tant que président, vous pouvez créer des comptes avec les rôles : Président, Chef, Contact.
                </div>
            <?php endif; ?>

            <?php if ($errors): ?>
                <div class="alert alert-error">
                    <strong>❌ Erreurs détectées :</strong>
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?= htmlspecialchars($error) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form method="post" action="" id="user-form">
                <div class="form-grid">
                <div class="form-group">
                        <label for="nom">
                            👨 Nom <span class="required">*</span>
                        </label>
                        <input type="text" 
                               id="nom" 
                               name="nom" 
                               required 
                               value="<?= htmlspecialchars($nom) ?>"
                               placeholder="Nom de famille">
                    </div>

                    <div class="form-group">
                        <label for="prenom">
                            👤 Prénom <span class="required">*</span>
                        </label>
                        <input type="text" 
                               id="prenom" 
                               name="prenom" 
                               required 
                               value="<?= htmlspecialchars($prenom) ?>"
                               placeholder="Prénom">
                    </div>

                    <div class="form-group">
                        <label for="password">
                            🔒 Mot de passe <span class="required">*</span>
                        </label>
                        <input type="password" 
                               id="password" 
                               name="password" 
                               required
                               placeholder="Mot de passe sécurisé">
                        <div class="password-strength">
                            <div class="password-strength-bar" id="strength-bar"></div>
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label for="mail">
                            📧 Email <span class="required">*</span>
                        </label>
                        <input type="email" 
                               id="mail" 
                               name="mail" 
                               required 
                               value="<?= htmlspecialchars($mail) ?>"
                               placeholder="exemple@email.com">
                    </div>
                            <?php $username = $mail; ?>
                    <div class="form-group">
                        <label for="num">
                            📱 Numéro de téléphone
                        </label>
                        <input type="text" 
                               id="num" 
                               name="num" 
                               value="<?= htmlspecialchars($num) ?>"
                               placeholder="06 12 34 56 78">
                    </div>

                    <div class="form-group role-selector">
                        <label for="role">
                            🎭 Rôle <span class="required">*</span>
                        </label>
                        <select id="role" name="role" required>
                            <option value="">-- Choisir un rôle --</option>
                            <?php foreach ($roles_disponibles as $r): ?>
                                <option value="<?= $r ?>" <?= ($role === $r) ? 'selected' : '' ?>>
                                    <?= ucfirst($r) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <div class="role-info" id="role-info"></div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        ✅ Créer l'utilisateur
                    </button>
                    <a href="gestion_utilisateur.php" class="btn btn-secondary">
                        ↩️ Retour à la liste
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

    // Indicateur de force du mot de passe
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('strength-bar');

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthBar(strength);
    });

    function calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        return score;
    }

    function updateStrengthBar(strength) {
        strengthBar.className = 'password-strength-bar';
        
        switch (strength) {
            case 0:
            case 1:
                strengthBar.classList.add('strength-weak');
                break;
            case 2:
                strengthBar.classList.add('strength-fair');
                break;
            case 3:
            case 4:
                strengthBar.classList.add('strength-good');
                break;
            case 5:
                strengthBar.classList.add('strength-strong');
                break;
        }
    }

    // Informations sur les rôles
    const roleSelect = document.getElementById('role');
    const roleInfo = document.getElementById('role-info');

    const roleDescriptions = {
        'admin': 'Accès complet à toutes les fonctionnalités',
        'président': 'Gestion des utilisateurs et supervision générale',
        'chef': 'Gestion des équipes et projets',
        'contact': 'Accès limité aux informations de contact'
    };

    roleSelect.addEventListener('change', function() {
        const selectedRole = this.value;
        roleInfo.textContent = roleDescriptions[selectedRole] || '';
    });

    // Validation du formulaire
    const form = document.getElementById('user-form');
    form.addEventListener('submit', function(e) {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        
        if (strength < 2) {
            e.preventDefault();
            alert('⚠️ Le mot de passe est trop faible. Veuillez utiliser au moins 8 caractères avec des lettres et des chiffres.');
            passwordInput.focus();
        }
    });

    // Auto-génération du nom d'utilisateur
    const nomInput = document.getElementById('nom');
    const prenomInput = document.getElementById('prenom');
    const usernameInput = document.getElementById('username');

    function generateUsername() {
        const nom = nomInput.value.toLowerCase().trim();
        const prenom = prenomInput.value.toLowerCase().trim();
        
        if (nom && prenom && !usernameInput.value) {
            usernameInput.value = prenom.charAt(0) + nom;
        }
    }

    nomInput.addEventListener('blur', generateUsername);
    prenomInput.addEventListener('blur', generateUsername);
</script>

<?php require '../include/footer.php'; ?>