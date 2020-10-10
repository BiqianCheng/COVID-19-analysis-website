import styles from '../styles/pages/Home.module.css'
import Navbar from '../components/Navbar/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            BBCDS Corona Analytics
          </div>
          <div className={styles.description}>
            Helping you understand the current state of Corona
          </div>
        </div>
      </div>
    </>
  )
}
