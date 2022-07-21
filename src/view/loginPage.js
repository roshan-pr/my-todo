const createLoginPage = (err = '') => `
<html>
<head>
  <title>Login Page</title>
  <link rel="stylesheet" href="css/login.css" />
  <script src="/script/login.js"></script>
</head>

<body>
  <div class="page-wrapper">
    <div class="login">
      <h1>Login</h1>

      <form action="/login" method="POST">
        <div class="fields">
          <input type="text" name="name" id="name" placeholder="Enter name">
        </div>
        <div class="fields">
          <input type="password" name="password" id="password" placeholder="Enter password">
        </div>
        <button class="login-button">Login</button>
      </form>
      <span class="errMsg">${err}</span>

      <span>New user <a href="signup">signup</a></span>
    </div>
  </div>
</body>

</html>`;

module.exports = { createLoginPage };