/**
 * forces given item(s) into array
 * @param items item(s) to become an array. If it is a singular array it is returned.
 * @return {Array}
 */
export function forceArray(...items){
    //do not transform arguments if it is a singular array
    if(items[0] !== undefined && items[0].constructor === Array && items.length === 1)
        return items[0];
    return items;
}

export function bindEnd(fun, ...boundArgs) {
    return function(...args) {
        return fun(...args, ...boundArgs);
    };
}

export function bindFromN(fun, n, ...boundArgs) {
    return function(...args) {
        return fun(...args.slice(0, n-1), ...boundArgs);
    };
}

export function bindIfNull(fun, ...boundArgs){
    return function(...args){
        //replace given arguments if given one argument that is null or undefined
        if ((args[0] === undefined || args[0] === null) && args.length === 1)
            args = boundArgs;
        return fun(...args);
    }
}

function isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        return true;
    else
        return false;
}


export function isMobile(mobileWidth = 631){
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    if(w <= mobileWidth)
        return true;
    else
        return false;
}
