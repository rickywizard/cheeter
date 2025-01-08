import { FaHeart, FaTrash, FaUser } from 'react-icons/fa';
import { NotificationData } from '../../interfaces/NotificationData.interface';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmationModal from '../common/ConfirmationModal';
import { useRef } from 'react';
import useDeleteNotificationMutation from '../../hooks/useDeleteNotificationMutation';

interface NotificationProps {
  notification: NotificationData;
}

const NotificationItem = ({ notification }: NotificationProps) => {
  const deleteConfirmRef = useRef<HTMLDialogElement>(null);

  const { mutate: deleteNotification, isPending: isDeleting } =
    useDeleteNotificationMutation();

  const handleDeleteNotification = () => {
    deleteNotification(notification._id);
  };

  return (
    <>
      <div className="border-b border-gray-700" key={notification._id}>
        <div className="flex gap-4 p-4 items-start">
          {notification.type === 'follow' && (
            <FaUser className="w-7 h-7 text-primary" />
          )}
          {notification.type === 'like' && (
            <FaHeart className="w-7 h-7 text-red-500" />
          )}
          <Link to={`/profile/${notification.from.username}`}>
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img
                  src={
                    notification.from.profileImg || '/avatar-placeholder.png'
                  }
                />
              </div>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">@{notification.from.username}</span>{' '}
              {notification.type === 'follow'
                ? 'followed you'
                : 'liked your post'}
            </div>
          </Link>
          <span className="flex justify-end flex-1">
            {!isDeleting && (
              <FaTrash
                className="cursor-pointer hover:text-red-500"
                onClick={() => deleteConfirmRef.current?.showModal()}
              />
            )}

            {isDeleting && <LoadingSpinner size="sm" />}
          </span>
        </div>
      </div>
      <ConfirmationModal
        ref={deleteConfirmRef}
        message="Are you sure you want to delete this notification"
        onConfirm={handleDeleteNotification}
      />
    </>
  );
};

export default NotificationItem;
