import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  vus: 50,
  duration: "1m",
};

export default function () {
  const res = http.get("http://localhost:5000/api/ternak");

  check(res, {
    "status 200": (r) => r.status === 200,
    "response time < 2000ms": (r) => r.timings.duration < 2000,
  });

  sleep(1);
}