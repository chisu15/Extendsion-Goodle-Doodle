scrollLeftList(".prevYour", ".your-doodle")
scrollRightList(".nextYour", ".your-doodle")
scrollLeftList(".prevUpcome", ".doodle-upcoming")
scrollRightList(".nextUpcome", ".doodle-upcoming")
scrollLeftList(".prevAll", ".all-doodle")
scrollRightList(".nextAll", ".all-doodle")
scrollLeftList(".prevGame", ".game-doodle")
scrollRightList(".nextGame", ".game-doodle")
scrollLeftList(".prevFav", ".favorite-doodle")
scrollRightList(".nextFav", ".favorite-doodle")

var content1 = document.querySelector('.content1');
var content2 = document.querySelector('.content2');
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');

changeColor(button1);
content2.style.display = 'none';
button1.addEventListener("click", function () {
  content2.style.display = 'none';
  content1.style.display = 'block';
  button1.classList.add('active');
  button2.classList.remove('active');
  changeColor(button1);
  updateDoodleList();
})
button2.addEventListener("click", function () {
  var content1 = document.querySelector('.content1');
  var content2 = document.querySelector('.content2');
  content1.style.display = 'none';
  content2.style.display = 'block';
  button1.classList.remove('active');
  button2.classList.add('active');
  changeColor(button2);

})


function scrollLeftList(classBtn, classList) {
    const prevButton = document.querySelector(`${classBtn}`);
    prevButton.addEventListener('click', function () {
      const doodleContainer = document.querySelector(`${classList}`);
      const scrollStep = 200;
      doodleContainer.scrollLeft -= scrollStep;
      console.log(1111111111111111111111111111111111);
    });
  }
  
  function scrollRightList(classBtn, classList) {
    const nextButton = document.querySelector(`${classBtn}`);
    nextButton.addEventListener('click', function () {
      const doodleContainer = document.querySelector(`${classList}`);
      const scrollStep = 200;
      doodleContainer.scrollLeft += scrollStep;
    });
  }