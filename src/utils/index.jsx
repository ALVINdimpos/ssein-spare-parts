import { notification } from "antd";
import moment from "moment";

// class filters
const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// get network status
const getNetworkStatus = () => {
  return window.navigator.onLine;
};

const dateFormater = (
  value,
  dateFormat = "MMM Do YYYY",
  timeFormat = "hh:mm",
) => {
  return (
    <span className="text-sm">
      {moment(value).format(dateFormat)} at {moment(value).format(timeFormat)}
    </span>
  );
};

// notification
const notificationToast = (message, type, placement, description) => {
  notification[type]({
    message,
    placement,
    description,
  });
};

// decode token function
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// truncate string texts
const truncateString = (word, sliceNo) => {
  if (word.length > sliceNo) {
    return word.slice(0, sliceNo) + " ...";
  }
  return word;
};

const extractFieldFromArray = (array, fieldName) => {
  return array.map((item) => item[fieldName]);
};

const getCountryNameByFlightNumber = (data, flightNumber) => {
  const flight = data.data.find((item) => item.flightNumber === flightNumber);

  if (flight && flight.country && flight.country.countryName) {
    return flight.country.countryName;
  } else {
    return "Country not found";
  }
};

const hasRequiredRole = (user, requiredRoles) =>
  requiredRoles.some((role) => user.roles.includes(role));

export {
  classNames,
  dateFormater,
  getNetworkStatus,
  notificationToast as notification,
  parseJwt,
  truncateString,
  extractFieldFromArray,
  getCountryNameByFlightNumber,
  hasRequiredRole,
};
