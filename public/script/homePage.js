const createCheckbox = (items, listId) => {
	const checkboxes = items.map(({ id, description, status }) => {
		const state = status ? 'checked' : '';
		const dom = ['div', { className: 'item', id: id },
			['div', { className: 'task beside' },
				['input', { className: 'status', type: "checkbox", id: id, onclick: markItem, [state]: status }, ''],
				['div', { className: 'description' }, description]],
			['div', { className: 'delete-item fa-solid fa-trash', onclick: deleteItem }, '']
		]
		return dom;
	});
	return checkboxes;
};

const generateEditBox = (id, content) => {
	const dom = ['form', { id, className: 'beside editor', onsubmit: editList },
		['input', { type: 'text', name: 'title', id: 'add-list', className: 'border-bottom', maxlength: '40', value: content, placeholder: ' ...add list', required: true }, ''],
		['input', { type: 'hidden', name: 'listId', value: id }, ''],
		['div', { name: 'cancel', id, className: 'add-btn fa-solid fa-xmark', onclick: loadTodo }, ''],
		['div', { type: 'submit', name: 'edit', id, className: 'add-btn fa-solid fa-check', onclick: editList }, '']
	];
	return generateHtml(dom);
};

const showEditBar = (event) => {
	const { target } = event;
	const header = target.closest('.list-header');
	const { id, innerText } = target;
	header.replaceChildren(generateEditBox(id, innerText));
	header.querySelector('input').focus();
};

const createCardHeader = (id, title) => {
	return ['div', { className: 'list-header' },
		['div', { className: 'title', id, onclick: showEditBar }, title],
		['div', { className: 'icon fa-solid fa-trash', onclick: deleteList, }, '']
	];
};

const createCardForm = (id, items) => {
	return ['div', { className: 'card-body' },
		['div', { className: 'items' }, ...createCheckbox(items, id)],
		['form', { id, onsubmit: addItem, className: 'beside' },
			['input', { type: 'hidden', name: 'listId', value: id }, ''],
			['input', { type: 'text', name: 'description', id: 'add-item', maxlength: '40', placeholder: '...add item', required: true }, ''],
			['button', { type: 'submit', name: 'submit', className: 'add-btn' }, 'Add']
		]];
};

const createAList = ({ id, title, items }) => {
	const dom = ['div', { className: 'list', id },
		createCardHeader(id, title),
		createCardForm(id, items)];
	return generateHtml(dom);
};

const createTemplateList = () => {
	const dom = ['div', { className: 'create-list' },
		['form', { onsubmit: addList },
			['div', { className: ' list-header input-text' },
				['input', { type: 'text', name: 'title', id: 'add-list', placeholder: '...add list', maxlength: '26', required: true }, ''],
			]],
		['div', { className: 'temp-card', onclick: showAddList },
			['div', { className: 'fa-solid fa-plus' }, ''],
			['span', {}, 'click to add more']
		]
	];
	return generateHtml(dom);
};

const showAddList = (event) => {
	const form = document.querySelector('.create-list>form');
	form.style.visibility = 'visible';
	const textBox = document.getElementById('add-list');
	textBox.focus();
};

const xhrRequest = (request, cb, body = '') => {
	const xhr = new XMLHttpRequest();
	xhr.onload = () => cb(xhr);

	xhr.open(request.method, request.url);
	const contentType = request['content-type'] || 'text/plain';
	xhr.setRequestHeader('content-type', contentType);
	xhr.send(body);
};

const renderLists = ({ response }) => {
	const defaultRes = { lists: [], username: 'unknown' }
	const { lists, username } = response ? JSON.parse(response) : defaultRes;
	const mainViewElement = document.querySelector('main');
	mainViewElement.innerHTML = '';
	mainViewElement.append(createTemplateList());

	const listViews = lists.map(createAList);
	listViews.forEach(list =>
		mainViewElement.appendChild(list)
	);
};

const loadTodo = () => {
	const request = {
		method: 'GET', url: '/todo/api',
	};
	xhrRequest(request, renderLists);
};

const markItem = (event) => {
	const listId = event.target.closest('.list').id;
	const itemId = event.target.id;
	const status = event.target.checked;
	const body = JSON.stringify({ listId, itemId, status });

	const request = { method: 'POST', url: '/todo/mark-item', 'content-type': 'application/json' };
	xhrRequest(request, loadTodo, body);
};

const deleteList = (event) => {
	const listId = event.target.closest('.list').id;
	const body = JSON.stringify({ listId });
	const confirmDelete = confirm('Delete this List');
	if (confirmDelete) {
		const request = { method: 'POST', url: '/todo/delete-list', 'content-type': 'application/json' }
		xhrRequest(request, loadTodo, body);
	}
};

const deleteItem = (event) => {
	const listId = event.target.closest('.list').id;
	const itemId = event.target.closest('.item').id;
	const body = JSON.stringify({ listId, itemId });
	const confirmDelete = confirm('Delete this List');
	if (confirmDelete) {
		const request = { method: 'POST', url: '/todo/delete-item', 'content-type': 'application/json' }
		xhrRequest(request, loadTodo, body);
	}
};

const addItem = (event) => {
	event.preventDefault();

	const form = event.target.closest('form');
	const formElement = new FormData(form);
	const body = new URLSearchParams(formElement);

	const request = {
		method: 'POST', url: '/todo/add-item',
		'content-type': 'application/x-www-form-urlencoded'
	}
	xhrRequest(request, loadTodo, body);
};

const addList = (event) => {
	event.preventDefault();

	const form = event.target.closest('form');
	const formElement = new FormData(form);
	const body = new URLSearchParams(formElement);

	const request = {
		method: 'POST', url: '/todo/add-list',
		'content-type': 'application/x-www-form-urlencoded'
	}
	xhrRequest(request, loadTodo, body);
};

const editList = (event) => {
	event.preventDefault();

	const form = event.target.closest('form');
	const formElement = new FormData(form);
	const body = new URLSearchParams(formElement);

	const request = {
		method: 'POST', url: '/todo/edit-list',
		'content-type': 'application/x-www-form-urlencoded'
	}
	xhrRequest(request, loadTodo, body);
};

const main = () => {
	console.log('Home page loaded!');
	loadTodo();
};

window.onload = main;
