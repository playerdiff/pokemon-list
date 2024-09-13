import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonEvolution = ({ pokemonId }) => {
  const [evolutionChain, setEvolutionChain] = useState(null);

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        const speciesUrl = pokemonResponse.data.species.url;

        const speciesResponse = await axios.get(speciesUrl);
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

        const evolutionResponse = await axios.get(evolutionChainUrl);
        setEvolutionChain(evolutionResponse.data);
      } catch (error) {
        console.error('Erro ao buscar a cadeia de evolução:', error);
      }
    };

    fetchEvolutionChain();
  }, [pokemonId]);

  if (!evolutionChain) return <p>Carregando...</p>;

  const renderEvolution = (evolution, level = 1) => {
    if (!evolution) return null;

    return (
      <div style={{ marginLeft: `${level * 20}px` }}>
        <p>{evolution.species.name.charAt(0).toUpperCase() + evolution.species.name.slice(1)}</p>
        {evolution.evolves_to.map((evo) => renderEvolution(evo, level + 1))}
      </div>
    );
  };

  return (
    <div>
      <h2>Cadena de Evolução</h2>
      {renderEvolution(evolutionChain.chain)}
    </div>
  );
};

export default PokemonEvolution;
