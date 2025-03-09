require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor corriendo...");
});

// Obtener lista de Pokémon
app.get("/pokemon", (req, res) => {
  db.query("SELECT * FROM pokemon", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Registrar un nuevo Pokémon con validaciones
app.post(
  "/pokemon",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("type").notEmpty().withMessage("El tipo es obligatorio"),
    body("ability").notEmpty().withMessage("La habilidad es obligatoria"),
    body("hp").isInt({ min: 1 }).withMessage("HP debe ser un número positivo"),
    body("attack")
      .isInt({ min: 1 })
      .withMessage("Ataque debe ser un número positivo"),
    body("defense")
      .isInt({ min: 1 })
      .withMessage("Defensa debe ser un número positivo"),
    body("speed")
      .isInt({ min: 1 })
      .withMessage("Velocidad debe ser un número positivo"),
    body("image").isURL().withMessage("Debe ser una URL válida"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, ability, hp, attack, defense, speed, image } = req.body;
    const query =
      "INSERT INTO pokemon (name, type, ability, hp, attack, defense, speed, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      query,
      [name, type, ability, hp, attack, defense, speed, image],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          id: result.insertId,
          name,
          type,
          ability,
          hp,
          attack,
          defense,
          speed,
          image,
        });
      }
    );
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
