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
  where,
  addDoc,
} from "firebase/firestore";
import { useGlobalContext } from "../../context/Store";
import Loader from "@/components/Loader";
import {
  btnArray,
  createDownloadLink,
  getCurrentDateInput,
  getSubmitDateInput,
  monthNamesWithIndex,
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";

export default function Transactions() {
  const {
    transactionState,
    setTransactionState,
    accountState,
    setAccountState,
    stateObject,
  } = useGlobalContext();
  const router = useRouter();
  const [date, setDate] = useState(todayInString());
  const [loader, setLoader] = useState(false);
  const [allTransactions, setAllTransactions] = useState([]);
  const [thisAccounTransactions, setThisAccounTransactions] = useState([]);
  const [showEntry, setShowEntry] = useState(false);
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("DEBIT");

  const getId = () => {
    const currentDate = new Date();
    const month = monthNamesWithIndex[currentDate.getMonth()].monthName;
    const year = currentDate.getFullYear();
    return `${month}-${year}`;
  };
  const id = getId();
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
    setThisAccounTransactions(
      data.filter(
        (account) => account.accountNumber === stateObject.accountNumber
      )
    );
    setLoader(false);
    setAllTransactions(data);
    setTransactionState(data);
  };

  const submitTransaction = async () => {
    if (amount && purpose && type) {
      setLoader(true);
      const transaction = {
        accountName: stateObject.accountName,
        accountNumber: stateObject.accountNumber,
        amount,
        purpose,
        type,
        date,
        id,
        openingBalance: stateObject.balance,
        closingBalance:
          type === "DEBIT"
            ? stateObject.balance - amount
            : stateObject.balance + amount,
      };
      await setDoc(doc(firestore, "transactions", id), transaction);
      const thisAccount = stateObject;
      thisAccount.balance = transaction.closingBalance;
      thisAccount.date = date;
      await updateDoc(doc(firestore, "accounts", stateObject.accountNumber), {
        balance: thisAccount.balance,
      });
      setAccountState({
        ...stateObject,
        ...thisAccount,
      });

      toast.success("Transaction added successfully");
      setShowEntry(false);
      setLoader(false);
      getTransactions();
    } else {
      toast.error("Please fill all the required fields");
      setLoader(false);
    }
  };

  useEffect(() => {
    if (transactionState.length === 0) {
      getTransactions();
    } else {
      setAllTransactions(transactionState);
      setThisAccounTransactions(
        transactionState.filter(
          (transaction) =>
            transaction.accountNumber === stateObject.accountNumber
        )
      );
    }
    console.log(getSubmitDateInput(date));
  }, []);
  useEffect(() => {}, [stateObject, allTransactions]);
  return (
    <div className="container">
      {loader ? (
        <Loader />
      ) : (
        <>
          <h3>Transactions</h3>
          <h3>Account Name: {stateObject.accountName}</h3>
          <div className="my-3">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setShowEntry(true)}
            >
              Add New Transaction
            </button>
          </div>
          <table
            style={{
              width: "100%",
              overflowX: "auto",
              marginBottom: "20px",
              border: "1px solid",
            }}
            className="text-white"
          >
            <thead>
              <tr
                style={{
                  border: "1px solid",
                }}
                className="text-center bg-primary"
              >
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center"
                >
                  Date
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center"
                >
                  Type
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center"
                >
                  Amount
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center"
                >
                  Opening Balance
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center"
                >
                  Closing Balance
                </th>
                <th
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {thisAccounTransactions.map((transaction, index) => (
                <tr
                  style={{
                    border: "1px solid",
                  }}
                  className={`text-center ${
                    transaction.type === "CREDIT" ? "bg-success" : "bg-danger"
                  }`}
                  key={transaction.id}
                >
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    {transaction.date}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    {transaction.type}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    {transaction.amount}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    {transaction.openingBalance}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    {transaction.closingBalance}
                  </td>
                  <td
                    style={{
                      border: "1px solid",
                    }}
                    className="text-center"
                  >
                    <button
                      type="button"
                      className={`btn btn-${btnArray[index].color} m-1`}
                      onClick={() => {}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showEntry && (
            <form action="">
              <h3>Add New Transaction</h3>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  defaultValue={getCurrentDateInput(date)}
                  onChange={(e) => setDate(getSubmitDateInput(e.target.value))}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Type
                </label>
                <select
                  className="form-select"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="CREDIT">CREDIT</option>
                  <option value="DEBIT">DEBIT</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Purpose
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Enter Purpose"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      const parsedAmount = parseFloat(e.target.value);

                      setAmount(parsedAmount);
                    } else {
                      setAmount("");
                    }
                  }}
                  placeholder="Enter amount"
                />
                <small
                  id="amountHelp"
                  className="form-text text-muted fs-6 my-2"
                >
                  Maximum amount allowed: {stateObject.balance}
                </small>
                <div className="my-2">
                  <button
                    type="button"
                    className="btn btn-primary m-2"
                    onClick={submitTransaction}
                    disabled={
                      stateObject.amount <= 0 ||
                      stateObject.amount > stateObject.balance
                    }
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={() => setShowEntry(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
