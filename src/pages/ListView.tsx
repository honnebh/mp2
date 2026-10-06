import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatId, formatName, type Pokemon } from '../api/pokeapi'
import Status from '../components/Status'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/pokemonContext'
import styles from './ListView.module.css'
import type { DetailNavState } from './navState'

type SortKey = 'id' | 'name' | 'height' | 'weight' | 'baseExperience'
type Order = 'asc' | 'desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id', label: 'Pokédex number' },
  { value: 'name', label: 'Name' },
  { value: 'height', label: 'Height' },
  { value: 'weight', label: 'Weight' },
  { value: 'baseExperience', label: 'Base experience' },
]

function compare(a: Pokemon, b: Pokemon, key: SortKey): number {
  if (key === 'name') return a.name.localeCompare(b.name)
  return a[key] - b[key] || a.id - b.id
}

export default function ListView() {
  const { pokemon, loading, error } = usePokemon()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('id')
  const [order, setOrder] = useState<Order>('asc')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? pokemon.filter(
          (p) =>
            formatName(p.name).toLowerCase().includes(q) ||
            p.name.includes(q) ||
            String(p.id) === q.replace(/^#?0*/, '') ||
            p.types.some((t) => t.startsWith(q)),
        )
      : pokemon
    const sorted = [...filtered].sort((a, b) => compare(a, b, sort))
    return order === 'desc' ? sorted.reverse() : sorted
  }, [pokemon, query, sort, order])

  const navState: DetailNavState = { ids: results.map((p) => p.id) }

  return (
    <section>
      <div className={styles.intro}>
        <h1>Search Pokémon</h1>
        <p>Find any of the original 151 by name, number, or type.</p>
      </div>

      <div className={styles.controls}>
        <label className={styles.search}>
          <span className={styles.srOnly}>Search</span>
          <input
            type="search"
            placeholder="Search by name, number, or type…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </label>
        <label className={styles.field}>
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.order} role="group" aria-label="Sort order">
          {(['asc', 'desc'] as const).map((o) => (
            <button
              key={o}
              type="button"
              className={order === o ? styles.orderActive : undefined}
              aria-pressed={order === o}
              onClick={() => setOrder(o)}
            >
              {o === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          ))}
        </div>
      </div>

      <Status loading={loading} error={error} />

      {!loading && !error && (
        <>
          <p className={styles.count}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </p>
          {results.length === 0 ? (
            <p className={styles.empty}>No Pokémon match “{query}”.</p>
          ) : (
            <ul className={styles.list}>
              {results.map((p) => (
                <li key={p.id}>
                  <Link to={`/pokemon/${p.id}`} state={navState} className={styles.row}>
                    <img src={p.sprite} alt="" width={72} height={72} loading="lazy" />
                    <div className={styles.main}>
                      <span className={styles.id}>{formatId(p.id)}</span>
                      <span className={styles.name}>{formatName(p.name)}</span>
                      <span className={styles.types}>
                        {p.types.map((t) => (
                          <TypeBadge key={t} type={t} />
                        ))}
                      </span>
                    </div>
                    <dl className={styles.facts}>
                      <div>
                        <dt>Height</dt>
                        <dd>{(p.height / 10).toFixed(1)} m</dd>
                      </div>
                      <div>
                        <dt>Weight</dt>
                        <dd>{(p.weight / 10).toFixed(1)} kg</dd>
                      </div>
                      <div>
                        <dt>Base XP</dt>
                        <dd>{p.baseExperience}</dd>
                      </div>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
