/**
 * Récupère les travaux depuis l'API
 * @returns {Promise<Array>} Retourne la liste des travaux
 */
export async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    return await response.json() // On retourne les données, on ne les utilise pas ici !
}

/**
 * Récupère les travaux depuis l'API
 * @returns {Promise<Array>} Retourne la liste des catégories
 */
export async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    return await response.json()
}

