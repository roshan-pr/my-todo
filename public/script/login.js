const xhrRequest = (request, cb, body = '') => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => cb(xhr);

  xhr.open(request.method, request.url);
  const contentType = request['content-type'] || 'text/plain';
  xhr.setRequestHeader('content-type', contentType);

  xhr.send(body);
};

const redirectToTodo = ({ status }) => {
  if (status >= 200 && status < 300) {
    window.location.assign('/todo');
    return;
  }
  displayWrongCredential();
};

const displayWrongCredential = () => {
  const msgElement = document.querySelector('.errMsg');
  msgElement.innerText = 'Invalid username or password';
};

const loginRequest = () => {
  const form = document.querySelector('form');
  const formData = new FormData(form);
  const body = new URLSearchParams(formData);

  const request = {
    method: 'POST', url: '/login',
    'content-type': 'application/x-www-form-urlencoded'
  };
  xhrRequest(
    request,
    redirectToTodo,
    body);

  form.reset();
};

const main = () => {
  const loginBtn = document.querySelector('.login-button');
  loginBtn.onclick = loginRequest;
};

window.onload = main
