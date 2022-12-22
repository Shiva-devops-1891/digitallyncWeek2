import { RequestHandler } from "express";
import { z } from "zod";
import cacheKeys from "../common/cache-keys";
import { db } from "../common/db";
import redisClient from "../common/redis-client";
import { IdSchema } from "../common/zod-schemas";

const updateCourseSchema = z.object({
  archived: z.boolean(),
  description: z.string().min(1),
  liveLink: z.string().url(),
  pictrue: z.string().url(),
  title: z.string().min(1),
});

export const updateCourseHandler: RequestHandler = async (req, res, next) => {
  try {
    // Validate data
    const courseId = IdSchema.parse(req.params.courseId);
    const data = updateCourseSchema.parse(req.body);

    // Update in db
    await db.course.update({
      where: {
        id: courseId,
      },
      data: data,
    });

    // Invalidate cache
    await redisClient.del(cacheKeys.enrolledCourses);

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
