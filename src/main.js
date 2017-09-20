import {generateCalHtml} from './calHtml'
import {load} from './functions'
import {Themes} from './objects'
import {View} from './view'

// map sticker type to image
let stickerMap = new Map();

let dayEls = document.getElementsByClassName("day");

settings = {
    theme: Themes.cat,
    themeName: () => {
        for (let name in Themes) {
            if (Themes[name] === settings.theme)
                return name;
        }
    }
}


for (var i = 0; i < dayEls.length; i++) {
    dayEls[i].addEventListener('click', function (event) {
        selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), event.innerHTML);
    }, false);
}

//localStorage.clear();
generateCalHtml(document.querySelector("#calender .table"));
load();

//set Theme
View.addClass(document.querySelector("html"), settings.theme.class);
