const fs = require('fs');
const { createApp } = require('./src/app.js');
require('dotenv').config();

const readFile = fileName => fs.readFileSync(fileName, 'utf-8');

const writeFile = (fileName, content) =>
  fs.writeFileSync(fileName, content, 'utf-8');

const main = (PORT) => {
  const { STATIC_ROOT, TEMPLATE_ROOT,
    COOKIE_NAME, COOKIE_KEY } = process.env;

  const appConfig = {
    staticRoot: STATIC_ROOT,
    templateRoot: TEMPLATE_ROOT,
    todoFilePath: 'db/todo.json'
  };

  const session = { name: COOKIE_NAME, keys: [COOKIE_KEY] }
  const users = JSON.parse(readFile('./db/.users.json'));

  const app = createApp(appConfig, users, session, readFile, writeFile);
  app.listen(PORT, () => console.log(`listening to ${PORT}`));
};

main(8080);
