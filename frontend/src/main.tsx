import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import Layout from './layout';
import HomePage from './routes/homepage';
import LoginPage from './routes/login';
import ConfirmEmail from './routes/confirm-email';
import ErrorPage from './error-page';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'confirm_email',
        element: <ConfirmEmail />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Toaster />
        <RouterProvider router={router} />
      </ThemeProvider>
    </NextUIProvider>
  </React.StrictMode>,
);
