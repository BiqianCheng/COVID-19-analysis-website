import styles from '../../styles/pages/Analytics.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import axios from 'axios'
import { CircularProgress } from '@material-ui/core'
import { Doughnut, Bar } from 'react-chartjs-2';

export default function Analytics() {

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  // var chartData = {
  //   labels: ['Country', 'Age', 'Gender'],
  //   datasets: [{
  //     label: 'Covid Cases',
  //     data: [1, 2, 3],
  //     backgroundColor: [
  //       'rgba(255, 99, 132, 0.2)',
  //       'rgba(54, 162, 235, 0.2)',
  //       'rgba(255, 206, 86, 0.2)',
  //       'rgba(75, 192, 192, 0.2)',
  //       'rgba(153, 102, 255, 0.2)',
  //       'rgba(255, 159, 64, 0.2)'
  //     ],
  //     borderColor: [
  //       'rgba(255, 99, 132, 1)',
  //       'rgba(54, 162, 235, 1)',
  //       'rgba(255, 206, 86, 1)',
  //       'rgba(75, 192, 192, 1)',
  //       'rgba(153, 102, 255, 1)',
  //       'rgba(255, 159, 64, 1)'
  //     ],
  //     borderWidth: 1
  //   }]
  // }

  const testQueryServer = () => {
    const testInputs = {
      "country": "China",
      "age": "36",
      "gender": "male"
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
        </div>
        {loading &&
          <div className={styles.loading}>
            <CircularProgress style={{ color: 'black' }} size={16} />
          </div>
        }

        {data &&
          <>
            <div className={styles.table}>
              <div id="column-headers" className={styles.row}>
                <div className={styles.column}>Index</div>
                <div className={styles.column}>Reporting Date</div>
                <div className={styles.column}>Country</div>
                <div className={styles.column}>Location</div>
                <div className={styles.column}>Age</div>
                <div className={styles.column}>Gender</div>
                <div className={styles.column}>Death</div>
              </div>
              {
                data.map((point, index) =>
                  <div className={styles.row} key={point.link}>
                    <div className={styles.column}>{index + 1}</div>
                    <div className={styles.column}>{point["reporting date"]}</div>
                    <div className={styles.column}>{point.country}</div>
                    <div className={styles.column}>{point.location}</div>
                    <div className={styles.column}>{point.age}</div>
                    <div className={styles.column}>{point.gender}</div>
                    <div className={styles.column}>{point.death ? "Yes" : "No"}</div>
                  </div>
                )
              }
            </div>
            {/* <div className={styles.charts}>
              <Bar data={chartData} />
            </div> */}
          </>
        }
      </div>
    </>
  )
}
