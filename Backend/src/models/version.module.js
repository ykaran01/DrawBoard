import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
  {
    boardId: {
      type: String,
      required: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    elements: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },

    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Version = mongoose.model("Version", versionSchema);