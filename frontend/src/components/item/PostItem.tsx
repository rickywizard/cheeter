import { PostData } from '../../interfaces/PostData.interface';
import { FaRegComment } from 'react-icons/fa';
import { BiRepost } from 'react-icons/bi';
import { FaRegHeart } from 'react-icons/fa';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaTrash } from 'react-icons/fa';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthUser from '../../hooks/useAuthUser';
import useDeletePostMutation from '../../hooks/useDeletePostMutation';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmationModal from '../common/ConfirmationModal';
import useLikePostMutation from '../../hooks/useLikePostMutation';
import useCommentMutation from '../../hooks/useCommentMutation';

interface PostProps {
  post: PostData;
}

const PostItem = ({ post }: PostProps) => {
  const [text, setText] = useState<string>('');
  const commentRef = useRef<HTMLDialogElement>(null);
  const deleteConfirmRef = useRef<HTMLDialogElement>(null);
  const postOwner = post.user;

  const { data: authUser } = useAuthUser();

  const isMyPost = authUser?.data?._id === postOwner._id;
  const isLiked = authUser?.data?._id
    ? post.likes.includes(authUser.data._id)
    : false;
  const formattedDate = '1h';

  const { mutate: deletePost, isPending: isDeleting } = useDeletePostMutation();

  const handleDeletePost = () => {
    deletePost(post._id);
  };

  const { mutate: likePost, isPending: isLiking } = useLikePostMutation();

  const handleLikePost = () => {
    if (isLiking) return;
    likePost(post._id);
  };

  const { mutate: commentPost, isPending: isCommenting } = useCommentMutation(
    () => {
      setText('');
    }
  );

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost({ postId: post._id, data: { text } });
  };

  return (
    <>
      <div className="flex gap-2 items-start p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 h-8 rounded-full overflow-hidden"
          >
            <img src={postOwner.profileImg || '/avatar-placeholder.png'} />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex gap-2 items-center">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullname}
            </Link>
            <span className="text-gray-700 flex gap-1 text-sm">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <span className="flex justify-end flex-1">
                {!isDeleting && (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => deleteConfirmRef.current?.showModal()}
                  />
                )}

                {isDeleting && <LoadingSpinner size="sm" />}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img}
                className="h-80 object-cover rounded-lg border border-gray-700"
                alt=""
              />
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex gap-4 items-center w-2/3 justify-between">
              <div
                className="flex gap-1 items-center cursor-pointer group"
                onClick={() => commentRef.current?.showModal()}
              >
                <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>
              {/* We're using Modal Component from DaisyUI */}
              <dialog
                ref={commentRef}
                className="modal border-none outline-none"
              >
                <div className="modal-box rounded border border-gray-600">
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post.comments.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="flex gap-2 items-start">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment.user.profileImg ||
                                '/avatar-placeholder.png'
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment.user.fullname}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment.user.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                      {isCommenting ? <LoadingSpinner size="sm" /> : 'Post'}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button className="outline-none">close</button>
                </form>
              </dialog>
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>
              <div
                className="flex gap-1 items-center group cursor-pointer"
                onClick={handleLikePost}
              >
                {isLiking && <LoadingSpinner size="sm" />}
                {!isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
                )}
                {isLiked && !isLiking && (
                  <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
                )}

                <span
                  className={`text-sm group-hover:text-pink-500 ${
                    isLiked ? 'text-pink-500' : 'text-slate-500'
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className="flex w-1/3 justify-end gap-2 items-center">
              <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        ref={deleteConfirmRef}
        message="Are you sure you want to delete this post"
        onConfirm={handleDeletePost}
      />
    </>
  );
};
export default PostItem;
