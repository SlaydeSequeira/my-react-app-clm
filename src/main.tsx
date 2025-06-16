import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateForm from './createForm';
import GetForm from './getForm';
import './index.css'
import App from './App';
import ViewForm from './viewForm';
import ViewResponse from './viewResponse';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthPage from './AuthPage';
import FormVersionControl from './version';
import EditFormPage from './EditFormPage';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <Provider store={store}>
       <Router>
      <Routes>
        <Route path="/main" element={<App />} />
        <Route path="/createForm" element={<CreateForm />} />
        <Route path="/getForm" element={<GetForm />} />
        <Route path="/viewForm/:id" element={<ViewForm/>}/>
        <Route path="/viewResponse/:id" element={<ViewResponse/>}/>
        <Route path="/" element={<AuthPage/>}/>
        <Route path='/version/:id' element={<FormVersionControl/>}/>
        <Route path='/edit/:id' element={<EditFormPage/>}/>
      </Routes>
    </Router>
    </Provider>
  </StrictMode>,
)