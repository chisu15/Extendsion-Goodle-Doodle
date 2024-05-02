function selectFirstButton() {
    var firstButton = document.querySelector('#button1');
    if (firstButton) {
        changeColor(firstButton);
    }
}
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
showContent("content1");

function showContent(contentId) {
    console.log(111111111111);
    var content1 = document.querySelector('.content1');
    var content2 = document.querySelector('.content2');
    var button1 = document.getElementById('button1');
    var button2 = document.getElementById('button2');

    if (contentId === 'content1') {
        console.log(content1);
        content1.style.visibility = 'visible';
        content2.style.visibility = 'hidden';
        content1.style.position = 'relative';
        content2.style.position = 'absolute';
        content2.style.top = '0';
        button1.classList.add('active');
        button2.classList.remove('active');
        changeColor(button1);
    } else if (contentId === 'content2') {
        content1.style.visibility = 'hidden';
        content2.style.visibility = 'visible';
        content2.style.position = 'relative';
        content1.style.position = 'absolute';
        content1.style.top = '0';
        button1.classList.remove('active');
        button2.classList.add('active');
        changeColor(button2);
    }
}