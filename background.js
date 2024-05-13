chrome.runtime.onInstalled.addListener(() => {
    console.log('VietDoodle Gallery extension installed.');
});

// Function to set the alarm for changing the Doodle
function setDoodleAlarm(link, height, when) {
    console.log("setDoodleAlarm set data: ", link, height, when);
    let defaultData = `<img class="lnXdpd" alt="Google" src="${link}" height="${height}" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">`;
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
    console.log('Alarm set for changing Doodle at:', new Date(when).toLocaleString());
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
                    }, function (response) {
                        if (chrome.runtime.lastError) {
                            console.error('Error sending message:', chrome.runtime.lastError.message);
                        } else {
                            console.log('Doodle updated in tab:', tab.id);
                        }
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

function CheckAndSetInStorage(type, logo) {
    console.log("CheckAndSetInStorage called");
    if (type == 0) {
        chrome.storage.local.get("doodleMain", (res) => {
            const savedDoodle = res.doodleMain;
            logo.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    } else if (type == 1) {
        chrome.storage.local.get("doodleExtra", (res) => {
            const savedDoodle = res.doodleExtra;
            logo.innerHTML = savedDoodle;
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

// chrome.windows.onCreated.addListener(function () {
//     console.log("A new browser window was created.");
//     chrome.storage.local.get(['link', 'height', 'when'], function (data) {
//         console.log("On Create get data from local: ", data);
//         let logoMain = document.querySelector('.rSk4se');
//         let logoExtra = document.querySelector("#logo");
//         CheckAndSetInStorage(0, logoMain);
//         CheckAndSetInStorage(1, logoExtra);
//         console.log("Message sent from background");
//     });
// });

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
        setDoodleAlarm(request.link, request.height, request.when);
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