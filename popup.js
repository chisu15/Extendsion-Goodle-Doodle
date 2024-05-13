callDoodle(".doodle-upcoming", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/upcoming")

callDoodle(".all-doodle", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/")

scrollLeftList(".prevYour", ".your-doodle")
scrollRightList(".nextYour", ".your-doodle")
scrollLeftList(".prevUpcome", ".doodle-upcoming")
scrollRightList(".nextUpcome", ".doodle-upcoming")
scrollLeftList(".prevAll", ".all-doodle")
scrollRightList(".nextAll", ".all-doodle")

let nameDoodle;


let uploadBox = document.querySelector(".upload-box");

let imageInput = document.querySelector("#doodle-input");
let bufferDoodleUser;

uploadBox.addEventListener("click", () => {
  imageInput.click();
  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      uploadBox.innerHTML = `<img id="user-doodle" src="${reader.result}" alt="Preview Image">`;
      bufferDoodleUser = reader.result;
    }
    reader.readAsDataURL(file);
  });
})
console.log(bufferDoodleUser);
let formUpload = document.querySelector("#form-upload");
formUpload.addEventListener("submit", (e) => {
  chrome.storage.local.get("doodleUpload", (res) => {
    const savedDoodle = res.doodleUpload || [];
    savedDoodle.push(bufferDoodleUser);
    chrome.storage.local.set({ "doodleUpload": savedDoodle }, () => {
      console.log("Doodle đã được lưu vào localStorage:", bufferDoodleUser);
      alert("Lưu thành công!")
    });
  });
  e.preventDefault();
})

let yourDoodleList = document.querySelector(".your-doodle")
chrome.storage.local.get("doodleUpload", (res) => {
  const savedDoodle = res.doodleUpload;
  console.log(savedDoodle);
  if (savedDoodle && Array.isArray(savedDoodle)) {
    savedDoodle.forEach(function (item) {
      // Tạo phần tử doodle và thêm vào yourDoodleList
      let doodle = `<div class="doodle">
        <img class = "ele" src="${item}" alt="" loading="lazy">
        </div>`
      yourDoodleList.innerHTML += doodle;
    });
  }
});

function selectRandomDoodle() {
  // Lấy tất cả các Doodle do người dùng tải lên từ local storage
  chrome.storage.local.get("doodleUpload", (res) => {
    const uploadedDoodles = res.doodleUpload || [];
    // Lấy tất cả các Doodle hiện có trong UI
    const doodles = Array.from(document.querySelectorAll('.doodle img'));

    // Thêm các Doodle do người dùng tải lên vào danh sách
    uploadedDoodles.forEach(doodleData => {
      const imgElement = document.createElement('img');
      imgElement.src = doodleData;
      doodles.push(imgElement);
    });

    if (doodles.length > 0) {
      const randomIndex = Math.floor(Math.random() * doodles.length);
      const randomDoodle = doodles[randomIndex];

      // Hiển thị Doodle ngẫu nhiên trong khu vực preview
      const doodlePreview = document.querySelector(".doodle-preview img");
      doodlePreview.src = randomDoodle.src;
    } else {
      console.log("No doodles available to display.");
    }
  });
}

// Thêm sự kiện lắng nghe cho nút "Random Doodle"
document.getElementById('btn-random').addEventListener('click', selectRandomDoodle);

function scrollLeftList(classBtn, classList) {
  const prevButton = document.querySelector(`${classBtn}`);
  prevButton.addEventListener('click', function () {
    const doodleContainer = document.querySelector(`${classList}`);
    const scrollStep = 100;
    doodleContainer.scrollLeft -= scrollStep;
    console.log(1111111111111111111111111111111111);
  });
}

