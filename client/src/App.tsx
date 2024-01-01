import { useState } from "react";
import "./App.css";
import AcademicPeriodEnum from "./types/enums/academic-period-enum";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Select,
  Stack,
  Text,
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

const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

const academicPeriodLabelToEnum = {
  "First semester": AcademicPeriodEnum.FIRST_SEMESTER,
  "Second semester": AcademicPeriodEnum.SECOND_SEMESTER,
  Summer: AcademicPeriodEnum.SUMMER,
};

function App() {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState(2023);
  const [period, setPeriod] = useState(AcademicPeriodEnum.FIRST_SEMESTER);
  const [page, setPage] = useState(1);
  const [data, setData] = useState("");
  const { courses, getCourses } = useCourse();

  async function handleFetch(
    e: React.FormEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    const payload: PayloadInterface = {
      course,
      period,
      year,
      page,
    };
    const courses = getCourses(payload);
    setData(JSON.stringify(courses));
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

  console.log(courses);
  return (
    <Flex>
      <Box w="20%">Sidebar</Box>
      <Stack p={3} maxW={"50%"}>
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
        <Box pt={3}>
          <TableContainer
            style={{
              overflowX: "auto",
            }}
          >
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Code</Th>
                  <Th>Description</Th>
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
                      <Button colorScheme="green">Add</Button>
                    </Td>
                    <Td>{`${course.code} - ${course.group}`}</Td>
                    <Td>{course.description}</Td>
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
        </Box>
      </Stack>
      <Box w="35rem">Schedule</Box>
    </Flex>
  );
}

export default App;
