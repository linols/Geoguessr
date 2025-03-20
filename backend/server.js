const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(cors());

// Définir le chemin du fichier JSON (il sera stocké dans le volume Docker)
const DATA_FILE = path.join(__dirname, "data", "games.json");

// Vérifier si le dossier `data` existe, sinon le créer
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Vérifier si le fichier JSON existe, sinon le créer avec un tableau vide
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Middleware pour parser le JSON
app.use(express.json());

// ✅ Endpoint pour enregistrer un score
app.post("/score", (req, res) => {
    const { score, date } = req.body;
    const gameDate = date || new Date().toISOString();

    if (score === undefined) {
        return res.status(400).json({ error: "Le score est requis" });
    }

    // Lire les données existantes
    let games = [];
    try {
        games = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch (error) {
        console.error("Erreur de lecture du fichier JSON:", error);
    }

    // Ajouter la nouvelle partie
    games.push({ score, date: gameDate });

    // Sauvegarder dans le fichier JSON
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(games, null, 2));
        res.status(201).json({ message: "Score ajouté avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur d'enregistrement des données" });
    }
});

// ✅ Endpoint pour récupérer tous les scores
app.get("/scores", (req, res) => {
    try {
        const games = JSON.parse(fs.readFileSync(DATA_FILE));
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: "Erreur de lecture des données" });
    }
});

// ✅ Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
