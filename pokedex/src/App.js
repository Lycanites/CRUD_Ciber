import { useState, useEffect } from "react";

const PokemonCRUD = () => {
  const [pokemon, setPokemon] = useState({
    name: "",
    type: "",
    ability: "",
    hp: "",
    attack: "",
    defense: "",
    speed: "",
    image: "",
  });

  const [pokemonList, setPokemonList] = useState([]);

  const pokemonTypes = [
    "Normal",
    "Fuego",
    "Agua",
    "Planta",
    "Eléctrico",
    "Hielo",
    "Lucha",
    "Veneno",
    "Tierra",
    "Volador",
    "Psíquico",
    "Bicho",
    "Roca",
    "Fantasma",
    "Dragón",
    "Siniestro",
    "Acero",
    "Hada",
  ];

  useEffect(() => {
    fetch("http://localhost:5000/pokemon")
      .then((res) => res.json())
      .then((data) => setPokemonList(data))
      .catch((err) => console.error("Error al obtener Pokémon:", err));
  }, []);

  const handleChange = (e) => {
    setPokemon({ ...pokemon, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/pokemon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pokemon),
    })
      .then((res) => res.json())
      .then((data) => {
        setPokemonList([...pokemonList, data]);
      })
      .catch((err) => console.error("Error al registrar Pokémon:", err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/pokemon/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setPokemonList(pokemonList.filter((pokemon) => pokemon.id !== id));
      })
      .catch((err) => console.error("Error al eliminar Pokémon:", err));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <img src="/IMGmain.png" alt="Logo" className="w-32 mb-4 mx-auto" />
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">CRUD de Pokémon</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />

          <select
            name="type"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="ability"
            placeholder="Habilidad"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="hp"
            placeholder="HP"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="attack"
            placeholder="Ataque"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="defense"
            placeholder="Defensa"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="speed"
            placeholder="Velocidad"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="image"
            placeholder="URL de la imagen"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white p-2 rounded"
          >
            Registrar Pokémon
          </button>
        </form>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="pokemon-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {pokemonList.map((pokemon) => (
            <div
              key={pokemon.id}
              className="pokemon-card bg-white shadow-lg rounded-lg p-4 hover:scale-105 transition-all duration-300 w-full sm:w-[300px]"
            >
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-full h-40 object-contain rounded-t-lg"
              />
              <h2 className="text-lg font-bold mt-2 text-center">
                {pokemon.name}
              </h2>
              <p className="text-gray-600">Tipo: {pokemon.type}</p>
              <p className="text-gray-600">Habilidad: {pokemon.ability}</p>
              <p className="text-gray-600">HP: {pokemon.hp}</p>
              <p className="text-gray-600">Ataque: {pokemon.attack}</p>
              <p className="text-gray-600">Defensa: {pokemon.defense}</p>
              <p className="text-gray-600">Velocidad: {pokemon.speed}</p>

              <button
                onClick={() => handleDelete(pokemon.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 w-full"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCRUD;
