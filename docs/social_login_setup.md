# Configurer la Connexion Sociale (OAuth)

Actuellement, les boutons de connexion sont en mode "simulation". Pour les rendre fonctionnels, nous devons utiliser **Supabase Auth**.

Voici ce qu'il faut pour chaque fournisseur :

## 1. Prérequis Supabase
Dans votre projet Supabase (Dashboard > Authentication > Providers), vous devrez activer chaque fournisseur et y coller les clés ci-dessous.

## 2. Google (Le plus simple)
*   **Coût** : Gratuit.
*   **Plateforme** : [Google Cloud Console](https://console.cloud.google.com/)
*   **Action** :
    1.  Créer un projet.
    2.  Aller dans "APIs & Services" > "Credentials".
    3.  Créer un "OAuth Client ID" (Type: Web Application).
    4.  **Important** : Ajouter l'URL de callback de Supabase (ex: `https://votre-projet.supabase.co/auth/v1/callback`) dans les "Authorized redirect URIs".
*   **Ce qu'on récupère** : `Client ID` et `Client Secret`.

## 3. Facebook (Intermédiaire)
*   **Coût** : Gratuit.
*   **Plateforme** : [Meta for Developers](https://developers.facebook.com/)
*   **Action** :
    1.  Créer une App (Type: Consumer).
    2.  Ajouter le produit "Facebook Login".
    3.  Dans les paramètres du Login, ajouter l'URL de callback Supabase.
*   **Ce qu'on récupère** : `App ID` et `App Secret`.

## 4. Apple (Complexe & Payant)
*   **Coût** : 99$ / an (Compte Développeur Apple requis).
*   **Plateforme** : [Apple Developer Portal](https://developer.apple.com/)
*   **Action** :
    1.  Créer un "App ID".
    2.  Créer un "Service ID" (c'est lui qui gère le web login).
    3.  Créer une "Key" (Sign in with Apple).
    4.  Configurer les domaines et emails de retour.
*   **Ce qu'on récupère** : `Service ID`, `Team ID`, `Key ID`, et un fichier de clé privée (`.p8`).

## Prochaine Étape
Si vous souhaitez activer cela maintenant :
1.  Créez un projet **Supabase** (gratuit).
2.  Récupérez vos clés API (`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3.  Configurez au moins Google pour commencer (c'est le plus rapide).

Je pourrai ensuite mettre à jour le code pour utiliser `supabase.auth.signInWithOAuth()` au lieu de la simulation.
