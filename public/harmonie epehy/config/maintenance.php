<?php
/**
 * Configuration de la maintenance
 * 
 * Pour activer la maintenance, changez MAINTENANCE_ENABLED à true
 * Pour désactiver, changez à false
 */
const MAINTENANCE_CODE => "tferrand.1016"

return [
    // Activer ou désactiver la maintenance
    'MAINTENANCE_ENABLED' => false, // Changez à true pour activer
    
    // Code d'accès secret pour contourner la maintenance (en JavaScript dans maintenance.html)
    // Par défaut: "OHE2024"
    // Vous pouvez le modifier dans maintenance.html dans la variable MAINTENANCE_CODE
];

