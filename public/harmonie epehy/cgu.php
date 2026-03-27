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
  <title>CGU - Orchestre d'Harmonie d'Épehy</title>
  <link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
  <style>
    h1, h2 {
      color: var(--main-bordeaux);
      font-weight: 700;
      margin-bottom: 1rem;
      position: relative;
      padding-bottom: 0.5rem;
    }

    h1::after, h2::after {
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
    }

    .cgu-section {
      padding: 3rem 1rem;
    }

    .cgu-section p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
  </style>
</head>
<body>

<section class="cgu-section container">
  <h1 class="text-center">Conditions Générales d’Utilisation</h1>

  <h2>1. Objet</h2>
  <p>Les présentes conditions générales ont pour objet de définir les modalités de mise à disposition des services du site de l'Orchestre d'Harmonie d'Épehy, et les conditions d’utilisation du site par l’utilisateur.</p>

  <h2>2. Acceptation des conditions</h2>
  <p>L’accès et l’utilisation du site impliquent l’acceptation pleine et entière des présentes CGU. Celles-ci peuvent être modifiées à tout moment.</p>

  <h2>3. Accès au site</h2>
  <p>Le site est accessible gratuitement à tout utilisateur disposant d’un accès à Internet. L’éditeur se réserve le droit de suspendre l’accès au site pour maintenance ou mise à jour.</p>

  <h2>4. Propriété intellectuelle</h2>
  <p>Tous les contenus présents sur ce site (textes, images, vidéos, logo...) sont la propriété exclusive de l'Orchestre d’Harmonie d’Épehy ou de ses partenaires. Toute reproduction est interdite sans autorisation.</p>

  <h2>5. Responsabilités</h2>
  <p>L’éditeur ne saurait être tenu responsable en cas de dysfonctionnement ou d’interruption du site, ni pour tout dommage résultant d’une intrusion frauduleuse ou de virus.</p>

  <h2>6. Données personnelles</h2>
  <p>Les données collectées via le formulaire de contact sont destinées uniquement à répondre à vos demandes. Elles ne sont ni revendues ni partagées. Conformément à la loi « Informatique et Libertés », vous pouvez demander l’accès, la rectification ou la suppression de vos données.</p>

  <h2>7. Droit applicable</h2>
  <p>Les présentes CGU sont régies par le droit français. Tout litige sera porté devant les tribunaux compétents.</p>

  <p class="text-end mt-4"><em>Dernière mise à jour : juin 2025</em></p>
</section>

<?php include 'footer.php'; ?>
</body>
</html>
