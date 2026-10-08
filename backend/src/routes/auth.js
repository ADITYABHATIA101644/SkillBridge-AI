import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";

const memoryUsers = new Map();

function isDatabaseAvailable() {
  return mongoose.connection.readyState === 1;
}

function getMemoryUserByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  return memoryUsers.get(normalizedEmail) || null;
}

function getMemoryUserById(id) {
  for (const user of memoryUsers.values()) {
    if (String(user._id) === String(id)) {
      return user;
    }
  }
  return null;
}

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    targetRole: user.targetRole,
    skills: user.skills,
    profileCompleted: user.profileCompleted,
    createdAt: user.createdAt,
  };
}

/* ============================================
   REGISTER
   POST /api/auth/register
============================================ */

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      targetRole = "AI/ML Engineer",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDatabaseAvailable()) {
      const existingUser = await User.findOne({
        email: normalizedEmail,
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }
    } else if (getMemoryUserByEmail(normalizedEmail)) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const safeBaseName = (name.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "user")
      .slice(0, 18);

    const username = `${safeBaseName}${Date.now().toString(36)}`;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = isDatabaseAvailable()
      ? await User.create({
          username,
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          targetRole,
          role: "student",
        })
      : {
          _id: new mongoose.Types.ObjectId().toString(),
          username,
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          targetRole,
          role: "student",
          skills: [],
          profileCompleted: false,
          createdAt: new Date(),
        };

    if (!isDatabaseAvailable()) {
      memoryUsers.set(normalizedEmail, user);
    }

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

/* ============================================
   LOGIN
   POST /api/auth/login
============================================ */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = null;

    if (isDatabaseAvailable()) {
      user = await User.findOne({
        email: normalizedEmail,
      }).select("+password");
    } else {
      user = getMemoryUserByEmail(normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
    });
  }
});

/* ============================================
   CURRENT USER
   GET /api/auth/me
============================================ */

router.get("/me", authenticateToken, async (req, res) => {
  try {
    let user = null;

    if (isDatabaseAvailable()) {
      user = await User.findById(req.user.id);
    } else {
      user = getMemoryUserById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.json({
      success: true,
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve user.",
    });
  }
});

/* ============================================
   UPDATE PROFILE
   PUT /api/auth/profile
============================================ */

router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const {
      name,
      targetRole,
      skills,
      profileCompleted,
    } = req.body;

    const updates = {};

    if (typeof name === "string" && name.trim()) {
      updates.name = name.trim();
    }

    if (typeof targetRole === "string") {
      updates.targetRole = targetRole;
    }

    if (Array.isArray(skills)) {
      updates.skills = skills;
    }

    if (typeof profileCompleted === "boolean") {
      updates.profileCompleted = profileCompleted;
    }

    let user = null;

    if (isDatabaseAvailable()) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      user = getMemoryUserById(req.user.id);
      if (user) {
        Object.assign(user, updates);
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });
  }
});

export default router;