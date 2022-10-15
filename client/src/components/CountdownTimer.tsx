import { useCountdown } from "../hooks/useCountdown";
import DateTimeDisplay from "../components/DateTimeDisplay";
import React from "react";

const CountdownTimer = ({ time }: any) => {
  const [days, hours, minutes, seconds] = useCountdown(time);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
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
};

const ExpiredNotice = () => {
    //final score logic stuff in here
  return (
    <div className="font-extrabold underline underline-offset-2">
        <br/>
      <span>Times up!</span>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="show-counter">
        <DateTimeDisplay value={seconds} type={"Seconds"} />
    </div>
  );
};

export default CountdownTimer;