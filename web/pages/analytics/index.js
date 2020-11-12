import styles from '../../styles/pages/Analytics.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import LocationsChart from '../../components/Analytics/LocationsChart';
import AgeChart from '../../components/Analytics/AgeChart';
import DataTable from '../../components/Analytics/DataTable';

export default function Analytics() {
  const [columns, setColumns] = useState(null)
  const [data, setData] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/analytics/allData/`)
      .then(({ data }) => {
        setData(data.dataset);
        setAnalytics(data.analytics)
        setColumns(data.columns);
        console.log("Dataset received! ", data.dataset.length)
        console.log("Analytics received! ", data.analytics)
        console.log("Analytics received! ", data.locations)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
