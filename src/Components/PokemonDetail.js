import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonDetail = ({ pokemonId }) => {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        setPokemon(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
      }
    };

    fetchPokemonDetails();
  }, [pokemonId]);

  if (!pokemon) return <p>Carregando...</p>;

  // Função para obter a geração do Pokémon
  const getGeneration = (id) => {
    if (id <= 151) return 'Geração 1';
    if (id <= 251) return 'Geração 2';
    if (id <= 386) return 'Geração 3';
    if (id <= 493) return 'Geração 4';
    if (id <= 649) return 'Geração 5';
    if (id <= 721) return 'Geração 6';
    if (id <= 809) return 'Geração 7';
    return 'Geração 8'; // Assume que todos os Pokémon adicionais são da Geração 8
  };

  return (
    <div className="pokemon-detail">
      <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
      <p><strong>Tipos:</strong> {pokemon.types.map((type) => type.type.name).join(', ')}</p>
      <p><strong>Geração:</strong> {getGeneration(pokemon.id)}</p>
    </div>
  );
};

export default PokemonDetail;
