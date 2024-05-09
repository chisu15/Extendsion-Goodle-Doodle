let doodleLink;
let heightMain;
let widthMain;
let heightSearch;
let widthSearch;
let href

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

function GetAndSetDoodle(type, logo, data, doodleLink) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.link) {
            doodleLink = request.link;
            heightMain = request.height;
            href = request.href;
            if (!heightMain) {
                heightMain = 200
            }

            console.log(request.link + "     " + heightMain + "     " + href)
            let defaultData = `
                <img class="lnXdpd" alt="Google" src="${doodleLink}" height="${heightMain}" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">
            `
            // data = (type == 0) ? defaultData : `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="${height}" width="${width}" data-csiid="1" data-atf="1" object-fit="cover">`

            if (type == 0) {
                data = defaultData;
                chrome.storage.local.set({
                    doodleMain: `${data}`
                })
            } else {
                data = `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`
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

heightMain = 200;
widthMain = "auto";

let dataMain;
let logoMain = document.querySelector('.rSk4se');
let logoMain2 = document.querySelector(".k1zIA ");
logoMain.style.height = "200px";
logoMain2.style.height = "200px";
CheckAndSetInStorage(0, logoMain);
GetAndSetDoodle(0, logoMain, dataMain, doodleLink);


heightSearch = 30;
widthSearch = 92;
let dataSearch;
let logoSearch = document.querySelector("#logo");

CheckAndSetInStorage(1, logoSearch);
GetAndSetDoodle(1, logoSearch, dataSearch, doodleLink);

chrome.tabs.onCreate.addListener(() => {

})