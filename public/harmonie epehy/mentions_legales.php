<?php
// Vérification de la maintenance (doit être en premier)
require_once __DIR__ . '/include/maintenance_check.php';

require "connexion.php";
include 'header.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mentions Légales - Orchestre d'Harmonie d'Épehy</title>
  <link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

<section class="container my-5">
  <h1 class="text-center mb-4">Mentions Légales</h1>

  <h2>Éditeur du site</h2>
  <p>Ce site est édité et développé par <strong>Ferrand Tobias</strong>, éditeur complet du site.</p>

  <h2>Directeur de la publication</h2>
  <p>Le directeur de la publication est l’Orchestre d’Harmonie d’Épehy.</p>

  <h2>Hébergement</h2>
  <p>Le site est hébergé par :<br/>
    OVH SAS<br/>
    2 rue Kellermann<br/>
    59100 Roubaix - France<br/>
    Téléphone : +33 9 72 10 10 07<br/>
    Site web : <a href="https://www.ovh.com" target="_blank" rel="noopener noreferrer">https://www.ovh.com</a>
  </p>

  <h2>Propriété intellectuelle</h2>
  <p>Tous les contenus présents sur ce site (textes, photos, noms, prénoms, logos, vidéos, graphiques, etc.) sont la propriété exclusive de l’Orchestre d’Harmonie d’Épehy ou de leurs auteurs respectifs. Toute reproduction, distribution ou modification, même partielle, est interdite sans autorisation écrite préalable.</p>

  <h2>Protection des données personnelles</h2>
  <p>Certaines données personnelles telles que les noms, prénoms et photos peuvent apparaître sur ce site. Elles sont publiées avec l’accord des personnes concernées et sont traitées conformément à notre <a href="politique_confidentialite.php">politique de confidentialité</a>.</p>

  <h2>Contact</h2>
  <p>Pour toute question, veuillez nous contacter à l’adresse email : <a href="mailto:contact@orchestre-epehy.fr">contact@orchestre-epehy.fr</a></p>
</section>

<?php include 'footer.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
