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

    const getArrOfRandomColors = (arr, num) => {
      let colorArr = []

      for (let i = 1; i < num; i++) {
        let randIndex = Math.floor(Math.random() * arr.length + 1)
        colorArr.push(arr[randIndex])
      }
      colorArr.unshift(arr[0])
      return colorArr
    }

    let chartData = {
      labels: Object.keys(locationsData),
      datasets: [{
        label: 'Locations of Covid Cases',
        data: Object.values(locationsData),
        backgroundColor: getArrOfRandomColors([
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(99, 255, 132, 0.2)',
          'rgba(162, 52, 235, 0.2)',
          'rgba(86, 206, 206, 0.2)',
          'rgba(75, 75, 192, 0.2)',
          'rgba(102, 152, 255, 0.2)',
          'rgba(100, 159, 64, 0.2)'
        ], Object.keys(locationsData).length),
        borderColor: getArrOfRandomColors([
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ], Object.keys(locationsData).length),
        borderWidth: 1,
      }]
    }

    return chartData
  }

  return (
    <div>
      <div style={{ display: "block", fontWeight: "bold", textAlign: "center", marginBottom: "10px" }}>
        Covid Cases by Location
      </div>
      <Bar data={() => getChartData()} options={chartOptions} width={600} height={400} />
    </div>
  )
}

export default LocationsChart
