/**
 * @file function.js
 * @description Ce fichier contient toutes les fonctions utilitaires pour la galerie et les filtres.
 */

import { 
    fetchCategories,
    fetchWorks,
    fetchWorksDelete,
    sendWork
 } from "./API.js"

/* -------------------------------------------------------------------------- */
/*                                   GALERIE                                  */
/* -------------------------------------------------------------------------- */

/**
 * Génère et affiche la galerie de travaux dans le DOM.
 * @param {Array} listeTravaux - Le tableau d'objets contenant les travaux.
 */
export async function generertravaux(listeTravaux) {
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = "" // Vider la galerie avant de la remplir

    // Pour chaque "work" dans "data"
    try { for (const work of listeTravaux) {
            // Création des balises
            const figure = document.createElement("figure")
            const img = document.createElement("img")
            const figcaption = document.createElement("figcaption")

            // Remplir les informations
            img.src = work.imageUrl.replace("http://localhost:5678", "https://backend-sophie-bluel-la4u.onrender.com")
            img.alt = work.title    // Le texte alternatif
            figcaption.innerText = work.title // Le titre sous l'image

            // Assembler les balises
            figure.appendChild(img)
            figure.appendChild(figcaption)

            // Mettre le tout dans "gallery"
            gallery.appendChild(figure)
        }
    } catch (error) {
        console.error(error)
        alert("Erreur lors de la création du tableau des projets (generertravaux)")
    }
}

/**
 * Génère la galerie miniature dans la modale (avec icônes poubelle).
 * @param {Array} listeTravaux - La liste des projets
 */
