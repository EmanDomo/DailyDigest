import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserDashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <div className="dashboard">
      <h1>Welcome to Your Poop Tracker Dashboard</h1>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      {/* Add your dashboard content here */}
    </div>
  )
}

export default UserDashboard