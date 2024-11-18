import express from "express";
import { registerUser, authUser, allUsers, logoutUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect , allUsers)
router.post("/login", authUser)
router.post("/logout", logoutUser)

export default router;