// Main cities/locations for the map
// isDefault: true = always visible on map, false = only visible when searched
export const MARTINIQUE_CITIES = [
    // Default visible cities (current 22)
    { name: "Fort-de-France", lat: 14.6161, lon: -61.0588, isDefault: true },
    { name: "Le Lamentin", lat: 14.6146, lon: -61.0019, isDefault: true },
    { name: "Le Robert", lat: 14.6776, lon: -60.9389, isDefault: true },
    { name: "Sainte-Marie", lat: 14.7831, lon: -60.9926, isDefault: true },
    { name: "La Trinité", lat: 14.7376, lon: -60.9632, isDefault: true },
    { name: "Saint-Pierre", lat: 14.7456, lon: -61.1764, isDefault: true },
    { name: "Le François", lat: 14.6156, lon: -60.9038, isDefault: true },
    { name: "Rivière-Pilote", lat: 14.4869, lon: -60.9033, isDefault: true },
    { name: "Le Diamant", lat: 14.4756, lon: -61.0367, isDefault: true },
    { name: "Sainte-Anne", lat: 14.4339, lon: -60.8787, isDefault: true },
    { name: "Les Anses-d'Arlet", lat: 14.4913, lon: -61.0805, isDefault: true },
    { name: "Le Carbet", lat: 14.7117, lon: -61.1822, isDefault: true },
    { name: "Sainte-Luce", lat: 14.4692, lon: -60.9257, isDefault: true },
    { name: "Le Vauclin", lat: 14.5453, lon: -60.8358, isDefault: true },
    { name: "Les Trois-Îlets", lat: 14.5388, lon: -61.0336, isDefault: true },
    { name: "Le Prêcheur", lat: 14.8016, lon: -61.2166, isDefault: true },
    { name: "Grand'Rivière", lat: 14.8732, lon: -61.1812, isDefault: true },
    { name: "Le Morne-Rouge", lat: 14.7733, lon: -61.1350, isDefault: true },
    { name: "Tartane", lat: 14.7610, lon: -60.9120, isDefault: true },
    { name: "Bellefontaine", lat: 14.6738, lon: -61.1633, isDefault: true },
    { name: "Basse-Pointe", lat: 14.8696, lon: -61.1172, isDefault: true },
    { name: "Le Lorrain", lat: 14.8327, lon: -61.0558, isDefault: true },

    // Additional communes (search only - not visible by default)
    { name: "Schœlcher", lat: 14.6133, lon: -61.0903, isDefault: false },
    { name: "Ducos", lat: 14.5653, lon: -60.9703, isDefault: false },
    { name: "Saint-Joseph", lat: 14.6694, lon: -61.0417, isDefault: false },
    { name: "Le Marin", lat: 14.4642, lon: -60.8706, isDefault: false },
    { name: "Rivière-Salée", lat: 14.5208, lon: -61.0094, isDefault: false },
    { name: "Case-Pilote", lat: 14.6436, lon: -61.1367, isDefault: false },
    { name: "Macouba", lat: 14.8792, lon: -61.1003, isDefault: false },
    { name: "Le Marigot", lat: 14.8494, lon: -61.0311, isDefault: false },
    { name: "Fonds-Saint-Denis", lat: 14.7417, lon: -61.1100, isDefault: false },
    { name: "L'Ajoupa-Bouillon", lat: 14.8203, lon: -61.1044, isDefault: false },
    { name: "Saint-Esprit", lat: 14.5483, lon: -60.9383, isDefault: false },
    { name: "Gros-Morne", lat: 14.7233, lon: -61.0367, isDefault: false }
]


export const BEACH_LOCATIONS = [
    { name: "Les Salines", city: "Sainte-Anne", lat: 14.4026, lon: -60.8787 },
    { name: "Pointe Marin", city: "Sainte-Anne", lat: 14.4410, lon: -60.8840 },
    { name: "Anse Michel", city: "Sainte-Anne", lat: 14.4170, lon: -60.8330 },
    { name: "Grande Anse", city: "Le Diamant", lat: 14.4735, lon: -61.0322 },
    { name: "Grande Anse d'Arlet", city: "Les Anses-d'Arlet", lat: 14.5020, lon: -61.0850 },
    { name: "Anse Noire", city: "Les Anses-d'Arlet", lat: 14.5283, lon: -61.0877 },
    { name: "Pointe Faula", city: "Le Vauclin", lat: 14.5447, lon: -60.8353 },
    { name: "Anse Mitan", city: "Les Trois-Îlets", lat: 14.5519, lon: -61.0543 },
    { name: "Plage du Bourg", city: "Sainte-Luce", lat: 14.4680, lon: -60.9230 },
    { name: "La Brèche", city: "Tartane", lat: 14.7590, lon: -60.9080 },
    { name: "Anse Couleuvre", city: "Le Prêcheur", lat: 14.8322, lon: -61.2227 },
    { name: "Anse Céron", city: "Le Prêcheur", lat: 14.8140, lon: -61.2260 },
    { name: "Anse Turin", city: "Le Carbet", lat: 14.7180, lon: -61.1850 },
    { name: "La Française", city: "Fort-de-France", lat: 14.6040, lon: -61.0620 }
]
