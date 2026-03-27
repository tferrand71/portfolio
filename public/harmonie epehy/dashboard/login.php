<?php
require_once 'connexion.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $_SESSION['error'] = "Tous les champs sont obligatoires";
        header("Location: connexion.php");
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, username, password, role, mail FROM utilisateurs WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['email'] = $user['mail'] ?? null;

            header("Location: dashboard.php");
            exit;
        } else {
            $_SESSION['error'] = "Identifiants incorrects";
            header("Location: connexion.php");
            exit;
        }

    } catch (Exception $e) {
        error_log("Erreur login : " . $e->getMessage());
        $_SESSION['error'] = "Erreur technique";
        header("Location: connexion.php");
        exit;
    }
} else {
    // Interdiction d'accès direct à login.php
    header("Location: connexion.php");
    exit;
}
