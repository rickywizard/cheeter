import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error in getUserProfile', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = req.user;

    if (id === currentUser._id.toString()) {
      return res
        .status(400)
        .json({ success: false, error: 'Cannot follow/unfollow yourself' });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      await User.findOneAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      res.status(200).json({ success: true, message: 'User unfollowed' });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });

      // send notification to user
      const newNotification = new Notification({
        from: currentUser._id,
        to: userToModify._id,
        type: 'follow',
      });

      await newNotification.save();

      // TODO: return id of user as response
      res.status(200).json({ success: true, message: 'User followed' });
    }
  } catch (error) {
    console.error('Error in followUnfollowUser', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select('following');

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json({ success: true, data: suggestedUsers });
  } catch (error) {
    console.error('Error in getSuggestedUser', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullname, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ succes: false, error: 'User not found' });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        succees: false,
        error: 'Please provide current password and new password',
      });
    }

    if (currentPassword && newPassword) {
      const isMatched = await bcrypt.compare(currentPassword, user.password);

      if (!isMatched) {
        return res.status(400).json({
          succees: false,
          error: 'Current password is incorrect',
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          succees: false,
          error: 'Password must be at least 8 characters long',
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        // get image id
        // link example: https://res.cloudinary.com/cloudname/image/upload/v123412312/thisistheimageid.png
        await cloudinary.uploader.destroy(
          user.profileImg.split('/').pop().split('.')[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        // get image id
        // link example: https://res.cloudinary.com/cloudname/image/upload/v123412312/thisistheimageid.png
        await cloudinary.uploader.destroy(
          user.coverImg.split('/').pop().split('.')[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error in udpateUserProfile', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
