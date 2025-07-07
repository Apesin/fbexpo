const axios = require("axios");

class Helpers {
  constructor() {}

  getDateTime() {
    let date = new Date();
    let formattedDate = date.toISOString().slice(0, 19);

    // let hours = date.getHours();
    // let minutes = date.getMinutes();
    // let ampm = hours >= 12 ? "PM" : "AM";

    let dateTime = `${formattedDate}`;
    return dateTime;
  }
  
   getMySQLDateTimeWithTimeZone() {
    let date = new Date();
    
    // Adjust for GMT+1 (60 minutes ahead of UTC)
    date.setMinutes(date.getMinutes() + 60);

    let year = date.getUTCFullYear();
    let month = String(date.getUTCMonth() + 1).padStart(2, '0');
    let day = String(date.getUTCDate()).padStart(2, '0');
    let hours = String(date.getUTCHours()).padStart(2, '0');
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');

    let mysqlDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(mysqlDateTime);
    return mysqlDateTime;
}


  convertToDateTime(dateTime) {
    return new Date(dateTime);
  }


  getMonthDifference(startDate, endDate) {
    let months;
    months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    return months <= 0 ? 0 : months;
  }
  isNumeric(num) {
    return !isNaN(num);
  }
  numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  removeCommaFromNumber(number) {
    return number.split(",").join("");
  }
  generate6DigitRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }

   validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
module.exports = Helpers;
