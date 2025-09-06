import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header/Header.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'

function App() {
const [active, setActive] = useState("assign");
  return (
     <div className="min-h-screen">
      {/* background is controlled in app.css */}
      <Sidebar active={active} onNav={(id) => setActive(id)} />
      <Header active={active} onNav={(id) => setActive(id)} />

      <main className="md:ml-[18rem] p-6 pt-36">
        {/* Example main content area; pt-36 leaves room under header */}
        <h2 className="text-2xl font-semibold mb-4">Current: {active}</h2>
        <div className="bg-white/60 p-6 rounded-lg border border-indigo-100">
          Page content for: {active}
        </div>
      </main>
    </div>
  )
}

export default App
