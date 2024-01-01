import { DeleteIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { UserCoursesContext } from "@src/context/userCoursesContext";
import CourseInterface from "@src/types/interfaces/course-interface";
import { useContext } from "react";

// eslint-disable-next-line @typescript-eslint/ban-types
const StudentCoursesTable = () => {
  const { courses, setCourses } = useContext(UserCoursesContext);

  function deleteCourse(course: CourseInterface): void {
    const filteredCourses = courses.filter(
      (c) => c.code !== course.code || c.group !== course.group
    );
    setCourses(filteredCourses);
  }

  return (
    <TableContainer
      style={{
        overflow: "auto",
      }}
    >
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Code</Th>
            <Th>Schedule</Th>
            <Th>Professor/s</Th>
            <Th>Enrolled Students</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.map((course, idx) => (
            <Tr key={`course-${idx}`}>
              <Td>
                <IconButton
                  aria-label="Remove course"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => {
                    deleteCourse(course);
                  }}
                />
              </Td>
              <Td>
                <Tooltip label={course.description}>
                  {`${course.code} - G${course.group}`}
                </Tooltip>
              </Td>
              <Td>
                {course.schedule.map((sched, sIdx) => (
                  <Text size={"md"} key={`course-${idx}-sched-${sIdx}`}>
                    {sched}
                  </Text>
                ))}{" "}
              </Td>
              <Td>
                {course.professors.map((prof, pIdx) => (
                  <Text size={"md"} key={`course-${idx}-prof-${pIdx}`}>
                    {prof}
                  </Text>
                ))}
              </Td>
              <Td>{`${course.enrolledStudents}/${course.totalStudents}`}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default StudentCoursesTable;
