import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express, { Request, Response } from "express";
import axios from "axios";
import { load } from "cheerio";
import cors from "cors";
import AcademicPeriodEnum from "./types/enums/academic-period-enum";

const app = express();
const PORT = process.env.PORT || 3000; // Or get port from environment variable

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hi from Express + TypeScript!");
});

type CoursesPayloadInterface = {
  course: string;
  period: AcademicPeriodEnum;
  year: number;
  page: number;
};

app.post("/courses", async (req: Request, res: Response) => {
  const { course, period, year, page }: CoursesPayloadInterface = req.body;
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
  const $ = load(response.data);
  const headers = [
    "code",
    "description",
    "status",
    "professors",
    "schedule",
    "departmentReserved",
    "enrolledStudents",
  ];
  const tableData: object[] = [];
  $('tr[title*="created by"]').each((idx, elem) => {
    const rowData: Record<string, string> = {};
    $("td", elem).each((cIdx, cElem) => {
      rowData[headers[cIdx]] = $(cElem).text().trim();
    });
    tableData.push(rowData);
  });
  const pageInfo = $("center span").first().text();
  const pageInfoSplit = pageInfo.split(" ");
  return res.json({
    courses: tableData,
    currentPage: page,
    totalPages: parseInt(pageInfoSplit[pageInfoSplit.length - 1]),
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
