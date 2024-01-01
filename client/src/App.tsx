import { useState } from "react";
import "./App.css";
import axios from "axios";
import AcademicPeriodEnum from "./types/enums/academic-period-enum";

function App() {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState(2023);

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

  function handleYearChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setYear(parseInt(e.target.value));
  }

  return (
    <>
      <form>
        <label htmlFor="courseName">Course</label>
        <input
          id="courseName"
          type="text"
          value={course}
          onChange={handleCourseChange}
        />
        <label htmlFor="academicYear">Year</label>
        <input
          id="academicYear"
          type="number"
          value={year}
          onChange={handleYearChange}
        />
        <button type="submit" onClick={handleFetch}>
          Search
        </button>
      </form>
    </>
  );
}

export default App;
