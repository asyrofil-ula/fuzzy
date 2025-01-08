/* eslint-disable react/prop-types */
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const Chart = ({ data,  maxMembership, rendah, sedang }) => {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      annotation: {
        annotations: {
          maxLine: {
            type: "line",
            yMin: maxMembership,
            yMax: maxMembership,
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              enabled: true,
              content: `Max Membership: [${maxMembership}]`,
              position: "end",
            },
          },
          minLine: {
            type: "line",
            yMin: rendah,
            yMax: rendah,
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [10, 5],
            label: {
              enabled: true,
              content: `Min Membership: [${rendah}]`,
              position: "start",
            },
          },
          avgLine: {
            type: "line",
            yMin: sedang,
            yMax: sedang,
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
              enabled: true,
              content: `Average Membership: [${sedang}]`,
              position: "center",
            },
          },         
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Permintaan / Persediaan",
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
    elements: {
      line: {
        tension: 0, // no smoothing
      },
    },
  };

  return <Line data={data} options={chartOptions} />;
};

export default Chart;