"use client";
import {
  BLOCK,
  MDM_COST,
  PP_STUDENTS,
  PRIMARY_STUDENTS,
  SCHOOL_TYPE,
  SCHOOLNAME,
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
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Store";
export default function MDMmonthlyReport() {
  const [monthlyData, setMonthlyData] = useState({
    id: "",
    month: "",
    year: "",
    financialYear: "",
    worrkingDays: "",
    ppTotal: "",
    pryTotal: "",
    totalCost: "",
    riceOB: "",
    riceCB: "",
    riceConsunption: "",
    riceGiven: "",
  });
  const {
    transactionState,
    setTransactionState,
    accountState,
    setAccountState,
    stateObject,
    setStateObject,
  } = useGlobalContext();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [allEnry, setAllEnry] = useState([]);
  const [showData, setShowData] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [thisTransaction, setThisTransaction] = useState({
    accountName: "",
    accountNumber: "",
    amount: "",
    purpose: "",
    type: "",
    date: "",
    id: "",
    openingBalance: "",
    closingBalance: "",
  });
  const [preViousMonthTransaction, setPreViousMonthTransaction] = useState({
    accountName: "",
    accountNumber: "",
    amount: "",
    purpose: "",
    type: "",
    date: "",
    id: "",
    openingBalance: "",
    closingBalance: "",
  });
  const getMonthlyData = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "mothlyMDMData"))
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
  useEffect(() => {}, [thisTransaction]);
  useEffect(() => {
    getMonthlyData();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="container-fluid my-2">
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="noprint">
            <h4>Select Month</h4>
            {allEnry.map((entry, index) => (
              <button
                className={`btn btn-${btnArray[index].color} m-1`}
                key={index}
                onClick={() => {
                  setMonthlyData(entry);
                  setShowData(true);
                  const m = transactionState.filter(
                    (account) => account.id === entry.id
                  )[0];
                  setThisTransaction(m);
                  const thisMonthName = m?.id.split("-")[0];

                  const prevMonthName =
                    months[months.indexOf(thisMonthName) - 1];

                  const thisPrevMonthTransaction = transactionState.filter(
                    (account) => account.id === `${prevMonthName}-${entry.year}`
                  )[0];
                  setPreViousMonthTransaction(thisPrevMonthTransaction);
                }}
              >
                {entry.id}
              </button>
            ))}
          </div>
        </>
      )}
      {showData && (
        <div>
          <table
            style={{
              width: "100%",
              overflowX: "auto",
              marginBottom: "20px",
              border: "1px solid",
            }}
          >
            <tbody>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th colSpan={9}>Monthly Progress Report of Mid Day Meal</th>
              </tr>
              <tr>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Name of the Month:- {monthlyData.id}
                </th>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Financial Year:- {monthlyData.financialYear}
                </th>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Ward No.:- {WARD_NO}
                </th>
                <th colSpan={3} style={{ border: "1px solid" }}>
                  Municipality/ Corporation (HMC)
                </th>
              </tr>
              <tr>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Name of the School:-
                </th>
                <th colSpan={4} style={{ border: "1px solid" }}>
                  {SCHOOLNAME}
                </th>
                <th colSpan={3} style={{ border: "1px solid" }}>
                  {BLOCK}
                </th>
              </tr>
              <tr>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Basic Information of School:-
                </th>
                <th colSpan={4} style={{ border: "1px solid" }}>
                  {SCHOOL_TYPE}
                </th>
                <th colSpan={3} style={{ border: "1px solid" }}></th>
              </tr>
              <tr>
                <th
                  colSpan={3}
                  style={{
                    border: "1px solid",
                    textAlign: "left",
                    paddingLeft: 5,
                  }}
                >
                  <p>Total no. of the Students Bal Vatika:- {PP_STUDENTS}</p>
                  <p>Total no. of the Students Primary:- {PRIMARY_STUDENTS}</p>
                </th>
                <th colSpan={3} style={{ border: "1px solid" }}>
                  Total Mid Day meal Served:-{" "}
                  {monthlyData.ppTotal + monthlyData.pryTotal}
                </th>
                <th colSpan={3} style={{ border: "1px solid" }}>
                  No. of days Mid Day Meal Served:- {monthlyData.worrkingDays}
                </th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th
                  style={{ border: "1px solid", height: 10 }}
                  colSpan={9}
                ></th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }} colSpan={9}>
                  Utilization Certificate (COOKING COST)
                </th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Class
                </th>
                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Opening Balance
                </th>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Allotment of fund received
                </th>
                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Total allotment received (2+3(b))
                </th>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Expenditure
                </th>

                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Total Expenditure 5(b)
                </th>
                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Closing Balance (4-6)
                </th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>
                  Previous month allotment received
                </th>
                <th style={{ border: "1px solid" }}>
                  Current month allotment received
                </th>
                <th style={{ border: "1px solid" }}>Previous month</th>
                <th style={{ border: "1px solid" }}>Current month</th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>1</th>
                <th style={{ border: "1px solid" }}>2</th>
                <th style={{ border: "1px solid" }}>3(a)</th>
                <th style={{ border: "1px solid" }}>3(b)</th>
                <th style={{ border: "1px solid" }}>4</th>
                <th style={{ border: "1px solid" }}>5(a)</th>
                <th style={{ border: "1px solid" }}>5(b)</th>
                <th style={{ border: "1px solid" }}>6</th>
                <th style={{ border: "1px solid" }}>7</th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>Bal Vatika</th>
                <th style={{ border: "1px solid" }}>
                  {preViousMonthTransaction?.amount / MDM_COST / PP_STUDENTS}
                </th>
                <th style={{ border: "1px solid" }}>3(a)</th>
                <th style={{ border: "1px solid" }}>3(b)</th>
                <th style={{ border: "1px solid" }}>4</th>
                <th style={{ border: "1px solid" }}>5(a)</th>
                <th style={{ border: "1px solid" }}>5(b)</th>
                <th style={{ border: "1px solid" }}>6</th>
                <th style={{ border: "1px solid" }}>7</th>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
