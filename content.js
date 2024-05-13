let doodleLink;
let heightMain;
let widthMain;
let heightSearch;
let widthSearch;
let href;
let buffer;
let logoMain = document.querySelector('.rSk4se');
let logoMain2 = document.querySelector(".k1zIA ");
let logoExtra = document.querySelector(".logo #logo");

function CheckAndSetInStorage(type, logo) {
    console.log("Content get");

    if (type == 0) {
        chrome.storage.local.get("doodleMain", (res) => {
            const savedDoodle = res.doodleMain;
            logo.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    } else if (type == 1) {
        chrome.storage.local.get("doodleExtra", (res) => {
            console.log(logoExtra);
            const savedDoodle = res.doodleExtra;
            logo.innerHTML = savedDoodle;
            doodleLink = savedDoodle;
        });
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.link) {
        doodleLink = request.link;
        heightMain = request.height;
        if (!heightMain) {
            heightMain = 200
        }
        let defaultData = `<img class="lnXdpd" alt="Google" src="${doodleLink}" height="${heightMain}" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">`;
        let dataExtra = `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`;
        if (request.game) {
            defaultData = `<a href="${request.game}" target="_blank"><img class="lnXdpd" alt="Google" src="${doodleLink}" height="${heightMain}" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto"></a>`;
            dataExtra = `<a href="${request.game}" target="_blank"><img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover"></a>`;
        }

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

CheckAndSetInStorage(0, logoMain);



heightSearch = 30;
widthSearch = 92;
let dataSearch;


CheckAndSetInStorage(1, logoSearch);