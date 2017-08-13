//Menu contains wrapper, header, content, footer, and optional buttons inside or outside of form and optional close button in the header
//Menu is an object
import {CreateError} from './error.js'
import {forceArray, bindIfNull} from './helperFunctions'

export const View = {
    /**
     * Checks if element has a specified class
     * @param  {string|HTMLElement}  element element or selector
     * @param  {string}  class_  class to find
     * @return {Boolean}         if class is found
     */
    hasClass: (element, class_) => {
        if (element.constructor === String) {
            element = document.querySelector(element);
            if (element === undefined)
                return;
        }
        return (' ' + element.className + ' ').indexOf(' ' + class_ + ' ') > -1;
    },
    /**
     * addes a class from element
     * @param  {string|HTMLElement} element html element or selector
     * @param  {string} class_  class to add
     */
    addClass: (element, class_) => {
        if (element.constructor === String) {
            element = document.querySelector(element);
            if (element === undefined)
                return;
        }
        if (element.classList)
            element.classList.add(class_);
        else if (!View.hasClass(element, class_)) element.className += " " + class_;
    },

    /**
     * Removes a class from element
     * @param  {string|HTMLElement} element html element or selector
     * @param  {string} class_  class to remove
     */
    removeClass: (element, class_) => {
        if (element.constructor === String) {
            element = document.querySelector(element);
            if (element === undefined)
                return;
        }
        if (element.classList)
            element.classList.remove(class_);
        else if (View.hasClass(element, class_)) {
            var reg = new RegExp('(\\s|^)' + class_ + '(\\s|$)');
            element.class_ = element.class_.replace(reg, ' ');
        }
    },
    /**
     * Sets style attribute to none
     * @param {string|HTMLElement} element element or selector
     * @param {string} class_ class name to toggle
     * @param {boolean=} toggle true, adds class, and false removes class
     */
   toggleClass: (element, class_, toggle) => {
        if (element.constructor === String) {
            element = document.querySelector(element);
            if (element === undefined)
                return;
        }
        if (toggle === true)
            View.addClass(element, class_);
        else if (toggle === false)
            View.removeClass(element, class_);
        else if (hasClass(element, class_))
            View.removeClass(element, class_);
        else
            View.addClass(element, class_);
    },
    addListeners: (elt, listeners) => {
        //force double array
        if (listeners[0] !== undefined && listeners[0].constructor !== Array)
            listeners = [listeners];

        if (listeners[0].constructor !== Array)
            return;

        listeners.forEach(listener => {
            let args = listener.length > 2 ? listener.splice(2) : undefined;
            elt.addEventListener(listener[0], bindIfNull(listener[1]));
        })
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
        * @param {{element: string, attributes: {}, data: {}, children: []}|string} children stored as an array of child View.eltObjs. Can also be a child text node represented as a string
        * @return {{element: string, attributes: {}, data: {}, children: []}}
        */
    eltObj: (element, attributes = {}, data = {}, ...children) => {
        let elementObj = {
            elem: element
        }

        if (attributes.constructor === Object)
            elementObj["attributes"] = attributes;
        else if (attributes.constructor === String) { //attempt to transform string into an object
            /*
            let parse = JSON.parse("{" + attributes + "}");
            if (parse.constructor === Object)
                elementObj["attributes"] = parse;
                */
        }

        if (data.constructor === Object)
            elementObj["data"] = data;
        else if (data.constructor === String) { //attempt to transform string into an object
            /*
            let parse = JSON.parse("{" + data + "}");
            if (parse.constructor === Object)
                elementObj["data"] = parse;
                */
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

        //strings do not need to be converted
        if (createObj.constructor === String) return createObj;

        if (!createObj || createObj.constructor !== Object)
            throw new Error("Create object could not be converted to element: create object must be a non empty object or string");
        if (!createObj.hasOwnProperty("elem"))
            throw new Error("Create object could not be converted to element: create object must have elem as property");

        //convert children to elements
        let children = [];
        if(createObj.constructor === Object){
            createObj.children.forEach(child => {
                children.push(View.eltObjToElt(child));
            })
        }

        //create element
        let elt = View.elt(createObj.elem, createObj.attributes, ...children);

        //add event listeners
        if(createObj.hasOwnProperty('data') && createObj.data.hasOwnProperty('listeners'))
            View.addListeners(elt, createObj.data.listeners);

        if (createObj.constructor === Object) return elt;
        else throw new Error("Could not convert object to an element. Must be either an object or a string");
    }
}
