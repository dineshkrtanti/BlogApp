import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/useAuth';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { isLogin } = useAuth();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/v1/blog/all-blogs');
        if (data?.success) {
          setBlogs(data?.blogs);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllBlogs();
  }, [backendUrl]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Latest Blogs</h1>
        <div className="w-24 h-1 bg-green-500 mx-auto rounded mb-10"></div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found. Login to write one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog?._id}
                id={blog?._id}
                isUser={isLogin && userId === blog?.user?._id}
                title={blog?.title}
                description={blog?.description}
                image={blog?.image}
                time={blog?.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
