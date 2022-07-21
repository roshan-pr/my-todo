const fs = require('fs');
const request = require('supertest');
const { createApp } = require('../src/app.js');

const initTestData = () => {
  fs.copyFileSync('test/db/initTodo.json', 'test/db/todo.json');
};

const appConfig = {
  staticRoot: 'public',
  templateRoot: 'src/view',
  todoFilePath: 'test/db/todo.json'
};

const session = { name: 'session', keys: ['superKey'] };
const users = { 'ram': { name: 'ram', password: '123' } };

const readFile = fileName => fs.readFileSync(fileName, 'utf-8');
const writeFile = (fileName, content) => fs.writeFileSync(fileName, content, 'utf-8');

initTestData(); // Start with default data set.

describe('/unknown', () => {
  it('Should serve file not found', (done) => {
    const app = createApp(appConfig, users, session, readFile);
    request(app)
      .get('/unknown')
      .expect('file not found')
      .expect(404, done)
  });
});

describe('/login', () => {
  it('Should serve login page', (done) => {
    const app = createApp(appConfig, users, session, readFile);
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

  it('Should serve error page, --unauthorized user', (done) => {
    const app = createApp(appConfig, users, session);
    request(app)
      .post('/login')
      .send('name=unknown&password=unknown')
      .expect(/Invalid username or password/)
      .expect(200, done)
  });
});

describe('/signup', () => {
  it('Should serve login page', (done) => {
    const app = createApp(appConfig, users, session, readFile);
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
    initTestData();
    app = createApp(appConfig, users, session, readFile, writeFile);
    request(app)
      .post('/login')
      .send('name=ram&password=123')
      .end((err, res) => {
        cookie = res.header['set-cookie'];
        done();
      })
  });

  it('Should serve todo home page', (done) => {
    request(app)
      .get('/todo')
      .set('cookie', cookie)
      .expect(/Todo Page/)
      .expect(200, done)
  });

  it('Should serve todo records for valid user /todo/api', (done) => {
    request(app)
      .get('/todo/api')
      .set('cookie', cookie)
      .expect(/"username":"ram"/)
      .expect(200, done)
  });

  it('Should update todo records for valid user /todo/add-list', (done) => {
    request(app)
      .post('/todo/add-list')
      .set('cookie', cookie)
      .send('title=party')
      .expect(200, done)
  });

  it('Should add todo records for valid user /todo/add-item', (done) => {
    request(app)
      .post('/todo/add-item')
      .set('cookie', cookie)
      .send('listId=1&description=Buy cake')
      .expect(200, done)
  });

  it('Should mark todo record for valid user /todo/mark-item', (done) => {
    request(app)
      .post('/todo/mark-item')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1, itemId: 1, status: true }))
      .expect(200, done)
  });

  it('Should delete todo list for valid user /todo/delete-list', (done) => {
    request(app)
      .post('/todo/delete-list')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1 }))
      .expect(200, done)
  });

  it('Should delete todo item for valid user /todo/delete-list', (done) => {
    request(app)
      .post('/todo/delete-item')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1, itemId: 1 }))
      .expect(200, done)
  });
});

describe('/logout', () => {
  it('Should logout the user and redirect to login page', (done) => {
    const app = createApp(appConfig, users, session, readFile);
    request(app)
      .get('/logout')
      .expect('location', '/login')
      .expect(302, done)
  });
});