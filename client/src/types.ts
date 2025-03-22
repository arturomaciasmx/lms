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

export type LectureDetail = Omit<ChapterContent, "lectureId" | "lectureOrder">;

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
  educator: { _id: string; name: string; imageUrl: string };
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

export type DashboardData = {
  totalEarnings: number;
  enrolledStudentsData: {
    courseTitle: string;
    student: Student;
  }[];
  totalCourses: number;
};

export type Student = {
  _id: string;
  name: string;
  imageUrl: string;
};

export type User = {
  _id: string;
  name: string;
  imageUrl: string;
  enrolledCourses: string[];
};

export type StudentEnrolled = {
  student: Student;
  courseTitle: string;
  purchaseDate: string;
};
