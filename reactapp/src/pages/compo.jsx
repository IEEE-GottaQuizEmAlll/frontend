import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonFinder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    useEffect(() => {
        // Fetch Pokémon data from the PokéAPI
        const fetchPokemonData = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
                setPokemonList(response.data.results.map(pokemon => pokemon.name));
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        };

        fetchPokemonData();
    }, []);

    // Filter Pokémon based on search term
    const filteredPokemon = pokemonList.filter(pokemon =>
        pokemon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle Pokémon selection
    const handlePokemonSelect = async (pokemonName) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            setSelectedPokemon(response.data);
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search for a Pokémon..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <select
                value={selectedPokemon ? selectedPokemon.name : ''}
                onChange={(e) => handlePokemonSelect(e.target.value)}
            >
                <option value="">Choose a Pokémon</option>
                {filteredPokemon.map(pokemonName => (
                    <option key={pokemonName} value={pokemonName}>{pokemonName}</option>
                ))}
            </select>
            {selectedPokemon && (
                <div>
                    <h2>{selectedPokemon.name}</h2>
                    <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
                    <p>Height: {selectedPokemon.height}</p>
                    <p>Weight: {selectedPokemon.weight}</p>
                    <p>Abilities:</p>
                    <ul>
                        {selectedPokemon.abilities.map((ability, index) => (
                            <li key={index}>{ability.ability.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PokemonFinder;