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


export { roundTo, waitForElm };