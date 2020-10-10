import styles from '../../styles/pages/Analytics.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import axios from 'axios'

export default function Analytics() {

  const testQueryServer = () => {
    axios.get(`/test/`)
      .then(({ data }) => {
        console.log("Successfully talked to the server!: ", data)
      }).catch((error) => {
        console.log(error)
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
      </div>
    </>
  )
}
