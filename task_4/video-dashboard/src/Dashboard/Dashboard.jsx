import React, { useState, useEffect } from "react";
import { CiUser } from "react-icons/ci";
import Board from "./Board";

const API_URL = "http://localhost:3000/v1/api/rest/video/PAGINATE";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/rest/video/PAGINATE', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: 1, limit: 10 })
      });
      const data = await response.json();
      setVideos(data.list);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] overflow-y-auto bg-black">
      <header className="w-[90%] flex justify-between mx-5 items-center">
        <h1 className="text-white text-[48px] p-8 font-bold">App</h1>
        <button className="bg-[#9BFF00] flex items-center px-4 py-1 rounded-3xl">
          <CiUser width={60} height={60} /> <span className="text-[#050505]">Logout</span>
        </button>
      </header>

      <section className="flex justify-between items-center mx-5 mr-20 text-white">
        <h4 className="text-white text-[40px] p-8 font-light">Today’s leaderboard</h4>
        <button className="bg-[#1D1D1D] shadow-md text-white w-auto px-6 py-2 rounded-2xl inline-flex items-center gap-x-1">
          30 May 2022 · <span className="bg-[#9BFF00] text-black px-2 rounded-md">Submissions OPEN</span> · 11:34
        </button>
      </section>
      
      <Board videos={videos} />
    </div>
  );
};

export default Dashboard;
