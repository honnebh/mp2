import axios from 'axios'

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  baseExperience: number
  types: string[]
  abilities: string[]
  stats: { name: string; value: number }[]
  image: string
  sprite: string
}

interface ApiPokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
}

export const POKEMON_COUNT = 151
const CACHE_KEY = `pokedex-v1-${POKEMON_COUNT}`
const BATCH_SIZE = 25

function toPokemon(p: ApiPokemon): Pokemon {
  return {
    id: p.id,
    name: p.name,
    height: p.height,
    weight: p.weight,
    baseExperience: p.base_experience ?? 0,
    types: p.types.map((t) => t.type.name),
    abilities: p.abilities.map((a) => a.ability.name),
    stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    image: p.sprites.other?.['official-artwork']?.front_default ?? p.sprites.front_default ?? '',
    sprite: p.sprites.front_default ?? '',
  }
}

function readCache(): Pokemon[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? (JSON.parse(raw) as Pokemon[]) : null
  } catch {
    return null
  }
}

function writeCache(list: Pokemon[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(list))
  } catch {
    // Storage full or blocked; the app still works without the cache.
  }
}

// Fetches the original 151 Pokémon in small batches to stay friendly with
// PokéAPI's rate limits, and caches the result so reloads are instant.
export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const cached = readCache()
  if (cached) return cached

  const ids = Array.from({ length: POKEMON_COUNT }, (_, i) => i + 1)
  const result: Pokemon[] = []
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE)
    const responses = await Promise.all(
      batch.map((id) => axios.get<ApiPokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`)),
    )
    result.push(...responses.map((r) => toPokemon(r.data)))
  }
  writeCache(result)
  return result
}

export function formatName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}
