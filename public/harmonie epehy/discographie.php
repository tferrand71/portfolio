<?php
// Vérification de la maintenance (doit être en premier)
require_once __DIR__ . '/include/maintenance_check.php';

require "connexion.php";
include 'header.php';

$cacheFile = __DIR__ . '/cache/youtube_cache.json';
$cacheDuration = 3600; // 1 heure en secondes
$data = null;
$error = null;

// Vérifier si le cache existe et est valide
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheDuration)) {
    $jsonData = file_get_contents($cacheFile);
    $data = json_decode($jsonData, true);
    if (!isset($data['items'])) {
        $error = "Cache invalide ou corrompu.";
        $data = null;
    }
} 

// Sinon appel API
if (!$data) {
    $apiKey = 'AIzaSyB2DChwi8rm9luOp7JGYsenO9RtSfTPDIQ';
    $query = urlencode("Orchestre d'Harmonie d'Epehy");
    $maxResults = 12;
    $url = "https://www.googleapis.com/youtube/v3/search?key=$apiKey&type=video&part=snippet&q=$query&maxResults=$maxResults";

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error = "Erreur cURL : " . curl_error($ch);
    } elseif ($response !== false) {
        $data = json_decode($response, true);
        if (isset($data['items'])) {
            // Sauvegarder dans le cache
            file_put_contents($cacheFile, $response);
        } else {
            $error = "Réponse API invalide.";
            $data = null;
        }
    } else {
        $error = "Réponse vide de l'API.";
    }
    curl_close($ch);
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Discographie - Orchestre d'Harmonie d'Épehy</title>
  <link rel="icon" href="/images/logo.jpg" type="image/jpeg"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

<section class="container mt-5">
  <h2 class="text-center mb-4">Discographie Vidéo</h2>

  <?php if ($error): ?>
    <div class="alert alert-danger">
      <strong>Erreur :</strong> <?= htmlspecialchars($error) ?>
    </div>
    <?php if (!empty($response)): ?>
      <pre class="bg-light p-2 small"><?= htmlspecialchars($response) ?></pre>
    <?php endif; ?>
  <?php endif; ?>

  <div class="row" id="video-container">
    <?php if (!$error && !empty($data['items'])): ?>
      <?php foreach ($data['items'] as $item): 
        if (!isset($item['id']['videoId'])) continue;
        $videoId = htmlspecialchars($item['id']['videoId']);
        $title = html_entity_decode($item['snippet']['title'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
      ?>
        <div class="col-md-4 mb-4">
          <div class="card shadow-sm">
            <iframe width="100%" height="200" src="https://www.youtube.com/embed/<?= $videoId ?>" frameborder="0" allowfullscreen></iframe>
            <div class="card-body">
              <h5 class="card-title"><?= $title ?></h5>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    <?php else: ?>
      <p class="text-center">Aucune vidéo trouvée.</p>
    <?php endif; ?>
  </div>
</section>

<?php include 'footer.php'; ?>
</body>
</html>
