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
          <input type="text" name="name" id="name" placeholder="Enter name">
        </div>
        <div class="fields">
          <input type="password" name="password" id="password" placeholder="Enter password">
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
