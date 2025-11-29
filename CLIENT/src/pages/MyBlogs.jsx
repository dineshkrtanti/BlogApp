import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';

const MyBlogs = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's blogs
  const getUserBlogs = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await axios.get(
         backendUrl + `/blog/user-blog/${userId}`,
        { headers: { 'Cache-Control': 'no-cache' } }
      );

      if (data?.success && data.userBlog?.blogs) {
        // Sort newest first
        setBlogs(
          data.userBlog.blogs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error(error);
      setBlogs([]);
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    getUserBlogs();
  },[]);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { data } = await axios.delete(
        backendUrl + `/blog/delete-blog/${id}`
      );

      if (data?.success) {
        toast.success('Blog Deleted');
        await getUserBlogs(); // refresh list
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Blog Posts</h1>

        {loading ? (
          <p className="text-xl text-gray-500">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                isUser={true}
                title={blog.title}
                description={blog.description}
                image={blog.image}
                time={blog.createdAt}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-xl text-gray-500">
            You haven't created any blogs yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
