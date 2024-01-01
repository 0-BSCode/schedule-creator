import CourseInterface from "@src/types/interfaces/course-interface";
import { createContext, useState } from "react";

export interface UserCoursesContext {
  courses: CourseInterface[];
  setCourses: (newCourses: CourseInterface[]) => void;
}

const defaultValues: UserCoursesContext = {
  courses: [],
  setCourses: () => {},
};

export const UserCoursesContext = createContext(defaultValues);

interface UserCoursesProviderInterface {
  children: JSX.Element;
}

export const UserCoursesProvider: React.FC<UserCoursesProviderInterface> = ({
  children,
}) => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);

  return (
    <UserCoursesContext.Provider
      value={{
        courses,
        setCourses,
      }}
    >
      {children}
    </UserCoursesContext.Provider>
  );
};
