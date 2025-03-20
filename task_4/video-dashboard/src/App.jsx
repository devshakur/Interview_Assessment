import React, { useState, useEffect, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const API_URL = "http://localhost:3000/v1/api/rest/video/PAGINATE";

const Dashboard = () => {
  const defaultColumns = ["Title", "Likes", "Created At"];
  const [columns, setColumns] = useState(defaultColumns);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const fetchVideos = async (page) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: 10 })
      });
      const data = await response.json();
      setVideos(data.list);
      setTotalPages(data.num_pages);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const moveColumn = useCallback((dragIndex, hoverIndex) => {
    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, draggedColumn);
    setColumns(newColumns);
  }, [columns]);

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    const newVideos = [...videos];
    const [draggedVideo] = newVideos.splice(dragIndex, 1);
    newVideos.splice(hoverIndex, 0, draggedVideo);
    setVideos(newVideos);
  }, [videos]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Video Dashboard</h1>
        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <DraggableColumn key={col} index={index} moveColumn={moveColumn}>
                  {col}
                </DraggableColumn>
              ))}
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <DraggableRow key={video.id} index={index} moveRow={moveRow}>
                <td className="border p-2">{video.title}</td>
                <td className="border p-2">{video.likes}</td>
                <td className="border p-2">{new Date(video.created_at).toLocaleDateString()}</td>
              </DraggableRow>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-500 text-white px-4 py-2 disabled:opacity-50"
          >Prev</button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </DndProvider>
  );
};

const DraggableColumn = ({ children, index, moveColumn }) => {
  const [{ isDragging }, ref] = useDrag({
    type: "COLUMN",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (item) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    }
  });

  return (
    <th ref={(node) => ref(drop(node))} className="border p-2 bg-gray-200 cursor-pointer">
      {children}
    </th>
  );
};

const DraggableRow = ({ children, index, moveRow }) => {
  const [{ isDragging }, ref] = useDrag({
    type: "ROW",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });

  const [, drop] = useDrop({
    accept: "ROW",
    hover: (item) => {
      if (item.index !== index) {
        moveRow(item.index, index);
        item.index = index;
      }
    }
  });

  return (
    <tr ref={(node) => ref(drop(node))} className="border hover:bg-gray-100 cursor-pointer">
      {children}
    </tr>
  );
};

export default Dashboard;
