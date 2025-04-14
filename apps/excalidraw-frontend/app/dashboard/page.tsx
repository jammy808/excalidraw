'use client'

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, Plus, Users, X } from 'lucide-react';
import DrawingRoomCard from '@/components/dashboard/DrawingRoomCard';
import DrawingRoomSkeleton from '@/components/dashboard/DrawingRoomSkeleton';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '@/config';
import { auth } from '@/app/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Dashboard = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Array<{id: string, slug: string}>>([]);
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomIdToJoin, setRoomIdToJoin] = useState('');

  const getRooms = async () => {
    try {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.push("/signin");
          return;
        }
  
        const token = await user.getIdToken();
        console.log("Token:", token);
  
        const res = await fetch(`${BACKEND_URL}/getAllRooms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const rooms = await res.json();
        console.log(rooms);
        setRooms(rooms);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleCreateRoom = async () => {

    try{
      const token = await auth.currentUser?.getIdToken();

      const res = await fetch(`${BACKEND_URL}/room` , {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name : newRoomName
        }),
      })
      
      const room = await res.json();

      if (res.ok) {
        setRooms([...rooms, room]);
        setNewRoomName('');
        setCreateDialogOpen(false);
        console.log('Room created:', newRoomName);
      }

    } catch(err){
      console.log("room creation failed" , err);
    }
  };

  const handleJoinRoom = () => {
    if (roomIdToJoin.trim()) {
      // In a real app, you would validate the room ID and join it
      console.log('Joining room with ID:', roomIdToJoin);
      setRoomIdToJoin('');
      setJoinDialogOpen(false);

      router.push(`/canvas/${roomIdToJoin}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1A1A1A]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={24} className="text-purple-500" />
            <h1 className="text-xl font-bold">DoodleSync</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-900/20 hover:text-red-500"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Your Drawing Rooms</h2>
          <button 
            onClick={() => setJoinDialogOpen(true)}
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Join Room</span>
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Skeleton loading states
            <>
              <DrawingRoomSkeleton />
              <DrawingRoomSkeleton />
              <DrawingRoomSkeleton />
            </>
          ) : (
            <>
              {rooms.length > 0 && rooms.map(room => (
                <DrawingRoomCard 
                  key={room.id}
                  id={room.id}
                  name={room.slug}
                  participants={0}
                />
              ))}
              
              {/* Create room card */}
              <div 
                onClick={() => setCreateDialogOpen(true)}
                className="border border-dashed border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center h-[200px] bg-gray-900/30 hover:bg-gray-800/40 transition-colors cursor-pointer"
              >
                <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-purple-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Create New Room</h3>
                <p className="text-gray-400 text-sm text-center">Start a new drawing session</p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Create Room Dialog */}
      {createDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create a New Room</h2>
              <button 
                onClick={() => setCreateDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Give your drawing room a name to get started.
            </p>
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setCreateDialogOpen(false)}
                className="px-4 py-2 rounded-md text-sm hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateRoom}
                className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md text-sm"
                disabled={!newRoomName.trim()}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Dialog */}
      {joinDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Join a Room</h2>
              <button 
                onClick={() => setJoinDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Enter the room ID to join an existing drawing session.
            </p>
            <input
              value={roomIdToJoin}
              onChange={(e) => setRoomIdToJoin(e.target.value)}
              placeholder="Enter room ID"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setJoinDialogOpen(false)}
                className="px-4 py-2 rounded-md text-sm hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleJoinRoom}
                className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md text-sm"
                disabled={!roomIdToJoin.trim()}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;