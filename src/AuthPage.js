import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store';
import { useNavigate } from 'react-router-dom';
const API_BASE = 'http://localhost:5000/api/users';
const OTP_API_BASE = 'http://localhost:5000/api/users';
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
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const sendOTP = async () => {
        try {
            await axios.post(`${OTP_API_BASE}/send-otp`, {
                email: form.email
            });
            setMessage('OTP sent to your email');
            setShowOTPInput(true);
        }
        catch (err) {
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
        }
        catch (err) {
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
        }
        catch (err) {
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
        }
        catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRegistering) {
            if (!showOTPInput) {
                await sendOTP();
            }
            else {
                const isOTPValid = await verifyOTP();
                if (isOTPValid) {
                    await registerUser();
                }
            }
        }
        else {
            await loginUser();
        }
    };
    const handleModeSwitch = () => {
        setIsRegistering(!isRegistering);
        setShowOTPInput(false);
        setOtp('');
        setMessage('');
    };
    return (_jsxs("div", { style: { padding: '2rem', maxWidth: '400px', margin: 'auto' }, children: [_jsx("h2", { children: isRegistering ? 'Register' : 'Login' }), isRegistering && !showOTPInput && (_jsx("input", { name: "name", placeholder: "Name", value: form.name, onChange: handleChange, required: true })), !showOTPInput && (_jsxs(_Fragment, { children: [_jsx("input", { name: "email", type: "email", placeholder: "Email", value: form.email, onChange: handleChange, required: true }), _jsx("input", { name: "password", type: "password", placeholder: "Password", value: form.password, onChange: handleChange, required: true })] })), showOTPInput && (_jsx("input", { type: "text", placeholder: "Enter OTP", value: otp, onChange: (e) => setOtp(e.target.value), required: true })), _jsx("button", { onClick: handleSubmit, children: isRegistering
                    ? (showOTPInput ? 'Verify OTP & Register' : 'Send OTP')
                    : 'Login' }), _jsx("p", { children: message }), _jsx("button", { onClick: handleModeSwitch, style: { marginTop: '1rem' }, children: isRegistering ? 'Have an account? Login' : 'No account? Register' })] }));
};
export default AuthPage;
