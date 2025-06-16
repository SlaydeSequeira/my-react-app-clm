import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import { useNavigate } from 'react-router-dom';
function App() {
    const navigate = useNavigate();
    return (_jsxs("div", { style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '20px'
        }, children: [_jsx("h1", { style: { textAlign: 'center' }, children: "Welcome to Google Form Clone" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: [_jsx("button", { onClick: () => navigate('/createForm'), children: "Create Form" }), _jsx("button", { onClick: () => navigate('/getForm'), children: "Get Form" })] })] }));
}
export default App;
