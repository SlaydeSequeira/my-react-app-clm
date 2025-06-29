import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './createForm';
import GetForm from './getForm';
import './index.css';
import App from './App';
import ViewForm from './viewForm';
import ViewResponse from './viewResponse';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthPage from './AuthPage';
import FormVersionControl from './version';
import EditFormPage from './EditFormPage';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/main", element: _jsx(App, {}) }), _jsx(Route, { path: "/createForm", element: _jsx(CreateForm, {}) }), _jsx(Route, { path: "/getForm", element: _jsx(GetForm, {}) }), _jsx(Route, { path: "/viewForm/:id", element: _jsx(ViewForm, {}) }), _jsx(Route, { path: "/viewResponse/:id", element: _jsx(ViewResponse, {}) }), _jsx(Route, { path: "/", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: '/version/:id', element: _jsx(FormVersionControl, {}) }), _jsx(Route, { path: '/edit/:id', element: _jsx(EditFormPage, {}) })] }) }) }) }));
