/* eslint-disable react/prop-types */

import {Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';



ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );
const LineChart = (props) => {
    const {chartData, options} = props;
    return (
        <Line data={chartData} options={options} />
    )
}

export default LineChart
