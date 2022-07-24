const getElementIndex = (array, id) => {
  let index = 0;
  while (index < array.length) {
    if (array[index].id === id)
      return index;
    index++;
  }
  return -1;
};

class Todo {
  #lastListId;
  #lists;
  #saver;
  constructor(lastListId, lists, saver) {
    this.#lastListId = lastListId;
    this.#lists = lists;
    this.#saver = saver;
  }

  #createList(id, title) {
    return { id, lastItemId: 0, title, items: [] }
  };

  #createItem(id, description) {
    return { id, description, status: false };
  };

  addList(title) {
    const newListId = ++this.#lastListId;
    const newList = this.#createList(newListId, title);

    this.#lists.unshift(newList);
    return true;
  };

  #getList(listId) {
    return this.#lists.find(list => list.id === listId);
  }

  #getItem(listId, itemId) {
    const list = this.#getList(listId) || [];
    return list.items.find(item => item.id === itemId);
  }

  addItem(listId, description) {
    const list = this.#getList(+listId);
    if (list) {
      const newItemId = ++list.lastItemId;
      const item = this.#createItem(newItemId, description);
      list.items.push(item); // Updating in memory
      return true;
    }
    return false;
  };

  markItem(listId, itemId, status) {
    const item = this.#getItem(+listId, +itemId);
    if (item) {
      item.status = status;
      return true;
    }
    return false;
  };

  deleteList(listId) {
    const listIndex = getElementIndex(this.#lists, +listId);
    if (listIndex >= 0) {
      this.#lists.splice(listIndex, 1);
      return true;
    };
    return false;
  };

  deleteItem(listId, itemId) {
    const list = this.#getList(+listId);
    const itemIndex = list && getElementIndex(list.items, +itemId);

    if (itemIndex >= 0) {
      list.items.splice(itemIndex, 1);
      return true;
    };
    return false;
  };

  save() {
    this.#saver(this.getInfo());
  }

  getInfo() {
    return { lastListId: this.#lastListId, lists: this.#lists };
  }
}

module.exports = { Todo };
