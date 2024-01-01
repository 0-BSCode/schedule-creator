interface CourseInterface {
  code: string;
  group: number;
  description: string;
  status: string;
  professors: string[];
  schedule: string[];
  departmentReserved: string;
  enrolledStudents: number;
  totalStudents: number;
}

export default CourseInterface;
