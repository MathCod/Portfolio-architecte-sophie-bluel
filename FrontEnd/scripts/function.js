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
