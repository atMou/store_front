import React from "react";

function Logo() {
  return (
    <div className="flex justify-center items-center ">
      <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-sm overflow-hidden">
        <div className="w-0 h-0 border-t-10 border-t-transparent border-l-16 border-l-white border-b-10 border-b-transparent ml-0.5 animate-[slideInSpin_1s_ease-in-out]"></div>
      </div>
    </div>
  );
}

export default Logo;
