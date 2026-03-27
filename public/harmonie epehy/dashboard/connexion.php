<?php
require '../connexion.php';

// Redirection si déjà connecté
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}
?>
<!DOCTYPE html> 
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Connexion</title> 
<link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
</head>
<style>
body {
background: linear-gradient(135deg, #1f1c2c, #928dab);
font-family: 'Segoe UI', sans-serif;
margin: 0;
padding: 0;
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.login-container {
background-color: #fff;
padding: 30px 40px;
border-radius: 12px;
box-shadow: 0 8px 20px rgba(0,0,0,0.2);
width: 350px;
text-align: center;
}

h1 {
margin-bottom: 24px;
color: #333;
}

.login-form {
display: flex;
flex-direction: column;
}

.login-form label {
margin: 10px 0 5px;
text-align: left;
color: #444;
}

.login-form input {
padding: 10px;
border: 1px solid #ccc;
border-radius: 6px;
font-size: 14px;
}

.login-form button {
margin-top: 20px;
padding: 12px;
background-color: #4a4e69;
color: white;
font-weight: bold;
border: none;
border-radius: 6px;
cursor: pointer;
transition: background-color 0.3s ease;
}

.login-form button:hover {
background-color: #22223b;
}

.error-msg {
background-color: #ffe5e5;
color: #d10000;
padding: 10px;
border-radius: 6px;
margin-bottom: 20px;
font-size: 14px;
}
 </style>
  <body> <div class="login-container"> <h1>Connexion au Dashboard</h1>

<?php if (isset($_SESSION['error'])): ?>
  <div class="error-msg"><?= htmlspecialchars($_SESSION['error']) ?></div>
  <?php unset($_SESSION['error']); ?>
<?php endif; ?>

<form action="login.php" method="POST" class="login-form">
  <label for="username">Nom d'utilisateur :</label>
  <input type="text" name="username" id="username" required>

  <label for="password">Mot de passe :</label>
  <input type="password" name="password" id="password" required>

  <button type="submit">Se connecter</button>
</form>

</div></body> </html>