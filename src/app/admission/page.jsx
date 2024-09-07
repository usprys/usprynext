"use client";
import React, { useEffect, useState } from "react";
import {
  getCurrentDateInput,
  getSubmitDateInput,
  todayInString,
  setInputNumberMaxLength,
} from "../../modules/calculatefunctions";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { firestore } from "../../context/FirbaseContext";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { BsClipboard, BsClipboard2Check } from "react-icons/bs";
import { useGlobalContext } from "../../context/Store";
import { DateValueToSring } from "../../modules/calculatefunctions";
import { useRouter } from "next/navigation";
import { SCHOOLNAME } from "@/modules/constants";
export default function Admission() {
  const { setStateObject, setStateArray } = useGlobalContext();
  const router = useRouter();
  const [docId, setDocId] = useState(
    new Date().getFullYear().toString() +
      (new Date().getMonth() + 1 > 9
        ? new Date().getMonth()
        : ("0" + (new Date().getMonth() + 1)).toString()) +
      new Date().getDate().toString() +
      new Date().getHours().toString() +
      new Date().getMinutes().toString() +
      new Date().getSeconds().toString()
  );
  const [inputField, setInputField] = useState({
    id: docId,
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_birthday: `01-01-${new Date().getFullYear() - 5}`,
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "GENERAL",
    student_bpl_status: "NO",
    student_bpl_number: "",
    student_village: "SEHAGORI",
    student_post_office: "KHOROP",
    student_police_station: "JOYPUR",
    student_pin_code: "711401",
    student_addmission_class: "PRE PRIMARY",
    student_previous_class: "FIRST TIME ADDMISSION",
    student_previous_class_year: "",
    student_previous_school: "",
    student_addmission_date: todayInString(),
    student_addmission_dateAndTime: Date.now(),
  });
  const [errInputField, setErrInputField] = useState({
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "",
    student_bpl_status: "",
    student_bpl_number: "",
    student_village: "",
    student_post_office: "",
    student_police_station: "",
    student_pin_code: "",
    student_addmission_class: "",
    student_previous_class_year: "",
    student_previous_school: "",
  });
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [ticket, setTicket] = useState("");
  const [showErr, setShowErr] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSearchedResult, setShowSearchedResult] = useState(false);

  const [searchedTicket, setSearchedTicket] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_birthday: "",
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "",
    student_bpl_status: "",
    student_bpl_number: "",
    student_village: "",
    student_post_office: "",
    student_police_station: "",
    student_pin_code: "",
    student_addmission_class: "",
    student_previous_class: "",
    student_previous_class_year: "",
    student_previous_school: "",
    student_addmission_date: "",
    student_addmission_dateAndTime: "",
  });

  const [showEditForm, setShowEditForm] = useState(false);

  const validForm = () => {
    let formIsValid = true;
    setErrInputField({
      student_beng_name: "",
      student_eng_name: "",
      father_beng_name: "",
      father_eng_name: "",
      mother_beng_name: "",
      mother_eng_name: "",
      guardian_beng_name: "",
      guardian_eng_name: "",
      student_gender: "",
      student_mobile: "",

      student_religion: "",
      student_race: "",
      student_bpl_number: "",
      student_village: "",
      student_post_office: "",
      student_police_station: "",
      student_pin_code: "",
      student_addmission_class: "",
      student_previous_class_year: "",
      student_previous_school: "",
    });
    if (inputField.student_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_beng_name: "দয়া করে ছাত্র/ছাত্রীর বাংলা নাম লিখুন",
      }));
    }
    if (inputField.student_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_eng_name: "দয়া করে ছাত্র/ছাত্রীর ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.father_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        father_beng_name: "দয়া করে বাবার বাংলা নাম লিখুন",
      }));
    }
    if (inputField.father_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        father_eng_name: "দয়া করে বাবার ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.mother_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        mother_beng_name: "দয়া করে মাতার বাংলা নাম লিখুন",
      }));
    }
    if (inputField.mother_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        mother_eng_name: "দয়া করে মাতার ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.guardian_beng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        guardian_beng_name: "দয়া করে অভিভাবকের বাংলা নাম লিখুন",
      }));
    }
    if (inputField.guardian_eng_name === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        guardian_eng_name: "দয়া করে অভিভাবকের ইংরাজী নাম লিখুন",
      }));
    }
    if (inputField.student_gender === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_gender: "দয়া করে ছাত্র/ছাত্রীর লিঙ্গ বেছে নিন",
      }));
    }
    if (inputField.student_mobile === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_mobile: "দয়া করে অভিভাবকের মোবাইল নাম্বার লিখুন",
      }));
    }
    if (inputField.student_religion === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_religion: "দয়া করে ছাত্র/ছাত্রীর ধর্ম বেছে নিন",
      }));
    }
    if (inputField.student_race === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_race: "দয়া করে ছাত্র/ছাত্রীর জাতি বেছে নিন",
      }));
    }
    if (inputField.student_bpl_status === "YES") {
      if (inputField.student_bpl_number === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_bpl_number: "দয়া করে ছাত্র/ছাত্রীর BPL নাম্বার লিখুন",
        }));
      }
    }
    if (inputField.student_village === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_village: "দয়া করে ছাত্র/ছাত্রীর গ্রামের নাম লিখুন",
      }));
    }
    if (inputField.student_post_office === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_post_office: "দয়া করে ছাত্র/ছাত্রীর পোস্ট অফিসের নাম লিখুন",
      }));
    }
    if (inputField.student_police_station === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_police_station:
          "দয়া করে ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম লিখুন",
      }));
    }
    if (inputField.student_pin_code === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_pin_code: "দয়া করে ছাত্র/ছাত্রীর পিনকোড লিখুন",
      }));
    }
    if (inputField.student_addmission_class === "") {
      formIsValid = false;
      setErrInputField((prevState) => ({
        ...prevState,
        student_addmission_class:
          "দয়া করে ছাত্র/ছাত্রীর ভর্তি হওয়ার শ্রেনী বেছে নিন",
      }));
    }
    if (inputField.student_previous_class !== "FIRST TIME ADDMISSION") {
      if (inputField.student_previous_class_year === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_previous_class_year:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের শ্রেনীর বছর লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (inputField.student_previous_school === "") {
        formIsValid = false;
        setErrInputField((prevState) => ({
          ...prevState,
          student_previous_school:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
    }
    return formIsValid;
  };

  const submitData = async (e) => {
    e.preventDefault();
    if (validForm()) {
      //submit
      try {
        setLoader(true);
        await setDoc(doc(firestore, "admission", docId), {
          id: docId,
          student_beng_name: inputField.student_beng_name,
          student_eng_name: inputField.student_eng_name.toUpperCase(),
          father_beng_name: inputField.father_beng_name,
          father_eng_name: inputField.father_eng_name.toUpperCase(),
          mother_beng_name: inputField.mother_beng_name,
          mother_eng_name: inputField.mother_eng_name.toUpperCase(),
          guardian_beng_name: inputField.guardian_beng_name,
          guardian_eng_name: inputField.guardian_eng_name.toUpperCase(),
          student_birthday: inputField.student_birthday,
          student_gender: inputField.student_gender,
          student_mobile: inputField.student_mobile,
          student_aadhaar: inputField.student_aadhaar,
          student_religion: inputField.student_religion,
          student_race: inputField.student_race,
          student_bpl_status: inputField.student_bpl_status,
          student_bpl_number: inputField.student_bpl_number,
          student_village: inputField.student_village.toUpperCase(),
          student_post_office: inputField.student_post_office.toUpperCase(),
          student_police_station:
            inputField.student_police_station.toUpperCase(),
          student_pin_code: inputField.student_pin_code,
          student_addmission_class: inputField.student_addmission_class,
          student_previous_class: inputField.student_previous_class,
          student_previous_class_year: inputField.student_previous_class_year,
          student_previous_school:
            inputField.student_previous_school.toUpperCase(),
          student_addmission_date: todayInString(),
          student_addmission_dateAndTime: Date.now(),
        });

        // console.log(result.id);
        setLoader(false);
        toast.success("Congrats! Form Has Been Submitted to Us Successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFormSubmitted(true);
        setShowForm(false);
        setStateObject(inputField);
        setInputField({
          id: docId,
          student_beng_name: "",
          student_eng_name: "",
          father_beng_name: "",
          father_eng_name: "",
          mother_beng_name: "",
          mother_eng_name: "",
          guardian_beng_name: "",
          guardian_eng_name: "",
          student_birthday: `01-01-${new Date().getFullYear() - 5}`,
          student_gender: "",
          student_mobile: "",
          student_aadhaar: "",
          student_religion: "",
          student_race: "GENERAL",
          student_bpl_status: "NO",
          student_bpl_number: "",
          student_village: "SEHAGORI",
          student_post_office: "KHOROP",
          student_police_station: "JOYPUR",
          student_pin_code: "711401",
          student_addmission_class: "PRE PRIMARY",
          student_previous_class: "FIRST TIME ADDMISSION",
          student_previous_class_year: "",
          student_previous_school: "",
          student_addmission_date: todayInString(),
          student_addmission_dateAndTime: Date.now(),
        });
      } catch (e) {
        toast.error("Something went Wrong", {
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

  const searchTicket = async () => {
    setLoader(true);
    const ref = doc(firestore, "admission", ticket);
    try {
      const snap = await getDoc(ref);
      const data = snap.data();
      setSearchedTicket(data);
      setShowSearchedResult(true);
      setShowUpdateForm(false);
      setLoader(false);
    } catch (error) {
      toast.error("Ticket Not Found!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setShowSearchedResult(false);
      setLoader(false);
    }
  };

  const [editInputField, setEditInputField] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_birthday: ``,
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "",
    student_bpl_status: "",
    student_bpl_number: "",
    student_village: "",
    student_post_office: "",
    student_police_station: "",
    student_pin_code: "",
    student_addmission_class: "",
    student_previous_class: "",
    student_previous_class_year: "",
    student_previous_school: "",
    student_addmission_date: "",
    student_addmission_dateAndTime: "",
    student_updatation_dateAndTime: Date.now(),
  });

  const [errEditInputField, setErrEditInputField] = useState({
    id: "",
    student_beng_name: "",
    student_eng_name: "",
    father_beng_name: "",
    father_eng_name: "",
    mother_beng_name: "",
    mother_eng_name: "",
    guardian_beng_name: "",
    guardian_eng_name: "",
    student_gender: "",
    student_mobile: "",
    student_aadhaar: "",
    student_religion: "",
    student_race: "",
    student_bpl_status: "",
    student_bpl_number: "",
    student_village: "",
    student_post_office: "",
    student_police_station: "",
    student_pin_code: "",
    student_addmission_class: "",
    student_previous_class_year: "",
    student_previous_school: "",
  });

  const updateData = async () => {
    if (validEditForm()) {
      setLoader(true);
      try {
        const docRef = doc(firestore, "admission", editInputField.id);
        await updateDoc(docRef, editInputField)
          .then(() => {
            toast.success("Form Has Been Updated Successfully!", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setShowEditForm(false);
            setLoader(false);
            setEditInputField({
              id: "",
              student_beng_name: "",
              student_eng_name: "",
              father_beng_name: "",
              father_eng_name: "",
              mother_beng_name: "",
              mother_eng_name: "",
              guardian_beng_name: "",
              guardian_eng_name: "",
              student_birthday: ``,
              student_gender: "",
              student_mobile: "",
              student_aadhaar: "",
              student_religion: "",
              student_race: "",
              student_bpl_status: "",
              student_bpl_number: "",
              student_village: "",
              student_post_office: "",
              student_police_station: "",
              student_pin_code: "",
              student_addmission_class: "",
              student_previous_class: "",
              student_previous_class_year: "",
              student_previous_school: "",
              student_addmission_date: "",
              student_addmission_dateAndTime: "",
            });
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
  const validEditForm = () => {
    let formIsValid = true;
    setEditErrInputField({
      student_beng_name: "",
      student_eng_name: "",
      father_beng_name: "",
      father_eng_name: "",
      mother_beng_name: "",
      mother_eng_name: "",
      guardian_beng_name: "",
      guardian_eng_name: "",
      student_gender: "",
      student_mobile: "",

      student_religion: "",
      student_race: "",
      student_bpl_number: "",
      student_village: "",
      student_post_office: "",
      student_police_station: "",
      student_pin_code: "",
      student_addmission_class: "",
      student_previous_class_year: "",
      student_previous_school: "",
    });
    if (editErrInputField.student_beng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_beng_name: "দয়া করে ছাত্র/ছাত্রীর বাংলা নাম লিখুন",
      }));
    }
    if (editErrInputField.student_eng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_eng_name: "দয়া করে ছাত্র/ছাত্রীর ইংরাজী নাম লিখুন",
      }));
    }
    if (editErrInputField.father_beng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        father_beng_name: "দয়া করে বাবার বাংলা নাম লিখুন",
      }));
    }
    if (editErrInputField.father_eng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        father_eng_name: "দয়া করে বাবার ইংরাজী নাম লিখুন",
      }));
    }
    if (editErrInputField.mother_beng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        mother_beng_name: "দয়া করে মাতার বাংলা নাম লিখুন",
      }));
    }
    if (editErrInputField.mother_eng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        mother_eng_name: "দয়া করে মাতার ইংরাজী নাম লিখুন",
      }));
    }
    if (editErrInputField.guardian_beng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        guardian_beng_name: "দয়া করে অভিভাবকের বাংলা নাম লিখুন",
      }));
    }
    if (editErrInputField.guardian_eng_name === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        guardian_eng_name: "দয়া করে অভিভাবকের ইংরাজী নাম লিখুন",
      }));
    }
    if (editErrInputField.student_gender === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_gender: "দয়া করে ছাত্র/ছাত্রীর লিঙ্গ বেছে নিন",
      }));
    }
    if (editErrInputField.student_mobile === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_mobile: "দয়া করে অভিভাবকের মোবাইল নাম্বার লিখুন",
      }));
    }
    if (editErrInputField.student_religion === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_religion: "দয়া করে ছাত্র/ছাত্রীর ধর্ম বেছে নিন",
      }));
    }
    if (editErrInputField.student_race === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_race: "দয়া করে ছাত্র/ছাত্রীর জাতি বেছে নিন",
      }));
    }
    if (editErrInputField.student_bpl_status === "YES") {
      if (editErrInputField.student_bpl_number === "") {
        formIsValid = false;
        setEditErrInputField((prevState) => ({
          ...prevState,
          student_bpl_number: "দয়া করে ছাত্র/ছাত্রীর BPL নাম্বার লিখুন",
        }));
      }
    }
    if (editErrInputField.student_village === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_village: "দয়া করে ছাত্র/ছাত্রীর গ্রামের নাম লিখুন",
      }));
    }
    if (editErrInputField.student_post_office === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_post_office: "দয়া করে ছাত্র/ছাত্রীর পোস্ট অফিসের নাম লিখুন",
      }));
    }
    if (editErrInputField.student_police_station === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_police_station:
          "দয়া করে ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম লিখুন",
      }));
    }
    if (editErrInputField.student_pin_code === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_pin_code: "দয়া করে ছাত্র/ছাত্রীর পিনকোড লিখুন",
      }));
    }
    if (editErrInputField.student_addmission_class === "") {
      formIsValid = false;
      setEditErrInputField((prevState) => ({
        ...prevState,
        student_addmission_class:
          "দয়া করে ছাত্র/ছাত্রীর ভর্তি হওয়ার শ্রেনী বেছে নিন",
      }));
    }
    if (editErrInputField.student_previous_class !== "FIRST TIME ADDMISSION") {
      if (editErrInputField.student_previous_class_year === "") {
        formIsValid = false;
        setEditErrInputField((prevState) => ({
          ...prevState,
          student_previous_class_year:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের শ্রেনীর বছর লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
      if (editErrInputField.student_previous_school === "") {
        formIsValid = false;
        setEditErrInputField((prevState) => ({
          ...prevState,
          student_previous_school:
            "দয়া করে ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা লিখুন অথবা যদি ভুল করে ছাত্র/ছাত্রীর পূর্বের শ্রেণী বেছে নিয়ে থাকেন তাহলে সেটি 'শ্রেণী বেছে নিন' করে দিন।",
        }));
      }
    }
    return formIsValid;
  };
  useEffect(() => {}, [inputField, editInputField]);

  return (
    <div className="container ben">
      {loader ? <Loader /> : null}
      <h3>WELCOME TO {SCHOOLNAME}</h3>
      <h3>ADMISSION SECTION</h3>
      <button
        type="button"
        className={`btn btn-${showForm ? "warning" : "success"} m-2`}
        onClick={() => {
          setShowForm(!showForm);
          setShowUpdateForm(false);
          setDocId(
            new Date().getFullYear().toString() +
              (new Date().getMonth() + 1 > 9
                ? new Date().getMonth()
                : ("0" + (new Date().getMonth() + 1)).toString()) +
              new Date().getDate().toString() +
              new Date().getHours().toString() +
              new Date().getMinutes().toString() +
              new Date().getSeconds().toString()
          );
          setShowSearchedResult(false);
          setShowEditForm(false);
        }}
      >
        {showForm ? "Close Form" : "Fillup Form"}
      </button>
      <button
        type="button"
        className={`btn btn-${showUpdateForm ? "warning" : "primary"} m-2`}
        onClick={() => {
          setShowUpdateForm(!showUpdateForm);
          setShowForm(false);
          setShowSearchedResult(false);
          setShowEditForm(false);
          setTicket("");
        }}
      >
        {showUpdateForm ? "Close Form" : "Edit / Print Filled Form"}
      </button>
      {showForm && (
        <div className="my-4">
          <h6 className="text-danger">* চিহ্ন দেওয়া অংশগুলি আবশ্যিক।</h6>
          <h6 className="text-danger">
            *** যে অংশগুলি বাংলায় বলা আছে শুধুমাত্র সেইগুলিই বাংলায় করবেন বাকি
            সমস্ত অংশ ইংরাজীতে লিখবেন।
          </h6>
          <h6 className="text-danger ben">
            ** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনার ছাত্র/ছাত্রীর সমস্ত প্রয়োজনীয়
            ডকুমেন্টস আপনার সাথে রাখুন।
          </h6>
          <h6 className="text-danger">
            *** ফর্ম ফিলাপের পর প্রদত্ত টিকিট নাম্বার অবশ্যই আপনার কাছে সংরক্ষিত
            রাখবেন।
          </h6>

          <div className="my-4">
            <h3 className="text-primary">ADMISSION FORM</h3>
          </div>
          <div className="text-center text-black">
            <form
              action=""
              method="post"
              className="row mx-auto"
              autoComplete="off"
              onSubmit={submitData}
            >
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_beng_name}
                  placeholder="ছাত্র/ছাত্রীর বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.student_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.student_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর ইংরাজীতে নাম*
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_eng_name}
                  placeholder="ছাত্র/ছাত্রীর ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.student_eng_name.length > 0 && (
                  <span className="error">
                    {errInputField.student_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জন্ম তারিখ*</label>
                <input
                  type="date"
                  className="form-control"
                  id="student_birthday"
                  name="student_birthday"
                  placeholder="ছাত্র/ছাত্রীর জন্ম তারিখ"
                  defaultValue={getCurrentDateInput(
                    inputField.student_birthday
                  )}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_birthday: getSubmitDateInput(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর আধার নাম্বার</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_aadhaar}
                  placeholder="ছাত্র/ছাত্রীর আধার নাম্বার"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_aadhaar: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর লিঙ্গ*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_gender"
                  defaultValue={inputField.student_gender}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_gender: e.target.value,
                    });
                  }}
                >
                  <option value="">লিঙ্গ বেছে নিন</option>
                  <option value={"BOYS"}>ছেলে</option>
                  <option value={"GIRLS"}>মেয়ে</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errInputField.student_gender.length > 0 && (
                  <span className="error">{errInputField.student_gender}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের মোবাইল নাম্বার*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={10}
                  value={inputField.student_mobile}
                  placeholder="অভিভাবকের মোবাইল নাম্বার"
                  className="form-control"
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_mobile: setInputNumberMaxLength(
                        e.target.value,
                        10
                      ),
                    });
                  }}
                />
                {errInputField.student_mobile.length > 0 && (
                  <span className="error">{errInputField.student_mobile}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.father_beng_name}
                  placeholder="পিতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      father_beng_name: e.target.value,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.father_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.father_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.father_eng_name}
                  placeholder="পিতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      father_eng_name: e.target.value,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.father_eng_name.length > 0 && (
                  <span className="error">{errInputField.father_eng_name}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.mother_beng_name}
                  placeholder="মাতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      mother_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.mother_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.mother_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.mother_eng_name}
                  placeholder="মাতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      mother_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.mother_eng_name.length > 0 && (
                  <span className="error">{errInputField.mother_eng_name}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.guardian_beng_name}
                  placeholder="অভিভাবকের বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errInputField.guardian_beng_name.length > 0 && (
                  <span className="error">
                    {errInputField.guardian_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.guardian_eng_name}
                  placeholder="অভিভাবকের ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errInputField.guardian_eng_name.length > 0 && (
                  <span className="error">
                    {errInputField.guardian_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর ধর্ম*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_religion"
                  defaultValue={inputField.student_religion}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_religion: e.target.value,
                    });
                  }}
                >
                  <option value="">ধর্ম বেছে নিন</option>
                  <option value={"HINDU"}>হিন্দু</option>
                  <option value={"ISLAM"}>ইসলাম</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errInputField.student_religion.length > 0 && (
                  <span className="error">
                    {errInputField.student_religion}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জাতি*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_race"
                  defaultValue={inputField.student_race}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_race: e.target.value,
                    });
                  }}
                >
                  <option value="">জাতি বেছে নিন</option>
                  <option value={"GENERAL"}>GENERAL</option>
                  <option value={"OBC-A"}>OBC-A</option>
                  <option value={"OBC-B"}>OBC-B</option>
                  <option value={"SC"}>SC</option>
                  <option value={"ST"}>ST</option>
                </select>
                {errInputField.student_race.length > 0 && (
                  <span className="error">{errInputField.student_race}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রী বি.পি.এল. কিনা? *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_bpl_status"
                  defaultValue={inputField.student_bpl_status}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_bpl_status: e.target.value,
                    });
                    if (e.target.value === "NO") {
                      setInputField({
                        ...inputField,
                        student_bpl_status: e.target.value,
                        student_bpl_number: "",
                      });
                    }
                  }}
                >
                  <option value="">বি.পি.এল. কিনা?</option>
                  <option value={"YES"}>হ্যাঁ</option>
                  <option value={"NO"}>না</option>
                </select>
              </div>
              {inputField.student_bpl_status === "YES" && (
                <div className="mb-3 col-md-4">
                  <label className="form-label">
                    অভিভাবকের বি.পি.এল. নাম্বার *
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={inputField.student_bpl_number}
                    placeholder="অভিভাবকের বি.পি.এল. নাম্বার"
                    className="form-control"
                    onChange={(e) =>
                      setInputField({
                        ...inputField,
                        student_bpl_number: e.target.value,
                      })
                    }
                  />
                  {errInputField.student_bpl_number.length > 0 && (
                    <span className="error">
                      {errInputField.student_bpl_number}
                    </span>
                  )}
                </div>
              )}
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর গ্রামের নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_village}
                  placeholder="ছাত্র/ছাত্রীর গ্রামের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_village: e.target.value,
                    })
                  }
                />
                {errInputField.student_village.length > 0 && (
                  <span className="error">{errInputField.student_village}</span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_post_office}
                  placeholder="ছাত্র/ছাত্রীর পোস্ট অফিসের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_post_office: e.target.value,
                    })
                  }
                />
                {errInputField.student_post_office.length > 0 && (
                  <span className="error">
                    {errInputField.student_post_office}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={inputField.student_police_station}
                  placeholder="ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_police_station: e.target.value,
                    })
                  }
                />
                {errInputField.student_police_station.length > 0 && (
                  <span className="error">
                    {errInputField.student_police_station}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর পিনকোড*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={6}
                  value={inputField.student_pin_code}
                  placeholder="ছাত্র/ছাত্রীর পিনকোড"
                  className="form-control"
                  onChange={(e) =>
                    setInputField({
                      ...inputField,
                      student_pin_code: setInputNumberMaxLength(
                        e.target.value,
                        6
                      ),
                    })
                  }
                />
                {errInputField.student_pin_code.length > 0 && (
                  <span className="error">
                    {errInputField.student_pin_code}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4  mx-auto">
                <label className="form-label">
                  ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_addmission_class"
                  defaultValue={inputField.student_addmission_class}
                  onChange={(e) => {
                    setInputField({
                      ...inputField,
                      student_addmission_class: e.target.value,
                    });
                  }}
                >
                  <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                  <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                  <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                  <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                  <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                </select>
                {errInputField.student_addmission_class.length > 0 && (
                  <span className="error">
                    {errInputField.student_addmission_class}
                  </span>
                )}
              </div>
              <hr className="text-danger" />
              <p className="text-danger">
                *** এই অংশ যদি ছাত্র/ছাত্রী অন্য স্কুল থেকে ট্রান্সফার নিয়ে আসে
                সেটির জন্য
              </p>
              <div
                className="rounded rounded-2 p-2 m-2 row"
                style={{ backgroundColor: "pink" }}
              >
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের শ্রেণী *
                  </label>
                  <select
                    className="form-select"
                    aria-label=".form-select-sm example"
                    required
                    id="student_previous_class"
                    defaultValue={inputField.student_previous_class}
                    onChange={(e) => {
                      setInputField({
                        ...inputField,
                        student_previous_class: e.target.value,
                      });
                    }}
                  >
                    <option value="FIRST TIME ADDMISSION">
                      শ্রেণী বেছে নিন
                    </option>
                    <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                    <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                    <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                    <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                    <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বর্ষ *
                  </label>
                  <input
                    type="number"
                    name=""
                    id=""
                    value={inputField.student_previous_class_year}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বর্ষ"
                    className="form-control"
                    onChange={(e) =>
                      setInputField({
                        ...inputField,
                        student_previous_class_year: e.target.value,
                      })
                    }
                  />
                  {errInputField.student_previous_class_year.length > 0 && (
                    <span className="error">
                      {errInputField.student_previous_class_year}
                    </span>
                  )}
                </div>
                <div className="mb-3 col-md-6 mx-auto">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের ঠিকানা *
                  </label>

                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="7"
                    value={inputField.student_previous_school}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের ঠিকানা"
                    className="form-control"
                    onChange={(e) =>
                      setInputField({
                        ...inputField,
                        student_previous_school: e.target.value,
                      })
                    }
                  ></textarea>
                  {errInputField.student_previous_school.length > 0 && (
                    <span className="error">
                      {errInputField.student_previous_school}
                    </span>
                  )}
                </div>
              </div>
              <hr className="text-danger" />
              <div className="mb-3 col-md-4 mx-auto">
                <button
                  type="submit"
                  className="btn btn-success m-2"
                  onClick={submitData}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-danger m-2"
                  onClick={() => {
                    setInputField({
                      id: docId,
                      student_beng_name: "",
                      student_eng_name: "",
                      father_beng_name: "",
                      father_eng_name: "",
                      mother_beng_name: "",
                      mother_eng_name: "",
                      guardian_beng_name: "",
                      guardian_eng_name: "",
                      student_birthday: `01-01-${new Date().getFullYear() - 5}`,
                      student_gender: "",
                      student_mobile: "",
                      student_aadhaar: "",
                      student_religion: "",
                      student_race: "GENERAL",
                      student_bpl_status: "NO",
                      student_bpl_number: "",
                      student_village: "SEHAGORI",
                      student_post_office: "KHOROP",
                      student_police_station: "JOYPUR",
                      student_pin_code: "711401",
                      student_addmission_class: "PRE PRIMARY",
                      student_previous_class: "FIRST TIME ADDMISSION",
                      student_previous_class_year: "",
                      student_previous_school: "",
                      student_addmission_date: todayInString(),
                      student_addmission_dateAndTime: Date.now(),
                    });
                    if (typeof window !== undefined) {
                      document.getElementById("student_gender").value = "";
                      document.getElementById(
                        "student_birthday"
                      ).value = `01-01-${new Date().getFullYear() - 5}`;
                      document.getElementById("student_religion").value = "";
                      document.getElementById("student_race").value = "";
                      document.getElementById("student_bpl_status").value = "";
                      document.getElementById(
                        "student_addmission_class"
                      ).value = "";
                      document.getElementById("student_previous_class").value =
                        "FIRST TIME ADDMISSION";
                    }
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="my-4 mx-auto">
          <h6 className="text-danger ben">
            *** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনাকে প্রদত্ত ছাত্র/ছাত্রীর
            প্রদত্ত টিকিট নাম্বারটি নিজের কাছে রাখুন।
          </h6>
          <div className="my-4 mx-auto d-flex justify-content-center align-items-center">
            <form method="post" className="mb-3 col-md-6">
              <label className="form-label">টিকিট নাম্বার লিখুন*</label>
              <input
                type="text"
                name=""
                id=""
                value={ticket}
                placeholder="টিকিট নাম্বার লিখুন"
                className="form-control"
                onChange={(e) => setTicket(e.target.value)}
              />
              <br />
              {showErr && (
                <span className="error">দয়া করে টিকিট নাম্বার লিখুন</span>
              )}
              <br />
              <button
                type="submit"
                className="btn btn-success m-2"
                onClick={(e) => {
                  e.preventDefault();
                  setShowErr(true);
                  if (ticket.length > 0) {
                    searchTicket();
                    setShowErr(false);
                  } else {
                    setShowErr(true);
                  }
                }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
      {formSubmitted && (
        <div className="my-5">
          <h3 className="text-success">
            Congrats! আপনার ফর্মটি সাফল্যের সাথে আমাদের কাছে জমা পড়ে গেছে!
          </h3>
          <h3 className="text-success">
            অনুগ্রহ করে লিখে রাখবেন আপনার টিকিট নাম্বারটি হলো।
          </h3>
          <div className="bg-light  mx-auto p-4 rounded">
            <div className="float-end">
              {!success ? (
                <div>
                  <BsClipboard
                    onClick={() => {
                      navigator.clipboard.writeText(docId);
                      setSuccess(true);
                      setTimeout(() => setSuccess(false), 1500);
                    }}
                    size={30}
                    color="skyblue"
                  />
                  <h6 className="text-info my-1">Copy</h6>
                </div>
              ) : (
                <div>
                  <BsClipboard2Check
                    onClick={() => {
                      navigator.clipboard.writeText(docId);
                      setSuccess(true);
                      setTimeout(() => setSuccess(false), 1500);
                    }}
                    size={30}
                    color="green"
                  />
                  <h6 className="text-success my-1">Ticket Copied</h6>
                </div>
              )}
            </div>
            <h1 className="text-primary text-center timesNewRoman">{docId}</h1>
            {success ? (
              <h6 className="text-success" suppressHydrationWarning={true}>
                Token Coppied to Clipboard
              </h6>
            ) : null}
            <div className="mx-auto mt-2">
              <button
                className="btn btn-danger"
                type="button"
                onClick={() => {
                  setShowUpdateForm(false);
                  setShowForm(false);
                  setFormSubmitted(false);
                  if (typeof window !== undefined) {
                    window.location.reload();
                  }
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {showSearchedResult && (
        <div className="container">
          <table
            className="table table-bordered table-striped border-black border-1 my-4 p-4"
            style={{ border: "1px solid black" }}
          >
            <thead>
              <th style={{ border: "1px solid black" }}>Application No.</th>
              <th style={{ border: "1px solid black" }}>ছাত্র/ছাত্রীর নাম</th>
              <th style={{ border: "1px solid black" }}>পিতার নাম</th>
              <th style={{ border: "1px solid black" }}>
                ফর্ম জমা দেওয়ার তারিখ
              </th>
              <th style={{ border: "1px solid black" }}>Action</th>
            </thead>
            <tbody style={{ verticalAlign: "center" }}>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {searchedTicket.id}
              </td>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {searchedTicket.student_eng_name}
              </td>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {searchedTicket.father_eng_name}
              </td>
              <td className="p-2" style={{ border: "1px solid black" }}>
                {DateValueToSring(
                  searchedTicket.student_addmission_dateAndTime
                )}
              </td>
              <td className="p-2">
                <div>
                  <button
                    type="button"
                    className="btn btn-success btn-sm m-2"
                    onClick={() => {
                      setStateObject(searchedTicket);
                      router.push("/printAdmissionForm");
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm m-2"
                    onClick={() => {
                      setEditInputField(searchedTicket);
                      setShowEditForm(true);
                      setShowSearchedResult(false);
                      setShowUpdateForm(false);
                      if (typeof window !== "undefined") {
                        setTimeout(() => {
                          document.getElementById("student_birthday").value =
                            getCurrentDateInput(
                              searchedTicket.student_birthday
                            );
                        }, 500);
                      }
                    }}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tbody>
          </table>
          {/* <div className="row">
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর বাংলায় নাম:
              <br /> {searchedTicket.student_beng_name}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর ইংরাজীতে নাম:
              <br /> {searchedTicket.student_eng_name}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর জন্ম তারিখ:
              <br /> {searchedTicket.student_birthday}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর আধার নাম্বার:
              <br /> {searchedTicket.student_aadhaar}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর লিঙ্গ:
              <br /> {searchedTicket.student_gender}
            </h6>
            <h6 className="text-center col-md-3">
              অভিভাবকের মোবাইল নাম্বার:
              <br /> {searchedTicket.student_mobile}
            </h6>
            <h6 className="text-center col-md-3">
              পিতার বাংলায় নাম:
              <br /> {searchedTicket.father_beng_name}
            </h6>
            <h6 className="text-center col-md-3">
              পিতার ইংরাজীতে নাম:
              <br /> {searchedTicket.father_eng_name}
            </h6>
            <h6 className="text-center col-md-3">
              মাতার বাংলায় নাম:
              <br /> {searchedTicket.mother_beng_name}
            </h6>
            <h6 className="text-center col-md-3">
              মাতার ইংরাজীতে নাম:
              <br /> {searchedTicket.mother_eng_name}
            </h6>
            <h6 className="text-center col-md-3">
              অভিভাবকের বাংলায় নাম:
              <br /> {searchedTicket.guardian_beng_name}
            </h6>
            <h6 className="text-center col-md-3">
              অভিভাবকের ইংরাজীতে নাম:
              <br /> {searchedTicket.guardian_eng_name}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর ধর্ম:
              <br /> {searchedTicket.student_religion}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর জাতি:
              <br /> {searchedTicket.student_race}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রী বি.পি.এল. কিনা?:
              <br /> {searchedTicket.student_bpl_status}
            </h6>

            {searchedTicket.student_bpl_status === "YES" && (
              <h6 className="text-center col-md-3">
                অভিভাবকের বি.পি.এল. নাম্বার:
                <br /> {searchedTicket.student_bpl_number}
              </h6>
            )}
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর গ্রামের নাম:
              <br /> {searchedTicket.student_village}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর পোস্ট অফিসের নাম:
              <br /> {searchedTicket.student_post_office}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম:
              {searchedTicket.student_police_station}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর পিনকোড:
              <br /> {searchedTicket.student_pin_code}
            </h6>
            <h6 className="text-center col-md-3">
              ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী:
              {searchedTicket.student_addmission_class}
            </h6>
            <h6 className="text-center col-md-3">
              ফর্ম জমা দেওয়ার তারিখ:
              {DateValueToSring(searchedTicket.student_addmission_dateAndTime)}
            </h6>
            {searchedTicket.student_previous_class !== "" && (
              <div className="row">
                <h6 className="text-center col-md-3">
                  ছাত্র/ছাত্রীর পূর্বের শ্রেণী:
                  <br />
                  {searchedTicket.student_previous_class}
                </h6>
                <h6 className="text-center col-md-3">
                  ছাত্র/ছাত্রীর পূর্বের বর্ষ:
                  <br />
                  {searchedTicket.student_previous_class_year}
                </h6>
                <h6 className="text-center col-md-3">
                  ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের ঠিকানা:
                  <br />
                  {searchedTicket.student_previous_school}
                </h6>
              </div>
            )}
          </div> */}
        </div>
      )}
      {showEditForm && (
        <div className="my-4">
          <h6 className="text-danger">* চিহ্ন দেওয়া অংশগুলি আবশ্যিক।</h6>
          <h6 className="text-danger">
            *** যে অংশগুলি বাংলায় বলা আছে শুধুমাত্র সেইগুলিই বাংলায় করবেন বাকি
            সমস্ত অংশ ইংরাজীতে লিখবেন।
          </h6>
          <h6 className="text-danger ben">
            ** অনুগ্রহ করে ফর্ম ফিলাপের সময় আপনার ছাত্র/ছাত্রীর সমস্ত প্রয়োজনীয়
            ডকুমেন্টস আপনার সাথে রাখুন।
          </h6>
          {/* <h6 className="text-danger">
            *** ফর্ম ফিলাপের পর প্রদত্ত টিকিট নাম্বার অবশ্যই আপনার কাছে সংরক্ষিত
            রাখবেন।
          </h6> */}

          <div className="my-4">
            <h3 className="text-primary">UPDATE ADMISSION FORM</h3>
          </div>
          <div className="text-center text-black">
            <form
              action=""
              method="post"
              className="row mx-auto"
              autoComplete="off"
              onSubmit={updateData}
            >
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_beng_name}
                  placeholder="ছাত্র/ছাত্রীর বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর ইংরাজীতে নাম*
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_eng_name}
                  placeholder="ছাত্র/ছাত্রীর ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জন্ম তারিখ*</label>
                <input
                  type="date"
                  className="form-control"
                  id="student_birthday"
                  name="student_birthday"
                  placeholder="ছাত্র/ছাত্রীর জন্ম তারিখ"
                  defaultValue={getCurrentDateInput(
                    editInputField.student_birthday
                  )}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_birthday: getSubmitDateInput(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর আধার নাম্বার</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_aadhaar}
                  placeholder="ছাত্র/ছাত্রীর আধার নাম্বার"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_aadhaar: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর লিঙ্গ*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_gender"
                  defaultValue={editInputField.student_gender}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_gender: e.target.value,
                    });
                  }}
                >
                  <option value="">লিঙ্গ বেছে নিন</option>
                  <option value={"BOYS"}>ছেলে</option>
                  <option value={"GIRLS"}>মেয়ে</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errEditInputField.student_gender.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_gender}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের মোবাইল নাম্বার*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={10}
                  value={editInputField.student_mobile}
                  placeholder="অভিভাবকের মোবাইল নাম্বার"
                  className="form-control"
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_mobile: setInputNumberMaxLength(
                        e.target.value,
                        10
                      ),
                    });
                  }}
                />
                {errEditInputField.student_mobile.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_mobile}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.father_beng_name}
                  placeholder="পিতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      father_beng_name: e.target.value,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.father_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.father_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">পিতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.father_eng_name}
                  placeholder="পিতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      father_eng_name: e.target.value,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.father_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.father_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.mother_beng_name}
                  placeholder="মাতার বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      mother_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.mother_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.mother_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">মাতার ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.mother_eng_name}
                  placeholder="মাতার ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      mother_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.mother_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.mother_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের বাংলায় নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.guardian_beng_name}
                  placeholder="অভিভাবকের বাংলায় নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      guardian_beng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.guardian_beng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.guardian_beng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">অভিভাবকের ইংরাজীতে নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.guardian_eng_name}
                  placeholder="অভিভাবকের ইংরাজীতে নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      guardian_eng_name: e.target.value,
                    })
                  }
                />
                {errEditInputField.guardian_eng_name.length > 0 && (
                  <span className="error">
                    {errEditInputField.guardian_eng_name}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর ধর্ম*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_religion"
                  defaultValue={editInputField.student_religion}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_religion: e.target.value,
                    });
                  }}
                >
                  <option value="">ধর্ম বেছে নিন</option>
                  <option value={"HINDU"}>হিন্দু</option>
                  <option value={"ISLAM"}>ইসলাম</option>
                  <option value={"OTHER"}>অন্যান্য</option>
                </select>
                {errEditInputField.student_religion.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_religion}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর জাতি*</label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_race"
                  defaultValue={editInputField.student_race}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_race: e.target.value,
                    });
                  }}
                >
                  <option value="">জাতি বেছে নিন</option>
                  <option value={"GENERAL"}>GENERAL</option>
                  <option value={"OBC-A"}>OBC-A</option>
                  <option value={"OBC-B"}>OBC-B</option>
                  <option value={"SC"}>SC</option>
                  <option value={"ST"}>ST</option>
                </select>
                {errEditInputField.student_race.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_race}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রী বি.পি.এল. কিনা? *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_bpl_status"
                  defaultValue={editInputField.student_bpl_status}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_bpl_status: e.target.value,
                    });
                    if (e.target.value === "NO") {
                      setEditInputField({
                        ...editInputField,
                        student_bpl_status: e.target.value,
                        student_bpl_number: "",
                      });
                    }
                  }}
                >
                  <option value="">বি.পি.এল. কিনা?</option>
                  <option value={"YES"}>হ্যাঁ</option>
                  <option value={"NO"}>না</option>
                </select>
              </div>
              {inputField.student_bpl_status === "YES" && (
                <div className="mb-3 col-md-4">
                  <label className="form-label">
                    অভিভাবকের বি.পি.এল. নাম্বার *
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={editInputField.student_bpl_number}
                    placeholder="অভিভাবকের বি.পি.এল. নাম্বার"
                    className="form-control"
                    onChange={(e) =>
                      setEditInputField({
                        ...editInputField,
                        student_bpl_number: e.target.value,
                      })
                    }
                  />
                  {errEditInputField.student_bpl_number.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_bpl_number}
                    </span>
                  )}
                </div>
              )}
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর গ্রামের নাম*</label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_village}
                  placeholder="ছাত্র/ছাত্রীর গ্রামের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_village: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_village.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_village}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পোস্ট অফিসের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_post_office}
                  placeholder="ছাত্র/ছাত্রীর পোস্ট অফিসের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_post_office: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_post_office.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_post_office}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">
                  ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম *
                </label>
                <input
                  type="text"
                  name=""
                  id=""
                  value={editInputField.student_police_station}
                  placeholder="ছাত্র/ছাত্রীর পুলিশ স্টেশনের নাম"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_police_station: e.target.value,
                    })
                  }
                />
                {errEditInputField.student_police_station.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_police_station}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4">
                <label className="form-label">ছাত্র/ছাত্রীর পিনকোড*</label>
                <input
                  type="number"
                  name=""
                  id=""
                  maxLength={6}
                  value={editInputField.student_pin_code}
                  placeholder="ছাত্র/ছাত্রীর পিনকোড"
                  className="form-control"
                  onChange={(e) =>
                    setEditInputField({
                      ...editInputField,
                      student_pin_code: setInputNumberMaxLength(
                        e.target.value,
                        6
                      ),
                    })
                  }
                />
                {errEditInputField.student_pin_code.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_pin_code}
                  </span>
                )}
              </div>
              <div className="mb-3 col-md-4  mx-auto">
                <label className="form-label">
                  ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী *
                </label>
                <select
                  className="form-select"
                  aria-label=".form-select-sm example"
                  required
                  id="student_addmission_class"
                  defaultValue={editInputField.student_addmission_class}
                  onChange={(e) => {
                    setEditInputField({
                      ...editInputField,
                      student_addmission_class: e.target.value,
                    });
                  }}
                >
                  <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                  <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                  <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                  <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                  <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                </select>
                {errEditInputField.student_addmission_class.length > 0 && (
                  <span className="error">
                    {errEditInputField.student_addmission_class}
                  </span>
                )}
              </div>
              <hr className="text-danger" />
              <p className="text-danger">
                *** এই অংশ যদি ছাত্র/ছাত্রী অন্য স্কুল থেকে ট্রান্সফার নিয়ে আসে
                সেটির জন্য
              </p>
              <div
                className="rounded rounded-2 p-2 m-2 row"
                style={{ backgroundColor: "pink" }}
              >
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের শ্রেণী *
                  </label>
                  <select
                    className="form-select"
                    aria-label=".form-select-sm example"
                    required
                    id="student_previous_class"
                    defaultValue={editInputField.student_previous_class}
                    onChange={(e) => {
                      setEditInputField({
                        ...editInputField,
                        student_previous_class: e.target.value,
                      });
                    }}
                  >
                    <option value="FIRST TIME ADDMISSION">
                      শ্রেণী বেছে নিন
                    </option>
                    <option value={"PRE PRIMARY"}>প্রাক প্রাথমিক</option>
                    <option value={"CLASS I"}>প্রথম শ্রেনী</option>
                    <option value={"CLASS II"}>দ্বিতীয় শ্রেনী</option>
                    <option value={"CLASS III"}>তৃতীয় শ্রেনী</option>
                    <option value={"CLASS IV"}>চতুর্থ শ্রেনী</option>
                  </select>
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বর্ষ *
                  </label>
                  <input
                    type="number"
                    name=""
                    id=""
                    value={editInputField.student_previous_class_year}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বর্ষ"
                    className="form-control"
                    onChange={(e) =>
                      setEditInputField({
                        ...editInputField,
                        student_previous_class_year: e.target.value,
                      })
                    }
                  />
                  {errEditInputField.student_previous_class_year.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_previous_class_year}
                    </span>
                  )}
                </div>
                <div className="mb-3 col-md-6 mx-auto">
                  <label className="form-label">
                    ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের ঠিকানা *
                  </label>

                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="7"
                    value={editInputField.student_previous_school}
                    placeholder="ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের ঠিকানা"
                    className="form-control"
                    onChange={(e) =>
                      setEditInputField({
                        ...editInputField,
                        student_previous_school: e.target.value,
                      })
                    }
                  ></textarea>
                  {errEditInputField.student_previous_school.length > 0 && (
                    <span className="error">
                      {errEditInputField.student_previous_school}
                    </span>
                  )}
                </div>
              </div>
              <hr className="text-danger" />
              <div className="mb-3 col-md-4 mx-auto">
                <button
                  type="submit"
                  className="btn btn-success m-2"
                  onClick={updateData}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="btn btn-danger m-2"
                  onClick={() => {
                    setEditInputField({
                      id: "",
                      student_beng_name: "",
                      student_eng_name: "",
                      father_beng_name: "",
                      father_eng_name: "",
                      mother_beng_name: "",
                      mother_eng_name: "",
                      guardian_beng_name: "",
                      guardian_eng_name: "",
                      student_birthday: ``,
                      student_gender: "",
                      student_mobile: "",
                      student_aadhaar: "",
                      student_religion: "",
                      student_race: "",
                      student_bpl_status: "",
                      student_bpl_number: "",
                      student_village: "",
                      student_post_office: "",
                      student_police_station: "",
                      student_pin_code: "",
                      student_addmission_class: "",
                      student_previous_class: "",
                      student_previous_class_year: "",
                      student_previous_school: "",
                      student_addmission_date: "",
                      student_addmission_dateAndTime: "",
                    });
                    setShowEditForm(false);
                    if (typeof window !== undefined) {
                      document.getElementById("student_gender").value = "";
                      document.getElementById(
                        "student_birthday"
                      ).value = `01-01-${new Date().getFullYear() - 5}`;
                      document.getElementById("student_religion").value = "";
                      document.getElementById("student_race").value = "";
                      document.getElementById("student_bpl_status").value = "";
                      document.getElementById(
                        "student_addmission_class"
                      ).value = "";
                      document.getElementById("student_previous_class").value =
                        "FIRST TIME ADDMISSION";
                    }
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
