import { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaArrowUp } from "react-icons/fa6";

const ItemType = { ROW: "row" };

const videoData = [
  { id: 1, title: "Rune raises $100,000 for marketing through NFT butterflies sale", author: "ninjanft", likes: 254, imgSrc: "/images/girl.png" },
  { id: 2, title: "The Cryptocurrency Trading Bible", author: "deniscrypto", likes: 198, imgSrc: "/images/coin.png" },
  { id: 3, title: "Designing our new company brand: Meta", author: "meta_world98", likes: 320, imgSrc: "/images/meta.png" },
  { id: 4, title: "Connect media partners, earn exciting rewards for today", author: "kingdom43world", likes: 410, imgSrc: "/images/yell.png" },
  { id: 4, title: "Connect media partners, earn exciting rewards for today", author: "sjkj3987423kjbdfsf", likes: 410, imgSrc: "/images/hands.png" },
];

const allVideos = Array.from({ length: 40 }, (_, i) => ({ ...videoData[i % videoData.length], id: i + 1 }));
const PAGE_SIZE = 10;

const DraggableRow = ({ video, index, moveRow }) => {
  const [, ref] = useDrag({ type: ItemType.ROW, item: { index } });

  const [, drop] = useDrop({
    accept: ItemType.ROW,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="w-[100%] flex items-center justify-between mb-4 px-8 gap-5 border border-gray-500 py-1 rounded-2xl cursor-move">
      <div className="flex items-center gap-5">
        <div className="text-gray-800 font-medium text-[16px]">{String(index + 1).padStart(2, "0")}</div>
        <div className="flex gap-3">
          <img src={video.imgSrc} alt="video" className="w-52 h-22 rounded-lg" />
          <div className="w-[364px]">
            <p className="text-[#F7F7F7] text-[20px] font-thin">{video.title}</p>
          </div>
        </div>
      </div>
      <div className="mr-36 flex gap-2 items-center">
        <img src={video.imgSrc} alt="logo" className="rounded-full w-5 h-5 object-cover" />
        <p className="text-[#DBFD51] font-mono text-[16px]">{video.author}</p>
      </div>
      <div className="flex items-center gap-2 text-white">
        <p>{video.likes}</p>
        <FaArrowUp color="#DBFD51" />
      </div>
    </div>
  );
};

const VideoList = () => {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState(allVideos);
  
  const paginatedVideos = videos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const moveRow = useCallback((fromIndex, toIndex) => {
    setVideos((prev) => {
      const updatedVideos = [...prev];
      const [movedVideo] = updatedVideos.splice(fromIndex, 1);
      updatedVideos.splice(toIndex, 0, movedVideo);
      return updatedVideos;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="w-[100%] mx-5">
        {paginatedVideos.map((video, index) => (
          <DraggableRow key={video.id} video={video} index={index + (page - 1) * PAGE_SIZE} moveRow={moveRow} />
        ))}

        <div className="flex justify-center gap-4 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="bg-gray-500 text-white px-4 py-2 rounded-lg disabled:opacity-50" disabled={page === 1}>Prev</button>
          <button onClick={() => setPage((p) => (p * PAGE_SIZE < allVideos.length ? p + 1 : p))} className="bg-[#DBFD51] text-black px-4 py-2 rounded-lg disabled:opacity-50" disabled={page * PAGE_SIZE >= allVideos.length}>Next</button>
        </div>
      </main>
    </DndProvider>
  );
};

export default VideoList;
