import DayEnum from "@src/types/enums/day-enum";
import CourseInterface from "@src/types/interfaces/course-interface";
import ScheduleInterface from "@src/types/interfaces/schedule-interface";

interface ScheduleHelperHookInterface {
  isCourseClashing: (
    course: CourseInterface,
    courseList: CourseInterface[]
  ) => boolean;
}

const useScheduleHelper = (): ScheduleHelperHookInterface => {
  const parseSchedule = (course: CourseInterface): ScheduleInterface[] => {
    const schedules: ScheduleInterface[] = [];

    for (const sched of course.schedule) {
      const schedSplit = sched.split(" ");
      const time = schedSplit.slice(1, 6).join(" ");
      const room = schedSplit[schedSplit.length - 1];
      const days: string[] = [];

      Object.values(DayEnum).forEach((day) => {
        if (day === DayEnum.TUESDAY) {
          // Ensure schedule includes only "T" and not "Th"
          if (
            schedSplit[0] === "TTh" ||
            (schedSplit[0].includes(day) &&
              !schedSplit[0].includes(DayEnum.THURSDAY))
          ) {
            days.push(day);
          }
        } else {
          if (schedSplit[0].includes(day)) {
            days.push(day);
          }
        }
      });

      for (const day of days) {
        schedules.push({
          day,
          time,
          room,
        });
      }
    }

    return schedules;
  };

  const generateDate = (
    hour: number,
    minute: number,
    meridian: number
  ): Date => {
    const YEAR = 2023; // Year doesn't matter for time comparison
    const MONTH = 0; // Month doesn't matter for time comparison
    const DAY = 1; // Day doesn't matter for time comparison

    return new Date(
      // Assuming time format is "HH:mm AM/PM"
      YEAR,
      MONTH,
      DAY,
      hour, // Hour
      minute, // Minute
      meridian // Adjust for AM/PM
    );
  };

  const isCourseClashing = (
    course: CourseInterface,
    courseList: CourseInterface[]
  ): boolean => {
    const cScheds = parseSchedule(course);
    console.log(`Comparing ${course.code} - G${course.group}`);
    for (const cSched of cScheds) {
      console.log("Sched: ", cSched);
      const cSchedTimes = cSched.time.split(" - ");

      const cSchedTimeStart = generateDate(
        parseInt(cSchedTimes[0].split(":")[0]),
        parseInt(cSchedTimes[0].split(":")[1]),
        cSchedTimes[0].includes("PM") ? 12 : 0
      );
      const cSchedTimeEnd = generateDate(
        parseInt(cSchedTimes[1].split(":")[0]),
        parseInt(cSchedTimes[1].split(":")[1]),
        cSchedTimes[1].includes("PM") ? 12 : 0
      );
      console.log("Start: ", cSchedTimeStart.toString());
      console.log("End: ", cSchedTimeEnd.toString());

      for (const cl of courseList) {
        console.log(`with ${cl.code} - G${cl.group}`);
        const clScheds = parseSchedule(cl);
        for (const clSched of clScheds) {
          console.log("Sched: ", clSched);
          const clSchedTimes = clSched.time.split(" - ");

          const clSchedTimeStart = generateDate(
            parseInt(clSchedTimes[0].split(":")[0]),
            parseInt(clSchedTimes[0].split(":")[1]),
            clSchedTimes[0].includes("PM") ? 12 : 0
          );
          const clSchedTimeEnd = generateDate(
            parseInt(clSchedTimes[1].split(":")[0]),
            parseInt(clSchedTimes[1].split(":")[1]),
            clSchedTimes[1].includes("PM") ? 12 : 0
          );
          console.log("Start: ", clSchedTimeStart.toString());
          console.log("End: ", clSchedTimeEnd.toString());

          // TODO: Fix bug (weird bc same time works on MW's but not TTh's)
          if (
            cSched.day === clSched.day &&
            ((clSchedTimeStart < cSchedTimeEnd &&
              clSchedTimeEnd > cSchedTimeStart) ||
              (cSchedTimeStart < clSchedTimeEnd &&
                cSchedTimeEnd > clSchedTimeStart) ||
              (clSchedTimeStart < cSchedTimeStart &&
                clSchedTimeEnd > cSchedTimeEnd) ||
              (cSchedTimeStart < clSchedTimeStart &&
                cSchedTimeEnd > clSchedTimeEnd))
          ) {
            console.log("OVERLAPS");
            return true;
          }
        }
      }
    }

    return false;
  };

  return {
    isCourseClashing,
  };
};

export default useScheduleHelper;
