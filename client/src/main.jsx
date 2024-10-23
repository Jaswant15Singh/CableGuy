import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { Bounce, Flip, Slide, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
    <>
        <App />
        <ToastContainer position='top-center' transition={Zoom} autoClose={2000} style={{color:"aquamarine"}}/>
    </>
)
