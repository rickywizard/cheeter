import LoadingSpinner from '../../components/common/LoadingSpinner';
import { IoSettingsOutline } from 'react-icons/io5';
import NotificationItem from '../../components/item/NotificationItem';
import useNotificationQuery from '../../hooks/useNotificationQuery';
import useDeleteAllNotificationsMutation from '../../hooks/useDeleteAllNotificationsMutation';
import { useEffect, useRef } from 'react';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const NotificationPage = () => {
  const { data, isLoading, refetch } = useNotificationQuery();
  const notifications = data?.data;

  const deleteConfirmRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { mutate: deleteAllNotifications } =
    useDeleteAllNotificationsMutation();

  const handleDeleteAllNotifications = () => {
    deleteAllNotifications();
    deleteConfirmRef.current?.close();
  };

  return (
    <>
      <div className="w-full m-auto border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown ">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => deleteConfirmRef.current?.showModal()}>
                  Delete all notifications
                </a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
        {notifications?.map((notification) => (
          <NotificationItem
            notification={notification}
            key={notification._id}
          />
        ))}
      </div>
      <ConfirmationModal
        ref={deleteConfirmRef}
        message="Are you sure you want to delete all notifications"
        onConfirm={handleDeleteAllNotifications}
      />
    </>
  );
};

export default NotificationPage;
