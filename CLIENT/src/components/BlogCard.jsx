import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({
  title,
  description,
  image,
  time,
  isUser,
  id,
  handleDelete,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 border border-green-100 flex flex-col">
      <div className="h-56 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
            Dr. Pulak Sahay
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
            {format(new Date(time), 'MMM dd, yyyy')}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 leading-tight">
          {title}
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed mb-4 grow whitespace-pre-wrap">
          {description}
        </p>

        {isUser && handleDelete && (
          <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={handleEdit}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(id)}
              className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
