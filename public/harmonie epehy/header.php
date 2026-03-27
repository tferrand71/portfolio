<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Orchestre d'Harmonie d'Épehy</title>
  <link rel="icon" href="/images/logo.jpg" type="image/jpeg" />
  <style>
    :root {
      --main-bg: #6a1b3f;
      --accent: #d4af37;
      --text: #ffffff;
      --hover: #ffffffcc;
    }

    .header-main * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .header-main a {
      text-decoration: none;
      color: inherit;
    }

    .header-main nav {
      background-color: var(--main-bg);
      color: var(--text);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .header-main .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.8rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      overflow-x: auto;
      gap: 1rem;
    }

    .header-main .logo {
      font-weight: 700;
      font-size: clamp(1rem, 4vw, 1.6rem);
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1;
      flex-shrink: 0;
    }

    .header-main .logo span {
      color: var(--accent);
    }

    .header-main .nav-links {
      list-style: none;
      display: flex;
      flex-wrap: nowrap;
      gap: 0.8rem;
      font-size: 0.95rem;
      align-items: center;
      margin-left: auto;
      flex-shrink: 1;
    }

    .header-main .nav-links li {
      white-space: nowrap;
    }

    .header-main .nav-links a {
      font-weight: 500;
      color: white;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .header-main .nav-links a:hover,
    .header-main .nav-links a:focus {
      color: var(--hover);
      text-decoration: none;
    }

    .header-main #menu-toggle {
      background: none;
      border: none;
      color: var(--text);
      font-size: 1.8rem;
      cursor: pointer;
      display: none;
      margin-left: auto;
    }

    .header-main .side-menu {
      height: 100%;
      width: 0;
      position: fixed;
      top: 0;
      left: 0;
      background-color: var(--main-bg);
      overflow-x: hidden;
      transition: width 0.3s ease;
      padding-top: 60px;
      z-index: 2000;
    }

    .header-main .side-menu ul {
      list-style: none;
      padding: 0 1.5rem;
    }

    .header-main .side-menu li {
      padding: 15px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-main .side-menu a {
      color: var(--text);
      font-size: 1.1rem;
      display: block;
      transition: color 0.3s ease;
    }

    .header-main .side-menu a:hover,
    .header-main .side-menu a:focus {
      color: var(--accent);
    }

    .header-main #close-menu {
      position: absolute;
      top: 15px;
      right: 20px;
      background: none;
      border: none;
      font-size: 2.5rem;
      color: var(--text);
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .header-main .nav-links {
        display: none;
      }

      .header-main #menu-toggle {
        display: block;
      }

      .header-main .side-menu.open {
        width: 250px;
      }
    }
  </style>
</head>
<body>
  <header class="header-main">
    <nav>
      <div class="nav-container">
        <div class="logo">
          Orchestre d'<span>Harmonie</span> d'Épehy
        </div>

        <button id="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="side-menu">&#9776;</button>

        <ul class="nav-links">
          <li><a href="index.php#accueil">Accueil</a></li>
          <li><a href="index.php#apropos">À propos</a></li>
          <li><a href="index.php#concerts">Concerts</a></li>
          <li><a href="index.php#galerie">Galerie</a></li>
          <li><a href="index.php#contact">Contact</a></li>
          <li><a href="discographie.php">Discographie</a></li>
          <li><a href="membres.php">Nos membres</a></li>
          <li><a href="dashboard/dashboard.php">Connexion</a></li>
        </ul>
      </div>
    </nav>

    <!-- Menu mobile -->
    <nav id="side-menu" class="side-menu" aria-label="Menu mobile" aria-hidden="true">
      <button id="close-menu" aria-label="Fermer le menu">&times;</button>
      <ul>
        <li><a href="index.php#accueil">Accueil</a></li>
        <li><a href="index.php#apropos">À propos</a></li>
        <li><a href="index.php#concerts">Concerts</a></li>
        <li><a href="index.php#galerie">Galerie</a></li>
        <li><a href="index.php#contact">Contact</a></li>
        <li><a href="discographie.php">Discographie</a></li>
        <li><a href="membres.php">Nos membres</a></li>
        <li><a href="dashboard/connexion.php">Connexion</a></li>
      </ul>
    </nav>
  </header>

  <script>
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const closeMenu = document.getElementById('close-menu');

    menuToggle.addEventListener('click', () => {
      sideMenu.classList.add('open');
      sideMenu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      closeMenu.focus();
    });

    closeMenu.addEventListener('click', () => {
      sideMenu.classList.remove('open');
      sideMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
    });

    window.addEventListener('click', (e) => {
      if (sideMenu.classList.contains('open') &&
          e.target !== menuToggle &&
          !sideMenu.contains(e.target)) {
        sideMenu.classList.remove('open');
        sideMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
        sideMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  </script>
</body>
</html>
