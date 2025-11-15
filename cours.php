<?php
// Page des cours BTS SIO - 1ère & 2ème année
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cours — Tobias Ferrand</title>
    <link rel="stylesheet" href="./style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Petite personnalisation pour la page cours */
        .year-selector {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1.5rem 0 2rem 0;
        }

        .year-btn {
            padding: 10px 18px;
            border-radius: 999px;
            border: 2px solid transparent;
            cursor: pointer;
            background: var(--bg-secondary);
            font-weight: 600;
            transition: var(--transition);
        }

        .year-btn.active {
            background: var(--gradient);
            color: white;
            border-color: rgba(0,0,0,0.04);
            box-shadow: var(--shadow-purple);
        }

        .course-list {
            display: none;
            gap: 1rem;
            margin-top: 1rem;
        }

        .course-list.active {
            display: grid;
        }

        .course-item {
            padding: 1rem;
            background: var(--bg-primary);
            border-radius: 8px;
            box-shadow: var(--shadow);
            border: 1px solid var(--border-color);
        }

        .meta-row {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
        }
    </style>
</head>

<body>
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html">Portfolio</a>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="index.html#accueil" class="nav-link">Accueil</a>
                <a href="veille.php" class="nav-link">Veille</a>
                <a href="#" class="nav-link">Cours</a>
                <a href="index.html#apropos" class="nav-link">À propos</a>
                <a href="index.html#competences" class="nav-link">Compétences</a>
                <a href="index.html#projets" class="nav-link">Projets</a>
                <a href="index.html#formation" class="nav-link">Formation</a>
                <a href="index.html#contact" class="nav-link">Contact</a>
            </div>
            <div class="nav-toggle" id="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <header class="hero" style="min-height:30vh; padding-top:90px;">
        <div class="hero-container container">
            <div>
                <h1 class="hero-title">Mes cours BTS SIO</h1>
            </div>
            <div class="hero-image">
                <div class="code-animation" style="width:180px;height:100px;">
                    <div class="code-line" style="width:60%"></div>
                    <div class="code-line" style="width:40%"></div>
                    <div class="code-line" style="width:75%"></div>
                </div>
            </div>
        </div>
    </header>

    <main class="container" style="padding:3rem 0;">
        <div class="meta-row">
            <div class="year-selector" role="tablist" aria-label="Sélection année">
                <button class="year-btn active" data-year="2" id="btn-2">2ème année</button>
                <button class="year-btn" data-year="1" id="btn-1">1ère année</button>
            </div>

            <div style="display:flex;gap:1rem;align-items:center;">
                <a href="https://github.com/tferrand71" id="github-link" class="btn btn-secondary">Mon GitHub</a>
            </div>
        </div>

        <section id="year-2" class="course-list active">
            <div class="course-item">
                <h3>Programmation Web</h3>
                <p>Principes avancés en HTML/CSS, JavaScript et notions de sécurité web.</p>
            </div>
            <a class="course-item">
                <h3>Base de données</h3>
                <p>Conception de schémas, SQL avancé, optimisation des requêtes, transactions et intégrité.</p>
                <a href=""</a>
            </div>
        </section>

        <section id="year-1" class="course-list">
            <div class="course-item">
                <h3>Algorithmique & Programmation (python)</h3>
                <p>Bases de la programmation, structures de contrôle, fonctions, structures de données simples.</p>
            </div>
            <div class="course-item">
                <h3>Systèmes & Réseaux</h3>
                <p>Notions de systèmes d'exploitation, réseaux locaux, configuration de base et diagnostic.</p>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container footer-content">
            <p style="margin:0;color:var(--text-light);">&copy; 2025 Tobias Ferrand</p>
            <div class="footer-links">
                <a href="https://harmonie-epehy.fr" target="_blank">Harmonie d'Épehy</a>
                <a href="index.html#projets">Projets</a>
                <a href="index.html#contact">Contact</a>
            </div>
        </div>
    </footer>

    <script>
        // Simple script pour basculer les listes selon l'année sélectionnée
        (function(){
            const buttons = document.querySelectorAll('.year-btn');
            const lists = document.querySelectorAll('.course-list');

            function setYear(year){
                buttons.forEach(b=> b.classList.toggle('active', b.getAttribute('data-year')===String(year)));
                lists.forEach(list => {
                    list.classList.toggle('active', list.id === 'year-'+year);
                });
            }

            buttons.forEach(btn => {
                btn.addEventListener('click', ()=> setYear(btn.getAttribute('data-year')));
            });
        })();
    </script>

</body>

</html>
