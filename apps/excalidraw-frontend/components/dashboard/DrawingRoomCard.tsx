import React from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

interface DrawingRoomCardProps {
  id: string;
  name: string;
  participants: number;
}

const DrawingRoomCard = ({ id, name, participants }: DrawingRoomCardProps) => {
  const router = useRouter();
  
  // Generate a random gradient for each card
  const gradients = [
    'from-purple-800 to-indigo-900',
    'from-blue-800 to-purple-900',
    'from-indigo-800 to-blue-900',
    'from-violet-800 to-purple-900'
  ];
  
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
  
  const handleClick = () => {
    router.push(`/canvas/${id}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className={`rounded-lg p-6 cursor-pointer h-[200px] flex flex-col justify-between bg-gradient-to-br ${randomGradient} hover:scale-[1.02] transition-transform`}
    >
      <div className="space-y-2">
        <h3 className="font-medium text-lg">{name}</h3>
        <div className="flex items-center gap-1 text-gray-200">
          <Users size={16} />
          <span className="text-sm">{participants} participants</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {[...Array(Math.min(participants, 3))].map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-medium"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {participants > 3 && (
            <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-medium">
              +{participants - 3}
            </div>
          )}
        </div>
        
        <div className="bg-white/10 rounded-full px-3 py-1 text-xs">
          Room #{id}
        </div>
      </div>
    </div>
  );
};

export default DrawingRoomCard;