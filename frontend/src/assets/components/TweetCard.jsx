export default function TweetCard({ post }) {
  const {
    author,
    text,
    media = [],
    createdAt,
    likes,
    likedByUser,
    commentsCount
  } = post;

  const handleLike = () => {
    // dispatch like/unlike to API + update state
  };

  return (
    <div className="border-b p-4 flex space-x-4">
      <img src={author.avatarUrl} alt="" className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold">{author.name}</span>
          <span className="text-gray-500">@{author.username}</span>
          <span className="text-gray-500">· {new Date(createdAt).toLocaleTimeString()}</span>
        </div>
        <p className="mt-2 whitespace-pre-wrap">{text}</p>

        {media.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {media.map((m) => (
              <div key={m.url}>
                {m.type === 'image' ? (
                  <img src={m.url} alt="" className="rounded-lg" />
                ) : (
                  <video src={m.url} controls className="rounded-lg" />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 flex space-x-6 text-gray-500">
          <button onClick={handleLike}>
            {likedByUser ? '♥' : '♡'} {likes}
          </button>
          <span>💬 {commentsCount}</span>
        </div>
      </div>
    </div>
  );
}
