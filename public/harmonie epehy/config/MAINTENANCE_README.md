# Système de Maintenance

## 📋 Description

Ce système permet de mettre le site en maintenance avec une page dédiée et une authentification JavaScript par code secret.

## 🔧 Configuration

### Activer la maintenance

1. Ouvrez le fichier `config/maintenance.php`
2. Changez `'MAINTENANCE_ENABLED' => false,` en `'MAINTENANCE_ENABLED' => true,`
3. Sauvegardez le fichier

### Désactiver la maintenance

1. Ouvrez le fichier `config/maintenance.php`
2. Changez `'MAINTENANCE_ENABLED' => true,` en `'MAINTENANCE_ENABLED' => false,`
3. Sauvegardez le fichier

## 🔐 Code d'accès

Le code d'accès par défaut est : **OHE2024**

Pour modifier le code d'accès :
1. Ouvrez le fichier `maintenance.php`
2. Cherchez la ligne : `const MAINTENANCE_CODE = "OHE2024";`
3. Remplacez "OHE2024" par votre code secret
4. Sauvegardez le fichier

## 📝 Fonctionnement

### Pour les visiteurs

1. Tous les visiteurs sont redirigés vers `maintenance.php`
2. Une alerte JavaScript demande le code d'accès
3. Si le code est correct, l'utilisateur est authentifié et peut accéder au site
4. L'authentification est mémorisée dans un cookie (24 heures) et dans sessionStorage

### Pour l'administrateur

1. Accédez à n'importe quelle page du site
2. Vous serez redirigé vers la page de maintenance
3. Entrez le code d'accès dans l'alerte
4. Vous serez authentifié et redirigé vers la page demandée

## 🚀 Ajout de la vérification dans une nouvelle page

Pour ajouter la vérification de maintenance dans une nouvelle page PHP :

```php
<?php
// Vérification de la maintenance (doit être en premier)
require_once __DIR__ . '/include/maintenance_check.php';

// Votre code PHP existant...
require "connexion.php";
include 'header.php';
?>
```

**Important :** La vérification de maintenance doit être la première ligne après `<?php`, avant tout autre code.

## 📁 Fichiers du système

- `maintenance.php` - Page de maintenance affichée aux visiteurs
- `config/maintenance.php` - Configuration (activer/désactiver)
- `include/maintenance_check.php` - Script de vérification (inclus dans chaque page)

## ⚠️ Notes importantes

1. **Pages du dashboard** : Les pages du dashboard peuvent avoir leur propre système d'authentification. Vous pouvez choisir d'inclure ou non la vérification de maintenance dans ces pages.

2. **Cookies** : L'authentification est mémorisée dans un cookie qui expire après 24 heures. Vous pouvez modifier cette durée dans `maintenance.php` (ligne avec `setCookie`).

3. **Sécurité** : Le code est en JavaScript côté client. Pour une sécurité renforcée, vous pouvez ajouter une vérification côté serveur dans `maintenance_check.php`.

## 🔄 Réinitialiser l'authentification

Pour forcer un utilisateur à se réauthentifier :

1. Ouvrez la console du navigateur (F12)
2. Exécutez : `document.cookie = "maintenance_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";`
3. Exécutez : `sessionStorage.removeItem('maintenance_auth');`
4. Rechargez la page

## 📱 Compatibilité

- Compatible avec tous les navigateurs modernes
- Responsive (mobile, tablette, desktop)
- Animation et effets visuels inclus

