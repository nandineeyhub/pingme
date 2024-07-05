import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Auth from './Components/Auth';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AuthRequired from './Guard';
import ChatWindow from './Components/chat-components/MainLayout/chatWindow';
import GuestUser from './GuestUser';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([{
  path:"/",
  element:<App/>,
  children:[{
    path:"/",
    element:<GuestUser><Auth/></GuestUser>
  },{
    path:"/messages",
    element:<AuthRequired><ChatWindow/></AuthRequired>
  }]
}])


root.render(
    <>
     <ToastContainer />
     <RouterProvider router={router}/>
    </>
    // <Index/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
