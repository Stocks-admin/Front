import React from "react";

const TableSkeleton: React.FC = () => {
  return (
    <div role="status" className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <div className="rounded-full w-full h-14 bg-gray-200 flex items-center px-3 justify-between my-0">
          <div className="rounded-full h-7 w-7 bg-gray-400"></div>
          <div className="rounded-full h-7 w-32 bg-gray-400"></div>
          <div className="rounded-full h-7 w-16 bg-gray-400"></div>
          <div className="rounded-full h-7 w-10 bg-gray-400"></div>
          <div className="rounded-full h-7 w-10 bg-gray-400"></div>
          <div className="rounded-full h-7 w-10 bg-gray-400"></div>
          <div className="rounded-full h-7 w-10 bg-gray-400"></div>
          <div className="rounded-full h-7 w-10 bg-gray-400"></div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TableSkeleton;
