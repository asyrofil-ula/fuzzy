/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({barChart}) => {
  const labels= ['0', '10', '25', '40'];

  const categories = ['No Produksi', 'Kecil', 'Sedang', 'Besar']; // Label variabel di atas titik

  // Opsi untuk konfigurasi grafik
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hilangkan legend
      title: {
        display: true,
        text: 'Fungsi Keanggotaan Produksi',
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Keanggotaan: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: true }, // Hilangkan grid pada sumbu X
        ticks: {
          callback: function (value, index) {
            return labels[index]; // Nilai di bawah batang
          },
          font: { size: 12 },
        },
        title: {
          display: true,
          text: 'Jumlah Produksi (Jmlh)',
          font: { size: 14 },
        },
      
      },
      y: {
        grid: { display: true }, 
        max : 1,
        min : 0,
        ticks: {
          max: 1,
          stepSize: 0.1, // Langkah pada sumbu Y
          font: { size: 12 },
          
        },
        title: {
          display: true,
          text: 'μ(Jumlah Produksi)',
          font: { size: 14 },
        },
      },
    },
    layout: {
      padding: {
        top: 20, // Ruang tambahan untuk label variabel di atas
      },
    },
    elements: {
      bar: {
        borderSkipped: false, // Batang penuh tanpa tepi
      },
    },
  };

  // Fungsi untuk menggambar label variabel di atas
  const customLabels = {
    id: 'customLabels',
    afterDatasetsDraw(chart) {
      const { ctx, data } = chart;
      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        const label = categories[index]; // Variabel di atas batang
        const value = data.labels[index]; // Nilai di bawah batang

        // Gambar label di atas batang
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, bar.x, bar.y - 10); // Variabel di atas batang
        ctx.restore();
      });
    },
  };

  return (
    <Bar
      data={barChart}
      options={options}
      plugins={[customLabels]} // Tambahkan plugin customLabels
    />
  );
};

export default BarChart;
