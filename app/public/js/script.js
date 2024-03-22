function formatDate(value) {
  let date = new Date(value);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.toLocaleString("default", { year: "numeric" });
  const time = date.toLocaleString("default", {
    hour: "numeric",
    minute: "numeric",
  });
  return day + "/" + month + "/" + year + " " + time;
}

function fixDateTime() {
  document.querySelectorAll(".fix-datetime").forEach((e) => {
    let text = e.textContent;
    const date = formatDate(text);
    e.textContent = date;
  });
}

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
  fixDateTime();
}

start();
