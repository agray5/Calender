import {generateCalHtml} from './calHtml'
import {load} from './functions'

// map sticker type to image
let stickerMap = new Map();

let dayEls = document.getElementsByClassName("day");


for (var i = 0; i < dayEls.length; i++) {
    dayEls[i].addEventListener('click', function (event) {
        selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), event.innerHTML);
    }, false);
}

//localStorage.clear();
generateCalHtml(document.querySelector("#calender .table"));
load();
