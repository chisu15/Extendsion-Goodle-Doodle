let doodleLink;
let heightMain;
let widthMain;
let heightSearch;
let widthSearch;
let href;
let buffer;

function CheckAndSetInStorage(type, logo) {

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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.link) {
        let logoMain = document.querySelector('.rSk4se');
        let logoExtra = document.querySelector("#logo");
        doodleLink = request.link;
        heightMain = request.height;
        if (!heightMain) {
            heightMain = 200
        }
        let dataExtra = `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`;
        let defaultData = `<img class="lnXdpd" alt="Google" src="${doodleLink}" height="${heightMain}" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">`;

        logoMain.innerHTML = defaultData;
        chrome.storage.local.set({
            doodleMain: `${defaultData}`
        })
        
        logoExtra.innerHTML = dataExtra;
        chrome.storage.local.set({
            doodleExtra: `${dataExtra}`
        })

    } else {
        console.log("dont have any message");
        console.log(request.link)
    }
});


heightMain = 200;
widthMain = "auto";

let dataMain;
let logoMain = document.querySelector('.rSk4se');
let logoMain2 = document.querySelector(".k1zIA ");
logoMain.style.height = "200px";
logoMain2.style.height = "200px";
CheckAndSetInStorage(0, logoMain);



heightSearch = 30;
widthSearch = 92;
let dataSearch;
let logoSearch = document.querySelector("#logo");

CheckAndSetInStorage(1, logoSearch);