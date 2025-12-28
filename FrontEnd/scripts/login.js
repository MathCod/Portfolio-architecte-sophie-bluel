/**
 * @file login.js
 * @description Ce fichier contient le script pour la page de login.
 * Effectue l'appel API (POST), stocke le Token et redirige vers l'accueil.
 */

import { loginUser } from "./API.js"

// On sélectionne le formulaire
const form = document.querySelector("#login-form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // On récupère les valeurs des champs
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    try {
        // Appel propre à l'API
        const data = await loginUser(email, password);
        
        // Si on arrive ici, c'est que c'est réussi (sinon ça va dans le catch)
        console.log("Connexion réussie !");
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";

    } catch (error) {
        // Gestion des erreurs
        console.error(error);
        const errorText = document.querySelector(".error-text");
        errorText.innerHTML = ""; 
        
        const errorBalise = document.createElement("p");
        errorBalise.innerHTML = `E-mail ou mot de passe incorrect.`;
        errorBalise.style.color = "red";
        errorBalise.style.fontStyle = "italic";
        errorText.appendChild(errorBalise);
    }
})