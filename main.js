'use strict';

const STORE = [
  {name: "apples", checked: false},
  {name: "oranges", checked: false},
  {name: "milk", checked: true},
  {name: "bread", checked: false}
];


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}


function renderShoppingList() {
  const shoppingListItemsString = generateShoppingItemsString(STORE);
  $('.js-shopping-list').html(shoppingListItemsString);
}


function addItemToShoppingList(itemName) {
  STORE.push({name: itemName, checked: false});
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
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
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
	STORE.splice(itemIndex, 1);
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
		$('.shopping-item__checked').closest('li').toggleClass('hidden');
	});
}

// User can type in a search term and the displayed list will be filtered by item names only containing that search term
// User can edit the title of an item
// You must use the state management pattern. Update the store; run the render function. Do not directly update the DOM.

function handleShoppingList() {
  renderShoppingList();
	handleNewItemSubmit();
  handleItemCheckClicked();
	handleDeleteItemClicked();
	handleCheckedFilter();
}

$(handleShoppingList);