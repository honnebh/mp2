import styles from './Status.module.css'

// Shows a loading message or an error; renders nothing otherwise.
export default function Status({ loading, error }: { loading: boolean; error: string | null }) {
  if (error) return <p className={`${styles.box} ${styles.error}`}>{error}</p>
  if (loading) return <p className={styles.box}>Loading Pokémon…</p>
  return null
}
