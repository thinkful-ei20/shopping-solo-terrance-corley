'use strict';

/* global $ */

/* TO DO:
		1) Fix bugs outlined on line 165
		2) Refactor line 31
		3) Add btn to dom to display full list when clicked
*/

const STORE = {
  items: [
		{name: "oranges", checked: false, editing: false},
		{name: "milk", checked: true, editing: false},
		{name: "bread", checked: false, editing: false},
		{name: "apples", checked: false, editing: false}
	],
	hideCompleted: false,
	searchTerm: null,
};


function generateItemElement(item, itemIndex, template) {
	let hide = false;

	if (STORE.hideCompleted && item.checked) {
		hide = true;
	}
	console.log(item);
	if (STORE.searchTerm !== null) {
		if (item.name.includes(STORE.searchTerm)) {
			// refactor html -- consider creating additional function
			return `
			<li class="js-item-index-element ${hide ? "hidden" : ''}" data-item-index="${itemIndex}">
				<span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
				<div class="shopping-item-controls">
					<button class="shopping-item-toggle js-item-toggle">
						<span class="button-label">check</span>
					</button>
					<button class="shopping-item-delete js-item-delete">
						<span class="button-label">delete</span>
					</button>
					<button class="shopping-item-edit js-item-edit">
						<span class="button-label">edit</span>
					</button>
				</div>
			</li>`;
		}
	} else {
		return `
    <li class="js-item-index-element ${hide ? "hidden" : ''}" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
				</button>
				<button class="shopping-item-edit js-item-edit">
					<span class="button-label">edit</span>
				</button>
      </div>
    </li>`;
	}

  
}


function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}


function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE.items);
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteClickedItem(itemIndex) {
	STORE.items.splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
	$('.js-shopping-list').on('click', '.js-item-delete', event => {
		const itemIndex = getItemIndexFromElement(event.currentTarget);
		deleteClickedItem(itemIndex);
		renderShoppingList();
	});
}

function handleCheckedFilter() {
	$('.js-checked-items-filter').change(event => {
		STORE.hideCompleted = !STORE.hideCompleted;
		renderShoppingList();
	});
}

function searchItems(itemSearched) {
	STORE.searchTerm = itemSearched;
}

function handleSearch() {
	$('.js-search-form').submit(event => {
		event.preventDefault();
		let itemSearched = $('.js-search-input').val();
		searchItems(itemSearched);
		$('.js-search-input').val('');
		renderShoppingList();
	});
}

function handleEdit() {
	$('.js-shopping-list').on('click', '.js-item-edit', event => {
		let itemIndex = getItemIndexFromElement(event.target);
		STORE.items[itemIndex].editing = !STORE.items[itemIndex].editing;
		let item = STORE.items[itemIndex];
		renderEdit(item, itemIndex);
	});
}

function renderEdit(item, index) {
	if (item.editing) {
		$(`.js-shopping-list li:nth-child(${index + 1})`).find('.js-shopping-item').replaceWith('<input class="js-rename-input" type="text" placeholder="enter new name">');
		
		$(`.js-shopping-list li:nth-child(${index + 1}) .js-item-edit`).find('span').text('done');
	} else {
		// fix bug when editing searched items *TypeErr*
		console.log($('.js-rename-input').val());
		item.name = $('.js-rename-input').val();

		$('.js-rename-input').replaceWith(`<span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>`);
		
		$(`.js-shopping-list li:nth-child(${index + 1}) .js-item-edit`).find('span').text('edit');
	}
}

function handleShoppingList() {
  renderShoppingList();
	handleNewItemSubmit();
  handleItemCheckClicked();
	handleDeleteItemClicked();
	handleCheckedFilter();
	handleSearch();
	handleEdit();
}

$(handleShoppingList);