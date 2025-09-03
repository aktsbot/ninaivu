import logger from "./logger.js";

export const patientMessageDays = [
  {
    text: "Monday",
    value: "monday",
    id: 1,
  },
  {
    text: "Tuesday",
    value: "tuesday",
    id: 2,
  },
  {
    text: "Wednesday",
    value: "wednesday",
    id: 3,
  },
  {
    text: "Thursday",
    value: "thursday",
    id: 4,
  },
  {
    text: "Friday",
    value: "friday",
    id: 5,
  },
  {
    text: "Saturday",
    value: "saturday",
    id: 6,
  },
  {
    text: "Sunday",
    value: "sunday",
    id: 7,
  },
];

export const mobileNumberOperatorList = [
  "airtel",
  "bsnl",
  "jio",
  "vodafone",
  "idea",
  "mtnl",
];

export const startOfDay = (inputDate) => {
  const date = new Date(inputDate);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (inputDate) => {
  const date = new Date(inputDate);
  date.setUTCHours(23, 59, 59, 999);
  return date;
};

// https://stackoverflow.com/questions/3552461/how-do-i-format-a-date-in-javascript
export const formattedDate = ({ date, addTime }) => {
  const d = new Date(date);
  var dateString =
    ("0" + d.getDate()).slice(-2) +
    "-" +
    ("0" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    d.getFullYear();

  if (addTime) {
    dateString +=
      " " +
      ("0" + d.getHours()).slice(-2) +
      ":" +
      ("0" + d.getMinutes()).slice(-2);
  }

  // 16-05-2015 09:50
  return dateString;
};

export const makeReportRow = (d) => {
  return {
    for_date: formattedDate({ date: d.forDate }),
    last_updated_at: formattedDate({ date: d.updatedAt, addTime: true }),
    patient_id: d.patient.patientId,
    patient_name: d.patient.name,
    patient_mobile_numbers: d.mobileNumbers.replace(/,/g, "\n"),
    message: d.messageText,
    message_notes: d.message ? d.message.notes : "",
    sender: d.sender ? d.sender.fullName : "",
    status: d.status,
  };
};

export const makeReportJSON = (data) => {
  const rows = [];
  /*
   * {
   *    for_date: '',
   *    last_updated_date: '',
   *    patient_id: '',
   *    patient_name: '',
   *    patient_mobile_numbers: '',
   *    message: '',
   *    sender: '',
   *    status: ''
   * }
   *
   */
  for (const d of data) {
    const r = makeReportRow(d);
    rows.push(r);
  }

  return rows;
};
