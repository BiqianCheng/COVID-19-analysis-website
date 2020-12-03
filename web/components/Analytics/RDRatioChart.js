import { Pie } from "react-chartjs-2";

const RDRatioChart = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const labels = ["Recovered", "Death", "Confirmed"];

  const getChartData = () => {
    if (!data) return {};

    let RDRatioData = { recovered: 0, death: 0, confirmed: 0 };

    data.map((d) => {

      if (d.recovered == true) RDRatioData["recovered"]++;
      if (d.death == true) RDRatioData["death"]++;
      RDRatioData["confirmed"]++;
    });

    let chartData = {
      labels: labels,
      datasets: [
        {
          label: "Recovered / Death Ratio",
          data: Object.values(RDRatioData),
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(175, 50, 50, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(175, 50, 50, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
      borderWidth: 1,
    };
    return chartData;
  };

  return (
    <div>
      <div
        style={{
          display: "block",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Recovered / Death Ratio
      </div>
      <Pie
        data={() => getChartData()}
        options={chartOptions}
        width={600}
        height={400}
      />
    </div>
  );
};

export default RDRatioChart;
