import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessChat, createGroupChat, fetchChats, renameGroup } from "../controllers/chatController.js";

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat).put(protect, renameGroup);
// router.route("/groupAdd").put(protect, addToGroup);
// router.route("/groupRemove").put(protect, removeFromGroup);

export default router;