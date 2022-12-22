const cacheKeys = {
  enrolledCourses: `enrolled-courses`,
  course: (courseId: number) => `course-${courseId}`,
};

export default cacheKeys;
