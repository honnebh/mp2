import { createContext, useContext } from 'react'
import type { Pokemon } from '../api/pokeapi'

export interface PokemonState {
  pokemon: Pokemon[]
  loading: boolean
  error: string | null
}

export const PokemonContext = createContext<PokemonState | null>(null)

export function usePokemon(): PokemonState {
  const ctx = useContext(PokemonContext)
  if (!ctx) throw new Error('usePokemon must be used inside PokemonProvider')
  return ctx
}
