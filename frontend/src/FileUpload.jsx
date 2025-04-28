import { FileText, UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  dataStore,
  dateFields,
  generateFormattedDate,
} from "./util/util";

import { fieldAliases } from "./util/fieldAliases";
import Table from "./Table";

export default function FileUpload({
  setShowUploader,
  setError,
  setMessage,
}) {
  const [file, setFile] = useState("");
  const [matchedFields, setMatchedFields] = useState({});
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!file) {
      return;
    }
    if (!file.type.includes("text/csv") && !file?.type.includes("sheet")) {
      setError("Only csv and xls file allows");
      setInterval(() => {
        setError(null);
      }, 10000);
      return;
    }
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
      });

      if (jsonData.length === 0) {
        setError("Empty Excel sheet");
        return;
      }

      const fileHeaders = Object.keys(jsonData[0]);
      const fieldMap = {};

      // Match headers
      for (let h of fileHeaders) {
        const match = matchField(h);
        if (match) fieldMap[h] = match;
      }
      setMatchedFields(fieldMap);
      const rowErrors = [];
      const normalizedData = [];
      jsonData.forEach((row, idx) => {
        const newRow = {};
        for (const [xlsxField, dbField] of Object.entries(fieldMap)) {
          newRow[dbField] = row[xlsxField];
          //if 20 and 40 GP both have price create new different entries
          if (xlsxField === "20'GP" && row["40'GP"] !== "") {
            newRow["container_type"] = "20'GP";
            newRow["ocean_freight_rate"] = Number(row[xlsxField].replace(/[$,]/g, ""));
          }
          if (xlsxField === "40'GP" && row["40'GP"] !== "") {
            newRow["container_type"] = "40'GP";
            newRow["ocean_freight_rate"] = Number(row[xlsxField].replace(/[$,]/g, ""));
          }
          //remove the money sign and number formate
          if (dbField === "ocean_freight_rate") {
            newRow[dbField] = Number(row[xlsxField].replace(/[$,]/g, ""));
          }

          if (dateFields.includes(dbField)) {
            newRow[dbField] = generateFormattedDate(row[xlsxField]);
          }
          if (
            (dbField === "effective_date" || dbField === "expire_date") &&
            row[xlsxField] &&
            isNaN(Date.parse(row[xlsxField]))
          ) {
            rowErrors.push(`Row ${idx + 2}: Invalid effective date`);
          }
        }
        if (row["20'GP"] && row["40'GP"]) {
          normalizedData.push({ ...newRow, ocean_freight_rate: row["20'GP"] });
          normalizedData.push({ ...newRow, ocean_freight_rate: row["40'GP"] });
        } else {
          normalizedData.push(newRow);
        }
      });

      if (rowErrors.length > 0) {
        setError(rowErrors.join(", "));
        setInterval(() => {
          setError()
        }, 10000);
      } else {
        setError();
        setData(normalizedData);
       // setAllFreightRate(normalizedData)
        //file upload on server and store data in DB
        const result = await dataStore(normalizedData);
        setMessage(result.message);
        setInterval(() => {
          setMessage()
        }, 10000);
      }
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  const matchField = (header) => {
    for (const [dbField, aliases] of Object.entries(fieldAliases)) {
      if (header === "O/F 10-MAR") {
        console.log(
          "db",
          header,
          "alis",
          header.toLowerCase().includes("O/F".toLowerCase())
        );
        console.log(
          aliases.some(
            (alias) =>
              alias.toLowerCase() === header.toLowerCase().trim() ||
              header.toLowerCase().includes(alias.toLowerCase())
          )
        );
      }
      if (
        aliases.some(
          (alias) =>
            alias.toLowerCase() === header.toLowerCase().trim() ||
            header.toLowerCase().includes(alias.toLowerCase())
        )
      ) {
        return dbField;
      }
    }
    return null;
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return ( 
    <div className="fixed w-full inset-0 bg-gray-400 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl p-6">
        {/* Heading */}
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Upload Necessary Documents
        </h2>

        {!file &&       
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-400 rounded cursor-pointer">
            <UploadCloud className="text-blue-400 mb-2" size={40} />
            <span className="text-gray-700">
              Click or drag file to this area to upload
            </span>
            <span className="text-sm text-gray-500 text-center px-6">
              Please upload all necessary permits and certificates for this
              customer. Ensure files are in csv format for optimal compatibility.
            </span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
            <button className="mt-3 px-4 py-1 bg-black text-white rounded">
              Browse File
            </button>
          </label>
        }
        <div className="mt-4 mb-2">
          <h4 className="text-sm font-medium mb-1">Uploaded Files</h4>
          <div className="flex items-center gap-2 p-2 border rounded bg-gray-100">
            <FileText className="text-gray-500" />
            <span className="text-sm">
              {file ? file.name : "No File Uploaded yet"}
            </span>
          </div>
        </div>



     <Table data={data}/>
        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded border border-gray-400 text-gray-700"
            onClick={() => setShowUploader(false)}
          >
            Close
          </button>
        </div>
        {/* Maping overview */}
        {Object.keys(matchedFields).length > 0 && (
          <div className="text-sm text-gray-600">
            <strong>Matched Fields:</strong>
            <ul className="list-disc list-inside">
              {Object.entries(matchedFields).map(([csv, db]) => (
                <li key={csv}>
                  <span className="text-blue-700">{csv}</span> → {db}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
