//Menu contains wrapper, header, content, footer, and optional buttons inside or outside of form and optional close button in the header
//Menu is an object
import {
    CreateError
} from './error.js'

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


export const Screen = {
    fillInMenu: (menu) => {
        let menuElt = document.querySelector(".menuWrapper");
        let headerElt = document.querySelector(".menuHeader");
        let contentElt = document.querySelector(".menuContent");
        let titleElt = document.querySelector(".menuTitle");
        let bkgElt = document.querySelector(".menuBackground");
        let footerElt = document.querySelector(".menuFooter");
        let hasId = menu.hasOwnProperty("data") ? menu.data.hasOwnProperty("id") : false;
        let buttonPlacements = {
            content: []
        };

        //Set ids
        if (hasId) {
            menuElt.id = menu.id + "Wrapper";
            headerElt.id = menu.id + "Header";
            contentElt.id = menu.id + "Content";
            titleElt.id = menu.id + "Title";
            bkgElt.id = menu.id + "Background";
            footerElt.id = menu.id + "Footer";
        } else {
            menuElt.removeAttribute('id');
            headerElt.removeAttribute('id');
            contentElt.removeAttribute('id');
            titleElt.removeAttribute('id');
            bkgElt.removeAttribute('id');
            footerElt.removeAttribute('id');
        }

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
                        buttonPlacements[button.placement] = [button];
                }
            });
        }

        if (menu.hasOwnProperty("header") && menu["header"].hasOwnProperty("title"))
            titleElt.textContent = menu.header.title;

        //append child objects
        if (menu.hasOwnProperty("header"))
            for (let obj in menu.header)
                if (typeof obj === "object" && obj !== "title")
                    headerElt.appendChild(createObjToElt(menu.header[obj]));
        if (menu.hasOwnProperty("content"))
            for (let obj in menu.content)
                if (typeof obj === "object")
                    bkgElt.appendChild(createObjToElt(menu.content[obj]));
        if (menu.hasOwnProperty("footer"))
            for (let obj in menu.footer)
                if (typeof obj === "object")
                    footerElt.appendChild(createObjToElt(menu.footer[obj]));

        //append button div
        for (let place in buttonPlacements){
            let elt;
            if (place === "header"){
                if(hasId) elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsHeader", id: menu.id + "BtnsHeader"}, {}, ...buttonPlacements.header));
                else elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsHeader"}, {}, ...buttonPlacements.header));
                headerElt.appendChild(elt);
            }
            else if (place === "content" && buttonPlacements.content.length > 0){
                if(hasId) elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsContent", id: menu.id + "BtnsContent"}, {}, ...buttonPlacements.content));
                else elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsContent"}, {}, ...buttonPlacements.content));
                bkgElt.appendChild(elt);
            }
            else if (place === "footer"){
                if(hasId) elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsFooter", id: menu.id + "BtnsFooter"}, {}, ...buttonPlacements.footer));
                else elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsFooter"}, {}, ...buttonPlacements.footer));
                footerElt.appendChild(elt);
            }
            else if (place === "form"){
                if(hasId) elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsForm", id: menu.id + "BtnsForm"}, {}, ...buttonPlacements.form));
                else elt = eltObjToElt(eltObj("div", {class: "menuBtns menuBtnsForm"}, {}, ...buttonPlacements.form));
                document.querySelector("#"+buttonPlacements.form[0].parentId).appendChild(elt);
            }
            else
                throw new error("Could not place button. Button placement is invalid");
        }

    },

    /**
     * Creates an element node
     * @param {string} name name of element
     * @param {{}} attributes attributes of element as an object
     * @param {HTMLElement|string} children additional arguments added to node as children
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

    /**
     * Creates an object representation of an element
     * @param {string} element Name of the element
     * @param {{}|string} attributes Attributes as an object. Singular attribute can be given as a string
     * @param {{}|string} data Meta-data, such as placement, as an object. Singular data attribute can be given as a string 
     * @param {{element: string, attributes: {}, data: {}, children: []}|string} children stored as an array of child eltObjs. Can also be a child text node represented as a string
     * @return {{element: string, attributes: {}, data: {}, children: []}}
     */
    eltObj: (element, attributes = {}, data = {}, ...children = []) => {
        let elementObj = {
            elem: element
        }

        if (attributes.constructor === Object)
            elementObj["attributes"] = attributes;
        else if (attributes.constructor === String) { //attempt to transform string into an object
            let parse = JSON.parse("{" + attributes + "}");
            if (parse.constructor === Object)
                elementObj["attributes"] = parse;
        }

        if (data.constructor === Object)
            elementObj["data"] = data;
        else if (data.constructor === String) { //attempt to transform string into an object
            let parse = JSON.parse("{" + data + "}");
            if (parse.constructor === Object)
                elementObj["data"] = parse;
        }

        elementObj["children"] = children;

        return elementObj;
    },

    /**
     * Transforms element object into an element. 
     * @param {{element: string, attributes: {}, data: {}, children: []}} createObj 
     * @return {HTMLElement}
     */
    eltObjToElt: (createObj) => {
        if (!createObj || (createObj.constructor === Object && Object.keys(createObj).length > 0))
            throw new error("Create object could not be converted to element: create object must be a non empty object");
        if (!createObj.hasOwnProperty("elem"))
            throw new error("Create object could not be converted to element: create object must have elem as property");


        let children = [];
        createObj.children.forEach(child => {
            children.push(createObjToElt(child));
        })

        if (createObj.constructor === String) return elt(createObj);
        else if (creatObj.constructor === Object) return elt(createObj.elem, createObj.attributes, ...createObj.children);
        else throw new error("Could not convert object to an element. Must be either an object or a string");
    }
}


