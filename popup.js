callDoodle(".doodle-upcoming", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/upcoming")

callDoodle(".all-doodle", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/popular")

callDoodle(".game-doodle", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/game")

let dangNhap = document.querySelector(".hidden-menu__dangNhap");
let loginForm = document.querySelector(".login-form");
let userName = document.querySelector(".user-name");
let logoutButton = document.createElement("button");
logoutButton.innerHTML = "Đăng xuất"; // Sử dụng innerHTML thay vì textContent
logoutButton.className = "hidden-menu__button";

// Kiểm tra thông tin người dùng khi mở ứng dụng
document.addEventListener("DOMContentLoaded", function () {
  let userData = localStorage.getItem("userData");
  if (userData) {
    userData = JSON.parse(userData);
    userName.classList.add("active");
    userName.textContent = userData.fullName;
    // loginForm.style.display = "none";
    loginForm.innerHTML = '';
    dangNhap.innerHTML = '';
    loginForm.appendChild(logoutButton);

    callDoodle(".favorite-doodle", `https://google-doodle-v2-v2.vercel.app/api/v1/user/favorite/${userData.id}`);
  } else {

    document.querySelector(".favorite-doodle").innerHTML = `<h1 class="empty">Vui lòng đăng nhập để xem doodle yêu thích của bạn</h1>`;
  }
});

dangNhap.addEventListener("click", function () {
  // Hiển thị form đăng nhập
  loginForm.style.display = "flex";
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let email = loginForm.querySelector(".hidden-menu__input[type='email']").value;
  let password = loginForm.querySelector(".hidden-menu__input[type='password']").value;

  // Gọi API đăng nhập
  fetch("https://google-doodle-v2-v2.vercel.app/api/v1/user/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(">>>>>>>>>", data);
      if (data) {
        let user;
        user = data.user;
        console.log("Đăng nhập thành công");
        // Lưu token vào session và local
        sessionStorage.setItem("token", data.user.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        // Hiển thị thông tin người dùng
        userName.classList.add("active");
        userName.textContent = data.user.fullName;
        console.log(user);
        if (user) {
          callDoodle(".favorite-doodle", `https://google-doodle-v2-v2.vercel.app/api/v1/user/favorite/${user.id}`)
        } else {
          let favDoodle = document.querySelector(".favorite-doodle");
          favDoodle.innerHTML = `<h1 class= "empty">Vui lòng đăng nhập để sử dụng chức năng này</h1>`
        }
        
        loginForm.innerHTML = '';
        dangNhap.innerHTML = '';
        loginForm.appendChild(logoutButton);
      }
    })
    .catch(error => console.error('Lỗi đăng nhập:', error));
    callDoodle(".favorite-doodle", `https://google-doodle-v2-v2.vercel.app/api/v1/user/favorite/${userData.id}`);
});

// Xử lý đăng xuất
logoutButton.addEventListener("click", function() {
  sessionStorage.removeItem("token");
  localStorage.removeItem("userData");
  userName.classList.remove("active");
  userName.textContent = "";
  loginForm.style.display = "flex";
  dangNhap.removeChild(logoutButton);
  document.querySelector(".favorite-doodle").innerHTML = `<h1 class="empty">Vui lòng đăng nhập để xem doodle yêu thích của bạn</h1>`;
});

let mode;

chrome.storage.local.get("mode", (res) => {
  mode = res.mode || "on"; // Mặc định là "off" nếu chưa có giá trị trong storage
  console.log("mode hiện tại: ", mode);

  const toggleBtn = document.getElementById("toggleButton");
  const toggleContainer = document.querySelector(".toggle-default-change");
  const onLabel = document.querySelector(".on-label");
  const offLabel = document.querySelector(".off-label");

  // Hàm cập nhật vị trí nút và hiển thị các nhãn dựa trên mode
  function updateToggle(mode) {
    if (mode === "on") {
      toggleBtn.style.left = "52px"; // Di chuyển nút sang bên phải
      toggleBtn.style.backgroundColor = "#2bdb66"; // Màu xanh cho nút
      onLabel.style.opacity = "1"; // Hiển thị nhãn ON
      offLabel.style.opacity = "0"; // Ẩn nhãn OFF
      toggleBtn.innerHTML = "ON"; // Thêm chữ ON vào nút
      toggleContainer.style.border = "2px #2bdb66 solid";
    } else {
      toggleBtn.style.left = "2px"; // Di chuyển nút sang bên trái
      toggleBtn.style.backgroundColor = "#cf354a"; // Màu đỏ cho nút
      onLabel.style.opacity = "0"; // Ẩn nhãn ON
      offLabel.style.opacity = "1"; // Hiển thị nhãn OFF
      toggleBtn.innerHTML = "OFF"; // Thêm chữ OFF vào nút
      toggleContainer.style.border = "2px #DB4133 solid";
    }
  }

  // Thiết lập vị trí ban đầu của nút
  updateToggle(mode);

  toggleContainer.addEventListener("click", function () {
    mode = mode === "off" ? "on" : "off";
    updateToggle(mode);
    console.log("Chế độ mới: ", mode);
    // Lưu chế độ mới vào storage
    chrome.storage.local.set({
      mode: mode
    });
  });
});


let onOffExtension;

chrome.storage.local.get("onOffExtension", (res) => {
  onOffExtension = res.onOffExtension || "on"; //

  const toggleBtn = document.getElementById("hidden-menu__onOffExtension__toggleButton");
  const toggleContainer = document.querySelector(".hidden-menu__onOffExtension__toggle-default-change");
  const onLabel = document.querySelector(".hidden-menu__onOffExtension__on-label");
  const offLabel = document.querySelector(".hidden-menu__onOffExtension__off-label");

  // Hàm cập nhật vị trí nút và hiển thị các nhãn dựa trên mode
  function updateToggle(mode) {
    if (onOffExtension === "on") {
      toggleBtn.style.left = "52px"; // Di chuyển nút sang bên phải
      toggleBtn.style.backgroundColor = "#2bdb66"; // Màu xanh cho nút
      onLabel.style.opacity = "1"; // Hiển thị nhãn ON
      offLabel.style.opacity = "0"; // Ẩn nhãn OFF
      toggleBtn.innerHTML = "ON"; // Thêm chữ ON vào nút
      toggleContainer.style.border = "2px #2bdb66 solid";
    } else {
      toggleBtn.style.left = "2px"; // Di chuyển nút sang bên trái
      toggleBtn.style.backgroundColor = "#cf354a"; // Màu đỏ cho nút
      onLabel.style.opacity = "0"; // Ẩn nhãn ON
      offLabel.style.opacity = "1"; // Hiển thị nhãn OFF
      toggleBtn.innerHTML = "OFF"; // Thêm chữ OFF vào nút
      toggleContainer.style.border = "2px #DB4133 solid";
    }
  }

  // Thiết lập vị trí ban đầu của nút
  updateToggle(onOffExtension);

  toggleContainer.addEventListener("click", function () {
    onOffExtension = onOffExtension === "off" ? "on" : "off";
    updateToggle(onOffExtension);
    // Lưu chế độ mới vào storage
    chrome.storage.local.set({
      onOffExtension: onOffExtension
    });
  });
});
document.getElementById('btn-random').addEventListener('click', function() {
  this.classList.remove('button-off');
  document.getElementById('btn-random-change').classList.add('button-off');
  console.log("minh");  
});

document.getElementById('btn-random-change').addEventListener('click', function() {
  this.classList.remove('button-off');
  document.getElementById('btn-random').classList.add('button-off');
}); 
let gameDoodle;

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
    chrome.storage.local.set({
      "doodleUpload": savedDoodle
    }, () => {
      console.log("Doodle đã được lưu vào localStorage:", bufferDoodleUser);
      alert("Lưu thành công!");
      updateDoodleList();
    });
  });
  e.preventDefault();
})

