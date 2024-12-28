import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error in getAllPosts', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const currentUser = req.user;

    const following = currentUser.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json({ success: true, data: feedPosts });
  } catch (error) {
    console.error('Error in getFollowingPosts', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json({ success: true, data: likedPosts });
  } catch (error) {
    console.error('Error in getLikedPosts', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error in getUserPosts', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const currentUser = req.user;

    if (!text) {
      return res
        .status(404)
        .json({ success: false, error: 'Post must have text' });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: currentUser._id,
      text: text,
      img: img || '',
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (error) {
    console.error('Error in createPost', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
      res.status(200).json({ success: true, message: 'Post unliked' });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });

      // send notification
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: 'like',
      });

      await notification.save();

      res.status(200).json({ success: true, message: 'Post liked' });
    }
  } catch (error) {
    console.error('Error in likeUnlikePost', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res
        .status(400)
        .json({ success: false, error: 'Comment must have text' });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const comment = { user: userId, text: text };

    post.comments.push(comment);

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error in commentOnPost', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'You are not authorized to delete this post',
      });
    }

    if (post.img) {
      const imgId = post.img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in deletePost', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
