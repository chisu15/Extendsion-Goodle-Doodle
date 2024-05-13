chrome.runtime.onInstalled.addListener(() => {
    let defaultData = `<a href="https://viet-doodle-gallery.vercel.app/" target="_blank">
    <img class="lnXdpd" alt="Google" src="https://viet-doodle-gallery.vercel.app/static/media/vietdoodle.9c23c6615c8fdf3751f4.png" height="200 px" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">
    </a>`;
    let dataExtra = `<a href="https://viet-doodle-gallery.vercel.app/" target="_blank"><img class="jfN4p" src="https://viet-doodle-gallery.vercel.app/static/media/vietdoodle.9c23c6615c8fdf3751f4.png" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="contain"></a>`;
    chrome.storage.local.set({
        doodleMain: defaultData,
        doodleExtra: dataExtra
    });
    console.log('VietDoodle Gallery extension đã được cài đặt.');
    chrome.storage.local.get("mode", (result) => {
        let currentMode = result.mode ? result.mode : "on";
        console.log("Chế độ hiện tại: ", currentMode);
        chrome.storage.local.set({
            mode: currentMode
        }, () => {
            console.log("Cập nhật chế độ thành công!");
        });
    });
});


// Function to set the alarm for changing the Doodle
function setDoodleAlarm(link, height, when, type) {
    console.log("setDoodleAlarm set data: ", link, height, when, type);
    if (type == "random") {
        console.log("Bắt đầu thay đổi Doodle ngẫu nhiên theo khoảng thời gian định sẵn");

        function fetchAndSetRandomDoodle() {
            setInterval(() => {
                fetch('https://google-doodle-v2-v2.vercel.app/api/v1/doodle/random')
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.data);
                        if (data && data.data.image) {
                            console.log("Doodle ngẫu nhiên đã được lấy: ", data.data.image);
                            let heightMain = height || 200;
                            if (data.data.format == "game") {
                                linkGame = data.data.information;
                                defaultData = `<a href="${linkGame}" target="_blank">
                                <img class="lnXdpd" alt="Google" src="${data.data.image}" height="200 px" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">
                                </a>`;
                                dataExtra = `<a href="${linkGame}" target="_blank"><img class="jfN4p" src="${data.data.image}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover"></a>`;
                            }else{
            
                                defaultData = `<img class="lnXdpd" alt="Google" src="${todaysDoodle.image}" height="200 px" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">`;
                                dataExtra = `<img class="jfN4p" src="${todaysDoodle.image}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`;
                            }
                            chrome.storage.local.set({
                                doodleMain: defaultData,
                                doodleExtra: dataExtra
                            }, () => {
                                console.log("Doodle ngẫu nhiên đã được cập nhật vào local storage.");
                            });
                        } else {
                            console.log("Không thể lấy Doodle ngẫu nhiên từ API.");
                        }
                    })
                    .catch(error => console.error('Lỗi khi lấy Doodle ngẫu nhiên:', error));
            }, when); // Lặp lại mỗi 5 giây
        }
        // Lấy Doodle lần đầu khi thiết lập
        fetchAndSetRandomDoodle();
    } else {

        let heightMain = height;
        if (!heightMain) {
            heightMain = 200
        }
        let defaultData = `<img class="lnXdpd" alt="Google" src="${link}" height="${heightMain} px" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">`;
        let dataExtra = `<img class="jfN4p" src="${link}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`;

        chrome.storage.local.set({
            doodleMain: `${defaultData}`
        })
        chrome.storage.local.set({
            doodleExtra: `${dataExtra}`
        })
        chrome.alarms.create('changeDoodle', {
            when: when
        });
        // console.log('Alarm set for changing Doodle at:', new Date(when).toLocaleString());
    }
    countdownTimer(when)
}
// Listener for the alarm to change the Doodle
chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("On Alarm called");
    if (alarm.name === 'changeDoodle') {
        chrome.storage.local.get(['link', 'height', 'when'], function (data) {
            if (!data.link) {
                console.log('No Doodle data found.');
                return;
            }
            // Gửi thông tin Doodle tới tất cả các tab Google mở
            chrome.tabs.query({
                url: "*://*.google.com/*"
            }, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        link: data.link,
                        height: data.height
                    });
                });
            });
        });
    }
});

