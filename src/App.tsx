import './App.css'
import { Outlet } from 'react-router-dom'
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
      <Link to="/">Home</Link>
      <Link to="/preferences">Preferences</Link>
      <Link to="/digest">Digest</Link>
    </nav>
  )
}


function App() {

  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default App
