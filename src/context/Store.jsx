"use client";
import React, { createContext, useContext, useState } from "react";

import { FirebaseProvider } from "./FirbaseContext";

const GlobalContext = createContext({
  state: {
    USER: {
      name: '',
      email: '',
      id: '',
      access:"",
      userType: '',
    },
    LOGGEDAT: '',
  },
  setState: () => {},
  setStateArray: () => [],
  stateObject: {},
  setStateObject: () => {},
  teachersState: [],
  setTeachersState: () => [],
  studentState: [],
  setStudentState: () => [],
  slideState: [],
  setSlideState: () => [],
  userState: [],
  setUserState: () => [],
  userUpdateTime: "",
  setUserUpdateTime: () => "",
  noticeState: [],
  setNoticeState: () => [],
  teacherUpdateTime: "",
  setTeacherUpdateTime: () => "",
  studentUpdateTime: "",
  setStudentUpdateTime: () => "",
  slideUpdateTime: "",
  setSlideUpdateTime: () => "",
  noticeUpdateTime: "",
  setNoticeUpdateTime: () => "",
  userUpdateTime: "",
  setUserUpdateTime: () => "",
});
export const GlobalContextProvider = ({ children }) => {
  const [state, setState] = useState({
    USER: {
      name: '',
      email: '',
      id: '',
      access:"",
      userType: '',
    },
    LOGGEDAT: '',
  });
  const [stateArray, setStateArray] = useState([]);
  const [stateObject, setStateObject] = useState({});
  const [teachersState, setTeachersState] = useState([]);
  const [userState, setUserState] = useState([]);
  const [studentState, setStudentState] = useState([]);
  const [slideState, setSlideState] = useState([]);
  const [noticeState, setNoticeState] = useState([]);
  const [teacherUpdateTime, setTeacherUpdateTime] = useState(Date.now() - 1000);
  const [studentUpdateTime, setStudentUpdateTime] = useState(Date.now() - 1000);
  const [slideUpdateTime, setSlideUpdateTime] = useState(Date.now() - 1000);
  const [noticeUpdateTime, setNoticeUpdateTime] = useState(Date.now() - 1000);
  const [userUpdateTime, setUserUpdateTime] = useState(Date.now() - 1000);

  return (
    <GlobalContext.Provider
      value={{
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
      }}
    >
      <FirebaseProvider>{children}</FirebaseProvider>
    </GlobalContext.Provider>
  );
};
