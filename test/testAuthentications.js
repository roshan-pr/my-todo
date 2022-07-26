const fs = require('fs');
const request = require('supertest');
const { createApp } = require('../src/app.js');
require('dotenv').config({ path: './test/.env_test' })

const { STATIC_ROOT, TEMPLATE_ROOT, COOKIE_NAME,
  COOKIE_KEY, TODO_FILE_PATH, USERS_FILE_PATH } = process.env;

const initTestData = () => {
  fs.copyFileSync('test/db/initTodo.json', TODO_FILE_PATH);
  fs.copyFileSync('test/db/initUsers.json', USERS_FILE_PATH);
};

initTestData(); // Start with default data set.

const appConfig = {
  staticRoot: STATIC_ROOT,
  templateRoot: TEMPLATE_ROOT,
  todoFilePath: TODO_FILE_PATH,
  usersFilePath: USERS_FILE_PATH
};

const session = { name: COOKIE_NAME, keys: [COOKIE_KEY] }

const readFile = fileName => fs.readFileSync(fileName, 'utf-8');
const writeFile = (fileName, content) => fs.writeFileSync(fileName, content, 'utf-8');

describe('/unknown', () => {
  it('Should serve file not found', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .get('/unknown')
      .expect('/unknown not found')
      .expect(404, done)
  });
});

describe('GET /login', () => {
  it('Should serve login page', (done) => {
    const app = createApp(appConfig, session, readFile);
    request(app)
      .get('/login')
      .expect(/Login Page/)
      .expect(200, done)
  });

  let app;
  let cookie;
  beforeEach((done) => {
    initTestData();
    app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/login')
      .send('name=ram&password=123')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      })
  });

  it('Should redirect to home page for valid user.', (done) => {
    request(app)
      .get('/login')
      .set('Cookie', cookie)
      .expect('location', '/todo')
      .expect(302, done)
  });

});

describe('POST /login', () => {
  it('Should redirect to todo, --valid user', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/login')
      .send('name=ram&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect('location', '/todo')
      .expect(302, done)
  });
  it('Should serve error page, --unauthorized user', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/login')
      .send('name=unknown&password=unknown')
      .expect(/Invalid username or password/)
      .expect(200, done)
  });
});

describe('GET /signup', () => {
  it('Should serve signup page', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .get('/signup')
      .expect(/Signup Page/)
      .expect(200, done)
  });

  let app;
  let cookie;
  beforeEach((done) => {
    initTestData();
    app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/login')
      .send('name=ram&password=123')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      })
  });

  it('Should redirect to home page for valid user.', (done) => {
    request(app)
      .get('/signup')
      .set('cookie', cookie)
      .expect('location', '/todo')
      .expect(302, done)
  });
});

describe('POST /signup', () => {
  it('Should redirect to home page by assigning cookie', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/signup')
      .send('name=raj&password=abc')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect('set-cookie', /.*/)
      .expect('location', '/todo')
      .expect(302, done)
  });

  it('Should serve same page with error message', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/signup')
      .send('name=ram&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(/Username exists, try another name./)
      .expect(200, done)
  });

  it('Should redirect to login for invalid credentials', (done) => {
    const app = createApp(appConfig, session, readFile, writeFile);
    request(app)
      .post('/signup')
      .send('name=&password=')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect('location', '/login')
      .expect(302, done)
  });
});

describe('GET /logout', () => {
  it('Should logout the user and redirect to login page', (done) => {
    const app = createApp(appConfig, session, readFile);
    request(app)
      .get('/logout')
      .expect('location', '/login')
      .expect(302, done)
  });
});