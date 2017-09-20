import {View} from './view'
import {isMobile, forceArray} from './helperFunctions'
import {Menus, Themes} from './objects'

export function generateCalHtml(parent) {
    // weekly labels
    let weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // monthly labels
    let monthLabels = ['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    // days in months, in order
    let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // starting date of the calender
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    let totalDays = daysInMonth[firstDay.getMonth()];
    let month = monthLabels[firstDay.getMonth()];
    let year = firstDay.getFullYear();
    let tr;
    //let tdHeight = document.querySelector("body").clientHeight*.82*.15;
    let th = View.elt("div", {id:"calCurrentMonth"}, View.elt("span", {
        id: "month"
    }, `${month}`), View.elt("span", {
        id: "year"
    }, `${year}`));
    document.querySelector("#calender .header").appendChild(th);

    if (firstDay.getMonth() == 1) //february
        if (isLeapYear(firstDay.getFullYear()))
            totalDays = 29;

    for (let day = 0; day < 7; day++) {
        let td = View.elt("div", {
            class: "weekday"
        }, View.elt("span", {}, `${weekLabels[day]}`));
        parent.appendChild(td);
    }

    let cell = 0;
    for (let i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
            cell++;
            let fday = firstDay.getDay() + 1;
            let day = cell - fday + 1;
            let td;
            let eventContainer;
            if (cell >= fday && day <= totalDays) { //Day is a calender day
                eventContainer = View.elt("div", {class: "eventContainer"})
                td = View.elt("div", {
                        class: "day cell",
                        id: `event_${day}-${firstDay.getMonth()}-${firstDay.getFullYear()}`,
                    }, View.elt("text", {
                        class: "calNumber"
                    }, `${day}`),
                    eventContainer);

                eventContainer.addEventListener("click", event => {
                    selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
                    selectedDateTD = td;
                    if (event.target == eventContainer){
                        if(isMobile())
                            toggleMenu(Menus.mobile);
                        else
                            toggleMenu(Menus.addEvent);
                    }
                });

                td.addEventListener("click",  event => {
                    selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
                    selectedDateTD = td;
                    if (event.target == td){
                        if(isMobile())
                            toggleMenu(Menus.mobile);
                        else
                            toggleMenu(Menus.addEvent);
                    }
                })
            }
            else
                td = View.elt("div", {
                    class: "nonday cell"
                });

            td.appendChild(View.elt("div"));

            parent.appendChild(td);
        }
    }
}

/**
    * Disables menu if it shown and enables with selected menu when it is not shown
    * @param {{id:string, header:{}, content:{}, footer:{}, buttons:[]}|boolean} menu not needed if disabling
    */
export function toggleMenu  (menu){
    let menuWrapper = document.querySelector(".menu.wrapper");
    let isShown = View.hasClass(menuWrapper, 'hidden') ? false : true;

    if (menu === true)
        View.removeClass(menuWrapper, 'hidden');
    if (menu === false)
        View.addClass(menuWrapper, 'hidden');
    //Toggle menu off only if it is not hidden and given menu is already being displyed
    if (isShown && menuWrapper.id === (menu.id + 'Wrapper'))
        View.addClass(menuWrapper, 'hidden');
    else{
        fillInMenu(menu);
        View.removeClass(document.querySelector(".menu.wrapper"), 'hidden');
    }
}

//get copy of clean menu
//does not include outer menu wrapper div
let clearedMenu = $(".menu.wrapper").clone(true);

function clearMenu(){
    $(".menu.wrapper").replaceWith(clearedMenu.clone(true));
}

