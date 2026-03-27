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
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Galerie complète - OHE</title>
    <link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <link rel="stylesheet" href="style.css"/>
    <style>
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
    </style>
</head>
<body>
    <section class="container my-5">
        <h2 class="text-center mb-4">Galerie complète</h2>
        
        <?php 
        $stmt = $pdo->query("SELECT * FROM galerie ORDER BY date_ajout DESC");
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);
        ?>
        
        <?php if (count($images) > 0): ?>
            <div class="row g-4">
                <?php foreach ($images as $image): ?>
                    <?php if (!empty($image['chemin'])): ?>
                        <div class="col-6 col-md-4 col-lg-3 text-center">
                            <img src="<?= htmlspecialchars($image['chemin']) ?>" 
                                 class="img-fluid rounded" 
                                 style="cursor:pointer;" 
                                 onclick="openLightbox(this)" 
                                 alt="Image"/>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <p class="text-center">Aucune image trouvée.</p>
        <?php endif; ?>
        
        <div class="text-center mt-4">
            <a href="index.php" class="btn btn-outline-secondary">Retour à l'accueil</a>
        </div>
    </section>

    <!-- Lightbox -->
    <div id="lightbox" class="lightbox" onclick="closeLightbox()">
        <img id="lightbox-img" src="" alt="Agrandissement">
    </div>

    <?php include 'footer.php'; ?>

    <script>
        function openLightbox(img) {
            const lightbox = document.getElementById("lightbox");
            const lightboxImg = document.getElementById("lightbox-img");
            lightboxImg.src = img.src;
            lightbox.style.display = "flex";
        }
        
        function closeLightbox() {
            document.getElementById("lightbox").style.display = "none";
        }
    </script>
</body>
</html>