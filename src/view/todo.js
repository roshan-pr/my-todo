const createHomePage = (username = '') => `
<html>
	<head>
		<title>Todo Page</title>
		<link rel="stylesheet" href="css/homePage.css" />
		<script src="script/generateHtml.js"></script>
		<script src="script/homePage.js"></script>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
			integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
			crossorigin="anonymous" referrerpolicy="no-referrer" />
	</head>

	<body>
		<nav>
			<div class="main-head">TODO</div>
			<input class="search" placeholder="Search"></input>
			<div class="profile">
				<div class="username">Hello ${username}</div>
				<a href="logout">
					<div class="logout fa-solid fa-arrow-right-from-bracket"></div>
				</a>
		</nav>
		<main>

		</main>
	</body>

</html>`

module.exports = { createHomePage };
