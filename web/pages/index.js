import styles from '../styles/pages/Home.module.css'
import Navbar from '../components/Navbar/Navbar'
import { useState } from 'react';
import axios from 'axios'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.pageContainer}>
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
