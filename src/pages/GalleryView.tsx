import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatId, formatName } from '../api/pokeapi'
import Status from '../components/Status'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/pokemonContext'
import styles from './GalleryView.module.css'
import type { DetailNavState } from './navState'

export default function GalleryView() {
  const { pokemon, loading, error } = usePokemon()
  const [selected, setSelected] = useState<string[]>([])

  const allTypes = useMemo(
    () => [...new Set(pokemon.flatMap((p) => p.types))].sort(),
    [pokemon],
  )

  // With no types selected show everything; otherwise show Pokémon that have any selected type.
  const results =
    selected.length === 0
      ? pokemon
      : pokemon.filter((p) => p.types.some((t) => selected.includes(t)))

  function toggle(type: string) {
    setSelected((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const navState: DetailNavState = { ids: results.map((p) => p.id) }

  return (
    <section>
      <div className={styles.intro}>
        <h1>Gallery</h1>
        <p>Pick one or more types to filter the collection.</p>
      </div>

      {allTypes.length > 0 && (
        <div className={styles.filters}>
          <div className={styles.chips} role="group" aria-label="Filter by type">
            {allTypes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={selected.includes(t)}
                className={`${styles.chip} ${selected.includes(t) ? styles.chipOn : ''}`}
                onClick={() => toggle(t)}
              >
                <TypeBadge type={t} />
              </button>
            ))}
          </div>
          <div className={styles.filterBar}>
            <span className={styles.count}>
              Showing {results.length} of {pokemon.length}
            </span>
            {selected.length > 0 && (
              <button type="button" className={styles.clear} onClick={() => setSelected([])}>
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      <Status loading={loading} error={error} />

      <ul className={styles.grid}>
        {results.map((p) => (
          <li key={p.id}>
            <Link to={`/pokemon/${p.id}`} state={navState} className={styles.card}>
              <div className={styles.art}>
                <img src={p.image} alt={formatName(p.name)} loading="lazy" />
              </div>
              <div className={styles.caption}>
                <span className={styles.id}>{formatId(p.id)}</span>
                <span className={styles.name}>{formatName(p.name)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
