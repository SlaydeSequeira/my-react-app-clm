import './App.css'
import { useNavigate } from 'react-router-dom'
function App() {
  const navigate = useNavigate();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '20px'
    }}>
      <h1 style={{ textAlign: 'center' }}>Welcome to Google Form Clone</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => navigate('/createForm')}>
          Create Form
        </button>
        <button onClick={() => navigate('/getForm')}>
          Get Form
        </button>
      </div>
    </div>
  )
}
export default App
