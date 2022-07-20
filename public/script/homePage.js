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

const createCheckbox = (items) => {
	const checkboxes = items.map(({ id, desc, status }) => {
		const state = status ? 'checked' : '';
		const dom = ['div', {},
			['input', { type: "checkbox", id: id, [state]: '' }, ''],
			['label', {}, desc]]
		return generateHtml(dom);
	});
	return checkboxes.join('');
};

const createImgTag = (id, src, alt) => createElement('img', { id, src, alt }, '');

const createAList = ({ id, title, items }) => {
	const dom = ['div', { class: 'list', id },
		['div', { class: 'list-header' },
			['div', { class: 'title' }, title],
			['div', { class: 'icon' }, createImgTag('delete', '/icons/garbage.png', 'bin')]
		],
		['form', { action: '/add-item', method: 'post' },
			['div', { class: 'items' }, createCheckbox(items)],
			['div', { class: 'add-item' },
				['input', { type: 'text', id: 'add-item', placeholder: '...add item' }, '']]
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

const renderLists = (xhr) => {
	const defaultRes = { lists: [], username: 'unknown' }
	const { lists, username } = xhr.response ? JSON.parse(xhr.response) : defaultRes;
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

const main = () => {
	console.log('Home page loaded!');
	loadTodo();
};

window.onload = main;
