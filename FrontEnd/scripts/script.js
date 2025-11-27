// Variable tableau pour stocker les travaux
let travaux = []

function generertravaux(listeTravaux) {
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
        // Au clic on affiche TOUS les travaux
        btnTous.addEventListener("click", () => {
            generertravaux(travaux)
        })

        filtresContainer.appendChild(btnTous)

        // créer les autres boutons grâce aux catégories de l'API
        for (const category of categories) {
            const btn = document.createElement("button")
            btn.innerText = category.name // "Objets", "Appartements", etc...

            // évenement pour filtrer au clic
            btn.addEventListener("click", () => {
                // créer une nouvelle liste avec les éléments de la bonne catégorie
                const travauxFiltres = travaux.filter(projet => projet.categoryId === category.id)
                
                // donner cette liste filtrée à la fonction d'affichage
                generertravaux(travauxFiltres)
            })

            filtresContainer.appendChild(btn)
        }
    })
