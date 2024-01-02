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
import useCourse from "./hooks/useCourse";
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
import currentSemInfo from "./constants/current-sem-info";

const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

const academicPeriodLabelToEnum = {
  None: AcademicPeriodEnum.NONE,
  "1ST Semester": AcademicPeriodEnum.FIRST_SEMESTER,
  "2ND Semester": AcademicPeriodEnum.SECOND_SEMESTER,
  Summer: AcademicPeriodEnum.SUMMER,
  "1ST Trimester": AcademicPeriodEnum.FIRST_TRIMESTER,
  "2ND Trimester": AcademicPeriodEnum.SECOND_SEMESTER,
  "3RD Trimester": AcademicPeriodEnum.THIRD_TRIMESTER,
  "Transition Term": AcademicPeriodEnum.TRANSITION_SEMESTER,
  "Senior High - Transition Semester 1":
    AcademicPeriodEnum.SENIORHIGH_TRANSITION_SEMESTER_1,
  "Senior High - Transition Semester 2":
    AcademicPeriodEnum.SENIORHIGH_TRANSITION_SEMESTER_2,
};

export interface SearchParamsI {
  course: string;
  period: AcademicPeriodEnum;
  year: number;
  page: number;
}

function App() {
  const [searchParams, setSearchParams] = useState<SearchParamsI>({
    course: "",
    year: currentSemInfo.year,
    period: currentSemInfo.period,
    page: 1,
  });
  // Only changed on search and helps keep track of the current academic period
  const [staticSearchParams, setStaticSearchParams] =
    useState<SearchParamsI>(searchParams);
  const { courses, totalPages, getCourses } = useCourse();
  const { isCourseClashing } = useScheduleHelper();
  const { courses: studentCourses, setCourses } =
    useContext(UserCoursesContext);

  // TODO: Fix spaghetti code
  async function handleFetch(
    e?: React.FormEvent<HTMLButtonElement>,
    pageNum?: number
  ): Promise<void> {
    setStaticSearchParams(searchParams);
    let pageNumber = pageNum ?? searchParams.page;
    // Reset whenever submit button is clicked
    if (e) {
      pageNumber = 1;
      setSearchParams({ ...searchParams, page: 1 });
    }
    const payload: SearchParamsI = { ...searchParams, page: pageNumber };
    getCourses(payload);
  }

  function handleCourseChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchParams({ ...searchParams, course: e.target.value });
  }

  function handlePeriodChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    setSearchParams({
      ...searchParams,
      period:
        AcademicPeriodEnum[
          e.target.value as unknown as keyof typeof AcademicPeriodEnum
        ],
    });
  }

  function handleYearChange(_yearAsString: string, yearAsNumber: number): void {
    setSearchParams({ ...searchParams, year: yearAsNumber });
  }

  function handlePageChange(newPage: number): void {
    if (newPage > 0) {
      handleFetch(undefined, newPage);
      setSearchParams({ ...searchParams, page: newPage });
    }
  }

  function isCurrentSem(): boolean {
    return (
      staticSearchParams.year === currentSemInfo.year &&
      staticSearchParams.period === currentSemInfo.period
    );
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
      return "No more slots available";
    }

    if (studentCourses.filter((sc) => sc.code === course.code).length) {
      return "Course is already in your list";
    }

    // TODO: Specify which course it clashes with
    if (isCourseClashing(course, studentCourses)) {
      return "Course schedule clashes with course in your list";
    }

    if (!isCurrentSem()) {
      return "Can only add courses offered this semester";
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
                value={searchParams.course}
                onChange={handleCourseChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Academic Period</FormLabel>
              <Select value={searchParams.period} onChange={handlePeriodChange}>
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
                value={searchParams.year}
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
                              isCourseClashing(course, studentCourses) ||
                              !isCurrentSem()
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
                onClick={() => {
                  handlePageChange(searchParams.page - 1);
                }}
                isDisabled={searchParams.page === 1}
              />
              <Text size="md">
                Page {searchParams.page} of {totalPages}
              </Text>
              <IconButton
                aria-label="Go forward"
                icon={<ChevronRightIcon />}
                onClick={() => {
                  handlePageChange(searchParams.page + 1);
                }}
                isDisabled={searchParams.page === totalPages}
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
