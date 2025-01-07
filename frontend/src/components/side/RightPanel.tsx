import { Link } from 'react-router-dom';
import RightPanelSkeleton from '../skeleton/RighPanelSkeleton';
import useSuggestedUser from '../../hooks/useSuggestedUser';
import useFollowMutation from '../../hooks/useFollowMutation';
import LoadingSpinner from '../common/LoadingSpinner';

const RightPanel = () => {
  const { data, isLoading } = useSuggestedUser();
  const { mutate: follow, isPending } = useFollowMutation();

  const suggestedUser = data?.data;

  if (suggestedUser?.length === 0) {
    return <div className="md:w-60 w-0"></div>;
  }

  const handleFollow = (e: React.FormEvent, userId: string) => {
    e.preventDefault();

    follow(userId);
  };

  return (
    <div className="hidden lg:block m-3">
      <div className="bg-base-200 p-4 rounded-md sticky top-2">
        <p className="font-bold mb-2">Who to follow</p>
        <div className="flex flex-col gap-4">
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUser?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-5"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || '/avatar-placeholder.png'} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullname}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => handleFollow(e, user._id)}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : 'Follow'}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
