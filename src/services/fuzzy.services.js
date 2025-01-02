import axios from "axios";

const prediksi = async ({ permintaan, persediaan }) => {
  const response = await axios.post("http://127.0.0.1:3000/prediksi", { permintaan, persediaan }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response;
};

const fuzzification = async () => {
  const response = await axios.get("http://127.0.0.1:3000/fuzzification");
  return await response;
}
export { prediksi, fuzzification }