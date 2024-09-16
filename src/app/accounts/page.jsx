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
  todayInString,
  uniqArray,
} from "@/modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/Store";
export default function Accounts() {
  const { setStateObject, accountState, setAccountState, setStateArray } =
    useGlobalContext();
  const router = useRouter();
  const [date, setDate] = useState(todayInString());
  const [loader, setLoader] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const getAccounts = async () => {
    setLoader(true);
    const querySnapshot = await getDocs(
      query(collection(firestore, "accounts"))
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
    setAllAccounts(data);
    setAccountState(data);
  };
  useEffect(() => {
    if (accountState.length === 0) {
      getAccounts();
    } else {
      setAllAccounts(accountState);
    }
    //eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      {loader && <Loader />}
      <div>
        <h3>Accounts</h3>

        <table
          style={{
            width: "100%",
            overflowX: "auto",
            marginBottom: "20px",
            border: "1px solid",
          }}
        >
          <thead>
            <tr
              style={{
                border: "1px solid",
              }}
              className="text-center p-1"
            >
              <th
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                SL
              </th>
              <th
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                ACCOUNT NAME
              </th>
              <th
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                ACCOUNT NUMBER
              </th>
              <th
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                BALANCE
              </th>
              <th
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                UPDATED AT
              </th>
              <th
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                TRANSACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {allAccounts.map((account, index) => (
              <tr
                key={account.id}
                style={{
                  border: "1px solid",
                }}
                className="text-center p-1"
              >
                <td
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  {account.accountName}
                </td>
                <td
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  {account.accountNumber}
                </td>
                <td
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  {account.balance}
                </td>
                <td
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  {account.date}
                </td>
                <td
                  style={{
                    border: "1px solid",
                  }}
                  className="text-center p-1"
                >
                  <button
                    type="button"
                    className={`btn btn-${btnArray[index].color} m-1`}
                    onClick={() => {
                      setStateObject(account);
                      router.push("/transactions");
                    }}
                  >
                    Transactions
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
