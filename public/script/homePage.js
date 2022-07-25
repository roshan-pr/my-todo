let TODO_RECORDS = {};

const generateListEditBox = (id, content) => {
	const dom = ['form', { id, className: 'beside editor', onsubmit: editList },
		['input', { type: 'text', name: 'title', id: 'edit-list', className: 'border-bottom', maxlength: '40', value: content, placeholder: ' Add list...', required: true }, ''],
		['input', { type: 'hidden', name: 'listId', value: id }, ''],
		['div', { name: 'cancel', id, className: 'add-btn fa-solid fa-xmark', onclick: loadTodo }, ''],
		['div', { type: 'submit', name: 'edit', id, className: 'add-btn fa-solid fa-check', onclick: editList }, '']
	];
	return generateHtml(dom);
};

const showListEditBar = (event) => {
	const { target } = event;
	const header = target.closest('.list-header');
	const { id, innerText } = target;
	header.replaceChildren(generateListEditBox(id, innerText));
	header.querySelector('input').focus();
};

// - For Item Edit Bar
const generateItemEditBox = (content, listId, id) => {
	const dom = ['form', { id, className: 'beside editor padding-left ', onsubmit: editItem },
		['input', { type: 'text', name: 'description', id: 'edit-item', className: 'border-bottom', maxlength: '40', value: content, placeholder: ' Add item...', required: true }, ''],
		['input', { type: 'hidden', name: 'listId', value: listId }, ''],
		['input', { type: 'hidden', name: 'itemId', value: id }, ''],
		['div', { name: 'cancel', id, className: 'add-btn fa-solid fa-xmark', onclick: loadTodo }, ''],
		['div', { type: 'submit', name: 'edit', id, className: 'add-btn fa-solid fa-check', onclick: editItem }, '']
	];
	return generateHtml(dom);
};

const showItemEditBar = (event) => {
	const { target } = event;
	const item = target.closest('.item');
	const { id, listId, innerText } = item;
	item.lastChild.remove();
	item.appendChild(generateItemEditBox(innerText, listId, id));
	item.querySelector('#edit-item').focus();
	return;
};

const createCheckbox = (items, listId) => {
	const checkboxes = items.map(({ id, description, status }) => {
		const state = status ? 'checked' : '';
		const dom = ['div', { className: 'item', listId, id: id },
			['input', { className: 'status', type: "checkbox", id: id, onclick: markItem, [state]: status }, ''],
			['div', { className: 'task beside' },
				['div', { className: 'description', onclick: showItemEditBar }, description],
				['div', { className: 'delete-btn fa-solid fa-trash', onclick: deleteItem }, '']]
		]
		return dom;
	});
	return checkboxes;
};

const createCardHeader = (id, title) => {
	return ['div', { className: 'list-header' },
		['div', { className: 'title', id, onclick: showListEditBar }, title],
		['div', { className: 'delete-btn fa-solid fa-trash', onclick: deleteList, }, '']
	];
};

const createCardForm = (id, items) => {
	return ['div', { className: 'card-body' },
		['div', { className: 'items' }, ...createCheckbox(items, id)],
		['form', { id, onsubmit: addItem, className: 'beside' },
			['input', { type: 'hidden', name: 'listId', value: id }, ''],
			['input', { type: 'text', name: 'description', id: 'add-item', maxlength: '40', placeholder: ' Add item...', required: true }, ''],
			['button', { type: 'submit', name: 'submit', className: 'add-btn' }, 'Add']
		]];
};

const groupByCompleted = (items) => {
	const completed = [];
	const unCompleted = [];
	items.forEach(item => {
		if (item.status) {
			completed.push(item);
			return;
		};
		unCompleted.push(item);
	});
	return [...unCompleted, ...completed];
};

const generateAList = ({ id, title, items }) => {
	const sortedItems = groupByCompleted(items);
	const dom = ['div', { className: 'list', id },
		createCardHeader(id, title),
		createCardForm(id, sortedItems)];
	return generateHtml(dom);
};

const createTemplateList = () => {
	return ['div', { className: 'create-list' },
		['form', { onsubmit: addList },
			['div', { className: ' list-header input-text' },
				['input', {
					type: 'text', name: 'title', id: 'add-list', className: 'border-bottom',
					placeholder: 'Add list...', maxlength: '26', required: true
				}, '']]
		],
		['div', { className: 'temp-card', onclick: showAddList },
			['div', { className: 'fa-solid fa-plus' }, ''],
			['span', {}, 'click to add more']
		]];
};

const showAddList = (event) => {
	const form = document.querySelector('.create-list>form');
	form.style.visibility = 'visible';
	const textBox = document.getElementById('add-list');
	document.querySelector('.temp-card').remove();
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

const drawInMain = (views) => {
	const mainViewElement = document.querySelector('main');
	mainViewElement.innerHTML = '';

	views.forEach(view =>
		mainViewElement.appendChild(view)
	);
};

const renderPage = ({ response }) => {
	const defaultRes = { lists: [], username: 'unknown' }
	const { lists, username } = response ? JSON.parse(response) : defaultRes;
	TODO_RECORDS = lists;

	const templateCard = generateHtml(createTemplateList());
	const listViews = lists.map(generateAList);
	drawInMain([templateCard, ...listViews]);
};

const loadTodo = () => {
	const request = {
		method: 'GET', url: '/todo/api',
	};
	xhrRequest(request, renderPage);
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
	const confirmDelete = confirm('Delete this list ?');
	if (confirmDelete) {
		const request = { method: 'POST', url: '/todo/delete-list', 'content-type': 'application/json' }
		xhrRequest(request, loadTodo, body);
	}
};

const deleteItem = (event) => {
	const listId = event.target.closest('.list').id;
	const itemId = event.target.closest('.item').id;
	const body = JSON.stringify({ listId, itemId });
	const confirmDelete = confirm('Delete this item ?');
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

const editItem = (event) => {
	event.preventDefault();

	const form = event.target.closest('form');
	const formElement = new FormData(form);
	const body = new URLSearchParams(formElement);

	const request = {
		method: 'POST', url: '/todo/edit-item',
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

const searchQuery = (event) => {
	const searchStr = event.target.value;
	if (!searchStr) {
		loadTodo();
	}

	const filteredList = TODO_RECORDS.filter(list => {
		if (list.title.includes(searchStr)) {
			return true;
		}
		console.log(list, list.items.some(item => item.description.includes(searchStr)));
		return list.items.some(item => item.description.includes(searchStr));
	});

	const templateCard = generateHtml(createTemplateList());
	const listViews = filteredList.map(generateAList);
	drawInMain([templateCard, ...listViews]);
};

const main = () => {
	console.log('Home page loaded!');
	const searchBar = document.querySelector('.search');

	searchBar.onkeyup = searchQuery;
	loadTodo();
	searchBar.focus();

};

window.onload = main;