export function genererModalGallery(listeTravaux) {
    const modalGallery = document.querySelector(".modal-gallery")
    modalGallery.innerHTML = "" // On vide d'abord

// On parcourt la liste
    for (const work of listeTravaux) {
        const figure = document.createElement("figure")
        figure.classList.add("modal-figure")

        const img = document.createElement("img")
        img.src = work.imageUrl.replace("http://localhost:5678", "https://backend-sophie-bluel-la4u.onrender.com")
        img.alt = work.title

        const iconContainer = document.createElement("div")
        iconContainer.classList.add("trash-container")
        
        const icon = document.createElement("i")
        icon.classList.add("fa-solid", "fa-trash-can")

        iconContainer.addEventListener("click", async (e) => {
            e.preventDefault()

            const confirmation = confirm("Voulez-vous vraiment supprimer ce projet ?")
            if (confirmation) {
                const token = localStorage.getItem("token")

                // On attend (await) la réponse de l'API ---
                const isDeleted = await fetchWorksDelete(work.id, token)

                if (isDeleted) {
                    // On supprime visuellement de la modale (rapide)
                    figure.remove()
                    
                    // Message de succès
                    const deleteText = document.querySelector(".delete-text")
                    if (deleteText) {
                        deleteText.innerHTML = "Projet supprimé avec succès !"
                        deleteText.style.color = "#1D6154"
                        deleteText.style.fontWeight = "700"
                        deleteText.style.textAlign = "center"
                        deleteText.style.marginTop = "15px"
                        setTimeout(() => { deleteText.innerHTML = "" }, 5000)
                    }

                    // Mise à jour de la galerie principale
                    // On va chercher la nouvelle liste à jour sur le serveur
                    const freshWorks = await fetchWorks()
                    
                    // On donne cette nouvelle liste à la fonction qui gère l'accueil
                    generertravaux(freshWorks)

                } else {
                    alert("Erreur lors de la suppression")
                }
            }
        })

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
    try { if (token) {
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
    } catch (error) {
        alert("erreur lors de la connexion (checkAdmin)")
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
        console.log(e.key) // affiche la touche utilisée dans la console pour connaitre son nom
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
    })

    // 2. Retourner vers la galerie
    btnBack.addEventListener("click", () => {
        galleryView.style.display = "flex"
        addView.style.display = "none"
        btnBack.style.display = "none" // La flèche disparaît
    })
}

/**
 * Gère le formulaire d'ajout (Prévisualisation, Catégories, Validation).
 */
export function setupAddPhoto() {
    // Remplir les catégories
    const selectCategory = document.querySelector("#photo-category")
    
    // On réutilise l'API pour avoir les catégories à jour
    fetchCategories().then(categories => {
            // On vide le select pour ne garder que l'option par défaut
            selectCategory.innerHTML = '<option value="" disabled selected>Choisissez une catégorie</option>'
            
            categories.forEach(category => {
                const option = document.createElement("option")
                option.value = category.id
                option.innerText = category.name
                selectCategory.appendChild(option)
            })
        })

    // Prévisualisation de l'image
    const inputPhoto = document.querySelector("#photo-input")
    const previewImg = document.querySelector(".photo-preview")
    const container = document.querySelector(".add-photo-container")
    const icon = document.querySelector(".add-photo-container i")
    const label = document.querySelector(".add-photo-container label")
    const textInfo = document.querySelector(".add-photo-container p")

    inputPhoto.addEventListener("change", () => {
        const file = inputPhoto.files[0]
        
        if (file) {
            // Vérification de la taille (4mo max)
            if (file.size > 4 * 1024 * 1024) {
                alert("L'image est trop volumineuse (max 4Mo)")
                inputPhoto.value = "" // On vide l'input
                return
            }

            // On lit le fichier pour l'afficher
            const reader = new FileReader()
            reader.onload = (e) => {
                previewImg.src = e.target.result
                previewImg.style.display = "block" // On affiche l'image
                
                // On cache les éléments derrière (icône, bouton, texte)
                icon.style.display = "none"
                label.style.display = "none"
                textInfo.style.display = "none"
            }
            reader.readAsDataURL(file)
        }
    })

    // Vérification du formulaire (Bouton Gris/Vert)
    const inputTitle = document.querySelector("#photo-title")
    const btnValidate = document.querySelector("#btn-validate")

    // Fonction qui vérifie si tout est rempli
    const checkForm = () => {
        // Est-ce qu'on a une image, un titre ET une catégorie ?
        if (inputPhoto.files[0] && inputTitle.value !== "" && selectCategory.value !== "") {
            btnValidate.removeAttribute("disabled")
            btnValidate.classList.add("valid") // Deviens vert (grâce au CSS)
        } else {
            btnValidate.setAttribute("disabled", "true")
            btnValidate.classList.remove("valid") // Redeviens gris
        }
    }

    // On écoute les changements sur les 3 champs
    inputPhoto.addEventListener("change", checkForm)
    inputTitle.addEventListener("input", checkForm)
    selectCategory.addEventListener("change", checkForm)

    // --- Envoi du formulaire --- //

    const form = document.querySelector(".add-photo-form")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        
        const token = localStorage.getItem("token")
        const formData = new FormData()
        formData.append("image", inputPhoto.files[0])
        formData.append("title", inputTitle.value)
        formData.append("category", selectCategory.value)

        try {
            // Appel à l'API
            await sendWork(formData, token)

            // --- SUCCÈS => Message vert ---
            const photoText = document.querySelector(".succes")
            if (photoText) {
                photoText.innerHTML = "Projet ajouté avec succès !"
                photoText.style.color = "#1D6154"
                photoText.style.fontWeight = "700"
                photoText.style.textAlign = "center"
                photoText.style.marginTop = "15px"
                setTimeout(() => { photoText.innerHTML = "" }, 5000)
            }

            // Reset Interface
            form.reset()
            previewImg.style.display = "none"
            const icon = document.querySelector(".add-photo-container i")
            const label = document.querySelector(".add-photo-container label")
            const textInfo = document.querySelector(".add-photo-container p")
            if(icon) icon.style.display = "block"
            if(label) label.style.display = "block"
            if(textInfo) textInfo.style.display = "block"

            btnValidate.setAttribute("disabled", "true")
            btnValidate.classList.remove("valid")

            // Mise à jour des galeries
            const freshWorks = await fetchWorks()
            generertravaux(freshWorks)
            genererModalGallery(freshWorks)

        } catch (error) {
            console.error(error)
            alert("Erreur lors de l'ajout de la photo.")
        }
    })
}
