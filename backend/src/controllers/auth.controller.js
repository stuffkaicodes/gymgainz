import authService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const result = await authService.register(name, username, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Register controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Login controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const verifyToken = async (req, res) => {
  // User info already attached by middleware
  res.status(200).json({
    success: true,
    user: req.user
  });
};