let yourDoodleList = document.querySelector(".your-doodle");

function updateDoodleList() {
  chrome.storage.local.get("doodleUpload", (res) => {
    const savedDoodle = res.doodleUpload;
    console.log(savedDoodle);
    if (savedDoodle && Array.isArray(savedDoodle) && savedDoodle.length > 0) {
      // Xóa nội dung hiện tại của yourDoodleList trước khi thêm mới
      yourDoodleList.innerHTML = '';
      savedDoodle.forEach(function (item) {
        // Tạo phần tử doodle và thêm vào yourDoodleList
        let doodle = `<div class="doodle">
          <img class = "ele" src="${item}" alt="" loading="lazy">
          </div>`
        yourDoodleList.innerHTML += doodle;
      });
    } else {
      yourDoodleList.innerHTML = `<h1 class = 'empty'>Bạn chưa đăng tải hình ảnh nào</h1>`;
    }
  });
}

updateDoodleList(); // Gọi hàm này ngay lập tức để hiển thị doodleUpload khi tải trang
let allDoodle;

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
      allDoodle = doodles
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
let linkGame;

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
        <img class = "ele" src="${item.image}" alt="" loading="lazy" >
        </div>`
        if (item.format == "game") {
          linkGame = item.information;
          doodle = `<div class="doodle">
          <img class = "ele" src="${item.image}" alt="${linkGame}" loading="lazy" >
          </div>`
        }

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
          gameDoodle = imgDoodle.getAttribute("alt");
          linkDoodle = imgDoodle.getAttribute("src");
          doodlePreview.innerHTML = `<img class = "ele-preview" src="${linkDoodle}" alt="${gameDoodle}"></img>`
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


document.getElementById('changeDoodle').addEventListener('click', function (event) {
  event.preventDefault(); // Ngăn trình duyệt thực hiện hành động mặc định
  const datetime = document.getElementById('timer').value; // Lấy giá trị datetime từ input
  const link = document.querySelector(".ele-preview").src; // URL của Doodle hiện tại trong preview
  const height = document.querySelector(".ele-preview").style.width; // Chiều cao mặc định, cần điều chỉnh nếu cần
  // let game = document.querySelector(".ele-preview").getAttribute("alt");

  if (link == "") {
    link = bufferDoodleUser
    console.log(!link);
  }
  if (datetime) {
    // Nếu người dùng đã chọn một thời điểm
    const scheduleTime = new Date(datetime).getTime();
    const now = Date.now();

    if (scheduleTime > now) {
      // Lập lịch thay đổi Doodle nếu thời gian là tương lai
      chrome.runtime.sendMessage({
        action: "setDoodleAlarm",
        link: link,
        height: height,
        when: scheduleTime,
        type: "set",
        game: gameDoodle
      });
    } else {
      alert('Please select a future time.');
    }
  } else {
    // Nếu không có thời gian được chọn, thay đổi Doodle ngay lập tức
    sendMessageToContentScript(link, height, "", "", gameDoodle);
  }
});

document.getElementById('form-random-change').addEventListener('submit', function (event) {
  event.preventDefault(); // Ngăn chặn hành động mặc định của form
  const timeInput = document.getElementById('timer-random').value; // Lấy giá trị thời gian từ input

  if (!timeInput) {
    alert('Vui lòng nhập thời gian để thay đổi Doodle.');
  } else {
    const timeDelay = parseInt(timeInput) * 60000; // Chuyển đổi thời gian từ phút sang mili giây
    const futureTime = timeDelay;

    const doodleLink = document.querySelector(".ele-preview").src;
    const doodleHeight = document.querySelector(".ele-preview").style.width;
    let game = document.querySelector(".ele-preview").alt;
    chrome.runtime.sendMessage({
      action: "setDoodleAlarm",
      link: allDoodle,
      height: doodleHeight,
      when: futureTime,
      type: "random",
      game: gameDoodle
    });
  }
});


function sendMessageToContentScript(doodleLink, height, buffer, when, linkGame) {
  console.log("Preparing to send message with link:", doodleLink);
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (tabs) => {
    if (tabs.length > 0) {
      const activeTab = tabs[0];
      console.log("Sending to tab:", activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, {
        link: doodleLink,
        height: height,
        buffer: buffer,
        when: when,
        game: linkGame
      }, (response) => {
        console.log("Message sent", response);
      });
    } else {
      console.log("No active tab found.");
    }
  });
}

function setDoodleAlarm(link, height, when) {
  chrome.storage.local.set({
    link: link,
    height: height
  }, function () {
    chrome.alarms.create('changeDoodle', {
      when: when
    });
  });
}