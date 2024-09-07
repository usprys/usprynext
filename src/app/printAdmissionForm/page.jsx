"use client";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/Store";
import schoolLogo from "@/../public/assets/images/logoweb.png";
import Image from "next/image";
import useWindowSize from "@rooks/use-window-size";
import Ramij from "./ramij.json";
import { SCHOOLBENGALIADDRESS, SCHOOLBENGALINAME } from "@/modules/constants";
import { useRouter } from "next/navigation";
import { usePDF } from "react-to-pdf";
export default function PrintAddmissionForm() {
  const { stateObject } = useGlobalContext();
  const { innerWidth } = useWindowSize();
  const router = useRouter();
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
  } = stateObject;
  const date = new Date(student_addmission_dateAndTime);
  const scrWidth = (w) => (w * innerWidth) / 100;

  const { toPDF, targetRef } = usePDF({
    filename: `Apllication Form of ${student_eng_name}.pdf`,
  });
  useEffect(() => {
    document.title = `Apllication Form of ${student_eng_name}`;
    toPDF();
    router.push("/admission");
  }, []);
  return (
    <div className="container-fluid ben" ref={targetRef}>
      <div className="d-flex flex-column justify-content-start align-items-start flex-wrap">
        <div className="mx-auto d-flex justify-content-between align-items-center">
          <Image
            // src="https://raw.githubusercontent.com/usprys/usprysdata/main/logoweb.png"
            src={schoolLogo}
            alt="LOGO"
            style={{ width: 100, height: 100 }}
          />
          <div>
            <h3 className="mx-4 fw-bold" style={{ fontSize: 35 }}>
              {SCHOOLBENGALINAME}
            </h3>
            <h6 className="text-center my-1">{SCHOOLBENGALIADDRESS}</h6>
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

        <div className="mx-auto">
          <div className="d-flex justify-content-around my-1 timesFont">
            <h5>
              Application Form No.:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {id}
              </span>
            </h5>
            <h5>&nbsp;&nbsp;&nbsp;&nbsp;</h5>

            <h5>
              Application Date:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {`${date.getDate()}-${date.getMonth()}-${date.getFullYear()} At ${
                  date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
                }:${date.getMinutes()}:${date.getSeconds()} ${
                  date.getHours() > 12 ? "PM" : "AM"
                }`}
              </span>
            </h5>
          </div>
          <div className="d-flex justify-content-around my-1">
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
            <h5>&nbsp;&nbsp;&nbsp;&nbsp;</h5>

            <h5>
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
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5 className="text-start">
              অভিভাবকের মোবাইল নাম্বার:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_mobile}
              </span>
            </h5>

            <h5>
              ছাত্র/ছাত্রীর লিঙ্গ:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_gender}
              </span>
            </h5>
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5 className="text-start">
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

            <h5>
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
          <div className="d-flex justify-content-around my-1">
            <h5>
              পিতার নাম (বাংলায়):{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {father_beng_name}
              </span>
            </h5>

            <h5>
              (ইংরাজীতে):{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {father_eng_name}
              </span>
            </h5>
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5>
              মাতার নাম (বাংলায়):{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {mother_beng_name}
              </span>
            </h5>

            <h5>
              (ইংরাজীতে):{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {mother_eng_name}
              </span>
            </h5>
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5>
              অভিভাবকের নাম (বাংলায়):{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {guardian_beng_name}
              </span>
            </h5>

            <h5>
              (ইংরাজীতে):{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {guardian_eng_name}
              </span>
            </h5>
          </div>

          <div className="d-flex justify-content-around my-1">
            <h5>
              ছাত্র/ছাত্রীর ধর্ম:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_religion}
              </span>
            </h5>

            <h5>
              ছাত্র/ছাত্রীর জাতি:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_race}
              </span>
            </h5>
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5>
              ছাত্র/ছাত্রী বি.পি.এল. কিনা?:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_bpl_status}
              </span>
            </h5>
            {student_bpl_status === "YES" && (
              <h5>
                অভিভাবকের বি.পি.এল. নাম্বার:{" "}
                <span
                  style={{
                    textDecoration: "underline 1px dotted",
                    textUnderlineOffset: 6,
                  }}
                >
                  {student_bpl_number}
                </span>
              </h5>
            )}
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5>ছাত্র/ছাত্রীর ঠিকানা: </h5>
            <h5>&nbsp;&nbsp;</h5>
            <span
              style={{
                textDecoration: "underline 1px dotted",
                textUnderlineOffset: 6,
              }}
            >
              Vill.: {student_village},P.O.: {student_post_office},P.S.:{" "}
              {student_police_station}, PIN:{student_pin_code}
            </span>
          </div>
          <div className="d-flex justify-content-around my-1">
            <h5>
              ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী:{" "}
              <span
                style={{
                  textDecoration: "underline 1px dotted",
                  textUnderlineOffset: 6,
                }}
              >
                {student_addmission_class}
              </span>
            </h5>
          </div>
          {student_previous_class !== "" && (
            <div className="d-flex justify-content-around my-1">
              <h5>
                ছাত্র/ছাত্রীর পূর্বের শ্রেণী:{" "}
                <span
                  style={{
                    textDecoration: "underline 1px dotted",
                    textUnderlineOffset: 6,
                  }}
                >
                  {student_previous_class}
                </span>
              </h5>
              <h5>
                ছাত্র/ছাত্রীর পূর্বের বর্ষ:{" "}
                <span
                  style={{
                    textDecoration: "underline 1px dotted",
                    textUnderlineOffset: 6,
                  }}
                >
                  {student_previous_class_year}
                </span>
              </h5>
            </div>
          )}
          {student_previous_class !== "" && (
            <div className="d-flex justify-content-around my-1">
              <h5>
                ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা:{" "}
                <h6
                  style={{
                    textDecoration: "underline 1px dotted",
                    textUnderlineOffset: 4,
                  }}
                >
                  {student_previous_school}
                </h6>
              </h5>
            </div>
          )}
          <button
            className="btn btn-primary m-2 noprint"
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.print();
              }
            }}
          >
            Print Form
          </button>
          <button
            className="btn btn-danger m-2 noprint"
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                router.back();
              }
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
