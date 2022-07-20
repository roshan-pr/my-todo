['div', { class: 'list' },
  ['div', { class: 'header' },
    ['div', { class: 'title' }, '--title--'],
    ['div', { class: 'deleteIcon' }, ['img', { id: 'delete', src: '/icon/garbage.png', alt: 'bin' }, '']]
  ],
  ['form', { action: '/add-item', method: 'post' },
    ['div', { class: 'items' }, () => `Checkboxes`],
    ['div', { class: 'add-item' },
      ['input', { type: 'text', id: 'add-item', placeholder: '...add item' }, '']]
  ]
]