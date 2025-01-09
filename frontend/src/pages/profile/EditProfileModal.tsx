import { useEffect, useRef, useState } from 'react';
import useUpdateProfileMutation from '../../hooks/useUpdateProfileMutation';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { UserData } from '../../interfaces/UserData.interface';

interface ProfileProps {
  authUser: UserData;
}

const EditProfileModal = ({ authUser }: ProfileProps) => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    bio: '',
    link: '',
    newPassword: '',
    currentPassword: '',
  });

  const modalRef = useRef<HTMLDialogElement>(null);

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateProfileMutation(() => {
      setFormData({
        fullname: '',
        username: '',
        email: '',
        bio: '',
        link: '',
        newPassword: '',
        currentPassword: '',
      });
    });

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullname: authUser.fullname || '',
        username: authUser.username || '',
        email: authUser.email || '',
        bio: authUser.bio || '',
        link: authUser.link || '',
        newPassword: '',
        currentPassword: '',
      });
    }
  }, [authUser]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm"
        onClick={() => modalRef.current?.showModal()}
      >
        Edit profile
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box border rounded-md border-gray-700 shadow-md">
          <h3 className="font-bold text-lg my-3">Update Profile</h3>
          <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                placeholder="Full Name"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.fullname}
                name="fullname"
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Username"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.username}
                name="username"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
              />
              <textarea
                placeholder="Bio"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.bio}
                name="bio"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                placeholder="Current Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.currentPassword}
                name="currentPassword"
                onChange={handleInputChange}
              />
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 input border border-gray-700 rounded p-2 input-md"
                value={formData.newPassword}
                name="newPassword"
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              placeholder="Link"
              className="flex-1 input border border-gray-700 rounded p-2 input-md"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <button
              className="btn btn-primary rounded-full btn-sm text-white"
              disabled={isUpdating}
            >
              {isUpdating ? <LoadingSpinner size="sm" /> : 'Update'}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="outline-none">close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
