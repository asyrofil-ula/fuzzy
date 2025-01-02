import Modal from "../components/Modal";
import Label from "../fragments/Label";
import Input from "../fragments/Input";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Button from "../elements/Button";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { prediksi, fuzzification } from "../services/fuzzy.services";

const Home = () => {
  const [permintaan, setPermintaan] = useState(0);
  const [persediaan, setPersediaan] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fuzzyData, setFuzzyData] = useState(null);
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [his, setHis] = useState(null);

  const handlePermintaan = (event) => {
    const value = Math.max(0, parseInt(event.target.value, 10) || 0);
    setPermintaan(value);
  };

  const handlePersediaan = (event) => {
    const value = Math.max(0, parseInt(event.target.value, 10) || 0);
    setPersediaan(value);
  };

  const submit = async () => {
    try {
      const response = await prediksi({ permintaan, persediaan });
      if (response.status === 200) {
        setHis(response.data);
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

  useEffect(() => {
    if (his) {
      const { derajat_keanggotaan } = his;
      if (derajat_keanggotaan?.him_permintaan) {
        const { rendah, sedang, banyak } = derajat_keanggotaan.him_permintaan;
        setData({
          labels: Array.from({ length: 3 }, (_, index) => ["Rendah", "Sedang", "Banyak"][index]),
          datasets: [
            {
              label: "Permintaan",
              data: [rendah, sedang, banyak],
              backgroundColor: ["rgba(209, 0, 0, 0.6)", "rgba(0, 209, 0, 0.6)", "rgba(0, 0, 209, 0.6)"],
              borderColor: "rgba(0, 0, 0, 0.6)",
              // borderWidth: 2,
            },
          ],
        });
      }
    }
  }, [his]);

  useEffect(() => {
    const fetchFuzzyData = async () => {
      try {
        if (!fuzzyData) {
          const response = await fuzzification();
          setFuzzyData(response.data);
          console.log(response.data);
        }
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching fuzzy data:", error);
      }
    };
    fetchFuzzyData();
  }, []);

  const createChartData = (range, ...datasets) => ({
    labels: range,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.color,
      // borderWidth: 2,
      // fill: false,
    })),
  });

  const permintaanData = fuzzyData?.permintaan
    ? createChartData(
        fuzzyData.permintaan.range,
        { label: "Rendah", data: fuzzyData.permintaan.rendah, color: "blue" },
        { label: "Sedang", data: fuzzyData.permintaan.sedang, color: "green" },
        { label: "Banyak", data: fuzzyData.permintaan.banyak, color: "red" }
      )
    : null;

  const persediaanData = fuzzyData?.persediaan
    ? createChartData(
        fuzzyData.persediaan.range,
        { label: "Minim", data: fuzzyData.persediaan.minim, color: "purple" },
        { label: "Sedang", data: fuzzyData.persediaan.sedang, color: "orange" },
        { label: "Banyak", data: fuzzyData.persediaan.banyak, color: "cyan" }
      )
    : null;

  const produksiData = fuzzyData?.produksi
    ? createChartData(
        fuzzyData.produksi.range,
        { label: "Kecil", data: fuzzyData.produksi.kecil, color: "brown" },
        { label: "Sedang", data: fuzzyData.produksi.sedang, color: "pink" },
        { label: "Besar", data: fuzzyData.produksi.besar, color: "yellow" }
      )
    : null;

  return (
    <>
      <Card>
        <Label>Masukkan Permintaan</Label>
        <Input type="number" id="permintaan" onChange={handlePermintaan} />
        <Label>Masukkan Jumlah Persediaan</Label>
        <Input type="number" id="persediaan" onChange={handlePersediaan} />
        <Button
          type="submit"
          role="submit"
          classname="btn btn-primary text-white"
          onClick={submit}
        >
          Prediksi
        </Button>

        <Modal title="Prediksi" onClick={closeModal} isOpen={isOpenModal}>
          {permintaanData && <Chart data={permintaanData} />}
          {persediaanData && <Chart data={persediaanData} />}
          {produksiData && <Chart data={produksiData} />}
          <Table></Table>
        </Modal>
      </Card>
    </>
  );
};

export default Home;
