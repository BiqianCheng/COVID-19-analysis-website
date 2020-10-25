import styles from '../../styles/pages/Admin.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import DataTable from '../../components/Analytics/DataTable';

export default function Analytics() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`/analytics/search/`, {
      params: {
        data: {},
      }
    })
      .then(({ data }) => {
        console.log("Successfully talked to the server!: ", data.filteredData)
        setData(data.filteredData)
      }).catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleInsertData = () => {

  }

  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.title}>
            Admin
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <Button variant="contained" color="primary" onClick={handleInsertData}>Insert Data</Button>
        </div>
        {loading &&
          <div className={styles.loading}>
            <CircularProgress style={{ color: 'black' }} size={16} />
          </div>
        }
        {data &&
          <div className={styles.table}>
            <DataTable data={data} key={data} />
          </div>
        }
      </div>
    </>
  )
}
