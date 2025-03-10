import { useState, useEffect } from "react";

const PokemonCRUD = () => {
  const [pokemon, setPokemon] = useState({
    name: "",
    type: "",
    tipo_secundario: "",
    ability: "",
    hp: "",
    attack: "",
    defense: "",
    speed: "",
    image: "",
  });

  const [pokemonList, setPokemonList] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Para controlar si estamos editando un Pokémon
  const [editingPokemonId, setEditingPokemonId] = useState(null); // ID del Pokémon que estamos editando

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPokemon = {
      name: pokemon.name,
      type: pokemon.type,
      tipo_secundario: pokemon.tipo_secundario,
      ability: pokemon.ability,
      hp: parseInt(pokemon.hp),
      attack: parseInt(pokemon.attack),
      defense: parseInt(pokemon.defense),
      speed: parseInt(pokemon.speed),
      image: pokemon.image,
    };

    const response = await fetch("http://localhost:5000/pokemon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPokemon),
    });

    const data = await response.json();

    if (response.ok) {
      setPokemonList((prevList) => [...prevList, data]);

      // Limpiar los campos después de agregar el Pokémon
      setPokemon({
        name: "",
        type: "",
        tipo_secundario: "",
        ability: "",
        hp: "",
        attack: "",
        defense: "",
        speed: "",
        image: "",
      });
    } else {
      console.error(data.errors);
    }
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

  const handleEdit = (pokemonToEdit) => {
    setPokemon({
      name: pokemonToEdit.name,
      type: pokemonToEdit.type,
      tipo_secundario: pokemonToEdit.tipo_secundario,
      ability: pokemonToEdit.ability,
      hp: pokemonToEdit.hp.toString(),
      attack: pokemonToEdit.attack.toString(),
      defense: pokemonToEdit.defense.toString(),
      speed: pokemonToEdit.speed.toString(),
      image: pokemonToEdit.image,
    });
    setIsEditing(true);
    setEditingPokemonId(pokemonToEdit.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedPokemon = {
      name: pokemon.name,
      type: pokemon.type,
      tipo_secundario: pokemon.tipo_secundario,
      ability: pokemon.ability,
      hp: parseInt(pokemon.hp),
      attack: parseInt(pokemon.attack),
      defense: parseInt(pokemon.defense),
      speed: parseInt(pokemon.speed),
      image: pokemon.image,
    };

    const response = await fetch(
      `http://localhost:5000/pokemon/${editingPokemonId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPokemon),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setPokemonList(
        pokemonList.map((p) => (p.id === editingPokemonId ? data : p))
      );

      // Limpiar los campos después de actualizar
      setPokemon({
        name: "",
        type: "",
        tipo_secundario: "",
        ability: "",
        hp: "",
        attack: "",
        defense: "",
        speed: "",
        image: "",
      });
      setIsEditing(false);
      setEditingPokemonId(null);
    } else {
      console.error(data.errors);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <img src="/IMGmain.png" alt="Logo" className="w-128 mb-4 mx-auto" />
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">CRUD de Pokémon</h1>
        <form
          onSubmit={isEditing ? handleUpdate : handleSubmit}
          className="grid grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.name}
            required
          />
          <select
            name="type"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.type}
            required
          >
            <option value="">Selecciona un tipo</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            name="tipo_secundario"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.tipo_secundario}
          >
            <option value="">Selecciona un tipo secundario</option>
            {pokemonTypes.map((tipo_secundario) => (
              <option key={tipo_secundario} value={tipo_secundario}>
                {tipo_secundario}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="ability"
            placeholder="Habilidad"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.ability}
            required
          />
          <input
            type="number"
            name="hp"
            placeholder="HP"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.hp}
            required
          />
          <input
            type="number"
            name="attack"
            placeholder="Ataque"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.attack}
            required
          />
          <input
            type="number"
            name="defense"
            placeholder="Defensa"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.defense}
            required
          />
          <input
            type="number"
            name="speed"
            placeholder="Velocidad"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.speed}
            required
          />
          <input
            type="url"
            name="image"
            placeholder="URL de la imagen"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            value={pokemon.image}
            required
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white p-2 rounded"
          >
            {isEditing ? "Actualizar Pokémon" : "Registrar Pokémon"}
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
              <div className="flex justify-between">
                <h2 className="text-lg font-bold mt-2 text-center">
                  {pokemon.name}
                </h2>
                <button
                  onClick={() => handleEdit(pokemon)}
                  className="bg-yellow-500 text-white p-2 rounded"
                >
                  Editar
                </button>
              </div>
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-full h-40 object-contain rounded-t-lg"
              />
              <p className="text-gray-600">Tipo: {pokemon.type}</p>
              <p className="text-gray-600">
                Tipo Secundario: {pokemon.tipo_secundario}
              </p>
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
