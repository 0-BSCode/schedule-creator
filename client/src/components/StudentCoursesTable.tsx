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

interface CourseExportI extends CourseI {
  course: string;
}

const formatCourseInfoForExport = (courses: CourseI[]): CourseExportI[] => {
  const exportData: CourseExportI[] = courses.map((c) => {
    return { course: `${c.code} - G${c.group}`, ...c };
  });
  return exportData;
};

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
    const exportData = formatCourseInfoForExport(studentCourses);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
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
        <Heading as="h1" size="lg" textAlign="center">
          Course List
        </Heading>
        <HStack alignItems={"flex-start"}>
          <Tooltip label="Clear all courses in the list">
            <Button
              isDisabled={!studentCourses.length}
              leftIcon={<CloseIcon />}
              variant="outline"
              colorScheme="red"
              onClick={() => {
                handleDeleteAll();
              }}
              flex={1}
            >
              Clear
            </Button>
          </Tooltip>
          <Tooltip label="Export course list information to a text file">
            <Button
              isDisabled={!studentCourses.length}
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={() => {
                handleExport();
              }}
              flex={1}
            >
              Export
            </Button>
          </Tooltip>
        </HStack>
      </Stack>
      {!studentCourses.length ? (
        <Text fontSize={"md"} textAlign={"center"} color="gray">
          No courses add yet.
        </Text>
      ) : (
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
      )}
    </>
  );
};

export default StudentCoursesTable;
