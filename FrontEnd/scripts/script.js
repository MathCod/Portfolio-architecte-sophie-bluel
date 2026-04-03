/**
 * @file script.js
 * @description Ce fichier contient le coeur de la page d'acceuil
 */

import { 
    generertravaux, 
    activeButton, 
    checkAdmin, 
    genererModalGallery, 
    setupModalNavigation,
    setupAddPhoto
} from "./function.js"

import {
    fetchWorks,
    fetchCategories
} from "./API.js"

// Variable tableau pour stocker les travaux
let travaux = []

// On crée une fonction d'initialisation pour tout lancer dans l'ordre
async function init() {
    // 1. On attend d'avoir les travaux
    travaux = await fetchWorks()
    generertravaux(travaux)
    genererModalGallery(travaux)

    // 2. On attend d'avoir les catégories
    const categories = await fetchCategories()
    
    // 3. On génère les filtres maintenant qu'on a tout
    const filtresContainer = document.querySelector(".filters")
    
    // Bouton Tous
    const btnTous = document.createElement("button")
    btnTous.innerText = "Tous"
    btnTous.classList.add("filter-button", "filter-active")
    btnTous.addEventListener("click", () => {
        generertravaux(travaux)
        activeButton(btnTous)
    })
    filtresContainer.appendChild(btnTous)

    // Autres boutons
    for (const category of categories) {
        const btn = document.createElement("button")
        btn.innerText = category.name
        btn.classList.add("filter-button")
        btn.addEventListener("click", () => {
            const travauxFiltres = travaux.filter(projet => projet.categoryId === category.id)
            generertravaux(travauxFiltres)
            activeButton(btn)
        })
        filtresContainer.appendChild(btn)
    }

    checkAdmin()
    setupModalNavigation()
    setupAddPhoto()
}

// On lance le site
init()