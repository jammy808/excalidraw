import React from 'react';

const DrawingRoomSkeleton = () => {
  return (
    <div className="rounded-lg p-6 h-[200px] bg-gray-900/50 border border-gray-800 flex flex-col justify-between animate-pulse">
      {/* Title */}
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-gray-800 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-800 rounded"></div>
      </div>
      
      {/* Bottom section */}
      <div className="flex justify-between">
        {/* Avatar circles */}
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full bg-gray-800"></div>
          <div className="h-8 w-8 rounded-full bg-gray-800"></div>
          <div className="h-8 w-8 rounded-full bg-gray-800"></div>
        </div>
        
        {/* Room number */}
        <div className="h-6 w-16 rounded-full bg-gray-800"></div>
      </div>
    </div>
  );
};

export default DrawingRoomSkeleton;
