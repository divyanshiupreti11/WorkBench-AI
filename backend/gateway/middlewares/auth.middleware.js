import redis from "../../shared/redis/redis.js";

export const protect = async (req, res, next) => {
  try {

    const sessionId = req?.cookies?.session;
    console.log("SESSION ID =", sessionId);

    if (!sessionId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const session = await redis.get(`session:${sessionId}`);
    console.log("SESSION =", session);

    if (!session) {
      return res.status(401).json({
        message: "Session Expired",
      });
    }

    req.user = JSON.parse(session);

    console.log("REQ.USER =", req.user);

    next();

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};