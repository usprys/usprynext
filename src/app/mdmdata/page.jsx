"use client";
import {
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOLNAME,
} from "@/modules/constants";
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
  deleteDoc,
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
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../../context/Store";
export default function MDMData() {
  const { setStateObject, mealState, setMealState, riceState, setRiceState } =
    useGlobalContext();
  const router = useRouter();
  const [date, setDate] = useState(todayInString());
  const [pp, setPp] = useState("");
  const [pry, setPry] = useState("");
  const [showEntry, setShowEntry] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showRiceData, setShowRiceData] = useState(false);
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
  const [riceData, setRiceData] = useState([]);
  const [filteredRiceData, setFilteredRiceData] = useState([]);
  const [riceOB, setRiceOB] = useState(0);
  const [riceGiven, setRiceGiven] = useState(0);
  const [totalRiceGiven, setTotalRiceGiven] = useState(0);
  const [riceExpend, setRiceExpend] = useState("");
  const [errRice, setErrRice] = useState("");
  const [showRiceBalance, setShowRiceBalance] = useState(false);
  const [showSubmitMonthlyReport, setShowSubmitMonthlyReport] = useState(false);

  const [monthToSubmit, setMonthToSubmit] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [monthWorkingDays, setMonthWorkingDays] = useState(0);
  const [monthPPTotal, setMonthPPTotal] = useState(0);
  const [monthlyPPCost, setMonthlyPPCost] = useState("");
  const [monthPRYTotal, setMonthPRYTotal] = useState(0);
  const [monthlyPRYCost, setMonthlyPRYCost] = useState("");
  const [monthTotalCost, setMonthTotalCost] = useState(0);
  const [monthRiceOB, setMonthRiceOB] = useState(0);
  const [monthRiceGiven, setMonthRiceGiven] = useState(0);
  const [monthRiceConsunption, setMonthRiceConsunption] = useState(0);
  const [monthRiceCB, setMonthRiceCB] = useState(0);
  const [monthYearID, setMonthYearID] = useState("");
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
          getMainData();
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
    let isValid = true;
    if (pp.length === 0) {
      setErrPP("PP Number is required");
      isValid = false;
    } else {
      setErrPP("");
      isValid = true;
    }
    if (pry.length === 0) {
      setErrPry("PRY Number is required");
      isValid = false;
    } else {
      setErrPry("");
      isValid = true;
    }

    return isValid;
  };

  const searchTodaysData = async () => {
    const todaysData = allEnry.filter(
      (entry) => entry.date === todayInString()
    );
    if (todaysData.length > 0) {
      const data = todaysData[0];
      setPp(data.pp);
      setPry(data.pry);
      setDate(getCurrentDateInput(data.date));
      setDocId(data.date);
      setShowUpdate(true);
    } else {
      toast.error("Todays Enry Not Done Yet!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setShowDataTable(false);
    setShowMonthSelection(false);
    setShowEntry(false);
    setShowMonthlyReport(false);
    setShowRiceData(false);
  };
  const updateData = async () => {
    if (validForm()) {
      setLoader(true);
      try {
        const docRef = doc(firestore, "mdmData", docId);
        await updateDoc(docRef, {
          pp: parseInt(pp),
          pry: parseInt(pry),
          date: docId,
        })
          .then(() => {
            toast.success("Data updated successfully");
            getMainData();
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

  const getMainData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mdmData"))
    );
    const data = querySnapshot.docs
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
    setLoader(false);
    setAllEnry(data);
    setMealState(data);
  };
  const getRiceData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(query(collection(firestore, "rice")));
    const data = querySnapshot.docs
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
    setLoader(false);
    setRiceData(data);
    setRiceState(data);
    setRiceOB(data[data.length - 1].riceCB);
  };
  const getData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mdmData"))
    );
    const data = querySnapshot.docs
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
    calledData(data);
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
    setShowRiceData(false);
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
      setJoiningMonths(uniqArray(y));
    } else {
      setFilteredData([]);
      setSelectedYear("");
    }
  };
  const handleMonthChange = (month) => {
    let x = [];
    let y = [];
    allEnry.map((entry) => {
      const joiningYear = entry.date.split("-")[2];
      const joiningMonth = entry.date.split("-")[1];
      if (joiningYear === selectedYear && joiningMonth === month.index) {
        return x.push(entry);
      }
    });
    riceData.map((entry) => {
      const joiningYear = entry.date.split("-")[2];
      const joiningMonth = entry.date.split("-")[1];
      if (joiningYear === selectedYear && joiningMonth === month.index) {
        return y.push(entry);
      }
    });

    if (month.rank < 4) {
      setFinancialYear(`${parseInt(selectedYear) - 1}-${selectedYear}`);
    } else {
      setFinancialYear(`${selectedYear}-${parseInt(selectedYear) + 1}`);
    }

    setFilteredData(x);
    setFilteredRiceData(
      y.sort(
        (a, b) =>
          Date.parse(getCurrentDateInput(a.date)) -
          Date.parse(getCurrentDateInput(b.date))
      )
    );
    let riceGiven = 0;
    let thisMonthRiceData = y.sort(
      (a, b) =>
        Date.parse(getCurrentDateInput(a.date)) -
        Date.parse(getCurrentDateInput(b.date))
    );
    y.map((entry) => {
      riceGiven += entry.riceGiven;
    });
    setTotalRiceGiven(riceGiven);
    let ppTotal = 0;
    let pryTotal = 0;
    x.map((entry) => {
      ppTotal += entry.pp;
      pryTotal += entry.pry;
    });
    setPpTotalMeal(ppTotal);
    setPryTotalMeal(pryTotal);
    setMonthYearID(`${month.monthName}-${selectedYear}`);
    setMonthToSubmit(month.monthName);
    setMonthWorkingDays(x.length);
    setMonthPPTotal(ppTotal);
    setMonthlyPPCost(Math.round(ppTotal * MDM_COST));
    setMonthPRYTotal(pryTotal);
    setMonthTotalCost(Math.round((ppTotal + pryTotal) * MDM_COST));
    setMonthlyPRYCost(
      Math.round((ppTotal + pryTotal) * MDM_COST) -
        Math.round(ppTotal * MDM_COST)
    );
    setMonthRiceOB(thisMonthRiceData[0]?.riceOB);
    setMonthRiceCB(thisMonthRiceData[0]?.riceCB);
    setMonthRiceGiven(riceGiven);
    setMonthRiceCB(thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB);
    setMonthRiceConsunption(
      thisMonthRiceData[0]?.riceOB +
        riceGiven -
        thisMonthRiceData[thisMonthRiceData.length - 1]?.riceCB
    );
    setShowDataTable(true);
    setMonthText(month.monthName);
  };

  const submitRice = async () => {
    setLoader(true);
    try {
      await setDoc(doc(firestore, "rice", date), {
        id: date,
        date: date,
        riceOB: riceOB,
        riceGiven: riceGiven,
        riceExpend: riceExpend,
        riceCB: riceOB - riceExpend,
      })
        .then(() => {
          toast.success("Rice Data added successfully");
          setRiceGiven(0);
          setRiceOB(riceOB - riceExpend);
          getRiceData();
          setDocId(todayInString());
          setDate(todayInString());
          setRiceExpend("");
          setShowRiceData(false);
          setShowEntry(false);
          setShowDataTable(false);
          setShowMonthlyReport(false);
          setShowMonthSelection(false);
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
    } catch (e) {
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
    }
  };

  const submitMonthlyData = async () => {
    setLoader(true);
    try {
      await setDoc(doc(firestore, "mothlyMDMData", monthYearID), {
        id: monthYearID,
        month: monthToSubmit,
        year: parseInt(selectedYear),
        financialYear: financialYear,
        worrkingDays: monthWorkingDays,
        ppTotal: monthPPTotal,
        pryTotal: monthPRYTotal,
        monthlyPPCost: monthlyPPCost,
        monthlyPRYCost: monthlyPRYCost,
        totalCost: monthTotalCost,
        riceOB: monthRiceOB,
        riceCB: monthRiceCB,
        riceConsunption: monthRiceConsunption,
        riceGiven: monthRiceGiven,
        date: todayInString(),
      })
        .then(() => {
          toast.success("Monthly MDM Data Submitted successfully");
          setLoader(false);
          setShowSubmitMonthlyReport(false);
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
    } catch (e) {
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
    }
  };
  const delEntry = async (entry) => {
    setLoader(true);
    try {
      await deleteDoc(doc(firestore, "mdmData", entry.id))
        .then(() => {
          setLoader(false);
          toast.success("MDM Data Deleted successfully");
          let filteredEntry = mealState.filter((el) => el.id !== entry.id);
          setMealState(filteredEntry);
        })
        .catch((err) => {
          console.log(err);
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
    } catch (e) {
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
    }
  };

  useEffect(() => {}, [
    allEnry,
    filteredData,
    pp,
    pry,
    date,
    ppTotalMeal,
    pryTotalMeal,
    docId,
    riceOB,
    monthYearID,
    financialYear,
    monthlyPPCost,
    monthlyPRYCost,
  ]);
  useEffect(() => {
    if (riceState.length === 0) {
      getRiceData();
    } else {
      setRiceData(riceState);
      setRiceOB(riceState[riceState.length - 1].riceCB);
    }
    if (mealState.length === 0) {
      getMainData();
    } else {
      setAllEnry(mealState);
    }
  }, []);

  return (
    <div className="container">
      {loader && <Loader />}
      <h3>MDM DATA OF {SCHOOLNAME}</h3>

      <button
        type="button"
        className="btn btn-primary m-1"
        onClick={() => {
          allEnry.map((entry) => {
            if (entry.date === todayInString()) {
              toast.error("Todays Entry Already Done!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
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
              setShowRiceData(false);
            } else {
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
              setShowRiceData(false);
            }
          });
        }}
      >
        Coverage Entry
      </button>
      <button
        type="button"
        className="btn btn-dark m-1"
        onClick={() => {
          searchTodaysData();
        }}
      >
        Coverage Update
      </button>
      <button
        type="button"
        className="btn btn-success m-1"
        onClick={() => calledData(allEnry)}
      >
        Monthly Report
      </button>
      <button
        type="button"
        className="btn btn-info m-1"
        onClick={() => {
          setShowRiceData(true);
          setShowMonthlyReport(false);
          setShowDataTable(false);
          setShowMonthSelection(false);
          setShowEntry(false);
          setShowUpdate(false);
          setDate(todayInString());
          setDocId(todayInString());
        }}
      >
        Rice Data
      </button>
      {showEntry && (
        <form>
          <h4 className="my-3">Coverage Entry</h4>
          <div className="form-group m-2">
            <label className="m-2">Date</label>
            <input
              type="date"
              className="form-control"
              defaultValue={getCurrentDateInput(date)}
              onChange={(e) => setDate(getSubmitDateInput(e.target.value))}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-2">PP</label>
            <input
              type="number"
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
          <div className="form-group m-2">
            <label className="m-2">Primary</label>
            <input
              type="number"
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
          <div className="form-group m-2">
            <label className="m-2">Date</label>
            <input
              type="date"
              className="form-control"
              defaultValue={date}
              onChange={(e) => {
                setDate(getSubmitDateInput(e.target.value));
                setDocId(getSubmitDateInput(e.target.value));
                const filteredData = allEnry.filter(
                  (entry) => entry.date === getSubmitDateInput(e.target.value)
                );
                if (filteredData.length > 0) {
                  const selectedDateData = filteredData[0];
                  setPp(selectedDateData.pp);
                  setPry(selectedDateData.pry);
                } else {
                  setPp("");
                  setPry("");
                  toast.error("No Data Found on selected Date!", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                }
              }}
            />
          </div>
          <div className="form-group m-2">
            <label className="m-2">PP</label>
            <input
              type="number"
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
          <div className="form-group m-2">
            <label className="m-2">Primary</label>
            <input
              type="number"
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
          <button
            type="button"
            className="btn btn-sm m-3 btn-success"
            onClick={() => {
              router.push("/MDMmonthlyReport");
            }}
          >
            Generate Monthly Report
          </button>
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
              {serviceArray.map((el, i) => (
                <option
                  className="text-center text-success text-wrap"
                  key={i}
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
                  className="btn btn-sm m-3 btn-dark"
                  onClick={() => {
                    createDownloadLink(riceData, "rice");
                  }}
                >
                  Download All Rice Data
                </button>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-info"
                  onClick={() => {
                    createDownloadLink(filteredData, `${monthText}-mdmData`);
                  }}
                >
                  Download {monthText} Month's MDM Data
                </button>
                <button
                  type="button"
                  className="btn btn-sm m-3 btn-dark"
                  onClick={() => {
                    createDownloadLink(filteredRiceData, `${monthText}-rice`);
                  }}
                >
                  Download {monthText} Month's Rice Data
                </button>
                {/* <button
                  type="button"
                  className="btn btn-sm m-3 btn-success"
                  onClick={() => {
                    router.push("/MDMmonthlyReport");
                    setStateObject({
                      month: monthText,
                      year: selectedYear,
                      ppTotalMeal: ppTotalMeal,
                      pryTotalMeal: pryTotalMeal,
                      totalMeal: ppTotalMeal + pryTotalMeal,
                      totalDays: filteredData.length,
                      riceOB: filteredRiceData[0].riceOB,
                      riceCB:
                        filteredRiceData[filteredRiceData.length - 1].riceCB,
                      riceGiven: totalRiceGiven,
                    });
                  }}
                >
                  Generate Monthly Report
                </button> */}
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
                    <th>Day</th>
                    <th>Date</th>
                    <th>PP</th>
                    <th>Primary</th>
                    <th>Rice</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((entry, i) => {
                    return (
                      <tr key={i}>
                        <td>Day-{i + 1}</td>
                        <td>{entry.date}</td>
                        <td>{entry.pp}</td>
                        <td>{entry.pry}</td>
                        <td>{filteredRiceData[i]?.riceExpend} Kg.</td>
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
                          <button
                            type="button"
                            className="btn btn-sm btn-danger m-1"
                            onClick={() => {
                              // eslint-disable-next-line no-alert
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this entry?"
                                )
                              ) {
                                delEntry(entry);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <th>Total</th>
                    <th>
                      {filteredData.length > 1
                        ? `${filteredData.length} Days`
                        : `${filteredData.length} Day`}
                    </th>
                    <th>{ppTotalMeal}</th>
                    <th>{pryTotalMeal}</th>
                    <th colSpan={2} style={{ verticalAlign: "center" }}>
                      <p style={{ margin: 0, padding: 0 }}>
                        Total Meal- {ppTotalMeal + pryTotalMeal}
                      </p>
                      <p style={{ margin: 0, padding: 0 }}>
                        MDM Cost ={" "}
                        {`${ppTotalMeal} X ₹${MDM_COST} + ${pryTotalMeal} X ₹${MDM_COST} = `}
                        ₹{monthTotalCost}
                      </p>
                      <p style={{ margin: 0, padding: 0 }}>
                        Rice Consumption: {monthRiceConsunption}Kg.
                      </p>
                    </th>
                  </tr>
                </tbody>
              </table>
              {!showSubmitMonthlyReport && (
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => setShowSubmitMonthlyReport(true)}
                >
                  Submit Monthly Report
                </button>
              )}
              {showSubmitMonthlyReport && (
                <div className="my-2">
                  <h4 className="text-primary">Submit Monthly Report</h4>
                  <div className="col-md-6 mx-auto my-2">
                    <form action="">
                      <div className="form-group m-2">
                        <label className="m-2">Month Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Enter Month Name`}
                          value={monthToSubmit}
                          onChange={(e) => {
                            setMonthToSubmit(e.target.value);
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total Working Days</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total Working Days`}
                          value={monthWorkingDays}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthWorkingDays(parseInt(e.target.value));
                            } else {
                              setMonthWorkingDays("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total PP Meals</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total Working Days`}
                          value={monthPPTotal}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthPPTotal(parseInt(e.target.value));
                            } else {
                              setMonthPPTotal("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total Primary Meals</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total Working Days`}
                          value={monthPRYTotal}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthPRYTotal(parseInt(e.target.value));
                            } else {
                              setMonthPRYTotal("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total PP MDM Cost</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total PP MDM Cost`}
                          value={monthlyPPCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthlyPPCost(parseInt(e.target.value));
                            } else {
                              setMonthlyPPCost("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total PRIMARY MDM Cost</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total PRIMARY MDM Cost`}
                          value={monthlyPRYCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthlyPRYCost(parseInt(e.target.value));
                            } else {
                              setMonthlyPRYCost("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Total MDM Cost</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Total Working Days`}
                          value={monthTotalCost}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthTotalCost(parseInt(e.target.value));
                            } else {
                              setMonthTotalCost("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Rice Opening Balance</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Opening Balance`}
                          value={monthRiceOB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceOB(parseInt(e.target.value));
                            } else {
                              setMonthRiceOB("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Rice Received</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Received`}
                          value={monthRiceGiven}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceGiven(parseInt(e.target.value));
                            } else {
                              setMonthRiceGiven("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Rice Consumption</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Consumption`}
                          value={monthRiceConsunption}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceConsunption(parseInt(e.target.value));
                            } else {
                              setMonthRiceConsunption("");
                            }
                          }}
                        />
                      </div>
                      <div className="form-group m-2">
                        <label className="m-2">Rice Closing Balance</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={`Enter Rice Closing Balance`}
                          value={monthRiceCB}
                          onChange={(e) => {
                            if (e.target.value !== "") {
                              setMonthRiceCB(parseInt(e.target.value));
                            } else {
                              setMonthRiceCB("");
                            }
                          }}
                        />
                      </div>
                      <button
                        className="btn btn-success"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          submitMonthlyData();
                        }}
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => setShowSubmitMonthlyReport(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {showRiceData && (
        <div className="my-3">
          <h4 className="my-3">Rice Data</h4>
          <form>
            <div className="form-group m-2">
              <label className="m-2">Date</label>
              <input
                type="date"
                className="form-control"
                defaultValue={getCurrentDateInput(date)}
                onChange={(e) => setDate(getSubmitDateInput(e.target.value))}
              />
            </div>

            <h4 className="m-2 text-success">Rice Balance {riceOB} Kg.</h4>

            <div className="form-group m-2">
              <label className="m-2">Rice Expenditure (in Kg.)</label>
              <input
                type="number"
                className="form-control"
                placeholder={`Enter Rice Expenditure`}
                value={riceExpend}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setRiceExpend(parseInt(e.target.value));
                    setShowRiceBalance(true);
                  } else {
                    setRiceExpend("");
                    setShowRiceBalance(false);
                  }
                }}
              />
              {errRice && (
                <p className="text-danger m-2">Please Enter Rice Expenditure</p>
              )}
              {showRiceBalance && (
                <h4 className="text-info m-2">
                  Closing Balance {riceOB - riceExpend} Kg.
                </h4>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success"
              onClick={(e) => {
                e.preventDefault();
                if (riceExpend === 0 || riceExpend === "") {
                  setErrRice("Please Enter Rice Expenditure");
                  return;
                }
                setErrRice("");
                submitRice();
              }}
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
