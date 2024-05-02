let doodleLink;

function CheckAndSetInStorage(type, logo) {

    if (type == 0) {
        chrome.storage.local.get("doodleMain", (res) => {
            const savedDoodle = res.doodleMain;
            logo.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    } else {
        chrome.storage.local.get("doodleExtra", (res) => {
            const savedDoodle = res.doodleExtra;
            logo.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    }
}

function GetAndSetDoodle(type, logo, data, doodleLink, height, width) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.link) {
            console.log(request.link)
            doodleLink = request.link
            let defaultData = `<img class="lnXdpd" alt="Google" src="${doodleLink}" height="${height}" width="${width}" data-atf="1" data-frt="0" object-fit="cover">`
            // data = (type == 0) ? defaultData : `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="${height}" width="${width}" data-csiid="1" data-atf="1" object-fit="cover">`
            if (type == 0) {
                data = defaultData;
                chrome.storage.local.set({
                    doodleMain: `${data}`
                })
            } else {
                data = `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="${height}" width="${width}" data-csiid="1" data-atf="1" object-fit="cover">`
                chrome.storage.local.set({
                    doodleExtra: `${data}`
                })
            }
            logo.innerHTML = data;

        } else {
            console.log("dont have any message");
            console.log(request.link)
        }
    });
}


const heightMain = 200;
const widthMain = "auto";

let dataMain;
let logoMain = document.querySelector('.rSk4se');
CheckAndSetInStorage(0, logoMain);
GetAndSetDoodle(0, logoMain, dataMain, doodleLink, heightMain, widthMain);


const heightSearch = 30;
const widthSearch = 92;
let dataSearch;
let logoSearch = document.querySelector("#logo");

CheckAndSetInStorage(1, logoSearch);
GetAndSetDoodle(1, logoSearch, dataSearch, doodleLink, heightSearch, widthSearch);

chrome.tabs.onCreate.addListener(()=>{
    
})
