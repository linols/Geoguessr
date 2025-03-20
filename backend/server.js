const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });



const app = express();
const PORT = process.env.VITE_BACKEND_PORT;

app.use(cors());


const DATA_FILE = path.join(__dirname, "data", "games.json");


if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}


if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}


app.use(express.json());


app.post("/score", (req, res) => {
    const { score, date } = req.body;
    const gameDate = date || new Date().toISOString();

    if (score === undefined) {
        return res.status(400).json({ error: "Le score est requis" });
    }


    let games = [];
    try {
        games = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch (error) {
        console.error("Erreur de lecture du fichier JSON:", error);
    }


    games.push({ score, date: gameDate });


    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(games, null, 2));
        res.status(201).json({ message: "Score ajouté avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur d'enregistrement des données" });
    }
});


app.get("/scores", (req, res) => {
    try {
        const games = JSON.parse(fs.readFileSync(DATA_FILE));
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: "Erreur de lecture des données" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
