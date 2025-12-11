/**
 * @file login.js
 * @description Ce fichier contient le script pour la page de login.
 * 
 * @param {form} addEventListener - Gère la soumission du formulaire de login.
 */

// On sélectionne le formulaire
const form = document.querySelector("#login-form")

form.addEventListener("submit", (event) => {
    event.preventDefault()

    // On récupère les valeurs des champs
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    // On prépare l'envoi
    const chargeUtile = {
        email: email,
        password: password
    }

    // On lance la requête POST
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // On dit au serveur qu'on envoie du JSON
        },
        body: JSON.stringify(chargeUtile) // On transforme l'objet JS en texte JSON
    })
    .then(response => {
        // Si le serveur ne répond pas "OK" (par exemple erreur 404)
        if (!response.ok) {
            // On lance une erreur pour aller direct au "catch"
            throw new Error("Erreur dans l'identifiant ou le mot de passe")
        }
        return response.json()
    })
    .then(data => {
        console.log("Connexion réussie ! Token :", data.token)

        // On enregistre le token dans la mémoire du navigateur
        localStorage.setItem("token", data.token)

        // On redirige vers la page d'accueil
        window.location.href = "index.html"
    })
    .catch(error => {
        // Gestion des erreurs
        console.error(error)
        alert("Erreur : email ou mot de passe incorrect.")
    })
})
