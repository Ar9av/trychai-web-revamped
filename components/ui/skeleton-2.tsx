import React from "react";

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded ${className}`}
      style={{ minWidth: "50px", minHeight: "10px" }}
    ></div>
  );
}

export default Skeleton;
