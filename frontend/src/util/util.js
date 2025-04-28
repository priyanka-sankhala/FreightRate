import axios from "axios";
export const generateFormattedDate = (input) => {
  let date;
  if (input.replace(" ", "").length < 6) {
    date = new Date(input + "-2025");
  } else {
    date = new Date(input);
  }
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day.toString().padStart(2, "0")}-${(month + 1)
    .toString()
    .padStart(2, "0")}-${year}`;
};
const BASE_PATH = process.env.REACT_APP_API_URL;
export const dateFields = [
  "eta",
  "etd",
  "si_cut",
  "validity",
  "expire_date",
  "effective_date",
];

export const dataStore = async (formattedData) => {
  const jsonString = JSON.stringify(formattedData, null, 2); // pretty JSON (optional)
  const blob = new Blob([jsonString], { type: "application/json" });
  const file = new File([blob], "user-data.json", { type: "application/json" });
  //After file validate update the db
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${BASE_PATH}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
export const getdata = async () => {
  try {
    const response = await axios.get(`${BASE_PATH}/allFreightRate`, {});
    return response.data;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
