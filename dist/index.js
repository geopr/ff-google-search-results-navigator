(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function applyFocusStyle(e) {
        e.target.style.outline = 'rgb(189, 193, 198) auto 1px';
    }
    function applyBlurStyle(e) {
        e.target.style.outline = '0';
    }
    function matchChildren({ children }) {
        return (children.length >= 2 &&
            isBr(children.item(0)) &&
            isH(children.item(1)));
        function isBr(el) {
            return el.tagName === 'BR';
        }
        function isH(el) {
            return /^H\d$/.test(el.tagName);
        }
    }
    function isVisible(el) {
        let parent = el;
        while (parent != null) {
            const { display } = window.getComputedStyle(parent);
            if (display === 'none')
                return false;
            parent = parent.parentElement;
        }
        return true;
    }
    function matchKeys(e) {
        return e.altKey && e.shiftKey && /^Bracket(Left|Right)$/.test(e.code);
    }
    function cursorComputerFactory(resultLinks) {
        const min = 0, max = resultLinks.length - 1, start = min - 1, end = max + 1;
        let cursor = start;
        return e => {
            const isGoingForward = e.code === 'BracketRight', cycledCursor = cycleCursor(isGoingForward), nextCursor = computeNextCursor(cycledCursor, isGoingForward);
            return (cursor = normalizeCursor(nextCursor));
        };
        function cycleCursor(isGoingForward) {
            if (isGoingForward) {
                if (cursor === max)
                    return start;
            }
            else {
                if (cursor === min)
                    return end;
            }
            return cursor;
        }
        function computeNextCursor(cursor, isGoingForward) {
            return cursor + (isGoingForward ? 1 : -1);
        }
        function normalizeCursor(cursor) {
            return Math.max(Math.min(cursor, max), min);
        }
    }
    function accessByIndex(arr) {
        return index => arr[index];
    }
    function on(el, event) {
        let resolve = null, promise = null, isDone = false;
        el.addEventListener(event, handler);
        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            next() {
                if (isDone)
                    return this.return();
                return promise !== null && promise !== void 0 ? promise : (promise = createPromsie());
                function createPromsie() {
                    return new Promise(res => {
                        resolve = e => {
                            res({ done: false, value: e });
                            promise = null;
                            resolve = null;
                        };
                    });
                }
            },
            return() {
                const doneChunk = { done: true, value: undefined };
                if (isDone)
                    return ret();
                isDone = true;
                resolve === null || resolve === void 0 ? void 0 : resolve(doneChunk);
                promise = null;
                resolve = null;
                el.removeEventListener(event, handler);
                return ret();
                function ret() {
                    return Promise.resolve(doneChunk);
                }
            }
        };
        function handler(e) {
            resolve === null || resolve === void 0 ? void 0 : resolve(e);
        }
    }
    class Iter {
        constructor(iterable) {
            this.iterable = iterable;
            this.iterable = iterable;
        }
        [Symbol.asyncIterator]() {
            return this.iterable[Symbol.asyncIterator]();
        }
        filter(cb) {
            return this.createIter(function () {
                return __asyncGenerator(this, arguments, function* () {
                    var _a, e_1, _b, _c;
                    try {
                        for (var _d = true, _e = __asyncValues(this), _f; _f = yield __await(_e.next()), _a = _f.done, !_a;) {
                            _c = _f.value;
                            _d = false;
                            try {
                                const value = _c;
                                if (cb(value))
                                    yield yield __await(value);
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                });
            });
        }
        map(cb) {
            return this.createIter(function () {
                return __asyncGenerator(this, arguments, function* () {
                    var _a, e_2, _b, _c;
                    try {
                        for (var _d = true, _e = __asyncValues(this), _f; _f = yield __await(_e.next()), _a = _f.done, !_a;) {
                            _c = _f.value;
                            _d = false;
                            try {
                                const value = _c;
                                yield yield __await(cb(value));
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                });
            });
        }
        createIter(gen) {
            return new Iter(gen.call(this));
        }
    }
    function eventStream(el, event) {
        return new Iter(on(el, event));
    }

    const resultLinks = Array.from(document.querySelectorAll('a[data-ved][data-usg]'))
        .filter(isVisible)
        .filter(matchChildren);
    for (const link of resultLinks) {
        link.addEventListener('focus', applyFocusStyle);
        link.addEventListener('blur', applyBlurStyle);
    }
    (() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const computeCursor = cursorComputerFactory(resultLinks), getLinkByCursor = accessByIndex(resultLinks), stream = eventStream(document.body, 'keydown')
            .filter(matchKeys)
            .map(computeCursor)
            .map(getLinkByCursor);
        try {
            for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a;) {
                _c = stream_1_1.value;
                _d = false;
                try {
                    const link = _c;
                    link === null || link === void 0 ? void 0 : link.scrollIntoView({ block: 'center' });
                    link === null || link === void 0 ? void 0 : link.focus();
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }))();

})();
