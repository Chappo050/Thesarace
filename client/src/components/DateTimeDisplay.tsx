import React, { useRef } from 'react';

const DateTimeDisplay = ({ value, type} : any) => {
  const myTimer = useRef(null)
  return (
    <div >
      <p className=' md:text-xl sm:text-lg lg:text-2xl text-sm' id="Timer" ref={myTimer}>{value}</p>
    </div>
  );
};

export default DateTimeDisplay;
