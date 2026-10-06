import { useEffect, useState, type ReactNode } from 'react'
import { fetchAllPokemon, type Pokemon } from '../api/pokeapi'
import { PokemonContext } from './pokemonContext'

// Loads the Pokémon once and shares them with every page.
export default function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllPokemon()
      .then(setPokemon)
      .catch(() => setError('Could not load Pokémon. Please refresh the page.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PokemonContext.Provider value={{ pokemon, loading, error }}>
      {children}
    </PokemonContext.Provider>
  )
}
