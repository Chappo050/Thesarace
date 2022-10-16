import { useCountdown } from "../hooks/useCountdown";
import DateTimeDisplay from "../components/DateTimeDisplay";
import React, { forwardRef, useRef, useState } from "react";

const CountdownTimer = forwardRef(({ time, timerRef, start }: any) => {
  const [days, hours, minutes, seconds] = useCountdown(time, start);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div className="font-extrabold underline underline-offset-2 pt-10">
        <i ref={timerRef}> 0</i>
      </div>
    );
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
});

const ShowCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="show-counter grid grid-cols-3">
      <p></p>
      <div className="grid grid-cols-3 p-10 font-bold">
        <DateTimeDisplay value={minutes} />
        <p>:</p>
        <DateTimeDisplay value={seconds} />
      </div>
    </div>
  );
};

export default CountdownTimer;
