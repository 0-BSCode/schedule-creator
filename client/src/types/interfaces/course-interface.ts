interface CourseInterface {
  code: string;
  description: string;
  status: string;
  professors: string[];
  schedule: string[];
  departmentReserved: string;
  enrolledStudents: number;
  totalStudents: number;
}

export default CourseInterface;
