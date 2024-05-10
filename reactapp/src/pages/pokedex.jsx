import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

async function fetchPokemon() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokedex/1');
    const data = await response.json();
    const pokemonData = await Promise.all(data.pokemon_entries.slice(0,200).map(async (entry) => {
      console.log(entry.entry_number);
      const species_response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${entry.entry_number}`);
      const species_data = await species_response.json();
      console.log(species_data);
      const pokemon_response = await fetch(`https://pokeapi.co/api/v2/pokemon/${entry.entry_number}`);
      const pokemon_data = await pokemon_response.json();
      console.log(pokemon_data);
      const card_data = {
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon_data.id}.png`,
        id: pokemon_data.id,
        name: pokemon_data.name,
        types: pokemon_data.types.map(type => type.type.name),
        color: species_data.color.name,
      }
      console.log(card_data.types)
      return card_data;
    }));
    
    return pokemonData;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    return [];
  }
}

function PokemonList({limit, searchTerm, sortTerm}) {
  const [pokemonData, setPokemonData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemons = async () => {
      const pokemons = await fetchPokemon();
      const filteredPokemons = pokemons.slice(0, limit).filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if(sortTerm) {
        filteredPokemons.sort((a, b) => (a.name > b.name)?1:-1);
      }
      console.log('limit '+limit);
      setPokemonData(filteredPokemons);
    };

    getPokemons();
  }, [limit, searchTerm, sortTerm]); 



  return (
    <>
      <ul className='flex flex-wrap gap-16 min-h-64'>
        {pokemonData.length?pokemonData.map((pokemon, index) => (
          <li key={index} className=' shadow-lg shadow-gray-700 flex flex-col justify-center gap-2 items-center bg-[#FFFFFF] p-4 h-72 w-56 rounded-3xl text-black font-bold hover:shadow-none hover:scale-105 transition ease-in-out duration-500'  >
            <div className='w-36 h-36 bg-contain rounded-3xl' style={{backgroundImage: `url(${pokemon.img})`, backgroundColor: `${pokemon.color}`}}></div>
            <div>#{pokemon.id}</div>  
            <div>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>    
            <div className='flex gap-2'>Types: 
              {pokemon.types.map((type)=> {
                return <div className='font-medium rounded'>{type}</div>
              })}
            </div>
              
          </li>
        )):<p className=' text-red-500 font-bold'>Error! Pokemon Not Found</p>}
      </ul>
    </>
  );
}

export default function Pokedex() {
  const [pokeLimit, setPokeLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortTerm, setSortTerm] = useState(0); // 0 for Id sort 1 for Alpha sort

  useEffect(() => {
    console.log(pokeLimit);
  }, [pokeLimit]); // Log the updated state value whenever pokeLimit changes
  
  const incrementPokeLimit = () => {
    setPokeLimit(prevLimit => prevLimit + 20);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className=' flex flex-col items-center gap-4 bg-[#000100] h-auto font-raleway p-12 pb-8'>
        <div className=' font-extrabold text-4xl text-white'>The Pokedex</div>
        <div className=' font-medium text-white'>Learn about all your favourite pokemon right here!</div>
        <div className='flex gap-4'>
          <input type="text" value={searchTerm} onChange={handleSearch} className=' w-36 rounded-lg py-1 px-2 focus: outline-none transition ease-in-out duration-200' placeholder='Search...' />
        </div>
        <div className=' flex gap-3 mb-8'>
          <button onClick={() => setSortTerm(1)} className=' rounded-lg bg-[#CC0000] px-2 py-1 text-white font-semibold shadow-lg shadow-gray-600 focus:shadow-none hover:opacity-80 transition ease-in-out duration-200'>Alphabet</button>
          <button onClick={() => setSortTerm(0)} className=' rounded-lg bg-[#CC0000] px-2 py-1 text-white font-semibold shadow-lg shadow-gray-600 focus:shadow-none hover:opacity-80 transition ease-in-out duration-200'># Id</button>
        </div>
        <PokemonList limit={pokeLimit} searchTerm={searchTerm} sortTerm={sortTerm}/>
        <button className='w-28 mt-4 rounded-lg bg-[#CC0000] px-2 py-1 text-white font-semibold shadow-lg shadow-gray-600 focus:shadow-none hover:opacity-80 transition ease-in-out duration-200' onClick={incrementPokeLimit}>Load More</button>
      </div>
      <div className="h-12 flex items-center justify-center bg-[#DE5239] font-raleway font-bold">Made by IEEE | GottaQuizEmAll</div>
    </>
  );
}
