/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screen_js__ = __webpack_require__(1);

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

let s = __WEBPACK_IMPORTED_MODULE_0__screen_js__["a" /* Screen */];
let elt = s.elt;

let addEventForm = document.querySelector("#eventForm");
let editForm = document.querySelector("#editForm");
let viewEvent = document.querySelector("#viewModal");
let dayEls = document.getElementsByClassName("day");

function generateCalHtml(parent) {
    let totalDays = daysInMonth[firstDay.getMonth()];
    let month = monthLabels[firstDay.getMonth()];
    let year = firstDay.getFullYear();
    let tableDiv = parent;
    let table = elt("table")
    let tr; 
    let tdHeight = document.querySelector("body").clientHeight*.82*.15;
    console.log(tdHeight);
    let th = elt("div", {id:"calCurrentMonth"}, elt("span", {
        id: "month"
    }, `${month}`), elt("span", {
        id: "year"
    }, `${year}`));
    document.querySelector("#calHeader").appendChild(th);

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
                        style: "position: relative",
                        id: `event_${day}-${firstDay.getMonth()}-${firstDay.getFullYear()}`,
                        height: tdHeight
                    }, elt("text", {
                        class: "calNumber"
                    }, `${day}`),
                    eventContainer);

                eventContainer.addEventListener("click", event => {
                    if(isMobile()){
                        document.querySelector("#mobileMenuModal").style.display = "block";
                    }
                    else{
                        if (event.target == eventContainer) // do not display add event if eventcontainer itself was not clicked
                            document.querySelector("#eventModal").style.display = "block";
                    }
                });

                td.addEventListener("click",  event => {
                    selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), day);
                    selectedDateTD = td;

                    //If the device is mobile open a selection menu
                    if(isMobile()){
                        document.querySelector("#mobileMenuModal").style.display = "block";
                    }
                    else{
                        if (event.target == td) // do not display add event if td itself was not clicked
                            document.querySelector("#eventModal").style.display = "block";
                    }
                    
                    //addEvent(td);
                    //event.target.style.border = 'red solid 3px';
                })
            } else
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
            fillInView();
            if(!isMobile())
                document.querySelector("#viewModal").style.display = "block";
            //event.stopPropagation();
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
    let titleELem = document.querySelector("#viewEventTitle");
    let timeElem = document.querySelector("#viewEventTime");
    let notesELem = document.querySelector("#viewEventNotes");
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

    titleELem.textContent = title;
    timeElem.textContent = time;
    notesELem.textContent = notes;
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


window.addEventListener("click", function (event) {
    let eventmodal = document.querySelector("#eventModal");
    let editmodal = document.querySelector("#editModal");
    if (event.target == eventmodal) {
        setStyleNone("#eventModal");
        addEventForm.reset();
    } else if (event.target == eventmodal) {
        setStyleNone("#editModal");
        editmodal.reset();
    }
});


addEventForm.addEventListener("submit", function (event) {
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
});



editForm.addEventListener("submit", function (event) {
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
    viewEvent.style.display = "block";
    event.preventDefault();

    //if (time) event.target.getElementsByClassName("calEventTime")[0].textContent = time;
    //if (title) event.target.getElementsByClassName("calEventTitle")[0].textContent = title;
});

document.querySelector("#viewEdit").addEventListener("click", event => {
    //Close event view, open edit modal 
    setStyleNone(viewEvent);
    document.querySelector("#editModal").style.display = "block";
});

document.querySelector("#viewDelete").addEventListener("click", event => {
    let userConfirm = confirm("This will permanently delete the event. Do you wish to continue?");
    if (userConfirm) {
        events.some((e) => {
            //Remove event from stored events
            if (e.id == selectedEvent.id) {
                events.splice(events.indexOf(e), 1);
                save();
                return true;
            }
        });
        //remove div
        selectedEvent.parentElement.removeChild(selectedEvent);
        setStyleNone(viewEvent);
    }
});

/////////////////////////////////////////////
//////|MAIN|////////////////////////////////
///////////////////////////////////////////

for (var i = 0; i < dayEls.length; i++) {
    dayEls[i].addEventListener('click', function (event) {
        selectedDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), event.innerHTML);
    }, false);
}
//localStorage.clear();
//document.querySelector("#calender").innerHTML = generateCalHtml();
generateCalHtml(document.querySelector("#calender"));
load();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createObjToElt */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__error_js__ = __webpack_require__(2);
//Menu contains wrapper, header, content, footer, and optional buttons inside or outside of form and optional close button in the header
//Menu is an object


/**
  @typedef elemObj 
  @type {object}
 */
/**
  @typedef labelObj
  @type {object}
  @property {string} text - label text
  @property {string} for  - should match id of element
 */
/**
  @typedef inputObj
  @type {object}
  @property {string} type    - type attribute
  @property {string} name    - name attribute
  @property {string} id      - element id
  @property {labelObj} label - label object 
 */

/**
 @typedef formObj
 @type {object}
 @property {string[]} elems - array of elements
*/


