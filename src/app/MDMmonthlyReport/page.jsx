"use client";
import {
  BLOCK,
  CCH_NAME,
  MDM_COST,
  NGO_SHG,
  PP_STUDENTS,
  PRIMARY_BOYS,
  PRIMARY_GIRLS,
  PRIMARY_STUDENTS,
  SCHOOL_TYPE,
  SCHOOLNAME,
  TOTAL_STUDENTS,
  UDISE_CODE,
  WARD_NO,
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
} from "firebase/firestore";

import Loader from "@/components/Loader";
import {
  btnArray,
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  months,
  round2dec,
  sortMonthwise,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Store";

export default function MDMmonthlyReport() {
  const [thisMonthlyData, setThisMonthlyData] = useState({
    id: "",
    month: "",
    year: "",
    financialYear: "",
    worrkingDays: "",
    ppTotal: "",
    pryTotal: "",
    monthlyPPCost: "",
    monthlyPRYCost: "",
    totalCost: "",
    ricePPOB: "",
    ricePryOB: "",
    riceOB: "",
    ricePPRC: "",
    ricePryRC: "",
    ricePPEX: "",
    ricePryEX: "",
    ricePPCB: "",
    ricePryCB: "",
    riceCB: "",
    riceConsunption: "",
    riceGiven: "",
    date: "",
  });
  const {
    transactionState,
    setTransactionState,
    accountState,
    setAccountState,
    stateObject,
    setStateObject,
    monthlyReportState,
    setMonthlyReportState,
  } = useGlobalContext();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [showData, setShowData] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [prevMonthlyData, setPrevMonthData] = useState({
    id: "",
    month: "",
    year: "",
    financialYear: "",
    worrkingDays: "",
    ppTotal: "",
    pryTotal: "",
    monthlyPPCost: "",
    monthlyPRYCost: "",
    totalCost: "",
    ricePPOB: "",
    ricePryOB: "",
    riceOB: "",
    ricePPRC: "",
    ricePryRC: "",
    ricePPEX: "",
    ricePryEX: "",
    ricePPCB: "",
    ricePryCB: "",
    riceCB: "",
    riceConsunption: "",
    riceGiven: "",
    date: "",
  });
  const [thisMonthFromTransaction, setThisMonthFromTransaction] = useState({
    accountName: "",
    accountNumber: "",
    amount: "",
    purpose: "",
    type: "",
    date: "",
    id: "",
    ppOB: "",
    ppRC: "",
    ppCB: "",
    pryOB: "",
    pryRC: "",
    pryCB: "",
    openingBalance: "",
    closingBalance: "",
  });
  const [previousMonthFromTransaction, setPreviousMonthFromTransaction] =
    useState({
      accountName: "",
      accountNumber: "",
      amount: "",
      purpose: "",
      type: "",
      date: "",
      id: "",
      ppOB: "",
      ppRC: "",
      ppCB: "",
      pryOB: "",
      pryRC: "",
      pryCB: "",
      openingBalance: "",
      closingBalance: "",
    });

  const [balRCPrevMonth, setBalRCPrevMonth] = useState(0);
  const [balRCThisMonth, setBalRCThisMonth] = useState(0);
  const [pryRCThisMonth, setPryRCThisMonth] = useState(0);
  const [pryRCPrevMonth, setPryRCPrevMonth] = useState(0);

  const [filteredData, setFilteredData] = useState([]);
  const [moreFilteredData, setMoreFilteredData] = useState([]);
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  const [monthText, setMonthText] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [joiningMonths, setJoiningMonths] = useState([]);
  const [serviceArray, setServiceArray] = useState([]);
  const [showDataTable, setShowDataTable] = useState(false);

  const calledData = (array) => {
    let x = [];
    array.map((entry) => {
      const joiningYear = entry.id.split("-")[1];
      x.push(joiningYear);
      x = uniqArray(x);
      x = x.sort((a, b) => a - b);
    });
    setServiceArray(x);

    setLoader(false);
    setAllEnry(array);
    setFilteredData(array);
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
        const joiningYear = entry.id.split("-")[1];
        const joiningMonth = entry.id.split("-")[0];

        if (joiningYear === selectedValue) {
          x.push(entry);
          y.push(joiningMonth);
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
      setShowMonthSelection(false);
      setShowDataTable(false);
      toast.error("Please select a year");
    }
  };
  const handleMonthChange = (month) => {
    let x = [];

    allEnry.map((entry, index) => {
      const joiningYear = entry.id.split("-")[1];
      const joiningMonth = entry.id.split("-")[0];
      if (joiningYear === selectedYear && joiningMonth === month) {
        x.push(entry);
        setThisMonthlyData(entry);
        setPrevMonthData(allEnry[index - 1]);
        setShowData(true);
        const thisMonthTransaction = transactionState.filter(
          (account) => account.id === entry.id
        )[0];
        const creditTrThisMonth = transactionState.filter(
          (tr) =>
            tr.purpose.split(`MDM Cost-`)[1] === entry.id ||
            tr.purpose.split(`Interest-`)[1] === entry.id
        );
        let cBalRCThisMonth = 0;
        let cPryRCThisMonth = 0;
        creditTrThisMonth.forEach((tr) => {
          cBalRCThisMonth += tr.ppRC;
          cPryRCThisMonth += tr.pryRC;
        });
        setBalRCThisMonth(cBalRCThisMonth);
        setPryRCThisMonth(cPryRCThisMonth);
        setThisMonthFromTransaction(thisMonthTransaction);
        const thisMonthName = entry.id.split("-")[0];
        const thisMonthYear = entry.id.split("-")[1];
        const prevMonthName = months[months.indexOf(thisMonthName) - 1];
        const creditTrPrevMonth = transactionState.filter(
          (tr) =>
            tr.purpose.split(`MDM Cost-`)[1] ===
              `${prevMonthName}-${thisMonthYear}` ||
            tr.purpose.split(`Interest-`)[1] ===
              `${prevMonthName}-${thisMonthYear}`
        );
        let cBalPrevMonth = 0;
        let cPryPrevMonth = 0;
        creditTrPrevMonth.forEach((tr) => {
          cBalPrevMonth += tr.ppRC;
          cPryPrevMonth += tr.pryRC;
        });
        setBalRCPrevMonth(cBalPrevMonth);
        setPryRCPrevMonth(cPryPrevMonth);

        const thisPrevMonthTransaction = transactionState.filter(
          (account) => account.id === `${prevMonthName}-${entry.year}`
        )[0];
        setPreviousMonthFromTransaction(thisPrevMonthTransaction);
      }
    });

    setFilteredData(x);

    setShowDataTable(true);
    setMonthText(month);
  };

  const getMonthlyData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mothlyMDMData"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    const monthwiseSorted = sortMonthwise(data);
    setMonthlyReportState(monthwiseSorted);
    setLoader(false);
    calledData(monthwiseSorted);
  };
  const getTransactions = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "transactions"))
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
    setAllTransactions(data);
    setTransactionState(data);
  };
  useEffect(() => {
    if (transactionState.length === 0) {
      getTransactions();
    } else {
      setAllTransactions(transactionState);
    }
  }, []);

  useEffect(() => {
    if (monthlyReportState.length === 0) {
      getMonthlyData();
    } else {
      calledData(monthlyReportState);
    }
    // eslint-disable-next-line
  }, []);
  useEffect(() => {}, [
    allEnry,
    allTransactions,
    thisMonthFromTransaction,
    thisMonthlyData,
  ]);

  return (
    <div className="container-fluid my-2">
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="noprint">
            <h4>Select Year</h4>
            <div className="col-md-4 mx-auto mb-3 noprint">
              <select
                className="form-select"
                defaultValue={""}
                onChange={handleChange}
                aria-label="Default select example"
              >
                <option className="text-center text-primary" value="">
                  Select Data Year
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
                  <h4 className="text-center text-primary">Select Month</h4>
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
                          handleMonthChange(e.target.value);
                        } else {
                          setMonthText("");
                          setFilteredData(moreFilteredData);
                          setShowData(false);
                          toast.error("Please select a Month");
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
                      {joiningMonths
                        .slice(1, joiningMonths.length)
                        .map((month, index) => (
                          <option
                            className="text-center text-success"
                            key={index}
                            value={month}
                          >
                            {month}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {/* {allEnry.map((entry, index) => (
              <button
                className={`btn btn-${btnArray[index].color} m-1`}
                key={index}
                onClick={() => {
                  setThisMonthlyData(entry);
                  setPrevMonthData(allEnry[index - 1]);
                  setShowData(true);
                  const thisMonthTransaction = transactionState.filter(
                    (account) => account.id === entry.id
                  )[0];
                  const creditTrThisMonth = transactionState.filter(
                    (tr) =>
                      tr.purpose.split(`MDM Cost-`)[1] === entry.id ||
                      tr.purpose.split(`Interest-`)[1] === entry.id
                  );
                  let cBalRCThisMonth = 0;
                  let cPryRCThisMonth = 0;
                  creditTrThisMonth.forEach((tr) => {
                    cBalRCThisMonth += tr.ppRC;
                    cPryRCThisMonth += tr.pryRC;
                  });
                  setBalRCThisMonth(cBalRCThisMonth);
                  setPryRCThisMonth(cPryRCThisMonth);
                  setThisMonthFromTransaction(thisMonthTransaction);
                  const thisMonthName = entry.id.split("-")[0];
                  const thisMonthYear = entry.id.split("-")[1];
                  const prevMonthName =
                    months[months.indexOf(thisMonthName) - 1];
                  const creditTrPrevMonth = transactionState.filter(
                    (tr) =>
                      tr.purpose.split(`MDM Cost-`)[1] ===
                        `${prevMonthName}-${thisMonthYear}` ||
                      tr.purpose.split(`Interest-`)[1] ===
                        `${prevMonthName}-${thisMonthYear}`
                  );
                  let cBalPrevMonth = 0;
                  let cPryPrevMonth = 0;
                  creditTrPrevMonth.forEach((tr) => {
                    cBalPrevMonth += tr.ppRC;
                    cPryPrevMonth += tr.pryRC;
                  });
                  setBalRCPrevMonth(cBalPrevMonth);
                  setPryRCPrevMonth(cPryPrevMonth);

                  const thisPrevMonthTransaction = transactionState.filter(
                    (account) =>
                      account.id === `${prevMonthName}-${entry.year.toString()}`
                  )[0];
                  setPreviousMonthFromTransaction(thisPrevMonthTransaction);
                  // console.log("This Month Data", thisMonthlyData);
                  // console.log("Previous Month Data", allEnry[index - 1]);
                  // console.log(
                  //   "This Month From Transaction",
                  //   thisMonthTransaction
                  // );
                  // console.log(
                  //   "Previous Month From Transaction",
                  //   thisPrevMonthTransaction
                  // );
                }}
              >
                {entry.id}
              </button>
            ))} */}
          </div>
        </>
      )}
      {showData && (
        <div>
          <div className="noprint">
            <button
              className={`btn btn-info m-2`}
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.print();
                }
              }}
            >
              Print
            </button>
          </div>

          <div>
            <div className="nobreak">
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td colSpan={9}>Monthly Progress Report of Mid Day Meal</td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Name of the Month:- {thisMonthlyData?.id}
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Financial Year:- {thisMonthlyData?.financialYear}
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Ward No.:- {WARD_NO}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Municipality/ Corporation (HMC)
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Name of the School:-
                    </td>
                    <td colSpan={4} style={{ border: "1px solid" }}>
                      {SCHOOLNAME}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      {BLOCK}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Basic Information of School:-
                    </td>
                    <td colSpan={4} style={{ border: "1px solid" }}>
                      {SCHOOL_TYPE}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}></td>
                  </tr>
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid",
                        textAlign: "left",
                        paddingLeft: 5,
                      }}
                    >
                      <p>
                        Total no. of the Students Bal Vatika:- {PP_STUDENTS}
                      </p>
                      <p>
                        Total no. of the Students Primary:- {PRIMARY_STUDENTS}
                      </p>
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Total Mid Day meal Served:-{" "}
                      {thisMonthlyData?.ppTotal + thisMonthlyData?.pryTotal}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      No. of days Mid Day Meal Served:-{" "}
                      {thisMonthlyData?.worrkingDays}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td
                      style={{ border: "1px solid", height: 10 }}
                      colSpan={9}
                    ></td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }} colSpan={9}>
                      Utilization Certificate (COOKING COST)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total allotment received (2+3(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 5(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance (4-6)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3(a)</td>
                    <td style={{ border: "1px solid" }}>3(b)</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5(a)</td>
                    <td style={{ border: "1px solid" }}>5(b)</td>
                    <td style={{ border: "1px solid" }}>6</td>
                    <td style={{ border: "1px solid" }}>7</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthFromTransaction?.ppOB}
                    </td>
                    <td style={{ border: "1px solid" }}>{balRCPrevMonth}</td>
                    <td style={{ border: "1px solid" }}>{balRCThisMonth}</td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.ppOB + balRCThisMonth
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData?.monthlyPPCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPPCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPPCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.ppOB +
                          balRCThisMonth -
                          thisMonthlyData?.monthlyPPCost
                      )}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthFromTransaction?.pryOB}
                    </td>
                    <td style={{ border: "1px solid" }}>{pryRCPrevMonth}</td>
                    <td style={{ border: "1px solid" }}>{pryRCThisMonth}</td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.pryOB + pryRCThisMonth
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData?.monthlyPRYCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPRYCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPRYCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.pryOB +
                          pryRCThisMonth -
                          thisMonthlyData?.monthlyPRYCost
                      )}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td
                      style={{ border: "1px solid", height: 10 }}
                      colSpan={9}
                    ></td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }} colSpan={9}>
                      Utilization Certificate (FOOD GRAIN)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of Food grains received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Food grains received (2+3(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 5(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance (4-6)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3(a)</td>
                    <td style={{ border: "1px solid" }}>3(b)</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5(a)</td>
                    <td style={{ border: "1px solid" }}>5(b)</td>
                    <td style={{ border: "1px solid" }}>6</td>
                    <td style={{ border: "1px solid" }}>7</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPOB + thisMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryOB + thisMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>

                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td
                      style={{ border: "1px solid", height: 10 }}
                      colSpan={9}
                    ></td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }} colSpan={9}>
                      Utilization Certificate (HONORARIUM TO COOK)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of Food grains received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Food grains received (2+3(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 5(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance (4-6)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month Food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3(a)</td>
                    <td style={{ border: "1px solid" }}>3(b)</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5(a)</td>
                    <td style={{ border: "1px solid" }}>5(b)</td>
                    <td style={{ border: "1px solid" }}>6</td>
                    <td style={{ border: "1px solid" }}>7</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Bal Vatika & Primary & UpPrimary
                    </td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-end mr-4">
                <h6>
                  .............................................................................
                </h6>
                <h6>Signature of Head Teacher / TIC</h6>
              </div>
            </div>
            <div className="nobreak">
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td colSpan={12}>Utilization Certificate (COOKING COST)</td>
                  </tr>
                  <tr>
                    <td colSpan={4} style={{ border: "1px solid" }}>
                      Name of the Month:- {thisMonthlyData?.id}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Financial Year:- {thisMonthlyData?.financialYear}
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Ward No.:- {WARD_NO}
                    </td>
                    <td colSpan={3} style={{ border: "1px solid" }}>
                      Municipality/ Corporation (HMC)
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      Total no of Students
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      Total Meal Served during the month
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      No of Days Mid day meal Served
                    </td>
                    <td colSpan={5} style={{ border: "1px solid" }}>
                      School Name:- {SCHOOLNAME}
                    </td>

                    <td colSpan={3} style={{ border: "1px solid" }}>
                      {BLOCK}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total allotment received (5+6(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 8(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance (7-9)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5</td>
                    <td style={{ border: "1px solid" }}>6(a)</td>
                    <td style={{ border: "1px solid" }}>6(b)</td>
                    <td style={{ border: "1px solid" }}>7</td>
                    <td style={{ border: "1px solid" }}>8(a)</td>
                    <td style={{ border: "1px solid" }}>8(b)</td>
                    <td style={{ border: "1px solid" }}>9</td>
                    <td style={{ border: "1px solid" }}>10</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>{PP_STUDENTS}</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ppTotal}
                    </td>
                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      {thisMonthlyData.worrkingDays}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthFromTransaction?.ppOB}
                    </td>
                    <td style={{ border: "1px solid" }}>{balRCPrevMonth}</td>
                    <td style={{ border: "1px solid" }}>{balRCThisMonth}</td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.ppOB + balRCThisMonth
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData?.monthlyPPCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPPCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPPCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.ppOB +
                          balRCThisMonth -
                          thisMonthlyData?.monthlyPPCost
                      )}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>{PRIMARY_STUDENTS}</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.pryTotal}
                    </td>

                    <td style={{ border: "1px solid" }}>
                      {thisMonthFromTransaction?.pryOB}
                    </td>
                    <td style={{ border: "1px solid" }}>{pryRCPrevMonth}</td>
                    <td style={{ border: "1px solid" }}>{pryRCThisMonth}</td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.pryOB + pryRCThisMonth
                      )}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData?.monthlyPRYCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPRYCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData?.monthlyPRYCost}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {round2dec(
                        thisMonthFromTransaction?.pryOB +
                          pryRCThisMonth -
                          thisMonthlyData?.monthlyPRYCost
                      )}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td colSpan={12}>Utilization Certificate (FOOD GRAINS)</td>
                  </tr>

                  <tr>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total no of Students
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Meal Served during the month
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      No of Days Mid day meal Served
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Food grains received (5+6(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 8(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance (7-9)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month food grains received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5</td>
                    <td style={{ border: "1px solid" }}>6(a)</td>
                    <td style={{ border: "1px solid" }}>6(b)</td>
                    <td style={{ border: "1px solid" }}>7</td>
                    <td style={{ border: "1px solid" }}>8(a)</td>
                    <td style={{ border: "1px solid" }}>8(b)</td>
                    <td style={{ border: "1px solid" }}>9</td>
                    <td style={{ border: "1px solid" }}>10</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Bal Vatika</td>
                    <td style={{ border: "1px solid" }}>{PP_STUDENTS}</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ppTotal}
                    </td>

                    <td rowSpan={3} style={{ border: "1px solid" }}>
                      {thisMonthlyData.worrkingDays}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePPOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPOB + thisMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePPCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Primary</td>
                    <td style={{ border: "1px solid" }}>{PRIMARY_STUDENTS}</td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.pryTotal}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryOB}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryOB + thisMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {prevMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {thisMonthlyData.ricePryCB}
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>Up-Primary</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td colSpan={12}>
                      Utilization Certificate (HONORARIUM TO COOK)
                    </td>
                  </tr>

                  <tr>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Class
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total no of Students
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      No of Cook engaged
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      No of Days Mid day meal Served
                    </td>

                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Opening Balance
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Allotment of fund received
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total allotment received (5+6(b))
                    </td>
                    <td colSpan={2} style={{ border: "1px solid" }}>
                      Expenditure
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Total Expenditure 8(b)
                    </td>
                    <td rowSpan={2} style={{ border: "1px solid" }}>
                      Closing Balance (7-9)
                    </td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>
                      Previous allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>
                      Current month allotment received
                    </td>
                    <td style={{ border: "1px solid" }}>Previous month</td>
                    <td style={{ border: "1px solid" }}>Current month</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>1</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>3</td>
                    <td style={{ border: "1px solid" }}>4</td>
                    <td style={{ border: "1px solid" }}>5</td>
                    <td style={{ border: "1px solid" }}>6(a)</td>
                    <td style={{ border: "1px solid" }}>6(b)</td>
                    <td style={{ border: "1px solid" }}>7</td>
                    <td style={{ border: "1px solid" }}>8(a)</td>
                    <td style={{ border: "1px solid" }}>8(b)</td>
                    <td style={{ border: "1px solid" }}>9</td>
                    <td style={{ border: "1px solid" }}>10</td>
                  </tr>
                  <tr
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>46</td>
                    <td style={{ border: "1px solid" }}>2</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                    <td style={{ border: "1px solid" }}>-</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-end mr-4">
                <h6>
                  .............................................................................
                </h6>
                <h6>Signature of Head Teacher / TIC</h6>
              </div>
            </div>
          </div>

          <div className="mx-auto-text-center">
            <div className="nobreak">
              <h4>Pradhan Mantri Poshan Shakti Nirman (PM POSHAN)</h4>
              <h4>School Monthly Data Capture Format (MDCF)</h4>
              <p>
                Instructions: Keep following registers at the time of filling
                the form:-
              </p>
              <h6 className="text-start">
                1) Enrolment Register, 2) Account, 3) Bank Account Pass Book, 4)
                Cooking cost details etc.
              </h6>
              <h5 className="text-start" style={{ marginLeft: 30 }}>
                1. School Details
              </h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tr
                  style={{
                    border: "1px solid",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    Month-Year
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                    colSpan={2}
                  >
                    {thisMonthlyData?.id}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    UDISE Code
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {UDISE_CODE}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    School Name
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {SCHOOLNAME}
                  </td>
                </tr>
                <tr
                  style={{
                    border: "1px solid",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    Type
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                    colSpan={7}
                  >
                    <div
                      className="d-flex flex-row p-2 justify-content-center align-items-center"
                      style={{ height: 30 }}
                    >
                      <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                        <p className="m-0 p-0 mx-2">Government</p>
                        <input type="checkbox" checked />
                      </div>
                      <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                        <p className="m-0 p-0 mx-2">Local Body</p>
                        <input type="checkbox" />
                      </div>
                      <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                        <p className="m-0 p-0 mx-2">EGS/AIE Centres</p>
                        <input type="checkbox" />
                      </div>
                      <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                        <p className="m-0 p-0 mx-2">NCLP</p>
                        <input type="checkbox" />
                      </div>
                      <div className="d-flex flex-row p-2 justify-content-center align-items-center">
                        <p className="m-0 p-0 mx-2">Madrasa/Maqtab</p>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    State / UT-
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    WEST BENGAL
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    District:-
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    HOWRAH
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    Block/NP-{" "}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {BLOCK}{" "}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {" "}
                    Village/Ward:-{" "}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {WARD_NO}{" "}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    Kitchen Type-
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    PUCCA
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    NGO / SHG
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {NGO_SHG}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                    colSpan={3}
                  >
                    Enrolment-
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                      paddingInline: 2,
                    }}
                  >
                    {TOTAL_STUDENTS}
                  </td>
                </tr>
              </table>
              <h5 className="text-start" style={{ marginLeft: 30 }}>
                2. Meals Availed Status
              </h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    ></td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Bal Vatika
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Primary
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Upper Primary
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Number of School days during month
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData.worrkingDays}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData.worrkingDays}
                    </td>

                    <td
                      style={{
                        paddingInline: 2,

                        backgroundColor: "black",
                        color: "white",
                      }}
                      rowSpan={3}
                    >
                      N/A
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Actual Number of days Mid-Day Meal served
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData.worrkingDays}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData.worrkingDays}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Total Meals served during the month
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData.ppTotal}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      {thisMonthlyData.pryTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h5 className="text-start" style={{ marginLeft: 30 }}>
                3. Fund Details (In Rs.)
              </h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Component
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Opening Balance
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Received During the Month
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Expenditure During the Month
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Closing Balance
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Cooking Cost- Bal Vatika
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthFromTransaction?.ppOB}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthFromTransaction?.ppRC}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthlyData?.monthlyPPCost}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthFromTransaction?.ppCB}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Cooking Cost- Primary
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthFromTransaction?.pryOB}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthFromTransaction?.pryRC}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthlyData?.monthlyPRYCost}
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      ₹ {thisMonthFromTransaction?.pryCB}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Cooking Cost- Upper Primary
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Cook Cum Helper
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      School Expenses: MME Expenses
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      N/A
                    </td>
                  </tr>
                </tbody>
              </table>
              <h5 className="text-start" style={{ marginLeft: 30 }}>
                4. Cook Cum Helper Payment Detail
              </h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <thead>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      rowSpan={2}
                    >
                      Sl. No
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      rowSpan={2}
                    >
                      Opening Balance
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      rowSpan={2}
                    >
                      Cook Name
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Gender
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Category
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      Payment Mode
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                      rowSpan={2}
                    >
                      Amount Received During Month (In Rs.)
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      (M/F)
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      (SC/ST/OBC/GEN)
                    </td>
                    <td
                      style={{
                        border: "1px solid",
                        paddingInline: 2,
                      }}
                    >
                      (Cash/ Bank)
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {CCH_NAME.map((cch, index) => (
                    <tr>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {index + 1}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>

                      <td
                        style={{
                          border: "1px solid",
                          paddingInline: 2,
                          width: "30%",
                        }}
                      >
                        {cch.name}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {cch.gender}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {cch.cast}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        {cch.payment}
                      </td>
                      <td style={{ border: "1px solid", paddingInline: 2 }}>
                        -
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h5>MID DAY MEAL REPORT (UC)</h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <thead>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Category
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      TOTAL NO OF STUDENTS
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      TOTAL MEAL SERVED
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      MDM RATE
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      EXPENDITURE
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      BAL VATIKA
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.worrkingDays}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ppTotal}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      ₹ {MDM_COST}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      ₹ {thisMonthlyData.monthlyPPCost}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      PRIMARY
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.worrkingDays}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.pryTotal}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      ₹ {MDM_COST}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      ₹ {thisMonthlyData.monthlyPRYCost}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="nobreak">
              <h5 className="text-start">5. Food Grain Details (In KG.)</h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <thead>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Category
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Food Item
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Opening Balance
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Received During
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Consumption during the Month
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Closing Balance
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      rowSpan={2}
                      style={{ border: "1px solid", paddingInline: 2 }}
                    >
                      BAL VATIKA
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Wheat
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Rice
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePPOB}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePPRC}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePPEX}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePPCB}
                    </td>
                  </tr>
                  <tr>
                    <td
                      rowSpan={2}
                      style={{ border: "1px solid", paddingInline: 2 }}
                    >
                      PRIMARY
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Wheat
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Rice
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePryOB}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePryRC}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePryEX}
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {thisMonthlyData.ricePryCB}
                    </td>
                  </tr>
                  <tr>
                    <td
                      rowSpan={2}
                      style={{ border: "1px solid", paddingInline: 2 }}
                    >
                      UPPER PRIMARY
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Wheat
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Rice
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>-</td>
                  </tr>
                </tbody>
              </table>
              <h5 className="text-start">6. Children Health Status</h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                  border: "1px solid",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      No. of children from Class 1 to 8 who had received 4 IFA
                      tablets (Boys)-
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {PRIMARY_BOYS}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      No. of children from Class 1 to 8 who had received 4 IFA
                      tablets (Girls)-
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      {PRIMARY_GIRLS}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      No. of children screened by mobile health (RBSK) team
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      NIL
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      No. of children referred by mobile health (RBSK) team
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      NIL
                    </td>
                  </tr>
                </tbody>
              </table>
              <h5 className="text-start">7. School Inspection</h5>
              <table
                style={{
                  width: "100%",
                  overflowX: "auto",
                  marginBottom: "20px",
                }}
                className="nobreak my-4"
              >
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      School Inspection done during the month
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      <div className="">
                        Yes <input type="checkbox" /> No{" "}
                        <input type="checkbox" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      By Members of Task Force
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}></td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      By District Officials
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}></td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      By Block/Taluka Level Officials
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}></td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      By SMC Members
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}></td>
                  </tr>
                  <tr style={{ height: 20, border: 0 }}></tr>
                  <tr>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      Number of unwanted incidents occurred
                    </td>
                    <td style={{ border: "1px solid", paddingInline: 2 }}>
                      NIL
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                className="d-flex flex-row justify-content-between p-2"
                style={{ marginTop: 200 }}
              >
                <div>
                  <h6>
                    ..........................................................................................
                  </h6>
                  <h6>Signature of the SMC Chairperson/ Gram Pradhan</h6>
                </div>
                <div>
                  <h6>
                    .............................................................................
                  </h6>
                  <h6>Signature of Head Teacher / TIC</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
