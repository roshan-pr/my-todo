const fs = require('fs');
const request = require('supertest');
const { createApp } = require('../src/app.js');

const appConfig = {
  staticRoot: 'public',
  templateRoot: 'src/view'
};

const session = { name: 'session', keys: ['superKey'] };
const users = { 'ram': { name: 'ram', password: '123' } };

const readFile = (fileName) => fs.readFileSync(fileName, 'utf-8');

describe('/login', () => {
  it('Should serve login page', (done) => {
    const app = createApp(appConfig, users, session);
    request(app)
      .get('/login')
      .expect(/Login Page/)
      .expect(200, done)
  });

  it('Should redirect to todo, --valid user', (done) => {
    const app = createApp(appConfig, users, session);
    request(app)
      .post('/login')
      .send('name=ram&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect('location', '/todo')
      .expect(302, done)
  });

  it('Should provide error code 401, --unauthorized user', (done) => {
    const app = createApp(appConfig, users, session);
    request(app)
      .post('/login')
      .send('name=unknown&password=unknown')
      .set('content-type', 'application/x-www-form-urlencoded')
      .expect(401, done)
  });
});

describe('/signup', () => {
  it('Should serve login page', (done) => {
    const app = createApp(appConfig, users, session);
    request(app)
      .get('/signup')
      .expect(/Signup Page/)
      .expect(200, done)
  });
});

describe('/todo', () => {
  let app;
  let cookie;
  beforeEach((done) => {
    app = createApp(appConfig, users, session, readFile);
    request(app)
      .post('/login')
      .send('name=ram&password=123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      })
  });

  it('Should serve todo home page', (done) => {
    request(app)
      .get('/todo')
      .expect(/Todo Page/)
      .expect(200, done)
  });
});
