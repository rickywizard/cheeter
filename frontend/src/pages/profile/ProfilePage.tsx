import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Posts from '../../components/item/Posts';
import ProfileHeaderSkeleton from '../../components/skeleton/ProfileHeaderSkeleton';
import EditProfileModal from './EditProfileModal';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCalendarOutline } from 'react-icons/io5';
import { FaLink } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import useProfileQuery from '../../hooks/useProfileQuery';
import { formatMemberSinceDate } from '../../utils/formatDate';
import useAuthUser from '../../hooks/useAuthUser';
import useFollowMutation from '../../hooks/useFollowMutation';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useUpdateProfileMutation from '../../hooks/useUpdateProfileMutation';

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<string>('yourPosts');

  const coverImgRef = useRef<HTMLInputElement | null>(null);
  const profileImgRef = useRef<HTMLInputElement | null>(null);

  const { mutate: follow, isPending: isFollowing } = useFollowMutation();

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation(() => {
      setCoverImg(null);
      setProfileImg(null);
    });

  const { username } = useParams();
  const { data, isLoading, refetch, isRefetching } = useProfileQuery(
    username || ''
  );
  const user = data?.data;

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const { data: authUser } = useAuthUser();

  const isMyProfile = authUser?.data?._id === user?._id;

  const hasFollowed = authUser?.data?.following?.includes(user?._id || '');

  const handleFollow = (e: React.FormEvent, userId: string) => {
    e.preventDefault();

    follow(userId);
  };

  const handleUpdateProfile = () => {
    updateProfile({ profileImg, coverImg });
  };

  const handleImgChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    state: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === 'coverImg' && setCoverImg(reader.result as string);
        state === 'profileImg' && setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="w-full m-auto border-r border-gray-700 min-h-screen">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullname}</p>
                  <span className="text-sm text-slate-500">
                    {user.postCount} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={coverImg || user?.coverImg || '/cover.png'}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => coverImgRef.current?.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  ref={coverImgRef}
                  onChange={(e) => handleImgChange(e, 'coverImg')}
                />
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) => handleImgChange(e, 'profileImg')}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        profileImg ||
                        user?.profileImg ||
                        '/avatar-placeholder.png'
                      }
                    />
                    {isMyProfile && (
                      <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => profileImgRef.current?.click()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && (
                  <EditProfileModal authUser={authUser?.data!!} />
                )}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={(e) => handleFollow(e, user._id)}
                    disabled={isFollowing}
                  >
                    {isFollowing ? (
                      <LoadingSpinner size="sm" />
                    ) : !hasFollowed ? (
                      'Follow'
                    ) : (
                      'Unfollow'
                    )}
                  </button>
                )}
                {(coverImg || profileImg) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <LoadingSpinner size="sm" /> : 'Update'}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-8 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{user?.fullname}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {user?.link && (
                    <div className="flex gap-1 items-center ">
                      <>
                        <FaLink className="w-3 h-3 text-slate-500" />
                        <a
                          href="https://youtube.com/@johndoe"
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {user.link}
                        </a>
                      </>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {formatMemberSinceDate(user.createdAt!!)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following?.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers?.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full border-b border-gray-700 mt-4 relative">
                <div
                  className="absolute bottom-0 h-1 rounded-full bg-primary transition-transform duration-300 z-50"
                  style={{
                    width: '10%',
                    transform:
                      feedType === 'yourPosts'
                        ? 'translateX(200%)'
                        : 'translateX(calc(2 * 350%))',
                  }}
                ></div>
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-base-200 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType('yourPosts')}
                >
                  Posts
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-base-200 transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType('likes')}
                >
                  Likes
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} username={username} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
