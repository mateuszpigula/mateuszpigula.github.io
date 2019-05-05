function changeNumber(){
  const elements = document.querySelectorAll('.pound-rating');
  for (let i=0; i<elements.length; i++) {
      const element = elements[i];
      const length = parseInt(element.innerHTML);
      const arr = new Array(5);
      const emptyRating = `<span class="pound-rating--star">£</span>`;
      const filledRating = `<span class="pound-rating--star pound-rating--star__active">£</span>`;
      arr.fill(emptyRating, length, 5);
      arr.fill(filledRating, 0, length);
      
      element.innerHTML = arr.join('');
  }
}

function showModal(name, rating, reference, value) {
  const modal = document.querySelector(".modal");
  const modalContent = $(".modal-content");
  const modalBody = $(".modal-body");
  const modalTitle = modal.querySelector(".modal-title");

  modal.classList.add("modal__active");

  modalTitle.innerHTML = name;
  modalBody.find("#modal--rating").html(rating);
  modalBody.find("#modal--reference").html(reference);
  modalBody.find("#modal--value").html(value);

  $(".close-modal").click(() => {
    modal.classList.remove("modal__active");
  });

  $(document).keyup(function(e) {
    if (e.keyCode === 27) modal.classList.remove("modal__active");
  });

  $(document).mouseup(function(e){
    if (!modalContent.is(e.target) && modalContent.has(e.target).length === 0) {
      modal.classList.remove("modal__active");
    }
  });
}

$(document).ready(function() {

function pagination() {
  const urlIndex = window.location.hash.slice(1,2);
  const elements = document.querySelectorAll('.pagination li a');
  if(urlIndex > 0 && urlIndex < elements.length - 1) loadJson(elements[urlIndex], urlIndex, elements);
  else loadJson(elements[1], 1, elements);
  elements.forEach((elem, index, array) => {
    elem.addEventListener('click', function() {
      loadJson(elem, index, array);
    })
  });
}
pagination();

function loadJson(elem, index, array) {
  const active = document.querySelector("li.active a");
  const activeNumber = parseInt(active.innerHTML);

  if(index === 0) {
    if(activeNumber > 1) {
      active.parentNode.classList.remove("active");
      loadWithAjax(activeNumber - 1);
      array[activeNumber - 1].parentNode.classList.add("active");
    } else {
      elem.setAttribute('href', "#1");
    };
  }
  if(index === array.length - 1) {
    if(activeNumber < array.length - 2) {
      active.parentNode.classList.remove("active");
      loadWithAjax(activeNumber + 1);
      array[activeNumber + 1].parentNode.classList.add("active");
    } else {
      elem.setAttribute('href', "#"+activeNumber);
    };
  }
  else if(index !== 0 && index !== array.length - 1) {
    active.parentNode.classList.remove("active");
    loadWithAjax(index);
    elem.parentNode.classList.add("active");
  } 
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function loadWithAjax(index) {
  const name = getParameterByName("name");
  const rating = getParameterByName("rating");

  $.ajax(`page${index}.json`, {
    dataType: "json",
    success: function(data) {
      $('table tbody').empty();
      $(data).each(function(index, value) {
        if(name == null || value.name.toLowerCase().includes(name.toLowerCase())) {
          if(rating == null || value.rating == rating) {
            const record = 
            `<tr class="clickable-row">
              <td id="supplier-name">${value.name}</td>
              <td id="supplier-rating" data-rating="${value.rating}" class="pound-rating">${value.rating}</td>
              <td id="supplier-reference">${value.reference}</td>
              <td id="supplier-value">£${formatNumber(value.value)}</td>
            </tr>`;
            $('table tbody').append(record);
          }
        }
      });
      window.location.hash = "#" + index;
    }
  })
  .done(changeNumber)
  .done(() => {
    $(".clickable-row").click(function () {
      const name = $(this).find("#supplier-name").html();
      const rating = $(this).find("#supplier-rating").html();
      const reference = $(this).find("#supplier-reference").html();
      const value = $(this).find("#supplier-value").html();

      showModal(name, rating, reference, value);
    });
  });
}

document.querySelector("form.search-bar").addEventListener("submit", function(e){
  const inputElements = this.querySelectorAll("input, select, checkbox, textarea");
  inputElements.forEach(elem => {
      if(!elem.value) elem.setAttribute("disabled", "");
  });
  return true;
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setInputs() {
  if(getParameterByName("name")) {
    let input = document.querySelector("#name");
    input.value = getParameterByName("name");
  }
  if(getParameterByName("rating")) {
      let input = document.querySelector("#rating");
      input.value = getParameterByName("rating");
  }
}

setInputs();
})