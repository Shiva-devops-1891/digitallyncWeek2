import { RequestHandler } from "express";
import cacheKeys from "../common/cache-keys";
import { db } from "../common/db";
import redisClient from "../common/redis-client";

export const getEnrolledCourses = async () => {
  const data = await db.course.findMany({
    where: {
      archived: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      liveLink: true,
    },
  });

  return data;
};

export const getMyCoursesHandler: RequestHandler = async (req, res, next) => {
  try {
    let data = null;
    // Check cache
    const cachedData = await redisClient.get(cacheKeys.enrolledCourses);
    if (cachedData) {
      data = JSON.parse(cachedData);
    } else {
      // Get data from database
      // Add a delay to simulate a slow database
      await new Promise((resolve) => setTimeout(resolve, 3000));
      data = await getEnrolledCourses();
      // Cache data
      await redisClient.set(cacheKeys.enrolledCourses, JSON.stringify(data));
    }

    return res.json(data);
  } catch (error) {
    next(error);
  }
};
