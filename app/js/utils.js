function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
        n = (n * -1).toFixed(digits);
    }
    return n;
}

function waitForElm(elem, selector) {
    return new Promise(resolve => {
        if (elem.querySelector(selector)) {
            return resolve(elem.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (elem.querySelector(selector)) {
                resolve(elem.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(elem, {
            childList: true,
            subtree: true
        });
    });
}

class Signal {
    #counter = 0;

    slots = {};

    connect(object, fn) {
        if (typeof(fn) !== "function") {
            // TODO if fn is str move to function of object
            throw TypeError("Connect to something diferent of function not implemented");
        }

        this.#counter += 1;
        this.slots[this.#counter] = fn.bind(object);

        return this.#counter;
    }

    disconnect(id) {
        delete this.slots[id];
    }

    emit(...args) {
        Object.entries(this.slots).forEach((arr)=>arr[1](...args));
    }
}

export { roundTo, waitForElm, Signal };