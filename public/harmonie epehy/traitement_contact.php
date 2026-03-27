<?php
// Traitement du formulaire de contact (à la racine)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Autoriser uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php#contact');
    exit();
}

// Charger la connexion BDD
require_once __DIR__ . '/connexion.php';

// Récupérer et nettoyer les données
$nom = trim($_POST['nom'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$rgpd = $_POST['rgpd'] ?? null;

$erreurs = [];

// Vérifications générales
if ($nom === '') {
    $erreurs[] = 'Le nom est requis.';
} elseif (mb_strlen($nom) > 100) {
    $erreurs[] = 'Le nom ne doit pas dépasser 100 caractères.';
}

if ($email === '') {
    $erreurs[] = "L'email est requis.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = "L'email n'est pas valide.";
} elseif (mb_strlen($email) > 255) {
    $erreurs[] = "L'email dépasse la longueur autorisée.";
}

if ($message === '') {
    $erreurs[] = 'Le message est requis.';
} elseif (mb_strlen($message) < 10) {
    $erreurs[] = 'Le message est trop court.';
} elseif (mb_strlen($message) > 5000) {
    $erreurs[] = 'Le message est trop long.';
}

// Vérification RGPD obligatoire
if (!$rgpd) {
    $erreurs[] = 'Vous devez accepter le traitement de vos données (RGPD).';
}

// Si erreurs ➜ retour au formulaire
if (!empty($erreurs)) {
    $_SESSION['contact_erreurs'] = $erreurs;
    $_SESSION['contact_nom'] = $nom;
    $_SESSION['contact_email'] = $email;
    $_SESSION['contact_message'] = $message;
    header('Location: index.php#contact');
    exit();
}

// Sauvegarde en base
try {
    $stmt = $pdo->prepare('INSERT INTO contact (nom, email, message) VALUES (:nom, :email, :message)');
    $stmt->execute(['nom' => $nom, 'email' => $email, 'message' => $message]);
} catch (Exception $e) {
    error_log('Erreur BDD contact: ' . $e->getMessage());
    $_SESSION['contact_erreurs'] = ['Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.'];
    $_SESSION['contact_nom'] = $nom;
    $_SESSION['contact_email'] = $email;
    $_SESSION['contact_message'] = $message;
    header('Location: index.php#contact');
    exit();
}

// Préparer un email de confirmation
$to = $email;
$subject = 'Confirmation de réception - Orchestre d\'Harmonie d\'Épehy';

$html_message = '<!doctype html><html lang="fr"><body>';
$html_message .= '<p>Bonjour ' . htmlspecialchars($nom) . ',</p>';
$html_message .= '<p>Nous avons bien reçu votre message. Nous vous répondrons dans les meilleurs délais.</p>';
$html_message .= '<h4>Récapitulatif :</h4>';
$html_message .= '<p><strong>Nom :</strong> ' . htmlspecialchars($nom) . '</p>';
$html_message .= '<p><strong>Email :</strong> ' . htmlspecialchars($email) . '</p>';
$html_message .= '<p><strong>Message :</strong><br>' . nl2br(htmlspecialchars($message)) . '</p>';
$html_message .= '<hr><p>Cordialement,<br>L\'équipe de l\'Orchestre d\'Harmonie d\'Épehy</p>';
$html_message .= '</body></html>';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Orchestre d'Harmonie d'Épehy <contact@orchestre-epehy.fr>\r\n";
$headers .= "Reply-To: contact@orchestre-epehy.fr\r\n";

@$sent = mail($to, $subject, $html_message, $headers);

// Message de succès
if ($sent) {
    $_SESSION['contact_succes'] = 'Votre message a été reçu. Un email de confirmation vous a été envoyé.';
} else {
    $_SESSION['contact_succes'] = 'Votre message a été enregistré. Nous vous recontacterons bientôt.';
}

// Nettoyage des champs
unset($_SESSION['contact_nom'], $_SESSION['contact_email'], $_SESSION['contact_message'], $_SESSION['contact_erreurs']);

header('Location: index.php#contact');
exit();
?>
