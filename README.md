# K6 API Load Testing

This project demonstrates load testing of a REST API using k6, a modern load testing tool built for developers and CI/CD.

## Prerequisites

- Node.js (for running the API)
- [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) installed on your machine

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the API server:
```bash
npm start
```

## Running the Tests

In a new terminal window, run:
```bash
npm test
```

## Test Scenarios

The load test includes the following scenarios:

1. Base endpoint (`GET /`)
2. User operations:
   - Create user (`POST /users`)
   - List users (`GET /users`)
   - Clear users (`DELETE /users`)
3. Delayed response endpoint (`GET /delayed`)

### Load Profile

The test runs with the following stages:
- **Ramp-up**: 0 to 20 users over 30 seconds
- **Steady state**: 20 users for 1 minute
- **Ramp-down**: 20 to 0 users over 30 seconds

### Performance Thresholds

- 95% of requests must complete within 500ms
- Error rate must be below 1%

## Sample Test Results

Below is an example of what the test results look like:

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: tests/api.test.js
     output: -

  scenarios: (100.00%) 1 scenario, 20 max VUs, 2m30s max duration (incl. graceful stop):
           * default: Up to 20 VUs for 2m0s

running (2m00.0s), 00/20 VUs, 1147 complete and 0 interrupted iterations
default ✓ [======================================] 00/20 VUs  2m0s

     ✓ base endpoint status is 200
     ✓ base endpoint has correct message
     ✓ delayed endpoint status is 200
     ✓ delayed endpoint has delay value
     ✓ create user status is 201
     ✓ created user has correct data
     ✓ get users status is 200
     ✓ get users returns array
     ✓ clear users status is 204

     checks.........................: 100.00% ✓ 8976  ✗ 0   
     data_received.................: 2.3 MB  19 kB/s
     data_sent....................: 1.1 MB  9.4 kB/s
     http_req_blocked.............: avg=55.72µs min=1.95µs   med=4.31µs   max=12.93ms p(90)=7.22µs   p(95)=10.11µs 
     http_req_duration............: avg=162ms  min=101.28ms med=157.12ms max=453ms  p(90)=198.22ms p(95)=234.11ms
     http_req_failed..............: 0.00%   ✓ 0     ✗ 4588
     http_req_receiving...........: avg=51.2µs min=21.11µs  med=45.33µs  max=4.21ms p(90)=77.11µs  p(95)=98.22µs 
     http_req_sending.............: avg=88.1µs min=41.22µs  med=82.11µs  max=2.11ms p(90)=122.33µs p(95)=167.44µs
     http_req_tls_handshaking....: avg=0s     min=0s       med=0s       max=0s     p(90)=0s       p(95)=0s      
     http_reqs....................: 4588    38.23/s
     iteration_duration...........: avg=1.16s  min=1.10s    med=1.15s    max=1.45s  p(90)=1.20s    p(95)=1.25s   
     iterations...................: 1147    9.55833/s
     vus.........................: 0       min=0    max=20
     vus_max.....................: 20      min=20   max=20
```

## Understanding the Results

- **checks**: Percentage of successful checks (assertions in the test)
- **http_req_duration**: How long the requests took
  - avg: Average response time
  - min: Minimum response time
  - med: Median response time
  - max: Maximum response time
  - p(90): 90th percentile
  - p(95): 95th percentile
- **http_req_failed**: Percentage of failed requests
- **iterations**: Number of complete test iterations executed
- **vus**: Virtual users (simulated users) active during the test

## Common Issues

1. If the API server isn't running, you'll see connection refused errors
2. High response times might indicate performance issues in the API
3. Failed checks might indicate API changes or bugs

## Customizing the Tests

You can modify the following in `tests/api.test.js`:

1. Load profile (stages) in the `options` object
2. Performance thresholds
3. Base URL if your API runs on a different port/host
4. Test scenarios and assertions

For more advanced k6 features, check the [k6 documentation](https://k6.io/docs/).