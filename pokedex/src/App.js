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
        console.log("Pokémon registrado:", data);
        setPokemonList([...pokemonList, data]);
      })
      .catch((err) => console.error("Error al registrar Pokémon:", err));
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
          <input
            type="text"
            name="type"
            placeholder="Tipo"
            className="p-2 border border-blue-500 rounded"
            onChange={handleChange}
            required
          />
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
      <div className="mt-6 max-w-4xl w-full">
        <h2 className="text-xl font-bold text-center mb-4">Lista de Pokémon</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pokemonList.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md p-4 rounded-lg text-center"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-24 h-24 mx-auto mb-2"
              />
              <h3 className="font-bold">{p.name}</h3>
              <p>Tipo: {p.type}</p>
              <p>Habilidad: {p.ability}</p>
              <p>HP: {p.hp}</p>
              <p>Ataque: {p.attack}</p>
              <p>Defensa: {p.defense}</p>
              <p>Velocidad: {p.speed}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCRUD;
