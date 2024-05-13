

// let doodleLink;
// let heightMain;
// let widthMain;
// let heightSearch;
// let widthSearch;
// let href;
// let buffer;

// function CheckAndSetInStorage(type, logo) {

//     if (type == 0) {
//         chrome.storage.local.get("doodleMain", (res) => {
//             const savedDoodle = res.doodleMain;
//             logo.innerHTML = savedDoodle;
//             doodleLink = savedDoodle;
//         });
//     } else if (type == 1) {
//         chrome.storage.local.get("doodleExtra", (res) => {
//             const savedDoodle = res.doodleExtra;
//             logo.innerHTML = savedDoodle;
//             doodleLink = savedDoodle;
//         });
//     }
//     if (type == "upload") {
//         chrome.storage.local.get("doodleUpload", (res) => {
//             const savedDoodle = res.doodleUpload;
//             // logo.innerHTML = savedDoodle;
//             doodleLink = savedDoodle;
//         });
//     }
// }

// function GetAndSetDoodle(type, logo, data, doodleLink) {
//     console.log("Content get called");
//     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//         if (request.link) {
//             doodleLink = request.link;
//             heightMain = request.height;
//             href = request.href;
//             if (!heightMain) {
//                 heightMain = 200
//             }

//             console.log(request.link + "     " + heightMain + "     " + href)
//             let defaultData = `
//                 <img class="lnXdpd" alt="Google" src="${doodleLink}" height="${heightMain}" width="auto" data-atf="1" data-frt="0" object-fit="contain" margin-top="auto">
//             `
//             // data = (type == 0) ? defaultData : `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="${height}" width="${width}" data-csiid="1" data-atf="1" object-fit="cover">`

//             if (type == 0) {
//                 data = defaultData;
//                 chrome.storage.local.set({
//                     doodleMain: `${data}`
//                 })
//             } else {
//                 data = `<img class="jfN4p" src="${doodleLink}" style="background:none" alt="Google" height="30px" width="92px" data-csiid="1" data-atf="1" object-fit="cover">`
//                 chrome.storage.local.set({
//                     doodleExtra: `${data}`
//                 })
//             }
//             logo.innerHTML = data;

//         } else {
//             console.log("dont have any message");
//             console.log(request.link)
//         }
//     });
// }

// heightMain = 200;
// widthMain = "auto";

// let dataMain;
// let logoMain = document.querySelector('.rSk4se');
// let logoMain2 = document.querySelector(".k1zIA ");
// logoMain.style.height = "200px";
// logoMain2.style.height = "200px";
// CheckAndSetInStorage(0, logoMain);
// GetAndSetDoodle(0, logoMain, dataMain, doodleLink);


// heightSearch = 30;
// widthSearch = 92;
// let dataSearch;
// let logoSearch = document.querySelector("#logo");

// CheckAndSetInStorage(1, logoSearch);
// GetAndSetDoodle(1, logoSearch, dataSearch, doodleLink);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message:", request);
    if (!request.link || !request.height) {
        console.error("Invalid doodle data received.");
        return;
    }

    // Xác định vị trí của logo cần cập nhật
    let logo;
    if (request.type === 0) {
        logo = document.querySelector('.rSk4se'); // Giả sử đây là vị trí logo chính
    } else if (request.type === 1) {
        logo = document.querySelector("#logo"); // Giả sử đây là vị trí logo phụ
    }

    if (!logo) {
        console.error("Logo element not found.");
        return;
    }

    // Tạo HTML cho hình ảnh mới
    const newDoodleHTML = `
        <img class="lnXdpd" alt="Google" src="${request.link}" height="${request.height}" width="auto" data-atf="1" data-frt="0" object-fit="contain">
    `;

    // Cập nhật nội dung của phần tử logo
    logo.innerHTML = newDoodleHTML;

    
    return true; // Cho phép phản hồi bất đồng bộ
    // Lưu dữ liệu mới vào local storage để khôi phục sau này
    const storageKey = request.type === 0 ? 'doodleMain' : 'doodleExtra';
    chrome.storage.local.set({[storageKey]: newDoodleHTML}, () => {
        console.log("Doodle updated and saved to local storage.");
        sendResponse({status: "Doodle updated successfully"});
    });
});

// Lưu ý: Đảm bảo rằng các phần tử DOM '.rSk4se' và '#logo' đã tồn tại
// trong trang trước khi message được gửi từ background script.
