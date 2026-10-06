import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

export default function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.ball} aria-hidden="true" />
            Pokédex
          </NavLink>
          <nav className={styles.nav} aria-label="Main">
            <NavLink to="/" end className={navClass}>
              Search
            </NavLink>
            <NavLink to="/gallery" className={navClass}>
              Gallery
            </NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        Data from <a href="https://pokeapi.co/">PokéAPI</a>. Pokémon © Nintendo / Game Freak.
      </footer>
    </div>
  )
}
