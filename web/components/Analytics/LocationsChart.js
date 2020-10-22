import { Bar } from 'react-chartjs-2';

const LocationsChart = ({ data }) => {

  const chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false
  }

  const getChartData = () => {
    if (!data) return {}

    let locationsData = {}

    data.map(d => d.location).map((d, i) => {
      var key = d
      // Create an object key with the name of the array element
      // if the key already exists then increment the value of the key
      locationsData[key] = locationsData[key] ? locationsData[key] + 1 : 1
    })

    console.log("Test: ", locationsData)

    let chartData = {
      labels: Object.keys(locationsData),
      datasets: [{
        label: 'Locations of Covid Cases',
        data: Object.values(locationsData),
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
    <Bar data={() => getChartData()} options={chartOptions} width="600" height="400" />
  )
}

export default LocationsChart
