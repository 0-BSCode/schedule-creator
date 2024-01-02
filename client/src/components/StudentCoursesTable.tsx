import { CloseIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
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
  Heading,
  Stack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { CoursesContext } from "@src/context/CoursesContext";
import CourseI from "@src/types/interfaces/course-interface";
import { useContext } from "react";

// TODO; Figure out what to pass into React.FC when component has no props
// eslint-disable-next-line @typescript-eslint/ban-types
const StudentCoursesTable = () => {
  const { studentCourses, setStudentCourses } = useContext(CoursesContext);

  function handleDelete(course: CourseI): void {
    const filteredCourses = studentCourses.filter(
      (c) => c.code !== course.code || c.group !== course.group
    );
    setStudentCourses(filteredCourses);
  }

  function handleDeleteAll(): void {
    setStudentCourses([]);
  }

  function handleExport(): void {
    const blob = new Blob([JSON.stringify(studentCourses, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "course-list-export.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <>
      <Stack>
        <Heading as="h1" size="md" textAlign="center">
          Course List
        </Heading>
        <HStack>
          <Tooltip label="Clear all courses in the list">
            <Button
              leftIcon={<CloseIcon />}
              variant="outline"
              colorScheme="red"
              onClick={() => {
                handleDeleteAll();
              }}
            >
              Clear
            </Button>
          </Tooltip>
          <Tooltip label="Export course list information to a text file">
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={() => {
                handleExport();
              }}
            >
              Export
            </Button>
          </Tooltip>
        </HStack>
      </Stack>
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
            {studentCourses.map((course, idx) => (
              <Tr key={`course-${idx}`}>
                <Td>
                  <IconButton
                    aria-label="Remove course"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => {
                      handleDelete(course);
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
    </>
  );
};

export default StudentCoursesTable;
