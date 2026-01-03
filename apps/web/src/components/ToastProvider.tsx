'use client';

import { ToastContainer } from 'react-toastify';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="bg-white shadow-lg rounded-xl border-2 border-purple-100"
      className="text-gray-800 font-medium"
      progressClassName="bg-gradient-to-r from-purple-600 to-cyan-600"
    />
  );
}
