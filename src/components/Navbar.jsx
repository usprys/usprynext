"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { decryptObjData, getCookie } from "../modules/encryption";
import { firestore } from "../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/Store";
import { Loader } from "rsuite";
import Image from "next/image";
import schoolLogo from "@/../public/assets/images/logoweb.png";
export default function Navbar() {
  const {
    state,
    setState,
    stateArray,
    setStateArray,
    stateObject,
    setStateObject,
    teachersState,
    setTeachersState,
    studentState,
    setStudentState,
    slideState,
    setSlideState,
    userState,
    setUserState,
    noticeState,
    setNoticeState,
    teacherUpdateTime,
    setTeacherUpdateTime,
    studentUpdateTime,
    setStudentUpdateTime,
    slideUpdateTime,
    setSlideUpdateTime,
    noticeUpdateTime,
    setNoticeUpdateTime,
    userUpdateTime,
    setUserUpdateTime,
  } = useGlobalContext();
  const router = useRouter();
  let userdetails, loggedAt;
  let details = getCookie("uid");
  if (details) {
    userdetails = decryptObjData("uid");
    loggedAt = getCookie("loggedAt");
  }
  const [showLoader, setShowLoader] = useState(false);
  const handleNavCollapse = () => {
    if (typeof window !== "undefined") {
      // browser code
      if (
        document
          .querySelector("#navbarSupportedContent")
          .classList.contains("show")
      ) {
        document
          .querySelector("#navbarSupportedContent")
          .classList.remove("show");
      }
    }
  };
  const storeTeachersData = async () => {
    setShowLoader(true);
    const q = query(collection(firestore, "teachers"));
    const querySnapshot = await getDocs(q);
    const datas = querySnapshot.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    let newDatas = datas.sort((a, b) => {
      // First, compare the "school" keys
      if (a.school < b.school) {
        return -1;
      }
      if (a.school > b.school) {
        return 1;
      }
      // If "school" keys are equal, compare the "rank" keys
      return a.rank - b.rank;
    });
    setShowLoader(false);
    setTeachersState(newDatas);
    setTeacherUpdateTime(Date.now());
  };
  const storeStudentData = async () => {
    setShowLoader(true);
    const q2 = query(collection(firestore, "students"));

    const querySnapshot2 = await getDocs(q2);
    const data2 = querySnapshot2.docs.map((doc) => ({
      // doc.data() is never undefined for query doc snapshots
      ...doc.data(),
      id: doc.id,
    }));
    setStudentState(data2);
    setStudentUpdateTime(Date.now());
    setShowLoader(false);
  };

  useEffect(() => {
    if (details) {
      if ((Date.now() - loggedAt) / 1000 / 60 / 15 < 1) {
        setState(userdetails);
      } else {
        router.push("/logout");
      }
    }
    const teacherDifference = (Date.now() - teacherUpdateTime) / 1000 / 60 / 15;
    if (teacherDifference >= 1 || teachersState.length === 0) {
      // storeTeachersData();
    }
    const schDifference = (Date.now() - studentUpdateTime) / 1000 / 60 / 15;
    if (schDifference >= 1 || studentState.length === 0) {
      // storeStudentData();
    }

    // eslint-disable-next-line
  }, []);
  const RenderMenu = () => {
    if (state === "admin") {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/dashboard"
              onClick={handleNavCollapse}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/Notification"
              onClick={handleNavCollapse}
            >
              Notifications
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/update_self"
              onClick={handleNavCollapse}
            >
              Update Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/updateunp"
              onClick={handleNavCollapse}
            >
              Update Username And Password
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/amtawestwbtpta"
            >
              <i className="bi bi-facebook"></i> Facebook Page
            </a>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="#"
              className="nav-link"
              onClick={() => {
                handleNavCollapse();
                storeSchoolData();
                storeTeachersData();
                getAcceptingData();
                setTeacherUpdateTime(Date.now() - 1000 * 60 * 15);
                setStudentUpdateTime(Date.now() - 1000 * 60 * 15);
                setSlideUpdateTime(Date.now() - 1000 * 60 * 15);
                setNoticeUpdateTime(Date.now() - 1000 * 60 * 15);
              }}
            >
              <i className="bi bi-arrow-clockwise text-success fs-3 cursor-pointer"></i>
            </Link>
          </li>
        </>
      );
    } else if (state === "student") {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/dashboard"
              onClick={handleNavCollapse}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/Notification"
              onClick={handleNavCollapse}
            >
              Notifications
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/update_self"
              onClick={handleNavCollapse}
            >
              Update Profile
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/updateunp"
              onClick={handleNavCollapse}
            >
              Update Username And Password
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/amtawestwbtpta"
            >
              <i className="bi bi-facebook"></i> Facebook Page
            </a>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="#"
              className="nav-link"
              onClick={() => {
                handleNavCollapse();
                storeSchoolData();
                storeTeachersData();
                getAcceptingData();
                setTeacherUpdateTime(Date.now() - 1000 * 60 * 15);
                setStudentUpdateTime(Date.now() - 1000 * 60 * 15);
                setSlideUpdateTime(Date.now() - 1000 * 60 * 15);
                setNoticeUpdateTime(Date.now() - 1000 * 60 * 15);
              }}
            >
              <i className="bi bi-arrow-clockwise text-success fs-3 cursor-pointer"></i>
            </Link>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-item">
            <Link
              className="nav-link"
              aria-current="page"
              href="/"
              onClick={handleNavCollapse}
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/Notification"
              onClick={handleNavCollapse}
            >
              Notifications
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/admission"
              onClick={handleNavCollapse}
            >
              Addmission
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/studentdata"
              onClick={handleNavCollapse}
            >
              Student Data
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/result"
              onClick={handleNavCollapse}
            >
              Result
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/autoresult"
              onClick={handleNavCollapse}
            >
              Auto Result
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/mdmdata"
              onClick={handleNavCollapse}
            >
              MDM Data
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/accounts"
              onClick={handleNavCollapse}
            >
              Accounts
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/downloads"
              onClick={handleNavCollapse}
            >
              Downloads
            </Link>
          </li>

          <li className="nav-item">
            <a
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/amtawestwbtpta"
              onClick={handleNavCollapse}
            >
              <i className="bi bi-facebook"></i> Facebook Page
            </a>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link"
              href="/complain"
              onClick={handleNavCollapse}
            >
              Complain or Suggest Us
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              href="/login"
              onClick={handleNavCollapse}
            >
              Login / Sign Up
            </Link>
          </li>
        </>
      );
    }
  };

  return (
    <nav className="navbar align-items-end navbar-expand-lg bg-white px-lg-3 py-lg-2 shadow-sm sticky-top p-2 overflow-auto bg-body-tertiary noprint">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            // src="https://raw.githubusercontent.com/usprys/usprysdata/main/logoweb.png"
            src={schoolLogo}
            alt="LOGO"
            style={{ width: 70, height: 70 }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <RenderMenu />
          </ul>
        </div>
      </div>
      {showLoader && <Loader />}
    </nav>
  );
}
