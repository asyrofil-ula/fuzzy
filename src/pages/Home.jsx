import Modal from "../components/Modal";
import Label from "../fragments/Label";
import Input from "../fragments/Input";
import Card from "../components/Card";
import Chart from "../components/Chart";
import Button from "../elements/Button";
// import Rules from "../components/Rules";
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
    setErr((prev) => ({
      ...prev,
      permintaan: permValue < 1000 || permValue > 5000,
    }));
  }, 300);

  const handlePersediaan = debounce((value) => {
    const persValue = Math.max(0, parseInt(value, 10) || 0);
    setPersediaan(persValue);
    setErr((prev) => ({
      ...prev,
      persediaan: persValue < 100 || persValue > 600,
    }));
  }, 300);

  const submit = async () => {
    try {
      const response = await prediksi({ permintaan, persediaan });
      if (response.status === 200) {
        setHis(response.data);
        // console.log(response.data);
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
          label: "Input Permintaan",
          data: fuzzyData.permintaan.range.map((x) =>
            x === permintaan ? 1 : 0
          ),
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

      const produksiChartData = createChartData(
        fuzzyData.produksi.range,
        {
          label: "Rendah",
          data: fuzzyData.produksi.kecil,
          color: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Sedang",
          data: fuzzyData.produksi.sedang,
          color: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Banyak",
          data: fuzzyData.produksi.besar,
          color: "rgba(54, 162, 235, 0.6)",
        }
      );
      // console.log(fuzzyData);
      if (his) {
        produksiChartData.datasets.push({
          label: "Output Produksi",
          data: fuzzyData.produksi.range.map((x) =>
            x === his.produksi ? 1 : 0
          ),
          borderColor: "rgba(0, 0, 0, 0.39)",
          borderWidth: 2,
          borderDash: [5, 5],
        });
      }
      // console.log(his)
      setProduksiData(produksiChartData);
    }
  }, [fuzzyData, permintaan, persediaan,his]);

  return (
    <>
      <Card title="Prediksi Produksi Product">
        <Label>Permintaan (1000 - 5000)</Label>
        <Input
          type="number"
          placeholder="Masukkan permintaan"
          onChange={(e) => handlePermintaan(e.target.value)}
        />
        {err.permintaan && (
          <p style={{ color: "red" }}>Permintaan harus diantara 1000 - 5000</p>
        )}
        <Label>Persediaan (100 - 600)</Label>
        <Input
          type="number"
          placeholder="Masukkan persediaan"
          onChange={(e) => handlePersediaan(e.target.value)}
        />
        {err.persediaan && (
          <p style={{ color: "red" }}>Persediaan harus diantara 100 - 600</p>
        )}
        <Button
          type="submit"
          classname="btn btn-primary text-white"
          onClick={submit}
          disabled={
            err.permintaan || err.persediaan || !permintaan || !persediaan
          }
        >
          Prediksi
        </Button>
        <Modal title="Prediksi" onClick={closeModal} isOpen={isOpenModal}>
          {permintaanData && (
            <Chart
              data={permintaanData}
              maxMembership={
                his?.derajat_keanggotaan?.him_permintaan?.banyak || 0
              }
              rendah={his?.derajat_keanggotaan?.him_permintaan?.rendah || 0}
              sedang={his?.derajat_keanggotaan?.him_permintaan?.sedang || 0}
            />
          )}
          {persediaanData && (
            <Chart
              data={persediaanData}
              // input={persediaan}
              maxMembership={
                his?.derajat_keanggotaan?.him_persediaan?.banyak || 0
              }
              sedang={
                his?.derajat_keanggotaan?.him_persediaan?.sedang ||
                0
              }
              rendah={
                his?.derajat_keanggotaan?.him_persediaan?.minim || 0
              }
            />
          )}
          {produksiData && (
            <Chart
              data={produksiData}
              maxMembership={
                his?.derajat_keanggotaan?.him_produksi?.besar || 0
              }
              rendah={his?.derajat_keanggotaan?.him_produksi?.kecil || 0}
              sedang={his?.derajat_keanggotaan?.him_produksi?.sedang || 0}
            />
          )}
          {his && (
            <>
              <span>Hasil Prediksi Produksi: {his.produksi}</span>
              {/* <Rules/> */}
              <div className="overflow-x-auto text-center">
                <table className="table-zebra text-center">
                  <caption className="font-bold">Table Rule</caption>
                  <thead>
                    <tr>
                      <th>Rule</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(his.derajat_keanggotaan.alpha_rules).map(
                      ([rule, value]) => (
                        <tr key={rule}>
                          <td>{`${rule}`}</td>
                          <td>{`${value}`}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal>
      </Card>
    </>
  );
};

export default Home;