// Update the Doodle across all Google tabs
function updateDoodleFromStorage() {
    console.log("updateDoodleFromStorage called");
    chrome.storage.local.get(['link', 'height', 'when'], function (data) {
        console.log("updateDoodleFromStorage get data from local: ", data);
        if (!data.link) {
            console.log('No Doodle data found.');
            return;
        }
        chrome.tabs.query({
            url: "*://*.google.com/*"
        }, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.sendMessage(tab.id, {
                    link: data.link,
                    height: data.height
                }, function (response) {
                    console.log('Doodle updated in tab:', tab.id);

                });
            });
        });
    });
}

function CheckAndSetInStorage(type) {
    let logoMain = document.querySelector('.rSk4se');
    let logoExtra = document.querySelector("#logo");
    console.log("CheckAndSetInStorage called");
    if (type == 0) {
        chrome.storage.local.get("doodleMain", (res) => {
            const savedDoodle = res.doodleMain;
            logoMain.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    } else if (type == 1) {
        chrome.storage.local.get("doodleExtra", (res) => {
            const savedDoodle = res.doodleExtra;
            logoExtra.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    }
    if (type == "upload") {
        chrome.storage.local.get("doodleUpload", (res) => {
            const savedDoodle = res.doodleUpload;
            // logo.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    }
}

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "setDoodleAlarm") {
//         console.log("Nhận yêu cầu đặt lịch thay đổi Doodle.");
//         const { link, height, when } = request;
//         chrome.alarms.create('changeDoodle', { when });
//         chrome.alarms.onAlarm.addListener((alarm) => {
//             if (alarm.name === 'changeDoodle') {
//                 console.log("Bắt đầu thay đổi Doodle theo lịch trình.");
//                 chrome.storage.local.get(["doodleUpload"], (result) => {
//                     const doodles = result.doodleUpload || [];
//                     if (doodles.length > 0) {
//                         const randomIndex = Math.floor(Math.random() * doodles.length);
//                         const randomDoodle = doodles[randomIndex];
//                         chrome.tabs.query({url: "*://*.google.com/*"}, (tabs) => {
//                             tabs.forEach((tab) => {
//                                 chrome.tabs.sendMessage(tab.id, {
//                                     link: randomDoodle,
//                                     height: height
//                                 }, (response) => {
//                                     console.log('Doodle ngẫu nhiên đã được cập nhật trong tab:', tab.id);
//                                 });
//                             });
//                         });
//                     } else {
//                         console.log("Không có Doodle nào trong local storage để thay đổi.");
//                     }
//                 });
//             }
//         });
//         sendResponse({status: "Scheduled"});
//     }
// });


chrome.storage.local.get("mode", (res) => {
    let mode = res.mode;
    if (mode === "on") {
        fetch('https://google-doodle-v2-v2.vercel.app/api/v1/doodle/')
            .then(response => response.json())
            .then(data => {
                let defaultData;
                let dataExtra;
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Đặt lại giờ, phút, giây và mili giây về 0
                console.log("", today);
                const todaysDoodle = data.find(doodle => {
                    const doodleDate = new Date(doodle.time.event);
                    doodleDate.setHours(0, 0, 0, 0); // Đặt lại giờ, phút, giây và mili giây về 0
                    return doodleDate.getTime() === today.getTime();
                });
                if (!todaysDoodle) {
                    console.log("Không có Doodle nào cho hôm nay trong dữ liệu.");
                    return;
                }
                console.log(todaysDoodle.image);
                let linkGame;
                if (todaysDoodle.format == "game") {
                    linkGame = todaysDoodle.information;
                    defaultData = `<a href="${linkGame}" target="_blank"><img class="lnXdpd" alt="Google" src="${todaysDoodle.image}" height="200 px" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto"></a>`;
                    dataExtra = `<a href="${linkGame}" target="_blank"><img class="jfN4p" src="${todaysDoodle.image}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover"></a>`;
                }else{

                    defaultData = `<img class="lnXdpd" alt="Google" src="${todaysDoodle.image}" height="200 px" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">`;
                    dataExtra = `<img class="jfN4p" src="${todaysDoodle.image}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`;
                }
                    
                chrome.storage.local.set({
                    doodleMain: `${defaultData}`
                })
                chrome.storage.local.set({
                    doodleExtra: `${dataExtra}`
                })
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu từ API:", error);
            });
    } else {
        console.log("Chế độ hiện tại không phải là 'on', không thể thay đổi Doodle.");
    }
});

chrome.windows.onCreated.addListener(function () {
    chrome.storage.local.get("mode", (res) => {
        console.log(res.mode + "auto change");
        let mode = res.mode;
        if (mode === "on") {
            fetch('https://google-doodle-v2-v2.vercel.app/api/v1/doodle/')
                .then(response => response.json())
                .then(data => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); // Đặt lại giờ, phút, giây và mili giây về 0
                    const todaysDoodle = data.find(doodle => {
                        const doodleDate = new Date(doodle.time.event);
                        doodleDate.setHours(0, 0, 0, 0); // Đặt lại giờ, phút, giây và mili giây về 0
                        return doodleDate.getTime() === today.getTime();
                    });
                    if (!todaysDoodle) {
                        console.log("Không có Doodle nào cho hôm nay trong dữ liệu.");
                        return;
                    }
                    console.log(todaysDoodle);
                    let linkGame;
                    if (todaysDoodle.format == "game") {
                        linkGame = todaysDoodle.information;
                    }
                    chrome.runtime.sendMessage({
                        action: "setDoodleAlarm",
                        link: todaysDoodle.image,
                        height: document.querySelector(".ele-preview").style.width,
                        when: Date.now(), // Gửi ngay lập tức vì là Doodle của hôm nay,
                        game: linkGame
                    });
                })
                .catch(error => {
                    console.error("Lỗi khi lấy dữ liệu từ API:", error);
                });
        } else {
            console.log("Chế độ hiện tại không phải là 'on', không thể thay đổi Doodle.");
        }
    });
});

// This function restores alarms and checks if it needs to fire immediately upon browser startup
chrome.runtime.onStartup.addListener(function () {
    console.log("On Startup called");
    chrome.storage.local.get(['link', 'height', 'when'], function (data) {
        console.log("On Startup get data from local: ", data);
        if (data.when && Date.now() < data.when) {
            chrome.alarms.create('changeDoodle', {
                when: data.when
            });
        } else {
            updateDoodleFromStorage();
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Background get request: ", request);
    if (request.action === "setDoodleAlarm") {
        console.log("Passed action");
        setDoodleAlarm(request.link, request.height, request.when, request.type, request.game);
        sendResponse({
            status: 'Alarm set'
        });
    }
    return true; // Keep the message channel open for asynchronous response
});



// Countdown Timer function as before, modified to use timestamps directly
function countdownTimer(endTime) {
    const endDate = new Date(endTime);
    let timeRemaining = endDate.getTime() - Date.now();

    const interval = setInterval(() => {
        timeRemaining -= 1000;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            console.log("Thời gian đếm ngược đã kết thúc.");
        } else {
            const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
            const seconds = Math.floor((timeRemaining / 1000) % 60);
            console.log(`Thời gian còn lại: ${hours} giờ ${minutes} phút ${seconds} giây`);
        }

    }, 1000);
}