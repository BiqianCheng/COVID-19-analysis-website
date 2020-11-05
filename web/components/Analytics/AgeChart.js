import { Doughnut } from 'react-chartjs-2';

const AgeChart = ({ data }) => {

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }

  const getChartData = () => {
    if (!data) return {}

    let ageData = {
      "0-17": 0,
      "18-29": 0,
      "30-44": 0,
      "45-59": 0,
      "60+": 0,
    }

    data.filter(d => d.age && d.death).map((d, i) => {
      if (d.age <= 17) {
        ageData["0-17"] = ageData["0-17"] + 1
      } else if (d.age <= 29) {
        ageData["18-29"] = ageData["18-29"] + 1
      } else if (d.age <= 44) {
        ageData["30-44"] = ageData["30-44"] + 1
      } else if (d.age <= 59) {
        ageData["45-59"] = ageData["45-59"] + 1
      } else if (d.age >= 60) {
        ageData["60+"] = ageData["60+"] + 1
      }
    })

    let chartData = {
      labels: ["0-17", "18-29", "30-44", "45-59", "60+"],
      datasets: [{
        label: 'Age Data of Covid Cases',
        data: Object.values(ageData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      }]
    }

    return chartData
  }

  return (
    <div>
      <div style={{ display: "block", fontWeight: "bold", textAlign: "center", marginBottom: "10px" }}>
        Covid Cases by Age
      </div>
      <Doughnut data={() => getChartData()} options={chartOptions} width={600} height={400} />
    </div>
  )
}

export default AgeChart
