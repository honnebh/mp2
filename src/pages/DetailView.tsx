import { Link, useLocation, useParams } from 'react-router-dom'
import { formatId, formatName } from '../api/pokeapi'
import Status from '../components/Status'
import TypeBadge from '../components/TypeBadge'
import { usePokemon } from '../context/pokemonContext'
import styles from './DetailView.module.css'
import type { DetailNavState } from './navState'

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export default function DetailView() {
  const { pokemon, loading, error } = usePokemon()
  const params = useParams()
  const location = useLocation()
  const id = Number(params.id)

  if (loading || error) return <Status loading={loading} error={error} />

  const current = pokemon.find((p) => p.id === id)
  if (!current) {
    return <Status loading={false} error={`No Pokémon with number "${params.id}".`} />
  }

  // Came from the list or gallery: cycle through those results. Visited the URL
  // directly: cycle through every Pokémon in Pokédex order.
  const navState = location.state as DetailNavState | null
  const ids = navState?.ids.includes(id) ? navState.ids : pokemon.map((p) => p.id)
  const index = ids.indexOf(id)
  const prevId = ids[(index - 1 + ids.length) % ids.length]
  const nextId = ids[(index + 1) % ids.length]

  return (
    <article className={styles.page}>
      <div className={styles.card}>
        <div className={styles.hero}>
          <img src={current.image} alt={formatName(current.name)} />
        </div>

        <div>
          <span className={styles.id}>{formatId(current.id)}</span>
          <h1 className={styles.name}>{formatName(current.name)}</h1>
          <div className={styles.types}>
            {current.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Height</dt>
              <dd>{(current.height / 10).toFixed(1)} m</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{(current.weight / 10).toFixed(1)} kg</dd>
            </div>
            <div>
              <dt>Base XP</dt>
              <dd>{current.baseExperience}</dd>
            </div>
            <div>
              <dt>Abilities</dt>
              <dd>{current.abilities.map(formatName).join(', ')}</dd>
            </div>
          </dl>

          <h2 className={styles.statsTitle}>Base stats</h2>
          <ul className={styles.stats}>
            {current.stats.map((s) => (
              <li key={s.name}>
                <span className={styles.statName}>{STAT_LABELS[s.name] ?? s.name}</span>
                <span className={styles.statValue}>{s.value}</span>
                <meter aria-label={STAT_LABELS[s.name] ?? s.name} min={0} max={255} value={s.value} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.pager}>
        <Link to={`/pokemon/${prevId}`} state={navState} className={styles.pagerBtn}>
          ← Previous
        </Link>
        <span className={styles.position}>
          {index + 1} of {ids.length}
        </span>
        <Link to={`/pokemon/${nextId}`} state={navState} className={styles.pagerBtn}>
          Next →
        </Link>
      </div>
    </article>
  )
}
