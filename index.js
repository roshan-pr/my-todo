const fs = require('fs');
const { createApp } = require('./src/app.js');

const appConfig = {
  staticRoot: 'public',
  templateRoot: 'src/view',
  todoFilePath: 'db/todo.json'
};

const readFile = fileName => fs.readFileSync(fileName, 'utf-8');
const writeFile = (fileName, content) =>
  fs.writeFileSync(fileName, content, 'utf-8');

const main = (PORT) => {
  const session = JSON.parse(readFile('./db/.session.json'));
  const users = JSON.parse(readFile('./db/.users.json'));

  const app = createApp(appConfig, users, session, readFile, writeFile);
  app.listen(PORT, () => console.log(`listening to ${PORT}`));
};

main(8080);
