import { useState } from "react";
import "./App.css";
import axios from "axios";
import AcademicPeriodEnum from "./types/enums/academic-period-enum";
import { Box, Button, Flex, HStack, Input, Select } from "@chakra-ui/react";
import NumberInput from "./components/NumberInput";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";

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

  async function handleFetch(
    e: React.FormEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    const payload = {
      course,
      academicPeriod: AcademicPeriodEnum.SECOND_SEMESTER,
      year,
      page: 1,
    };
    const res = await axios.post("http://localhost:3000/courses", payload);
    console.log(res.data);
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

  return (
    <Flex>
      <Box w="15rem">Sidebar</Box>
      <HStack p={3} spacing={6} alignItems={"center"}>
        <FormControl>
          <FormLabel>Course Code</FormLabel>
          <Input
            placeholder="CIS 2106"
            value={course}
            onChange={handleCourseChange}
          />
          <FormHelperText>
            Code of the course you're looking for.
          </FormHelperText>
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
          <FormHelperText>Academic period you're looking in.</FormHelperText>
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
          <FormHelperText>Academic year you're looking in.</FormHelperText>
        </FormControl>
      </HStack>
      <form>
        <label htmlFor="courseName">Course</label>
        <input
          id="courseName"
          type="text"
          value={course}
          onChange={handleCourseChange}
        />
        <Button onClick={handleFetch}>Search</Button>
      </form>
    </Flex>
  );
}

export default App;
