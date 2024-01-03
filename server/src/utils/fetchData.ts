import AcademicPeriodEnum from "@src/types/enums/academic-period-enum";
import axios from "axios";

const fetchData = async (
  course: string,
  period: AcademicPeriodEnum,
  year: number,
  page: number
): Promise<string> => {
  const data = new URLSearchParams({
    Courses: course,
    AcademicPeriod: period,
    AcademicYear: year.toString(),
    page: page.toString(),
  });

  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "insomnia/8.5.1",
    },
  };

  const response = await axios.get(
    "https://ismis.usc.edu.ph/CourseSchedule/CourseScheduleOffered",
    {
      params: data,
      ...config,
    }
  );

  return response.data;
};

export default fetchData;
