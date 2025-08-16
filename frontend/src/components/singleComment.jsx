const Comment = ({ comment }) => {
  return (
    <div className="flex space-x-4">
      <img 
        src={comment.avatar} 
        alt={comment.author} 
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-medium text-gray-900">{comment.author}</span>
          <time className="text-sm text-gray-500">{comment.timeAgo}</time>
        </div>
        <p className="text-gray-700 leading-relaxed mb-3">
          {comment.content}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <button className="hover:text-black transition-colors duration-200">Reply</button>
          <button className="flex items-center space-x-1 hover:text-black transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>{comment.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;