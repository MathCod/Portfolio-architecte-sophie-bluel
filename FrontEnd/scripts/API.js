const API_URL = "http://localhost:5678/api"

/**
 * Récupère les travaux depuis l'API
 * @returns {Promise<Array>} Retourne la liste des travaux
 */
export async function fetchWorks() {
    const response = await fetch(`${API_URL}/works`)
    return await response.json() // On retourne les données
}

/**
 * Récupère les travaux depuis l'API
 * @returns {Promise<Array>} Retourne la liste des catégories
 */
export async function fetchCategories() {
    const response = await fetch(`${API_URL}/categories`)
    return await response.json()
}

/**
 * Récupère les travaux depuis l'API
 * @returns {Promise<Array>} Supprime un travail
 */
export async function fetchWorksDelete(idWork, token) {
    const response = await fetch(`${API_URL}/works/${idWork}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`, // On montre le token
            "Content-Type": "application/json"
        }
    })
    return response.ok // On retourne les données
}

/**
 * Connecte l'utilisateur
 * @param {string} email 
 * @param {string} password 
 */
export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    // Si erreur (401, 404...), on lève une exception pour le catch du fichier login.js
    if (!response.ok) {
        throw new Error("Erreur d'identification")
    }
    return await response.json() // Retourne le token et userId
}

/**
 * Envoie une nouvelle photo
 * @param {FormData} formData - Les données du formulaire (image, titre, catégorie)
 * @param {string} token 
 */
export async function sendWork(formData, token) {
    const response = await fetch(`${API_URL}/works`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
    })

    if (!response.ok) {
        throw new Error("Erreur lors de l'envoi")
    }
    return await response.json() // Retourne le travail créé
}
