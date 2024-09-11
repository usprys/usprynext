"use client";
import { PP_STUDENTS, PRIMARY_STUDENTS, SCHOOLNAME } from "@/modules/constants";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { firestore } from "../../context/FirbaseContext";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
} from "firebase/firestore";

import Loader from "@/components/Loader";
import {
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
export default function MDMData() {
  const [date, setDate] = useState(todayInString());
  const [pp, setPp] = useState("");
  const [pry, setPry] = useState("");
  const [showEntry, setShowEntry] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [errPP, setErrPP] = useState("");
  const [errPry, setErrPry] = useState("");
  const [docId, setDocId] = useState(todayInString());
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [moreFilteredData, setMoreFilteredData] = useState([]);
  const [ppTotalMeal, setPpTotalMeal] = useState(0);
  const [pryTotalMeal, setPryTotalMeal] = useState(0);
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [monthText, setMonthText] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [joiningMonths, setJoiningMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);
  const submitData = async () => {
    if (validForm()) {
      setLoader(true);
      await setDoc(doc(firestore, "mdmData", date), {
        pp: parseInt(pp),
        pry: parseInt(pry),
        date: date,
        id: date,
      })
        .then(() => {
          toast.success("Data submitted successfully");
          setPp("");
          setPry("");
          setDate(todayInString());
          setShowEntry(false);
          setLoader(false);
        })
        .catch((e) => {
          toast.error("Failed to submit data. Please try again");
          console.error(e);
          setLoader(false);
        });
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const validForm = () => {
    let isValid = false;
    if (pp.length === 0) {
      setErrPP("PP Number is required");
    } else {
      setErrPP("");
    }
    if (pry.length === 0) {
      setErrPry("PRY Number is required");
    } else {
      setErrPry("");
    }
    if (errPP.length === 0 && errPry.length === 0) {
      isValid = true;
    }
    return isValid;
  };

  const searchTodaysData = async () => {
    setLoader(true);
    const ref = doc(firestore, "mdmData", docId);
    try {
      const snap = await getDoc(ref);
      const data = snap.data();
      setPp(data.pp);
      setPry(data.pry);
      setDate(getCurrentDateInput(data.date));
      setDocId(data.date);
      setLoader(false);
      setShowEntry(false);
      setShowUpdate(true);
      setShowMonthlyReport(false);
    } catch (error) {
      toast.error("Todays Enry Not Done Yet!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoader(false);
    }
  };
  const updateData = async () => {
    if (validForm()) {
      setLoader(true);
      try {
        const docRef = doc(firestore, "mdmData", date);
        await updateDoc(docRef, {
          pp: parseInt(pp),
          pry: parseInt(pry),
          date: date,
        })
          .then(() => {
            toast.success("Data updated successfully");
            setPp("");
            setPry("");
            setDate(todayInString());
            setDocId(todayInString());
            setShowEntry(false);
            setLoader(false);
          })
          .catch((e) => {
            console.log(e);
            setLoader(false);
            toast.error("Something went Wrong!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          });
      } catch (error) {
        console.log(error);
        setLoader(false);
        toast.error("Something went Wrong!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      toast.error("Please Fillup Required Details!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const getData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mdmData"))
    );
    const datas = querySnapshot.docs
      .map((doc) => ({
        // doc.data() is never undefined for query doc snapshots
        ...doc.data(),
        id: doc.id,
      }))
      .sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date))
      );
    calledData(datas);
  };

  const calledData = (array) => {
    let x = [];
    array.map((entry) => {
      const joiningYear = entry.date.split("-")[2];
      x.push(joiningYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setServiceArray(x);
    let ppTotal = 0;
    let pryTotal = 0;
    array.map((entry) => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);
    setLoader(false);
    setAllEnry(array);
    setFilteredData(array);
    setShowEntry(false);
    setShowUpdate(false);
    setShowMonthlyReport(true);
  };

  const handleChange = (e) => {
    if (e.target.value !== "") {
      if (typeof window !== undefined) {
        let monthSelect = document.getElementById("month-select");
        if (monthSelect) {
          monthSelect.value = "";
        }
      }
      setMonthText("");
      const selectedValue = e.target.value;
      let x = [];
      let y = [];
      allEnry.map((entry) => {
        const joiningYear = entry.date.split("-")[2];
        const joiningMonth = entry.date.split("-")[1];
        if (joiningYear === selectedValue) {
          x.push(entry);
        }
        if (joiningYear === selectedValue) {
          monthNamesWithIndex.map((month) => {
            if (joiningMonth === month.index) {
              y.push(month);
            }
          });
        }
      });
      setSelectedYear(selectedValue);
      setShowMonthSelection(true);
      setFilteredData(x);
      setMoreFilteredData(x);
      setJoiningMonths(uniqArray(y).sort((a, b) => a.rank - b.rank));
    } else {
      setFilteredData([]);
      setSelectedYear("");
    }
  };
  const handleMonthChange = (month) => {
    let x = [];
    allEnry.map((entry) => {
      const joiningYear = entry.date.split("-")[2];
      const joiningMonth = entry.date.split("-")[1];
      if (joiningYear === selectedYear && joiningMonth === month.index) {
        return x.push(entry);
      }
    });
    setFilteredData(x);
    let ppTotal = 0;
    let pryTotal = 0;
    x.map((entry) => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);
    setShowDataTable(true);
    setMonthText(month.monthName);
  };

  useEffect(() => {}, [
    allEnry,
    filteredData,
    pp,
    pry,
    date,
    ppTotalMeal,
    pryTotalMeal,
  ]);
  useEffect(() => {}, []);

  return (
    <div className="container">
      {loader && <Loader />}
      <h3>MDM DATA OF {SCHOOLNAME}</h3>

      <button
        type="button"
        className="btn btn-primary m-1"
        onClick={() => {
          setShowEntry(true);
          setShowUpdate(false);
          setShowMonthlyReport(false);
          setPp("");
          setPry("");
          setErrPP("");
          setErrPry("");
          setDate(todayInString());
          setShowDataTable(false);
          setShowMonthSelection(false);
        }}
      >
        Coverage Entry
      </button>
      <button
        type="button"
        className="btn btn-dark m-1"
        onClick={() => {
          searchTodaysData();
          setShowDataTable(false);
          setShowMonthSelection(false);
        }}
      >
        Coverage Update
      </button>
      <button
        type="button"
        className="btn btn-success m-1"
        onClick={() => {
          if (allEnry.length === 0) {
            getData();
          } else {
            calledData(allEnry);
          }
        }}
      >
        Monthly Report
      </button>
      {showEntry && (
        <form>
          <h4 className="my-3">Coverage Entry</h4>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              defaultValue={getCurrentDateInput(date)}
              onChange={(e) => setDate(getSubmitDateInput(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>PP</label>
            <input
              type="text"
              className="form-control"
              placeholder={`Max Limit: ${PP_STUDENTS}`}
              value={pp}
              onChange={(e) => {
                if (e.target.value > PP_STUDENTS) {
                  toast.error("PP Limit Exceeded!");
                  setPp(PP_STUDENTS);
                } else {
                  setPp(e.target.value);
                }
              }}
            />
            {errPP && <p className="text-danger">{errPP}</p>}
          </div>
          <div className="form-group">
            <label>Primary</label>
            <input
              type="text"
              className="form-control"
              placeholder={`Max Limit: ${PRIMARY_STUDENTS}`}
              value={pry}
              onChange={(e) => {
                if (e.target.value > PRIMARY_STUDENTS) {
                  toast.error("Primary Limit Exceeded!");
                  setPry(PRIMARY_STUDENTS);
                } else {
                  setPry(e.target.value);
                }
              }}
            />
            {errPry && <p className="text-danger">{errPry}</p>}
          </div>
          <div className="my-2">
            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={(e) => {
                setShowEntry(false);
                e.preventDefault();
                submitData();
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger m-1"
              onClick={() => setShowEntry(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {showUpdate && (
        <form>
          <h4 className="my-3">Coverage Update</h4>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              defaultValue={date}
              onChange={(e) => setDate(getSubmitDateInput(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>PP</label>
            <input
              type="text"
              className="form-control"
              placeholder={`Max Limit: ${PP_STUDENTS}`}
              value={pp}
              onChange={(e) => {
                if (e.target.value > PP_STUDENTS) {
                  toast.error("PP Limit Exceeded!");
                  setPp(PP_STUDENTS);
                } else {
                  setPp(e.target.value);
                }
              }}
            />
            {errPP && <p className="text-danger">{errPP}</p>}
          </div>
          <div className="form-group">
            <label>Primary</label>
            <input
              type="text"
              className="form-control"
              placeholder={`Max Limit: ${PRIMARY_STUDENTS}`}
              value={pry}
              onChange={(e) => {
                if (e.target.value > PRIMARY_STUDENTS) {
                  toast.error("Primary Limit Exceeded!");
                  setPry(PRIMARY_STUDENTS);
                } else {
                  setPry(e.target.value);
                }
              }}
            />
            {errPry && <p className="text-danger">{errPry}</p>}
          </div>
          <div className="my-2">
            <button
              type="submit"
              className="btn btn-primary m-1"
              onClick={(e) => {
                setShowEntry(false);
                e.preventDefault();
                updateData();
              }}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger m-1"
              onClick={() => {
                setShowUpdate(false);
                setDocId(todayInString());
                setPp("");
                setPry("");
                setDate(todayInString());
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {showMonthlyReport && (
        <div className="my-3">
          <h3>Monthly Report</h3>

          <div className="col-md-4 mx-auto mb-3 noprint">
            <select
              className="form-select"
              defaultValue={""}
              onChange={handleChange}
              aria-label="Default select example"
            >
              <option className="text-center text-primary" value="">
                Select Joining Year
              </option>
              {serviceArray.map((el) => (
                <option
                  className="text-center text-success text-wrap"
                  key={el.id}
                  value={el}
                >
                  {"Year - " + el}
                </option>
              ))}
            </select>
          </div>
          {selectedYear && showMonthSelection ? (
            <div className="noprint">
              {joiningMonths.length > 1 && (
                <h4 className="text-center text-primary">Filter By Month</h4>
              )}
            </div>
          ) : null}
          {showMonthSelection && (
            <div className="row d-flex justify-content-center noprint">
              {joiningMonths.length > 1 && (
                <div className="col-md-4 mx-auto mb-3 noprint">
                  <select
                    className="form-select"
                    id="month-select"
                    defaultValue={""}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleMonthChange(JSON.parse(e.target.value));
                      } else {
                        setMonthText("");
                        setFilteredData(moreFilteredData);

                        if (typeof window !== undefined) {
                          document.getElementById("month-select").value = "";
                        }
                      }
                    }}
                    aria-label="Default select example"
                  >
                    <option value="" className="text-center text-primary">
                      Select Month
                    </option>
                    {joiningMonths.map((month, index) => (
                      <option
                        className="text-center text-success"
                        key={index}
                        value={JSON.stringify(month)}
                      >
                        {month.monthName +
                          " - " +
                          moreFilteredData.filter(
                            (m) => m.date.split("-")[1] === month.index
                          ).length +
                          ` ${
                            moreFilteredData.filter(
                              (m) => m.date.split("-")[1] === month.index
                            ).length > 1
                              ? " Entries"
                              : " Entry"
                          }`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {showDataTable && (
            <>
              <h4>Mothly MDM Report of {monthText} Month</h4>
              <div>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-primary"
                  onClick={() => {
                    createDownloadLink(allEnry, "mdmData");
                  }}
                >
                  Download All MDM Data
                </button>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-warning"
                  onClick={() => {
                    createDownloadLink(filteredData, "mdmData");
                  }}
                >
                  Download {monthText} Month's MDM Data
                </button>
              </div>
              <table
                className="table table-responsive table-bordered table-striped"
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
              >
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>PP</th>
                    <th>Primary</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry) => {
                    return (
                      <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>{entry.pp}</td>
                        <td>{entry.pry}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary m-1"
                            onClick={() => {
                              setPp(entry.pp);
                              setPry(entry.pry);
                              setDate(getCurrentDateInput(entry.date));
                              setDocId(entry.date);
                              setLoader(false);
                              setShowEntry(false);
                              setShowUpdate(true);
                              setShowMonthlyReport(false);
                              setShowDataTable(false);
                              setShowMonthSelection(false);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th>Total</th>
                    <th>{ppTotalMeal}</th>
                    <th>{pryTotalMeal}</th>
                    <th>-</th>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
