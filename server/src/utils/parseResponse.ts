import ResponseI from "@src/types/response-interface";
import { load } from "cheerio";

const parseResponse = (htmlContent: string): ResponseI => {
  const $ = load(htmlContent);
  const headers = [
    "code",
    "description",
    "status",
    "professors",
    "schedule",
    "departmentReserved",
    "enrolledStudents",
  ];
  const tableData: Record<string, string>[] = [];
  $('tr[title*="created by"]').each((idx, elem) => {
    const rowData: Record<string, string> = {};
    $("td", elem).each((cIdx, cElem) => {
      rowData[headers[cIdx]] = $(cElem).text().trim();
    });
    tableData.push(rowData);
  });
  const pageInfo = $("center span").first().text();
  const pageInfoSplit = pageInfo.split(" ");

  return {
    courses: tableData,
    totalPages: parseInt(pageInfoSplit[pageInfoSplit.length - 1]),
  };
};

export default parseResponse;
