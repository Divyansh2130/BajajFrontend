import { useState } from "react";
import axios from "axios";

function App() {
  document.title = "22BCS17108";
  
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
        throw new Error("Invalid JSON format. Expected { \"data\": [values] }");
      }

      const response = await axios.post("http://localhost:3000/bfhl", parsedJson);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOptions([...e.target.selectedOptions].map((opt) => opt.value));
  };

  const filteredResponse = () => {
    if (!data) return [];
    let filteredData = [];
    if (selectedOptions.includes("Alphabets")) {
      filteredData = filteredData.concat(data.alphabets || []);
    }
    if (selectedOptions.includes("Numbers")) {
      filteredData = filteredData.concat(data.numbers || []);
    }
    if (selectedOptions.includes("Highest alphabet")) {
      filteredData.push(data.highestAlphabet);
    }
    return filteredData;
  };

  return (
    <div className="container">
      <h1>JSON Input Processor</h1>
      <textarea value={jsonInput} onChange={handleJsonChange} placeholder='Enter JSON here' rows={5} />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <>
          <label>Select response fields:</label>
          <select multiple onChange={handleOptionChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest alphabet">Highest Alphabet</option>
          </select>
          <h2>Response:</h2>
          <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
