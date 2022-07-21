createElement = (tag, attributes, content) => {
	let properties = '';
	for (const key in attributes) {
		properties += attributes[key] ? `${key}="${attributes[key]}"` : key;
	}
	return `<${tag} ${properties}>${content}</${tag}>`;
};

const generateHtml = ([tag, attribute, ...rest]) => {
	const childElements = rest.map(element =>
		Array.isArray(element) ? generateHtml(element) : element
	).join('');

	return createElement(tag, attribute, childElements);
};

const createCheckbox = (items, listId) => {
	const checkboxes = items.map(({ id, description, status }) => {
		const state = status ? 'checked' : '';
		const dom = ['div', { class: 'item', id: id }, ['div', {},
			['input', { type: "checkbox", id: id, onclick: 'markItem(event)', [state]: '' }, ''],
			['label', {}, description]],
			['label', { class: 'delete-item', onclick: 'deleteItem(event)' }, 'X']
		]
		return generateHtml(dom);
	});
	return checkboxes.join('');
};

const createImgTag = (id, src, alt) => createElement('img', { id, src, alt }, '');

const createAList = ({ id, title, items }) => {
	const dom = ['div', { class: 'list', id },
		['div', { class: 'list-header' },
			['div', { class: 'title' }, title],
			['div', { class: 'icon', onclick: 'deleteList(event)' },
				createImgTag('delete', '/icons/garbage.png', 'bin')]
		],
		['form', { action: '/todo/add-item', id, method: 'post' },
			['div', { class: 'items' }, createCheckbox(items, id)],
			['input', { type: 'hidden', name: 'listId', value: id }, ''],
			['div', { class: 'add-item', style: 'display:flex' },
				['input', { type: 'text', name: 'description', id: 'add-item', placeholder: '...add item', required: '' }, ''],
				['input', { type: 'submit', name: 'submit', id: 'add-item' }, '']]
		]
	];
	return generateHtml(dom);
};

const createAddListTemplate = () => {
	const dom = ['div', { class: 'dummy-list', style: 'align-items:center; justify-content:center' },
		['div', { class: 'add-item', style: 'width:100%' },
			['form', { action: '/todo/add-list', method: 'post' },
				['input', {
					type: 'text', name: 'title', id: 'add-list', placeholder: '... add list', style: 'width:100%'
				}, '']]],
		['div', { class: 'icon' }, createImgTag('add', '/icons/add.png', 'add')],
		['span', {}, 'click to add more']
	];
	return generateHtml(dom);
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
	console.log(lists);
	let htmlLists = lists.map(createAList).join('');

	htmlLists += createAddListTemplate();

	const mainElementView = document.querySelector('main');
	mainElementView.innerHTML = htmlLists;
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
		console.log(body, confirmDelete);
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

const main = () => {
	console.log('Home page loaded!');
	loadTodo();
};

window.onload = main;
