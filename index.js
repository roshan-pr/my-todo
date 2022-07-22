const fs = require('fs');
const { createApp } = require('./src/app.js');
require('dotenv').config();

const readFile = fileName => fs.readFileSync(fileName, 'utf-8');

const writeFile = (fileName, content) =>
  fs.writeFileSync(fileName, content, 'utf-8');

const main = () => {
  const { STATIC_ROOT, TEMPLATE_ROOT, PORT,
    COOKIE_NAME, COOKIE_KEY, TODO_FILE_PATH, USERS_FILE_PATH } = process.env;

  const appConfig = {
    staticRoot: STATIC_ROOT,
    templateRoot: TEMPLATE_ROOT,
    todoFilePath: TODO_FILE_PATH,
    usersFilePath: USERS_FILE_PATH
  };

  const session = { name: COOKIE_NAME, keys: [COOKIE_KEY] }

  const app = createApp(appConfig, session, readFile, writeFile);
  app.listen(PORT, () => console.log(`listening to ${PORT}`));
};

main();
