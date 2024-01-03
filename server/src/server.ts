import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express, { Request, Response } from "express";
import cors from "cors";
import AcademicPeriodEnum from "./types/enums/academic-period-enum";
import parseResponse from "./utils/parseResponse";
import fetchData from "./utils/fetchData";
import ResponseI from "./types/response-interface";

const app = express();
const PORT = process.env.PORT || 3000; // Or get port from environment variable

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  return res.sendStatus(200);
});

type CoursesPayloadInterface = {
  course: string;
  period: AcademicPeriodEnum;
  year: number;
  page: number;
};

app.post("/courses", async (req: Request, res: Response) => {
  const { course, period, year, page }: CoursesPayloadInterface = req.body;
  let ret: ResponseI = {
    courses: [],
    totalPages: 1,
  };
  try {
    const rawData = await fetchData(course, period, year, page);
    const parsedData = parseResponse(rawData);
    ret = parsedData;
  } catch (e) {
    console.error((e as Error).message);
    console.error((e as Error).stack);
  }

  return res.json({
    courses: ret.courses,
    currentPage: page,
    totalPages: ret.totalPages,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
