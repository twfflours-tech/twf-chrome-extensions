l(dimensions);

var tableRows = document.querySelectorAll("table>tr table>tr:last-child");
// l(tableRows);

tableRows.forEach(tableRow => {
  var textColumn = tableRow.querySelector("td.a-span5");
  // l(textColumn);
  var inputColumn = tableRow.querySelector("td.a-span4");
  // l(inputColumn);
  var titleText = textColumn.querySelector(".a-col-right > div:first-of-type")
    .textContent;
  l(titleText);
  var skuAndQuantityDiv = textColumn.querySelector(
    ".a-col-right > div:last-of-type"
  );

  l(skuAndQuantityDiv.childNodes);

  var quantityDiv = skuAndQuantityDiv.querySelector(".multi-quantity-badge");
  var text = "";
  if (quantityDiv) {
    text = Number(quantityDiv.textContent.replace("Quantity :", ""));
  }
  l(text);
});

// var lengthInputs;
// lengthInputs = document.querySelectorAll('input[name="length"]');
// lengthInputs.forEach(input => {
//   console.log(input.value);
// });

// fillField(document.querySelectorAll('input[name="length"]')[0], value)
function fillforms(data) {
  fillField(document.querySelector('input[name="fullname"]'), data.title);
  fillField(document.querySelector('input[name="email"]'), data.author);
  fillField(document.querySelector('input[name="city"]'), data.pages);

  //form2
  fillField(document.getElementById("field1"), data.title);
  fillField(document.querySelector('input[aria-label="field2"]'), data.author);
  fillField(document.querySelector('input[class="field3"]'), data.pages);
}

function fillField(selector, value) {
  var field = selector();
  fillField(field, value);
}

function fillField(field, value) {
  if (field) {
    field.value = value;
  }
}

// function fillforms1(data){
//     //form1
//     var fullname = document.querySelector('input[name="fullname"]');
//     fillField(fullname, data[0]);

//     var email = document.querySelector('input[name="email"]');
//     fillField(email, data[1]);

//     //city
//     var city = document.querySelector('input[name="city"]');
//     fillField(city, data[2]);

//     //form2
//     var field1 = document.getElementById('field1');
//     fillField(field1, data[0]);

//     var field2 = document.querySelector('input[aria-label="field2"]');
//     fillField(field2, data[1]);

//     //probably terrible to look for a class like this..
//     var field3 = document.querySelector('input[class="field3"]');
//     fillField(field3, data[2]);
// }

// {
//     "title":"The Cat in the Hat",
//     "author":"Dr. Seuss",
//     "pages":"48"
// }
// function fillforms2(data){
//     //form1
//     var title = document.querySelector('input[name="fullname"]');
//     fillField(title, data.title);

//     var author = document.querySelector('input[name="email"]');
//     fillField(author, data.author);

//     //form2
//     var field1 = document.getElementById('field1');
//     fillField(field1, data.title);

//     //probably terrible to look for a class like this..
//     var field3 = document.querySelector('input[class="field3"]');
//     fillField(field3, data.pages)
// }
