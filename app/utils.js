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

export const startOfDay = (_date) => {
  const date = new Date(_date);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

export const endOfDay = (_date) => {
  const date = new Date(_date);
  date.setUTCHours(23, 59, 59, 999);
  return date;
};
