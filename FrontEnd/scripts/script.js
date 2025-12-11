/**
 * @file script.js
 * @description Ce fichier contient le coeur de la page d'acceuil
 */

import { generertravaux, activeButton, checkAdmin, genererModalGallery, setupModal } from "./function.js"

// Variable tableau pour stocker les travaux
let travaux = []

// Récupérer les travaux depuis l'API
fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        travaux = data // Stocker les travaux dans la variable globale
        generertravaux(travaux) // Générer la galerie avec les travaux
    })

// --- GESTION DES FILTRES ---

// Récupérer les catégories depuis l'API
fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        const filtresContainer = document.querySelector(".filters")

        // créer le bouton "Tous"
        const btnTous = document.createElement("button")
        btnTous.innerText = "Tous"
        btnTous.classList.add("filter-button", "filter-active") // Ajout des 2 classes CSS
        // Au clic on affiche TOUS les travaux
        btnTous.addEventListener("click", () => {
            generertravaux(travaux)
            activeButton(btnTous)
        })

        filtresContainer.appendChild(btnTous)

        // créer les autres boutons grâce aux catégories de l'API
        for (const category of categories) {
            const btn = document.createElement("button")
            btn.innerText = category.name // "Objets", "Appartements", etc...
            btn.classList.add("filter-button") // Ajout de la classe CSS d'orrigine

            // évenement pour filtrer au clic
            btn.addEventListener("click", () => {
                // créer une nouvelle liste avec les éléments de la bonne catégorie
                const travauxFiltres = travaux.filter(projet => projet.categoryId === category.id)
                
                // donner cette liste filtrée à la fonction d'affichage
                generertravaux(travauxFiltres)
                activeButton(btn)
            })

            filtresContainer.appendChild(btn)
        }
    })

    checkAdmin()
    setupModal()
    genererModalGallery(listeTravaux)