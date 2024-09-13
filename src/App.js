import React, { useState } from 'react';
import PokemonList from './Components/PokemonList';
import PokemonDetail from './Components/PokemonDetail';

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const handleSelectPokemon = (url) => {
    setSelectedPokemon(url);
  };

  return (
    <div>
      <PokemonList onSelectPokemon={handleSelectPokemon} />
      {selectedPokemon && <PokemonDetail pokemonUrl={selectedPokemon} />}
    </div>
  );
};

export default App;
