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
  round2dec,
  sortMonthwise,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Store";
export default function MDMmonthlyReport() {
  const [thisMonthlyData, setThisMonthlyData] = useState({
    date: "",
    financialYear: "",
    id: "",
    month: "",
    monthlyPPCost: "",
    monthlyPRYCost: "",
    ppTotal: "",
    pryTotal: "",
    riceCB: "",
    riceConsunption: "",
    riceGiven: "",
    riceOB: "",
    totalCost: "",
    worrkingDays: "",
    year: "",
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
  const [prevMonthlyData, setPrevMonthData] = useState({
    date: "",
    financialYear: "",
    id: "",
    month: "",
    monthlyPPCost: "",
    monthlyPRYCost: "",
    ppTotal: "",
    pryTotal: "",
    riceCB: "",
    riceConsunption: "",
    riceGiven: "",
    riceOB: "",
    totalCost: "",
    worrkingDays: "",
    year: "",
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
    setLoader(false);
    setAllEnry(monthwiseSorted);
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
                  Name of the Month:- {thisMonthlyData.id}
                </th>
                <th colSpan={2} style={{ border: "1px solid" }}>
                  Financial Year:- {thisMonthlyData.financialYear}
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
                  {thisMonthlyData.ppTotal + thisMonthlyData.pryTotal}
                </th>
                <th colSpan={3} style={{ border: "1px solid" }}>
                  No. of days Mid Day Meal Served:-{" "}
                  {thisMonthlyData.worrkingDays}
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
                  {thisMonthFromTransaction.ppOB}
                </th>
                <th style={{ border: "1px solid" }}>{balRCPrevMonth}</th>
                <th style={{ border: "1px solid" }}>{balRCThisMonth}</th>
                <th style={{ border: "1px solid" }}>
                  {round2dec(thisMonthFromTransaction.ppOB + balRCThisMonth)}
                </th>
                <th style={{ border: "1px solid" }}>
                  {prevMonthlyData.monthlyPPCost}
                </th>
                <th style={{ border: "1px solid" }}>
                  {thisMonthlyData.monthlyPPCost}
                </th>
                <th style={{ border: "1px solid" }}>
                  {thisMonthlyData.monthlyPPCost}
                </th>
                <th style={{ border: "1px solid" }}>
                  {round2dec(
                    thisMonthFromTransaction.ppOB +
                      balRCThisMonth -
                      thisMonthlyData.monthlyPPCost
                  )}
                </th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>Primary</th>
                <th style={{ border: "1px solid" }}>
                  {thisMonthFromTransaction.pryOB}
                </th>
                <th style={{ border: "1px solid" }}>{pryRCPrevMonth}</th>
                <th style={{ border: "1px solid" }}>{pryRCThisMonth}</th>
                <th style={{ border: "1px solid" }}>
                  {round2dec(thisMonthFromTransaction.pryOB + pryRCThisMonth)}
                </th>
                <th style={{ border: "1px solid" }}>
                  {prevMonthlyData.monthlyPRYCost}
                </th>
                <th style={{ border: "1px solid" }}>
                  {thisMonthlyData.monthlyPRYCost}
                </th>
                <th style={{ border: "1px solid" }}>
                  {thisMonthlyData.monthlyPRYCost}
                </th>
                <th style={{ border: "1px solid" }}>
                  {round2dec(
                    thisMonthFromTransaction.pryOB +
                      pryRCThisMonth -
                      thisMonthlyData.monthlyPRYCost
                  )}
                </th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>Up-Primary</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
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
                  Utilization Certificate (FOOD GRAIN)
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
                  Allotment of Food grains received
                </th>
                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Total Food grains received (2+3(b))
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
                  Previous month Food grains received
                </th>
                <th style={{ border: "1px solid" }}>
                  Current month Food grains received
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
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>Primary</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
                <th style={{ border: "1px solid" }}>{}</th>
              </tr>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center"
              >
                <th style={{ border: "1px solid" }}>Up-Primary</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
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
                  Utilization Certificate (HONORARIUM TO COOK)
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
                  Allotment of Food grains received
                </th>
                <th rowSpan={2} style={{ border: "1px solid" }}>
                  Total Food grains received (2+3(b))
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
                  Previous month Food grains received
                </th>
                <th style={{ border: "1px solid" }}>
                  Current month Food grains received
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
                <th style={{ border: "1px solid" }}>
                  Bal Vatika & Primary & UpPrimary
                </th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
                <th style={{ border: "1px solid" }}>-</th>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
