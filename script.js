import http from 'k6/http';
import { check, sleep } from 'k6';
export const options = {
  vus: 2,
  duration: '30s',
};
export default function () {
  const url = 'http://127.0.0.1:56733';
  // registration 
  const timeInMs = Date.now();
  const payload = JSON.stringify({
    username: `${timeInMs}_test@mail.com`,
    password: 'Password1',
    });
  const params = {
      headers: {
      'Content-Type': 'application/json',
      },
    };
  const resRegistration = http.post(`${url}/register`, payload, params);
  check(resRegistration, { 'status was 201': (r) => r.status == 201 });
  sleep(1);
  // auth
  const resAuth = http.post(`${url}/auth`, payload, params);
  check(resAuth, { 'status auth was 200': (r) => r.status == 200 });
  sleep(1);
  // add balance
  const token = resAuth.json().access_token;
  const userId = resRegistration.json().uuid;
  const paramsBalace = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${token}`
    },
  };
  const payloadBalance = JSON.stringify({
    balance: 200,
    });
  const resAddBalance = http.post(`${url}/balance/${userId}`, payloadBalance, paramsBalace);
  check(resAddBalance, { 'status add balance was 201': (r) => r.status == 201 });
}
