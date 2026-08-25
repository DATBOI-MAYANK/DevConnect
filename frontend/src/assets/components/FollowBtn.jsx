import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFollowRecords,
  followUser,
  unfollowUser,
} from "../../features/FollowSlice/followSlice..js";

function FollowBtn({ userId, currentUserId }) {
  const dispatch = useDispatch();
  const { following, status } = useSelector((state) => state.follow);
  const isFollowing = following.some(
    (record) => String(record.followee) === String(userId),
  );
  const isPending = status === "loading";

  useEffect(() => {
    if (currentUserId) dispatch(fetchFollowRecords());
  }, [currentUserId, dispatch]);

  if (!currentUserId || String(currentUserId) === String(userId)) return null;

  const handleClick = () => {
    dispatch(isFollowing ? unfollowUser({ userId }) : followUser({ userId }));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-xl px-5 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isFollowing
          ? "border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
          : "bg-blue-600 text-white hover:bg-blue-500"
      }`}
    >
      {isPending ? "Please wait…" : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowBtn;
