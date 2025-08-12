function CommentList({ comments }) {
  return (
    <div className="comment-list border text-white border-[#2F3336] p-2 rounded-lg  ml-10 m-5">
      {comments.length === 0 ? (
        <div className="text-2xl text-center font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent p-2">
          WOW So Empty.
        </div>
      ) : (
        comments.map((c) => (
          <div
            key={c._id || c.createdAt}
            className="comment-item flex items-start mb-2"
          >
            <img
              src={c.AvatarImage}
              alt={c.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="text-white">
              <strong>{c.username}</strong>
              <p>{c.text}</p>
              <span className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;
