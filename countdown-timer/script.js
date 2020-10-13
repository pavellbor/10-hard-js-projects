const timer = document.querySelector("table").rows[0];

setInterval(() => {
  const duration = new Date(2021, 0) - new Date();

  const seconds = Math.floor(duration / 1000 % 60)
  const minutes = Math.floor(duration / 1000 / 60 % 60)
  const hours = Math.floor(duration / 1000 / 60 / 60 % 24)
  const days = Math.floor(duration / 1000 / 60 / 60 / 24)

  timer.cells[0].textContent = addZero(days);
  timer.cells[1].textContent = addZero(hours);
  timer.cells[2].textContent = addZero(minutes);
  timer.cells[3].textContent = addZero(seconds);
}, 1000);

function addZero(value) {
  return (String(value).length < 2) ? '0' + value : value;
}