/**
 * Stores menus
 * {id, header, content, footer, buttons}
 * note: if button placement is in form, should include parent id 
 */
const Menus = {
    addEvent: {
        id: "addEvent",
        header: {
            title: "Add Event to Calender"
        },
        content: 
            s.eltObj("form", {id: "addEventForm"}, {}, 
                s.eltObj("input", {type: "time", name: "time", id: "addEventTime"}, {}, 
                    s.eltObj("label", {for: "addEventTime"}, {}, "Time:")),
                s.eltObj("input", {name: "title", id: "addEventTitle"}, {}, 
                    s.eltObj("label", {for: "addEventTitle"}, {}, "Title:")),
                s.eltObj("textarea", {name: "notes", id: "addEventNotes", pattern: ".{0}"}, {}, 
                    s.eltObj("label", {for: "addEventNotes"}, {}, "Notes:"))
        ),
        buttons: [
            s.eltObj("button", {id: "addEventSubmit", type: "submit"}, {placement: "form", parentId: "addEventForm"}, "save")
        ]
    },

    editEvent: {
        id: "editEvent",
        header: {
            title: "Edit Event"
        },
        content:
         s.eltObj("form", {id: "editEventForm"}, {}, 
                s.eltObj("input", {type: "time", name: "time", id: "addEventTime"}, {}, 
                    s.eltObj("label", {for: "addEventTime"}, {}, "Time:")),
                s.eltObj("input", {name: "title", id: "addEventTitle"}, {}, 
                    s.eltObj("label", {for: "addEventTitle"}, {}, "Title:")),
                s.eltObj("textarea", {name: "notes", id: "addEventNotes", pattern: ".{0}"}, {}, 
                    s.eltObj("label", {for: "addEventNotes"}, {}, "Notes:"))
        ),
        buttons: [
            s.eltObj("button", {id: "editEventSubmit", type: "submit"}, {placement: "form", parentId: "editEventForm"}, "save")
        ]
    },

    mobile: {
        id: "mobile",
        content: [
            eltObj("span", {}, {}, "Events")
        ],
        buttons: [
            s.eltObj("button", {id: "mobileAddEvent"}, {placement: "footer"}, "New Event")
        ]
    }
}