/**
 * @file function.js
 * @description Ce fichier contient toutes les fonctions utilitaires pour la galerie et les filtres.
 * 
 * @param {[Object]} listeTravaux - Le tableau d'objets. Cette fonction permmet de générer la galerie de travaux.
 */

export function generertravaux(listeTravaux) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = "" // Vider la galerie avant de la remplir

    // Pour chaque "work" dans "data"
    for (const work of listeTravaux) {
        // Création des balises
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        const figcaption = document.createElement("figcaption")

        // Remplir les informations
        img.src = work.imageUrl // L'url de l'image
        img.alt = work.title    // Le texte alternatif
        figcaption.innerText = work.title // Le titre sous l'image

        // Assembler les balises
        figure.appendChild(img)
        figure.appendChild(figcaption)

        // Mettre le tout dans "gallery"
        gallery.appendChild(figure)
    }
}

/**
 * @param {HTMLElement} targetButton - Cette fonction permet de gérer l'état actif des boutons de filtre.
 */

// Fonction pour gérer l'état actif des boutons de filtre
export function activeButton(targetButton) {
    // On récupère tous les boutons
    const buttons = document.querySelectorAll(".filter-button")
    
    // On enlève la classe verte partout
    buttons.forEach(btn => btn.classList.remove("filter-active"))

    // On l'ajoute UNIQUEMENT sur le bouton cliqué
    targetButton.classList.add("filter-active")
}

/**
 * @param {Function} checkAdmin - Cette fonction vérifie si l'utilisateur est admin et adapte l'interface en conséquence.
 */

export function checkAdmin() {
    const token = localStorage.getItem("token")
    if (token) {
    // On change "login" en "logout"
    const loginLink = document.querySelector("#login-link")
    loginLink.innerHTML = '<a href="#">logout</a>'
    
    // On gère la déconnexion au clic
    loginLink.addEventListener("click", (event) => {
        event.preventDefault()
        localStorage.removeItem("token") // On supprime le token
        window.location.reload() // On recharge la page (redevient visiteur)
    })

    // On affiche la bannière noire
    const banner = document.createElement("div")
    banner.classList.add("admin-banner")
    banner.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span>Mode édition</span>
    `
    // On l'insère tout en haut du body (avant le header)
    document.body.prepend(banner)

    // On cache les filtres
    const filters = document.querySelector(".filters")
    if (filters) {
        filters.style.display = "none"
    }

    // On ajoute le bouton "Modifier" à côté du titre "Mes Projets"
    const portfolioTitle = document.querySelector("#portfolio h2")
    if (portfolioTitle) {
        const modifyBtn = document.createElement("button")
        modifyBtn.classList.add("modify-btn")
        modifyBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier'
        
        // On insère le bouton juste après le titre
        portfolioTitle.appendChild(modifyBtn)
        
        // C'est ce bouton qui ouvrira la modale plus tard !
        modifyBtn.addEventListener("click", () => {
            console.log("Ouverture de la modale...")
        })
    }}
}
