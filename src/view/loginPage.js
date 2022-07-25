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
      <h1>Log In</h1>

      <form action="/login" method="POST">
        <div class="fields">
          <label> Username</label>
          <input type="text" name="name" id="name">
        </div>
        <div class="fields">
          <label> Password</label>
          <input type="password" name="password" id="password">
        </div>
        <button class="login-button">Log In</button>
      </form>
      
      <span>New user ? <a href="signup">Sign Up</a></span>
      <span class="message">${err}</span>
    </div>
  </div>
</body>

</html>`;

module.exports = { createLoginPage };