const createElement = (tag, attributes, ...content) => {
	const tagView = document.createElement(tag);

	for (const key in attributes) {
		tagView[key] = attributes[key];
	}

	content.forEach(element => {
		if (typeof element === 'object') {
			tagView.appendChild(element);
			return;
		}
		tagView.innerText = element;
	});

	return tagView;
};

const generateHtml = ([tag, attributes, ...rest]) => {
	const childElements = rest.map(element =>
		Array.isArray(element) ? generateHtml(element) : element
	);

	return createElement(tag, attributes, ...childElements);
};

const createCheckbox = (items, listId) => {
	const checkboxes = items.map(({ id, description, status }) => {
		const state = status ? 'checked' : '';
		const dom = ['div', { className: 'item', id: id },
			['div', { className: 'checkbox' },
				['input', { className: 'status', type: "checkbox", id: id, onclick: markItem, [state]: status }, ''],
				['div', { className: 'description' }, description]],
			['div', { className: 'delete-item fa-solid fa-trash', onclick: deleteItem }, '']
		]
		return dom;
	});
	return checkboxes;
};

const createImgTag = attributes => createElement('img', attributes, '');

const createAList = ({ id, title, items }) => {
	const dom = ['div', { className: 'list', id },
		['div', { className: 'list-header' },
			['div', { className: 'title' }, title],
			['div', { className: 'icon fa-solid fa-trash', onclick: deleteList, }, '']
		],
		['form', { id, onsubmit: addItem },
			['div', { className: 'items' }, ...createCheckbox(items, id)],
			['input', { type: 'hidden', name: 'listId', value: id }, ''],
			['div', { className: 'input-text', style: 'display:flex' },
				['input', { type: 'text', name: 'description', id: 'add-item', maxlength: '40', placeholder: '...add item', required: true }, ''],
				['button', { type: 'submit', name: 'submit', id: 'add-item-btn' }, 'Add']
			]],
	];
	return generateHtml(dom);
};

const createTemplateList = () => {
	const dom = ['div', { className: 'create-list' },
		['form', { onsubmit: addList },
			['div', { className: ' list-header input-text' },
				['input', { type: 'text', name: 'title', id: 'add-list', placeholder: '...add list', maxlength: '26', required: true }, ''],
			]],
		['div', { className: 'add-icon', onclick: showAddList },
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

const main = () => {
	console.log('Home page loaded!');
	loadTodo();
};

window.onload = main;
