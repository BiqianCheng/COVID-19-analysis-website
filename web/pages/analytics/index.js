import styles from '../../styles/pages/Analytics.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import LocationsChart from '../../components/Analytics/LocationsChart';
import AgeChart from '../../components/Analytics/AgeChart';
import DataTable from '../../components/Analytics/DataTable';

export default function Analytics() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.title}>
            Analytics
          </div>
        </div>
      </div>
    </>
  )
}
