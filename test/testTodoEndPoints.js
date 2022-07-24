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

describe('GET /todo', () => {
  it('Should redirect to login page for invalid user', (done) => {
    request(app)
      .get('/todo')
      .expect('location', '/login')
      .expect(302, done)
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

  it('Should serve todo home page', (done) => {
    request(app)
      .get('/todo')
      .set('cookie', cookie)
      .expect(/Todo Page/)
      .expect(200, done)
  });
});

describe('GET /todo/api', () => {
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

  it('Should serve todo records for valid user.', (done) => {
    request(app)
      .get('/todo/api')
      .set('cookie', cookie)
      .expect(/"username":"ram"/)
      .expect(200, done)
  });
});

describe('POST /todo/add-list', () => {
  it('Should redirect to login for invalid user.', (done) => {
    request(app)
      .post('/todo/add-list')
      .expect('location', '/login')
      .expect(302, done)
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

  it('Should update todo records for valid user.', (done) => {
    request(app)
      .post('/todo/add-list')
      .set('cookie', cookie)
      .send('title=party')
      .expect(200, done)
  });
});

describe('POST /todo/add-item', () => {
  it('Should redirect to login for invalid user.', (done) => {
    request(app)
      .post('/todo/add-item')
      .expect('location', '/login')
      .expect(302, done)
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

  it('Should add todo records for valid user.', (done) => {
    request(app)
      .post('/todo/add-item')
      .set('cookie', cookie)
      .send('listId=1&description=Buy cake')
      .expect(200, done)
  });
});

describe('POST /todo/mark-item', () => {
  it('Should redirect to login for invalid user.', (done) => {
    request(app)
      .post('/todo/mark-item')
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1, itemId: 1, status: true }))
      .expect('location', '/login')
      .expect(302, done)
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

  it('Should mark todo record for valid user.', (done) => {
    request(app)
      .post('/todo/mark-item')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1, itemId: 1, status: true }))
      .expect(200, done)
  });
});

describe('POST /todo/delete-list', () => {
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

  it('Should delete todo list for valid user.', (done) => {
    request(app)
      .post('/todo/delete-list')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1 }))
      .expect(200, done)
  });
});

describe.only('POST /todo/delete-item', () => {
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

  it('Should delete todo item for valid user.', (done) => {
    request(app)
      .post('/todo/delete-item')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 1, itemId: 1 }))
      .expect(200, done)
  });


  it('Should give err for invalid details.', (done) => {
    request(app)
      .post('/todo/delete-item')
      .set('cookie', cookie)
      .set('content-type', 'application/json')
      .send(JSON.stringify({ listId: 3, itemId: 3 }))
      .expect(/err/)
      .expect(400, done)
  });
});