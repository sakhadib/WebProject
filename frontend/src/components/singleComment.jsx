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
      </div>
    </div>
  );
};

export default Comment;