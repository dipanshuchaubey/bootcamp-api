const axios = require('axios');

test('should container bootcamp', async () => {
  expect.assertions(1);
  const data = await axios.get(
    'https://bootcamper.ml/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8'
  );

  expect(data.data.data.name).toEqual('ModernTech Bootcamp');
});

test('should contain a course', async () => {
  expect.assertions(1);

  const data = await axios.get(
    'https://bootcamper.ml/api/v1/bootcamps/5d713a66ec8f2b88b8f830b8/courses/5d725cd2c4ded7bcb480eaa2'
  );

  expect(data.data.data.title).toEqual('UI/UX');
});

/**
 * THESE ARE ALL RESTRICTED REQUESTS FOR NON AUTHENTICATED USERS
 */

test('Get current user should be restriced', async () => {
  expect.assertions(1);

  let status;

  try {
    await axios.get('https://bootcamper.ml/api/v1/auth/me');
  } catch (err) {
    status = err.response.status;
  }

  expect(status).toBe(401);
});

test('Register new user with NOT UNIQUE email', () => {
  expect.assertions(1);

  return axios
    .post('https://bootcamper.ml/api/v1/auth/register', {
      name: 'Rick Mick',
      email: 'rick@gmail.com',
      password: '123456',
      role: 'publisher'
    })
    .then(data => console.log(data))
    .catch(err => expect(err.response.status).toBe(400));
});
