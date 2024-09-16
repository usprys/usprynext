"use client";
import React, { useState, useContext, useEffect } from "react";
import { useGlobalContext } from "../../context/Store";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { firestore, firbaseAuth } from "../../context/FirbaseContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../../components/Loader";
import { encryptObjData, getCookie, setCookie } from "../../modules/encryption";
import { comparePassword } from "@/modules/calculatefunctions";
import Link from "next/link";
export default function Login() {
  const router = useRouter();
  const { state, setState } = useGlobalContext();
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const submitData = async (e) => {
    e.preventDefault();
    if (validForm()) {
      setLoader(true);
      const collectionRef = collection(firestore, "users");
      const q = query(
        collectionRef,
        where("username", "==", username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs[0].data().pan);
      if (querySnapshot.docs.length > 0) {
        let fdata = querySnapshot.docs[0].data();

        // if (fdata.password === password) {
        if (comparePassword(password, fdata.password)) {
          setLoader(false);
          toast.success("Congrats! You are Logined Successfully!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,

            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setState({
            USER: {
              name: fdata.name,
              email: fdata.email,
              id: fdata.id,
              access: fdata.access,
              userType: fdata.userType,
            },
            LOGGEDAT: Date.now(),
          });
          encryptObjData("uid", fdata, 10080);
          setCookie("loggedAt", Date.now(), 10080);
          router.push("/dashboard");
        } else {
          setLoader(false);
          toast.error("Wrong Password!", {
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
        setLoader(false);
        toast.error("Invalid Username!", {
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
      toast.error("Please fill all the required fields");
    }
  };

  const validForm = () => {
    let isValid = false;
    if (username.length === 0) {
      setUserNameErr("Username is required");
    } else {
      setUserNameErr("");
    }
    if (password.length === 0) {
      setPasswordErr("Password is required");
    } else {
      setPasswordErr("");
    }
    isValid = username.length > 0 && password.length > 0;
    return isValid;
  };

  return (
    <div className="container text-black p-2 my-4">
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

      {loader ? <Loader /> : null}
      <h3 className="text-primary">Login</h3>
      <div className="text-center col-md-6 mx-auto p-4 rounded-3 bg-gradient-primary">
        <form
          method="post"
          className="w-75 mx-auto"
          autoComplete="off"
          onSubmit={submitData}
        >
          <div className="input-group mb-3">
            <span className="input-group-text">Username</span>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          {userNameErr.length > 0 && (
            <p className="text-danger my-2">{userNameErr}</p>
          )}
          <div className="input-group mb-3">
            <span className="input-group-text">Password</span>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {passwordErr.length > 0 && (
            <p className="text-danger my-2">{passwordErr}</p>
          )}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Do Not have an account?{" "}
          <Link className="btn btn-success btn-sm" href="/signup">
            Sign Up
          </Link>
        </p>
        <p className="mt-3 text-center">
          Forgot your password?{" "}
          <Link className="btn btn-info btn-sm" href="/forgotpassword">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
}
