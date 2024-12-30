import LoadingSpinner from '../../components/common/LoadingSpinner';
import { IoSettingsOutline } from 'react-icons/io5';
import NotificationItem from '../../components/item/NotificationItem';

const NotificationPage = () => {
  const isLoading = false;
  const notifications = [
    {
      _id: '1',
      from: {
        _id: '1',
        username: 'johndoe',
        profileImg: '/avatars/boy2.png',
      },
      type: 'follow',
    },
    {
      _id: '2',
      from: {
        _id: '2',
        username: 'janedoe',
        profileImg: '/avatars/girl1.png',
      },
      type: 'like',
    },
  ];

  const deleteNotifications = () => {
    alert('All notifications deleted');
  };

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
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
                <a onClick={deleteNotifications}>Delete all notifications</a>
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
          <NotificationItem notification={notification} />
        ))}
      </div>
    </>
  );
};

export default NotificationPage;
