import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import "./app.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import CompletedTasks from "./pages/CompletedTasks";
import TrackOngoing from "./pages/TrackOngoingTask";

// lightweight placeholders (replace or move to separate files if you prefer)
function Home() {
  return <div className="p-4">Home page content</div>;
}
function AssignTasks() {
  return <div className="p-4">Assign tasks page</div>;
}

// map nav id <-> path
const idToPath = {
  home: "/",
  completed: "/completed",
  track: "/track",
  assign: "/assign",
};
const pathToId = (path) => {
  if (path === "/") return "home";
  if (path.startsWith("/completed")) return "completed";
  if (path.startsWith("/track")) return "track";
  if (path.startsWith("/assign")) return "assign";
  return "home";
};

function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(pathToId(location.pathname));

  // keep active in sync with URL (handles browser nav / direct links)
  useEffect(() => {
    setActive(pathToId(location.pathname));
  }, [location.pathname]);

  // navigation helper used by Sidebar & Header
  const handleNav = (id) => {
    const p = idToPath[id] ?? "/";
    setActive(id);
    // avoid redundant push
    if (location.pathname !== p) navigate(p);
  };

  return (
    <div className="min-h-screen">
      <Sidebar active={active} onNav={handleNav} />
      <Header active={active} onNav={handleNav} />

      {/* main content — header is fixed, so add top padding; sidebar occupies left space on md+ */}
      <main className="md:ml-[18rem] p-6 pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/completed" element={<CompletedTasks />} />
          <Route path="/track" element={<TrackOngoing />} />
          <Route path="/assign" element={<AssignTasks />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}