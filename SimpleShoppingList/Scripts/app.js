var currentList = {};

function createShoppingList() {
    currentList.name = $("#shoppingListName").val();
    currentList.items = new Array();
    //Web service call

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ShoppingListsEF/",
        data: currentList,
        success: function (result) {
            currentList = result;
            showShoppingList();
            history.pushState({ id: result.id }, result.name, "?id=" + result.id);
        },
        error: function () {
            console.error("Something bad happend! :(");
        }
    });

    //showShoppingList();
}

function showShoppingList() {
    $("#shoppingListTitle").html(currentList.name);
    $("#shoppingListItems").empty();

    $("#createListDiv").hide();
    $("#shoppingListDiv").show();

    $("#newItemName").val("");
    $("#newItemName").focus();
    $("#newItemName").unbind("keyup");
    $("#newItemName").keyup(function (event) {
        if (event.keyCode == 13) {
            addItem();
        }
    });
}

function addItem() {
    var newItem = {};
    newItem.name = $("#newItemName").val();
    newItem.shoppingListId = currentList.id;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "api/ItemsEF/",
        data: newItem,
        success: function (result) {
            currentList = result;
            drawItems();
            $("#newItemName").val("");
        },
        error: function () {
            console.error("Something bad happend! :(");
        }
    });

    //currentList.items.push(newItem);
    //console.info(currentList); 
}

function drawItems() {
    var $list = $("#shoppingListItems").empty();

    for (var i = 0; i < currentList.items.length; i++) {
        var currentItem = currentList.items[i]
        var $li = $("<li>").html(currentItem.name).attr("id", "item_" + i);
        var $deleteBtn = $("<button onclick='deleteItem(" + currentItem.id + ")'>D</button>").appendTo($li);
        var $checkBtn = $("<button onclick='checkItem(" + currentItem.id + ")'>C</button>").appendTo($li);

        if (currentItem.checked) {
            $li.addClass("checked");
        }

        $li.appendTo($list);
    }
}

function deleteItem(itemId) {
    //currentList.items.splice(index, 1);
    //drawItems();

    $.ajax({
        type: "DELETE",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        success: function (result) {
            currentList = result;
            drawItems();
        },
        error: function () {
            console.error("Something bad happend! :(");
        }
    });
}

function checkItem(itemId) {
    //if ($("#item_" + index).hasClass("checked")) {
    //    $("#item_" + index).removeClass("checked");
    //}else {
    //    $("#item_" + index).addClass("checked");
    //}

    //var item = currentList.items[index];
    //item.checked = !item.checked;

    var changedItem = {};

    for (var i = 0; i < currentList.items.length; i++) {
        if (currentList.items[i].id == itemId) {
            changedItem = currentList.items[i];
        }
    }

    changedItem.checked = !changedItem.checked;

    $.ajax({
        type: "PUT",
        dataType: "json",
        url: "api/ItemsEF/" + itemId,
        data: changedItem,
        success: function (result) {
            changedItem = result;
            drawItems();
        },
        error: function () {
            console.error("Something bad happend! :(");
        }
    });
}

function getShoppingListById(id) {
    debugger;
    //console.info(id);

    //currentList.name = "Mock Shopping List";
    //currentList.items = [
    //    { name: "Milk" },
    //    { name: "Cornflakes" },
    //    { name: "Strawberries" }
    //];
    //showShoppingList();
    //drawItems();

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "api/ShoppingListsEF/" + id,
        success: function (result) {
            console.log(result);
            alert(result);
            currentList = result;
            showShoppingList();
            drawItems();
        },
        error: function () {
            console.error("Something bad happend! :(");
        }
    });
}

function hideShoppingList() {
    $("#createListDiv").show();
    $("#shoppingListDiv").hide();

    $("#shoppingListName").val("");
    $("#shoppingListName").focus();
    $("#shoppingListName").unbind("keyup");
    $("#shoppingListName").keyup(function (event) {
        if (event.keyCode == 13) {
            createShoppingList();
        }
    });
}


$(document).ready(function () {
    console.info("ready");

    hideShoppingList();

    //$("#shoppingListName").focus();
    //$("#shoppingListName").keyup(function (event) {
    //    if (event.keyCode == 13) {
    //        createShoppingList();
    //    }
    //});

    var pageUrl = window.location.href;
    var idIndex = pageUrl.indexOf("?id=");

    if (idIndex != -1) {
        getShoppingListById(pageUrl.substring(idIndex + 4));
    }

    window.onpopstate = function (event) {
        if (event.state == null) {
            // hide shopping list
            hideShoppingList();
        }
        else {
            getShoppingListById(event.state.id);
        }
    };
});