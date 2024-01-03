import DayEnum from "@src/types/enums/day-enum";
import CourseI from "@src/types/interfaces/course-interface";
import ScheduleI from "@src/types/interfaces/schedule-interface";

interface TimeI {
  hour: number;
  minute: number;
  meridian: number;
}

interface ScheduleHelperHookI {
  isCourseClashing: (course: CourseI, courseList: CourseI[]) => number;
}

// TODO: Refactor (only one exposed function, so hook isn't really necessary)
const useScheduleHelper = (): ScheduleHelperHookI => {
  const parseSchedule = (course: CourseI): ScheduleI[] => {
    const schedules: ScheduleI[] = [];

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

  // Sample input => 12:00 PM (string)
  const parseTime = (timeInfo: string): TimeI => {
    const timeInfoSplit = timeInfo.split(":");
    const hour = parseInt(timeInfoSplit[0]);
    const minute = parseInt(timeInfoSplit[1]);
    const meridian = timeInfo.includes("PM") && hour !== 12 ? 12 : 0;

    return {
      hour,
      minute,
      meridian,
    };
  };

  const generateDate = ({ hour, minute, meridian }: TimeI): Date => {
    const YEAR = 2023; // Year doesn't matter for time comparison
    const MONTH = 0; // Month doesn't matter for time comparison
    const DAY = 1; // Day doesn't matter for time comparison
    const HOUR = hour + meridian;

    return new Date(
      // Assuming time format is "HH:mm AM/PM"
      YEAR,
      MONTH,
      DAY,
      HOUR, // Hour
      minute // Minute
    );
  };

  const isCourseClashing = (course: CourseI, courseList: CourseI[]): number => {
    const cScheds = parseSchedule(course);
    for (const cSched of cScheds) {
      const cSchedTimes = cSched.time.split(" - ");

      const cSchedTimeStart = generateDate(parseTime(cSchedTimes[0]));
      const cSchedTimeEnd = generateDate(parseTime(cSchedTimes[1]));

      let idx;
      for (idx = 0; idx < courseList.length; idx++) {
        const cl = courseList[idx];
        const clScheds = parseSchedule(cl);
        for (const clSched of clScheds) {
          const clSchedTimes = clSched.time.split(" - ");

          const clSchedTimeStart = generateDate(parseTime(clSchedTimes[0]));
          const clSchedTimeEnd = generateDate(parseTime(clSchedTimes[1]));

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
            return idx;
          }
        }
      }
    }

    return -1;
  };

  return {
    isCourseClashing,
  };
};

export default useScheduleHelper;
