import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessChat, fetchChats } from "../controllers/chatController.js";

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
// router.route("/group").post(protect, createGroup);
// router.route("/rename").put(protect, renameGroup);
// router.route("/groupRemove").put(protect, removeFromGroup);
// router.route("/groupAdd").put(protect, addToGroup);

export default router;