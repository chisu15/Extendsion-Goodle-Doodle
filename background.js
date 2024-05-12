chrome.runtime.onInstalled.addListener(() => {
    console.log('VietDoodle Gallery extension installed.');
});

// Function to set the alarm for changing the Doodle
function setDoodleAlarm(link, height, when) {
    chrome.storage.local.set({link: link, height: height, when: when}, function() {
        if (chrome.runtime.lastError) {
            console.error('Error setting storage:', chrome.runtime.lastError);
            return;
        }
        chrome.alarms.create('changeDoodle', {when: when});
        console.log('Alarm set for changing Doodle at:', new Date(when).toLocaleString());
    });
}

// Listener for the alarm to change the Doodle
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'changeDoodle') {
        updateDoodleFromStorage();
    }
});

// Update the Doodle across all Google tabs
function updateDoodleFromStorage() {
    chrome.storage.local.get(['link', 'height', 'when'], function(data) {
        if (!data.link || !data.height) {
            console.log('No Doodle data found.');
            return;
        }
        chrome.tabs.query({url: "*://*.google.com/*"}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, {link: data.link, height: data.height}, function(response) {
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

// This function restores alarms and checks if it needs to fire immediately upon browser startup
chrome.runtime.onStartup.addListener(function() {
    chrome.storage.local.get(['link', 'height', 'when'], function(data) {
        if (!data.when) return;
        const timeNow = Date.now();
        if (data.when > timeNow) {
            chrome.alarms.create('changeDoodle', {when: data.when});
        } else {
            updateDoodleFromStorage(); // Immediately trigger Doodle update if the time has passed
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "setDoodleAlarm") {
        setDoodleAlarm(request.link, request.height, request.when);
        sendResponse({status: 'Alarm set'});
    }
    return true; // Keep the message channel open for asynchronous response
});



// let when

// // Function to set the alarm for changing the Doodle
// function setDoodleAlarm(link, height, when) {
//     chrome.storage.local.set({ link: link, height: height }, function() {
//         if (chrome.runtime.lastError) {
//             console.error('Error setting storage:', chrome.runtime.lastError);
//             return;
//         }
//         chrome.alarms.create('changeDoodle', { when: when });
//         console.log('Alarm set for changing Doodle at:', new Date(when).toLocaleString());
//         countdownTimer(when, link, height); // Chuyển thành timestamp cho rõ ràng
//     });
// }

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === "setDoodleAlarm") {
//         console.log("GET MESSAGE: ", request);
//         setDoodleAlarm(request.link, request.height, request.when);
//         console.log(document.querySelector('.rSk4se'));
//         sendResponse({status: 'Alarm set'});
//         when = request.when;

//     }
//     return true; // Indicates to Chrome that sendResponse will be called asynchronously
// });

// // Function to update the Doodle across all Google tabs
// function updateDoodle(link, height, when) {
//     chrome.tabs.query({url: "*://*.google.com/*"}, function(tabs) {
//         if (tabs.length === 0) {
//             console.log('No Google tabs found.');
//             return;
//         }
//         tabs.forEach(function(tab) {
//             chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(response) {
//                 console.log('Received response:', response);
//             });
//         });
//     });
// }


// // Countdown Timer function as before, modified to use timestamps directly
// function countdownTimer(endTime, link, height) {
//     const endDate = new Date(endTime);
//     let timeRemaining = endDate.getTime() - Date.now();

//     const interval = setInterval(() => {
//         timeRemaining -= 1000;

//         if (timeRemaining <= 0) {
//             clearInterval(interval);
//             console.log("Thời gian đếm ngược đã kết thúc.");
            
//             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//                 if (tabs.length > 0) {
//                     const activeTab = tabs[0];
//                     chrome.tabs.sendMessage(activeTab.id, {
//                         link: link,
//                         height: height
//                     }, (response) => {
//                         console.log("Doodle updated", response);
//                     });
//                 } else {
//                     console.log("No active tab found.");
//                 }
//             });
//         } else {
//             const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
//             const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
//             const seconds = Math.floor((timeRemaining / 1000) % 60);
//             console.log(`Thời gian còn lại: ${hours} giờ ${minutes} phút ${seconds} giây`);
//         }
//     }, 1000);
// }