export type CourseRating = {
  userId: string;
  rating: number;
  _id: string;
};

export type ChapterContent = {
  lectureId: string;
  lectureTitle: string;
  lectureDuration: number;
  lectureUrl: string;
  isPreviewFree: boolean;
  lectureOrder: number;
};

export type Chapter = {
  chapterId: string;
  chapterOrder: number;
  chapterTitle: string;
  chapterContent: ChapterContent[];
};

export type Course = {
  _id: string;
  courseTitle: string;
  courseDescription: string;
  coursePrice: number;
  isPublished: boolean;
  discount: number;
  courseContent: Chapter[];
  educator: string;
  enrolledStudents: string[];
  courseRatings: CourseRating[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  courseThumbnail: string;
};

export type Testimonial = {
  name: string;
  role: string;
  image: string;
  rating: number;
  feedback: string;
};
