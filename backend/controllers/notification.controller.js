import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg',
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error in getNotifications', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ success: true, message: 'Notifications deleted' });
  } catch (error) {
    console.error('Error in deleteNotifications', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, error: 'Notification not found' });
    }

    if (notification.to.toString() !== userId.toString) {
      return res.status(403).json({
        success: false,
        error: 'You are not allowed to delele this notification',
      });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error in deleteNotification', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
