import { useCountdown } from "../hooks/useCountdown";
import DateTimeDisplay from "../components/DateTimeDisplay";
import React, { forwardRef} from "react";

const CountdownTimer = forwardRef(({ time, timerRef, start }: any) => {
  const [days, hours, minutes, seconds] = useCountdown(time, start);

  if (days + hours + minutes + seconds <= 0) {
    return (
      <div className="font-extrabold underline underline-offset-2 pt-10 ">
        <i className="" ref={timerRef}> 0</i>
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
    <div className="show-counter grid grid-cols-dense mx-7 sm:mx-12 md:mx-16 lg:mx-28 xl:mx-36 2xl:mx-52">
      <p></p>
      <div className="grid grid-cols-3 m-10 font-bold">
        <DateTimeDisplay value={minutes} />
        <p className=' md:text-xl sm:text-lg lg:text-2xl text-sm' >:</p>
        <DateTimeDisplay value={seconds} />
      </div>
    </div>
  );
};

export default CountdownTimer;
