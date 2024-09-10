"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
export default function autoresult() {
  const [data, setData] = useState([]);
  const [columsArray, setColumsArray] = useState([]);
  const [values, setValues] = useState([]);
  const [type, setType] = useState(null);
  const handleChange = async (e) => {
    const file = e.target.files[0];
    setType(file.type);
    if (file.type === "text/csv") {
      Papa.parse(file, {
        download: true,
        header: true,
        skipEmptyLines: false,
        complete: (results) => {
          setData(results.data);
          setColumsArray(Object.keys(results.data[0]));
          setValues(results.data);
        },
      });
    } else if (file.type === "application/json") {
      let reader = new FileReader();
      reader.onload = function (e) {
        let parsedData = JSON.parse(e.target.result);
        setData(parsedData);
        setColumsArray(Object.keys(parsedData[0]));
        setValues(parsedData);
      };
      reader.readAsText(file);
    } else {
      //eslint-disable-next-line
      alert("Invalid file type. Please upload a CSV or JSON file.");
    }
  };
  useEffect(() => {}, [data, columsArray, values]);
  return (
    <div className="container">
      <div className="mx-auto">
        <div className="input-group mb-3 col-md-6">
          <input
            type="file"
            className="form-control"
            id="inputGroupFile02"
            accept=".csv,.json"
            onChange={handleChange}
          />
        </div>
        {data.length !== 0 && (
          <button
            className="btn btn-danger"
            onClick={() => {
              setData([]);
              setColumsArray([]);
              setValues([]);
              if (typeof window !== "undefined") {
                document.getElementById("inputGroupFile02").value = "";
              }
            }}
            type="button"
          >
            Reset
          </button>
        )}
        {data.length > 0 && (
          <table
            className="table table-bordered"
            style={{
              border: "1px solid",
              borderCollapse: "collapse",
              margin: 5,
            }}
          >
            <thead>
              <tr>
                <th>Sl</th>
                {columsArray.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {type == "application/json"
                ? values.map((row, index) => (
                    <tr key={JSON.stringify(row)}>
                      <td>{index + 1}</td>
                      {columsArray.map((col, i) => (
                        <td key={i}>{row[col]}</td>
                      ))}
                    </tr>
                  ))
                : values.slice(0, values.length - 1).map((row, index) => (
                    <tr key={JSON.stringify(row)}>
                      <td>{index + 1}</td>
                      {columsArray.map((col, i) => (
                        <td key={i}>{row[col]}</td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
