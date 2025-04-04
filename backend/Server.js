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

// Obtener un Pokémon por su ID
app.get("/pokemon/:id", (req, res) => {
  const pokemonId = req.params.id;
  const query = "SELECT * FROM pokemon WHERE id = ?";

  db.query(query, [pokemonId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Pokémon no encontrado" });
    }
    res.json(results[0]); // Devuelve el Pokémon encontrado
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

    const {
      name,
      type,
      tipo_secundario,
      ability,
      hp,
      attack,
      defense,
      speed,
      image,
    } = req.body;
    const query =
      "INSERT INTO pokemon (name, type, tipo_secundario, ability, hp, attack, defense, speed, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(
      query,
      [name, type, tipo_secundario, ability, hp, attack, defense, speed, image],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({
          id: result.insertId,
          name,
          type,
          tipo_secundario,
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

// Actualizar un Pokémon por ID
app.put("/pokemon/:id", (req, res) => {
  const pokemonId = req.params.id;
  const {
    name,
    type,
    tipo_secundario,
    ability,
    hp,
    attack,
    defense,
    speed,
    image,
  } = req.body;

  const query = `
    UPDATE pokemon SET name = ?, type = ?, tipo_secundario = ?, ability = ?, hp = ?, attack = ?, defense = ?, speed = ?, image = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      name,
      type,
      tipo_secundario,
      ability,
      hp,
      attack,
      defense,
      speed,
      image,
      pokemonId,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Pokémon no encontrado para actualizar" });
      }
      res.json({
        id: pokemonId,
        name,
        type,
        tipo_secundario,
        ability,
        hp,
        attack,
        defense,
        speed,
        image,
      });
    }
  );
});

// Eliminar un Pokémon por ID
app.delete("/pokemon/:id", (req, res) => {
  const pokemonId = req.params.id;

  const query = "DELETE FROM pokemon WHERE id = ?";
  db.query(query, [pokemonId], (err, result) => {
    if (err) {
      console.error("Error al eliminar el Pokémon:", err);
      return res.status(500).json({ error: "Error al eliminar Pokémon" });
    }
    res.status(200).json({ message: "Pokémon eliminado con éxito" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
