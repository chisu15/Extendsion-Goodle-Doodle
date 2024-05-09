
callDoodle(".doodle-upcoming", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/upcoming")

callDoodle(".all-doodle", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/")

showContent("content1");


function selectFirstButton() {
  var firstButton = document.querySelector('#button1');
  if (firstButton) {
      changeColor(firstButton);
  }
}
function changeColor(button) {
  var buttons = document.querySelectorAll('.button');
  buttons.forEach(function (btn) {
      btn.style.backgroundColor = 'transparent';
      if (btn === button) {
          btn.style.color = '#000'; // Màu chữ trắng cho nút được chọn
      } else {
          btn.style.color = '#fff'; // Màu chữ đen cho các nút còn lại
      }
  });
  button.style.backgroundColor = '#ecb1b1'; // Chọn màu đỏ cho nút được chọn
}
var content1 = document.querySelector('.content1');
var content2 = document.querySelector('.content2');
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
changeColor(button1);
button1.addEventListener("click", function () {
      content1.style.visibility = 'visible';
      content2.style.visibility = 'hidden';
      content1.style.position = 'relative';
      content2.style.position = 'absolute';
      content2.style.top = '0';
      button1.classList.add('active');
      button2.classList.remove('active');
      changeColor(button1);
})
button2.addEventListener("click", function () {
  var content1 = document.querySelector('.content1');
  var content2 = document.querySelector('.content2');
      content1.style.visibility = 'hidden';
      content2.style.visibility = 'visible';
      content2.style.position = 'relative';
      content1.style.position = 'absolute';
      content1.style.top = '0';
      button1.classList.remove('active');
      button2.classList.add('active');
      changeColor(button2);
})
function showContent(contentId) {
  console.log(111111111111);
  // var buttonDoodle = document.querySelector(".");

}






function callDoodle(classEle, api) {

fetch(api)
  .then(function (response) {
    return response.json();
  })
  .then(function (doodle) {
    // console.log(doodle)
    doodleType = doodle;
    console.log(doodleType);
const doodleListEle = document.querySelector(`${classEle}`)
const doodlePreview = document.querySelector(".doodle-preview")
doodleType.forEach((item) => {
  let doodle = `<div class="doodle">
  <img class = "ele" src="${item.image}" alt="">

  </div>`
  doodleListEle.innerHTML += doodle;
})

let linkDoodle = ""
let doodleList = document.querySelectorAll(".doodle")
let currentIndexDoodle = 0;
let nextLinkDoodle = "";

const changeBtn = document.querySelector("#changeDoodle");
const timer = document.querySelector("#timer")
doodleList.forEach((item) => {
  item.addEventListener('click', () => {
    doodleList.forEach((it) => {
      if (it != item) {
        it.classList.remove("check")
      }
    })

    item.classList.add("check");
    let imgDoodle = item.querySelector("img");
    linkDoodle = imgDoodle.getAttribute("src");
    doodlePreview.innerHTML = `<img class = "ele-preview" src="${linkDoodle}" alt=""></img>`
    console.log("LINK DOODLE: "+item.innerHTML);

      // const slider = document.getElementById("myRange");
      // const decrementBtn = document.querySelector(".decrement");
      // const incrementBtn = document.querySelector(".increment");
      
      // decrementBtn.addEventListener("click", function() {
      //     // Giảm giá trị của slider khi click vào dấu "-"
      //     slider.value = parseInt(slider.value) - 5;
      //     console.log(parseInt(slider.value));
      //     // Kích hoạt sự kiện input để cập nhật giá trị của slider
      //     slider.dispatchEvent(new Event("input"));
      //     link
      //     doodlePreview.innerHTML = `<img class = "ele-preview" src="${linkDoodle}" alt="" width="auto + ${slider.value}" height = "${92}"></img>`
      // });
  
      // incrementBtn.addEventListener("click", function() {
      //     // Tăng giá trị của slider khi click vào dấu "+"
      //     slider.value = parseInt(slider.value) + 5;
      //     // Kích hoạt sự kiện input để cập nhật giá trị của slider
      //     slider.dispatchEvent(new Event("input"));
      // });

  

    doodleType.forEach((item) => {
      if (item.link == linkDoodle) {
        currentIndexDoodle = doodleType.indexOf(item)
        nextLinkDoodle = doodleType[(currentIndexDoodle + 1) % doodleType.length].link;
        console.log(currentIndexDoodle);
        console.log(nextLinkDoodle)
      }
    })
  })
})


const slider = document.getElementById("myRange");
const decrementBtn = document.querySelector(".decrement");
const incrementBtn = document.querySelector(".increment");

decrementBtn.addEventListener("click", function() {
    // Giảm giá trị của slider khi click vào nút "Decrease"
    slider.value = parseInt(slider.value) - 1;
    // Kích hoạt sự kiện input để cập nhật giá trị của slider
    slider.dispatchEvent(new Event("input"));
});

incrementBtn.addEventListener("click", function() {
    // Tăng giá trị của slider khi click vào nút "Increase"
    slider.value = parseInt(slider.value) + 1;
    // Kích hoạt sự kiện input để cập nhật giá trị của slider
    slider.dispatchEvent(new Event("input"));
});

slider.addEventListener("input", function() {
    const value = parseInt(slider.value);
    const doodleImg = document.querySelector(".ele-preview");
    doodleImg.style.width = value + "%"; // Cập nhật chiều rộng của doodle dựa trên giá trị của slider
    console.log(doodleImg.style.width);
});

function sendMessageToContentScript(message, height) {
  return new Promise((resolve) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      console.log("Tabs:", tabs);
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        link: message,
        height: height
      }, () => {
        resolve();
      });
    });
  });
}

changeBtn.addEventListener("click", (event) => {
  console.log(timer.value);
  // let location = window.location.href;
  // if (location == 'chrome://new-tab-page/') {
  //   location = "https://www.google.com/";
  //   window.location.href = location
  // }
  if (timer.value) {
    setInterval(() => {
      sendMessageToContentScript(linkDoodle);
      currentIndexDoodle = (currentIndexDoodle + 1) % doodleType.length;
      nextLinkDoodle = doodleType[currentIndexDoodle].link;
      linkDoodle = nextLinkDoodle;
      console.log(linkDoodle);
    }, timer.value * 1000)
  } else {
    let doodle = document.querySelector(".ele-preview");
    let height = doodle.style.width;
    console.log(linkDoodle + "            " + height);
    sendMessageToContentScript(linkDoodle, height);
  }
  event.preventDefault()
})
  })

}