import Promise from "bluebird";
import mongoose from "mongoose";
import httpStatus from "http-status";

/**
 * Leaderboard Schema
 */
const LeaderboardSchema = new mongoose.Schema({
  leaderboardID: { type: String, required: true, unique: true },
  easy: {
    type: String,
    required: true
  },
  normal: {
    type: String,
    required: true
  },
  expert: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
LeaderboardSchema.method({});

/**
 * Statics
 */
LeaderboardSchema.statics = {
  /**
   * Get Leaderboard
   * @param {ObjectId} id - The objectId of Leaderboard.
   * @returns {Promise<Leaderboard, Error>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then(leaderboard => {
        if (leaderboard) {
          return leaderboard;
        }
        const err = new Error(
          "No such leaderboard exists!",
          httpStatus.NOT_FOUND
        );
        return Promise.reject(err);
      });
  },

  getByLeaderboardID(leaderboardID) {
    return this.findOne({ leaderboardID })
      .exec()
      .then(leaderboard => {
        if (leaderboard) {
          return leaderboard;
        }
        return null;
      });
  },

  /**
   * List Leaderboard in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of Leaderboard to be skipped.
   * @param {number} limit - Limit number of Leaderboard to be returned.
   * @returns {Promise<Leaderboard[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Leaderboard
 */
export default mongoose.model("Leaderboard", LeaderboardSchema);
