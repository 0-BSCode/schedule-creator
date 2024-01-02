import { useContext, useState } from "react";
import "./App.css";
import AcademicPeriodEnum from "./types/enums/academic-period-enum";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import NumberInput from "./components/NumberInput";
import { FormControl, FormLabel } from "@chakra-ui/react";
import useCourse, { PayloadInterface } from "./hooks/useCourse";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { UserCoursesContext } from "./context/userCoursesContext";
import StudentCoursesTable from "./components/StudentCoursesTable";
import CourseInterface from "./types/interfaces/course-interface";
import useScheduleHelper from "./hooks/useScheduleHelper";

const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

const academicPeriodLabelToEnum = {
  "First semester": AcademicPeriodEnum.FIRST_SEMESTER,
  "Second semester": AcademicPeriodEnum.SECOND_SEMESTER,
  Summer: AcademicPeriodEnum.SUMMER,
};

enum PageDirectionEnum {
  BACK,
  FORWARD,
}

function App() {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState(2023);
  const [period, setPeriod] = useState(AcademicPeriodEnum.FIRST_SEMESTER);
  const [page, setPage] = useState(1);
  const { courses, totalPages, getCourses } = useCourse();
  const { isCourseClashing } = useScheduleHelper();
  const { courses: studentCourses, setCourses } =
    useContext(UserCoursesContext);

  // TODO: Fix spaghetti code
  async function handleFetch(
    e?: React.FormEvent<HTMLButtonElement>,
    pageNum?: number
  ): Promise<void> {
    let pageNumber = pageNum ?? page;
    // Reset whenever submit button is clicked
    if (e) {
      e.preventDefault();
      pageNumber = 1;
      setPage(1);
    }
    const payload: PayloadInterface = {
      course,
      period,
      year,
      page: pageNumber,
    };
    getCourses(payload);
  }

  function handleCourseChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setCourse(e.target.value);
  }

  function handlePeriodChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    setPeriod(
      AcademicPeriodEnum[
        e.target.value as unknown as keyof typeof AcademicPeriodEnum
      ]
    );
  }

  function handleYearChange(_yearAsString: string, yearAsNumber: number): void {
    setYear(yearAsNumber);
  }

  function handlePageChange(direction: PageDirectionEnum): void {
    const change = direction === PageDirectionEnum.FORWARD ? 1 : -1;
    if (page + change > 0) {
      handleFetch(undefined, page + change);
      setPage(page + change);
    }
  }

  // TODO: Save to local storage
  function addCourse(course: CourseInterface): void {
    setCourses([...studentCourses, course]);
  }

  function getButtonTooltipMessage(
    course: CourseInterface,
    studentCourses: CourseInterface[]
  ): string | null {
    if (course.enrolledStudents === course.totalStudents) {
      return "No more slots available.";
    }

    if (studentCourses.filter((sc) => sc.code === course.code).length) {
      return "Course is already in your list.";
    }

    // TODO: Specify which course it clashes with
    if (isCourseClashing(course, studentCourses)) {
      return "Course schedule clashes with course in your list.";
    }

    return null;
  }

  return (
    <HStack alignItems={"flex-start"} h="100vh">
      <Stack p={3} maxW={"50%"} h={"100%"}>
        <Stack>
          <HStack spacing={6} alignItems={"center"}>
            <FormControl>
              <FormLabel>Course Code</FormLabel>
              <Input
                placeholder="CIS 2106"
                value={course}
                onChange={handleCourseChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Academic Period</FormLabel>
              <Select value={period} onChange={handlePeriodChange}>
                {Object.keys(academicPeriodLabelToEnum).map((label) => (
                  <option
                    key={label}
                    value={
                      academicPeriodLabelToEnum[
                        label as keyof typeof academicPeriodLabelToEnum
                      ]
                    }
                  >
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Academic Year</FormLabel>
              <NumberInput
                value={year}
                onChange={handleYearChange}
                max={getCurrentYear()}
                min={2017}
                defaultValue={getCurrentYear()}
              />
            </FormControl>
          </HStack>
          <Button onClick={handleFetch}>Search</Button>
        </Stack>
        {courses.length === 0 ? (
          <Text fontSize={"md"} textAlign={"center"} color="gray">
            Search first to see the data.
          </Text>
        ) : (
          <Box pt={3}>
            <TableContainer
              maxH={"25rem"}
              style={{
                overflow: "auto",
              }}
            >
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>Code</Th>
                    <Th>Status</Th>
                    <Th>Professor/s</Th>
                    <Th>Schedule</Th>
                    <Th>Department Reserved</Th>
                    <Th>Enrolled Students</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {courses.map((course, idx) => (
                    <Tr key={`course-${idx}`}>
                      <Td>
                        <Tooltip
                          label={getButtonTooltipMessage(
                            course,
                            studentCourses
                          )}
                        >
                          <IconButton
                            aria-label="Add course"
                            icon={<AddIcon />}
                            colorScheme="green"
                            onClick={() => {
                              addCourse(course);
                            }}
                            isDisabled={
                              course.enrolledStudents ===
                                course.totalStudents ||
                              !!studentCourses.filter(
                                (sc) => sc.code === course.code
                              ).length ||
                              isCourseClashing(course, studentCourses)
                            }
                          />
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label={course.description}>
                          {`${course.code} - G${course.group}`}
                        </Tooltip>
                      </Td>
                      <Td>{course.status}</Td>
                      <Td>
                        {course.professors.map((prof, pIdx) => (
                          <Text size={"md"} key={`course-${idx}-prof-${pIdx}`}>
                            {prof}
                          </Text>
                        ))}
                      </Td>
                      <Td>
                        {course.schedule.map((sched, sIdx) => (
                          <Text size={"md"} key={`course-${idx}-sched-${sIdx}`}>
                            {sched}
                          </Text>
                        ))}{" "}
                      </Td>
                      <Td>{course.departmentReserved}</Td>
                      <Td>
                        {`${course.enrolledStudents}/${course.totalStudents}`}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <HStack pt={3} justifyContent={"center"} gap={2}>
              <IconButton
                aria-label="Go back"
                icon={<ChevronLeftIcon />}
                onClick={(e) => {
                  handlePageChange(PageDirectionEnum.BACK);
                }}
                isDisabled={page === 1}
              />
              <Text size="md">
                Page {page} of {totalPages}
              </Text>
              <IconButton
                aria-label="Go forward"
                icon={<ChevronRightIcon />}
                onClick={(e) => {
                  handlePageChange(PageDirectionEnum.FORWARD);
                }}
              />
            </HStack>
          </Box>
        )}
      </Stack>
      <StudentCoursesTable />
    </HStack>
  );
}

export default App;
