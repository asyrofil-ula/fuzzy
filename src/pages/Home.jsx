import Modal from "../components/Modal";
import Label from "../fragments/Label";
import Input from "../fragments/Input";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Button from "../elements/Button";
import BarChart from "../components/BarChart";
import { useEffect, useState } from "react";
// import Bar from ;

import { prediksi, fuzzification } from "../services/fuzzy.services";
// import BarChart from "../elements/Barchart";
const Home = () => {
  const [permintaan, setPermintaan] = useState(0);
  const [persediaan, setPersediaan] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fuzzyData, setFuzzyData] = useState(null);
  const [his, setHis] = useState(null);

  const [permintaanData, setPermintaanData] = useState(null);
  const [persediaanData, setPersediaanData] = useState(null);
  // const [produksiData, setProduksiData] = useState(null);

  const handlePermintaan = (value) => {
    const permValue = parseInt(value)
    setPermintaan(permValue);
    console.log(permValue);
  };

  const handlePersediaan = (value) => {
    const persValue = parseInt(value)
    setPersediaan(persValue);
    console.log(persValue);
  };

  const submit = async () => {
    try {
      // Fetch fuzzy data
      if (!fuzzyData) {
        const response = await fuzzification();
        setFuzzyData(response.data);
        // console.log(response.data);
      }
  
      // Perform prediction
      const response = await prediksi({ permintaan, persediaan });
      if (response.status === 200) {
        setHis(response.data);
        // console.log(response.data)
        openModal();
      } else {
        alert("Terjadi kesalahan saat memproses permintaan." + response.error);
        console.error("Error submit:", response.error);
      }
    } catch (e) {
      console.error("Error submit:", e);
      alert("Terjadi kesalahan saat memproses permintaan.");
    }
  };
  

  const openModal = () => {
    setIsOpenModal(true);
    document.getElementById("my_modal_3").showModal();
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const createChartData = (range,  ...datasets) => ({
    labels: range,
    datasets: [
      ...datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        borderWidth: 2,
        fill: false,
      })),
      // Tambahkan garis input sebagai dataset tambaha
    ],
  });
  const barChart = {
    labels: ['0', '10', '25', '40'],
    datasets: [
      {
        label: "μ(Jumlah Produksi)",
        data: [
          his?.him_produksi?.fproduksi_tidak || 0,
          his?.him_produksi?.fproduksi_kecil || 0,
          his?.him_produksi?.fproduksi_sedang || 0,
          his?.him_produksi?.fproduksi_tinggi || 0,
        ],
        backgroundColor: "black", // Warna batang vertikal
        barThickness: 4, // Ketebalan batang
      },
    ],
  };
  
useEffect(() => {
    if (fuzzyData) {
      const permintaanChartData = createChartData(
        fuzzyData.permintaan.range,
        {
          label: "Rendah",
          data: fuzzyData.permintaan.rendah,
          color: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Sedang",
          data: fuzzyData.permintaan.sedang,
          color: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Banyak",
          data: fuzzyData.permintaan.banyak,
          color: "rgba(54, 162, 235, 0.6)",
        }
      );
      if (permintaan) {
        permintaanChartData.datasets.push({
          type: "bar",
          label: "Input Permintaan",
          data: fuzzyData.permintaan.range.map((x) => (x === permintaan ? 1 : 0)),
          borderColor: "rgba(0, 0, 0, 0.39)",
          borderWidth: 2,
          borderDash: [5, 5],
        });
      }

      setPermintaanData(permintaanChartData);

      const persediaanChartData = createChartData(
        fuzzyData.persediaan.range,
        {
          label: "Minim",
          data: fuzzyData.persediaan.minim,
          color: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Sedang",
          data: fuzzyData.persediaan.sedang,
          color: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Banyak",
          data: fuzzyData.persediaan.banyak,
          color: "rgba(54, 162, 235, 0.6)",
        }
      );
      if (persediaan) {
        
        persediaanChartData.datasets.push({
          type: "bar",
          label: "Input Persediaan",
          data: fuzzyData.persediaan.range.map((x) =>
            x === persediaan ? 1 : 0
          ),
          borderColor: "rgba(0, 0, 0, 0.39)",
          borderWidth: 2,
          borderDash: [5, 5],
        });
      }
      setPersediaanData(persediaanChartData);
      
    }

  }, [fuzzyData, permintaan, persediaan,his]);


  return (
    <>
      <Card title="Prediksi Produksi Product">
        <div className="mb-4">
        <Label>Permintaan</Label>
        <Input
          type="number"
          placeholder="Masukkan permintaan"
          onChange={(e) => handlePermintaan(e.target.value)}
        />
        </div>
        <div className="mb-4">
        <Label>Persediaan</Label>
        <Input
          type="number"
          placeholder="Masukkan persediaan"
          onChange={(e) => handlePersediaan(e.target.value)}
        />
        </div>
        <div className="mt-6 text-center">
        <Button
          type="submit"
          classname="btn w-full bg-accent text-white font-bold py-2 px-4 rounded-md hover:bg-accent-hover transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={submit}
        >
          Prediksi
        </Button>
        {/* <BarChart></BarChart> */}
        </div>
        <Modal title="Prediksi" onClick={closeModal} isOpen={isOpenModal}>
          {permintaanData && (
            <Chart
              data={permintaanData}
              maxMembership={
                his?.him_permintaan?.banyak || 0
              }
              rendah={his?.him_permintaan?.rendah || 0}
              sedang={his?.him_permintaan?.sedang || 0}
            />
          )}
          {persediaanData && (
            <Chart
              data={persediaanData}
              // input={persediaan}
              maxMembership={
                his?.him_persediaan?.banyak || 0
              }
              sedang={
                his?.him_persediaan?.sedang ||
                0
              }
              rendah={
                his?.him_persediaan?.minim || 0
              }
            />
          )}
          <BarChart barChart={barChart}></BarChart>
          {his && (
            <>
              <span>Hasil Prediksi Produksi: {his.produksi}</span>
            </>
          )}
        </Modal>
      </Card>
    </>
  );
};

export default Home;
