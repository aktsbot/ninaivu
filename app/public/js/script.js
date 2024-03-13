// https://stackoverflow.com/questions/10462839/how-to-display-a-confirmation-dialog-when-clicking-an-a-link
function hookConfirmDelete() {
  var elems = document.getElementsByClassName("confirm-delete");
  var confirmIt = function (e) {
    if (!confirm("Are you sure?")) e.preventDefault();
  };
  for (var i = 0, l = elems.length; i < l; i++) {
    elems[i].addEventListener("click", confirmIt, false);
  }
}

function start() {
  hookConfirmDelete();
}

start();
