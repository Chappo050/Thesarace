import { useCountdown } from "../hooks/useCountdown";
import DateTimeDisplay from "../components/DateTimeDisplay";
import React, { forwardRef, useRef, useState } from "react";

const CountdownTimer = forwardRef(({ time , timerRef}: any) => {
  const [days, hours, minutes, seconds] = useCountdown(time);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div  className="font-extrabold underline underline-offset-2 pt-10">
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
    <div className="show-counter">
       <DateTimeDisplay value={minutes} />
       <i>:</i>
      <DateTimeDisplay value={seconds}/>
    </div>
  );
};

export default CountdownTimer;
