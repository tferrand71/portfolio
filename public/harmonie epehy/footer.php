<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        .footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 14px;
            border-top: 2px solid #555;
            flex-shrink: 0; /* ne pas rétrécir */
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
            margin: 0 5px;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        .footer .creator {
            margin-top: 8px;
            font-style: italic;
            font-size: 13px;
            color: #ccc;
        }

        /* Style spécifique pour le lien du créateur afin qu'il s'intègre mieux */
        .footer .creator a {
            color: #ccc;
            margin: 0;
            text-decoration: underline;
        }

        .footer .creator a:hover {
            color: #ffffff;
        }
    </style>
</head>
<body>

<footer class="footer">
    <p>&copy; <?php echo date("Y"); ?> Orchestre d'Harmonie d'Epehy — Tous droits réservés.</p>
    <p>
        <a href="mentions_legales.php">Mentions légales</a> |
        <a href="politique_confidentialité.php">Politique de confidentialité</a> |
        <a href="cgu.php">Conditions Générales d’Utilisation</a> |
        <a href="index.php#contact">Contact</a>
    </p>
    <p class="creator">
        Site créé par <a href="https://tobias-ferrand.ovh" target="_blank" rel="noopener">Tobias Ferrand</a>
    </p>
</footer>

</body>
</html>