<?php
// Page de veille - affiche deux articles sur le développement logiciel et l'éthique informatique
?>
<!DOCTYPE html>
<html lang="fr">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Veille — Tobias Ferrand</title>
	<link rel="stylesheet" href="./style.css">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
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

	<header class="hero" style="min-height:40vh; padding-top:90px;">
		<div class="hero-container container">
			<div>
				<h1 class="hero-title">Veille technologique</h1>
				<p class="hero-subtitle">Sélection d'articles récents — développement logiciel & éthique informatique</p>
			</div>
			<div class="hero-image">
				<div class="code-animation" style="width:200px;height:120px;">
					<div class="code-line" style="width:70%"></div>
					<div class="code-line" style="width:50%"></div>
					<div class="code-line" style="width:80%"></div>
				</div>
			</div>
		</div>
	</header>

	<main class="container">
		<section class="projects articles" style="padding:4rem 0;">
			<h2 class="section-title">Articles sélectionnés</h2>
			<div class="projects-grid">
				<!-- Article 1: Développement logiciel -->
				<article class="project-card">
					<div class="project-image" style="background-image: linear-gradient(135deg, rgba(139,92,246,0.12), rgba(124,58,237,0.06));">
						<div class="project-overlay">
							<a href="https://insights.stackoverflow.com/" target="_blank" class="project-link" title="Source">
								<i class="fas fa-external-link-alt"></i>
							</a>
						</div>
					</div>
					<div class="project-content">
						<span class="project-tag">Développement</span>
						<h3>Évolution des pratiques de développement en 2025</h3>
						<p>
							Synthèse d'articles et rapports récents sur l'évolution des outils (IA assistée, CI/CD, microservices) et
							des bonnes pratiques pour rester productif et maintenable. Cet article met en avant l'importance des tests,
							de l'automatisation et de la collaboration inter-équipes.
						</p>
						<div class="project-tech">
							<span>CI/CD</span>
							<span>IA</span>
							<span>Tests</span>
						</div>
						<div class="project-links">
							<a href="https://insights.stackoverflow.com/" target="_blank" class="btn btn-sm btn-primary">Lire la source</a>
						</div>
					</div>
				</article>

				<!-- Article 2: Éthique informatique -->
				<article class="project-card">
					<div class="project-image" style="background-image: linear-gradient(135deg, rgba(192,132,252,0.12), rgba(99,102,241,0.06));">
						<div class="project-overlay">
							<a href="https://www.bbc.com/news/technology" target="_blank" class="project-link" title="Source">
								<i class="fas fa-external-link-alt"></i>
							</a>
						</div>
					</div>
					<div class="project-content">
						<span class="project-tag">Éthique</span>
						<h3>IA, vie privée et responsabilité des développeurs</h3>
						<p>
							Article de synthèse sur les enjeux éthiques liés au développement d'IA et aux algorithmes :
							transparence, biais, vie privée et responsabilité. Idées pratiques pour intégrer l'éthique dès la conception.
						</p>
						<div class="project-tech">
							<span>IA</span>
							<span>Biais</span>
							<span>Vie privée</span>
						</div>
						<div class="project-links">
							<a href="https://www.bbc.com/news/technology" target="_blank" class="btn btn-sm btn-primary">Lire la source</a>
						</div>
					</div>
				</article>
			</div>
		</section>

		<section style="padding-bottom:4rem;">
			<h2 class="section-title">Vlogs & ressources</h2>
			<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;">
				<div style="background:var(--bg-secondary);padding:1rem;border-radius:8px;box-shadow:var(--shadow);">
					<h4>Chaîne recommandée</h4>
					<p>Vlogs techniques et résumés d'articles par des développeurs — idéal pour suivre l'actualité rapidement.</p>
					<a href="https://www.youtube.com/" target="_blank" class="btn btn-sm btn-secondary">Visiter YouTube</a>
				</div>
				<div style="background:var(--bg-secondary);padding:1rem;border-radius:8px;box-shadow:var(--shadow);">
					<h4>Recherche Google Actualités</h4>
					<p>Utilisez Google Actualités pour suivre les mots-clés : "développement logiciel", "éthique IA", "biais algorithme".</p>
					<a href="https://news.google.com/" target="_blank" class="btn btn-sm btn-secondary">Ouvrir Google News</a>
				</div>
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

	<script src="./script.js"></script>
</body>

</html>
