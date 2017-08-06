import {Screen, Menus} from './screen.js'
// weekly labels
let weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// monthly labels
let monthLabels = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

// days in months, in order
let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// current date
let currentDate = new Date();

// selected date
let selectedDate = new Date();
let selectedDateTD = "none";

//selected event
let selectedEvent = "none";

//events
let eventCnt = 0;

// starting date of the calender
let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// map sticker type to image
let stickerMap = new Map();

// stored events
let events = [];

//stored stickers
let stickers = [];

//current frame
let frame = {};

let s = Screen;
let elt = s.elt;

let dayEls = document.getElementsByClassName("day");

function generateCalHtml(parent) {
    let totalDays = daysInMonth[firstDay.getMonth()];
    let month = monthLabels[firstDay.getMonth()];
    let year = firstDay.getFullYear();
    let tableDiv = parent;
    let table = elt("table");
    let tr;
    //let tdHeight = document.querySelector("body").clientHeight*.82*.15;
    let th = elt("div", {id:"calCurrentMonth"}, elt("span", {
        id: "month"
    }, `${month}`), elt("span", {
        id: "year"
    }, `${year}`));
    document.querySelector("#calender .header").appendChild(th);

    if (firstDay.getMonth() == 1) //february
        if (isLeapYear(firstDay.getFullYear()))
            totalDays = 29;

    tr = elt("tr");
    for (let day = 0; day < 7; day++) {
        let td = elt("td", {
            class: "weekday"
        }, elt("span", {}, `${weekLabels[day]}`));
        tr.appendChild(td);
    }
    table.appendChild(tr);

    let cell = 0;
    for (let i = 0; i < 6; i++) {
        tr = elt("tr");
        for (var j = 0; j < 7; j++) {
            cell++;
            let fday = firstDay.getDay() + 1;
            let day = cell - fday + 1;
            let td;
            let eventContainer;
            if (cell >= fday && day <= totalDays) {
                eventContainer = elt("div", {class: "eventContainer"})
                td = elt("td", {
                        class: "day",
                        id: `event_${day}-${firstDay.getMonth()}-${firstDay.getFullYear()}`,
                    }, elt("text", {
                        class: "calNumber"
                    }, `${day}`),
                    eventContainer);

                eventContainer.addEventListener("click", event => {
                    selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
                    selectedDateTD = td;
                    console.log("click");
                    if (event.target == eventContainer){
                        if(isMobile())
                            s.toggleMenu(Menus.mobile);
                        else
                            s.toggleMenu(Menus.addEvent);
                    }
                });

                td.addEventListener("click",  event => {
                    selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
                    selectedDateTD = td;
                    if (event.target == td){
                        if(isMobile())
                            s.toggleMenu(Menus.mobile);
                        else
                            s.toggleMenu(Menus.addEvent);
                    }
                })
            }
            else
                td = elt("td", {
                    class: "nonday"
                });

            td.appendChild(elt("div"));

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableDiv.appendChild(table);
}

function isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        return true;
    else
        return false;
}

/**
 * Calender Sticker
 * @param {string} type type should correspond to a mapping
 * @param {object} transform transform object
 */
function Sticker(type, transform) {
    if (stickerMap.has(type))
        this.type = type;
    else
        console.error("Sticker type does not exsist");

    this.transform = transform;
}

/**
 * Transformations applied to a sticker
 * @param {number} scale
 * @param {number} rotate
 */
function Transform(scale = 0, rotate = 0) {
    this.scale = scale;
    this.rotate = rotate;
}

/**
 * Calender Events
 * @param {string} time time of the event
 * @param {string} title title of the event
 * @param {string} notes notes of the event
 * @param {string} tdid the id of the td that the event belongs to, should be in the form of day-month-year
 */
function Event(time, title, notes = "", tdid = null) {
    this.time = time;
    this.title = title;
    this.notes = notes;
    this.tdID = tdid;
    this.id = `calEvent_${this.tdID}_#${++eventCnt}`;

    if (this.tdID === null) {
        throw new error("Error: event tdID cannot be null");
    }

    if (this.time === '' && this.title === '') {
        throw new error("Error: cannot create blank event");
    }

    this.toElement = () => {
        let e = elt("div", {
            class: 'calEvent',
            id: this.id
        }, elt("span", {
            class: 'calEventTime'
        }, this.time), elt("span", {
            class: 'calEventTitle'
        }, this.title));

        //click event for event
        e.addEventListener("click", event => {
            selectedEvent = e;
            if(!isMobile()){
                fillInView();
                s.fillInMenu(Menus.viewEvent);
            }
        });
        return e;
    }
}

/**
 * Sets style attribute to none
 * @param {string|HTMLElement} selector document selector
 */
function setStyleNone(selector) {
    if (!(selector instanceof HTMLElement)) {
        let sel = document.querySelector(selector);
        if (sel)
            sel.style.display = "none";
    } else
        selector.style.display = "none";
}

/**
 * Fills in viewModal
 * @param {string} title title of event
 * @param {string} time time of event
 * @param {string} notes notes about event
 */
function fillInView() {
    let title = "(No Title)",
        time = "(No Time)",
        notes = "(No Notes)";

    events.some(e => {
        if (e.id == selectedEvent.id) {
            if (e.title != "") title = e.title;
            if (e.time != "") time = e.time;
            if (e.notes != "") notes = e.notes;
            return true;
        }
    })
    Menus.contentGenerators.viewEvent(title, time, notes);
}

function isMobile(){
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    if(w <= 631)
        return true;
    else
        return false;
}

/**
 * Saves calender information to local storage
 */
function save() {
    //save events
    let evs = {};
    events.forEach((event, i) => {
        evs[i] = event;
    });

    localStorage.setItem('events', JSON.stringify(evs));

    //save stickers
    let sckers = {};
    stickers.forEach(function (sticker, i) {
        sckers[i] = sticker;
    });
    localStorage.setItem('stickers', JSON.stringify(sckers));

    //save frame
    localStorage.setItem('frame', JSON.stringify(frame));
}

/**
 * Loads and reinstates calender information from storage a
 */
function load() {
    let evs = JSON.parse(localStorage.getItem('events'));
    let sckers = JSON.parse(localStorage.getItem('stickers'));
    //let fme = JSON.parse(localStorage.getItem('frame'));

    for (let e in evs) {
        //add events to stored events
        let newEvent = new Event(evs[e].time, evs[e].title, evs[e].notes, evs[e].tdID); //create a new event from the stored one
        events.push(newEvent);
        //parse event into an element and append to corresponding div
        let td = document.getElementById(`${newEvent.tdID}`);
        if (td) //check that query selection is not null
            td.getElementsByClassName("eventContainer")[0].appendChild(newEvent.toElement());
    }
    //TODO: load stickers
    for (let s in sckers) {
        stickers.push(sckers[s]);
    }
    //frame = fme;
}

//////////////////////////////////////////////
/////|EVENT LISTENERS|///////////////////////
////////////////////////////////////////////

var closes = document.querySelectorAll(".close");
closes.forEach(close => {
    close.addEventListener("click", event => {
        let modal = close.parentNode.parentNode;
        setStyleNone(modal);
    });
});

/**
 * Shows menu from given string
 * @param  {string} menu the menu to show
 */
function showMenu(menu){
    let menuToShow = null;
    switch(menu){
        case 'editEvent': menuToShow = Menus.editEvent; break;
        case 'addEvent' : menuToShow = Menus.addEvent;  break;
        case 'viewEvent': menuToShow = Menus.viewEvent; break;
        case 'mobile'   : menuToShow = Menus.mobile;    break;
        default: throw error("Menu could not be shown. Menu could not be found.");
    }
    toggleMenu(menuToShow);
}


function addEventFormSubmit(event) {
    let addEventForm = document.querySelector("#addEventForm");
    let time = addEventForm.elements.time.value;
    let title = addEventForm.elements.title.value;
    let notes = addEventForm.elements.notes.value;

    try {
        let ev = new Event(time, title, notes, selectedDateTD.id);
        let evElem = ev.toElement();
        events.push(ev);
        selectedDateTD.getElementsByClassName("eventContainer")[0].appendChild(evElem);
        selectedEvent = evElem;
        fillInView();
        save(); //save the new event
    } catch (error) {
        //Do not create event if error
        console.error("Error:", error.message);
        alert(`Event could not be created.${(time!=""&&title!="")?'':' Event must have time or title.'}`);
    } finally {
        setStyleNone(addEventForm.parentElement.parentElement.parentElement);
        addEventForm.reset();
        event.preventDefault();
    }
}



function editFormSubmit(event) {
    let editForm = document.querySelector("#editEventForm");
    let time = editForm.elements.time.value;
    let title = editForm.elements.title.value;
    let notes = editForm.elements.notes.value;

    //find stored event to update its data
    events.some(function (e) {
        if (e.id == selectedEvent.id) {
            if (time) e.time = time;
            if (title) e.title = title;
            if (notes) e.notes = notes;
            save();
            return true;
        }
    });

    if (time) selectedEvent.getElementsByClassName("calEventTime")[0].textContent = time;
    if (title) selectedEvent.getElementsByClassName("calEventTitle")[0].textContent = title;

    setStyleNone(editForm.parentElement.parentElement.parentElement);
    editForm.reset();

    fillInView();
    toggleMenu(Menus.viewEvent);
    event.preventDefault();
}

function deleteEvent(event = null, eventElt){
    let userConfirm = confirm("This will permanently delete the event. Do you wish to continue?");
    if (userConfirm) {
        //If event is either not provided or is not an object, search for a matching event
        if(!event || !eventElt || event.constructor !== Object ){
            events.some((e) => {
                if (e.id == selectedEvent.id) {
                    event = e;
                    eventElt = selectedEvent;
                    return true;
                }
            });
        }

        if(event !== null && events.indexOf(event)){
            events.splice(events.indexOf(event), 1);
            save();
        }
        else{
            console.warn("Warning: event was not deleted. Event could not be found");
        }

        //remove div
        eventElt.parentElement.removeChild(eventElt);
        setStyleNone(".menu");
    }
}

/////////////////////////////////////////////
//////|MAIN|////////////////////////////////
///////////////////////////////////////////

for (var i = 0; i < dayEls.length; i++) {
    dayEls[i].addEventListener('click', function (event) {
        selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), event.innerHTML);
    }, false);
}
//localStorage.clear();
generateCalHtml(document.querySelector("#calender .table"));
load();
