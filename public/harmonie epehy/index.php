<?php
// Vérification de la maintenance (doit être en premier)
require_once __DIR__ . '/include/maintenance_check.php';

require "connexion.php";
include 'header.php';

$month = isset($_GET['month']) ? intval($_GET['month']) : date('m');
$year = isset($_GET['year']) ? intval($_GET['year']) : date('Y');

?>
<!DOCTYPE html>
<html lang="fr" data-bs-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OHE - Orchestre d'Harmonie d'Epehy</title>
  <link rel="canonical" href="https://www.harmonie-epehy.fr/" />
  <!-- meta description --> 
  <meta name="description" content="L'Orchestre d'Harmonie d'Epehy est un orchestre de musique classique qui joue dans la région des Haut de France. Il est composé de musiciens amateurs et professionnels qui jouent ensemble pour offrir des concerts de haute qualité." />
  <!-- meta keywords -->
  <meta name="keywords" content="orchestre, harmonie, epehy, musique, concert, haut-de-france" />
  <!-- meta author -->
  <meta name="author" content="Orchestre d'Harmonie d'Epehy" />
  <!-- meta robots -->
  <meta name="robots" content="index, follow" />
  <meta name="googlebot" content="index, follow" />
  <meta name="google" content="notranslate" />
  <meta name="google-site-verification" content="google-site-verification=google-site-verification" />
  <link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

  <style>
    :root {
      --main-bg: #6a1b3f; /* bordeaux */
      --accent: #d4af37; /* doré */
      --text: #ffffff;
      --hover: #ffffffcc;
      --main-bordeaux: #6a1b3f;
      --main-or: #d4af37;
    }

    body {
      font-family: 'Roboto', sans-serif;
      background: #fff;
      color: #333;
      transition: background-color 0.3s, color 0.3s;
    }

    nav {
      background-color: var(--main-bg);
      color: var(--text);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: background-color 0.3s, color 0.3s;
    }

    .logo {
      font-weight: 700;
      font-size: 1.6rem;
      color: var(--text);
    }

    .logo span {
      color: var(--accent);
    }

    .nav-links {
      list-style: none;
      display: flex;
      gap: 2rem;
      padding-left: 0;
      margin-bottom: 0;
      flex-wrap: wrap;
    }

    .nav-links a {
      color: var(--text);
      text-decoration: none;
      font-weight: 500;
    }

    .nav-links a:hover {
      color: var(--hover);
    }

    h1, h2 {
      color: var(--main-bordeaux);
      font-weight: 700;
      margin-bottom: 1rem;
      position: relative;
      padding-bottom: 0.5rem;
      transition: color 0.3s;
    }

    h1::after,
    h2::after {
      content: "";
      display: block;
      width: 50%;
      max-width: 300px;
      height: 4px;
      background-color: var(--main-or);
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 2px;
      transition: background-color 0.3s;
    }

    #accueil h1 {
  color: #fff;
  padding-bottom: 0;
  margin-bottom: 1rem;
  word-break: break-word; /* Ajouté pour une meilleure coupure si besoin */
  text-wrap: balance; /* Pour un meilleur rendu sur 2 lignes équilibrées */
}

    #accueil h1::after {
      content: none;
    }

    .galerie-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
    }

    .lightbox {
      display: none;
      position: fixed;
      z-index: 1050;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.8);
      justify-content: center;
      align-items: center;
    }

    .lightbox img {
      max-width: 90%;
      max-height: 90%;
    }

    .btn-outline-primary {
      border-color: var(--main-bordeaux);
      color: var(--main-bordeaux);
    }

    .btn-outline-primary:hover {
      background-color: var(--main-bordeaux);
      color: var(--text);
      border-color: var(--main-bordeaux);
    }

    form {
      max-width: 600px;
      margin: auto;
      padding: 2rem 1rem;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    button[type="submit"] {
      background-color: var(--main-bordeaux);
      color: var(--text);
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 5px;
      cursor: pointer;
    }

    button[type="submit"]:hover {
      background-color: #581437;
    }
    .card-img-top {
  height: auto;
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin: auto;
}


    @media (max-width: 768px) {
      .nav-links {
        flex-direction: column;
        gap: 1rem;
      }
    }
    @media (max-width: 576px) {
  #accueil h1 {
    font-size: 1.5rem;
  }
}
.scroll-down {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  width: 30px;
  height: 50px;
  border: 2px solid #fff;
  border-radius: 25px;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
  transition: opacity 0.3s;
  z-index: 10;
}

.scroll-down span {
  display: block;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  margin: 10px auto 0;
  animation: scroll-down 1.5s infinite;
}

