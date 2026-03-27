<?php
require_once '../connexion.php';
require 'auth.php';
require '../include/header.php';
include 'slidebar.php';

$medias = $pdo->query("SELECT * FROM galerie ORDER BY date_ajout DESC")->fetchAll();
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

    .main-content {
        margin-left: 240px;
        padding: 2rem;
        min-height: 100vh;
        background-color: #fff;
        transition: background-color 0.3s, color 0.3s;
    }
    
    body.dark-mode .main-content {
        background-color: #1e1e1e;
        color: #ddd;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 2rem;
    }

    .header-actions h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
        transition: color 0.3s;
    }
    
    body.dark-mode .header-actions h1 {
        color: #f7fafc;
    }

    .header-actions a.button-add {
        padding: 10px 20px;
        background-color: #4f46e5;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        font-size: 0.9rem;
        user-select: none;
        transition: background-color 0.3s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    .header-actions a.button-add:hover {
        background-color: #3b3bbf;
    }

    .galerie {
        max-width: 1200px;
        margin: 0 auto;
    }

    .media-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 0;
    }

    .media-card {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 15px;
        background-color: #f8f8f8;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        text-align: center;
        display: flex;
        flex-direction: column;
    }
    
    body.dark-mode .media-card {
        background-color: #2c2c2c;
        border-color: #555;
        box-shadow: 0 2px 15px rgba(255,255,255,0.1);
        color: #ddd;
    }

    .media-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }
    
    body.dark-mode .media-card:hover {
        box-shadow: 0 5px 25px rgba(255,255,255,0.2);
    }

    .media-card img,
    .media-card video {
        max-width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 8px;
        margin: 10px 0;
        transition: transform 0.3s ease;
    }
    
    .media-card img:hover,
    .media-card video:hover {
        transform: scale(1.02);
    }

    .media-title {
        font-weight: bold;
        margin-bottom: 8px;
        font-size: 1.1rem;
        color: #333;
        transition: color 0.3s;
        word-wrap: break-word;
    }
    
    body.dark-mode .media-title {
        color: #f7fafc;
    }

    .media-date {
        font-size: 0.85rem;
        color: #666;
        margin: 10px 0;
        transition: color 0.3s;
    }
    
    body.dark-mode .media-date {
        color: #a0a0a0;
    }

    .media-actions {
        margin-top: auto;
        padding-top: 10px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .delete-button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        background-color: #dc3545;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: bold;
        transition: background-color 0.3s, transform 0.2s;
    }

    .delete-button:hover {
        background-color: #c82333;
        transform: scale(1.05);
    }

    .view-button {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: bold;
        transition: background-color 0.3s, transform 0.2s;
    }

    .view-button:hover {
        background-color: #218838;
        transform: scale(1.05);
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #666;
        font-size: 1.1rem;
        grid-column: 1 / -1;
    }
    
    body.dark-mode .empty-state {
        color: #a0a0a0;
    }

    .empty-state .emoji {
        font-size: 4rem;
        margin-bottom: 20px;
        display: block;
    }

    /* Media queries pour responsive */
    @media (max-width: 768px) {
        .main-content {
            margin-left: 0;
            padding: 1rem;
        }
        
        .header-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .media-gallery {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .media-card img,
        .media-card video {
            height: 150px;
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

    /* Animation de chargement pour les images */
    .media-card img {
        opacity: 0;
        animation: fadeIn 0.5s ease-in forwards;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

    /* Style pour les vidéos */
    .media-card video {
        background-color: #000;
    }
    
    body.dark-mode .media-card video {
        background-color: #111;
    }

    /* Indicateur de type de média */
    .media-type-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: bold;
    }
    
    .media-card {
        position: relative;
    }

    /* Amélioration des statistiques */
    .gallery-stats {
        background: #e9ecef;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.3s, color 0.3s;
    }
    
    body.dark-mode .gallery-stats {
        background: #2d3748;
        color: #e2e8f0;
    }

    .gallery-stats .stat-item {
        text-align: center;
    }

    .gallery-stats .stat-number {
        font-size: 1.5rem;
        font-weight: bold;
        color: #4f46e5;
    }
    
    body.dark-mode .gallery-stats .stat-number {
        color: #6366f1;
    }

    .gallery-stats .stat-label {
        font-size: 0.9rem;
        color: #666;
        margin-top: 4px;
    }
    
    body.dark-mode .gallery-stats .stat-label {
        color: #a0a0a0;
    }
</style>

<main class="main-content">
    <div class="header-actions">
        <h1>📸 Gestion de la galerie</h1>
        <a href="ajouter_photo.php" class="button-add">➕ Ajouter une image</a>
    </div>

    <?php if (!empty($medias)): ?>
        <div class="gallery-stats">
            <div class="stat-item">
                <div class="stat-number"><?= count($medias) ?></div>
                <div class="stat-label">Médias total</div>
            </div>
            <div class="stat-item">
                <div class="stat-number"><?= count(array_filter($medias, fn($m) => str_starts_with($m['type_mime'], 'image'))) ?></div>
                <div class="stat-label">Images</div>
            </div>
        </div>
    <?php endif; ?>

    <section class="galerie">
        <div class="media-gallery">
            <?php if (empty($medias)): ?>
                <div class="empty-state">
                    <span class="emoji">📷</span>
                    <div>Aucun média trouvé dans la galerie.</div>
                    <div style="margin-top: 15px;">
                        <a href="ajouter_photo.php" class="button-add">➕ Ajouter votre première image</a>
                    </div>
                </div>
            <?php else: ?>
                <?php foreach ($medias as $media): ?>
                    <div class="media-card">
                        <?php if (str_starts_with($media['type_mime'], 'image')): ?>
                    
                            <img src="../<?= htmlspecialchars($media['chemin']) ?>" 
                                 alt="<?= htmlspecialchars($media['titre']) ?>"
                                 loading="lazy">
                        <?php elseif (str_starts_with($media['type_mime'], 'video')): ?>
                            <div class="media-type-indicator">🎥 Vidéo</div>
                            <video controls preload="metadata">
                                <source src="../<?= htmlspecialchars($media['chemin']) ?>" 
                                        type="<?= htmlspecialchars($media['type_mime']) ?>">
                                Votre navigateur ne supporte pas les vidéos HTML5.
                            </video>
                        <?php else: ?>
                            <div class="media-type-indicator">❓ Inconnu</div>
                            <div style="padding: 60px 20px; background: #f8f9fa; border-radius: 8px; color: #666;">
                                <p>📄 Type de média non supporté</p>
                                <small><?= htmlspecialchars($media['type_mime']) ?></small>
                            </div>
                        <?php endif; ?>
                        
                        <div class="media-title"><?= htmlspecialchars($media['titre']) ?></div>
                        <div class="media-date">
                            📅 Ajouté le <?= date('d/m/Y', strtotime($media['date_ajout'])) ?>
                            <br>
                            🕐 à <?= date('H:i', strtotime($media['date_ajout'])) ?>
                        </div>
                        
                        <div class="media-actions">
                            <a class="view-button" href="../<?= htmlspecialchars($media['chemin']) ?>" target="_blank">
                                👁️ Voir
                            </a>
                            <a class="delete-button" 
                               href="supprimer_image.php?id=<?= $media['id'] ?>" 
                               onclick="return confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce média ?\n\nCette action est irréversible.')">
                                🗑️ Supprimer
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </section>
</main>

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

    // Animation au scroll (optionnel)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer toutes les cartes média
    document.querySelectorAll('.media-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Lazy loading amélioré pour les images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.media-card img').forEach(img => {
        imageObserver.observe(img);
    });
</script>

<?php require '../include/footer.php'; ?>