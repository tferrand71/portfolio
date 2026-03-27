<?php
/**
 * Vérification de la maintenance
 * 
 * Ce fichier doit être inclus en haut de chaque page PHP
 * Il redirige vers maintenance.html si la maintenance est activée
 */

// Charger la configuration de maintenance
$maintenance_config_file = __DIR__ . '/../config/maintenance.php';

if (file_exists($maintenance_config_file)) {
    $maintenance_config = require $maintenance_config_file;
    
    // Vérifier si la maintenance est activée
    if (isset($maintenance_config['MAINTENANCE_ENABLED']) && $maintenance_config['MAINTENANCE_ENABLED'] === true) {
        // Récupérer l'URL actuelle pour pouvoir y retourner après authentification
        $current_url = $_SERVER['REQUEST_URI'];
        
        // Ne pas rediriger si on est déjà sur la page de maintenance
        $maintenance_page = '/maintenance.html';
        if (strpos($current_url, $maintenance_page) === false) {
            // Construire l'URL de redirection avec le paramètre return
            $maintenance_url = $maintenance_page;
            if (!empty($current_url) && $current_url !== '/') {
                $maintenance_url .= '?return=' . urlencode($current_url);
            }
            
            // Rediriger vers la page de maintenance
            header('Location: ' . $maintenance_url);
            exit();
        }
    }
}

