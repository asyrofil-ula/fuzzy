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

const Chart = ({ data, input, maxMembership }) => {
 
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
          line1: {
            type: "line",
            xMin: input,
            xMax: input,
            borderColor: "black",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              enabled: true,
              content: `Input Permintaan: ${input}`,
              position: "top",
            },
          },
          line2: {
            type: "line",
            yMin: maxMembership,
            yMax: maxMembership,
            borderColor: "orange",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              enabled: true,
              content: `Max Membership: ${maxMembership}`,
              position: "end",
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          // text: "Permintaan / Persediaan",
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
    // elements: {
    //   line: {
    //     tension: 0, // no smoothing
    //   },
    // },
  };
  

  return <Line data={data} options={chartOptions} />;
};

export default Chart;
