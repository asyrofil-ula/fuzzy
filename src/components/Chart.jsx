import LineChart from "../elements/LineChart";

const Chart = ({data}) => {
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Fuzzifikasi Berdasarkan Backend",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Kategori",
            },
          },
          y: {
            title: {
              display: true,
              text: "Derajat Keanggotaan",
            },
            min: 0,
            max: 1,
          },
        },
    };
    const chartData = {
        labels: data.labels,
        datasets: data.datasets
    }

    return (
        <>
        <LineChart chartData={chartData} options={options} ></LineChart>
        </>
    )
}

export default Chart