export function fillInMenu (menu) {
    //clear elements of previous content
    clearMenu();

    let menuElt      = document.querySelector(".menu.wrapper");
    let boxElt       = document.querySelector(".menu.box");
    let headerElt    = document.querySelector(".menu.header");
    let titleElt     = headerElt.getElementsByTagName("h2")[0];
    let mainElt      = document.querySelector(".menu.main");
    let bkgElt       = document.querySelector(".menu.background");
    let contentElt   = document.querySelector(".menu.content");
    let footerElt    = document.querySelector(".menu.footer");
    let hasId        = menu.hasOwnProperty("id");
    let buttonPlacements = {
        content: []
    };

    let close = document.querySelector(".menu.close");
    close.addEventListener("click", event => {
        let modal = close.parentNode.parentNode.parentNode;
        View.toggleClass(modal, 'hidden', true);
    });

    //Set ids
    if (hasId) {
        menuElt.id      = menu.id + "Wrapper";
        boxElt.id       = menu.id + "Box";
        headerElt.id    = menu.id + "Header";
        titleElt.id     = menu.id + "Title";
        mainElt.id      = menu.id + "Main";
        bkgElt.id       = menu.id + "Background";
        contentElt.id   = menu.id + "Content";
        footerElt.id    = menu.id + "Footer";
    } else {
        menuElt.removeAttribute('id');
        boxElt.removeAttribute('id');
        headerElt.removeAttribute('id');
        titleElt.removeAttribute('id');
        mainElt.removeAttribute('id');
        bkgElt.removeAttribute('id');
        contentElt.removeAttribute('id');
        footerElt.removeAttribute('id');
    }

    //Set Theme
    View.addClass(menuElt, settings.theme.class);

    //sort buttons by placement, if button has no placement content is assumed
    if (menu.hasOwnProperty("buttons")) {
        if (menu.buttons.constructor !== Array) {
            menu.buttons = [menu.buttons];
        }

        menu.buttons.forEach(button => {
            if (!button.hasOwnProperty("data") || !button.data.hasOwnProperty("placement")) {
                buttonPlacements.content.push(button);
            }
            else {
                if (buttonPlacements.hasOwnProperty(button.data.placement))
                    buttonPlacements[button.data.placement].push(button);
                else
                    buttonPlacements[button.data.placement] = [button];
            }
        });
    }

    if (menu.hasOwnProperty("header")){
        let header = forceArray(menu.header);
        if (header[0].hasOwnProperty("title"))
            titleElt.textContent = header[0].title
    }

    //append child objects
    if (menu.hasOwnProperty("header")){
        let objs = forceArray(menu.header);
        for (let obj of objs)
            if (obj.constructor === Object && obj.hasOwnProperty("elm"))
                headerElt.appendChild(View.eltObjToElt(obj));
    }
    if (menu.hasOwnProperty("content")){
        let objs = forceArray(menu.content);
        for (let obj of objs){
            if (obj.constructor === Object){
                contentElt.appendChild(View.eltObjToElt(obj));
            }
        }
    }
    if (menu.hasOwnProperty("footer")){
        let objs = forceArray(menu.footer);
        for (let obj of objs)
            if (obj.constructor === Object)
                footerElt.appendChild(View.eltObjToElt(obj));
    }

    //append button div
    for (let place in buttonPlacements){
        let elt;
        let class_ = "menu btn-container";
        if (place === "header"){
            if(hasId) elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsHeader', id: menu.id + "BtnsHeader"}, {}, ...buttonPlacements.header));
            else elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsHeader'}, {}, ...buttonPlacements.header));
            headerElt.appendChild(elt);
        }
        else if (place === "content" && buttonPlacements.content){
            if(hasId) elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsContent', id: menu.id + "BtnsContent"}, {}, ...buttonPlacements.content));
            else elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsContent'}, {}, ...buttonPlacements.content));
            contentElt.appendChild(elt);
        }
        else if (place === "footer"){
            if(hasId) elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsFooter', id: menu.id + "BtnsFooter"}, {}, ...buttonPlacements.footer));
            else elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsFooter'}, {}, ...buttonPlacements.footer));
            footerElt.appendChild(elt);
        }
        else if (place === "form"){
            if(hasId) elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsForm', id: menu.id + "BtnsForm"}, {}, ...buttonPlacements.form));
            else elt = View.eltObjToElt(View.eltObj("div", {class: class_ + ' btnsForm'}, {}, ...buttonPlacements.form));
            document.querySelector(".menu.content").querySelector("#"+buttonPlacements.form[0].data.parentId).appendChild(elt);
        }
        else
            throw new Error("Could not place button. Button placement " + place + " is invalid");
    }

    //Set theme credits
    let credits = forceArray(settings.theme.credits);
    let creditsContainer = View.elt("div", {"class": "menu credits container"});
    credits.forEach(eltObj => {
        let elt = View.eltObjToElt(eltObj);
        View.addClass(elt, "menu", "credit");
        creditsContainer.append(elt);
    });
    contentElt.append(creditsContainer);

}
