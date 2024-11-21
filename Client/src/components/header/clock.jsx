import React, { useState, useEffect } from "react";
// Uncomment if using a date library
// import moment from "moment"; // OR import dayjs from "dayjs";

const LiveClock = () => {

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Format date and time: DD/MM/YY HH:MM:SS
  const formattedTime = `${currentTime
    // .getDate()
    // .toString()
    // .padStart(2, "0")}/${(currentTime.getMonth() + 1)
    // .toString()
    // .padStart(2, "0")}/${currentTime
    // .getFullYear()
    // .toString()
    // .slice(2)} ${currentTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${currentTime
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  // Alternative: Use a date library (e.g., Moment.js or Day.js)
  // const formattedTime = moment(currentTime).format("DD/MM/YY HH:mm:ss");

  return (
    <div style={{ fontSize: "0.9rem", fontWeight: "bold"}}>
      {formattedTime}
    </div>
  );
};

export default LiveClock;
