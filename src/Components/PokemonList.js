import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 250;
  const totalPokemons = 8000; // Ajuste conforme o total de pokémons disponível

  // Estado para filtros
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedGenerations, setSelectedGenerations] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonData = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonDetails = await axios.get(pokemon.url);
          const speciesDetails = await axios.get(pokemonDetails.data.species.url);
          const evolutionChain = await axios.get(speciesDetails.data.evolution_chain.url);

          const types = pokemonDetails.data.types.map(typeInfo => typeInfo.type.name);
          const evolution = extractEvolutionChain(evolutionChain.data.chain);

          return {
            id: pokemonDetails.data.id,
            name: pokemonDetails.data.name,
            types,
            evolution,
            generation: getGeneration(pokemonDetails.data.id),
          };
        }));

        setPokemons(pokemonData);
      } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
      }
    };

    fetchPokemons();
  }, [offset]);

  useEffect(() => {
    // Aplica os filtros
    const applyFilters = () => {
      let filtered = pokemons;

      if (selectedTypes.length > 0) {
        filtered = filtered.filter(pokemon =>
          selectedTypes.every(type => pokemon.types.includes(type))
        );
      }

      if (selectedGenerations.length > 0) {
        filtered = filtered.filter(pokemon =>
          selectedGenerations.includes(pokemon.generation)
        );
      }

      setFilteredPokemons(filtered);
    };

    applyFilters();
  }, [pokemons, selectedTypes, selectedGenerations]);

  const getGeneration = (id) => {
    if (id <= 151) return '1ª';
    if (id <= 251) return '2ª';
    if (id <= 386) return '3ª';
    if (id <= 493) return '4ª';
    if (id <= 649) return '5ª';
    if (id <= 721) return '6ª';
    if (id <= 809) return '7ª';
    return '8ª';
  };

  const extractEvolutionChain = (chain) => {
    const evolution = [];
    let currentStage = chain;

    while (currentStage) {
      evolution.push(currentStage.species.name);
      currentStage = currentStage.evolves_to[0];
    }

    return evolution;
  };

  const getTypeColor = (type) => {
    const typeColors = {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      bug: '#A8B820',
      poison: '#A040A0',
      normal: '#A8A878',
      flying: '#A890F0',
      fighting: '#C03028',
      psychic: '#F85888',
      rock: '#B8A038',
      ground: '#E0C068',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      ice: '#98D8D8',
      fairy: '#EE99AC'
    };

    return typeColors[type] || '#333';
  };

  const getBackgroundGradient = (types) => {
    const colors = types.map(type => getTypeColor(type));
    
    if (colors.length === 1) {
      return colors[0];
    } else if (colors.length === 2) {
      return `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`;
    }
    
    return `linear-gradient(45deg, ${colors.join(', ')})`;
  };

  const handlePageChange = (direction) => {
    const newOffset = direction === 'next' ? offset + limit : offset - limit;
    if (newOffset >= 0 && newOffset < totalPokemons) {
      setOffset(newOffset);
      setCurrentPage(prevPage => direction === 'next' ? prevPage + 1 : prevPage - 1);
    }
  };

  const toggleTypeFilter = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleGenerationFilter = (generation) => {
    setSelectedGenerations(prev =>
      prev.includes(generation) ? prev.filter(g => g !== generation) : [...prev, generation]
    );
  };

  const types = ['grass', 'fire', 'water', 'electric', 'bug', 'poison', 'normal', 'flying', 'fighting', 'psychic', 'rock', 'ground', 'ghost', 'dragon', 'dark', 'steel', 'ice', 'fairy'];
  const generations = ['1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª'];

  return (
    <div className="pokemon-container">
      <h1 className="pokemon-title">Lista de Pokémon</h1>
      
      <div className="filters">
        <div className="filter-group">
          <h2>Tipos</h2>
          {types.map(type => (
            <label key={type} className="filter-label">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleTypeFilter(type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h2>Gerações</h2>
          {generations.map(gen => (
            <label key={gen} className="filter-label">
              <input
                type="checkbox"
                checked={selectedGenerations.includes(gen)}
                onChange={() => toggleGenerationFilter(gen)}
              />
              {gen}
            </label>
          ))}
        </div>
      </div>

      <ul className="pokemon-list">
        {filteredPokemons.map((pokemon) => (
          <li
            key={pokemon.id}
            className="pokemon-item"
            style={{ background: getBackgroundGradient(pokemon.types) }}
          >
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name} />
            <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <p><strong>Tipos:</strong> {pokemon.types.map((type, index) => (
              <span key={index} style={{ color: pokemon.types.length === 1 ? '#000000' : getTypeColor(type) }}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            )).reduce((prev, curr) => [prev, ', ', curr])}
            </p>
            <p><strong>Geração:</strong> {pokemon.generation}</p>
            <p><strong>Cadeia de Evolução:</strong></p>
            <ul>
              {pokemon.evolution.map((stage, index) => (
                <li key={index}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div className="pokemon-navigation">
        <button onClick={() => handlePageChange('previous')} disabled={offset === 0} className="nav-button">
          &lt;
        </button>
        <button onClick={() => handlePageChange('next')} disabled={offset + limit >= totalPokemons} className="nav-button">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
