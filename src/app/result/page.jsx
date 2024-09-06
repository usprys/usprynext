"use client";
import React, { useEffect } from "react";
import resultData from "../../../db/resultp2.json";
export default function Result() {
  useEffect(() => {}, []);
  return (
    <div className="container ben text-center">
      <h1 className="text-center">UTTAR SEHAGORI PRIMARY SCHOOL</h1>
      <h1 className="text-center">Second Summative Examination 2024 Result</h1>
      <div className="d-flex">
        <div className="row justify-content-center align-items-center flex-wrap ">
          {resultData.map((item, index) => (
            <div
              className="col-md-4 m-2 p-2 d-flex flex-column justify-content-start align-items-center nobreak"
              key={index}
              style={{
                width: "200px",
                height:
                  item.class === "PP"
                    ? "230px"
                    : item.class === "CLASS III" || item.class === "CLASS IV"
                    ? "300px"
                    : "275px",
                margin: "5px",
                border: "1px solid black",
                borderRadius: "10px",
              }}
            >
              <h6>{item.name}</h6>
              <h6> {item.class}</h6>
              <h6>Roll: {item.roll}</h6>
              {/* <h6>Student ID: {item.student_id}</h6> */}
              <h6 className="text-decoration-underline">প্রাপ্ত নম্বর</h6>
              {item.class === "PP" ? (
                <div>
                  <h6>বাংলা: {item.s1}</h6>
                  <h6>ইংরাজী: {item.s2}</h6>
                  <h6>গণিত: {item.s3}</h6>
                  <h6>মোট প্রাপ্ত নম্বর: {item.total}</h6>
                  <h6>শতকরা: {item.percent}%</h6>
                  <h6>গ্রেড: {item.grade}</h6>
                </div>
              ) : item.class === "CLASS I" || item.class === "CLASS II" ? (
                <div>
                  <h6>সংযোগ স্থাপনে সক্ষমতা: {item.s1}</h6>
                  <h6>সমন্বয় সাধনে সক্ষমতা: {item.s2}</h6>
                  <h6>সমস্যা সমাধানে সক্ষমতা: {item.s3}</h6>
                  <h6>মানসিক ও শারীরিক সমন্বয় সাধন: {item.s4}</h6>
                  <h6>হাতের কাজ: {item.s5}</h6>
                  <h6>মোট প্রাপ্ত নম্বর: {item.total}</h6>
                  <h6>শতকরা: {item.percent}%</h6>
                  <h6>গ্রেড: {item.grade}</h6>
                </div>
              ) : item.class === "CLASS III" || item.class === "CLASS IV" ? (
                <div>
                  <h6>বাংলা: {item.s1}</h6>
                  <h6>ইংরাজী: {item.s2}</h6>
                  <h6>গণিত: {item.s3}</h6>
                  <h6>আমাদের পরিবেশ: {item.s4}</h6>
                  <h6>স্বাস্থ্য ও শারীরশিক্ষা: {item.s5}</h6>
                  <h6>হাতের কাজ: {item.s6}</h6>
                  <h6>মোট প্রাপ্ত নম্বর: {item.total}</h6>
                  <h6>শতকরা: {item.percent}%</h6>
                  <h6>গ্রেড: {item.grade}</h6>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
