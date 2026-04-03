fetch("https://backend-sophie-bluel-la4u.onrender.com/api")
    .then(response => response.json())
    .then(data => {
        const gallery = document.querySelector(".gallery");

        // Pour chaque "work" dans "data"
        for (const work of data) {
            
            // Création des balises
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            const figcaption = document.createElement("figcaption");

            // Remplir les informations
            img.src = work.imageUrl; // L'url de l'image
            img.alt = work.title;    // Le texte alternatif
            figcaption.innerText = work.title; // Le titre sous l'image

            // Assembler les balises
            figure.appendChild(img);
            figure.appendChild(figcaption);

            // Mettre le tout dans "gallery"
            gallery.appendChild(figure);
        }
    });
