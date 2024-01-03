import AcademicPeriodEnum from "@src/types/enums/academic-period-enum";
import CourseI from "@src/types/interfaces/course-interface";
import axios from "axios";
import { createContext, useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
export interface SearchParamsI {
  course: string;
  period: AcademicPeriodEnum;
  year: number;
  page: number;
}

interface RawCourseI {
  code: string;
  description: string;
  status: string;
  professors: string;
  schedule: string;
  departmentReserved: string;
  enrolledStudents: string;
}

interface ResponseI {
  courses: RawCourseI[];
  currentPage: number;
  totalPages: number;
}

interface OfferedCoursesInfoI {
  courses: CourseI[];
  totalPages: number;
}
export interface CoursesContextI {
  offeredCoursesInfo: OfferedCoursesInfoI;
  setOfferedCoursesInfo: (searchParams: SearchParamsI) => Promise<void>;
  studentCourses: CourseI[];
  setStudentCourses: (newCourses: CourseI[]) => void;
}

const defaultValues: CoursesContextI = {
  offeredCoursesInfo: { courses: [], totalPages: 1 },
  setOfferedCoursesInfo: () => Promise.resolve(),
  studentCourses: [],
  setStudentCourses: () => {},
};

export const CoursesContext = createContext(defaultValues);

export const CoursesProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [offeredCoursesInfo, setOfferedCourses] = useState<OfferedCoursesInfoI>(
    defaultValues.offeredCoursesInfo
  );
  const [studentCourses, setStudentCourses] = useState<CourseI[]>([]);

  const fetchCourses = async (payload: SearchParamsI): Promise<ResponseI> => {
    const res = await axios.post(`${SERVER_URL}/courses`, payload);
    const data = res.data as ResponseI;
    return data;
  };

  const parseData = (rawData: ResponseI): OfferedCoursesInfoI => {
    const courseData: CourseI[] = rawData.courses.map((course) => {
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
    return {
      courses: courseData,
      totalPages: rawData.totalPages,
    };
  };

  const setOfferedCoursesInfo = async (
    searchParams: SearchParamsI
  ): Promise<void> => {
    const data = await fetchCourses(searchParams);
    const coursesInfo = parseData(data);
    setOfferedCourses(coursesInfo);
  };

  return (
    <CoursesContext.Provider
      value={{
        offeredCoursesInfo,
        setOfferedCoursesInfo,
        studentCourses,
        setStudentCourses,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
