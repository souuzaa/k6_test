import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test base endpoint
  let response = http.get(`${BASE_URL}/`);
  check(response, {
    'base endpoint status is 200': (r) => r.status === 200,
    'base endpoint has correct message': (r) => JSON.parse(r.body).message === 'Hello from the API!',
  });

  // Test delayed endpoint
  response = http.get(`${BASE_URL}/delayed`);
  check(response, {
    'delayed endpoint status is 200': (r) => r.status === 200,
    'delayed endpoint has delay value': (r) => JSON.parse(r.body).delay !== undefined,
  });

  // Test user operations
  // Create user
  const user = {
    name: `test_user_${randomString(5)}`,
    email: `user_${randomString(5)}@test.com`,
  };

  response = http.post(`${BASE_URL}/users`, JSON.stringify(user), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(response, {
    'create user status is 201': (r) => r.status === 201,
    'created user has correct data': (r) => {
      const createdUser = JSON.parse(r.body);
      return createdUser.name === user.name && createdUser.email === user.email;
    },
  });

  // Get users
  response = http.get(`${BASE_URL}/users`);
  check(response, {
    'get users status is 200': (r) => r.status === 200,
    'get users returns array': (r) => Array.isArray(JSON.parse(r.body)),
  });

  // Clear users (occasional cleanup)
  if (Math.random() < 0.1) { // 10% chance to clear users
    response = http.del(`${BASE_URL}/users`);
    check(response, {
      'clear users status is 204': (r) => r.status === 204,
    });
  }

  sleep(1); // Wait 1 second between iterations
}