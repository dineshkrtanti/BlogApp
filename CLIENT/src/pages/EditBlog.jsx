import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditBlog = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [inputs, setInputs] = useState({ title: '', description: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch blog details
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const { data } = await axios.get(backendUrl `/blog/get-blog/${id}`);
        if (data?.success && data?.singleBlog) {
          setInputs({
            title: data.singleBlog.title,
            description: data.singleBlog.description,
          });
          setPreview(data.singleBlog.image); // existing image
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load blog data');
      }
    };
    fetchBlogData();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('title', inputs.title);
    formData.append('description', inputs.description);
    formData.append('user', localStorage.getItem('userId'));
    if (file) formData.append('image', file);

    const { data } = await axios.put(
      `http://localhost:8080/api/v1/blog/update-blog/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    if (data?.success) {
      toast.success('Blog Updated Successfully');
      navigate('/my-blogs');
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to update blog');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-green-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Your Story</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-48 w-full object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
              required
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
         <button
  type="submit"
  disabled={loading}
  className={`flex-1 py-3 font-bold rounded-lg shadow-md text-white flex items-center justify-center gap-2 ${
    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
  } transition`}
>
  {loading && (
    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  )}
  {loading ? 'Updating...' : 'Update Blog'}
</button>



            <button
              type="button"
              onClick={() => navigate('/my-blogs')}
              className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
