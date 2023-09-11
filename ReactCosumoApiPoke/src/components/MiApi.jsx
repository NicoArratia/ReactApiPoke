import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function Header() {
  return (
    <header className="navbar navbar-dark bg-primary">
      <div className="container">
        <h1 className="navbar-brand">Pokémon ordenados API</h1>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-light text-center p-3">
      <div className="container">
        <br />
        <p>&copy; 2023 Poke api Nico Arratia</p>
      </div>
    </footer>
  );
}

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('number');

  const itemsPerPage = 18;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=1300`
        );

        const pokemonData = response.data.results;
        setPokemonList(pokemonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPokemon = filteredPokemon.sort((a, b) => {
    if (sortBy === 'number') {
      return a.url.split('/').slice(-2, -1) - b.url.split('/').slice(-2, -1);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const totalPokemon = sortedPokemon.length;
  const totalPages = Math.ceil(totalPokemon / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPokemon = sortedPokemon.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar Pokémon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select mt-2"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="number">Ordenar por número</option>
            <option value="name">Ordenar por nombre</option>
          </select>
        </div>
        <br />
        <div className="row">
          {currentPokemon.map((pokemon) => (
            <div key={pokemon.name} className="col-md-4 mb-3">
              <div className="card border-primary"> {}
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    pokemon.url.split('/').slice(-2, -1)
                  }.png`}
                  alt={pokemon.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{pokemon.name}</h5>
                  <p className="card-text">
                    N°: {pokemon.url.split('/').slice(-2, -1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <br />

        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior 
          </button>
          <span className="fw-bold"> Página {currentPage} de {totalPages} </span>
          <button
            className="btn btn-primary ms-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente 
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
