
import React, { useEffect, useState } from "react";
import VideoList from "./VideoList";
const API_URL = "/api/v1/api/rest/video/PAGINATE";


const Board = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/api/rest/video/PAGINATE', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, limit: 10 })
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
       
        const data = await response.json();
        setVideos(data.list || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;

  return (
    <div className="flex justify-center flex-col items-center">
     <section className="grid grid-cols-[auto_1fr_auto] items-center ml-10 px-5 w-[90%] text-white">
  

  <div className="flex gap-6">
    <span className="text-[16px] text-[#666666] font-thin">#</span>
    <h4 className="text-[16px] text-[#666666] font-thin">Title</h4>
  </div>

  
  <div className="flex justify-end">
  <h4 className="text-[16px]  text-[#666666] font-thin text-center w-[70%]">Author</h4>
  </div>

 
  <h4 className="text-[16px] text-[#666666] font-thin">Most Like</h4>

</section>


      <main className="w-[93%]">
        <VideoList />
        // code for dynamic loading
        {/* {videos.length === 0 ? (
          <p className="text-white text-center">No videos found.</p>
        ) : (
          videos.map((video, index) => (
            <div key={video.id} className="flex border border-gray-500 rounded-2xl py-3 items-center">
              <span className="px-4">{index + 1}</span>

          
              {video.thumbnail ? (
                <img src={video.thumbnail} alt="Thumbnail" className="w-16 h-16 object-cover rounded-md" />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded-md"></div>
              )}

          
              <div className="flex items-center gap-2">
                {video.authorAvatar ? (
                  <img src={video.authorAvatar} alt="Author" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                )}
                <p className="text-white">{video.author || "Unknown"}</p>
              </div>

           
              <div className="flex items-center gap-2">
                <p className="text-white">{video.likes}</p>
                <img src="/like-icon.png" alt="Likes" className="w-5 h-5" />
              </div>
            </div>
          ))
        )}  */}
      </main>
    </div>
  );
};

export default Board;

