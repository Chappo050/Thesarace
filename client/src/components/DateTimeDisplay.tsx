import React, { useRef } from 'react';

const DateTimeDisplay = ({ value, type} : any) => {
  const myTimer = useRef(null)
  return (
    <div >
      <p id="Timer" ref={myTimer}>{value}</p>
    </div>
  );
};

export default DateTimeDisplay;
