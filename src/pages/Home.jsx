import Modal from "../components/Modal";
import Label from "../fragments/Label";
import Input from "../fragments/Input";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Button from "../elements/Button";
// import Table from "../components/Table";
import { useEffect, useState } from "react";
import { prediksi, fuzzification } from "../services/fuzzy.services";

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const Home = () => {
  const [permintaan, setPermintaan] = useState(0);
  const [persediaan, setPersediaan] = useState(0);
  const [err, setErr] = useState({ permintaan: false, persediaan: false });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [fuzzyData, setFuzzyData] = useState(null);
  const [his, setHis] = useState(null);

  const [permintaanData, setPermintaanData] = useState(null);
  const [persediaanData, setPersediaanData] = useState(null);
  const [produksiData, setProduksiData] = useState(null);

  const handlePermintaan = debounce((value) => {
    const permValue = Math.max(0, parseInt(value, 10) || 0);
    setPermintaan(permValue);
    if (permValue < 1000 || permValue > 5000) {
      setErr((prev) => ({ ...prev, permintaan: true }));
    } else {
      setErr((prev) => ({ ...prev, permintaan: false }));
    }
  }, 300);

  const handlePersediaan = debounce((value) => {
    const persValue = Math.max(0, parseInt(value, 10) || 0);
    setPersediaan(persValue);
    if (persValue < 100 || persValue > 600) {
      setErr((prev) => ({ ...prev, persediaan: true }));
    } else {
      setErr((prev) => ({ ...prev, persediaan: false }));
    }
  }, 300);

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

  const createChartData = (range, ...datasets) => ({
    labels: range,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.color,
    })),
  });

  useEffect(() => {
    const fetchFuzzyData = async () => {
      try {
        const response = await fuzzification();
        setFuzzyData(response.data);
      } catch (error) {
        console.error("Error fetching fuzzy data:", error);
      }
    };
    fetchFuzzyData();
  }, []);

  useEffect(() => {
    if (fuzzyData) {
      const permintaanChartData = createChartData(
        fuzzyData.permintaan.range,
        { label: "Rendah", data: fuzzyData.permintaan.rendah, color: "blue" },
        { label: "Sedang", data: fuzzyData.permintaan.sedang, color: "green" },
        { label: "Banyak", data: fuzzyData.permintaan.banyak, color: "red" }
      );
      setPermintaanData(permintaanChartData);

      const persediaanChartData = createChartData(
        fuzzyData.persediaan.range,
        { label: "Minim", data: fuzzyData.persediaan.minim, color: "purple" },
        { label: "Sedang", data: fuzzyData.persediaan.sedang, color: "orange" },
        { label: "Banyak", data: fuzzyData.persediaan.banyak, color: "cyan" }
      );
      setPersediaanData(persediaanChartData);

      const produksiChartData = createChartData(
        fuzzyData.produksi.range,
        { label: "Kecil", data: fuzzyData.produksi.kecil, color: "brown" },
        { label: "Sedang", data: fuzzyData.produksi.sedang, color: "pink" },
        { label: "Besar", data: fuzzyData.produksi.besar, color: "yellow" }
      );
      setProduksiData(produksiChartData);
    }
  }, [fuzzyData]);

  useEffect(() => {
    if (his) {
      const { derajat_keanggotaan } = his;
      console.log(his.permintaan);

      if (derajat_keanggotaan?.him_permintaan) {
        const { rendah, sedang, banyak } = derajat_keanggotaan.him_permintaan;
        setPermintaanData((prev) => ({
          ...prev,
          datasets: [
            ...prev.datasets,
            {
              label: "Him Permintaan",
              data: [rendah, sedang, banyak],
              backgroundColor: [
                "rgba(209, 0, 0, 0.3)",
                "rgba(0, 209, 0, 0.3)",
                "rgba(0, 0, 209, 0.3)",
              ],
              borderColor: "rgba(0, 0, 0, 0.3)",
            },
          ],
        }));
      }

      if (derajat_keanggotaan?.him_persediaan) {
        const { minim, sedang, banyak } = derajat_keanggotaan.him_persediaan;
        setPersediaanData((prev) => ({
          ...prev,
          datasets: [
            ...prev.datasets,
            {
              label: "Him Persediaan",
              data: [minim, sedang, banyak],
              backgroundColor: [
                "rgba(128, 0, 128, 0.3)",
                "rgba(255, 165, 0, 0.3)",
                "rgba(0, 255, 255, 0.3)",
              ],
              borderColor: "rgba(0, 0, 0, 0.3)",
            },
          ],
        }));
      }
    }
  }, [his]);

  return (
    <>
      <Card title="Prediksi Produksi product">
        
          <Label>Masukkan Permintaan (1000 - 5000)</Label>
          <Input
            type="number"
            placeholder="Masukkan permintaan"
            id="permintaan"
            onChange={(e) => handlePermintaan(e.target.value)}
          />
          {err.permintaan && (
            <p style={{ color: "red" }}>
              Permintaan harus diantara 1000 - 5000
            </p>
          )}
          <Label>Masukkan Jumlah Persediaan (100 - 600)</Label>
          <Input
            type="number"
            placeholder="Masukkan persediaan"
            id="persediaan"
            onChange={(e) => handlePersediaan(e.target.value)}
          />
          {err.persediaan && (
            <p style={{ color: "red" }}>Persediaan harus diantara 100 - 600</p>
          )}
          <Button
            type="submit"
            role="submit"
            classname="btn btn-primary text-white"
            onClick={submit}
            disabled={!!err.permintaan || !!err.persediaan}
          >
            Prediksi
          </Button>
        <Modal title="Prediksi" onClick={closeModal} isOpen={isOpenModal}>
          {permintaanData && (
            <Chart
              data={permintaanData}
              options={{ responsive: true }}
              input={his?.permintaan || 0}
              maxMembership={
                his?.derajat_keanggotaan?.him_permintaan?.max_membership || 0
              }
            />
          )}
          {persediaanData && (
            <Chart
              data={persediaanData}
              options={{ responsive: true }}
              input={his?.persediaan || 0}
              maxMembership={
                his?.derajat_keanggotaan?.him_persediaan?.max_membership || 0
              }
            />
          )}
          {produksiData && (
            <Chart data={produksiData} options={{ responsive: true }} />
          )}
          <>
            <p>Hasil Prediksi Produksi</p>
            {his && <p>{his.produksi}</p>}
          </>
        </Modal>
      </Card>
    </>
  );
};

export default Home;
