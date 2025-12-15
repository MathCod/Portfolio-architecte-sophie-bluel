/**
 * @file function.js
 * @description Ce fichier contient toutes les fonctions utilitaires pour la galerie et les filtres.
 */

/* -------------------------------------------------------------------------- */
/*                                   GALERIE                                  */
/* -------------------------------------------------------------------------- */

/**
 * Génère et affiche la galerie de travaux dans le DOM.
 * @param {Array} listeTravaux - Le tableau d'objets contenant les travaux.
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
 * Génère la galerie miniature dans la modale (avec icônes poubelle).
 * @param {Array} listeTravaux - La liste des projets
 */
export function genererModalGallery(listeTravaux) {
    const modalGallery = document.querySelector(".modal-gallery")
    modalGallery.innerHTML = "" // On vide d'abord

    for (const work of listeTravaux) {
        const figure = document.createElement("figure")
        figure.classList.add("modal-figure")

        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title

        const iconContainer = document.createElement("div")
        iconContainer.classList.add("trash-container")
        
        const icon = document.createElement("i")
        icon.classList.add("fa-solid", "fa-trash-can")

        // Gestion du click sur la poubelle
        iconContainer.addEventListener("click", (e) => {
            e.preventDefault()

            // Demande de confirmation
            const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?")
            if (confirmation) {
                
                // Récupération du Token (Indispensable pour avoir le droit de supprimer)
                const token = localStorage.getItem("token")

                // Requete DELETE à l'API
                fetch(`http://localhost:5678/api/works/${work.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`, // On montre le token
                        "Content-Type": "application/json"
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // On supprime l'élément de la modale visuellement
                        figure.remove() 
                        alert("Projet supprimé avec succès !")
                        
                        // (Optionnel) Pour mettre à jour la galerie principale sans recharger la page :
                        // Tu pourrais relancer un fetch global ici, mais figure.remove() suffit pour l'instant.
                    } else {
                        alert("Erreur lors de la suppression")
                    }
                })
                .catch(error => console.error("Erreur :", error))
            }
        })
        // ----------------------------------------


        iconContainer.appendChild(icon)
        figure.appendChild(img)
        figure.appendChild(iconContainer)
        
        modalGallery.appendChild(figure)
    }
}

/* -------------------------------------------------------------------------- */
/*                                   FILTRES                                  */
/* -------------------------------------------------------------------------- */

/**
 * Gère l'état actif des boutons de filtre.
 * @param {HTMLElement} targetButton - Le bouton sur lequel on clique.
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

/* -------------------------------------------------------------------------- */
/*                               ADMIN / MODALE                               */
/* -------------------------------------------------------------------------- */

/**
 * Vérifie si l'utilisateur est admin (Token présent).
 * Si oui : affiche la bannière, le bouton logout et le bouton modifier.
 */

export function checkAdmin() {
    const token = localStorage.getItem("token")
    // Si l'utilisateur est connecté (token présent)
    if (token) {
    // On change "login" en "logout"
    const loginLink = document.querySelector("#login-link")
    loginLink.innerHTML = '<a href="#">logout</a>'
    
    // On gère la déconnexion au clic
    loginLink.addEventListener("click", (e) => {
        e.preventDefault()
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

    // On ajoute le bouton "Modifier" et ouverture de la Modale
    const portfolioTitle = document.querySelector("#portfolio h2")
    if (portfolioTitle) {
        const modifyBtn = document.createElement("button")
        modifyBtn.classList.add("modify-btn")
        modifyBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> modifier'
        
        // On insère le bouton juste après le titre
        portfolioTitle.appendChild(modifyBtn)

        // Clic sur "Modifier" -> Ouvre la modale
        modifyBtn.addEventListener("click", () => {
            const modal = document.querySelector("#modal")
            modal.style.display = "flex"
            modal.setAttribute("aria-hidden", "false")
        })
        }
        // Initialisation de la fermeture de la modale
        setupModal()
    }
}

/**
 * Initialise les événements de la modale (Fermeture).
 * Cette fonction est appelée uniquement si l'admin est connecté.
 */

export function setupModal() {
    const modal = document.querySelector("#modal")
    const closeBtn = document.querySelector(".js-modal-close")

    // Fonction pour fermer la modale
    const closeModal = () => {
        modal.style.display = "none"
        modal.setAttribute("aria-hidden", "true")
    }

    // Sélectionner la croix
    closeBtn.addEventListener("click", closeModal)

    // Clic en dehors de la fenêtre (sur le fond gris)
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal()
        }
    })

    // Ecoute le clavier et ferme la modalle avec Echap
    window.addEventListener("keydown", function (e) {
        // console.log(e.key) affiche la touche utilisée dans la console pour connaitre son nom
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
        }
    })
}

/**
 * Gère la navigation entre la galerie et l'ajout de photo dans la modale.
 */
export function setupModalNavigation() {
    const btnAddPhoto = document.querySelector(".btn-add-photo")
    const btnBack = document.querySelector(".js-modal-back")
    const galleryView = document.querySelector(".modal-gallery-view")
    const addView = document.querySelector(".modal-add-view")

    // Aller vers la modale d'ajout
    btnAddPhoto.addEventListener("click", () => {
        galleryView.style.display = "none"
        addView.style.display = "flex" // "flex" pour que le formulaire soit bien centré
        addView.style.flexDirection = "column" // Important pour le form
        btnBack.style.display = "flex" // La flèche apparaît
    });

    // 2. Retourner vers la galerie
    btnBack.addEventListener("click", () => {
        galleryView.style.display = "flex";
        addView.style.display = "none";
        btnBack.style.display = "none"; // La flèche disparaît
    });
}