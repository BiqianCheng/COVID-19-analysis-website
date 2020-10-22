import styles from '../../styles/components/Navbar.module.css'
import Link from 'next/link'

const Navbar = () => {

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        BBCDS
      </div>
      <Link href="/">
        <a className={styles.link}>Home</a>
      </Link>
      <Link href="/analytics">
        <a className={styles.link}>Analytics</a>
      </Link>
    </div >
  )
}

export default Navbar
