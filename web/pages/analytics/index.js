import styles from '../../styles/pages/Analytics.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import LocationsChart from '../../components/Analytics/LocationsChart';
import DataTable from '../../components/Analytics/DataTable';

export default function Analytics() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const testQueryServer = () => {
    const testInputs = {
      "country": "UK",
      // "age": "53",
      // "gender": "male"
    }
    setLoading(true)
    axios.get(`/analytics/search/`, {
      params: {
        data: testInputs,
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
  }

  const testInsertData = () => {
    const jsonData = {
      age: 33,
      country: "USA",
      location: "San Francisco",
      gender: "male",
      recovered: true,
      death: false
    }

    axios.post(`/admin/insert/`, { jsonData })
      .then(({ data }) => {
        console.log("Succesfully inserted data into file: ", data.csv)
      }).catch((error) => {
        console.log(error)
      })
  }

  const testUpdateData = () => {
    let id = 1088

    const jsonData = {
      age: 54,
      country: "USA",
      location: "Los Angeles",
      gender: "female",
      recovered: true,
      death: false
    }

    axios.put(`/admin/update/${id}`, { jsonData })
      .then(({ data }) => {
        console.log("Succesfully updated data in the dataset: ", data.updatedData)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response.data)
        } else {
          console.log(error)
        }
      })
  }

  const testDeleteData = () => {
    let id = 1089

    axios.delete(`/admin/delete/${id}`)
      .then(() => {
        console.log("Succesfully deleted data in the dataset: ", id)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response.data)
        } else {
          console.log(error)
        }
      })
  }

  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <div className={styles.title}>
            Analytics
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <Button variant="contained" color="primary" onClick={testQueryServer}>Test Query Server</Button>
          <Button variant="contained" color="primary" onClick={testInsertData}>Test Insert Data</Button>
          <Button variant="contained" color="primary" onClick={testUpdateData}>Test Update Data</Button>
          <Button variant="contained" color="primary" onClick={testDeleteData}>Test Delete Data</Button>
        </div>
        {loading &&
          <div className={styles.loading}>
            <CircularProgress style={{ color: 'black' }} size={16} />
          </div>
        }
        {data &&
          <div className={styles.analytics}>
            <div className={styles.table}>
              <DataTable data={data} key={data} />
            </div>
            <div className={styles.charts}>
              <LocationsChart data={data} />
            </div>
          </div>
        }
      </div>
    </>
  )
}
