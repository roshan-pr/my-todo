const createSignUpPage = (message = '') => `
<html>
<head>
  <title>Signup Page</title>
  <link rel="stylesheet" href="css/signup.css" />
</head>

<body>
  <div class="page-wrapper">
    <div class="signup">
      <h1>Sign Up</h1>

      <form action="/signup" method="POST">
        <div class="fields">
          <label>Username</label>
          <input type="text" name="name" id="name">
        </div>
        <div class="fields">
          <label>Password</label>
          <input type="password" name="password" id="password" >
        </div>
        <button class="signup-button">Signup</button>
      </form>

      <span>Have an account <a href="/login">login</a></span>
      <span class="message">${message}</span>

    </div>
  </div>
</body>

</html>`

module.exports = { createSignUpPage };
