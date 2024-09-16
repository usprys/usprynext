"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import useWindowSize from "@rooks/use-window-size";
import { useGlobalContext } from "../../context/Store";
import schoolLogo from "@/../public/assets/images/logoweb.png";
import { SCHOOLBENGALIADDRESS, SCHOOLBENGALINAME } from "@/modules/constants";

export default function DownloadAdmissionForm({ data }) {
  const { innerWidth, innerHeight } = useWindowSize();
  const { stateObject } = useGlobalContext();

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
  } = data;
  const date = new Date(student_addmission_dateAndTime);
  const scrWidth = (w) => (w * innerWidth) / 100;
  const scrHeight = (w) => (w * innerHeight) / 100;
  return (
    <Document title={`Apllication Form of ${student_eng_name}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headSection}>
          <Image src={schoolLogo.src} alt="logo" style={{ width: 70 }} />
          <View style={[styles.schView, { width: scrWidth(40) }]}>
            <Text style={styles.schName}>{SCHOOLBENGALINAME}</Text>

            <Text style={styles.schAddress}>{SCHOOLBENGALIADDRESS} </Text>
          </View>

          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?data=UTTAR SEHAGORI PRIMARY SCHOOL: STUDENT NAME:${" "}${student_eng_name}, Father's name:${" "}${father_eng_name},Mother's name:${" "}${mother_eng_name}, Mobile Number:${" "}${student_mobile}, Gender:${" "}${student_gender},  Addmission Class:${" "} ${student_addmission_class}, Application Number:${" "} ${id}, Application Date:${" "} ${student_addmission_date}`}
            style={{ width: 70 }}
            alt="qr-code"
          />
        </View>
        <View style={styles.admView}>
          <Text style={styles.admText}>
            ভর্তির আবেদন পত্র (Online Admission)
          </Text>
          <View style={styles.paraView}>
            <Text style={styles.engparaText}>Application Form No.: {id}</Text>
            <Text style={[styles.engparaText, { paddingLeft: 30 }]}>
              Application Date:{" "}
              {`${date.getDate()}-${date.getMonth()}-${date.getFullYear()} At ${
                date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
              }:${date.getMinutes()}:${date.getSeconds()} ${
                date.getHours() > 12 ? "PM" : "AM"
              }`}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              ছাত্র / ছাত্রীর নাম (বাংলায়): {student_beng_name}
            </Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              (ইংরাজীতে): {student_eng_name}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              অভিভাবকের মোবাইল নাম্বার: {student_mobile}
            </Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              ছাত্র/ছাত্রীর লিঙ্গ: {student_gender}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>জন্ম তারিখ: {student_birthday}</Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              আধার নং: {student_aadhaar}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              পিতার নাম (বাংলায়): {father_beng_name}
            </Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              (ইংরাজীতে): {father_eng_name}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              মাতার নাম (বাংলায়): {mother_beng_name}
            </Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              (ইংরাজীতে): {mother_eng_name}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              অভিভাবকের নাম (বাংলায়): {guardian_beng_name}
            </Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              (ইংরাজীতে): {guardian_eng_name}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              ছাত্র/ছাত্রীর ধর্ম: {student_religion}
            </Text>
            <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
              ছাত্র/ছাত্রীর জাতি: {student_race}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              ছাত্র/ছাত্রী বি.পি.এল. কিনা?: {student_bpl_status}
            </Text>
            {student_bpl_status === "YES" && (
              <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                অভিভাবকের বি.পি.এল. নাম্বার: {student_bpl_number}
              </Text>
            )}
          </View>
          <View
            style={[styles.paraView, { flexWrap: "wrap", width: scrWidth(55) }]}
          >
            <Text style={styles.paraText}>
              ছাত্র/ছাত্রীর ঠিকানা: Vill.: {student_village},P.O.:{" "}
              {student_post_office},P.S.: {student_police_station}, PIN:
              {student_pin_code}
            </Text>
          </View>
          <View style={styles.paraView}>
            <Text style={styles.paraText}>
              ছাত্র/ছাত্রীর বর্তমান ভর্তি হওয়ার শ্রেণী:{" "}
              {student_addmission_class}
            </Text>
          </View>
          {student_previous_class !== "" && (
            <View style={styles.paraView}>
              <Text style={styles.paraText}>
                ছাত্র/ছাত্রীর পূর্বের শ্রেণী: {student_previous_class}
              </Text>
              <Text style={[styles.paraText, { paddingLeft: scrWidth(2) }]}>
                ছাত্র/ছাত্রীর পূর্বের বর্ষ: {student_previous_class_year}
              </Text>
            </View>
          )}
          {student_previous_class !== "" && (
            <View
              style={[
                styles.paraView,
                { flexWrap: "wrap", width: scrWidth(55) },
              ]}
            >
              <Text style={styles.paraText}>
                ছাত্র/ছাত্রীর পূর্বের বিদ্যালয়ের নাম ও ঠিকানা:{" "}
                {student_previous_school}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
// Create styles
const styles = StyleSheet.create({
  page: {
    display: "flex",
    padding: 10,
  },
  headSection: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
  schView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",

    textAlign: "center",
    marginBottom: 20,
  },
  schName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },
  schAddress: {
    fontSize: 10,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },

  admView: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    alignContent: "center",
    textAlign: "center",
    marginTop: 10,
  },
  admText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },
  paraView: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 1,
    alignSelf: "flex-start",
  },
  paraText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    fontFamily: "Kalpurush",
  },
  engparaText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
});
Font.register({
  family: "Kalpurush",
  src: "https://raw.githubusercontent.com/usprys/usprysdata/main/kalpurush.ttf",
});