function scrollRightList(classBtn, classList) {
  const nextButton = document.querySelector(`${classBtn}`);
  nextButton.addEventListener('click', function () {
    const doodleContainer = document.querySelector(`${classList}`);
    const scrollStep = 100;
    doodleContainer.scrollLeft += scrollStep;
  });
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

// Hiển thị hình ảnh trước khi tải lên

var content1 = document.querySelector('.content1');
var content2 = document.querySelector('.content2');
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
var btnOn = document.getElementById("onDefault");
var btnOff = document.getElementById("offDefault");
changeColor(button1);
content2.style.display = 'none';
button1.addEventListener("click", function () {
  content2.style.display = 'none';
  content1.style.display = 'block';
  button1.classList.add('active');
  button2.classList.remove('active');
  changeColor(button1);
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

function callDoodle(classEle, api) {
  fetch(api)
    .then(function (response) {
      return response.json();
    })
    .then(function (doodle) {

      // console.log(doodle)
      doodleType = doodle;
      const doodleListEle = document.querySelector(`${classEle}`)
      const doodlePreview = document.querySelector(".doodle-preview")

      doodleType.forEach((item) => {
        let doodle = `<div class="doodle">
        <img class = "ele" src="${item.image}" alt="${item.title}" loading="lazy">
        </div>`
        doodleListEle.innerHTML += doodle;
      })

      let linkDoodle = ""
      let doodleList = document.querySelectorAll(".doodle")
      let currentIndexDoodle = 0;
      let nextLinkDoodle = "";


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
          nameDoodle = imgDoodle.getAttribute("alt");
          linkDoodle = imgDoodle.getAttribute("src");
          doodlePreview.innerHTML = `<img class = "ele-preview" src="${linkDoodle}" alt=""></img>`
          console.log("LINK DOODLE: " + item.innerHTML);


          doodleType.forEach((item) => {
            if (item.image == linkDoodle) {
              currentIndexDoodle = doodleType.indexOf(item)
              nextLinkDoodle = doodleType[(currentIndexDoodle + 1) % doodleType.length].image;
              console.log(currentIndexDoodle);
              console.log(nextLinkDoodle)
            }
          })
        })
      })


      const slider = document.getElementById("myRange");
      const decrementBtn = document.querySelector(".decrement");
      const incrementBtn = document.querySelector(".increment");

      decrementBtn.addEventListener("click", function () {
        // Giảm giá trị của slider khi click vào nút "Decrease"
        slider.value = parseInt(slider.value) - 1;
        // Kích hoạt sự kiện input để cập nhật giá trị của slider
        slider.dispatchEvent(new Event("input"));
      });

      incrementBtn.addEventListener("click", function () {
        // Tăng giá trị của slider khi click vào nút "Increase"
        slider.value = parseInt(slider.value) + 1;
        // Kích hoạt sự kiện input để cập nhật giá trị của slider
        slider.dispatchEvent(new Event("input"));
      });

      slider.addEventListener("input", function () {
        const value = parseInt(slider.value);
        const doodleImg = document.querySelector(".ele-preview");
        doodleImg.style.width = value + "%"; // Cập nhật chiều rộng của doodle dựa trên giá trị của slider
        console.log(doodleImg.style.width);
      });
    })

}


document.getElementById('changeDoodle').addEventListener('click', function(event) {
  event.preventDefault(); // Ngăn trình duyệt thực hiện hành động mặc định

  const datetime = document.getElementById('timer').value; // Lấy giá trị datetime từ input
  const link = document.querySelector(".ele-preview").src; // URL của Doodle hiện tại trong preview
  const height = document.querySelector(".ele-preview").style.width; // Chiều cao mặc định, cần điều chỉnh nếu cần
  if (datetime) {
    // Nếu người dùng đã chọn một thời điểm
    const scheduleTime = new Date(datetime).getTime();
    const now = Date.now();

    if (scheduleTime > now) {
      // Lập lịch thay đổi Doodle nếu thời gian là tương lai
      chrome.runtime.sendMessage({
        action: "setDoodleAlarm",
        name: nameDoodle,
        link: link,
        height: height,
        when: scheduleTime
    });
    } else {
      alert('Please select a future time.');
    }
  } else {
    // Nếu không có thời gian được chọn, thay đổi Doodle ngay lập tức
    sendMessageToContentScript(link , height);
  }
});



function sendMessageToContentScript(doodleLink, height, buffer, when) {
  console.log("Preparing to send message with link:", doodleLink);
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      console.log("Sending to tab:", activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, {
        link: doodleLink,
        height: height,
        buffer: buffer,
        when: when
      }, (response) => {
        console.log("Message sent", response);
      });
    } else {
      console.log("No active tab found.");
    }
  });
}
function setDoodleAlarm(link, height, when) {
  chrome.storage.local.set({link: link, height: height}, function() {
    chrome.alarms.create('changeDoodle', {when: when});
  });
}