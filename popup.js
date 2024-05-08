// const doodleType = [{
//     name: "doodle-nut",
//     link: "https://anonyviet.com/wp-content/uploads/2021/05/Game-Doodle-google.jpg"
//   },
//   {
//     name: "doodle-drogoon",
//     link: "https://www.google.com/logos/doodles/2023/celebrating-lake-xochimilco-6753651837110104.5-2xa.gif"
//   },
//   {
//     name: "doodle-haloowee",
//     link: "https://www.google.com/logos/doodles/2023/halloween-2023-6753651837109958-2xa.gif"
//   },
//   {
//     name: "doodle-4",
//     link: "https://www.cnet.com/a/img/resize/1df91c0ca563d765c8b92b13a94daa952b38fff8/hub/2016/09/14/53a4cb0b-f7ce-4934-9802-3e3d265ed495/doodle-4-google-logo.jpg?auto=webp&fit=crop&height=675&width=1200"
//   },
//   {
//     name: "doodle-edu",
//     link: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2020/4/14/798210/Google-Doodle-4-9-20.jpg"
//   },
//   {
//     name: "asdasd",
//     link: "https://images.hindustantimes.com/img/2022/02/14/1600x900/google_doodle_1644804981291_1644804985296.PNG"
//   },
//   {
//     name: "Women",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/01._01-01_pgmdhx?_a=BAMABmRg0"
//   },
//   {
//     name: "VNC-6",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/02._14-02_vpuvyo?_a=BAMABmRg0"
//   },
//   {
//     name: "VNC-5",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/03._03-02_fumljy?_a=BAMABmRg0"
//   },
//   {
//     name: "HCM",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/04._23-2_nu4mya?_a=BAMABmRg0"
//   },
//   {
//     name: "Love",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/05._27-02_txdyf9?_a=BAMABmRg0"
//   },
//   {
//     name: "30-04",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/06._28-02_p15rby?_a=BAMABmRg0"
//   },
//   {
//     name: "24-03",
//     link: "https://res.cloudinary.com/dqlelya6o/image/upload/08._24-03_nlmnny?_a=BAMABmRg0"
//   }
// ]
callDoodle(".doodle-upcoming", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/upcoming")
callDoodle(".special-theme", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/newest")
callDoodle(".all-theme", "https://google-doodle-v2-v2.vercel.app/api/v1/doodle/")
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
let nextLinkDoodle = ""
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
    console.log(imgDoodle.outerHTML);
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

function sendMessageToContentScript(message) {
  return new Promise((resolve) => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tabs) => {
      console.log("Tabs:", tabs);
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        link: message
      }, () => {
        resolve();
      });
    });
  });
}

// xoa tu cai tren   <p class="title-doodle">${item.name}</p>

// setInterval(() => {
//   sendMessageToContentScript(linkDoodle);
//   currentIndexDoodle = (currentIndexDoodle + 1) % doodleType.length;
//   nextLinkDoodle = doodleType[currentIndexDoodle].link;
//   linkDoodle = nextLinkDoodle;
// }, 1000)

changeBtn.addEventListener("click", (event) => {
  console.log(timer.value);
  if (timer.value) {
    setInterval(() => {
      sendMessageToContentScript(linkDoodle);
      currentIndexDoodle = (currentIndexDoodle + 1) % doodleType.length;
      nextLinkDoodle = doodleType[currentIndexDoodle].link;
      linkDoodle = nextLinkDoodle;
      console.log(linkDoodle);
    }, timer.value * 1000)
  } else {
    sendMessageToContentScript(linkDoodle);
  }
  event.preventDefault()
})

// changeBtn.addEventListener('click', async () => {
//   await sendMessageToContentScript(linkDoodle);
// });

// changeBtn.addEventListener('click', async () => {
//   // Kiểm tra giá trị timer hợp lệ
//   if (timer.value) {
//     const timerValue = parseInt(timer.value);
//     // Lấy Doodle được chọn
//     const selectedDoodle = document.querySelector(".doodle.check");
//     if (!selectedDoodle) {
//       // Xử lý trường hợp chưa chọn Doodle (ví dụ: hiển thị thông báo)
//       return;
//     }

//     currentIndexDoodle = doodleType.indexOf(selectedDoodle);
//     nextLinkDoodle = doodleType[(currentIndexDoodle + 1) % doodleType.length].link;
//     await sendMessageToContentScript(selectedDoodle.querySelector("img").getAttribute("src"));
//     const intervalId = setInterval(async () => {
//       await sendMessageToContentScript(nextLinkDoodle);
//       currentIndexDoodle = (currentIndexDoodle + 1) % doodleType.length;
//       nextLinkDoodle = doodleType[currentIndexDoodle].link;
//     }, timerValue * 1000);

//     // Xóa interval khi click nút lần nữa
//     changeBtn.addEventListener('click', () => clearInterval(intervalId));
//   } else {
//     await sendMessageToContentScript(linkDoodle);
//     return;
//   }
// });
  })

}