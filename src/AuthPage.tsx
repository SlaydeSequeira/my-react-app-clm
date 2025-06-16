import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store';
import { useNavigate } from 'react-router-dom';
import dotenv from 'dotenv';
dotenv.config();
const API_BASE1 = import.meta.env.VITE_API_BASE;
const API_BASE = `${API_BASE1}/api/users`;
const OTP_API_BASE = `${API_BASE1}/api/users`;

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    try {
      await axios.post(`${OTP_API_BASE}/send-otp`, {
        email: form.email
      });
      setMessage('OTP sent to your email');
      setShowOTPInput(true);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post(`${OTP_API_BASE}/verify-otp`, {
        email: form.email,
        otp: otp
      });
      setMessage('OTP verified successfully');
      return true;
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
      return false;
    }
  };

  const registerUser = async () => {
    try {
      const res = await axios.post(`${API_BASE}/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setMessage(`Registered as ${res.data.user.name}`);
      setIsRegistering(false);
      setShowOTPInput(false);
      setOtp('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const loginUser = async () => {
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email: form.email,
        password: form.password,
      });
      Cookies.set('token', res.data.token, { expires: 1 });
      dispatch(loginSuccess({
        isAuthenticated: true,
        user: res.data.user
      }));
      setMessage(`Welcome, ${res.data.user.name}`);
      navigate('/main');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      if (!showOTPInput) {
        await sendOTP();
      } else {
        const isOTPValid = await verifyOTP();
        if (isOTPValid) {
          await registerUser();
        }
      }
    } else {
      await loginUser();
    }
  };

  const handleModeSwitch = () => {
    setIsRegistering(!isRegistering);
    setShowOTPInput(false);
    setOtp('');
    setMessage('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      
      {isRegistering && !showOTPInput && (
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      )}
      
      {!showOTPInput && (
        <>
        <input
  name="email"
  type="email"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
  required
/>
<input
  name="password"
  type="password"
  placeholder="Password"
  value={form.password}
  onChange={handleChange}
  required
/>

        </>
      )}

      {showOTPInput && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      )}

      <button onClick={handleSubmit}>
        {isRegistering 
          ? (showOTPInput ? 'Verify OTP & Register' : 'Send OTP') 
          : 'Login'
        }
      </button>

      <p>{message}</p>

      <button onClick={handleModeSwitch} style={{ marginTop: '1rem' }}>
        {isRegistering ? 'Have an account? Login' : 'No account? Register'}
      </button>
    </div>
  );
};

export default AuthPage;