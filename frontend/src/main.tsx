import React from 'react'
import ReactDOM from 'react-dom/client'
import IndexPage from './pages/Index.tsx'
import LoginPage from './pages/Login.tsx'
import LogoutPage from './pages/Logout.tsx'
import './assets/css/global.css'

import {
  createBrowserRouter, RouterProvider
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage/>
  },
  {
    path: "/login",
    element: <LoginPage/>
  },
  {
    path: "/logout",
    element: <LogoutPage/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
);