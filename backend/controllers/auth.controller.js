import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid email format' });
    }

    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error:
          existingUser.username === username
            ? 'Username is already taken'
            : 'Email is already taken',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        success: true,
        message: 'Sign up sucessfull',
        data: {
          userId: newUser._id,
          fullname: newUser.fullname,
          username: newUser.username,
          email: newUser.email,
          profileImg: newUser.profileImg,
          coverImg: newUser.coverImg,
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in signup controller', error.message);

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { account, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: account }, { email: account }],
    });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      success: true,
      message: 'Login sucessfull',
      data: {
        userId: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      },
    });
  } catch (error) {
    console.error('Error in signup controller', error.message);

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in signup controller', error.message);

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error in getMe controller', error.message);

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
