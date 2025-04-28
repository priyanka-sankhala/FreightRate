import { useState, useEffect } from "react";
import { Upload, ChevronDown } from "lucide-react";
import FileUpload from "./FileUpload";
import { Error, Success } from "./Message";
import { getdata } from "./util/util";
import Table from "./Table";

export default function App() {
  const [showUploader, setShowUploader] = useState(false);
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const [allFreightRate, setAllFreightRate] = useState([]);

  useEffect(() => {
        // Fetch data when component loads
        const fetchData = async () => {
          try {
            const response = await getdata();
            setAllFreightRate(response.data);
          } catch (err) {
            setError('Failed to fetch data.');
          }
        };   
        fetchData();
      }, [showUploader]); 
  
  return (
    <div className="min-h-screen bg-gray-300 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Hello, John!</h1>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow">
            John <ChevronDown size={16} />
          </button>
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow"
          >
            <Upload size={16} /> Import file <ChevronDown size={16} />
          </button>
        </div>
      </div>
      {error && <Error errorMessage={error} />}
      {message && <Success message={message} />}

      <h2 className="text-lg font-semibold mb-2">Quotes</h2>
      <Table data={allFreightRate}/>
      {showUploader && (
        <FileUpload
          setShowUploader={setShowUploader}
          setError={setError}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}
