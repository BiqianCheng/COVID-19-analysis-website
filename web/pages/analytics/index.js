import styles from '../../styles/pages/Analytics.module.css'
import Navbar from '../../components/Navbar/Navbar'

export default function Analytics() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            Analytics
          </div>
        </div>
      </div>
    </>
  )
}
