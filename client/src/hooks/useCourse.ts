import AcademicPeriodEnum from "@src/types/enums/academic-period-enum";
import CourseInterface from "@src/types/interfaces/course-interface";
import axios from "axios";
import { useState } from "react";

interface RawCourseInterface {
  code: string;
  description: string;
  status: string;
  professors: string;
  schedule: string;
  departmentReserved: string;
  enrolledStudents: string;
}

interface ResponseInterface {
  courses: RawCourseInterface[];
  currentPage: number;
  totalPages: number;
}

export interface PayloadInterface {
  course: string;
  period: AcademicPeriodEnum;
  year: number;
  page: number;
}

interface UseCourseHookInterface {
  courses: CourseInterface[];
  getCourses: (payload: PayloadInterface) => Promise<CourseInterface[]>;
}

const useCourse = (): UseCourseHookInterface => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);

  const getCourses = async (
    payload: PayloadInterface
  ): Promise<CourseInterface[]> => {
    const data = await fetchCourses(payload);
    const courseData = parseCourses(data);
    setCourses(courseData);
    return courseData;
  };

  const fetchCourses = async (
    payload: PayloadInterface
  ): Promise<ResponseInterface> => {
    const res = await axios.post("http://localhost:3000/courses", payload);
    const data = res.data as ResponseInterface;
    return data;
  };

  const parseCourses = (rawData: ResponseInterface): CourseInterface[] => {
    const newCourses: CourseInterface[] = rawData.courses.map((course) => {
      const studentInfo = course.enrolledStudents.split("/");
      const courseInfo = course.code.split(" - ");
      const scheduleInfo = course.schedule.split("\n");

      return {
        ...course,
        code: courseInfo[0],
        group: parseInt(courseInfo[1][courseInfo[1].length - 1]),
        professors: [course.professors],
        schedule: scheduleInfo.map((sched) => sched.trim()),
        enrolledStudents: parseInt(studentInfo[0]),
        totalStudents: parseInt(studentInfo[1]),
      };
    });
    return newCourses;
  };

  return {
    courses,
    getCourses,
  };
};

export default useCourse;
