import { DateMode } from "@/types";

export function getUTCorLTTime(
  time: Date,
  mode: DateMode
): {
  date: string;
  month: string;
  year: string;
  hours: string;
  minutes: string;
  seconds: string;
} {
  let date: string = "";
  let month: string = "";
  let year: string = "";
  let hours: string = "";
  let minutes: string = "";
  let seconds: string = "";

  if (mode === "UTC") {
    date = time.getUTCDate().toString().padStart(2, "0");
    month = String(time.getUTCMonth() + 1).padStart(2, "0");
    year = time.getUTCFullYear().toString().split("").splice(2, 2).join("");
    hours = time.getUTCHours().toString().padStart(2, "0");
    minutes = time.getUTCMinutes().toString().padStart(2, "0");
    seconds = time.getUTCSeconds().toString().padStart(2, "0");
    return {
      date,
      month,
      year,
      hours,
      minutes,
      seconds
    };
  } else if (mode === "LT") {
    date = time.getDate().toString().padStart(2, "0");
    month = String(time.getMonth() + 1).padStart(2, "0");
    year = time.getFullYear().toString().split("").splice(2, 2).join("");
    hours = time.getHours().toString().padStart(2, "0");
    minutes = time.getMinutes().toString().padStart(2, "0");
    seconds = time.getSeconds().toString().padStart(2, "0");
  }
  return {
    date,
    month,
    year,
    hours,
    minutes,
    seconds
  };
}
