import CourseInterface from "@src/types/interfaces/course-interface";
import { createContext, useState } from "react";

export interface CoursesContextI {
  studentCourses: CourseInterface[];
  setStudentCourses: (newCourses: CourseInterface[]) => void;
}

const defaultValues: CoursesContextI = {
  studentCourses: [],
  setStudentCourses: () => {},
};

export const CoursesContext = createContext(defaultValues);

export const CoursesProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [studentCourses, setStudentCourses] = useState<CourseInterface[]>([]);

  return (
    <CoursesContext.Provider
      value={{
        studentCourses,
        setStudentCourses,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};
