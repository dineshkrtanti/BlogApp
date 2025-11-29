import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateBlog from './pages/CreateBlog';
import MyBlogs from './pages/MyBlogs';
import EditBlog from './pages/EditBlog'; // Import here
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>

      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
      </Routes>

    </>
  );
}

export default App;