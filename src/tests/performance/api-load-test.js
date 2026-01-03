import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  const scenarios = [
    testHomePage,
    testAdminLogin,
    testCustomerPortal,
    testAPIEndpoints,
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  scenario();

  sleep(1);
}

function testHomePage() {
  const res = http.get(`${BASE_URL}/`);

  const success = check(res, {
    'home page status is 200': (r) => r.status === 200,
    'home page loads in <500ms': (r) => r.timings.duration < 500,
    'home page has content': (r) => r.body.length > 0,
  });

  errorRate.add(!success);
}

function testAdminLogin() {
  const res = http.get(`${BASE_URL}/admin/login`);

  const success = check(res, {
    'login page status is 200': (r) => r.status === 200,
    'login page loads in <300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!success);
}

function testCustomerPortal() {
  const res = http.get(`${BASE_URL}/customer/login`);

  const success = check(res, {
    'customer portal status is 200': (r) => r.status === 200,
    'customer portal loads in <300ms': (r) => r.timings.duration < 300,
  });

  errorRate.add(!success);
}

function testAPIEndpoints() {
  const endpoints = [
    '/admin/partner-portal/dashboard',
    '/admin/partner-portal/customers',
    '/admin/partner-portal/projects',
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const res = http.get(`${BASE_URL}${endpoint}`);

  const success = check(res, {
    'API endpoint returns status': (r) => r.status >= 200 && r.status < 500,
    'API response time <1s': (r) => r.timings.duration < 1000,
  });

  errorRate.add(!success);
}

export function handleSummary(data) {
  return {
    'stdout': JSON.stringify(data, null, 2),
    'performance-summary.json': JSON.stringify(data),
  };
}