@keyframes scroll-down {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(10px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .scroll-down {
    bottom: 15px;
    width: 24px;
    height: 40px;
  }
}

  </style>
</head>
<body>


<section id="accueil" class="text-center bg-dark text-white py-5">
  <div class="container">
    <h1>Bienvenue à l'Orchestre d'Harmonie d'Épehy</h1>
    <p>Découvrez notre univers musical et nos événements à venir.</p>
  </div>
  <a href="#apropos" class="scroll-down">
  <span></span>
</a>

</section>

<section id="apropos" class="py-5">
  <h2 class="text-center mb-4">Qui sommes-nous ?</h2>
  <?php
  $stmt = $pdo->prepare("SELECT text FROM contenu WHERE id = 1");
  $stmt->execute();
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if ($row) {
      echo '<div class="container"><p>' . nl2br(htmlspecialchars($row['text'])) . '</p></div>';
  }
  ?>
</section>

<section id="concerts" class="py-5 bg-light">
  <h2 class="text-center mb-4">Nos concerts</h2>
  <div class="container">
    <div class="row row-cols-2 row-cols-sm-3 row-cols-md-5 g-4 justify-content-center">
      <?php
      // 2 concerts passés + concerts futurs
      $stmt = $pdo->prepare("SELECT * FROM concert WHERE date < NOW() ORDER BY date DESC LIMIT 2");
      $stmt->execute();
      $concerts_passes = $stmt->fetchAll(PDO::FETCH_ASSOC);

      $stmt = $pdo->prepare("SELECT * FROM concert WHERE date >= NOW() ORDER BY date ASC");
      $stmt->execute();
      $concerts_avenir = $stmt->fetchAll(PDO::FETCH_ASSOC);

      $concerts = array_merge($concerts_passes, $concerts_avenir);

      if (count($concerts) > 0):
        foreach ($concerts as $concert):
          $isPast = strtotime($concert['date']) < time();
      ?>
      <div class="col text-center <?= $isPast ? 'opacity-75' : '' ?>">
        <?php if (!empty($concert['affiche'])): ?>
          <?php $src = 'data:image/jpeg;base64,' . base64_encode($concert['affiche']); ?>
          <img src="<?= $src ?>" class="galerie-img mb-2" alt="Affiche du concert" onclick="openLightbox(this)">
        <?php endif; ?>
        <div>
          <strong><?= htmlspecialchars($concert['titre']) ?></strong><br>
          <small><?= date('d/m/Y', strtotime($concert['date'])) ?></small>
        </div>
      </div>
      <?php endforeach; else: ?>
        <p class="text-center">Aucun concert à afficher.</p>
      <?php endif; ?>
    </div>
  </div>
</section>




<section id="galerie" class="container py-5">
  <h2 class="text-center mb-4">Galerie</h2>

  <div class="text-center mt-4">
    <a href="galerie_client.php" class="btn btn-outline-primary">Voir toute la galerie</a>
  </div>
</section>

<!-- Lightbox -->
<div id="lightbox" class="lightbox" onclick="closeLightbox()">
  <img id="lightbox-img" src="" alt="Agrandissement">
</div>

<section id="contact" class="py-5 bg-light">
  <div class="container">
    <h2 class="text-center mb-4">Contactez-nous</h2>
    
    <?php
    // Afficher les messages de succès
    if (isset($_SESSION['contact_succes'])): ?>
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <?= htmlspecialchars($_SESSION['contact_succes']) ?>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <?php unset($_SESSION['contact_succes']); ?>
    <?php endif; ?>
    
    <?php
    // Afficher les messages d'erreur
    if (isset($_SESSION['contact_erreurs']) && !empty($_SESSION['contact_erreurs'])): ?>
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Erreur(s) :</strong>
        <ul class="mb-0">
          <?php foreach ($_SESSION['contact_erreurs'] as $erreur): ?>
            <li><?= htmlspecialchars($erreur) ?></li>
          <?php endforeach; ?>
        </ul>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <?php 
      $nom_saved = $_SESSION['contact_nom'] ?? '';
      $email_saved = $_SESSION['contact_email'] ?? '';
      $message_saved = $_SESSION['contact_message'] ?? '';
      unset($_SESSION['contact_erreurs']);
      ?>
    <?php else: ?>
      <?php
      $nom_saved = '';
      $email_saved = '';
      $message_saved = '';
      ?>
    <?php endif; ?>
    

    <!-- Formulaire principal -->
    <form method="POST" action="traitement_contact.php" class="mt-4">

      <p class="small text-muted mb-3">
        Les informations recueillies via ce formulaire sont utilisées uniquement pour répondre à votre message
        et, si nécessaire, vous recontacter. Elles ne seront jamais transmises à des tiers.
      </p>

      <div class="mb-3">
        <input type="text" 
               name="nom" 
               class="form-control" 
               placeholder="Votre nom" 
               value="<?= htmlspecialchars($nom_saved) ?>"
               required>
      </div>

      <div class="mb-3">
        <input type="email" 
               name="email" 
               class="form-control" 
               placeholder="Votre email" 
               value="<?= htmlspecialchars($email_saved) ?>"
               required>
      </div>

      <div class="mb-3">
        <textarea name="message" 
                  class="form-control" 
                  placeholder="Votre message" 
                  rows="5" 
                  required><?= htmlspecialchars($message_saved) ?></textarea>
      </div>

      <!-- Mention RGPD -->
      <div class="form-check mb-3">
        <input class="form-check-input" type="checkbox" name="rgpd" id="rgpd" required>
        <label class="form-check-label small text-muted" for="rgpd">
          J’accepte que mes informations soient utilisées pour le traitement de ma demande, conformément au RGPD.
        </label>
      </div>

      <p class="small text-muted">
        Responsable des données : Orchestre d’Harmonie d’Épehy – admin@orchestre-epehy.fr  
        Vos données sont conservées au maximum 12 mois.  
        Vous pouvez demander leur suppression, rectification ou consultation à tout moment.
      </p>

      <div class="text-center">
        <button type="submit" class="btn btn-primary">Envoyer</button>
      </div>
    </form>

  </div>
</section>


<script>
  // Galerie lightbox
  function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  }
  function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
  }
</script>

<?php include 'footer.php'; ?>
</body>
</html>