const Screen = {
    fillInMenu: (menu) => {

    },

    /**
     * Creates an element node
     * @param {string} name name of element
     * @param {object} attributes attributes of element as an object
     * @param {HTMLElement} pchildren additional arguments added to node as children
     */
    elt: (name, attributes, ...children) => {
        let node = document.createElement(name);
        if (attributes) {
            for (let attr in attributes)
                if (attributes.hasOwnProperty(attr))
                    node.setAttribute(attr, attributes[attr]);
        }
        for (let child of children) {
            if (typeof child == "string")
                child = document.createTextNode(child);
            node.appendChild(child);
        }
        return node;
    },

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Screen;


const createObj = {
    /**
     * Add classes to element objects
     * @param {elemObj}
     * @param {...string}
     */
    addClasses: (elemObj, ...classes) => {
        classes.forEach(newClass => {
            if (!elemObj.hasOwnProperty('class')) //create blank class property if element does not have one
                elemObj['class'] = '';
            elemObj['class'] += ' ' + newClass;
        });
    },

    /**
     * remove classes to element objects
     * @param {elemObj}
     * @param {...string}
     */
    removeClasses: (elemObj, ...classes) => {
        let oldClasses = [];

        if (!elemObj.hasOwnProperty('class')) //dont remove class if object does not have any
            return;

        oldClasses = elemObj['class'].split(" "); //seperate the element's classes

        //splice each class to be removed
        classes.forEach(classToRemove => {
            let index = oldClasses.indexOf(classToRemove);

            if (index !== -1)
                oldClasses.splice(index, 1);
        });

        //element objects new class attribute will be remaining classes
        elemObj['class'] = '';
        addClasses(elemObj, ...oldClasses);

    },

    /**
     Creates an object representing an input element
     * @param {string} inputType type attribute of input (such as 'time' or 'color')
     * @param {string} inputName name attribute of input
     * @param {string} inputId   id of input
     * @param {labelObj} label   label object representing a label element
     * @param {string} classes class attribute
     * @return {inputObj} an input object
     */
    input: (inputType = null, inputName = null, inputId = null, label = null, ...classes) => {
        let inputObj = {
            elem: 'input'
        };

        if (inputType) inputObj["type"] = inputType;
        if (inputName) inputObj["name"] = inputName;
        if (inputId) inputObj["id"] = inputId;
        if (label) inputObj["label"] = label;

        if (label && inputId) label["for"] = inputId; //set label's 'for' attribute to be input's id if it has an id

        if (classes.length > 0) addClasses(inputObj);

        return inputObj;
    },

    /**
     * Creates an object represtenting a label element
     * @param {string} text label text
     * @param {string} pattern pattern attribute
     * @param {string} forAttribute for attribute
     * @param {string} classes class attribute
     */
    label: (text, pattern, forAttribute, ...classes) => {
        let labelObj = {
            elem: 'label'
        }

        if (text === '' || text === null || text === undefined)
            throw Object(__WEBPACK_IMPORTED_MODULE_0__error_js__["a" /* CreateError */])("Could not create label: label must have text");

        labelObj['text'] = text;
        if (pattern) labelObj['pattern'] = pattern;
        if (forAttribute) labelObj['for'] = forAttribute;

        if (classes.length > 0) addClasses(labelObj);

        return labelObj;
    },

    /**
     * Creates an object represtenting a button element
     * @param {string} text label text
     * @param {string} btnId id attribute
     * @param {string} btnType type attribute
     * @param {string} classes class attribute
     */
    button: (text, btnId, btnType, btnPlacement, ...classes) => {
        let buttonObj = {
            elem: 'button'
        }

        if (text === '' || text === null || text === undefined)
            throw Object(__WEBPACK_IMPORTED_MODULE_0__error_js__["a" /* CreateError */])("Could not create button: button must have text");

        buttonObj['text'] = text;
        if (btnId)        buttonObj['id']        = btnId;
        if (btnType)      buttonObj['type']      = btnType;
        if (btnPlacement) buttonObj['placement'] = btnPlacement;

        if (classes.length > 0) addClasses(buttonObj);

        return buttonObj;
    },

    /**
     * Bundles inputs and text into a form object.
     * @param {...elemObj|...string} elemObjs element object or text
     * @return {formObj}
     */
    form: (...elemObjs) => {
        let formObj = {
            elems: []
        };

        elemObjs.forEach(elem => {
            //Change plain text into a paragraph object
            if (typeof elem === 'string')
                elem = {
                    elem: 'p',
                    text: elem
                };
            formObj.elems.push(elem);
        });

        return formObj;
    }
}
/* unused harmony export createObj */


function createObjToElt(createObj){
    if(!createObj || (createObj.constructor === Object && Object.keys(createObj).length > 0))
        throw new error("Create object could not be converted to element: create object must be a non empty object");
    if(!createObj.hasOwnProperty("elem"))
        throw new error("Create object could not be converted to element: create object must have elem as property");
    TODO:
    switch(createObj.elem){
    }

} 

//Abbreviate 
let c = createObj;

const addEventMenu = {
    header: {
        title: "Add Event to Calender"
    },
    form: c.form(c.input("time", "time", "addEventTime", c.label("Time:")),
        c.input(null, "title", "addEventTitle", c.label("Title:")),
        c.input(null, "notes", "addEventNotes", c.label("Notes:", ".{0}"))
    ),
    buttons: [
        c.button("save", "addEventSubmit", "submit", "form")
    ]
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class CustomError extends Error {
    constructor(...args) {
        super(...args)
        Error.captureStackTrace(this, CustomError)
    }
}

class CreateError extends CustomError {
    constructor(...args) {
        super("Create error.", ...args);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CreateError;


/***/ })
/******/ ]);