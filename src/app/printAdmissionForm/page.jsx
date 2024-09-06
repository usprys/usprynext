"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/Store";
import schoolLogo from "@/../public/assets/images/logoweb.png";
import Image from "next/image";
import useWindowSize from "@rooks/use-window-size";
import Ramij from "./ramij.json";
export default function PrintAddmissionForm() {
  const { stateObject } = useGlobalContext();
  const { innerWidth } = useWindowSize();
  const {
    id,
    student_beng_name,
    student_eng_name,
    father_beng_name,
    father_eng_name,
    mother_beng_name,
    mother_eng_name,
    guardian_beng_name,
    guardian_eng_name,
    student_birthday,
    student_gender,
    student_mobile,
    student_aadhaar,
    student_religion,
    student_race,
    student_bpl_status,
    student_bpl_number,
    student_village,
    student_post_office,
    student_police_station,
    student_pin_code,
    student_addmission_class,
    student_previous_class,
    student_previous_class_year,
    student_previous_school,
    student_addmission_date,
    student_addmission_dateAndTime,
  } = Ramij;
  const scrWidth = (w) => (w * innerWidth) / 100;
  useEffect(() => console.log(Ramij));
  return (
    <div className="container ben">
      <div className="d-flex flex-column justify-content-start align-items-start">
        <div className="mx-auto d-flex justify-content-between align-items-center">
          <Image
            // src="https://raw.githubusercontent.com/usprys/usprysdata/main/logoweb.png"
            src={schoolLogo}
            alt="LOGO"
            style={{ width: 100, height: 100 }}
          />
          <div>
            <h className="mx-4 fw-bold" style={{ fontSize: 35 }}>
              উত্তর সেহাগড়ী প্রাথমিক বিদ্যালয়
            </h>
            <h6 className="text-center my-1">
              গ্রামঃ সেহাগড়ি, পোঃ- খড়িয়প, থানা- জয়পুর, জেলা- হাওড়া, পিন- ৭১১৪০১,
              আমতা পশ্চিমচক্র
            </h6>
          </div>
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?data=UTTAR SEHAGORI PRIMARY SCHOOL: STUDENT NAME:${" "}${student_eng_name}, Father's name:${" "}${father_eng_name},Mother's name:${" "}${mother_eng_name}, Mobile Number:${" "}${student_mobile}, Gender:${" "}${student_gender},  Addmission Class:${" "} ${student_addmission_class}, Application Number:${" "} ${id}, Application Date:${" "} ${student_addmission_date}`}
            className="m-0 p-0"
            width={100}
            height={100}
            alt="QRCode"
          />
        </div>
        <h2 className="mx-auto text-center ben my-2">
          ভর্তির আবেদন পত্র (Online Admission)
        </h2>

        <div className="my-3 d-flex flex-column justify-content-start align-items-start">
          <h5>
            ছাত্র / ছাত্রীর নাম (বাংলায়):{" "}
            <span
              style={{
                textDecoration: "underline 1px dotted",
                textUnderlineOffset: 6,
              }}
            >
              {student_beng_name}
            </span>
          </h5>
          <h5 style={{ marginLeft: scrWidth(8.5) }}>
            (ইংরাজীতে):{" "}
            <span
              style={{
                textDecoration: "underline 1px dotted",
                textUnderlineOffset: 6,
              }}
            >
              {student_eng_name}
            </span>
          </h5>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5>
              জন্ম তারিখ:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_birthday}
              </span>
            </h5>
            <h5 className="ml-5">
              আধার নং:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_aadhaar}
              </span>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}
