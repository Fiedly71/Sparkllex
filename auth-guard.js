async function checkAuth() {
    // 1. Vérifier si Supabase est chargé
    if (typeof supabaseClient === 'undefined') {
        console.error("Supabase n'est pas configuré");
        return;
    }

    // 2. Récupérer la session actuelle
    const { data: { session }, error } = await supabaseClient.auth.getSession();

    // 3. Si pas de session, on redirige vers le login
    if (!session || error) {
        console.warn("Accès non autorisé. Redirection...");
        // Redirection vers login (depuis les sous-dossiers, on remonte d'un niveau)
        const lang = window.getActiveLanguage ? window.getActiveLanguage() : 'en';
        window.location.href = "../login.html?lang=" + lang;
    } else {
        console.log("Accès autorisé pour :", session.user.email);
        // Optionnel : On peut afficher le nom de l'utilisateur sur la page
        const userNameElement = document.getElementById('user-name-display');
        if (userNameElement) {
            userNameElement.textContent = session.user.user_metadata.full_name || "Usuario";
        }
    }
}

// Exécuter la vérification immédiatement
checkAuth();