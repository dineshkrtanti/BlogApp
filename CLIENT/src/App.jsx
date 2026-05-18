import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateBlog from './pages/CreateBlog';
import MyBlogs from './pages/MyBlogs';
import EditBlog from './pages/EditBlog';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route path="/create-blog" element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        } />
        <Route path="/my-blogs" element={
          <ProtectedRoute>
            <MyBlogs />
          </ProtectedRoute>
        } />
        <Route path="/edit-blog/:id" element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;