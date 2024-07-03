const ve = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : ""
  , Kl = ve.includes("firefox")
  , jl = ve.includes("safari") && !ve.includes("chrom");
jl && (ve.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(ve));
const Hl = ve.includes("webkit") && !ve.includes("edge")
  , $l = ve.includes("macintosh")
  , rr = typeof devicePixelRatio < "u" ? devicePixelRatio : 1
  , or = typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope
  , ql = typeof Image < "u" && Image.prototype.decode
  , ya = function() {
    let s = !1;
    try {
        const t = Object.defineProperty({}, "passive", {
            get: function() {
                s = !0
            }
        });
        window.addEventListener("_", null, t),
        window.removeEventListener("_", null, t)
    } catch {}
    return s
}();
class Jl {
    constructor(t) {
        this.propagationStopped,
        this.defaultPrevented,
        this.type = t,
        this.target = null
    }
    preventDefault() {
        this.defaultPrevented = !0
    }
    stopPropagation() {
        this.propagationStopped = !0
    }
}
const _e = Jl
  , mi = {
    PROPERTYCHANGE: "propertychange"
};
class Ql {
    constructor() {
        this.disposed = !1
    }
    dispose() {
        this.disposed || (this.disposed = !0,
        this.disposeInternal())
    }
    disposeInternal() {}
}
const ar = Ql;
function th(s, t, e) {
    let i, n;
    e = e || Ze;
    let r = 0
      , o = s.length
      , a = !1;
    for (; r < o; )
        i = r + (o - r >> 1),
        n = +e(s[i], t),
        n < 0 ? r = i + 1 : (o = i,
        a = !n);
    return a ? r : ~r
}
function Ze(s, t) {
    return s > t ? 1 : s < t ? -1 : 0
}
function lr(s, t, e) {
    if (s[0] <= t)
        return 0;
    const i = s.length;
    if (t <= s[i - 1])
        return i - 1;
    if (typeof e == "function") {
        for (let n = 1; n < i; ++n) {
            const r = s[n];
            if (r === t)
                return n;
            if (r < t)
                return e(t, s[n - 1], r) > 0 ? n - 1 : n
        }
        return i - 1
    }
    if (e > 0) {
        for (let n = 1; n < i; ++n)
            if (s[n] < t)
                return n - 1;
        return i - 1
    }
    if (e < 0) {
        for (let n = 1; n < i; ++n)
            if (s[n] <= t)
                return n;
        return i - 1
    }
    for (let n = 1; n < i; ++n) {
        if (s[n] == t)
            return n;
        if (s[n] < t)
            return s[n - 1] - t < t - s[n] ? n - 1 : n
    }
    return i - 1
}
function eh(s, t, e) {
    for (; t < e; ) {
        const i = s[t];
        s[t] = s[e],
        s[e] = i,
        ++t,
        --e
    }
}
function ui(s, t) {
    const e = Array.isArray(t) ? t : [t]
      , i = e.length;
    for (let n = 0; n < i; n++)
        s[s.length] = e[n]
}
function Pe(s, t) {
    const e = s.length;
    if (e !== t.length)
        return !1;
    for (let i = 0; i < e; i++)
        if (s[i] !== t[i])
            return !1;
    return !0
}
function ih(s, t, e) {
    const i = t || Ze;
    return s.every(function(n, r) {
        if (r === 0)
            return !0;
        const o = i(s[r - 1], n);
        return !(o > 0 || e && o === 0)
    })
}
function Di() {
    return !0
}
function Jn() {
    return !1
}
function pi() {}
function nh(s) {
    let t = !1, e, i, n;
    return function() {
        const r = Array.prototype.slice.call(arguments);
        return (!t || this !== n || !Pe(r, i)) && (t = !0,
        n = this,
        i = r,
        e = s.apply(this, arguments)),
        e
    }
}
function $i(s) {
    for (const t in s)
        delete s[t]
}
function Ni(s) {
    let t;
    for (t in s)
        return !1;
    return !t
}
class sh extends ar {
    constructor(t) {
        super(),
        this.eventTarget_ = t,
        this.pendingRemovals_ = null,
        this.dispatching_ = null,
        this.listeners_ = null
    }
    addEventListener(t, e) {
        if (!t || !e)
            return;
        const i = this.listeners_ || (this.listeners_ = {})
          , n = i[t] || (i[t] = []);
        n.includes(e) || n.push(e)
    }
    dispatchEvent(t) {
        const e = typeof t == "string"
          , i = e ? t : t.type
          , n = this.listeners_ && this.listeners_[i];
        if (!n)
            return;
        const r = e ? new _e(t) : t;
        r.target || (r.target = this.eventTarget_ || this);
        const o = this.dispatching_ || (this.dispatching_ = {})
          , a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
        i in o || (o[i] = 0,
        a[i] = 0),
        ++o[i];
        let l;
        for (let h = 0, c = n.length; h < c; ++h)
            if ("handleEvent"in n[h] ? l = n[h].handleEvent(r) : l = n[h].call(this, r),
            l === !1 || r.propagationStopped) {
                l = !1;
                break
            }
        if (--o[i] === 0) {
            let h = a[i];
            for (delete a[i]; h--; )
                this.removeEventListener(i, pi);
            delete o[i]
        }
        return l
    }
    disposeInternal() {
        this.listeners_ && $i(this.listeners_)
    }
    getListeners(t) {
        return this.listeners_ && this.listeners_[t] || void 0
    }
    hasListener(t) {
        return this.listeners_ ? t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0 : !1
    }
    removeEventListener(t, e) {
        const i = this.listeners_ && this.listeners_[t];
        if (i) {
            const n = i.indexOf(e);
            n !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[n] = pi,
            ++this.pendingRemovals_[t]) : (i.splice(n, 1),
            i.length === 0 && delete this.listeners_[t]))
        }
    }
}
const Qn = sh
  , G = {
    CHANGE: "change",
    ERROR: "error",
    BLUR: "blur",
    CLEAR: "clear",
    CONTEXTMENU: "contextmenu",
    CLICK: "click",
    DBLCLICK: "dblclick",
    DRAGENTER: "dragenter",
    DRAGOVER: "dragover",
    DROP: "drop",
    FOCUS: "focus",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    LOAD: "load",
    RESIZE: "resize",
    TOUCHMOVE: "touchmove",
    WHEEL: "wheel"
};
function Y(s, t, e, i, n) {
    if (i && i !== s && (e = e.bind(i)),
    n) {
        const o = e;
        e = function() {
            s.removeEventListener(t, e),
            o.apply(this, arguments)
        }
    }
    const r = {
        target: s,
        type: t,
        listener: e
    };
    return s.addEventListener(t, e),
    r
}
function Nn(s, t, e, i) {
    return Y(s, t, e, i, !0)
}
function et(s) {
    s && s.target && (s.target.removeEventListener(s.type, s.listener),
    $i(s))
}
class ts extends Qn {
    constructor() {
        super(),
        this.on = this.onInternal,
        this.once = this.onceInternal,
        this.un = this.unInternal,
        this.revision_ = 0
    }
    changed() {
        ++this.revision_,
        this.dispatchEvent(G.CHANGE)
    }
    getRevision() {
        return this.revision_
    }
    onInternal(t, e) {
        if (Array.isArray(t)) {
            const i = t.length
              , n = new Array(i);
            for (let r = 0; r < i; ++r)
                n[r] = Y(this, t[r], e);
            return n
        }
        return Y(this, t, e)
    }
    onceInternal(t, e) {
        let i;
        if (Array.isArray(t)) {
            const n = t.length;
            i = new Array(n);
            for (let r = 0; r < n; ++r)
                i[r] = Nn(this, t[r], e)
        } else
            i = Nn(this, t, e);
        return e.ol_key = i,
        i
    }
    unInternal(t, e) {
        const i = e.ol_key;
        if (i)
            rh(i);
        else if (Array.isArray(t))
            for (let n = 0, r = t.length; n < r; ++n)
                this.removeEventListener(t[n], e);
        else
            this.removeEventListener(t, e)
    }
}
ts.prototype.on;
ts.prototype.once;
ts.prototype.un;
function rh(s) {
    if (Array.isArray(s))
        for (let t = 0, e = s.length; t < e; ++t)
            et(s[t]);
    else
        et(s)
}
const xa = ts;
function Z() {
    throw new Error("Unimplemented abstract method.")
}
let oh = 0;
function U(s) {
    return s.ol_uid || (s.ol_uid = String(++oh))
}
class $r extends _e {
    constructor(t, e, i) {
        super(t),
        this.key = e,
        this.oldValue = i
    }
}
class ah extends xa {
    constructor(t) {
        super(),
        this.on,
        this.once,
        this.un,
        U(this),
        this.values_ = null,
        t !== void 0 && this.setProperties(t)
    }
    get(t) {
        let e;
        return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]),
        e
    }
    getKeys() {
        return this.values_ && Object.keys(this.values_) || []
    }
    getProperties() {
        return this.values_ && Object.assign({}, this.values_) || {}
    }
    hasProperties() {
        return !!this.values_
    }
    notify(t, e) {
        let i;
        i = `change:${t}`,
        this.hasListener(i) && this.dispatchEvent(new $r(i,t,e)),
        i = mi.PROPERTYCHANGE,
        this.hasListener(i) && this.dispatchEvent(new $r(i,t,e))
    }
    addChangeListener(t, e) {
        this.addEventListener(`change:${t}`, e)
    }
    removeChangeListener(t, e) {
        this.removeEventListener(`change:${t}`, e)
    }
    set(t, e, i) {
        const n = this.values_ || (this.values_ = {});
        if (i)
            n[t] = e;
        else {
            const r = n[t];
            n[t] = e,
            r !== e && this.notify(t, r)
        }
    }
    setProperties(t, e) {
        for (const i in t)
            this.set(i, t[i], e)
    }
    applyProperties(t) {
        t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_)
    }
    unset(t, e) {
        if (this.values_ && t in this.values_) {
            const i = this.values_[t];
            delete this.values_[t],
            Ni(this.values_) && (this.values_ = null),
            e || this.notify(t, i)
        }
    }
}
const Bt = ah
  , lh = {
    1: "The view center is not defined",
    2: "The view resolution is not defined",
    3: "The view rotation is not defined",
    4: "`image` and `src` cannot be provided at the same time",
    5: "`imgSize` must be set when `image` is provided",
    7: "`format` must be set when `url` is set",
    8: "Unknown `serverType` configured",
    9: "`url` must be configured or set using `#setUrl()`",
    10: "The default `geometryFunction` can only handle `Point` geometries",
    11: "`options.featureTypes` must be an Array",
    12: "`options.geometryName` must also be provided when `options.bbox` is set",
    13: "Invalid corner",
    14: "Invalid color",
    15: "Tried to get a value for a key that does not exist in the cache",
    16: "Tried to set a value for a key that is used already",
    17: "`resolutions` must be sorted in descending order",
    18: "Either `origin` or `origins` must be configured, never both",
    19: "Number of `tileSizes` and `resolutions` must be equal",
    20: "Number of `origins` and `resolutions` must be equal",
    22: "Either `tileSize` or `tileSizes` must be configured, never both",
    24: "Invalid extent or geometry provided as `geometry`",
    25: "Cannot fit empty extent provided as `geometry`",
    26: "Features must have an id set",
    27: "Features must have an id set",
    28: '`renderMode` must be `"hybrid"` or `"vector"`',
    30: "The passed `feature` was already added to the source",
    31: "Tried to enqueue an `element` that was already added to the queue",
    32: "Transformation matrix cannot be inverted",
    33: "Invalid units",
    34: "Invalid geometry layout",
    36: "Unknown SRS type",
    37: "Unknown geometry type found",
    38: "`styleMapValue` has an unknown type",
    39: "Unknown geometry type",
    40: "Expected `feature` to have a geometry",
    41: "Expected an `ol/style/Style` or an array of `ol/style/Style.js`",
    42: "Question unknown, the answer is 42",
    43: "Expected `layers` to be an array or a `Collection`",
    47: "Expected `controls` to be an array or an `ol/Collection`",
    48: "Expected `interactions` to be an array or an `ol/Collection`",
    49: "Expected `overlays` to be an array or an `ol/Collection`",
    50: "`options.featureTypes` should be an Array",
    51: "Either `url` or `tileJSON` options must be provided",
    52: "Unknown `serverType` configured",
    53: "Unknown `tierSizeCalculation` configured",
    55: "The {-y} placeholder requires a tile grid with extent",
    56: "mapBrowserEvent must originate from a pointer event",
    57: "At least 2 conditions are required",
    59: "Invalid command found in the PBF",
    60: "Missing or invalid `size`",
    61: "Cannot determine IIIF Image API version from provided image information JSON",
    62: "A `WebGLArrayBuffer` must either be of type `ELEMENT_ARRAY_BUFFER` or `ARRAY_BUFFER`",
    64: "Layer opacity must be a number",
    66: "`forEachFeatureAtCoordinate` cannot be used on a WebGL layer if the hit detection logic has not been enabled. This is done by providing adequate shaders using the `hitVertexShader` and `hitFragmentShader` properties of `WebGLPointsLayerRenderer`",
    67: "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both",
    68: "A VectorTile source can only be rendered if it has a projection compatible with the view projection",
    69: "`width` or `height` cannot be provided together with `scale`"
};
class hh extends Error {
    constructor(t) {
        const e = lh[t];
        super(e),
        this.code = t,
        this.name = "AssertionError",
        this.message = e
    }
}
const Ea = hh
  , Rt = {
    ADD: "add",
    REMOVE: "remove"
}
  , qr = {
    LENGTH: "length"
};
class gn extends _e {
    constructor(t, e, i) {
        super(t),
        this.element = e,
        this.index = i
    }
}
class ch extends Bt {
    constructor(t, e) {
        if (super(),
        this.on,
        this.once,
        this.un,
        e = e || {},
        this.unique_ = !!e.unique,
        this.array_ = t || [],
        this.unique_)
            for (let i = 0, n = this.array_.length; i < n; ++i)
                this.assertUnique_(this.array_[i], i);
        this.updateLength_()
    }
    clear() {
        for (; this.getLength() > 0; )
            this.pop()
    }
    extend(t) {
        for (let e = 0, i = t.length; e < i; ++e)
            this.push(t[e]);
        return this
    }
    forEach(t) {
        const e = this.array_;
        for (let i = 0, n = e.length; i < n; ++i)
            t(e[i], i, e)
    }
    getArray() {
        return this.array_
    }
    item(t) {
        return this.array_[t]
    }
    getLength() {
        return this.get(qr.LENGTH)
    }
    insertAt(t, e) {
        if (t < 0 || t > this.getLength())
            throw new Error("Index out of bounds: " + t);
        this.unique_ && this.assertUnique_(e),
        this.array_.splice(t, 0, e),
        this.updateLength_(),
        this.dispatchEvent(new gn(Rt.ADD,e,t))
    }
    pop() {
        return this.removeAt(this.getLength() - 1)
    }
    push(t) {
        this.unique_ && this.assertUnique_(t);
        const e = this.getLength();
        return this.insertAt(e, t),
        this.getLength()
    }
    remove(t) {
        const e = this.array_;
        for (let i = 0, n = e.length; i < n; ++i)
            if (e[i] === t)
                return this.removeAt(i)
    }
    removeAt(t) {
        if (t < 0 || t >= this.getLength())
            return;
        const e = this.array_[t];
        return this.array_.splice(t, 1),
        this.updateLength_(),
        this.dispatchEvent(new gn(Rt.REMOVE,e,t)),
        e
    }
    setAt(t, e) {
        const i = this.getLength();
        if (t >= i) {
            this.insertAt(t, e);
            return
        }
        if (t < 0)
            throw new Error("Index out of bounds: " + t);
        this.unique_ && this.assertUnique_(e, t);
        const n = this.array_[t];
        this.array_[t] = e,
        this.dispatchEvent(new gn(Rt.REMOVE,n,t)),
        this.dispatchEvent(new gn(Rt.ADD,e,t))
    }
    updateLength_() {
        this.set(qr.LENGTH, this.array_.length)
    }
    assertUnique_(t, e) {
        for (let i = 0, n = this.array_.length; i < n; ++i)
            if (this.array_[i] === t && i !== e)
                throw new Ea(58)
    }
}
const Xt = ch;
function W(s, t) {
    if (!s)
        throw new Ea(t)
}
new Array(6);
function $t() {
    return [1, 0, 0, 1, 0, 0]
}
function uh(s, t) {
    const e = s[0]
      , i = s[1]
      , n = s[2]
      , r = s[3]
      , o = s[4]
      , a = s[5]
      , l = t[0]
      , h = t[1]
      , c = t[2]
      , u = t[3]
      , d = t[4]
      , f = t[5];
    return s[0] = e * l + n * h,
    s[1] = i * l + r * h,
    s[2] = e * c + n * u,
    s[3] = i * c + r * u,
    s[4] = e * d + n * f + o,
    s[5] = i * d + r * f + a,
    s
}
function dh(s, t, e, i, n, r, o) {
    return s[0] = t,
    s[1] = e,
    s[2] = i,
    s[3] = n,
    s[4] = r,
    s[5] = o,
    s
}
function fh(s, t) {
    return s[0] = t[0],
    s[1] = t[1],
    s[2] = t[2],
    s[3] = t[3],
    s[4] = t[4],
    s[5] = t[5],
    s
}
function ht(s, t) {
    const e = t[0]
      , i = t[1];
    return t[0] = s[0] * e + s[2] * i + s[4],
    t[1] = s[1] * e + s[3] * i + s[5],
    t
}
function gh(s, t, e) {
    return dh(s, t, 0, 0, e, 0, 0)
}
function be(s, t, e, i, n, r, o, a) {
    const l = Math.sin(r)
      , h = Math.cos(r);
    return s[0] = i * h,
    s[1] = n * l,
    s[2] = -i * l,
    s[3] = n * h,
    s[4] = o * i * h - a * i * l + t,
    s[5] = o * n * l + a * n * h + e,
    s
}
function hr(s, t) {
    const e = _h(t);
    W(e !== 0, 32);
    const i = t[0]
      , n = t[1]
      , r = t[2]
      , o = t[3]
      , a = t[4]
      , l = t[5];
    return s[0] = o / e,
    s[1] = -n / e,
    s[2] = -r / e,
    s[3] = i / e,
    s[4] = (r * l - o * a) / e,
    s[5] = -(i * l - n * a) / e,
    s
}
function _h(s) {
    return s[0] * s[3] - s[1] * s[2]
}
let Jr;
function wa(s) {
    const t = "matrix(" + s.join(", ") + ")";
    if (or)
        return t;
    const e = Jr || (Jr = document.createElement("div"));
    return e.style.transform = t,
    e.style.transform
}
const lt = {
    UNKNOWN: 0,
    INTERSECTING: 1,
    ABOVE: 2,
    RIGHT: 4,
    BELOW: 8,
    LEFT: 16
};
function Qr(s) {
    const t = Yt();
    for (let e = 0, i = s.length; e < i; ++e)
        Oi(t, s[e]);
    return t
}
function mh(s, t, e) {
    const i = Math.min.apply(null, s)
      , n = Math.min.apply(null, t)
      , r = Math.max.apply(null, s)
      , o = Math.max.apply(null, t);
    return ge(i, n, r, o, e)
}
function cr(s, t, e) {
    return e ? (e[0] = s[0] - t,
    e[1] = s[1] - t,
    e[2] = s[2] + t,
    e[3] = s[3] + t,
    e) : [s[0] - t, s[1] - t, s[2] + t, s[3] + t]
}
function Sa(s, t) {
    return t ? (t[0] = s[0],
    t[1] = s[1],
    t[2] = s[2],
    t[3] = s[3],
    t) : s.slice()
}
function es(s, t, e) {
    let i, n;
    return t < s[0] ? i = s[0] - t : s[2] < t ? i = t - s[2] : i = 0,
    e < s[1] ? n = s[1] - e : s[3] < e ? n = e - s[3] : n = 0,
    i * i + n * n
}
function he(s, t) {
    return Ca(s, t[0], t[1])
}
function ce(s, t) {
    return s[0] <= t[0] && t[2] <= s[2] && s[1] <= t[1] && t[3] <= s[3]
}
function Ca(s, t, e) {
    return s[0] <= t && t <= s[2] && s[1] <= e && e <= s[3]
}
function zs(s, t) {
    const e = s[0]
      , i = s[1]
      , n = s[2]
      , r = s[3]
      , o = t[0]
      , a = t[1];
    let l = lt.UNKNOWN;
    return o < e ? l = l | lt.LEFT : o > n && (l = l | lt.RIGHT),
    a < i ? l = l | lt.BELOW : a > r && (l = l | lt.ABOVE),
    l === lt.UNKNOWN && (l = lt.INTERSECTING),
    l
}
function Yt() {
    return [1 / 0, 1 / 0, -1 / 0, -1 / 0]
}
function ge(s, t, e, i, n) {
    return n ? (n[0] = s,
    n[1] = t,
    n[2] = e,
    n[3] = i,
    n) : [s, t, e, i]
}
function qi(s) {
    return ge(1 / 0, 1 / 0, -1 / 0, -1 / 0, s)
}
function ph(s, t) {
    const e = s[0]
      , i = s[1];
    return ge(e, i, e, i, t)
}
function yh(s, t, e, i, n) {
    const r = qi(n);
    return Ta(r, s, t, e, i)
}
function yi(s, t) {
    return s[0] == t[0] && s[2] == t[2] && s[1] == t[1] && s[3] == t[3]
}
function xh(s, t, e) {
    return Math.abs(s[0] - t[0]) < e && Math.abs(s[2] - t[2]) < e && Math.abs(s[1] - t[1]) < e && Math.abs(s[3] - t[3]) < e
}
function Eh(s, t) {
    return t[0] < s[0] && (s[0] = t[0]),
    t[2] > s[2] && (s[2] = t[2]),
    t[1] < s[1] && (s[1] = t[1]),
    t[3] > s[3] && (s[3] = t[3]),
    s
}
function Oi(s, t) {
    t[0] < s[0] && (s[0] = t[0]),
    t[0] > s[2] && (s[2] = t[0]),
    t[1] < s[1] && (s[1] = t[1]),
    t[1] > s[3] && (s[3] = t[1])
}
function Ta(s, t, e, i, n) {
    for (; e < i; e += n)
        wh(s, t[e], t[e + 1]);
    return s
}
function wh(s, t, e) {
    s[0] = Math.min(s[0], t),
    s[1] = Math.min(s[1], e),
    s[2] = Math.max(s[2], t),
    s[3] = Math.max(s[3], e)
}
function Ra(s, t) {
    let e;
    return e = t(is(s)),
    e || (e = t(ns(s)),
    e) || (e = t(ss(s)),
    e) || (e = t(Ve(s)),
    e) ? e : !1
}
function Ws(s) {
    let t = 0;
    return Ji(s) || (t = $(s) * qt(s)),
    t
}
function is(s) {
    return [s[0], s[1]]
}
function ns(s) {
    return [s[2], s[1]]
}
function ue(s) {
    return [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2]
}
function Sh(s, t) {
    let e;
    return t === "bottom-left" ? e = is(s) : t === "bottom-right" ? e = ns(s) : t === "top-left" ? e = Ve(s) : t === "top-right" ? e = ss(s) : W(!1, 13),
    e
}
function Xs(s, t, e, i, n) {
    const [r,o,a,l,h,c,u,d] = Ys(s, t, e, i);
    return ge(Math.min(r, a, h, u), Math.min(o, l, c, d), Math.max(r, a, h, u), Math.max(o, l, c, d), n)
}
function Ys(s, t, e, i) {
    const n = t * i[0] / 2
      , r = t * i[1] / 2
      , o = Math.cos(e)
      , a = Math.sin(e)
      , l = n * o
      , h = n * a
      , c = r * o
      , u = r * a
      , d = s[0]
      , f = s[1];
    return [d - l + u, f - h - c, d - l - u, f - h + c, d + l - u, f + h + c, d + l + u, f + h - c, d - l + u, f - h - c]
}
function qt(s) {
    return s[3] - s[1]
}
function di(s, t, e) {
    const i = e || Yt();
    return mt(s, t) ? (s[0] > t[0] ? i[0] = s[0] : i[0] = t[0],
    s[1] > t[1] ? i[1] = s[1] : i[1] = t[1],
    s[2] < t[2] ? i[2] = s[2] : i[2] = t[2],
    s[3] < t[3] ? i[3] = s[3] : i[3] = t[3]) : qi(i),
    i
}
function Ve(s) {
    return [s[0], s[3]]
}
function ss(s) {
    return [s[2], s[3]]
}
function $(s) {
    return s[2] - s[0]
}
function mt(s, t) {
    return s[0] <= t[2] && s[2] >= t[0] && s[1] <= t[3] && s[3] >= t[1]
}
function Ji(s) {
    return s[2] < s[0] || s[3] < s[1]
}
function Ch(s, t) {
    return t ? (t[0] = s[0],
    t[1] = s[1],
    t[2] = s[2],
    t[3] = s[3],
    t) : s
}
function Th(s, t, e) {
    let i = !1;
    const n = zs(s, t)
      , r = zs(s, e);
    if (n === lt.INTERSECTING || r === lt.INTERSECTING)
        i = !0;
    else {
        const o = s[0]
          , a = s[1]
          , l = s[2]
          , h = s[3]
          , c = t[0]
          , u = t[1]
          , d = e[0]
          , f = e[1]
          , g = (f - u) / (d - c);
        let _, m;
        r & lt.ABOVE && !(n & lt.ABOVE) && (_ = d - (f - h) / g,
        i = _ >= o && _ <= l),
        !i && r & lt.RIGHT && !(n & lt.RIGHT) && (m = f - (d - l) * g,
        i = m >= a && m <= h),
        !i && r & lt.BELOW && !(n & lt.BELOW) && (_ = d - (f - a) / g,
        i = _ >= o && _ <= l),
        !i && r & lt.LEFT && !(n & lt.LEFT) && (m = f - (d - o) * g,
        i = m >= a && m <= h)
    }
    return i
}
function Bs(s, t, e, i) {
    if (Ji(s))
        return qi(e);
    let n = [];
    if (i > 1) {
        const a = s[2] - s[0]
          , l = s[3] - s[1];
        for (let h = 0; h < i; ++h)
            n.push(s[0] + a * h / i, s[1], s[2], s[1] + l * h / i, s[2] - a * h / i, s[3], s[0], s[3] - l * h / i)
    } else
        n = [s[0], s[1], s[2], s[1], s[2], s[3], s[0], s[3]];
    t(n, n, 2);
    const r = []
      , o = [];
    for (let a = 0, l = n.length; a < l; a += 2)
        r.push(n[a]),
        o.push(n[a + 1]);
    return mh(r, o, e)
}
function ur(s, t) {
    const e = t.getExtent()
      , i = ue(s);
    if (t.canWrapX() && (i[0] < e[0] || i[0] >= e[2])) {
        const n = $(e)
          , o = Math.floor((i[0] - e[0]) / n) * n;
        s[0] -= o,
        s[2] -= o
    }
    return s
}
function Rh(s, t) {
    if (t.canWrapX()) {
        const e = t.getExtent();
        if (!isFinite(s[0]) || !isFinite(s[2]))
            return [[e[0], s[1], e[2], s[3]]];
        ur(s, t);
        const i = $(e);
        if ($(s) > i)
            return [[e[0], s[1], e[2], s[3]]];
        if (s[0] < e[0])
            return [[s[0] + i, s[1], e[2], s[3]], [e[0], s[1], s[2], s[3]]];
        if (s[2] > e[2])
            return [[s[0], s[1], e[2], s[3]], [e[0], s[1], s[2] - i, s[3]]]
    }
    return [s]
}
function N(s, t, e) {
    return Math.min(Math.max(s, t), e)
}
function Ia(s, t, e, i, n, r) {
    const o = n - e
      , a = r - i;
    if (o !== 0 || a !== 0) {
        const l = ((s - e) * o + (t - i) * a) / (o * o + a * a);
        l > 1 ? (e = n,
        i = r) : l > 0 && (e += o * l,
        i += a * l)
    }
    return fi(s, t, e, i)
}
function fi(s, t, e, i) {
    const n = e - s
      , r = i - t;
    return n * n + r * r
}
function Ih(s) {
    const t = s.length;
    for (let i = 0; i < t; i++) {
        let n = i
          , r = Math.abs(s[i][i]);
        for (let a = i + 1; a < t; a++) {
            const l = Math.abs(s[a][i]);
            l > r && (r = l,
            n = a)
        }
        if (r === 0)
            return null;
        const o = s[n];
        s[n] = s[i],
        s[i] = o;
        for (let a = i + 1; a < t; a++) {
            const l = -s[a][i] / s[i][i];
            for (let h = i; h < t + 1; h++)
                i == h ? s[a][h] = 0 : s[a][h] += l * s[i][h]
        }
    }
    const e = new Array(t);
    for (let i = t - 1; i >= 0; i--) {
        e[i] = s[i][t] / s[i][i];
        for (let n = i - 1; n >= 0; n--)
            s[n][t] -= s[n][i] * e[i]
    }
    return e
}
function An(s) {
    return s * Math.PI / 180
}
function Me(s, t) {
    const e = s % t;
    return e * t < 0 ? e + t : e
}
function vt(s, t, e) {
    return s + e * (t - s)
}
function rs(s, t) {
    const e = Math.pow(10, t);
    return Math.round(s * e) / e
}
function _n(s, t) {
    return Math.floor(rs(s, t))
}
function mn(s, t) {
    return Math.ceil(rs(s, t))
}
const Lh = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i
  , Mh = /^([a-z]*)$|^hsla?\(.*\)$/i;
function La(s) {
    return typeof s == "string" ? s : Ma(s)
}
function vh(s) {
    const t = document.createElement("div");
    if (t.style.color = s,
    t.style.color !== "") {
        document.body.appendChild(t);
        const e = getComputedStyle(t).color;
        return document.body.removeChild(t),
        e
    }
    return ""
}
const bh = function() {
    const t = {};
    let e = 0;
    return function(i) {
        let n;
        if (t.hasOwnProperty(i))
            n = t[i];
        else {
            if (e >= 1024) {
                let r = 0;
                for (const o in t)
                    r++ & 3 || (delete t[o],
                    --e)
            }
            n = Ph(i),
            t[i] = n,
            ++e
        }
        return n
    }
}();
function Gn(s) {
    return Array.isArray(s) ? s : bh(s)
}
function Ph(s) {
    let t, e, i, n, r;
    if (Mh.exec(s) && (s = vh(s)),
    Lh.exec(s)) {
        const o = s.length - 1;
        let a;
        o <= 4 ? a = 1 : a = 2;
        const l = o === 4 || o === 8;
        t = parseInt(s.substr(1 + 0 * a, a), 16),
        e = parseInt(s.substr(1 + 1 * a, a), 16),
        i = parseInt(s.substr(1 + 2 * a, a), 16),
        l ? n = parseInt(s.substr(1 + 3 * a, a), 16) : n = 255,
        a == 1 && (t = (t << 4) + t,
        e = (e << 4) + e,
        i = (i << 4) + i,
        l && (n = (n << 4) + n)),
        r = [t, e, i, n / 255]
    } else
        s.startsWith("rgba(") ? (r = s.slice(5, -1).split(",").map(Number),
        to(r)) : s.startsWith("rgb(") ? (r = s.slice(4, -1).split(",").map(Number),
        r.push(1),
        to(r)) : W(!1, 14);
    return r
}
function to(s) {
    return s[0] = N(s[0] + .5 | 0, 0, 255),
    s[1] = N(s[1] + .5 | 0, 0, 255),
    s[2] = N(s[2] + .5 | 0, 0, 255),
    s[3] = N(s[3], 0, 1),
    s
}
function Ma(s) {
    let t = s[0];
    t != (t | 0) && (t = t + .5 | 0);
    let e = s[1];
    e != (e | 0) && (e = e + .5 | 0);
    let i = s[2];
    i != (i | 0) && (i = i + .5 | 0);
    const n = s[3] === void 0 ? 1 : Math.round(s[3] * 100) / 100;
    return "rgba(" + t + "," + e + "," + i + "," + n + ")"
}
class kh {
    constructor() {
        this.cache_ = {},
        this.cacheSize_ = 0,
        this.maxCacheSize_ = 32
    }
    clear() {
        this.cache_ = {},
        this.cacheSize_ = 0
    }
    canExpireCache() {
        return this.cacheSize_ > this.maxCacheSize_
    }
    expire() {
        if (this.canExpireCache()) {
            let t = 0;
            for (const e in this.cache_) {
                const i = this.cache_[e];
                !(t++ & 3) && !i.hasListener() && (delete this.cache_[e],
                --this.cacheSize_)
            }
        }
    }
    get(t, e, i) {
        const n = eo(t, e, i);
        return n in this.cache_ ? this.cache_[n] : null
    }
    set(t, e, i, n) {
        const r = eo(t, e, i);
        this.cache_[r] = n,
        ++this.cacheSize_
    }
    setSize(t) {
        this.maxCacheSize_ = t,
        this.expire()
    }
}
function eo(s, t, e) {
    const i = e ? La(e) : "null";
    return t + ":" + s + ":" + i
}
const zn = new kh
  , j = {
    OPACITY: "opacity",
    VISIBLE: "visible",
    EXTENT: "extent",
    Z_INDEX: "zIndex",
    MAX_RESOLUTION: "maxResolution",
    MIN_RESOLUTION: "minResolution",
    MAX_ZOOM: "maxZoom",
    MIN_ZOOM: "minZoom",
    SOURCE: "source",
    MAP: "map"
};
class Ah extends Bt {
    constructor(t) {
        super(),
        this.on,
        this.once,
        this.un,
        this.background_ = t.background;
        const e = Object.assign({}, t);
        typeof t.properties == "object" && (delete e.properties,
        Object.assign(e, t.properties)),
        e[j.OPACITY] = t.opacity !== void 0 ? t.opacity : 1,
        W(typeof e[j.OPACITY] == "number", 64),
        e[j.VISIBLE] = t.visible !== void 0 ? t.visible : !0,
        e[j.Z_INDEX] = t.zIndex,
        e[j.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0,
        e[j.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0,
        e[j.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0,
        e[j.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0,
        this.className_ = e.className !== void 0 ? e.className : "ol-layer",
        delete e.className,
        this.setProperties(e),
        this.state_ = null
    }
    getBackground() {
        return this.background_
    }
    getClassName() {
        return this.className_
    }
    getLayerState(t) {
        const e = this.state_ || {
            layer: this,
            managed: t === void 0 ? !0 : t
        }
          , i = this.getZIndex();
        return e.opacity = N(Math.round(this.getOpacity() * 100) / 100, 0, 1),
        e.visible = this.getVisible(),
        e.extent = this.getExtent(),
        e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i,
        e.maxResolution = this.getMaxResolution(),
        e.minResolution = Math.max(this.getMinResolution(), 0),
        e.minZoom = this.getMinZoom(),
        e.maxZoom = this.getMaxZoom(),
        this.state_ = e,
        e
    }
    getLayersArray(t) {
        return Z()
    }
    getLayerStatesArray(t) {
        return Z()
    }
    getExtent() {
        return this.get(j.EXTENT)
    }
    getMaxResolution() {
        return this.get(j.MAX_RESOLUTION)
    }
    getMinResolution() {
        return this.get(j.MIN_RESOLUTION)
    }
    getMinZoom() {
        return this.get(j.MIN_ZOOM)
    }
    getMaxZoom() {
        return this.get(j.MAX_ZOOM)
    }
    getOpacity() {
        return this.get(j.OPACITY)
    }
    getSourceState() {
        return Z()
    }
    getVisible() {
        return this.get(j.VISIBLE)
    }
    getZIndex() {
        return this.get(j.Z_INDEX)
    }
    setBackground(t) {
        this.background_ = t,
        this.changed()
    }
    setExtent(t) {
        this.set(j.EXTENT, t)
    }
    setMaxResolution(t) {
        this.set(j.MAX_RESOLUTION, t)
    }
    setMinResolution(t) {
        this.set(j.MIN_RESOLUTION, t)
    }
    setMaxZoom(t) {
        this.set(j.MAX_ZOOM, t)
    }
    setMinZoom(t) {
        this.set(j.MIN_ZOOM, t)
    }
    setOpacity(t) {
        W(typeof t == "number", 64),
        this.set(j.OPACITY, t)
    }
    setVisible(t) {
        this.set(j.VISIBLE, t)
    }
    setZIndex(t) {
        this.set(j.Z_INDEX, t)
    }
    disposeInternal() {
        this.state_ && (this.state_.layer = null,
        this.state_ = null),
        super.disposeInternal()
    }
}
const va = Ah
  , de = {
    PRERENDER: "prerender",
    POSTRENDER: "postrender",
    PRECOMPOSE: "precompose",
    POSTCOMPOSE: "postcompose",
    RENDERCOMPLETE: "rendercomplete"
}
  , gt = {
    ANIMATING: 0,
    INTERACTING: 1
}
  , Nt = {
    CENTER: "center",
    RESOLUTION: "resolution",
    ROTATION: "rotation"
}
  , Oh = 42
  , dr = 256
  , xi = {
    radians: 6370997 / (2 * Math.PI),
    degrees: 2 * Math.PI * 6370997 / 360,
    ft: .3048,
    m: 1,
    "us-ft": 1200 / 3937
};
class Fh {
    constructor(t) {
        this.code_ = t.code,
        this.units_ = t.units,
        this.extent_ = t.extent !== void 0 ? t.extent : null,
        this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null,
        this.axisOrientation_ = t.axisOrientation !== void 0 ? t.axisOrientation : "enu",
        this.global_ = t.global !== void 0 ? t.global : !1,
        this.canWrapX_ = !!(this.global_ && this.extent_),
        this.getPointResolutionFunc_ = t.getPointResolution,
        this.defaultTileGrid_ = null,
        this.metersPerUnit_ = t.metersPerUnit
    }
    canWrapX() {
        return this.canWrapX_
    }
    getCode() {
        return this.code_
    }
    getExtent() {
        return this.extent_
    }
    getUnits() {
        return this.units_
    }
    getMetersPerUnit() {
        return this.metersPerUnit_ || xi[this.units_]
    }
    getWorldExtent() {
        return this.worldExtent_
    }
    getAxisOrientation() {
        return this.axisOrientation_
    }
    isGlobal() {
        return this.global_
    }
    setGlobal(t) {
        this.global_ = t,
        this.canWrapX_ = !!(t && this.extent_)
    }
    getDefaultTileGrid() {
        return this.defaultTileGrid_
    }
    setDefaultTileGrid(t) {
        this.defaultTileGrid_ = t
    }
    setExtent(t) {
        this.extent_ = t,
        this.canWrapX_ = !!(this.global_ && t)
    }
    setWorldExtent(t) {
        this.worldExtent_ = t
    }
    setGetPointResolution(t) {
        this.getPointResolutionFunc_ = t
    }
    getPointResolutionFunc() {
        return this.getPointResolutionFunc_
    }
}
const ba = Fh
  , Qi = 6378137
  , ci = Math.PI * Qi
  , Dh = [-ci, -ci, ci, ci]
  , Nh = [-180, -85, 180, 85]
  , pn = Qi * Math.log(Math.tan(Math.PI / 2));
class Je extends ba {
    constructor(t) {
        super({
            code: t,
            units: "m",
            extent: Dh,
            global: !0,
            worldExtent: Nh,
            getPointResolution: function(e, i) {
                return e / Math.cosh(i[1] / Qi)
            }
        })
    }
}
const io = [new Je("EPSG:3857"), new Je("EPSG:102100"), new Je("EPSG:102113"), new Je("EPSG:900913"), new Je("http://www.opengis.net/def/crs/EPSG/0/3857"), new Je("http://www.opengis.net/gml/srs/epsg.xml#3857")];
function Gh(s, t, e) {
    const i = s.length;
    e = e > 1 ? e : 2,
    t === void 0 && (e > 2 ? t = s.slice() : t = new Array(i));
    for (let n = 0; n < i; n += e) {
        t[n] = ci * s[n] / 180;
        let r = Qi * Math.log(Math.tan(Math.PI * (+s[n + 1] + 90) / 360));
        r > pn ? r = pn : r < -pn && (r = -pn),
        t[n + 1] = r
    }
    return t
}
function zh(s, t, e) {
    const i = s.length;
    e = e > 1 ? e : 2,
    t === void 0 && (e > 2 ? t = s.slice() : t = new Array(i));
    for (let n = 0; n < i; n += e)
        t[n] = 180 * s[n] / ci,
        t[n + 1] = 360 * Math.atan(Math.exp(s[n + 1] / Qi)) / Math.PI - 90;
    return t
}
const Wh = 6378137
  , no = [-180, -90, 180, 90]
  , Xh = Math.PI * Wh / 180;
class Ae extends ba {
    constructor(t, e) {
        super({
            code: t,
            units: "degrees",
            extent: no,
            axisOrientation: e,
            global: !0,
            metersPerUnit: Xh,
            worldExtent: no
        })
    }
}
const so = [new Ae("CRS:84"), new Ae("EPSG:4326","neu"), new Ae("urn:ogc:def:crs:OGC:1.3:CRS84"), new Ae("urn:ogc:def:crs:OGC:2:84"), new Ae("http://www.opengis.net/def/crs/OGC/1.3/CRS84"), new Ae("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"), new Ae("http://www.opengis.net/def/crs/EPSG/0/4326","neu")];
let Zs = {};
function Yh(s) {
    return Zs[s] || Zs[s.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null
}
function Bh(s, t) {
    Zs[s] = t
}
let gi = {};
function Wn(s, t, e) {
    const i = s.getCode()
      , n = t.getCode();
    i in gi || (gi[i] = {}),
    gi[i][n] = e
}
function Zh(s, t) {
    let e;
    return s in gi && t in gi[s] && (e = gi[s][t]),
    e
}
function ro(s, t, e) {
    const i = e !== void 0 ? s.toFixed(e) : "" + s;
    let n = i.indexOf(".");
    return n = n === -1 ? i.length : n,
    n > t ? i : new Array(1 + t - n).join("0") + i
}
function Vh(s, t) {
    return s[0] += +t[0],
    s[1] += +t[1],
    s
}
function oo(s, t, e) {
    const i = Me(t + 180, 360) - 180
      , n = Math.abs(3600 * i)
      , r = e || 0;
    let o = Math.floor(n / 3600)
      , a = Math.floor((n - o * 3600) / 60)
      , l = rs(n - o * 3600 - a * 60, r);
    l >= 60 && (l = 0,
    a += 1),
    a >= 60 && (a = 0,
    o += 1);
    let h = o + "°";
    return (a !== 0 || l !== 0) && (h += " " + ro(a, 2) + "′"),
    l !== 0 && (h += " " + ro(l, 2, r) + "″"),
    i !== 0 && (h += " " + s.charAt(i < 0 ? 1 : 0)),
    h
}
function Xn(s, t) {
    let e = !0;
    for (let i = s.length - 1; i >= 0; --i)
        if (s[i] != t[i]) {
            e = !1;
            break
        }
    return e
}
function fr(s, t) {
    const e = Math.cos(t)
      , i = Math.sin(t)
      , n = s[0] * e - s[1] * i
      , r = s[1] * e + s[0] * i;
    return s[0] = n,
    s[1] = r,
    s
}
function Uh(s, t) {
    return s[0] *= t,
    s[1] *= t,
    s
}
function gr(s, t) {
    if (t.canWrapX()) {
        const e = $(t.getExtent())
          , i = Kh(s, t, e);
        i && (s[0] -= i * e)
    }
    return s
}
function Kh(s, t, e) {
    const i = t.getExtent();
    let n = 0;
    return t.canWrapX() && (s[0] < i[0] || s[0] > i[2]) && (e = e || $(i),
    n = Math.floor((s[0] - i[0]) / e)),
    n
}
const Pa = 63710088e-1;
function Ne(s, t, e) {
    e = e || Pa;
    const i = An(s[1])
      , n = An(t[1])
      , r = (n - i) / 2
      , o = An(t[0] - s[0]) / 2
      , a = Math.sin(r) * Math.sin(r) + Math.sin(o) * Math.sin(o) * Math.cos(i) * Math.cos(n);
    return 2 * e * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
function ps(s, t) {
    let e = 0;
    for (let i = 0, n = s.length; i < n - 1; ++i)
        e += Ne(s[i], s[i + 1], t);
    return e
}
function ka(s, t) {
    t = t || {};
    const e = t.radius || Pa
      , i = t.projection || "EPSG:3857"
      , n = s.getType();
    n !== "GeometryCollection" && (s = s.clone().transform(i, "EPSG:4326"));
    let r = 0, o, a, l, h, c, u;
    switch (n) {
    case "Point":
    case "MultiPoint":
        break;
    case "LineString":
    case "LinearRing":
        {
            o = s.getCoordinates(),
            r = ps(o, e);
            break
        }
    case "MultiLineString":
    case "Polygon":
        {
            for (o = s.getCoordinates(),
            l = 0,
            h = o.length; l < h; ++l)
                r += ps(o[l], e);
            break
        }
    case "MultiPolygon":
        {
            for (o = s.getCoordinates(),
            l = 0,
            h = o.length; l < h; ++l)
                for (a = o[l],
                c = 0,
                u = a.length; c < u; ++c)
                    r += ps(a[c], e);
            break
        }
    case "GeometryCollection":
        {
            const d = s.getGeometries();
            for (l = 0,
            h = d.length; l < h; ++l)
                r += ka(d[l], t);
            break
        }
    default:
        throw new Error("Unsupported geometry type: " + n)
    }
    return r
}
const Aa = {
    info: 1,
    warn: 2,
    error: 3,
    none: 4
};
let jh = Aa.info;
function Oa(...s) {
    jh > Aa.warn || console.warn(...s)
}
let Vs = !0;
function Fa(s) {
    Vs = !(s === void 0 ? !0 : s)
}
function _r(s, t) {
    if (t !== void 0) {
        for (let e = 0, i = s.length; e < i; ++e)
            t[e] = s[e];
        t = t
    } else
        t = s.slice();
    return t
}
function mr(s, t) {
    if (t !== void 0 && s !== t) {
        for (let e = 0, i = s.length; e < i; ++e)
            t[e] = s[e];
        s = t
    }
    return s
}
function Hh(s) {
    Bh(s.getCode(), s),
    Wn(s, s, _r)
}
function $h(s) {
    s.forEach(Hh)
}
function Et(s) {
    return typeof s == "string" ? Yh(s) : s || null
}
function Yn(s, t, e, i) {
    s = Et(s);
    let n;
    const r = s.getPointResolutionFunc();
    if (r) {
        if (n = r(t, e),
        i && i !== s.getUnits()) {
            const o = s.getMetersPerUnit();
            o && (n = n * o / xi[i])
        }
    } else {
        const o = s.getUnits();
        if (o == "degrees" && !i || i == "degrees")
            n = t;
        else {
            const a = os(s, Et("EPSG:4326"));
            if (a === mr && o !== "degrees")
                n = t * s.getMetersPerUnit();
            else {
                let h = [e[0] - t / 2, e[1], e[0] + t / 2, e[1], e[0], e[1] - t / 2, e[0], e[1] + t / 2];
                h = a(h, h, 2);
                const c = Ne(h.slice(0, 2), h.slice(2, 4))
                  , u = Ne(h.slice(4, 6), h.slice(6, 8));
                n = (c + u) / 2
            }
            const l = i ? xi[i] : s.getMetersPerUnit();
            l !== void 0 && (n /= l)
        }
    }
    return n
}
function ao(s) {
    $h(s),
    s.forEach(function(t) {
        s.forEach(function(e) {
            t !== e && Wn(t, e, _r)
        })
    })
}
function qh(s, t, e, i) {
    s.forEach(function(n) {
        t.forEach(function(r) {
            Wn(n, r, e),
            Wn(r, n, i)
        })
    })
}
function pr(s, t) {
    return s ? typeof s == "string" ? Et(s) : s : Et(t)
}
function lo(s, t) {
    return Fa(),
    Q(s, "EPSG:4326", t !== void 0 ? t : "EPSG:3857")
}
function Jh(s, t) {
    const e = Q(s, t !== void 0 ? t : "EPSG:3857", "EPSG:4326")
      , i = e[0];
    return (i < -180 || i > 180) && (e[0] = Me(i + 180, 360) - 180),
    e
}
function De(s, t) {
    if (s === t)
        return !0;
    const e = s.getUnits() === t.getUnits();
    return (s.getCode() === t.getCode() || os(s, t) === _r) && e
}
function os(s, t) {
    const e = s.getCode()
      , i = t.getCode();
    let n = Zh(e, i);
    return n || (n = mr),
    n
}
function Jt(s, t) {
    const e = Et(s)
      , i = Et(t);
    return os(e, i)
}
function Q(s, t, e) {
    return Jt(t, e)(s, void 0, s.length)
}
function Mi(s, t, e, i) {
    const n = Jt(t, e);
    return Bs(s, n, void 0, i)
}
function Us(s, t) {
    return s
}
function oe(s, t) {
    return Vs && !Xn(s, [0, 0]) && s[0] >= -180 && s[0] <= 180 && s[1] >= -90 && s[1] <= 90 && (Vs = !1,
    Oa("Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates.")),
    s
}
function Da(s, t) {
    return s
}
function Ge(s, t) {
    return s
}
function Qh() {
    ao(io),
    ao(so),
    qh(so, io, Gh, zh)
}
Qh();
function ho(s, t, e) {
    return function(i, n, r, o, a) {
        if (!i)
            return;
        if (!n && !t)
            return i;
        const l = t ? 0 : r[0] * n
          , h = t ? 0 : r[1] * n
          , c = a ? a[0] : 0
          , u = a ? a[1] : 0;
        let d = s[0] + l / 2 + c
          , f = s[2] - l / 2 + c
          , g = s[1] + h / 2 + u
          , _ = s[3] - h / 2 + u;
        d > f && (d = (f + d) / 2,
        f = d),
        g > _ && (g = (_ + g) / 2,
        _ = g);
        let m = N(i[0], d, f)
          , p = N(i[1], g, _);
        if (o && e && n) {
            const y = 30 * n;
            m += -y * Math.log(1 + Math.max(0, d - i[0]) / y) + y * Math.log(1 + Math.max(0, i[0] - f) / y),
            p += -y * Math.log(1 + Math.max(0, g - i[1]) / y) + y * Math.log(1 + Math.max(0, i[1] - _) / y)
        }
        return [m, p]
    }
}
function tc(s) {
    return s
}
function yr(s, t, e, i) {
    const n = $(t) / e[0]
      , r = qt(t) / e[1];
    return i ? Math.min(s, Math.max(n, r)) : Math.min(s, Math.min(n, r))
}
function xr(s, t, e) {
    let i = Math.min(s, t);
    const n = 50;
    return i *= Math.log(1 + n * Math.max(0, s / t - 1)) / n + 1,
    e && (i = Math.max(i, e),
    i /= Math.log(1 + n * Math.max(0, e / s - 1)) / n + 1),
    N(i, e / 2, t * 2)
}
function ec(s, t, e, i) {
    return t = t !== void 0 ? t : !0,
    function(n, r, o, a) {
        if (n !== void 0) {
            const l = s[0]
              , h = s[s.length - 1]
              , c = e ? yr(l, e, o, i) : l;
            if (a)
                return t ? xr(n, c, h) : N(n, h, c);
            const u = Math.min(c, n)
              , d = Math.floor(lr(s, u, r));
            return s[d] > c && d < s.length - 1 ? s[d + 1] : s[d]
        }
    }
}
function ic(s, t, e, i, n, r) {
    return i = i !== void 0 ? i : !0,
    e = e !== void 0 ? e : 0,
    function(o, a, l, h) {
        if (o !== void 0) {
            const c = n ? yr(t, n, l, r) : t;
            if (h)
                return i ? xr(o, c, e) : N(o, e, c);
            const u = 1e-9
              , d = Math.ceil(Math.log(t / c) / Math.log(s) - u)
              , f = -a * (.5 - u) + .5
              , g = Math.min(c, o)
              , _ = Math.floor(Math.log(t / g) / Math.log(s) + f)
              , m = Math.max(d, _)
              , p = t / Math.pow(s, m);
            return N(p, e, c)
        }
    }
}
function co(s, t, e, i, n) {
    return e = e !== void 0 ? e : !0,
    function(r, o, a, l) {
        if (r !== void 0) {
            const h = i ? yr(s, i, a, n) : s;
            return !e || !l ? N(r, t, h) : xr(r, h, t)
        }
    }
}
function Er(s) {
    if (s !== void 0)
        return 0
}
function uo(s) {
    if (s !== void 0)
        return s
}
function nc(s) {
    const t = 2 * Math.PI / s;
    return function(e, i) {
        if (i)
            return e;
        if (e !== void 0)
            return e = Math.floor(e / t + .5) * t,
            e
    }
}
function sc(s) {
    return s = s || An(5),
    function(t, e) {
        if (e)
            return t;
        if (t !== void 0)
            return Math.abs(t) <= s ? 0 : t
    }
}
function Na(s) {
    return Math.pow(s, 3)
}
function wi(s) {
    return 1 - Na(1 - s)
}
function rc(s) {
    return 3 * s * s - 2 * s * s * s
}
function oc(s) {
    return s
}
function Be(s, t, e, i, n, r) {
    r = r || [];
    let o = 0;
    for (let a = t; a < e; a += i) {
        const l = s[a]
          , h = s[a + 1];
        r[o++] = n[0] * l + n[2] * h + n[4],
        r[o++] = n[1] * l + n[3] * h + n[5]
    }
    return r && r.length != o && (r.length = o),
    r
}
function Ga(s, t, e, i, n, r, o) {
    o = o || [];
    const a = Math.cos(n)
      , l = Math.sin(n)
      , h = r[0]
      , c = r[1];
    let u = 0;
    for (let d = t; d < e; d += i) {
        const f = s[d] - h
          , g = s[d + 1] - c;
        o[u++] = h + f * a - g * l,
        o[u++] = c + f * l + g * a;
        for (let _ = d + 2; _ < d + i; ++_)
            o[u++] = s[_]
    }
    return o && o.length != u && (o.length = u),
    o
}
function ac(s, t, e, i, n, r, o, a) {
    a = a || [];
    const l = o[0]
      , h = o[1];
    let c = 0;
    for (let u = t; u < e; u += i) {
        const d = s[u] - l
          , f = s[u + 1] - h;
        a[c++] = l + n * d,
        a[c++] = h + r * f;
        for (let g = u + 2; g < u + i; ++g)
            a[c++] = s[g]
    }
    return a && a.length != c && (a.length = c),
    a
}
function lc(s, t, e, i, n, r, o) {
    o = o || [];
    let a = 0;
    for (let l = t; l < e; l += i) {
        o[a++] = s[l] + n,
        o[a++] = s[l + 1] + r;
        for (let h = l + 2; h < l + i; ++h)
            o[a++] = s[h]
    }
    return o && o.length != a && (o.length = a),
    o
}
const fo = $t();
class hc extends Bt {
    constructor() {
        super(),
        this.extent_ = Yt(),
        this.extentRevision_ = -1,
        this.simplifiedGeometryMaxMinSquaredTolerance = 0,
        this.simplifiedGeometryRevision = 0,
        this.simplifyTransformedInternal = nh(function(t, e, i) {
            if (!i)
                return this.getSimplifiedGeometry(e);
            const n = this.clone();
            return n.applyTransform(i),
            n.getSimplifiedGeometry(e)
        })
    }
    simplifyTransformed(t, e) {
        return this.simplifyTransformedInternal(this.getRevision(), t, e)
    }
    clone() {
        return Z()
    }
    closestPointXY(t, e, i, n) {
        return Z()
    }
    containsXY(t, e) {
        const i = this.getClosestPoint([t, e]);
        return i[0] === t && i[1] === e
    }
    getClosestPoint(t, e) {
        return e = e || [NaN, NaN],
        this.closestPointXY(t[0], t[1], e, 1 / 0),
        e
    }
    intersectsCoordinate(t) {
        return this.containsXY(t[0], t[1])
    }
    computeExtent(t) {
        return Z()
    }
    getExtent(t) {
        if (this.extentRevision_ != this.getRevision()) {
            const e = this.computeExtent(this.extent_);
            (isNaN(e[0]) || isNaN(e[1])) && qi(e),
            this.extentRevision_ = this.getRevision()
        }
        return Ch(this.extent_, t)
    }
    rotate(t, e) {
        Z()
    }
    scale(t, e, i) {
        Z()
    }
    simplify(t) {
        return this.getSimplifiedGeometry(t * t)
    }
    getSimplifiedGeometry(t) {
        return Z()
    }
    getType() {
        return Z()
    }
    applyTransform(t) {
        Z()
    }
    intersectsExtent(t) {
        return Z()
    }
    translate(t, e) {
        Z()
    }
    transform(t, e) {
        const i = Et(t)
          , n = i.getUnits() == "tile-pixels" ? function(r, o, a) {
            const l = i.getExtent()
              , h = i.getWorldExtent()
              , c = qt(h) / qt(l);
            return be(fo, h[0], h[3], c, -c, 0, 0, 0),
            Be(r, 0, r.length, a, fo, o),
            Jt(i, e)(r, o, a)
        }
        : Jt(i, e);
        return this.applyTransform(n),
        this
    }
}
const cc = hc;
class uc extends cc {
    constructor() {
        super(),
        this.layout = "XY",
        this.stride = 2,
        this.flatCoordinates = null
    }
    computeExtent(t) {
        return yh(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t)
    }
    getCoordinates() {
        return Z()
    }
    getFirstCoordinate() {
        return this.flatCoordinates.slice(0, this.stride)
    }
    getFlatCoordinates() {
        return this.flatCoordinates
    }
    getLastCoordinate() {
        return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride)
    }
    getLayout() {
        return this.layout
    }
    getSimplifiedGeometry(t) {
        if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0,
        this.simplifiedGeometryRevision = this.getRevision()),
        t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance)
            return this;
        const e = this.getSimplifiedGeometryInternal(t);
        return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t,
        this)
    }
    getSimplifiedGeometryInternal(t) {
        return this
    }
    getStride() {
        return this.stride
    }
    setFlatCoordinates(t, e) {
        this.stride = go(t),
        this.layout = t,
        this.flatCoordinates = e
    }
    setCoordinates(t, e) {
        Z()
    }
    setLayout(t, e, i) {
        let n;
        if (t)
            n = go(t);
        else {
            for (let r = 0; r < i; ++r) {
                if (e.length === 0) {
                    this.layout = "XY",
                    this.stride = 2;
                    return
                }
                e = e[0]
            }
            n = e.length,
            t = dc(n)
        }
        this.layout = t,
        this.stride = n
    }
    applyTransform(t) {
        this.flatCoordinates && (t(this.flatCoordinates, this.flatCoordinates, this.stride),
        this.changed())
    }
    rotate(t, e) {
        const i = this.getFlatCoordinates();
        if (i) {
            const n = this.getStride();
            Ga(i, 0, i.length, n, t, e, i),
            this.changed()
        }
    }
    scale(t, e, i) {
        e === void 0 && (e = t),
        i || (i = ue(this.getExtent()));
        const n = this.getFlatCoordinates();
        if (n) {
            const r = this.getStride();
            ac(n, 0, n.length, r, t, e, i, n),
            this.changed()
        }
    }
    translate(t, e) {
        const i = this.getFlatCoordinates();
        if (i) {
            const n = this.getStride();
            lc(i, 0, i.length, n, t, e, i),
            this.changed()
        }
    }
}
function dc(s) {
    let t;
    return s == 2 ? t = "XY" : s == 3 ? t = "XYZ" : s == 4 && (t = "XYZM"),
    t
}
function go(s) {
    let t;
    return s == "XY" ? t = 2 : s == "XYZ" || s == "XYM" ? t = 3 : s == "XYZM" && (t = 4),
    t
}
function fc(s, t, e) {
    const i = s.getFlatCoordinates();
    if (!i)
        return null;
    const n = s.getStride();
    return Be(i, 0, i.length, n, t, e)
}
const tn = uc;
function _o(s, t, e, i, n, r, o) {
    const a = s[t]
      , l = s[t + 1]
      , h = s[e] - a
      , c = s[e + 1] - l;
    let u;
    if (h === 0 && c === 0)
        u = t;
    else {
        const d = ((n - a) * h + (r - l) * c) / (h * h + c * c);
        if (d > 1)
            u = e;
        else if (d > 0) {
            for (let f = 0; f < i; ++f)
                o[f] = vt(s[t + f], s[e + f], d);
            o.length = i;
            return
        } else
            u = t
    }
    for (let d = 0; d < i; ++d)
        o[d] = s[u + d];
    o.length = i
}
function wr(s, t, e, i, n) {
    let r = s[t]
      , o = s[t + 1];
    for (t += i; t < e; t += i) {
        const a = s[t]
          , l = s[t + 1]
          , h = fi(r, o, a, l);
        h > n && (n = h),
        r = a,
        o = l
    }
    return n
}
function za(s, t, e, i, n) {
    for (let r = 0, o = e.length; r < o; ++r) {
        const a = e[r];
        n = wr(s, t, a, i, n),
        t = a
    }
    return n
}
function Sr(s, t, e, i, n, r, o, a, l, h, c) {
    if (t == e)
        return h;
    let u, d;
    if (n === 0) {
        if (d = fi(o, a, s[t], s[t + 1]),
        d < h) {
            for (u = 0; u < i; ++u)
                l[u] = s[t + u];
            return l.length = i,
            d
        }
        return h
    }
    c = c || [NaN, NaN];
    let f = t + i;
    for (; f < e; )
        if (_o(s, f - i, f, i, o, a, c),
        d = fi(o, a, c[0], c[1]),
        d < h) {
            for (h = d,
            u = 0; u < i; ++u)
                l[u] = c[u];
            l.length = i,
            f += i
        } else
            f += i * Math.max((Math.sqrt(d) - Math.sqrt(h)) / n | 0, 1);
    if (r && (_o(s, e - i, t, i, o, a, c),
    d = fi(o, a, c[0], c[1]),
    d < h)) {
        for (h = d,
        u = 0; u < i; ++u)
            l[u] = c[u];
        l.length = i
    }
    return h
}
function Wa(s, t, e, i, n, r, o, a, l, h, c) {
    c = c || [NaN, NaN];
    for (let u = 0, d = e.length; u < d; ++u) {
        const f = e[u];
        h = Sr(s, t, f, i, n, r, o, a, l, h, c),
        t = f
    }
    return h
}
function gc(s, t, e, i) {
    for (let n = 0, r = e.length; n < r; ++n)
        s[t++] = e[n];
    return t
}
function Cr(s, t, e, i) {
    for (let n = 0, r = e.length; n < r; ++n) {
        const o = e[n];
        for (let a = 0; a < i; ++a)
            s[t++] = o[a]
    }
    return t
}
function Xa(s, t, e, i, n) {
    n = n || [];
    let r = 0;
    for (let o = 0, a = e.length; o < a; ++o) {
        const l = Cr(s, t, e[o], i);
        n[r++] = l,
        t = l
    }
    return n.length = r,
    n
}
function Tr(s, t, e, i, n, r, o) {
    const a = (e - t) / i;
    if (a < 3) {
        for (; t < e; t += i)
            r[o++] = s[t],
            r[o++] = s[t + 1];
        return o
    }
    const l = new Array(a);
    l[0] = 1,
    l[a - 1] = 1;
    const h = [t, e - i];
    let c = 0;
    for (; h.length > 0; ) {
        const u = h.pop()
          , d = h.pop();
        let f = 0;
        const g = s[d]
          , _ = s[d + 1]
          , m = s[u]
          , p = s[u + 1];
        for (let y = d + i; y < u; y += i) {
            const x = s[y]
              , E = s[y + 1]
              , w = Ia(x, E, g, _, m, p);
            w > f && (c = y,
            f = w)
        }
        f > n && (l[(c - t) / i] = 1,
        d + i < c && h.push(d, c),
        c + i < u && h.push(c, u))
    }
    for (let u = 0; u < a; ++u)
        l[u] && (r[o++] = s[t + u * i],
        r[o++] = s[t + u * i + 1]);
    return o
}
function _c(s, t, e, i, n, r, o, a) {
    for (let l = 0, h = e.length; l < h; ++l) {
        const c = e[l];
        o = Tr(s, t, c, i, n, r, o),
        a.push(o),
        t = c
    }
    return o
}
function Fe(s, t) {
    return t * Math.round(s / t)
}
function mc(s, t, e, i, n, r, o) {
    if (t == e)
        return o;
    let a = Fe(s[t], n)
      , l = Fe(s[t + 1], n);
    t += i,
    r[o++] = a,
    r[o++] = l;
    let h, c;
    do
        if (h = Fe(s[t], n),
        c = Fe(s[t + 1], n),
        t += i,
        t == e)
            return r[o++] = h,
            r[o++] = c,
            o;
    while (h == a && c == l);
    for (; t < e; ) {
        const u = Fe(s[t], n)
          , d = Fe(s[t + 1], n);
        if (t += i,
        u == h && d == c)
            continue;
        const f = h - a
          , g = c - l
          , _ = u - a
          , m = d - l;
        if (f * m == g * _ && (f < 0 && _ < f || f == _ || f > 0 && _ > f) && (g < 0 && m < g || g == m || g > 0 && m > g)) {
            h = u,
            c = d;
            continue
        }
        r[o++] = h,
        r[o++] = c,
        a = h,
        l = c,
        h = u,
        c = d
    }
    return r[o++] = h,
    r[o++] = c,
    o
}
function pc(s, t, e, i, n, r, o, a) {
    for (let l = 0, h = e.length; l < h; ++l) {
        const c = e[l];
        o = mc(s, t, c, i, n, r, o),
        a.push(o),
        t = c
    }
    return o
}
function ze(s, t, e, i, n) {
    n = n !== void 0 ? n : [];
    let r = 0;
    for (let o = t; o < e; o += i)
        n[r++] = s.slice(o, o + i);
    return n.length = r,
    n
}
function Gi(s, t, e, i, n) {
    n = n !== void 0 ? n : [];
    let r = 0;
    for (let o = 0, a = e.length; o < a; ++o) {
        const l = e[o];
        n[r++] = ze(s, t, l, i, n[r]),
        t = l
    }
    return n.length = r,
    n
}
function mo(s, t, e, i, n) {
    n = n !== void 0 ? n : [];
    let r = 0;
    for (let o = 0, a = e.length; o < a; ++o) {
        const l = e[o];
        n[r++] = l.length === 1 && l[0] === t ? [] : Gi(s, t, l, i, n[r]),
        t = l[l.length - 1]
    }
    return n.length = r,
    n
}
function Ya(s, t, e, i) {
    let n = 0
      , r = s[e - i]
      , o = s[e - i + 1];
    for (; t < e; t += i) {
        const a = s[t]
          , l = s[t + 1];
        n += o * a - r * l,
        r = a,
        o = l
    }
    return n / 2
}
function yc(s, t, e, i) {
    let n = 0;
    for (let r = 0, o = e.length; r < o; ++r) {
        const a = e[r];
        n += Ya(s, t, a, i),
        t = a
    }
    return n
}
class Bn extends tn {
    constructor(t, e) {
        super(),
        this.maxDelta_ = -1,
        this.maxDeltaRevision_ = -1,
        e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(e, t) : this.setCoordinates(t, e)
    }
    clone() {
        return new Bn(this.flatCoordinates.slice(),this.layout)
    }
    closestPointXY(t, e, i, n) {
        return n < es(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(wr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0)),
        this.maxDeltaRevision_ = this.getRevision()),
        Sr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, !0, t, e, i, n))
    }
    getArea() {
        return Ya(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
    }
    getCoordinates() {
        return ze(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
    }
    getSimplifiedGeometryInternal(t) {
        const e = [];
        return e.length = Tr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e, 0),
        new Bn(e,"XY")
    }
    getType() {
        return "LinearRing"
    }
    intersectsExtent(t) {
        return !1
    }
    setCoordinates(t, e) {
        this.setLayout(e, t, 1),
        this.flatCoordinates || (this.flatCoordinates = []),
        this.flatCoordinates.length = Cr(this.flatCoordinates, 0, t, this.stride),
        this.changed()
    }
}
const po = Bn;
class Rr extends tn {
    constructor(t, e) {
        super(),
        this.setCoordinates(t, e)
    }
    clone() {
        const t = new Rr(this.flatCoordinates.slice(),this.layout);
        return t.applyProperties(this),
        t
    }
    closestPointXY(t, e, i, n) {
        const r = this.flatCoordinates
          , o = fi(t, e, r[0], r[1]);
        if (o < n) {
            const a = this.stride;
            for (let l = 0; l < a; ++l)
                i[l] = r[l];
            return i.length = a,
            o
        }
        return n
    }
    getCoordinates() {
        return this.flatCoordinates ? this.flatCoordinates.slice() : []
    }
    computeExtent(t) {
        return ph(this.flatCoordinates, t)
    }
    getType() {
        return "Point"
    }
    intersectsExtent(t) {
        return Ca(t, this.flatCoordinates[0], this.flatCoordinates[1])
    }
    setCoordinates(t, e) {
        this.setLayout(e, t, 0),
        this.flatCoordinates || (this.flatCoordinates = []),
        this.flatCoordinates.length = gc(this.flatCoordinates, 0, t, this.stride),
        this.changed()
    }
}
const Wt = Rr;
function xc(s, t, e, i, n) {
    return !Ra(n, function(o) {
        return !We(s, t, e, i, o[0], o[1])
    })
}
function We(s, t, e, i, n, r) {
    let o = 0
      , a = s[e - i]
      , l = s[e - i + 1];
    for (; t < e; t += i) {
        const h = s[t]
          , c = s[t + 1];
        l <= r ? c > r && (h - a) * (r - l) - (n - a) * (c - l) > 0 && o++ : c <= r && (h - a) * (r - l) - (n - a) * (c - l) < 0 && o--,
        a = h,
        l = c
    }
    return o !== 0
}
function Ba(s, t, e, i, n, r) {
    if (e.length === 0 || !We(s, t, e[0], i, n, r))
        return !1;
    for (let o = 1, a = e.length; o < a; ++o)
        if (We(s, e[o - 1], e[o], i, n, r))
            return !1;
    return !0
}
function Ec(s, t, e, i, n, r, o) {
    let a, l, h, c, u, d, f;
    const g = n[r + 1]
      , _ = [];
    for (let y = 0, x = e.length; y < x; ++y) {
        const E = e[y];
        for (c = s[E - i],
        d = s[E - i + 1],
        a = t; a < E; a += i)
            u = s[a],
            f = s[a + 1],
            (g <= d && f <= g || d <= g && g <= f) && (h = (g - d) / (f - d) * (u - c) + c,
            _.push(h)),
            c = u,
            d = f
    }
    let m = NaN
      , p = -1 / 0;
    for (_.sort(Ze),
    c = _[0],
    a = 1,
    l = _.length; a < l; ++a) {
        u = _[a];
        const y = Math.abs(u - c);
        y > p && (h = (c + u) / 2,
        Ba(s, t, e, i, h, g) && (m = h,
        p = y)),
        c = u
    }
    return isNaN(m) && (m = n[r]),
    o ? (o.push(m, g, p),
    o) : [m, g, p]
}
function Za(s, t, e, i, n) {
    let r;
    for (t += i; t < e; t += i)
        if (r = n(s.slice(t - i, t), s.slice(t, t + i)),
        r)
            return r;
    return !1
}
function as(s, t, e, i, n) {
    const r = Ta(Yt(), s, t, e, i);
    return mt(n, r) ? ce(n, r) || r[0] >= n[0] && r[2] <= n[2] || r[1] >= n[1] && r[3] <= n[3] ? !0 : Za(s, t, e, i, function(o, a) {
        return Th(n, o, a)
    }) : !1
}
function wc(s, t, e, i, n) {
    for (let r = 0, o = e.length; r < o; ++r) {
        if (as(s, t, e[r], i, n))
            return !0;
        t = e[r]
    }
    return !1
}
function Va(s, t, e, i, n) {
    return !!(as(s, t, e, i, n) || We(s, t, e, i, n[0], n[1]) || We(s, t, e, i, n[0], n[3]) || We(s, t, e, i, n[2], n[1]) || We(s, t, e, i, n[2], n[3]))
}
function Sc(s, t, e, i, n) {
    if (!Va(s, t, e[0], i, n))
        return !1;
    if (e.length === 1)
        return !0;
    for (let r = 1, o = e.length; r < o; ++r)
        if (xc(s, e[r - 1], e[r], i, n) && !as(s, e[r - 1], e[r], i, n))
            return !1;
    return !0
}
function Cc(s, t, e, i) {
    for (; t < e - i; ) {
        for (let n = 0; n < i; ++n) {
            const r = s[t + n];
            s[t + n] = s[e - i + n],
            s[e - i + n] = r
        }
        t += i,
        e -= i
    }
}
function Ua(s, t, e, i) {
    let n = 0
      , r = s[e - i]
      , o = s[e - i + 1];
    for (; t < e; t += i) {
        const a = s[t]
          , l = s[t + 1];
        n += (a - r) * (l + o),
        r = a,
        o = l
    }
    return n === 0 ? void 0 : n > 0
}
function Tc(s, t, e, i, n) {
    n = n !== void 0 ? n : !1;
    for (let r = 0, o = e.length; r < o; ++r) {
        const a = e[r]
          , l = Ua(s, t, a, i);
        if (r === 0) {
            if (n && l || !n && !l)
                return !1
        } else if (n && !l || !n && l)
            return !1;
        t = a
    }
    return !0
}
function yo(s, t, e, i, n) {
    n = n !== void 0 ? n : !1;
    for (let r = 0, o = e.length; r < o; ++r) {
        const a = e[r]
          , l = Ua(s, t, a, i);
        (r === 0 ? n && l || !n && !l : n && !l || !n && l) && Cc(s, t, a, i),
        t = a
    }
    return t
}
class zi extends tn {
    constructor(t, e, i) {
        super(),
        this.ends_ = [],
        this.flatInteriorPointRevision_ = -1,
        this.flatInteriorPoint_ = null,
        this.maxDelta_ = -1,
        this.maxDeltaRevision_ = -1,
        this.orientedRevision_ = -1,
        this.orientedFlatCoordinates_ = null,
        e !== void 0 && i ? (this.setFlatCoordinates(e, t),
        this.ends_ = i) : this.setCoordinates(t, e)
    }
    appendLinearRing(t) {
        this.flatCoordinates ? ui(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(),
        this.ends_.push(this.flatCoordinates.length),
        this.changed()
    }
    clone() {
        const t = new zi(this.flatCoordinates.slice(),this.layout,this.ends_.slice());
        return t.applyProperties(this),
        t
    }
    closestPointXY(t, e, i, n) {
        return n < es(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(za(this.flatCoordinates, 0, this.ends_, this.stride, 0)),
        this.maxDeltaRevision_ = this.getRevision()),
        Wa(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, !0, t, e, i, n))
    }
    containsXY(t, e) {
        return Ba(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t, e)
    }
    getArea() {
        return yc(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride)
    }
    getCoordinates(t) {
        let e;
        return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(),
        yo(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates,
        Gi(e, 0, this.ends_, this.stride)
    }
    getEnds() {
        return this.ends_
    }
    getFlatInteriorPoint() {
        if (this.flatInteriorPointRevision_ != this.getRevision()) {
            const t = ue(this.getExtent());
            this.flatInteriorPoint_ = Ec(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t, 0),
            this.flatInteriorPointRevision_ = this.getRevision()
        }
        return this.flatInteriorPoint_
    }
    getInteriorPoint() {
        return new Wt(this.getFlatInteriorPoint(),"XYM")
    }
    getLinearRingCount() {
        return this.ends_.length
    }
    getLinearRing(t) {
        return t < 0 || this.ends_.length <= t ? null : new po(this.flatCoordinates.slice(t === 0 ? 0 : this.ends_[t - 1], this.ends_[t]),this.layout)
    }
    getLinearRings() {
        const t = this.layout
          , e = this.flatCoordinates
          , i = this.ends_
          , n = [];
        let r = 0;
        for (let o = 0, a = i.length; o < a; ++o) {
            const l = i[o]
              , h = new po(e.slice(r, l),t);
            n.push(h),
            r = l
        }
        return n
    }
    getOrientedFlatCoordinates() {
        if (this.orientedRevision_ != this.getRevision()) {
            const t = this.flatCoordinates;
            Tc(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(),
            this.orientedFlatCoordinates_.length = yo(this.orientedFlatCoordinates_, 0, this.ends_, this.stride)),
            this.orientedRevision_ = this.getRevision()
        }
        return this.orientedFlatCoordinates_
    }
    getSimplifiedGeometryInternal(t) {
        const e = []
          , i = [];
        return e.length = pc(this.flatCoordinates, 0, this.ends_, this.stride, Math.sqrt(t), e, 0, i),
        new zi(e,"XY",i)
    }
    getType() {
        return "Polygon"
    }
    intersectsExtent(t) {
        return Sc(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, t)
    }
    setCoordinates(t, e) {
        this.setLayout(e, t, 2),
        this.flatCoordinates || (this.flatCoordinates = []);
        const i = Xa(this.flatCoordinates, 0, t, this.stride, this.ends_);
        this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1],
        this.changed()
    }
}
const Ir = zi;
function xo(s) {
    const t = s[0]
      , e = s[1]
      , i = s[2]
      , n = s[3]
      , r = [t, e, t, n, i, n, i, e, t, e];
    return new zi(r,"XY",[r.length])
}
const ys = 0;
class Rc extends Bt {
    constructor(t) {
        super(),
        this.on,
        this.once,
        this.un,
        t = Object.assign({}, t),
        this.hints_ = [0, 0],
        this.animations_ = [],
        this.updateAnimationKey_,
        this.projection_ = pr(t.projection, "EPSG:3857"),
        this.viewportSize_ = [100, 100],
        this.targetCenter_ = null,
        this.targetResolution_,
        this.targetRotation_,
        this.nextCenter_ = null,
        this.nextResolution_,
        this.nextRotation_,
        this.cancelAnchor_ = void 0,
        t.projection && Fa(),
        t.center && (t.center = oe(t.center, this.projection_)),
        t.extent && (t.extent = Ge(t.extent, this.projection_)),
        this.applyOptions_(t)
    }
    applyOptions_(t) {
        const e = Object.assign({}, t);
        for (const a in Nt)
            delete e[a];
        this.setProperties(e, !0);
        const i = Lc(t);
        this.maxResolution_ = i.maxResolution,
        this.minResolution_ = i.minResolution,
        this.zoomFactor_ = i.zoomFactor,
        this.resolutions_ = t.resolutions,
        this.padding_ = t.padding,
        this.minZoom_ = i.minZoom;
        const n = Ic(t)
          , r = i.constraint
          , o = Mc(t);
        this.constraints_ = {
            center: n,
            resolution: r,
            rotation: o
        },
        this.setRotation(t.rotation !== void 0 ? t.rotation : 0),
        this.setCenterInternal(t.center !== void 0 ? t.center : null),
        t.resolution !== void 0 ? this.setResolution(t.resolution) : t.zoom !== void 0 && this.setZoom(t.zoom)
    }
    get padding() {
        return this.padding_
    }
    set padding(t) {
        let e = this.padding_;
        this.padding_ = t;
        const i = this.getCenterInternal();
        if (i) {
            const n = t || [0, 0, 0, 0];
            e = e || [0, 0, 0, 0];
            const r = this.getResolution()
              , o = r / 2 * (n[3] - e[3] + e[1] - n[1])
              , a = r / 2 * (n[0] - e[0] + e[2] - n[2]);
            this.setCenterInternal([i[0] + o, i[1] - a])
        }
    }
    getUpdatedOptions_(t) {
        const e = this.getProperties();
        return e.resolution !== void 0 ? e.resolution = this.getResolution() : e.zoom = this.getZoom(),
        e.center = this.getCenterInternal(),
        e.rotation = this.getRotation(),
        Object.assign({}, e, t)
    }
    animate(t) {
        this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
        const e = new Array(arguments.length);
        for (let i = 0; i < e.length; ++i) {
            let n = arguments[i];
            n.center && (n = Object.assign({}, n),
            n.center = oe(n.center, this.getProjection())),
            n.anchor && (n = Object.assign({}, n),
            n.anchor = oe(n.anchor, this.getProjection())),
            e[i] = n
        }
        this.animateInternal.apply(this, e)
    }
    animateInternal(t) {
        let e = arguments.length, i;
        e > 1 && typeof arguments[e - 1] == "function" && (i = arguments[e - 1],
        --e);
        let n = 0;
        for (; n < e && !this.isDef(); ++n) {
            const c = arguments[n];
            c.center && this.setCenterInternal(c.center),
            c.zoom !== void 0 ? this.setZoom(c.zoom) : c.resolution && this.setResolution(c.resolution),
            c.rotation !== void 0 && this.setRotation(c.rotation)
        }
        if (n === e) {
            i && yn(i, !0);
            return
        }
        let r = Date.now()
          , o = this.targetCenter_.slice()
          , a = this.targetResolution_
          , l = this.targetRotation_;
        const h = [];
        for (; n < e; ++n) {
            const c = arguments[n]
              , u = {
                start: r,
                complete: !1,
                anchor: c.anchor,
                duration: c.duration !== void 0 ? c.duration : 1e3,
                easing: c.easing || rc,
                callback: i
            };
            if (c.center && (u.sourceCenter = o,
            u.targetCenter = c.center.slice(),
            o = u.targetCenter),
            c.zoom !== void 0 ? (u.sourceResolution = a,
            u.targetResolution = this.getResolutionForZoom(c.zoom),
            a = u.targetResolution) : c.resolution && (u.sourceResolution = a,
            u.targetResolution = c.resolution,
            a = u.targetResolution),
            c.rotation !== void 0) {
                u.sourceRotation = l;
                const d = Me(c.rotation - l + Math.PI, 2 * Math.PI) - Math.PI;
                u.targetRotation = l + d,
                l = u.targetRotation
            }
            vc(u) ? u.complete = !0 : r += u.duration,
            h.push(u)
        }
        this.animations_.push(h),
        this.setHint(gt.ANIMATING, 1),
        this.updateAnimations_()
    }
    getAnimating() {
        return this.hints_[gt.ANIMATING] > 0
    }
    getInteracting() {
        return this.hints_[gt.INTERACTING] > 0
    }
    cancelAnimations() {
        this.setHint(gt.ANIMATING, -this.hints_[gt.ANIMATING]);
        let t;
        for (let e = 0, i = this.animations_.length; e < i; ++e) {
            const n = this.animations_[e];
            if (n[0].callback && yn(n[0].callback, !1),
            !t)
                for (let r = 0, o = n.length; r < o; ++r) {
                    const a = n[r];
                    if (!a.complete) {
                        t = a.anchor;
                        break
                    }
                }
        }
        this.animations_.length = 0,
        this.cancelAnchor_ = t,
        this.nextCenter_ = null,
        this.nextResolution_ = NaN,
        this.nextRotation_ = NaN
    }
    updateAnimations_() {
        if (this.updateAnimationKey_ !== void 0 && (cancelAnimationFrame(this.updateAnimationKey_),
        this.updateAnimationKey_ = void 0),
        !this.getAnimating())
            return;
        const t = Date.now();
        let e = !1;
        for (let i = this.animations_.length - 1; i >= 0; --i) {
            const n = this.animations_[i];
            let r = !0;
            for (let o = 0, a = n.length; o < a; ++o) {
                const l = n[o];
                if (l.complete)
                    continue;
                const h = t - l.start;
                let c = l.duration > 0 ? h / l.duration : 1;
                c >= 1 ? (l.complete = !0,
                c = 1) : r = !1;
                const u = l.easing(c);
                if (l.sourceCenter) {
                    const d = l.sourceCenter[0]
                      , f = l.sourceCenter[1]
                      , g = l.targetCenter[0]
                      , _ = l.targetCenter[1];
                    this.nextCenter_ = l.targetCenter;
                    const m = d + u * (g - d)
                      , p = f + u * (_ - f);
                    this.targetCenter_ = [m, p]
                }
                if (l.sourceResolution && l.targetResolution) {
                    const d = u === 1 ? l.targetResolution : l.sourceResolution + u * (l.targetResolution - l.sourceResolution);
                    if (l.anchor) {
                        const f = this.getViewportSize_(this.getRotation())
                          , g = this.constraints_.resolution(d, 0, f, !0);
                        this.targetCenter_ = this.calculateCenterZoom(g, l.anchor)
                    }
                    this.nextResolution_ = l.targetResolution,
                    this.targetResolution_ = d,
                    this.applyTargetState_(!0)
                }
                if (l.sourceRotation !== void 0 && l.targetRotation !== void 0) {
                    const d = u === 1 ? Me(l.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : l.sourceRotation + u * (l.targetRotation - l.sourceRotation);
                    if (l.anchor) {
                        const f = this.constraints_.rotation(d, !0);
                        this.targetCenter_ = this.calculateCenterRotate(f, l.anchor)
                    }
                    this.nextRotation_ = l.targetRotation,
                    this.targetRotation_ = d
                }
                if (this.applyTargetState_(!0),
                e = !0,
                !l.complete)
                    break
            }
            if (r) {
                this.animations_[i] = null,
                this.setHint(gt.ANIMATING, -1),
                this.nextCenter_ = null,
                this.nextResolution_ = NaN,
                this.nextRotation_ = NaN;
                const o = n[0].callback;
                o && yn(o, !0)
            }
        }
        this.animations_ = this.animations_.filter(Boolean),
        e && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(this.updateAnimations_.bind(this)))
    }
    calculateCenterRotate(t, e) {
        let i;
        const n = this.getCenterInternal();
        return n !== void 0 && (i = [n[0] - e[0], n[1] - e[1]],
        fr(i, t - this.getRotation()),
        Vh(i, e)),
        i
    }
    calculateCenterZoom(t, e) {
        let i;
        const n = this.getCenterInternal()
          , r = this.getResolution();
        if (n !== void 0 && r !== void 0) {
            const o = e[0] - t * (e[0] - n[0]) / r
              , a = e[1] - t * (e[1] - n[1]) / r;
            i = [o, a]
        }
        return i
    }
    getViewportSize_(t) {
        const e = this.viewportSize_;
        if (t) {
            const i = e[0]
              , n = e[1];
            return [Math.abs(i * Math.cos(t)) + Math.abs(n * Math.sin(t)), Math.abs(i * Math.sin(t)) + Math.abs(n * Math.cos(t))]
        }
        return e
    }
    setViewportSize(t) {
        this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100],
        this.getAnimating() || this.resolveConstraints(0)
    }
    getCenter() {
        const t = this.getCenterInternal();
        return t && Us(t, this.getProjection())
    }
    getCenterInternal() {
        return this.get(Nt.CENTER)
    }
    getConstraints() {
        return this.constraints_
    }
    getConstrainResolution() {
        return this.get("constrainResolution")
    }
    getHints(t) {
        return t !== void 0 ? (t[0] = this.hints_[0],
        t[1] = this.hints_[1],
        t) : this.hints_.slice()
    }
    calculateExtent(t) {
        const e = this.calculateExtentInternal(t);
        return Da(e, this.getProjection())
    }
    calculateExtentInternal(t) {
        t = t || this.getViewportSizeMinusPadding_();
        const e = this.getCenterInternal();
        W(e, 1);
        const i = this.getResolution();
        W(i !== void 0, 2);
        const n = this.getRotation();
        return W(n !== void 0, 3),
        Xs(e, i, n, t)
    }
    getMaxResolution() {
        return this.maxResolution_
    }
    getMinResolution() {
        return this.minResolution_
    }
    getMaxZoom() {
        return this.getZoomForResolution(this.minResolution_)
    }
    setMaxZoom(t) {
        this.applyOptions_(this.getUpdatedOptions_({
            maxZoom: t
        }))
    }
    getMinZoom() {
        return this.getZoomForResolution(this.maxResolution_)
    }
    setMinZoom(t) {
        this.applyOptions_(this.getUpdatedOptions_({
            minZoom: t
        }))
    }
    setConstrainResolution(t) {
        this.applyOptions_(this.getUpdatedOptions_({
            constrainResolution: t
        }))
    }
    getProjection() {
        return this.projection_
    }
    getResolution() {
        return this.get(Nt.RESOLUTION)
    }
    getResolutions() {
        return this.resolutions_
    }
    getResolutionForExtent(t, e) {
        return this.getResolutionForExtentInternal(Ge(t, this.getProjection()), e)
    }
    getResolutionForExtentInternal(t, e) {
        e = e || this.getViewportSizeMinusPadding_();
        const i = $(t) / e[0]
          , n = qt(t) / e[1];
        return Math.max(i, n)
    }
    getResolutionForValueFunction(t) {
        t = t || 2;
        const e = this.getConstrainedResolution(this.maxResolution_)
          , i = this.minResolution_
          , n = Math.log(e / i) / Math.log(t);
        return function(r) {
            return e / Math.pow(t, r * n)
        }
    }
    getRotation() {
        return this.get(Nt.ROTATION)
    }
    getValueForResolutionFunction(t) {
        const e = Math.log(t || 2)
          , i = this.getConstrainedResolution(this.maxResolution_)
          , n = this.minResolution_
          , r = Math.log(i / n) / e;
        return function(o) {
            return Math.log(i / o) / e / r
        }
    }
    getViewportSizeMinusPadding_(t) {
        let e = this.getViewportSize_(t);
        const i = this.padding_;
        return i && (e = [e[0] - i[1] - i[3], e[1] - i[0] - i[2]]),
        e
    }
    getState() {
        const t = this.getProjection()
          , e = this.getResolution()
          , i = this.getRotation();
        let n = this.getCenterInternal();
        const r = this.padding_;
        if (r) {
            const o = this.getViewportSizeMinusPadding_();
            n = xs(n, this.getViewportSize_(), [o[0] / 2 + r[3], o[1] / 2 + r[0]], e, i)
        }
        return {
            center: n.slice(0),
            projection: t !== void 0 ? t : null,
            resolution: e,
            nextCenter: this.nextCenter_,
            nextResolution: this.nextResolution_,
            nextRotation: this.nextRotation_,
            rotation: i,
            zoom: this.getZoom()
        }
    }
    getViewStateAndExtent() {
        return {
            viewState: this.getState(),
            extent: this.calculateExtent()
        }
    }
    getZoom() {
        let t;
        const e = this.getResolution();
        return e !== void 0 && (t = this.getZoomForResolution(e)),
        t
    }
    getZoomForResolution(t) {
        let e = this.minZoom_ || 0, i, n;
        if (this.resolutions_) {
            const r = lr(this.resolutions_, t, 1);
            e = r,
            i = this.resolutions_[r],
            r == this.resolutions_.length - 1 ? n = 2 : n = i / this.resolutions_[r + 1]
        } else
            i = this.maxResolution_,
            n = this.zoomFactor_;
        return e + Math.log(i / t) / Math.log(n)
    }
    getResolutionForZoom(t) {
        if (this.resolutions_) {
            if (this.resolutions_.length <= 1)
                return 0;
            const e = N(Math.floor(t), 0, this.resolutions_.length - 2)
              , i = this.resolutions_[e] / this.resolutions_[e + 1];
            return this.resolutions_[e] / Math.pow(i, N(t - e, 0, 1))
        }
        return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_)
    }
    fit(t, e) {
        let i;
        if (W(Array.isArray(t) || typeof t.getSimplifiedGeometry == "function", 24),
        Array.isArray(t)) {
            W(!Ji(t), 25);
            const n = Ge(t, this.getProjection());
            i = xo(n)
        } else if (t.getType() === "Circle") {
            const n = Ge(t.getExtent(), this.getProjection());
            i = xo(n),
            i.rotate(this.getRotation(), ue(n))
        } else
            i = t;
        this.fitInternal(i, e)
    }
    rotatedExtentForGeometry(t) {
        const e = this.getRotation()
          , i = Math.cos(e)
          , n = Math.sin(-e)
          , r = t.getFlatCoordinates()
          , o = t.getStride();
        let a = 1 / 0
          , l = 1 / 0
          , h = -1 / 0
          , c = -1 / 0;
        for (let u = 0, d = r.length; u < d; u += o) {
            const f = r[u] * i - r[u + 1] * n
              , g = r[u] * n + r[u + 1] * i;
            a = Math.min(a, f),
            l = Math.min(l, g),
            h = Math.max(h, f),
            c = Math.max(c, g)
        }
        return [a, l, h, c]
    }
    fitInternal(t, e) {
        e = e || {};
        let i = e.size;
        i || (i = this.getViewportSizeMinusPadding_());
        const n = e.padding !== void 0 ? e.padding : [0, 0, 0, 0]
          , r = e.nearest !== void 0 ? e.nearest : !1;
        let o;
        e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
        const a = this.rotatedExtentForGeometry(t);
        let l = this.getResolutionForExtentInternal(a, [i[0] - n[1] - n[3], i[1] - n[0] - n[2]]);
        l = isNaN(l) ? o : Math.max(l, o),
        l = this.getConstrainedResolution(l, r ? 0 : 1);
        const h = this.getRotation()
          , c = Math.sin(h)
          , u = Math.cos(h)
          , d = ue(a);
        d[0] += (n[1] - n[3]) / 2 * l,
        d[1] += (n[0] - n[2]) / 2 * l;
        const f = d[0] * u - d[1] * c
          , g = d[1] * u + d[0] * c
          , _ = this.getConstrainedCenter([f, g], l)
          , m = e.callback ? e.callback : pi;
        e.duration !== void 0 ? this.animateInternal({
            resolution: l,
            center: _,
            duration: e.duration,
            easing: e.easing
        }, m) : (this.targetResolution_ = l,
        this.targetCenter_ = _,
        this.applyTargetState_(!1, !0),
        yn(m, !0))
    }
    centerOn(t, e, i) {
        this.centerOnInternal(oe(t, this.getProjection()), e, i)
    }
    centerOnInternal(t, e, i) {
        this.setCenterInternal(xs(t, e, i, this.getResolution(), this.getRotation()))
    }
    calculateCenterShift(t, e, i, n) {
        let r;
        const o = this.padding_;
        if (o && t) {
            const a = this.getViewportSizeMinusPadding_(-i)
              , l = xs(t, n, [a[0] / 2 + o[3], a[1] / 2 + o[0]], e, i);
            r = [t[0] - l[0], t[1] - l[1]]
        }
        return r
    }
    isDef() {
        return !!this.getCenterInternal() && this.getResolution() !== void 0
    }
    adjustCenter(t) {
        const e = Us(this.targetCenter_, this.getProjection());
        this.setCenter([e[0] + t[0], e[1] + t[1]])
    }
    adjustCenterInternal(t) {
        const e = this.targetCenter_;
        this.setCenterInternal([e[0] + t[0], e[1] + t[1]])
    }
    adjustResolution(t, e) {
        e = e && oe(e, this.getProjection()),
        this.adjustResolutionInternal(t, e)
    }
    adjustResolutionInternal(t, e) {
        const i = this.getAnimating() || this.getInteracting()
          , n = this.getViewportSize_(this.getRotation())
          , r = this.constraints_.resolution(this.targetResolution_ * t, 0, n, i);
        e && (this.targetCenter_ = this.calculateCenterZoom(r, e)),
        this.targetResolution_ *= t,
        this.applyTargetState_()
    }
    adjustZoom(t, e) {
        this.adjustResolution(Math.pow(this.zoomFactor_, -t), e)
    }
    adjustRotation(t, e) {
        e && (e = oe(e, this.getProjection())),
        this.adjustRotationInternal(t, e)
    }
    adjustRotationInternal(t, e) {
        const i = this.getAnimating() || this.getInteracting()
          , n = this.constraints_.rotation(this.targetRotation_ + t, i);
        e && (this.targetCenter_ = this.calculateCenterRotate(n, e)),
        this.targetRotation_ += t,
        this.applyTargetState_()
    }
    setCenter(t) {
        this.setCenterInternal(t && oe(t, this.getProjection()))
    }
    setCenterInternal(t) {
        this.targetCenter_ = t,
        this.applyTargetState_()
    }
    setHint(t, e) {
        return this.hints_[t] += e,
        this.changed(),
        this.hints_[t]
    }
    setResolution(t) {
        this.targetResolution_ = t,
        this.applyTargetState_()
    }
    setRotation(t) {
        this.targetRotation_ = t,
        this.applyTargetState_()
    }
    setZoom(t) {
        this.setResolution(this.getResolutionForZoom(t))
    }
    applyTargetState_(t, e) {
        const i = this.getAnimating() || this.getInteracting() || e
          , n = this.constraints_.rotation(this.targetRotation_, i)
          , r = this.getViewportSize_(n)
          , o = this.constraints_.resolution(this.targetResolution_, 0, r, i)
          , a = this.constraints_.center(this.targetCenter_, o, r, i, this.calculateCenterShift(this.targetCenter_, o, n, r));
        this.get(Nt.ROTATION) !== n && this.set(Nt.ROTATION, n),
        this.get(Nt.RESOLUTION) !== o && (this.set(Nt.RESOLUTION, o),
        this.set("zoom", this.getZoom(), !0)),
        (!a || !this.get(Nt.CENTER) || !Xn(this.get(Nt.CENTER), a)) && this.set(Nt.CENTER, a),
        this.getAnimating() && !t && this.cancelAnimations(),
        this.cancelAnchor_ = void 0
    }
    resolveConstraints(t, e, i) {
        t = t !== void 0 ? t : 200;
        const n = e || 0
          , r = this.constraints_.rotation(this.targetRotation_)
          , o = this.getViewportSize_(r)
          , a = this.constraints_.resolution(this.targetResolution_, n, o)
          , l = this.constraints_.center(this.targetCenter_, a, o, !1, this.calculateCenterShift(this.targetCenter_, a, r, o));
        if (t === 0 && !this.cancelAnchor_) {
            this.targetResolution_ = a,
            this.targetRotation_ = r,
            this.targetCenter_ = l,
            this.applyTargetState_();
            return
        }
        i = i || (t === 0 ? this.cancelAnchor_ : void 0),
        this.cancelAnchor_ = void 0,
        (this.getResolution() !== a || this.getRotation() !== r || !this.getCenterInternal() || !Xn(this.getCenterInternal(), l)) && (this.getAnimating() && this.cancelAnimations(),
        this.animateInternal({
            rotation: r,
            center: l,
            resolution: a,
            duration: t,
            easing: wi,
            anchor: i
        }))
    }
    beginInteraction() {
        this.resolveConstraints(0),
        this.setHint(gt.INTERACTING, 1)
    }
    endInteraction(t, e, i) {
        i = i && oe(i, this.getProjection()),
        this.endInteractionInternal(t, e, i)
    }
    endInteractionInternal(t, e, i) {
        this.getInteracting() && (this.setHint(gt.INTERACTING, -1),
        this.resolveConstraints(t, e, i))
    }
    getConstrainedCenter(t, e) {
        const i = this.getViewportSize_(this.getRotation());
        return this.constraints_.center(t, e || this.getResolution(), i)
    }
    getConstrainedZoom(t, e) {
        const i = this.getResolutionForZoom(t);
        return this.getZoomForResolution(this.getConstrainedResolution(i, e))
    }
    getConstrainedResolution(t, e) {
        e = e || 0;
        const i = this.getViewportSize_(this.getRotation());
        return this.constraints_.resolution(t, e, i)
    }
}
function yn(s, t) {
    setTimeout(function() {
        s(t)
    }, 0)
}
function Ic(s) {
    if (s.extent !== void 0) {
        const e = s.smoothExtentConstraint !== void 0 ? s.smoothExtentConstraint : !0;
        return ho(s.extent, s.constrainOnlyCenter, e)
    }
    const t = pr(s.projection, "EPSG:3857");
    if (s.multiWorld !== !0 && t.isGlobal()) {
        const e = t.getExtent().slice();
        return e[0] = -1 / 0,
        e[2] = 1 / 0,
        ho(e, !1, !1)
    }
    return tc
}
function Lc(s) {
    let t, e, i, o = s.minZoom !== void 0 ? s.minZoom : ys, a = s.maxZoom !== void 0 ? s.maxZoom : 28;
    const l = s.zoomFactor !== void 0 ? s.zoomFactor : 2
      , h = s.multiWorld !== void 0 ? s.multiWorld : !1
      , c = s.smoothResolutionConstraint !== void 0 ? s.smoothResolutionConstraint : !0
      , u = s.showFullExtent !== void 0 ? s.showFullExtent : !1
      , d = pr(s.projection, "EPSG:3857")
      , f = d.getExtent();
    let g = s.constrainOnlyCenter
      , _ = s.extent;
    if (!h && !_ && d.isGlobal() && (g = !1,
    _ = f),
    s.resolutions !== void 0) {
        const m = s.resolutions;
        e = m[o],
        i = m[a] !== void 0 ? m[a] : m[m.length - 1],
        s.constrainResolution ? t = ec(m, c, !g && _, u) : t = co(e, i, c, !g && _, u)
    } else {
        const p = (f ? Math.max($(f), qt(f)) : 360 * xi.degrees / d.getMetersPerUnit()) / dr / Math.pow(2, ys)
          , y = p / Math.pow(2, 28 - ys);
        e = s.maxResolution,
        e !== void 0 ? o = 0 : e = p / Math.pow(l, o),
        i = s.minResolution,
        i === void 0 && (s.maxZoom !== void 0 ? s.maxResolution !== void 0 ? i = e / Math.pow(l, a) : i = p / Math.pow(l, a) : i = y),
        a = o + Math.floor(Math.log(e / i) / Math.log(l)),
        i = e / Math.pow(l, a - o),
        s.constrainResolution ? t = ic(l, e, i, c, !g && _, u) : t = co(e, i, c, !g && _, u)
    }
    return {
        constraint: t,
        maxResolution: e,
        minResolution: i,
        minZoom: o,
        zoomFactor: l
    }
}
function Mc(s) {
    if (s.enableRotation !== void 0 ? s.enableRotation : !0) {
        const e = s.constrainRotation;
        return e === void 0 || e === !0 ? sc() : e === !1 ? uo : typeof e == "number" ? nc(e) : uo
    }
    return Er
}
function vc(s) {
    return !(s.sourceCenter && s.targetCenter && !Xn(s.sourceCenter, s.targetCenter) || s.sourceResolution !== s.targetResolution || s.sourceRotation !== s.targetRotation)
}
function xs(s, t, e, i, n) {
    const r = Math.cos(-n);
    let o = Math.sin(-n)
      , a = s[0] * r - s[1] * o
      , l = s[1] * r + s[0] * o;
    a += (t[0] / 2 - e[0]) * i,
    l += (e[1] - t[1] / 2) * i,
    o = -o;
    const h = a * r - l * o
      , c = l * r + a * o;
    return [h, c]
}
const Ut = Rc;
class bc extends va {
    constructor(t) {
        const e = Object.assign({}, t);
        delete e.source,
        super(e),
        this.on,
        this.once,
        this.un,
        this.mapPrecomposeKey_ = null,
        this.mapRenderKey_ = null,
        this.sourceChangeKey_ = null,
        this.renderer_ = null,
        this.sourceReady_ = !1,
        this.rendered = !1,
        t.render && (this.render = t.render),
        t.map && this.setMap(t.map),
        this.addChangeListener(j.SOURCE, this.handleSourcePropertyChange_);
        const i = t.source ? t.source : null;
        this.setSource(i)
    }
    getLayersArray(t) {
        return t = t || [],
        t.push(this),
        t
    }
    getLayerStatesArray(t) {
        return t = t || [],
        t.push(this.getLayerState()),
        t
    }
    getSource() {
        return this.get(j.SOURCE) || null
    }
    getRenderSource() {
        return this.getSource()
    }
    getSourceState() {
        const t = this.getSource();
        return t ? t.getState() : "undefined"
    }
    handleSourceChange_() {
        this.changed(),
        !(this.sourceReady_ || this.getSource().getState() !== "ready") && (this.sourceReady_ = !0,
        this.dispatchEvent("sourceready"))
    }
    handleSourcePropertyChange_() {
        this.sourceChangeKey_ && (et(this.sourceChangeKey_),
        this.sourceChangeKey_ = null),
        this.sourceReady_ = !1;
        const t = this.getSource();
        t && (this.sourceChangeKey_ = Y(t, G.CHANGE, this.handleSourceChange_, this),
        t.getState() === "ready" && (this.sourceReady_ = !0,
        setTimeout(()=>{
            this.dispatchEvent("sourceready")
        }
        , 0))),
        this.changed()
    }
    getFeatures(t) {
        return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([])
    }
    getData(t) {
        return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t)
    }
    isVisible(t) {
        let e;
        const i = this.getMapInternal();
        !t && i && (t = i.getView()),
        t instanceof Ut ? e = {
            viewState: t.getState(),
            extent: t.calculateExtent()
        } : e = t,
        !e.layerStatesArray && i && (e.layerStatesArray = i.getLayerGroup().getLayerStatesArray());
        let n;
        e.layerStatesArray ? n = e.layerStatesArray.find(o=>o.layer === this) : n = this.getLayerState();
        const r = this.getExtent();
        return Lr(n, e.viewState) && (!r || mt(r, e.extent))
    }
    getAttributions(t) {
        if (!this.isVisible(t))
            return [];
        let e;
        const i = this.getSource();
        if (i && (e = i.getAttributions()),
        !e)
            return [];
        const n = t instanceof Ut ? t.getViewStateAndExtent() : t;
        let r = e(n);
        return Array.isArray(r) || (r = [r]),
        r
    }
    render(t, e) {
        const i = this.getRenderer();
        return i.prepareFrame(t) ? (this.rendered = !0,
        i.renderFrame(t, e)) : null
    }
    unrender() {
        this.rendered = !1
    }
    setMapInternal(t) {
        t || this.unrender(),
        this.set(j.MAP, t)
    }
    getMapInternal() {
        return this.get(j.MAP)
    }
    setMap(t) {
        this.mapPrecomposeKey_ && (et(this.mapPrecomposeKey_),
        this.mapPrecomposeKey_ = null),
        t || this.changed(),
        this.mapRenderKey_ && (et(this.mapRenderKey_),
        this.mapRenderKey_ = null),
        t && (this.mapPrecomposeKey_ = Y(t, de.PRECOMPOSE, function(e) {
            const n = e.frameState.layerStatesArray
              , r = this.getLayerState(!1);
            W(!n.some(function(o) {
                return o.layer === r.layer
            }), 67),
            n.push(r)
        }, this),
        this.mapRenderKey_ = Y(this, G.CHANGE, t.render, t),
        this.changed())
    }
    setSource(t) {
        this.set(j.SOURCE, t)
    }
    getRenderer() {
        return this.renderer_ || (this.renderer_ = this.createRenderer()),
        this.renderer_
    }
    hasRenderer() {
        return !!this.renderer_
    }
    createRenderer() {
        return null
    }
    disposeInternal() {
        this.renderer_ && (this.renderer_.dispose(),
        delete this.renderer_),
        this.setSource(null),
        super.disposeInternal()
    }
}
function Lr(s, t) {
    if (!s.visible)
        return !1;
    const e = t.resolution;
    if (e < s.minResolution || e >= s.maxResolution)
        return !1;
    const i = t.zoom;
    return i > s.minZoom && i <= s.maxZoom
}
const ls = bc;
class Pc extends ar {
    constructor(t) {
        super(),
        this.map_ = t
    }
    dispatchRenderEvent(t, e) {
        Z()
    }
    calculateMatrices2D(t) {
        const e = t.viewState
          , i = t.coordinateToPixelTransform
          , n = t.pixelToCoordinateTransform;
        be(i, t.size[0] / 2, t.size[1] / 2, 1 / e.resolution, -1 / e.resolution, -e.rotation, -e.center[0], -e.center[1]),
        hr(n, i)
    }
    forEachFeatureAtCoordinate(t, e, i, n, r, o, a, l) {
        let h;
        const c = e.viewState;
        function u(E, w, R, T) {
            return r.call(o, w, E ? R : null, T)
        }
        const d = c.projection
          , f = gr(t.slice(), d)
          , g = [[0, 0]];
        if (d.canWrapX() && n) {
            const E = d.getExtent()
              , w = $(E);
            g.push([-w, 0], [w, 0])
        }
        const _ = e.layerStatesArray
          , m = _.length
          , p = []
          , y = [];
        for (let E = 0; E < g.length; E++)
            for (let w = m - 1; w >= 0; --w) {
                const R = _[w]
                  , T = R.layer;
                if (T.hasRenderer() && Lr(R, c) && a.call(l, T)) {
                    const L = T.getRenderer()
                      , v = T.getSource();
                    if (L && v) {
                        const b = v.getWrapX() ? f : t
                          , D = u.bind(null, R.managed);
                        y[0] = b[0] + g[E][0],
                        y[1] = b[1] + g[E][1],
                        h = L.forEachFeatureAtCoordinate(y, e, i, D, p)
                    }
                    if (h)
                        return h
                }
            }
        if (p.length === 0)
            return;
        const x = 1 / p.length;
        return p.forEach((E,w)=>E.distanceSq += w * x),
        p.sort((E,w)=>E.distanceSq - w.distanceSq),
        p.some(E=>h = E.callback(E.feature, E.layer, E.geometry)),
        h
    }
    hasFeatureAtCoordinate(t, e, i, n, r, o) {
        return this.forEachFeatureAtCoordinate(t, e, i, n, Di, this, r, o) !== void 0
    }
    getMap() {
        return this.map_
    }
    renderFrame(t) {
        Z()
    }
    scheduleExpireIconCache(t) {
        zn.canExpireCache() && t.postRenderFunctions.push(kc)
    }
}
function kc(s, t) {
    zn.expire()
}
const Ac = Pc;
class Oc extends _e {
    constructor(t, e, i, n) {
        super(t),
        this.inversePixelTransform = e,
        this.frameState = i,
        this.context = n
    }
}
const Ka = Oc
  , xn = "ol-hidden"
  , Fc = "ol-selectable"
  , en = "ol-unselectable"
  , Mr = "ol-control"
  , Eo = "ol-collapsed"
  , Dc = new RegExp(["^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)", "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)", "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)", "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?", "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))", "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))", `?\\s*([-,\\"\\'\\sa-z]+?)\\s*$`].join(""),"i")
  , wo = ["style", "variant", "weight", "size", "lineHeight", "family"]
  , ja = function(s) {
    const t = s.match(Dc);
    if (!t)
        return null;
    const e = {
        lineHeight: "normal",
        size: "1.2em",
        style: "normal",
        weight: "normal",
        variant: "normal"
    };
    for (let i = 0, n = wo.length; i < n; ++i) {
        const r = t[i + 1];
        r !== void 0 && (e[wo[i]] = r)
    }
    return e.families = e.family.split(/,\s?/),
    e
};
function wt(s, t, e, i) {
    let n;
    return e && e.length ? n = e.shift() : or ? n = new OffscreenCanvas(s || 300,t || 300) : n = document.createElement("canvas"),
    s && (n.width = s),
    t && (n.height = t),
    n.getContext("2d", i)
}
function hs(s) {
    const t = s.canvas;
    t.width = 1,
    t.height = 1,
    s.clearRect(0, 0, 1, 1)
}
function Nc(s) {
    let t = s.offsetWidth;
    const e = getComputedStyle(s);
    return t += parseInt(e.marginLeft, 10) + parseInt(e.marginRight, 10),
    t
}
function Gc(s) {
    let t = s.offsetHeight;
    const e = getComputedStyle(s);
    return t += parseInt(e.marginTop, 10) + parseInt(e.marginBottom, 10),
    t
}
function So(s, t) {
    const e = t.parentNode;
    e && e.replaceChild(s, t)
}
function Zn(s) {
    return s && s.parentNode ? s.parentNode.removeChild(s) : null
}
function Ha(s) {
    for (; s.lastChild; )
        s.removeChild(s.lastChild)
}
function zc(s, t) {
    const e = s.childNodes;
    for (let i = 0; ; ++i) {
        const n = e[i]
          , r = t[i];
        if (!n && !r)
            break;
        if (n !== r) {
            if (!n) {
                s.appendChild(r);
                continue
            }
            if (!r) {
                s.removeChild(n),
                --i;
                continue
            }
            s.insertBefore(r, n)
        }
    }
}
const $a = "10px sans-serif"
  , fe = "#000"
  , Vn = "round"
  , Wi = []
  , Xi = 0
  , Ei = "round"
  , Yi = 10
  , Bi = "#000"
  , Zi = "center"
  , Un = "middle"
  , Xe = [0, 0, 0, 0]
  , Vi = 1
  , ae = new Bt;
let oi = null, Ks;
const js = {}
  , Wc = function() {
    const t = "32px "
      , e = ["monospace", "serif"]
      , i = e.length
      , n = "wmytzilWMYTZIL@#/&?$%10";
    let r, o;
    function a(h, c, u) {
        let d = !0;
        for (let f = 0; f < i; ++f) {
            const g = e[f];
            if (o = Kn(h + " " + c + " " + t + g, n),
            u != g) {
                const _ = Kn(h + " " + c + " " + t + u + "," + g, n);
                d = d && _ != o
            }
        }
        return !!d
    }
    function l() {
        let h = !0;
        const c = ae.getKeys();
        for (let u = 0, d = c.length; u < d; ++u) {
            const f = c[u];
            ae.get(f) < 100 && (a.apply(this, f.split(`
`)) ? ($i(js),
            oi = null,
            Ks = void 0,
            ae.set(f, 100)) : (ae.set(f, ae.get(f) + 1, !0),
            h = !1))
        }
        h && (clearInterval(r),
        r = void 0)
    }
    return function(h) {
        const c = ja(h);
        if (!c)
            return;
        const u = c.families;
        for (let d = 0, f = u.length; d < f; ++d) {
            const g = u[d]
              , _ = c.style + `
` + c.weight + `
` + g;
            ae.get(_) === void 0 && (ae.set(_, 100, !0),
            a(c.style, c.weight, g) || (ae.set(_, 0, !0),
            r === void 0 && (r = setInterval(l, 32))))
        }
    }
}()
  , Xc = function() {
    let s;
    return function(t) {
        let e = js[t];
        if (e == null) {
            if (or) {
                const i = ja(t)
                  , n = qa(t, "Žg");
                e = (isNaN(Number(i.lineHeight)) ? 1.2 : Number(i.lineHeight)) * (n.actualBoundingBoxAscent + n.actualBoundingBoxDescent)
            } else
                s || (s = document.createElement("div"),
                s.innerHTML = "M",
                s.style.minHeight = "0",
                s.style.maxHeight = "none",
                s.style.height = "auto",
                s.style.padding = "0",
                s.style.border = "none",
                s.style.position = "absolute",
                s.style.display = "block",
                s.style.left = "-99999px"),
                s.style.font = t,
                document.body.appendChild(s),
                e = s.offsetHeight,
                document.body.removeChild(s);
            js[t] = e
        }
        return e
    }
}();
function qa(s, t) {
    return oi || (oi = wt(1, 1)),
    s != Ks && (oi.font = s,
    Ks = oi.font),
    oi.measureText(t)
}
function Kn(s, t) {
    return qa(s, t).width
}
function Co(s, t, e) {
    if (t in e)
        return e[t];
    const i = t.split(`
`).reduce((n,r)=>Math.max(n, Kn(s, r)), 0);
    return e[t] = i,
    i
}
function Yc(s, t) {
    const e = []
      , i = []
      , n = [];
    let r = 0
      , o = 0
      , a = 0
      , l = 0;
    for (let h = 0, c = t.length; h <= c; h += 2) {
        const u = t[h];
        if (u === `
` || h === c) {
            r = Math.max(r, o),
            n.push(o),
            o = 0,
            a += l;
            continue
        }
        const d = t[h + 1] || s.font
          , f = Kn(d, u);
        e.push(f),
        o += f;
        const g = Xc(d);
        i.push(g),
        l = Math.max(l, g)
    }
    return {
        width: r,
        height: a,
        widths: e,
        heights: i,
        lineWidths: n
    }
}
function Bc(s, t, e, i, n, r, o, a, l, h, c) {
    s.save(),
    e !== 1 && (s.globalAlpha *= e),
    t && s.setTransform.apply(s, t),
    i.contextInstructions ? (s.translate(l, h),
    s.scale(c[0], c[1]),
    Zc(i, s)) : c[0] < 0 || c[1] < 0 ? (s.translate(l, h),
    s.scale(c[0], c[1]),
    s.drawImage(i, n, r, o, a, 0, 0, o, a)) : s.drawImage(i, n, r, o, a, l, h, o * c[0], a * c[1]),
    s.restore()
}
function Zc(s, t) {
    const e = s.contextInstructions;
    for (let i = 0, n = e.length; i < n; i += 2)
        Array.isArray(e[i + 1]) ? t[e[i]].apply(t, e[i + 1]) : t[e[i]] = e[i + 1]
}
class Vc extends Ac {
    constructor(t) {
        super(t),
        this.fontChangeListenerKey_ = Y(ae, mi.PROPERTYCHANGE, t.redrawText.bind(t)),
        this.element_ = document.createElement("div");
        const e = this.element_.style;
        e.position = "absolute",
        e.width = "100%",
        e.height = "100%",
        e.zIndex = "0",
        this.element_.className = en + " ol-layers";
        const i = t.getViewport();
        i.insertBefore(this.element_, i.firstChild || null),
        this.children_ = [],
        this.renderedVisible_ = !0
    }
    dispatchRenderEvent(t, e) {
        const i = this.getMap();
        if (i.hasListener(t)) {
            const n = new Ka(t,void 0,e);
            i.dispatchEvent(n)
        }
    }
    disposeInternal() {
        et(this.fontChangeListenerKey_),
        this.element_.parentNode.removeChild(this.element_),
        super.disposeInternal()
    }
    renderFrame(t) {
        if (!t) {
            this.renderedVisible_ && (this.element_.style.display = "none",
            this.renderedVisible_ = !1);
            return
        }
        this.calculateMatrices2D(t),
        this.dispatchRenderEvent(de.PRECOMPOSE, t);
        const e = t.layerStatesArray.sort(function(o, a) {
            return o.zIndex - a.zIndex
        })
          , i = t.viewState;
        this.children_.length = 0;
        const n = [];
        let r = null;
        for (let o = 0, a = e.length; o < a; ++o) {
            const l = e[o];
            t.layerIndex = o;
            const h = l.layer
              , c = h.getSourceState();
            if (!Lr(l, i) || c != "ready" && c != "undefined") {
                h.unrender();
                continue
            }
            const u = h.render(t, r);
            u && (u !== r && (this.children_.push(u),
            r = u),
            "getDeclutter"in h && n.push(h))
        }
        for (let o = n.length - 1; o >= 0; --o)
            n[o].renderDeclutter(t);
        zc(this.element_, this.children_),
        this.dispatchRenderEvent(de.POSTCOMPOSE, t),
        this.renderedVisible_ || (this.element_.style.display = "",
        this.renderedVisible_ = !0),
        this.scheduleExpireIconCache(t)
    }
}
const Uc = Vc;
class Re extends _e {
    constructor(t, e) {
        super(t),
        this.layer = e
    }
}
const Es = {
    LAYERS: "layers"
};
class vr extends va {
    constructor(t) {
        t = t || {};
        const e = Object.assign({}, t);
        delete e.layers;
        let i = t.layers;
        super(e),
        this.on,
        this.once,
        this.un,
        this.layersListenerKeys_ = [],
        this.listenerKeys_ = {},
        this.addChangeListener(Es.LAYERS, this.handleLayersChanged_),
        i ? Array.isArray(i) ? i = new Xt(i.slice(),{
            unique: !0
        }) : W(typeof i.getArray == "function", 43) : i = new Xt(void 0,{
            unique: !0
        }),
        this.setLayers(i)
    }
    handleLayerChange_() {
        this.changed()
    }
    handleLayersChanged_() {
        this.layersListenerKeys_.forEach(et),
        this.layersListenerKeys_.length = 0;
        const t = this.getLayers();
        this.layersListenerKeys_.push(Y(t, Rt.ADD, this.handleLayersAdd_, this), Y(t, Rt.REMOVE, this.handleLayersRemove_, this));
        for (const i in this.listenerKeys_)
            this.listenerKeys_[i].forEach(et);
        $i(this.listenerKeys_);
        const e = t.getArray();
        for (let i = 0, n = e.length; i < n; i++) {
            const r = e[i];
            this.registerLayerListeners_(r),
            this.dispatchEvent(new Re("addlayer",r))
        }
        this.changed()
    }
    registerLayerListeners_(t) {
        const e = [Y(t, mi.PROPERTYCHANGE, this.handleLayerChange_, this), Y(t, G.CHANGE, this.handleLayerChange_, this)];
        t instanceof vr && e.push(Y(t, "addlayer", this.handleLayerGroupAdd_, this), Y(t, "removelayer", this.handleLayerGroupRemove_, this)),
        this.listenerKeys_[U(t)] = e
    }
    handleLayerGroupAdd_(t) {
        this.dispatchEvent(new Re("addlayer",t.layer))
    }
    handleLayerGroupRemove_(t) {
        this.dispatchEvent(new Re("removelayer",t.layer))
    }
    handleLayersAdd_(t) {
        const e = t.element;
        this.registerLayerListeners_(e),
        this.dispatchEvent(new Re("addlayer",e)),
        this.changed()
    }
    handleLayersRemove_(t) {
        const e = t.element
          , i = U(e);
        this.listenerKeys_[i].forEach(et),
        delete this.listenerKeys_[i],
        this.dispatchEvent(new Re("removelayer",e)),
        this.changed()
    }
    getLayers() {
        return this.get(Es.LAYERS)
    }
    setLayers(t) {
        const e = this.getLayers();
        if (e) {
            const i = e.getArray();
            for (let n = 0, r = i.length; n < r; ++n)
                this.dispatchEvent(new Re("removelayer",i[n]))
        }
        this.set(Es.LAYERS, t)
    }
    getLayersArray(t) {
        return t = t !== void 0 ? t : [],
        this.getLayers().forEach(function(e) {
            e.getLayersArray(t)
        }),
        t
    }
    getLayerStatesArray(t) {
        const e = t !== void 0 ? t : []
          , i = e.length;
        this.getLayers().forEach(function(o) {
            o.getLayerStatesArray(e)
        });
        const n = this.getLayerState();
        let r = n.zIndex;
        !t && n.zIndex === void 0 && (r = 0);
        for (let o = i, a = e.length; o < a; o++) {
            const l = e[o];
            l.opacity *= n.opacity,
            l.visible = l.visible && n.visible,
            l.maxResolution = Math.min(l.maxResolution, n.maxResolution),
            l.minResolution = Math.max(l.minResolution, n.minResolution),
            l.minZoom = Math.max(l.minZoom, n.minZoom),
            l.maxZoom = Math.min(l.maxZoom, n.maxZoom),
            n.extent !== void 0 && (l.extent !== void 0 ? l.extent = di(l.extent, n.extent) : l.extent = n.extent),
            l.zIndex === void 0 && (l.zIndex = r)
        }
        return e
    }
    getSourceState() {
        return "ready"
    }
}
const cs = vr;
class Kc extends _e {
    constructor(t, e, i) {
        super(t),
        this.map = e,
        this.frameState = i !== void 0 ? i : null
    }
}
const ai = Kc;
class jc extends ai {
    constructor(t, e, i, n, r, o) {
        super(t, e, r),
        this.originalEvent = i,
        this.pixel_ = null,
        this.coordinate_ = null,
        this.dragging = n !== void 0 ? n : !1,
        this.activePointers = o
    }
    get pixel() {
        return this.pixel_ || (this.pixel_ = this.map.getEventPixel(this.originalEvent)),
        this.pixel_
    }
    set pixel(t) {
        this.pixel_ = t
    }
    get coordinate() {
        return this.coordinate_ || (this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel)),
        this.coordinate_
    }
    set coordinate(t) {
        this.coordinate_ = t
    }
    preventDefault() {
        super.preventDefault(),
        "preventDefault"in this.originalEvent && this.originalEvent.preventDefault()
    }
    stopPropagation() {
        super.stopPropagation(),
        "stopPropagation"in this.originalEvent && this.originalEvent.stopPropagation()
    }
}
const Te = jc
  , st = {
    SINGLECLICK: "singleclick",
    CLICK: G.CLICK,
    DBLCLICK: G.DBLCLICK,
    POINTERDRAG: "pointerdrag",
    POINTERMOVE: "pointermove",
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    POINTERCANCEL: "pointercancel"
}
  , Ui = {
    POINTERMOVE: "pointermove",
    POINTERDOWN: "pointerdown",
    POINTERUP: "pointerup",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    POINTERCANCEL: "pointercancel"
};
class Hc extends Qn {
    constructor(t, e) {
        super(t),
        this.map_ = t,
        this.clickTimeoutId_,
        this.emulateClicks_ = !1,
        this.dragging_ = !1,
        this.dragListenerKeys_ = [],
        this.moveTolerance_ = e === void 0 ? 1 : e,
        this.down_ = null;
        const i = this.map_.getViewport();
        this.activePointers_ = [],
        this.trackedTouches_ = {},
        this.element_ = i,
        this.pointerdownListenerKey_ = Y(i, Ui.POINTERDOWN, this.handlePointerDown_, this),
        this.originalPointerMoveEvent_,
        this.relayedListenerKey_ = Y(i, Ui.POINTERMOVE, this.relayMoveEvent_, this),
        this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this),
        this.element_.addEventListener(G.TOUCHMOVE, this.boundHandleTouchMove_, ya ? {
            passive: !1
        } : !1)
    }
    emulateClick_(t) {
        let e = new Te(st.CLICK,this.map_,t);
        this.dispatchEvent(e),
        this.clickTimeoutId_ !== void 0 ? (clearTimeout(this.clickTimeoutId_),
        this.clickTimeoutId_ = void 0,
        e = new Te(st.DBLCLICK,this.map_,t),
        this.dispatchEvent(e)) : this.clickTimeoutId_ = setTimeout(()=>{
            this.clickTimeoutId_ = void 0;
            const i = new Te(st.SINGLECLICK,this.map_,t);
            this.dispatchEvent(i)
        }
        , 250)
    }
    updateActivePointers_(t) {
        const e = t
          , i = e.pointerId;
        if (e.type == st.POINTERUP || e.type == st.POINTERCANCEL) {
            delete this.trackedTouches_[i];
            for (const n in this.trackedTouches_)
                if (this.trackedTouches_[n].target !== e.target) {
                    delete this.trackedTouches_[n];
                    break
                }
        } else
            (e.type == st.POINTERDOWN || e.type == st.POINTERMOVE) && (this.trackedTouches_[i] = e);
        this.activePointers_ = Object.values(this.trackedTouches_)
    }
    handlePointerUp_(t) {
        this.updateActivePointers_(t);
        const e = new Te(st.POINTERUP,this.map_,t,void 0,void 0,this.activePointers_);
        this.dispatchEvent(e),
        this.emulateClicks_ && !e.defaultPrevented && !this.dragging_ && this.isMouseActionButton_(t) && this.emulateClick_(this.down_),
        this.activePointers_.length === 0 && (this.dragListenerKeys_.forEach(et),
        this.dragListenerKeys_.length = 0,
        this.dragging_ = !1,
        this.down_ = null)
    }
    isMouseActionButton_(t) {
        return t.button === 0
    }
    handlePointerDown_(t) {
        this.emulateClicks_ = this.activePointers_.length === 0,
        this.updateActivePointers_(t);
        const e = new Te(st.POINTERDOWN,this.map_,t,void 0,void 0,this.activePointers_);
        if (this.dispatchEvent(e),
        this.down_ = new PointerEvent(t.type,t),
        Object.defineProperty(this.down_, "target", {
            writable: !1,
            value: t.target
        }),
        this.dragListenerKeys_.length === 0) {
            const i = this.map_.getOwnerDocument();
            this.dragListenerKeys_.push(Y(i, st.POINTERMOVE, this.handlePointerMove_, this), Y(i, st.POINTERUP, this.handlePointerUp_, this), Y(this.element_, st.POINTERCANCEL, this.handlePointerUp_, this)),
            this.element_.getRootNode && this.element_.getRootNode() !== i && this.dragListenerKeys_.push(Y(this.element_.getRootNode(), st.POINTERUP, this.handlePointerUp_, this))
        }
    }
    handlePointerMove_(t) {
        if (this.isMoving_(t)) {
            this.updateActivePointers_(t),
            this.dragging_ = !0;
            const e = new Te(st.POINTERDRAG,this.map_,t,this.dragging_,void 0,this.activePointers_);
            this.dispatchEvent(e)
        }
    }
    relayMoveEvent_(t) {
        this.originalPointerMoveEvent_ = t;
        const e = !!(this.down_ && this.isMoving_(t));
        this.dispatchEvent(new Te(st.POINTERMOVE,this.map_,t,e))
    }
    handleTouchMove_(t) {
        const e = this.originalPointerMoveEvent_;
        (!e || e.defaultPrevented) && (typeof t.cancelable != "boolean" || t.cancelable === !0) && t.preventDefault()
    }
    isMoving_(t) {
        return this.dragging_ || Math.abs(t.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(t.clientY - this.down_.clientY) > this.moveTolerance_
    }
    disposeInternal() {
        this.relayedListenerKey_ && (et(this.relayedListenerKey_),
        this.relayedListenerKey_ = null),
        this.element_.removeEventListener(G.TOUCHMOVE, this.boundHandleTouchMove_),
        this.pointerdownListenerKey_ && (et(this.pointerdownListenerKey_),
        this.pointerdownListenerKey_ = null),
        this.dragListenerKeys_.forEach(et),
        this.dragListenerKeys_.length = 0,
        this.element_ = null,
        super.disposeInternal()
    }
}
const $c = Hc
  , le = {
    POSTRENDER: "postrender",
    MOVESTART: "movestart",
    MOVEEND: "moveend",
    LOADSTART: "loadstart",
    LOADEND: "loadend"
}
  , ft = {
    LAYERGROUP: "layergroup",
    SIZE: "size",
    TARGET: "target",
    VIEW: "view"
}
  , jn = 1 / 0;
class qc {
    constructor(t, e) {
        this.priorityFunction_ = t,
        this.keyFunction_ = e,
        this.elements_ = [],
        this.priorities_ = [],
        this.queuedElements_ = {}
    }
    clear() {
        this.elements_.length = 0,
        this.priorities_.length = 0,
        $i(this.queuedElements_)
    }
    dequeue() {
        const t = this.elements_
          , e = this.priorities_
          , i = t[0];
        t.length == 1 ? (t.length = 0,
        e.length = 0) : (t[0] = t.pop(),
        e[0] = e.pop(),
        this.siftUp_(0));
        const n = this.keyFunction_(i);
        return delete this.queuedElements_[n],
        i
    }
    enqueue(t) {
        W(!(this.keyFunction_(t)in this.queuedElements_), 31);
        const e = this.priorityFunction_(t);
        return e != jn ? (this.elements_.push(t),
        this.priorities_.push(e),
        this.queuedElements_[this.keyFunction_(t)] = !0,
        this.siftDown_(0, this.elements_.length - 1),
        !0) : !1
    }
    getCount() {
        return this.elements_.length
    }
    getLeftChildIndex_(t) {
        return t * 2 + 1
    }
    getRightChildIndex_(t) {
        return t * 2 + 2
    }
    getParentIndex_(t) {
        return t - 1 >> 1
    }
    heapify_() {
        let t;
        for (t = (this.elements_.length >> 1) - 1; t >= 0; t--)
            this.siftUp_(t)
    }
    isEmpty() {
        return this.elements_.length === 0
    }
    isKeyQueued(t) {
        return t in this.queuedElements_
    }
    isQueued(t) {
        return this.isKeyQueued(this.keyFunction_(t))
    }
    siftUp_(t) {
        const e = this.elements_
          , i = this.priorities_
          , n = e.length
          , r = e[t]
          , o = i[t]
          , a = t;
        for (; t < n >> 1; ) {
            const l = this.getLeftChildIndex_(t)
              , h = this.getRightChildIndex_(t)
              , c = h < n && i[h] < i[l] ? h : l;
            e[t] = e[c],
            i[t] = i[c],
            t = c
        }
        e[t] = r,
        i[t] = o,
        this.siftDown_(a, t)
    }
    siftDown_(t, e) {
        const i = this.elements_
          , n = this.priorities_
          , r = i[e]
          , o = n[e];
        for (; e > t; ) {
            const a = this.getParentIndex_(e);
            if (n[a] > o)
                i[e] = i[a],
                n[e] = n[a],
                e = a;
            else
                break
        }
        i[e] = r,
        n[e] = o
    }
    reprioritize() {
        const t = this.priorityFunction_
          , e = this.elements_
          , i = this.priorities_;
        let n = 0;
        const r = e.length;
        let o, a, l;
        for (a = 0; a < r; ++a)
            o = e[a],
            l = t(o),
            l == jn ? delete this.queuedElements_[this.keyFunction_(o)] : (i[n] = l,
            e[n++] = o);
        e.length = n,
        i.length = n,
        this.heapify_()
    }
}
const Jc = qc
  , k = {
    IDLE: 0,
    LOADING: 1,
    LOADED: 2,
    ERROR: 3,
    EMPTY: 4
};
class Qc extends Jc {
    constructor(t, e) {
        super(function(i) {
            return t.apply(null, i)
        }, function(i) {
            return i[0].getKey()
        }),
        this.boundHandleTileChange_ = this.handleTileChange.bind(this),
        this.tileChangeCallback_ = e,
        this.tilesLoading_ = 0,
        this.tilesLoadingKeys_ = {}
    }
    enqueue(t) {
        const e = super.enqueue(t);
        return e && t[0].addEventListener(G.CHANGE, this.boundHandleTileChange_),
        e
    }
    getTilesLoading() {
        return this.tilesLoading_
    }
    handleTileChange(t) {
        const e = t.target
          , i = e.getState();
        if (i === k.LOADED || i === k.ERROR || i === k.EMPTY) {
            i !== k.ERROR && e.removeEventListener(G.CHANGE, this.boundHandleTileChange_);
            const n = e.getKey();
            n in this.tilesLoadingKeys_ && (delete this.tilesLoadingKeys_[n],
            --this.tilesLoading_),
            this.tileChangeCallback_()
        }
    }
    loadMoreTiles(t, e) {
        let i = 0, n, r, o;
        for (; this.tilesLoading_ < t && i < e && this.getCount() > 0; )
            r = this.dequeue()[0],
            o = r.getKey(),
            n = r.getState(),
            n === k.IDLE && !(o in this.tilesLoadingKeys_) && (this.tilesLoadingKeys_[o] = !0,
            ++this.tilesLoading_,
            ++i,
            r.load())
    }
}
const tu = Qc;
function eu(s, t, e, i, n) {
    if (!s || !(e in s.wantedTiles) || !s.wantedTiles[e][t.getKey()])
        return jn;
    const r = s.viewState.center
      , o = i[0] - r[0]
      , a = i[1] - r[1];
    return 65536 * Math.log(n) + Math.sqrt(o * o + a * a) / n
}
class iu extends Bt {
    constructor(t) {
        super();
        const e = t.element;
        e && !t.target && !e.style.pointerEvents && (e.style.pointerEvents = "auto"),
        this.element = e || null,
        this.target_ = null,
        this.map_ = null,
        this.listenerKeys = [],
        t.render && (this.render = t.render),
        t.target && this.setTarget(t.target)
    }
    disposeInternal() {
        Zn(this.element),
        super.disposeInternal()
    }
    getMap() {
        return this.map_
    }
    setMap(t) {
        this.map_ && Zn(this.element);
        for (let e = 0, i = this.listenerKeys.length; e < i; ++e)
            et(this.listenerKeys[e]);
        this.listenerKeys.length = 0,
        this.map_ = t,
        t && ((this.target_ ? this.target_ : t.getOverlayContainerStopEvent()).appendChild(this.element),
        this.render !== pi && this.listenerKeys.push(Y(t, le.POSTRENDER, this.render, this)),
        t.render())
    }
    render(t) {}
    setTarget(t) {
        this.target_ = typeof t == "string" ? document.getElementById(t) : t
    }
}
const Si = iu;
class nu extends Si {
    constructor(t) {
        t = t || {},
        super({
            element: document.createElement("div"),
            render: t.render,
            target: t.target
        }),
        this.ulElement_ = document.createElement("ul"),
        this.collapsed_ = t.collapsed !== void 0 ? t.collapsed : !0,
        this.userCollapsed_ = this.collapsed_,
        this.overrideCollapsible_ = t.collapsible !== void 0,
        this.collapsible_ = t.collapsible !== void 0 ? t.collapsible : !0,
        this.collapsible_ || (this.collapsed_ = !1);
        const e = t.className !== void 0 ? t.className : "ol-attribution"
          , i = t.tipLabel !== void 0 ? t.tipLabel : "Attributions"
          , n = t.expandClassName !== void 0 ? t.expandClassName : e + "-expand"
          , r = t.collapseLabel !== void 0 ? t.collapseLabel : "›"
          , o = t.collapseClassName !== void 0 ? t.collapseClassName : e + "-collapse";
        typeof r == "string" ? (this.collapseLabel_ = document.createElement("span"),
        this.collapseLabel_.textContent = r,
        this.collapseLabel_.className = o) : this.collapseLabel_ = r;
        const a = t.label !== void 0 ? t.label : "i";
        typeof a == "string" ? (this.label_ = document.createElement("span"),
        this.label_.textContent = a,
        this.label_.className = n) : this.label_ = a;
        const l = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
        this.toggleButton_ = document.createElement("button"),
        this.toggleButton_.setAttribute("type", "button"),
        this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_)),
        this.toggleButton_.title = i,
        this.toggleButton_.appendChild(l),
        this.toggleButton_.addEventListener(G.CLICK, this.handleClick_.bind(this), !1);
        const h = e + " " + en + " " + Mr + (this.collapsed_ && this.collapsible_ ? " " + Eo : "") + (this.collapsible_ ? "" : " ol-uncollapsible")
          , c = this.element;
        c.className = h,
        c.appendChild(this.toggleButton_),
        c.appendChild(this.ulElement_),
        this.renderedAttributions_ = [],
        this.renderedVisible_ = !0
    }
    collectSourceAttributions_(t) {
        const e = Array.from(new Set(this.getMap().getAllLayers().flatMap(n=>n.getAttributions(t))))
          , i = !this.getMap().getAllLayers().some(n=>n.getSource() && n.getSource().getAttributionsCollapsible() === !1);
        return this.overrideCollapsible_ || this.setCollapsible(i),
        e
    }
    updateElement_(t) {
        if (!t) {
            this.renderedVisible_ && (this.element.style.display = "none",
            this.renderedVisible_ = !1);
            return
        }
        const e = this.collectSourceAttributions_(t)
          , i = e.length > 0;
        if (this.renderedVisible_ != i && (this.element.style.display = i ? "" : "none",
        this.renderedVisible_ = i),
        !Pe(e, this.renderedAttributions_)) {
            Ha(this.ulElement_);
            for (let n = 0, r = e.length; n < r; ++n) {
                const o = document.createElement("li");
                o.innerHTML = e[n],
                this.ulElement_.appendChild(o)
            }
            this.renderedAttributions_ = e
        }
    }
    handleClick_(t) {
        t.preventDefault(),
        this.handleToggle_(),
        this.userCollapsed_ = this.collapsed_
    }
    handleToggle_() {
        this.element.classList.toggle(Eo),
        this.collapsed_ ? So(this.collapseLabel_, this.label_) : So(this.label_, this.collapseLabel_),
        this.collapsed_ = !this.collapsed_,
        this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_))
    }
    getCollapsible() {
        return this.collapsible_
    }
    setCollapsible(t) {
        this.collapsible_ !== t && (this.collapsible_ = t,
        this.element.classList.toggle("ol-uncollapsible"),
        this.userCollapsed_ && this.handleToggle_())
    }
    setCollapsed(t) {
        this.userCollapsed_ = t,
        !(!this.collapsible_ || this.collapsed_ === t) && this.handleToggle_()
    }
    getCollapsed() {
        return this.collapsed_
    }
    render(t) {
        this.updateElement_(t.frameState)
    }
}
const Ja = nu;
class su extends Si {
    constructor(t) {
        t = t || {},
        super({
            element: document.createElement("div"),
            render: t.render,
            target: t.target
        });
        const e = t.className !== void 0 ? t.className : "ol-rotate"
          , i = t.label !== void 0 ? t.label : "⇧"
          , n = t.compassClassName !== void 0 ? t.compassClassName : "ol-compass";
        this.label_ = null,
        typeof i == "string" ? (this.label_ = document.createElement("span"),
        this.label_.className = n,
        this.label_.textContent = i) : (this.label_ = i,
        this.label_.classList.add(n));
        const r = t.tipLabel ? t.tipLabel : "Reset rotation"
          , o = document.createElement("button");
        o.className = e + "-reset",
        o.setAttribute("type", "button"),
        o.title = r,
        o.appendChild(this.label_),
        o.addEventListener(G.CLICK, this.handleClick_.bind(this), !1);
        const a = e + " " + en + " " + Mr
          , l = this.element;
        l.className = a,
        l.appendChild(o),
        this.callResetNorth_ = t.resetNorth ? t.resetNorth : void 0,
        this.duration_ = t.duration !== void 0 ? t.duration : 250,
        this.autoHide_ = t.autoHide !== void 0 ? t.autoHide : !0,
        this.rotation_ = void 0,
        this.autoHide_ && this.element.classList.add(xn)
    }
    handleClick_(t) {
        t.preventDefault(),
        this.callResetNorth_ !== void 0 ? this.callResetNorth_() : this.resetNorth_()
    }
    resetNorth_() {
        const e = this.getMap().getView();
        if (!e)
            return;
        const i = e.getRotation();
        i !== void 0 && (this.duration_ > 0 && i % (2 * Math.PI) !== 0 ? e.animate({
            rotation: 0,
            duration: this.duration_,
            easing: wi
        }) : e.setRotation(0))
    }
    render(t) {
        const e = t.frameState;
        if (!e)
            return;
        const i = e.viewState.rotation;
        if (i != this.rotation_) {
            const n = "rotate(" + i + "rad)";
            if (this.autoHide_) {
                const r = this.element.classList.contains(xn);
                !r && i === 0 ? this.element.classList.add(xn) : r && i !== 0 && this.element.classList.remove(xn)
            }
            this.label_.style.transform = n
        }
        this.rotation_ = i
    }
}
const ru = su;
class ou extends Si {
    constructor(t) {
        t = t || {},
        super({
            element: document.createElement("div"),
            target: t.target
        });
        const e = t.className !== void 0 ? t.className : "ol-zoom"
          , i = t.delta !== void 0 ? t.delta : 1
          , n = t.zoomInClassName !== void 0 ? t.zoomInClassName : e + "-in"
          , r = t.zoomOutClassName !== void 0 ? t.zoomOutClassName : e + "-out"
          , o = t.zoomInLabel !== void 0 ? t.zoomInLabel : "+"
          , a = t.zoomOutLabel !== void 0 ? t.zoomOutLabel : "–"
          , l = t.zoomInTipLabel !== void 0 ? t.zoomInTipLabel : "Zoom in"
          , h = t.zoomOutTipLabel !== void 0 ? t.zoomOutTipLabel : "Zoom out"
          , c = document.createElement("button");
        c.className = n,
        c.setAttribute("type", "button"),
        c.title = l,
        c.appendChild(typeof o == "string" ? document.createTextNode(o) : o),
        c.addEventListener(G.CLICK, this.handleClick_.bind(this, i), !1);
        const u = document.createElement("button");
        u.className = r,
        u.setAttribute("type", "button"),
        u.title = h,
        u.appendChild(typeof a == "string" ? document.createTextNode(a) : a),
        u.addEventListener(G.CLICK, this.handleClick_.bind(this, -i), !1);
        const d = e + " " + en + " " + Mr
          , f = this.element;
        f.className = d,
        f.appendChild(c),
        f.appendChild(u),
        this.duration_ = t.duration !== void 0 ? t.duration : 250
    }
    handleClick_(t, e) {
        e.preventDefault(),
        this.zoomByDelta_(t)
    }
    zoomByDelta_(t) {
        const i = this.getMap().getView();
        if (!i)
            return;
        const n = i.getZoom();
        if (n !== void 0) {
            const r = i.getConstrainedZoom(n + t);
            this.duration_ > 0 ? (i.getAnimating() && i.cancelAnimations(),
            i.animate({
                zoom: r,
                duration: this.duration_,
                easing: wi
            })) : i.setZoom(r)
        }
    }
}
const au = ou;
function Qa(s) {
    s = s || {};
    const t = new Xt;
    return (s.zoom !== void 0 ? s.zoom : !0) && t.push(new au(s.zoomOptions)),
    (s.rotate !== void 0 ? s.rotate : !0) && t.push(new ru(s.rotateOptions)),
    (s.attribution !== void 0 ? s.attribution : !0) && t.push(new Ja(s.attributionOptions)),
    t
}
const To = {
    ACTIVE: "active"
};
class lu extends Bt {
    constructor(t) {
        super(),
        this.on,
        this.once,
        this.un,
        t && t.handleEvent && (this.handleEvent = t.handleEvent),
        this.map_ = null,
        this.setActive(!0)
    }
    getActive() {
        return this.get(To.ACTIVE)
    }
    getMap() {
        return this.map_
    }
    handleEvent(t) {
        return !0
    }
    setActive(t) {
        this.set(To.ACTIVE, t)
    }
    setMap(t) {
        this.map_ = t
    }
}
function hu(s, t, e) {
    const i = s.getCenterInternal();
    if (i) {
        const n = [i[0] + t[0], i[1] + t[1]];
        s.animateInternal({
            duration: e !== void 0 ? e : 250,
            easing: oc,
            center: s.getConstrainedCenter(n)
        })
    }
}
function br(s, t, e, i) {
    const n = s.getZoom();
    if (n === void 0)
        return;
    const r = s.getConstrainedZoom(n + t)
      , o = s.getResolutionForZoom(r);
    s.getAnimating() && s.cancelAnimations(),
    s.animate({
        resolution: o,
        anchor: e,
        duration: i !== void 0 ? i : 250,
        easing: wi
    })
}
const nn = lu;
class cu extends nn {
    constructor(t) {
        super(),
        t = t || {},
        this.delta_ = t.delta ? t.delta : 1,
        this.duration_ = t.duration !== void 0 ? t.duration : 250
    }
    handleEvent(t) {
        let e = !1;
        if (t.type == st.DBLCLICK) {
            const i = t.originalEvent
              , n = t.map
              , r = t.coordinate
              , o = i.shiftKey ? -this.delta_ : this.delta_
              , a = n.getView();
            br(a, o, r, this.duration_),
            i.preventDefault(),
            e = !0
        }
        return !e
    }
}
const uu = cu;
class du extends nn {
    constructor(t) {
        t = t || {},
        super(t),
        t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent),
        t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent),
        t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent),
        t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent),
        t.stopDown && (this.stopDown = t.stopDown),
        this.handlingDownUpSequence = !1,
        this.targetPointers = []
    }
    getPointerCount() {
        return this.targetPointers.length
    }
    handleDownEvent(t) {
        return !1
    }
    handleDragEvent(t) {}
    handleEvent(t) {
        if (!t.originalEvent)
            return !0;
        let e = !1;
        if (this.updateTrackedPointers_(t),
        this.handlingDownUpSequence) {
            if (t.type == st.POINTERDRAG)
                this.handleDragEvent(t),
                t.originalEvent.preventDefault();
            else if (t.type == st.POINTERUP) {
                const i = this.handleUpEvent(t);
                this.handlingDownUpSequence = i && this.targetPointers.length > 0
            }
        } else if (t.type == st.POINTERDOWN) {
            const i = this.handleDownEvent(t);
            this.handlingDownUpSequence = i,
            e = this.stopDown(i)
        } else
            t.type == st.POINTERMOVE && this.handleMoveEvent(t);
        return !e
    }
    handleMoveEvent(t) {}
    handleUpEvent(t) {
        return !1
    }
    stopDown(t) {
        return t
    }
    updateTrackedPointers_(t) {
        t.activePointers && (this.targetPointers = t.activePointers)
    }
}
function Pr(s) {
    const t = s.length;
    let e = 0
      , i = 0;
    for (let n = 0; n < t; n++)
        e += s[n].clientX,
        i += s[n].clientY;
    return {
        clientX: e / t,
        clientY: i / t
    }
}
const Ci = du;
function Hs(s) {
    const t = arguments;
    return function(e) {
        let i = !0;
        for (let n = 0, r = t.length; n < r && (i = i && t[n](e),
        !!i); ++n)
            ;
        return i
    }
}
const fu = function(s) {
    const t = s.originalEvent;
    return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey
}
  , gu = function(s) {
    const t = s.map.getTargetElement()
      , e = s.map.getOwnerDocument().activeElement;
    return t.contains(e)
}
  , tl = function(s) {
    return s.map.getTargetElement().hasAttribute("tabindex") ? gu(s) : !0
}
  , _u = Di
  , el = function(s) {
    const t = s.originalEvent;
    return t.button == 0 && !(Hl && $l && t.ctrlKey)
}
  , il = function(s) {
    const t = s.originalEvent;
    return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey
}
  , mu = function(s) {
    const t = s.originalEvent;
    return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey
}
  , nl = function(s) {
    const t = s.originalEvent
      , e = t.target.tagName;
    return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && !t.target.isContentEditable
}
  , ws = function(s) {
    const t = s.originalEvent;
    return W(t !== void 0, 56),
    t.pointerType == "mouse"
}
  , pu = function(s) {
    const t = s.originalEvent;
    return W(t !== void 0, 56),
    t.isPrimary && t.button === 0
};
class yu extends Ci {
    constructor(t) {
        super({
            stopDown: Jn
        }),
        t = t || {},
        this.kinetic_ = t.kinetic,
        this.lastCentroid = null,
        this.lastPointersCount_,
        this.panning_ = !1;
        const e = t.condition ? t.condition : Hs(il, pu);
        this.condition_ = t.onFocusOnly ? Hs(tl, e) : e,
        this.noKinetic_ = !1
    }
    handleDragEvent(t) {
        const e = t.map;
        this.panning_ || (this.panning_ = !0,
        e.getView().beginInteraction());
        const i = this.targetPointers
          , n = e.getEventPixel(Pr(i));
        if (i.length == this.lastPointersCount_) {
            if (this.kinetic_ && this.kinetic_.update(n[0], n[1]),
            this.lastCentroid) {
                const r = [this.lastCentroid[0] - n[0], n[1] - this.lastCentroid[1]]
                  , a = t.map.getView();
                Uh(r, a.getResolution()),
                fr(r, a.getRotation()),
                a.adjustCenterInternal(r)
            }
        } else
            this.kinetic_ && this.kinetic_.begin();
        this.lastCentroid = n,
        this.lastPointersCount_ = i.length,
        t.originalEvent.preventDefault()
    }
    handleUpEvent(t) {
        const e = t.map
          , i = e.getView();
        if (this.targetPointers.length === 0) {
            if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
                const n = this.kinetic_.getDistance()
                  , r = this.kinetic_.getAngle()
                  , o = i.getCenterInternal()
                  , a = e.getPixelFromCoordinateInternal(o)
                  , l = e.getCoordinateFromPixelInternal([a[0] - n * Math.cos(r), a[1] - n * Math.sin(r)]);
                i.animateInternal({
                    center: i.getConstrainedCenter(l),
                    duration: 500,
                    easing: wi
                })
            }
            return this.panning_ && (this.panning_ = !1,
            i.endInteraction()),
            !1
        }
        return this.kinetic_ && this.kinetic_.begin(),
        this.lastCentroid = null,
        !0
    }
    handleDownEvent(t) {
        if (this.targetPointers.length > 0 && this.condition_(t)) {
            const i = t.map.getView();
            return this.lastCentroid = null,
            i.getAnimating() && i.cancelAnimations(),
            this.kinetic_ && this.kinetic_.begin(),
            this.noKinetic_ = this.targetPointers.length > 1,
            !0
        }
        return !1
    }
}
const xu = yu;
class Eu extends Ci {
    constructor(t) {
        t = t || {},
        super({
            stopDown: Jn
        }),
        this.condition_ = t.condition ? t.condition : fu,
        this.lastAngle_ = void 0,
        this.duration_ = t.duration !== void 0 ? t.duration : 250
    }
    handleDragEvent(t) {
        if (!ws(t))
            return;
        const e = t.map
          , i = e.getView();
        if (i.getConstraints().rotation === Er)
            return;
        const n = e.getSize()
          , r = t.pixel
          , o = Math.atan2(n[1] / 2 - r[1], r[0] - n[0] / 2);
        if (this.lastAngle_ !== void 0) {
            const a = o - this.lastAngle_;
            i.adjustRotationInternal(-a)
        }
        this.lastAngle_ = o
    }
    handleUpEvent(t) {
        return ws(t) ? (t.map.getView().endInteraction(this.duration_),
        !1) : !0
    }
    handleDownEvent(t) {
        return ws(t) && el(t) && this.condition_(t) ? (t.map.getView().beginInteraction(),
        this.lastAngle_ = void 0,
        !0) : !1
    }
}
const wu = Eu;
class Su extends ar {
    constructor(t) {
        super(),
        this.geometry_ = null,
        this.element_ = document.createElement("div"),
        this.element_.style.position = "absolute",
        this.element_.style.pointerEvents = "auto",
        this.element_.className = "ol-box " + t,
        this.map_ = null,
        this.startPixel_ = null,
        this.endPixel_ = null
    }
    disposeInternal() {
        this.setMap(null)
    }
    render_() {
        const t = this.startPixel_
          , e = this.endPixel_
          , i = "px"
          , n = this.element_.style;
        n.left = Math.min(t[0], e[0]) + i,
        n.top = Math.min(t[1], e[1]) + i,
        n.width = Math.abs(e[0] - t[0]) + i,
        n.height = Math.abs(e[1] - t[1]) + i
    }
    setMap(t) {
        if (this.map_) {
            this.map_.getOverlayContainer().removeChild(this.element_);
            const e = this.element_.style;
            e.left = "inherit",
            e.top = "inherit",
            e.width = "inherit",
            e.height = "inherit"
        }
        this.map_ = t,
        this.map_ && this.map_.getOverlayContainer().appendChild(this.element_)
    }
    setPixels(t, e) {
        this.startPixel_ = t,
        this.endPixel_ = e,
        this.createOrUpdateGeometry(),
        this.render_()
    }
    createOrUpdateGeometry() {
        const t = this.startPixel_
          , e = this.endPixel_
          , n = [t, [t[0], e[1]], e, [e[0], t[1]]].map(this.map_.getCoordinateFromPixelInternal, this.map_);
        n[4] = n[0].slice(),
        this.geometry_ ? this.geometry_.setCoordinates([n]) : this.geometry_ = new Ir([n])
    }
    getGeometry() {
        return this.geometry_
    }
}
const Cu = Su
  , En = {
    BOXSTART: "boxstart",
    BOXDRAG: "boxdrag",
    BOXEND: "boxend",
    BOXCANCEL: "boxcancel"
};
class Ss extends _e {
    constructor(t, e, i) {
        super(t),
        this.coordinate = e,
        this.mapBrowserEvent = i
    }
}
class Tu extends Ci {
    constructor(t) {
        super(),
        this.on,
        this.once,
        this.un,
        t = t || {},
        this.box_ = new Cu(t.className || "ol-dragbox"),
        this.minArea_ = t.minArea !== void 0 ? t.minArea : 64,
        t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd),
        this.startPixel_ = null,
        this.condition_ = t.condition ? t.condition : el,
        this.boxEndCondition_ = t.boxEndCondition ? t.boxEndCondition : this.defaultBoxEndCondition
    }
    defaultBoxEndCondition(t, e, i) {
        const n = i[0] - e[0]
          , r = i[1] - e[1];
        return n * n + r * r >= this.minArea_
    }
    getGeometry() {
        return this.box_.getGeometry()
    }
    handleDragEvent(t) {
        this.box_.setPixels(this.startPixel_, t.pixel),
        this.dispatchEvent(new Ss(En.BOXDRAG,t.coordinate,t))
    }
    handleUpEvent(t) {
        this.box_.setMap(null);
        const e = this.boxEndCondition_(t, this.startPixel_, t.pixel);
        return e && this.onBoxEnd(t),
        this.dispatchEvent(new Ss(e ? En.BOXEND : En.BOXCANCEL,t.coordinate,t)),
        !1
    }
    handleDownEvent(t) {
        return this.condition_(t) ? (this.startPixel_ = t.pixel,
        this.box_.setMap(t.map),
        this.box_.setPixels(this.startPixel_, this.startPixel_),
        this.dispatchEvent(new Ss(En.BOXSTART,t.coordinate,t)),
        !0) : !1
    }
    onBoxEnd(t) {}
}
const Ru = Tu;
class Iu extends Ru {
    constructor(t) {
        t = t || {};
        const e = t.condition ? t.condition : mu;
        super({
            condition: e,
            className: t.className || "ol-dragzoom",
            minArea: t.minArea
        }),
        this.duration_ = t.duration !== void 0 ? t.duration : 200,
        this.out_ = t.out !== void 0 ? t.out : !1
    }
    onBoxEnd(t) {
        const i = this.getMap().getView();
        let n = this.getGeometry();
        if (this.out_) {
            const r = i.rotatedExtentForGeometry(n)
              , o = i.getResolutionForExtentInternal(r)
              , a = i.getResolution() / o;
            n = n.clone(),
            n.scale(a * a)
        }
        i.fitInternal(n, {
            duration: this.duration_,
            easing: wi
        })
    }
}
const Lu = Iu
  , Oe = {
    LEFT: "ArrowLeft",
    UP: "ArrowUp",
    RIGHT: "ArrowRight",
    DOWN: "ArrowDown"
};
class Mu extends nn {
    constructor(t) {
        super(),
        t = t || {},
        this.defaultCondition_ = function(e) {
            return il(e) && nl(e)
        }
        ,
        this.condition_ = t.condition !== void 0 ? t.condition : this.defaultCondition_,
        this.duration_ = t.duration !== void 0 ? t.duration : 100,
        this.pixelDelta_ = t.pixelDelta !== void 0 ? t.pixelDelta : 128
    }
    handleEvent(t) {
        let e = !1;
        if (t.type == G.KEYDOWN) {
            const i = t.originalEvent
              , n = i.key;
            if (this.condition_(t) && (n == Oe.DOWN || n == Oe.LEFT || n == Oe.RIGHT || n == Oe.UP)) {
                const o = t.map.getView()
                  , a = o.getResolution() * this.pixelDelta_;
                let l = 0
                  , h = 0;
                n == Oe.DOWN ? h = -a : n == Oe.LEFT ? l = -a : n == Oe.RIGHT ? l = a : h = a;
                const c = [l, h];
                fr(c, o.getRotation()),
                hu(o, c, this.duration_),
                i.preventDefault(),
                e = !0
            }
        }
        return !e
    }
}
const vu = Mu;
class bu extends nn {
    constructor(t) {
        super(),
        t = t || {},
        this.condition_ = t.condition ? t.condition : nl,
        this.delta_ = t.delta ? t.delta : 1,
        this.duration_ = t.duration !== void 0 ? t.duration : 100
    }
    handleEvent(t) {
        let e = !1;
        if (t.type == G.KEYDOWN || t.type == G.KEYPRESS) {
            const i = t.originalEvent
              , n = i.key;
            if (this.condition_(t) && (n === "+" || n === "-")) {
                const r = t.map
                  , o = n === "+" ? this.delta_ : -this.delta_
                  , a = r.getView();
                br(a, o, void 0, this.duration_),
                i.preventDefault(),
                e = !0
            }
        }
        return !e
    }
}
const Pu = bu;
class ku {
    constructor(t, e, i) {
        this.decay_ = t,
        this.minVelocity_ = e,
        this.delay_ = i,
        this.points_ = [],
        this.angle_ = 0,
        this.initialVelocity_ = 0
    }
    begin() {
        this.points_.length = 0,
        this.angle_ = 0,
        this.initialVelocity_ = 0
    }
    update(t, e) {
        this.points_.push(t, e, Date.now())
    }
    end() {
        if (this.points_.length < 6)
            return !1;
        const t = Date.now() - this.delay_
          , e = this.points_.length - 3;
        if (this.points_[e + 2] < t)
            return !1;
        let i = e - 3;
        for (; i > 0 && this.points_[i + 2] > t; )
            i -= 3;
        const n = this.points_[e + 2] - this.points_[i + 2];
        if (n < 1e3 / 60)
            return !1;
        const r = this.points_[e] - this.points_[i]
          , o = this.points_[e + 1] - this.points_[i + 1];
        return this.angle_ = Math.atan2(o, r),
        this.initialVelocity_ = Math.sqrt(r * r + o * o) / n,
        this.initialVelocity_ > this.minVelocity_
    }
    getDistance() {
        return (this.minVelocity_ - this.initialVelocity_) / this.decay_
    }
    getAngle() {
        return this.angle_
    }
}
const Au = ku;
class Ou extends nn {
    constructor(t) {
        t = t || {},
        super(t),
        this.totalDelta_ = 0,
        this.lastDelta_ = 0,
        this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1,
        this.duration_ = t.duration !== void 0 ? t.duration : 250,
        this.timeout_ = t.timeout !== void 0 ? t.timeout : 80,
        this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0,
        this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
        const e = t.condition ? t.condition : _u;
        this.condition_ = t.onFocusOnly ? Hs(tl, e) : e,
        this.lastAnchor_ = null,
        this.startTime_ = void 0,
        this.timeoutId_,
        this.mode_ = void 0,
        this.trackpadEventGap_ = 400,
        this.trackpadTimeoutId_,
        this.deltaPerZoom_ = 300
    }
    endInteraction_() {
        this.trackpadTimeoutId_ = void 0;
        const t = this.getMap();
        if (!t)
            return;
        t.getView().endInteraction(void 0, this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0, this.lastAnchor_)
    }
    handleEvent(t) {
        if (!this.condition_(t) || t.type !== G.WHEEL)
            return !0;
        const i = t.map
          , n = t.originalEvent;
        n.preventDefault(),
        this.useAnchor_ && (this.lastAnchor_ = t.coordinate);
        let r;
        if (t.type == G.WHEEL && (r = n.deltaY,
        Kl && n.deltaMode === WheelEvent.DOM_DELTA_PIXEL && (r /= rr),
        n.deltaMode === WheelEvent.DOM_DELTA_LINE && (r *= 40)),
        r === 0)
            return !1;
        this.lastDelta_ = r;
        const o = Date.now();
        this.startTime_ === void 0 && (this.startTime_ = o),
        (!this.mode_ || o - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(r) < 4 ? "trackpad" : "wheel");
        const a = i.getView();
        if (this.mode_ === "trackpad" && !(a.getConstrainResolution() || this.constrainResolution_))
            return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (a.getAnimating() && a.cancelAnimations(),
            a.beginInteraction()),
            this.trackpadTimeoutId_ = setTimeout(this.endInteraction_.bind(this), this.timeout_),
            a.adjustZoom(-r / this.deltaPerZoom_, this.lastAnchor_),
            this.startTime_ = o,
            !1;
        this.totalDelta_ += r;
        const l = Math.max(this.timeout_ - (o - this.startTime_), 0);
        return clearTimeout(this.timeoutId_),
        this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, i), l),
        !1
    }
    handleWheelZoom_(t) {
        const e = t.getView();
        e.getAnimating() && e.cancelAnimations();
        let i = -N(this.totalDelta_, -this.maxDelta_ * this.deltaPerZoom_, this.maxDelta_ * this.deltaPerZoom_) / this.deltaPerZoom_;
        (e.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0),
        br(e, i, this.lastAnchor_, this.duration_),
        this.mode_ = void 0,
        this.totalDelta_ = 0,
        this.lastAnchor_ = null,
        this.startTime_ = void 0,
        this.timeoutId_ = void 0
    }
    setMouseAnchor(t) {
        this.useAnchor_ = t,
        t || (this.lastAnchor_ = null)
    }
}
const Fu = Ou;
class Du extends Ci {
    constructor(t) {
        t = t || {};
        const e = t;
        e.stopDown || (e.stopDown = Jn),
        super(e),
        this.anchor_ = null,
        this.lastAngle_ = void 0,
        this.rotating_ = !1,
        this.rotationDelta_ = 0,
        this.threshold_ = t.threshold !== void 0 ? t.threshold : .3,
        this.duration_ = t.duration !== void 0 ? t.duration : 250
    }
    handleDragEvent(t) {
        let e = 0;
        const i = this.targetPointers[0]
          , n = this.targetPointers[1]
          , r = Math.atan2(n.clientY - i.clientY, n.clientX - i.clientX);
        if (this.lastAngle_ !== void 0) {
            const l = r - this.lastAngle_;
            this.rotationDelta_ += l,
            !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0),
            e = l
        }
        this.lastAngle_ = r;
        const o = t.map
          , a = o.getView();
        a.getConstraints().rotation !== Er && (this.anchor_ = o.getCoordinateFromPixelInternal(o.getEventPixel(Pr(this.targetPointers))),
        this.rotating_ && (o.render(),
        a.adjustRotationInternal(e, this.anchor_)))
    }
    handleUpEvent(t) {
        return this.targetPointers.length < 2 ? (t.map.getView().endInteraction(this.duration_),
        !1) : !0
    }
    handleDownEvent(t) {
        if (this.targetPointers.length >= 2) {
            const e = t.map;
            return this.anchor_ = null,
            this.lastAngle_ = void 0,
            this.rotating_ = !1,
            this.rotationDelta_ = 0,
            this.handlingDownUpSequence || e.getView().beginInteraction(),
            !0
        }
        return !1
    }
}
const sl = Du;
class Nu extends Ci {
    constructor(t) {
        t = t || {};
        const e = t;
        e.stopDown || (e.stopDown = Jn),
        super(e),
        this.anchor_ = null,
        this.duration_ = t.duration !== void 0 ? t.duration : 400,
        this.lastDistance_ = void 0,
        this.lastScaleDelta_ = 1
    }
    handleDragEvent(t) {
        let e = 1;
        const i = this.targetPointers[0]
          , n = this.targetPointers[1]
          , r = i.clientX - n.clientX
          , o = i.clientY - n.clientY
          , a = Math.sqrt(r * r + o * o);
        this.lastDistance_ !== void 0 && (e = this.lastDistance_ / a),
        this.lastDistance_ = a;
        const l = t.map
          , h = l.getView();
        e != 1 && (this.lastScaleDelta_ = e),
        this.anchor_ = l.getCoordinateFromPixelInternal(l.getEventPixel(Pr(this.targetPointers))),
        l.render(),
        h.adjustResolutionInternal(e, this.anchor_)
    }
    handleUpEvent(t) {
        if (this.targetPointers.length < 2) {
            const i = t.map.getView()
              , n = this.lastScaleDelta_ > 1 ? 1 : -1;
            return i.endInteraction(this.duration_, n),
            !1
        }
        return !0
    }
    handleDownEvent(t) {
        if (this.targetPointers.length >= 2) {
            const e = t.map;
            return this.anchor_ = null,
            this.lastDistance_ = void 0,
            this.lastScaleDelta_ = 1,
            this.handlingDownUpSequence || e.getView().beginInteraction(),
            !0
        }
        return !1
    }
}
const Gu = Nu;
function zu(s) {
    s = s || {};
    const t = new Xt
      , e = new Au(-.005,.05,100);
    return (s.altShiftDragRotate !== void 0 ? s.altShiftDragRotate : !0) && t.push(new wu),
    (s.doubleClickZoom !== void 0 ? s.doubleClickZoom : !0) && t.push(new uu({
        delta: s.zoomDelta,
        duration: s.zoomDuration
    })),
    (s.dragPan !== void 0 ? s.dragPan : !0) && t.push(new xu({
        onFocusOnly: s.onFocusOnly,
        kinetic: e
    })),
    (s.pinchRotate !== void 0 ? s.pinchRotate : !0) && t.push(new sl),
    (s.pinchZoom !== void 0 ? s.pinchZoom : !0) && t.push(new Gu({
        duration: s.zoomDuration
    })),
    (s.keyboard !== void 0 ? s.keyboard : !0) && (t.push(new vu),
    t.push(new Pu({
        delta: s.zoomDelta,
        duration: s.zoomDuration
    }))),
    (s.mouseWheelZoom !== void 0 ? s.mouseWheelZoom : !0) && t.push(new Fu({
        onFocusOnly: s.onFocusOnly,
        duration: s.zoomDuration
    })),
    (s.shiftDragZoom !== void 0 ? s.shiftDragZoom : !0) && t.push(new Lu({
        duration: s.zoomDuration
    })),
    t
}
function Ro(s) {
    return s[0] > 0 && s[1] > 0
}
function Wu(s, t, e) {
    return e === void 0 && (e = [0, 0]),
    e[0] = s[0] * t + .5 | 0,
    e[1] = s[1] * t + .5 | 0,
    e
}
function Ft(s, t) {
    return Array.isArray(s) ? s : (t === void 0 ? t = [s, s] : (t[0] = s,
    t[1] = s),
    t)
}
function rl(s) {
    if (s instanceof ls) {
        s.setMapInternal(null);
        return
    }
    s instanceof cs && s.getLayers().forEach(rl)
}
function ol(s, t) {
    if (s instanceof ls) {
        s.setMapInternal(t);
        return
    }
    if (s instanceof cs) {
        const e = s.getLayers().getArray();
        for (let i = 0, n = e.length; i < n; ++i)
            ol(e[i], t)
    }
}
let Xu = class extends Bt {
    constructor(t) {
        super(),
        t = t || {},
        this.on,
        this.once,
        this.un;
        const e = Yu(t);
        this.renderComplete_,
        this.loaded_ = !0,
        this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this),
        this.maxTilesLoading_ = t.maxTilesLoading !== void 0 ? t.maxTilesLoading : 16,
        this.pixelRatio_ = t.pixelRatio !== void 0 ? t.pixelRatio : rr,
        this.postRenderTimeoutHandle_,
        this.animationDelayKey_,
        this.animationDelay_ = this.animationDelay_.bind(this),
        this.coordinateToPixelTransform_ = $t(),
        this.pixelToCoordinateTransform_ = $t(),
        this.frameIndex_ = 0,
        this.frameState_ = null,
        this.previousExtent_ = null,
        this.viewPropertyListenerKey_ = null,
        this.viewChangeListenerKey_ = null,
        this.layerGroupPropertyListenerKeys_ = null,
        this.viewport_ = document.createElement("div"),
        this.viewport_.className = "ol-viewport" + ("ontouchstart"in window ? " ol-touch" : ""),
        this.viewport_.style.position = "relative",
        this.viewport_.style.overflow = "hidden",
        this.viewport_.style.width = "100%",
        this.viewport_.style.height = "100%",
        this.overlayContainer_ = document.createElement("div"),
        this.overlayContainer_.style.position = "absolute",
        this.overlayContainer_.style.zIndex = "0",
        this.overlayContainer_.style.width = "100%",
        this.overlayContainer_.style.height = "100%",
        this.overlayContainer_.style.pointerEvents = "none",
        this.overlayContainer_.className = "ol-overlaycontainer",
        this.viewport_.appendChild(this.overlayContainer_),
        this.overlayContainerStopEvent_ = document.createElement("div"),
        this.overlayContainerStopEvent_.style.position = "absolute",
        this.overlayContainerStopEvent_.style.zIndex = "0",
        this.overlayContainerStopEvent_.style.width = "100%",
        this.overlayContainerStopEvent_.style.height = "100%",
        this.overlayContainerStopEvent_.style.pointerEvents = "none",
        this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent",
        this.viewport_.appendChild(this.overlayContainerStopEvent_),
        this.mapBrowserEventHandler_ = null,
        this.moveTolerance_ = t.moveTolerance,
        this.keyboardEventTarget_ = e.keyboardEventTarget,
        this.targetChangeHandlerKeys_ = null,
        this.targetElement_ = null,
        this.resizeObserver_ = new ResizeObserver(()=>this.updateSize()),
        this.controls = e.controls || Qa(),
        this.interactions = e.interactions || zu({
            onFocusOnly: !0
        }),
        this.overlays_ = e.overlays,
        this.overlayIdIndex_ = {},
        this.renderer_ = null,
        this.postRenderFunctions_ = [],
        this.tileQueue_ = new tu(this.getTilePriority.bind(this),this.handleTileChange_.bind(this)),
        this.addChangeListener(ft.LAYERGROUP, this.handleLayerGroupChanged_),
        this.addChangeListener(ft.VIEW, this.handleViewChanged_),
        this.addChangeListener(ft.SIZE, this.handleSizeChanged_),
        this.addChangeListener(ft.TARGET, this.handleTargetChanged_),
        this.setProperties(e.values);
        const i = this;
        t.view && !(t.view instanceof Ut) && t.view.then(function(n) {
            i.setView(new Ut(n))
        }),
        this.controls.addEventListener(Rt.ADD, n=>{
            n.element.setMap(this)
        }
        ),
        this.controls.addEventListener(Rt.REMOVE, n=>{
            n.element.setMap(null)
        }
        ),
        this.interactions.addEventListener(Rt.ADD, n=>{
            n.element.setMap(this)
        }
        ),
        this.interactions.addEventListener(Rt.REMOVE, n=>{
            n.element.setMap(null)
        }
        ),
        this.overlays_.addEventListener(Rt.ADD, n=>{
            this.addOverlayInternal_(n.element)
        }
        ),
        this.overlays_.addEventListener(Rt.REMOVE, n=>{
            const r = n.element.getId();
            r !== void 0 && delete this.overlayIdIndex_[r.toString()],
            n.element.setMap(null)
        }
        ),
        this.controls.forEach(n=>{
            n.setMap(this)
        }
        ),
        this.interactions.forEach(n=>{
            n.setMap(this)
        }
        ),
        this.overlays_.forEach(this.addOverlayInternal_.bind(this))
    }
    addControl(t) {
        this.getControls().push(t)
    }
    addInteraction(t) {
        this.getInteractions().push(t)
    }
    addLayer(t) {
        this.getLayerGroup().getLayers().push(t)
    }
    handleLayerAdd_(t) {
        ol(t.layer, this)
    }
    addOverlay(t) {
        this.getOverlays().push(t)
    }
    addOverlayInternal_(t) {
        const e = t.getId();
        e !== void 0 && (this.overlayIdIndex_[e.toString()] = t),
        t.setMap(this)
    }
    disposeInternal() {
        this.controls.clear(),
        this.interactions.clear(),
        this.overlays_.clear(),
        this.resizeObserver_.disconnect(),
        this.setTarget(null),
        super.disposeInternal()
    }
    forEachFeatureAtPixel(t, e, i) {
        if (!this.frameState_ || !this.renderer_)
            return;
        const n = this.getCoordinateFromPixelInternal(t);
        i = i !== void 0 ? i : {};
        const r = i.hitTolerance !== void 0 ? i.hitTolerance : 0
          , o = i.layerFilter !== void 0 ? i.layerFilter : Di
          , a = i.checkWrapped !== !1;
        return this.renderer_.forEachFeatureAtCoordinate(n, this.frameState_, r, a, e, null, o, null)
    }
    getFeaturesAtPixel(t, e) {
        const i = [];
        return this.forEachFeatureAtPixel(t, function(n) {
            i.push(n)
        }, e),
        i
    }
    getAllLayers() {
        const t = [];
        function e(i) {
            i.forEach(function(n) {
                n instanceof cs ? e(n.getLayers()) : t.push(n)
            })
        }
        return e(this.getLayers()),
        t
    }
    hasFeatureAtPixel(t, e) {
        if (!this.frameState_ || !this.renderer_)
            return !1;
        const i = this.getCoordinateFromPixelInternal(t);
        e = e !== void 0 ? e : {};
        const n = e.layerFilter !== void 0 ? e.layerFilter : Di
          , r = e.hitTolerance !== void 0 ? e.hitTolerance : 0
          , o = e.checkWrapped !== !1;
        return this.renderer_.hasFeatureAtCoordinate(i, this.frameState_, r, o, n, null)
    }
    getEventCoordinate(t) {
        return this.getCoordinateFromPixel(this.getEventPixel(t))
    }
    getEventCoordinateInternal(t) {
        return this.getCoordinateFromPixelInternal(this.getEventPixel(t))
    }
    getEventPixel(t) {
        const i = this.viewport_.getBoundingClientRect()
          , n = this.getSize()
          , r = i.width / n[0]
          , o = i.height / n[1]
          , a = "changedTouches"in t ? t.changedTouches[0] : t;
        return [(a.clientX - i.left) / r, (a.clientY - i.top) / o]
    }
    getTarget() {
        return this.get(ft.TARGET)
    }
    getTargetElement() {
        return this.targetElement_
    }
    getCoordinateFromPixel(t) {
        return Us(this.getCoordinateFromPixelInternal(t), this.getView().getProjection())
    }
    getCoordinateFromPixelInternal(t) {
        const e = this.frameState_;
        return e ? ht(e.pixelToCoordinateTransform, t.slice()) : null
    }
    getControls() {
        return this.controls
    }
    getOverlays() {
        return this.overlays_
    }
    getOverlayById(t) {
        const e = this.overlayIdIndex_[t.toString()];
        return e !== void 0 ? e : null
    }
    getInteractions() {
        return this.interactions
    }
    getLayerGroup() {
        return this.get(ft.LAYERGROUP)
    }
    setLayers(t) {
        const e = this.getLayerGroup();
        if (t instanceof Xt) {
            e.setLayers(t);
            return
        }
        const i = e.getLayers();
        i.clear(),
        i.extend(t)
    }
    getLayers() {
        return this.getLayerGroup().getLayers()
    }
    getLoadingOrNotReady() {
        const t = this.getLayerGroup().getLayerStatesArray();
        for (let e = 0, i = t.length; e < i; ++e) {
            const n = t[e];
            if (!n.visible)
                continue;
            const r = n.layer.getRenderer();
            if (r && !r.ready)
                return !0;
            const o = n.layer.getSource();
            if (o && o.loading)
                return !0
        }
        return !1
    }
    getPixelFromCoordinate(t) {
        const e = oe(t, this.getView().getProjection());
        return this.getPixelFromCoordinateInternal(e)
    }
    getPixelFromCoordinateInternal(t) {
        const e = this.frameState_;
        return e ? ht(e.coordinateToPixelTransform, t.slice(0, 2)) : null
    }
    getRenderer() {
        return this.renderer_
    }
    getSize() {
        return this.get(ft.SIZE)
    }
    getView() {
        return this.get(ft.VIEW)
    }
    getViewport() {
        return this.viewport_
    }
    getOverlayContainer() {
        return this.overlayContainer_
    }
    getOverlayContainerStopEvent() {
        return this.overlayContainerStopEvent_
    }
    getOwnerDocument() {
        const t = this.getTargetElement();
        return t ? t.ownerDocument : document
    }
    getTilePriority(t, e, i, n) {
        return eu(this.frameState_, t, e, i, n)
    }
    handleBrowserEvent(t, e) {
        e = e || t.type;
        const i = new Te(e,this,t);
        this.handleMapBrowserEvent(i)
    }
    handleMapBrowserEvent(t) {
        if (!this.frameState_)
            return;
        const e = t.originalEvent
          , i = e.type;
        if (i === Ui.POINTERDOWN || i === G.WHEEL || i === G.KEYDOWN) {
            const n = this.getOwnerDocument()
              , r = this.viewport_.getRootNode ? this.viewport_.getRootNode() : n
              , o = e.target;
            if (this.overlayContainerStopEvent_.contains(o) || !(r === n ? n.documentElement : r).contains(o))
                return
        }
        if (t.frameState = this.frameState_,
        this.dispatchEvent(t) !== !1) {
            const n = this.getInteractions().getArray().slice();
            for (let r = n.length - 1; r >= 0; r--) {
                const o = n[r];
                if (o.getMap() !== this || !o.getActive() || !this.getTargetElement())
                    continue;
                if (!o.handleEvent(t) || t.propagationStopped)
                    break
            }
        }
    }
    handlePostRender() {
        const t = this.frameState_
          , e = this.tileQueue_;
        if (!e.isEmpty()) {
            let n = this.maxTilesLoading_
              , r = n;
            if (t) {
                const o = t.viewHints;
                if (o[gt.ANIMATING] || o[gt.INTERACTING]) {
                    const a = Date.now() - t.time > 8;
                    n = a ? 0 : 8,
                    r = a ? 0 : 2
                }
            }
            e.getTilesLoading() < n && (e.reprioritize(),
            e.loadMoreTiles(n, r))
        }
        t && this.renderer_ && !t.animate && (this.renderComplete_ === !0 ? (this.hasListener(de.RENDERCOMPLETE) && this.renderer_.dispatchRenderEvent(de.RENDERCOMPLETE, t),
        this.loaded_ === !1 && (this.loaded_ = !0,
        this.dispatchEvent(new ai(le.LOADEND,this,t)))) : this.loaded_ === !0 && (this.loaded_ = !1,
        this.dispatchEvent(new ai(le.LOADSTART,this,t))));
        const i = this.postRenderFunctions_;
        for (let n = 0, r = i.length; n < r; ++n)
            i[n](this, t);
        i.length = 0
    }
    handleSizeChanged_() {
        this.getView() && !this.getView().getAnimating() && this.getView().resolveConstraints(0),
        this.render()
    }
    handleTargetChanged_() {
        if (this.mapBrowserEventHandler_) {
            for (let i = 0, n = this.targetChangeHandlerKeys_.length; i < n; ++i)
                et(this.targetChangeHandlerKeys_[i]);
            this.targetChangeHandlerKeys_ = null,
            this.viewport_.removeEventListener(G.CONTEXTMENU, this.boundHandleBrowserEvent_),
            this.viewport_.removeEventListener(G.WHEEL, this.boundHandleBrowserEvent_),
            this.mapBrowserEventHandler_.dispose(),
            this.mapBrowserEventHandler_ = null,
            Zn(this.viewport_)
        }
        if (this.targetElement_) {
            this.resizeObserver_.unobserve(this.targetElement_);
            const i = this.targetElement_.getRootNode();
            i instanceof ShadowRoot && this.resizeObserver_.unobserve(i.host),
            this.setSize(void 0)
        }
        const t = this.getTarget()
          , e = typeof t == "string" ? document.getElementById(t) : t;
        if (this.targetElement_ = e,
        !e)
            this.renderer_ && (clearTimeout(this.postRenderTimeoutHandle_),
            this.postRenderTimeoutHandle_ = void 0,
            this.postRenderFunctions_.length = 0,
            this.renderer_.dispose(),
            this.renderer_ = null),
            this.animationDelayKey_ && (cancelAnimationFrame(this.animationDelayKey_),
            this.animationDelayKey_ = void 0);
        else {
            e.appendChild(this.viewport_),
            this.renderer_ || (this.renderer_ = new Uc(this)),
            this.mapBrowserEventHandler_ = new $c(this,this.moveTolerance_);
            for (const r in st)
                this.mapBrowserEventHandler_.addEventListener(st[r], this.handleMapBrowserEvent.bind(this));
            this.viewport_.addEventListener(G.CONTEXTMENU, this.boundHandleBrowserEvent_, !1),
            this.viewport_.addEventListener(G.WHEEL, this.boundHandleBrowserEvent_, ya ? {
                passive: !1
            } : !1);
            const i = this.keyboardEventTarget_ ? this.keyboardEventTarget_ : e;
            this.targetChangeHandlerKeys_ = [Y(i, G.KEYDOWN, this.handleBrowserEvent, this), Y(i, G.KEYPRESS, this.handleBrowserEvent, this)];
            const n = e.getRootNode();
            n instanceof ShadowRoot && this.resizeObserver_.observe(n.host),
            this.resizeObserver_.observe(e)
        }
        this.updateSize()
    }
    handleTileChange_() {
        this.render()
    }
    handleViewPropertyChanged_() {
        this.render()
    }
    handleViewChanged_() {
        this.viewPropertyListenerKey_ && (et(this.viewPropertyListenerKey_),
        this.viewPropertyListenerKey_ = null),
        this.viewChangeListenerKey_ && (et(this.viewChangeListenerKey_),
        this.viewChangeListenerKey_ = null);
        const t = this.getView();
        t && (this.updateViewportSize_(),
        this.viewPropertyListenerKey_ = Y(t, mi.PROPERTYCHANGE, this.handleViewPropertyChanged_, this),
        this.viewChangeListenerKey_ = Y(t, G.CHANGE, this.handleViewPropertyChanged_, this),
        t.resolveConstraints(0)),
        this.render()
    }
    handleLayerGroupChanged_() {
        this.layerGroupPropertyListenerKeys_ && (this.layerGroupPropertyListenerKeys_.forEach(et),
        this.layerGroupPropertyListenerKeys_ = null);
        const t = this.getLayerGroup();
        t && (this.handleLayerAdd_(new Re("addlayer",t)),
        this.layerGroupPropertyListenerKeys_ = [Y(t, mi.PROPERTYCHANGE, this.render, this), Y(t, G.CHANGE, this.render, this), Y(t, "addlayer", this.handleLayerAdd_, this), Y(t, "removelayer", this.handleLayerRemove_, this)]),
        this.render()
    }
    isRendered() {
        return !!this.frameState_
    }
    animationDelay_() {
        this.animationDelayKey_ = void 0,
        this.renderFrame_(Date.now())
    }
    renderSync() {
        this.animationDelayKey_ && cancelAnimationFrame(this.animationDelayKey_),
        this.animationDelay_()
    }
    redrawText() {
        const t = this.getLayerGroup().getLayerStatesArray();
        for (let e = 0, i = t.length; e < i; ++e) {
            const n = t[e].layer;
            n.hasRenderer() && n.getRenderer().handleFontsChanged()
        }
    }
    render() {
        this.renderer_ && this.animationDelayKey_ === void 0 && (this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_))
    }
    removeControl(t) {
        return this.getControls().remove(t)
    }
    removeInteraction(t) {
        return this.getInteractions().remove(t)
    }
    removeLayer(t) {
        return this.getLayerGroup().getLayers().remove(t)
    }
    handleLayerRemove_(t) {
        rl(t.layer)
    }
    removeOverlay(t) {
        return this.getOverlays().remove(t)
    }
    renderFrame_(t) {
        const e = this.getSize()
          , i = this.getView()
          , n = this.frameState_;
        let r = null;
        if (e !== void 0 && Ro(e) && i && i.isDef()) {
            const o = i.getHints(this.frameState_ ? this.frameState_.viewHints : void 0)
              , a = i.getState();
            if (r = {
                animate: !1,
                coordinateToPixelTransform: this.coordinateToPixelTransform_,
                declutterTree: null,
                extent: Xs(a.center, a.resolution, a.rotation, e),
                index: this.frameIndex_++,
                layerIndex: 0,
                layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
                pixelRatio: this.pixelRatio_,
                pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
                postRenderFunctions: [],
                size: e,
                tileQueue: this.tileQueue_,
                time: t,
                usedTiles: {},
                viewState: a,
                viewHints: o,
                wantedTiles: {},
                mapId: U(this),
                renderTargets: {}
            },
            a.nextCenter && a.nextResolution) {
                const l = isNaN(a.nextRotation) ? a.rotation : a.nextRotation;
                r.nextExtent = Xs(a.nextCenter, a.nextResolution, l, e)
            }
        }
        this.frameState_ = r,
        this.renderer_.renderFrame(r),
        r && (r.animate && this.render(),
        Array.prototype.push.apply(this.postRenderFunctions_, r.postRenderFunctions),
        n && (!this.previousExtent_ || !Ji(this.previousExtent_) && !yi(r.extent, this.previousExtent_)) && (this.dispatchEvent(new ai(le.MOVESTART,this,n)),
        this.previousExtent_ = qi(this.previousExtent_)),
        this.previousExtent_ && !r.viewHints[gt.ANIMATING] && !r.viewHints[gt.INTERACTING] && !yi(r.extent, this.previousExtent_) && (this.dispatchEvent(new ai(le.MOVEEND,this,r)),
        Sa(r.extent, this.previousExtent_))),
        this.dispatchEvent(new ai(le.POSTRENDER,this,r)),
        this.renderComplete_ = this.hasListener(le.LOADSTART) || this.hasListener(le.LOADEND) || this.hasListener(de.RENDERCOMPLETE) ? !this.tileQueue_.getTilesLoading() && !this.tileQueue_.getCount() && !this.getLoadingOrNotReady() : void 0,
        this.postRenderTimeoutHandle_ || (this.postRenderTimeoutHandle_ = setTimeout(()=>{
            this.postRenderTimeoutHandle_ = void 0,
            this.handlePostRender()
        }
        , 0))
    }
    setLayerGroup(t) {
        const e = this.getLayerGroup();
        e && this.handleLayerRemove_(new Re("removelayer",e)),
        this.set(ft.LAYERGROUP, t)
    }
    setSize(t) {
        this.set(ft.SIZE, t)
    }
    setTarget(t) {
        this.set(ft.TARGET, t)
    }
    setView(t) {
        if (!t || t instanceof Ut) {
            this.set(ft.VIEW, t);
            return
        }
        this.set(ft.VIEW, new Ut);
        const e = this;
        t.then(function(i) {
            e.setView(new Ut(i))
        })
    }
    updateSize() {
        const t = this.getTargetElement();
        let e;
        if (t) {
            const n = getComputedStyle(t)
              , r = t.offsetWidth - parseFloat(n.borderLeftWidth) - parseFloat(n.paddingLeft) - parseFloat(n.paddingRight) - parseFloat(n.borderRightWidth)
              , o = t.offsetHeight - parseFloat(n.borderTopWidth) - parseFloat(n.paddingTop) - parseFloat(n.paddingBottom) - parseFloat(n.borderBottomWidth);
            !isNaN(r) && !isNaN(o) && (e = [r, o],
            !Ro(e) && (t.offsetWidth || t.offsetHeight || t.getClientRects().length) && Oa("No map visible because the map container's width or height are 0."))
        }
        const i = this.getSize();
        e && (!i || !Pe(e, i)) && (this.setSize(e),
        this.updateViewportSize_())
    }
    updateViewportSize_() {
        const t = this.getView();
        if (t) {
            let e;
            const i = getComputedStyle(this.viewport_);
            i.width && i.height && (e = [parseInt(i.width, 10), parseInt(i.height, 10)]),
            t.setViewportSize(e)
        }
    }
}
;
function Yu(s) {
    let t = null;
    s.keyboardEventTarget !== void 0 && (t = typeof s.keyboardEventTarget == "string" ? document.getElementById(s.keyboardEventTarget) : s.keyboardEventTarget);
    const e = {}
      , i = s.layers && typeof s.layers.getLayers == "function" ? s.layers : new cs({
        layers: s.layers
    });
    e[ft.LAYERGROUP] = i,
    e[ft.TARGET] = s.target,
    e[ft.VIEW] = s.view instanceof Ut ? s.view : new Ut;
    let n;
    s.controls !== void 0 && (Array.isArray(s.controls) ? n = new Xt(s.controls.slice()) : (W(typeof s.controls.getArray == "function", 47),
    n = s.controls));
    let r;
    s.interactions !== void 0 && (Array.isArray(s.interactions) ? r = new Xt(s.interactions.slice()) : (W(typeof s.interactions.getArray == "function", 48),
    r = s.interactions));
    let o;
    return s.overlays !== void 0 ? Array.isArray(s.overlays) ? o = new Xt(s.overlays.slice()) : (W(typeof s.overlays.getArray == "function", 49),
    o = s.overlays) : o = new Xt,
    {
        controls: n,
        interactions: r,
        keyboardEventTarget: t,
        overlays: o,
        values: e
    }
}
const Bu = Xu;
class kr extends Bt {
    constructor(t) {
        if (super(),
        this.on,
        this.once,
        this.un,
        this.id_ = void 0,
        this.geometryName_ = "geometry",
        this.style_ = null,
        this.styleFunction_ = void 0,
        this.geometryChangeKey_ = null,
        this.addChangeListener(this.geometryName_, this.handleGeometryChanged_),
        t)
            if (typeof t.getSimplifiedGeometry == "function") {
                const e = t;
                this.setGeometry(e)
            } else {
                const e = t;
                this.setProperties(e)
            }
    }
    clone() {
        const t = new kr(this.hasProperties() ? this.getProperties() : null);
        t.setGeometryName(this.getGeometryName());
        const e = this.getGeometry();
        e && t.setGeometry(e.clone());
        const i = this.getStyle();
        return i && t.setStyle(i),
        t
    }
    getGeometry() {
        return this.get(this.geometryName_)
    }
    getId() {
        return this.id_
    }
    getGeometryName() {
        return this.geometryName_
    }
    getStyle() {
        return this.style_
    }
    getStyleFunction() {
        return this.styleFunction_
    }
    handleGeometryChange_() {
        this.changed()
    }
    handleGeometryChanged_() {
        this.geometryChangeKey_ && (et(this.geometryChangeKey_),
        this.geometryChangeKey_ = null);
        const t = this.getGeometry();
        t && (this.geometryChangeKey_ = Y(t, G.CHANGE, this.handleGeometryChange_, this)),
        this.changed()
    }
    setGeometry(t) {
        this.set(this.geometryName_, t)
    }
    setStyle(t) {
        this.style_ = t,
        this.styleFunction_ = t ? Zu(t) : void 0,
        this.changed()
    }
    setId(t) {
        this.id_ = t,
        this.changed()
    }
    setGeometryName(t) {
        this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_),
        this.geometryName_ = t,
        this.addChangeListener(this.geometryName_, this.handleGeometryChanged_),
        this.handleGeometryChanged_()
    }
}
function Zu(s) {
    if (typeof s == "function")
        return s;
    let t;
    return Array.isArray(s) ? t = s : (W(typeof s.getZIndex == "function", 41),
    t = [s]),
    function() {
        return t
    }
}
const it = kr
  , dt = {
    ELEMENT: "element",
    MAP: "map",
    OFFSET: "offset",
    POSITION: "position",
    POSITIONING: "positioning"
};
class Vu extends Bt {
    constructor(t) {
        super(),
        this.on,
        this.once,
        this.un,
        this.options = t,
        this.id = t.id,
        this.insertFirst = t.insertFirst !== void 0 ? t.insertFirst : !0,
        this.stopEvent = t.stopEvent !== void 0 ? t.stopEvent : !0,
        this.element = document.createElement("div"),
        this.element.className = t.className !== void 0 ? t.className : "ol-overlay-container " + Fc,
        this.element.style.position = "absolute",
        this.element.style.pointerEvents = "auto",
        this.autoPan = t.autoPan === !0 ? {} : t.autoPan || void 0,
        this.rendered = {
            transform_: "",
            visible: !0
        },
        this.mapPostrenderListenerKey = null,
        this.addChangeListener(dt.ELEMENT, this.handleElementChanged),
        this.addChangeListener(dt.MAP, this.handleMapChanged),
        this.addChangeListener(dt.OFFSET, this.handleOffsetChanged),
        this.addChangeListener(dt.POSITION, this.handlePositionChanged),
        this.addChangeListener(dt.POSITIONING, this.handlePositioningChanged),
        t.element !== void 0 && this.setElement(t.element),
        this.setOffset(t.offset !== void 0 ? t.offset : [0, 0]),
        this.setPositioning(t.positioning || "top-left"),
        t.position !== void 0 && this.setPosition(t.position)
    }
    getElement() {
        return this.get(dt.ELEMENT)
    }
    getId() {
        return this.id
    }
    getMap() {
        return this.get(dt.MAP) || null
    }
    getOffset() {
        return this.get(dt.OFFSET)
    }
    getPosition() {
        return this.get(dt.POSITION)
    }
    getPositioning() {
        return this.get(dt.POSITIONING)
    }
    handleElementChanged() {
        Ha(this.element);
        const t = this.getElement();
        t && this.element.appendChild(t)
    }
    handleMapChanged() {
        this.mapPostrenderListenerKey && (Zn(this.element),
        et(this.mapPostrenderListenerKey),
        this.mapPostrenderListenerKey = null);
        const t = this.getMap();
        if (t) {
            this.mapPostrenderListenerKey = Y(t, le.POSTRENDER, this.render, this),
            this.updatePixelPosition();
            const e = this.stopEvent ? t.getOverlayContainerStopEvent() : t.getOverlayContainer();
            this.insertFirst ? e.insertBefore(this.element, e.childNodes[0] || null) : e.appendChild(this.element),
            this.performAutoPan()
        }
    }
    render() {
        this.updatePixelPosition()
    }
    handleOffsetChanged() {
        this.updatePixelPosition()
    }
    handlePositionChanged() {
        this.updatePixelPosition(),
        this.performAutoPan()
    }
    handlePositioningChanged() {
        this.updatePixelPosition()
    }
    setElement(t) {
        this.set(dt.ELEMENT, t)
    }
    setMap(t) {
        this.set(dt.MAP, t)
    }
    setOffset(t) {
        this.set(dt.OFFSET, t)
    }
    setPosition(t) {
        this.set(dt.POSITION, t)
    }
    performAutoPan() {
        this.autoPan && this.panIntoView(this.autoPan)
    }
    panIntoView(t) {
        const e = this.getMap();
        if (!e || !e.getTargetElement() || !this.get(dt.POSITION))
            return;
        const i = this.getRect(e.getTargetElement(), e.getSize())
          , n = this.getElement()
          , r = this.getRect(n, [Nc(n), Gc(n)]);
        t = t || {};
        const o = t.margin === void 0 ? 20 : t.margin;
        if (!ce(i, r)) {
            const a = r[0] - i[0]
              , l = i[2] - r[2]
              , h = r[1] - i[1]
              , c = i[3] - r[3]
              , u = [0, 0];
            if (a < 0 ? u[0] = a - o : l < 0 && (u[0] = Math.abs(l) + o),
            h < 0 ? u[1] = h - o : c < 0 && (u[1] = Math.abs(c) + o),
            u[0] !== 0 || u[1] !== 0) {
                const d = e.getView().getCenterInternal()
                  , f = e.getPixelFromCoordinateInternal(d);
                if (!f)
                    return;
                const g = [f[0] + u[0], f[1] + u[1]]
                  , _ = t.animation || {};
                e.getView().animateInternal({
                    center: e.getCoordinateFromPixelInternal(g),
                    duration: _.duration,
                    easing: _.easing
                })
            }
        }
    }
    getRect(t, e) {
        const i = t.getBoundingClientRect()
          , n = i.left + window.pageXOffset
          , r = i.top + window.pageYOffset;
        return [n, r, n + e[0], r + e[1]]
    }
    setPositioning(t) {
        this.set(dt.POSITIONING, t)
    }
    setVisible(t) {
        this.rendered.visible !== t && (this.element.style.display = t ? "" : "none",
        this.rendered.visible = t)
    }
    updatePixelPosition() {
        const t = this.getMap()
          , e = this.getPosition();
        if (!t || !t.isRendered() || !e) {
            this.setVisible(!1);
            return
        }
        const i = t.getPixelFromCoordinate(e)
          , n = t.getSize();
        this.updateRenderedPosition(i, n)
    }
    updateRenderedPosition(t, e) {
        const i = this.element.style
          , n = this.getOffset()
          , r = this.getPositioning();
        this.setVisible(!0);
        const o = Math.round(t[0] + n[0]) + "px"
          , a = Math.round(t[1] + n[1]) + "px";
        let l = "0%"
          , h = "0%";
        r == "bottom-right" || r == "center-right" || r == "top-right" ? l = "-100%" : (r == "bottom-center" || r == "center-center" || r == "top-center") && (l = "-50%"),
        r == "bottom-left" || r == "bottom-center" || r == "bottom-right" ? h = "-100%" : (r == "center-left" || r == "center-center" || r == "center-right") && (h = "-50%");
        const c = `translate(${l}, ${h}) translate(${o}, ${a})`;
        this.rendered.transform_ != c && (this.rendered.transform_ = c,
        i.transform = c)
    }
    getOptions() {
        return this.options
    }
}
const Uu = Vu;
function al(s, t, e, i, n, r, o) {
    let a, l;
    const h = (e - t) / i;
    if (h === 1)
        a = t;
    else if (h === 2)
        a = t,
        l = n;
    else if (h !== 0) {
        let c = s[t]
          , u = s[t + 1]
          , d = 0;
        const f = [0];
        for (let m = t + i; m < e; m += i) {
            const p = s[m]
              , y = s[m + 1];
            d += Math.sqrt((p - c) * (p - c) + (y - u) * (y - u)),
            f.push(d),
            c = p,
            u = y
        }
        const g = n * d
          , _ = th(f, g);
        _ < 0 ? (l = (g - f[-_ - 2]) / (f[-_ - 1] - f[-_ - 2]),
        a = t + (-_ - 2) * i) : a = t + _ * i
    }
    o = o > 1 ? o : 2,
    r = r || new Array(o);
    for (let c = 0; c < o; ++c)
        r[c] = a === void 0 ? NaN : l === void 0 ? s[a + c] : vt(s[a + c], s[a + i + c], l);
    return r
}
function $s(s, t, e, i, n, r) {
    if (e == t)
        return null;
    let o;
    if (n < s[t + i - 1])
        return r ? (o = s.slice(t, t + i),
        o[i - 1] = n,
        o) : null;
    if (s[e - 1] < n)
        return r ? (o = s.slice(e - i, e),
        o[i - 1] = n,
        o) : null;
    if (n == s[t + i - 1])
        return s.slice(t, t + i);
    let a = t / i
      , l = e / i;
    for (; a < l; ) {
        const d = a + l >> 1;
        n < s[(d + 1) * i - 1] ? l = d : a = d + 1
    }
    const h = s[a * i - 1];
    if (n == h)
        return s.slice((a - 1) * i, (a - 1) * i + i);
    const c = s[(a + 1) * i - 1]
      , u = (n - h) / (c - h);
    o = [];
    for (let d = 0; d < i - 1; ++d)
        o.push(vt(s[(a - 1) * i + d], s[a * i + d], u));
    return o.push(n),
    o
}
function Ku(s, t, e, i, n, r, o) {
    if (o)
        return $s(s, t, e[e.length - 1], i, n, r);
    let a;
    if (n < s[i - 1])
        return r ? (a = s.slice(0, i),
        a[i - 1] = n,
        a) : null;
    if (s[s.length - 1] < n)
        return r ? (a = s.slice(s.length - i),
        a[i - 1] = n,
        a) : null;
    for (let l = 0, h = e.length; l < h; ++l) {
        const c = e[l];
        if (t != c) {
            if (n < s[t + i - 1])
                return null;
            if (n <= s[c - 1])
                return $s(s, t, c, i, n, !1);
            t = c
        }
    }
    return null
}
function ll(s, t, e, i) {
    let n = s[t]
      , r = s[t + 1]
      , o = 0;
    for (let a = t + i; a < e; a += i) {
        const l = s[a]
          , h = s[a + 1];
        o += Math.sqrt((l - n) * (l - n) + (h - r) * (h - r)),
        n = l,
        r = h
    }
    return o
}
let ju = class qs extends tn {
    constructor(t, e) {
        super(),
        this.flatMidpoint_ = null,
        this.flatMidpointRevision_ = -1,
        this.maxDelta_ = -1,
        this.maxDeltaRevision_ = -1,
        e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(e, t) : this.setCoordinates(t, e)
    }
    appendCoordinate(t) {
        this.flatCoordinates ? ui(this.flatCoordinates, t) : this.flatCoordinates = t.slice(),
        this.changed()
    }
    clone() {
        const t = new qs(this.flatCoordinates.slice(),this.layout);
        return t.applyProperties(this),
        t
    }
    closestPointXY(t, e, i, n) {
        return n < es(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(wr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0)),
        this.maxDeltaRevision_ = this.getRevision()),
        Sr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, !1, t, e, i, n))
    }
    forEachSegment(t) {
        return Za(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t)
    }
    getCoordinateAtM(t, e) {
        return this.layout != "XYM" && this.layout != "XYZM" ? null : (e = e !== void 0 ? e : !1,
        $s(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e))
    }
    getCoordinates() {
        return ze(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
    }
    getCoordinateAt(t, e) {
        return al(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e, this.stride)
    }
    getLength() {
        return ll(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride)
    }
    getFlatMidpoint() {
        return this.flatMidpointRevision_ != this.getRevision() && (this.flatMidpoint_ = this.getCoordinateAt(.5, this.flatMidpoint_),
        this.flatMidpointRevision_ = this.getRevision()),
        this.flatMidpoint_
    }
    getSimplifiedGeometryInternal(t) {
        const e = [];
        return e.length = Tr(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t, e, 0),
        new qs(e,"XY")
    }
    getType() {
        return "LineString"
    }
    intersectsExtent(t) {
        return as(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, t)
    }
    setCoordinates(t, e) {
        this.setLayout(e, t, 1),
        this.flatCoordinates || (this.flatCoordinates = []),
        this.flatCoordinates.length = Cr(this.flatCoordinates, 0, t, this.stride),
        this.changed()
    }
}
;
const Zt = ju;
class Hn extends tn {
    constructor(t, e, i) {
        if (super(),
        this.ends_ = [],
        this.maxDelta_ = -1,
        this.maxDeltaRevision_ = -1,
        Array.isArray(t[0]))
            this.setCoordinates(t, e);
        else if (e !== void 0 && i)
            this.setFlatCoordinates(e, t),
            this.ends_ = i;
        else {
            let n = this.getLayout();
            const r = t
              , o = []
              , a = [];
            for (let l = 0, h = r.length; l < h; ++l) {
                const c = r[l];
                l === 0 && (n = c.getLayout()),
                ui(o, c.getFlatCoordinates()),
                a.push(o.length)
            }
            this.setFlatCoordinates(n, o),
            this.ends_ = a
        }
    }
    appendLineString(t) {
        this.flatCoordinates ? ui(this.flatCoordinates, t.getFlatCoordinates().slice()) : this.flatCoordinates = t.getFlatCoordinates().slice(),
        this.ends_.push(this.flatCoordinates.length),
        this.changed()
    }
    clone() {
        const t = new Hn(this.flatCoordinates.slice(),this.layout,this.ends_.slice());
        return t.applyProperties(this),
        t
    }
    closestPointXY(t, e, i, n) {
        return n < es(this.getExtent(), t, e) ? n : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(za(this.flatCoordinates, 0, this.ends_, this.stride, 0)),
        this.maxDeltaRevision_ = this.getRevision()),
        Wa(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, !1, t, e, i, n))
    }
    getCoordinateAtM(t, e, i) {
        return this.layout != "XYM" && this.layout != "XYZM" || this.flatCoordinates.length === 0 ? null : (e = e !== void 0 ? e : !1,
        i = i !== void 0 ? i : !1,
        Ku(this.flatCoordinates, 0, this.ends_, this.stride, t, e, i))
    }
    getCoordinates() {
        return Gi(this.flatCoordinates, 0, this.ends_, this.stride)
    }
    getEnds() {
        return this.ends_
    }
    getLineString(t) {
        return t < 0 || this.ends_.length <= t ? null : new Zt(this.flatCoordinates.slice(t === 0 ? 0 : this.ends_[t - 1], this.ends_[t]),this.layout)
    }
    getLineStrings() {
        const t = this.flatCoordinates
          , e = this.ends_
          , i = this.layout
          , n = [];
        let r = 0;
        for (let o = 0, a = e.length; o < a; ++o) {
            const l = e[o]
              , h = new Zt(t.slice(r, l),i);
            n.push(h),
            r = l
        }
        return n
    }
    getFlatMidpoints() {
        const t = []
          , e = this.flatCoordinates;
        let i = 0;
        const n = this.ends_
          , r = this.stride;
        for (let o = 0, a = n.length; o < a; ++o) {
            const l = n[o]
              , h = al(e, i, l, r, .5);
            ui(t, h),
            i = l
        }
        return t
    }
    getSimplifiedGeometryInternal(t) {
        const e = []
          , i = [];
        return e.length = _c(this.flatCoordinates, 0, this.ends_, this.stride, t, e, 0, i),
        new Hn(e,"XY",i)
    }
    getType() {
        return "MultiLineString"
    }
    intersectsExtent(t) {
        return wc(this.flatCoordinates, 0, this.ends_, this.stride, t)
    }
    setCoordinates(t, e) {
        this.setLayout(e, t, 2),
        this.flatCoordinates || (this.flatCoordinates = []);
        const i = Xa(this.flatCoordinates, 0, t, this.stride, this.ends_);
        this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1],
        this.changed()
    }
}
const Io = Hn
  , ot = {
    IDLE: 0,
    LOADING: 1,
    LOADED: 2,
    ERROR: 3,
    EMPTY: 4
};
class Ar {
    constructor(t) {
        this.opacity_ = t.opacity,
        this.rotateWithView_ = t.rotateWithView,
        this.rotation_ = t.rotation,
        this.scale_ = t.scale,
        this.scaleArray_ = Ft(t.scale),
        this.displacement_ = t.displacement,
        this.declutterMode_ = t.declutterMode
    }
    clone() {
        const t = this.getScale();
        return new Ar({
            opacity: this.getOpacity(),
            scale: Array.isArray(t) ? t.slice() : t,
            rotation: this.getRotation(),
            rotateWithView: this.getRotateWithView(),
            displacement: this.getDisplacement().slice(),
            declutterMode: this.getDeclutterMode()
        })
    }
    getOpacity() {
        return this.opacity_
    }
    getRotateWithView() {
        return this.rotateWithView_
    }
    getRotation() {
        return this.rotation_
    }
    getScale() {
        return this.scale_
    }
    getScaleArray() {
        return this.scaleArray_
    }
    getDisplacement() {
        return this.displacement_
    }
    getDeclutterMode() {
        return this.declutterMode_
    }
    getAnchor() {
        return Z()
    }
    getImage(t) {
        return Z()
    }
    getHitDetectionImage() {
        return Z()
    }
    getPixelRatio(t) {
        return 1
    }
    getImageState() {
        return Z()
    }
    getImageSize() {
        return Z()
    }
    getOrigin() {
        return Z()
    }
    getSize() {
        return Z()
    }
    setDisplacement(t) {
        this.displacement_ = t
    }
    setOpacity(t) {
        this.opacity_ = t
    }
    setRotateWithView(t) {
        this.rotateWithView_ = t
    }
    setRotation(t) {
        this.rotation_ = t
    }
    setScale(t) {
        this.scale_ = t,
        this.scaleArray_ = Ft(t)
    }
    listenImageChange(t) {
        Z()
    }
    load() {
        Z()
    }
    unlistenImageChange(t) {
        Z()
    }
}
const hl = Ar;
function jt(s) {
    return Array.isArray(s) ? Ma(s) : s
}
class Or extends hl {
    constructor(t) {
        const e = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
        super({
            opacity: 1,
            rotateWithView: e,
            rotation: t.rotation !== void 0 ? t.rotation : 0,
            scale: t.scale !== void 0 ? t.scale : 1,
            displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
            declutterMode: t.declutterMode
        }),
        this.canvas_ = void 0,
        this.hitDetectionCanvas_ = null,
        this.fill_ = t.fill !== void 0 ? t.fill : null,
        this.origin_ = [0, 0],
        this.points_ = t.points,
        this.radius_ = t.radius !== void 0 ? t.radius : t.radius1,
        this.radius2_ = t.radius2,
        this.angle_ = t.angle !== void 0 ? t.angle : 0,
        this.stroke_ = t.stroke !== void 0 ? t.stroke : null,
        this.size_ = null,
        this.renderOptions_ = null,
        this.render()
    }
    clone() {
        const t = this.getScale()
          , e = new Or({
            fill: this.getFill() ? this.getFill().clone() : void 0,
            points: this.getPoints(),
            radius: this.getRadius(),
            radius2: this.getRadius2(),
            angle: this.getAngle(),
            stroke: this.getStroke() ? this.getStroke().clone() : void 0,
            rotation: this.getRotation(),
            rotateWithView: this.getRotateWithView(),
            scale: Array.isArray(t) ? t.slice() : t,
            displacement: this.getDisplacement().slice(),
            declutterMode: this.getDeclutterMode()
        });
        return e.setOpacity(this.getOpacity()),
        e
    }
    getAnchor() {
        const t = this.size_;
        if (!t)
            return null;
        const e = this.getDisplacement()
          , i = this.getScaleArray();
        return [t[0] / 2 - e[0] / i[0], t[1] / 2 + e[1] / i[1]]
    }
    getAngle() {
        return this.angle_
    }
    getFill() {
        return this.fill_
    }
    setFill(t) {
        this.fill_ = t,
        this.render()
    }
    getHitDetectionImage() {
        return this.hitDetectionCanvas_ || this.createHitDetectionCanvas_(this.renderOptions_),
        this.hitDetectionCanvas_
    }
    getImage(t) {
        let e = this.canvas_[t];
        if (!e) {
            const i = this.renderOptions_
              , n = wt(i.size * t, i.size * t);
            this.draw_(i, n, t),
            e = n.canvas,
            this.canvas_[t] = e
        }
        return e
    }
    getPixelRatio(t) {
        return t
    }
    getImageSize() {
        return this.size_
    }
    getImageState() {
        return ot.LOADED
    }
    getOrigin() {
        return this.origin_
    }
    getPoints() {
        return this.points_
    }
    getRadius() {
        return this.radius_
    }
    getRadius2() {
        return this.radius2_
    }
    getSize() {
        return this.size_
    }
    getStroke() {
        return this.stroke_
    }
    setStroke(t) {
        this.stroke_ = t,
        this.render()
    }
    listenImageChange(t) {}
    load() {}
    unlistenImageChange(t) {}
    calculateLineJoinSize_(t, e, i) {
        if (e === 0 || this.points_ === 1 / 0 || t !== "bevel" && t !== "miter")
            return e;
        let n = this.radius_
          , r = this.radius2_ === void 0 ? n : this.radius2_;
        if (n < r) {
            const R = n;
            n = r,
            r = R
        }
        const o = this.radius2_ === void 0 ? this.points_ : this.points_ * 2
          , a = 2 * Math.PI / o
          , l = r * Math.sin(a)
          , h = Math.sqrt(r * r - l * l)
          , c = n - h
          , u = Math.sqrt(l * l + c * c)
          , d = u / l;
        if (t === "miter" && d <= i)
            return d * e;
        const f = e / 2 / d
          , g = e / 2 * (c / u)
          , m = Math.sqrt((n + f) * (n + f) + g * g) - n;
        if (this.radius2_ === void 0 || t === "bevel")
            return m * 2;
        const p = n * Math.sin(a)
          , y = Math.sqrt(n * n - p * p)
          , x = r - y
          , w = Math.sqrt(p * p + x * x) / p;
        if (w <= i) {
            const R = w * e / 2 - r - n;
            return 2 * Math.max(m, R)
        }
        return m * 2
    }
    createRenderOptions() {
        let t = Ei, e = 0, i = null, n = 0, r, o = 0;
        this.stroke_ && (r = this.stroke_.getColor(),
        r === null && (r = Bi),
        r = jt(r),
        o = this.stroke_.getWidth(),
        o === void 0 && (o = Vi),
        i = this.stroke_.getLineDash(),
        n = this.stroke_.getLineDashOffset(),
        t = this.stroke_.getLineJoin(),
        t === void 0 && (t = Ei),
        e = this.stroke_.getMiterLimit(),
        e === void 0 && (e = Yi));
        const a = this.calculateLineJoinSize_(t, o, e)
          , l = Math.max(this.radius_, this.radius2_ || 0)
          , h = Math.ceil(2 * l + a);
        return {
            strokeStyle: r,
            strokeWidth: o,
            size: h,
            lineDash: i,
            lineDashOffset: n,
            lineJoin: t,
            miterLimit: e
        }
    }
    render() {
        this.renderOptions_ = this.createRenderOptions();
        const t = this.renderOptions_.size;
        this.canvas_ = {},
        this.size_ = [t, t]
    }
    draw_(t, e, i) {
        if (e.scale(i, i),
        e.translate(t.size / 2, t.size / 2),
        this.createPath_(e),
        this.fill_) {
            let n = this.fill_.getColor();
            n === null && (n = fe),
            e.fillStyle = jt(n),
            e.fill()
        }
        this.stroke_ && (e.strokeStyle = t.strokeStyle,
        e.lineWidth = t.strokeWidth,
        t.lineDash && (e.setLineDash(t.lineDash),
        e.lineDashOffset = t.lineDashOffset),
        e.lineJoin = t.lineJoin,
        e.miterLimit = t.miterLimit,
        e.stroke())
    }
    createHitDetectionCanvas_(t) {
        if (this.fill_) {
            let e = this.fill_.getColor()
              , i = 0;
            if (typeof e == "string" && (e = Gn(e)),
            e === null ? i = 1 : Array.isArray(e) && (i = e.length === 4 ? e[3] : 1),
            i === 0) {
                const n = wt(t.size, t.size);
                this.hitDetectionCanvas_ = n.canvas,
                this.drawHitDetectionCanvas_(t, n)
            }
        }
        this.hitDetectionCanvas_ || (this.hitDetectionCanvas_ = this.getImage(1))
    }
    createPath_(t) {
        let e = this.points_;
        const i = this.radius_;
        if (e === 1 / 0)
            t.arc(0, 0, i, 0, 2 * Math.PI);
        else {
            const n = this.radius2_ === void 0 ? i : this.radius2_;
            this.radius2_ !== void 0 && (e *= 2);
            const r = this.angle_ - Math.PI / 2
              , o = 2 * Math.PI / e;
            for (let a = 0; a < e; a++) {
                const l = r + a * o
                  , h = a % 2 === 0 ? i : n;
                t.lineTo(h * Math.cos(l), h * Math.sin(l))
            }
            t.closePath()
        }
    }
    drawHitDetectionCanvas_(t, e) {
        e.translate(t.size / 2, t.size / 2),
        this.createPath_(e),
        e.fillStyle = fe,
        e.fill(),
        this.stroke_ && (e.strokeStyle = t.strokeStyle,
        e.lineWidth = t.strokeWidth,
        t.lineDash && (e.setLineDash(t.lineDash),
        e.lineDashOffset = t.lineDashOffset),
        e.lineJoin = t.lineJoin,
        e.miterLimit = t.miterLimit,
        e.stroke())
    }
}
const cl = Or;
class Fr extends cl {
    constructor(t) {
        t = t || {
            radius: 5
        },
        super({
            points: 1 / 0,
            fill: t.fill,
            radius: t.radius,
            stroke: t.stroke,
            scale: t.scale !== void 0 ? t.scale : 1,
            rotation: t.rotation !== void 0 ? t.rotation : 0,
            rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
            displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
            declutterMode: t.declutterMode
        })
    }
    clone() {
        const t = this.getScale()
          , e = new Fr({
            fill: this.getFill() ? this.getFill().clone() : void 0,
            stroke: this.getStroke() ? this.getStroke().clone() : void 0,
            radius: this.getRadius(),
            scale: Array.isArray(t) ? t.slice() : t,
            rotation: this.getRotation(),
            rotateWithView: this.getRotateWithView(),
            displacement: this.getDisplacement().slice(),
            declutterMode: this.getDeclutterMode()
        });
        return e.setOpacity(this.getOpacity()),
        e
    }
    setRadius(t) {
        this.radius_ = t,
        this.render()
    }
}
const ul = Fr;
class Dr {
    constructor(t) {
        t = t || {},
        this.color_ = t.color !== void 0 ? t.color : null
    }
    clone() {
        const t = this.getColor();
        return new Dr({
            color: Array.isArray(t) ? t.slice() : t || void 0
        })
    }
    getColor() {
        return this.color_
    }
    setColor(t) {
        this.color_ = t
    }
}
const at = Dr;
function dl(s, t, e) {
    const i = s;
    let n = !0
      , r = !1
      , o = !1;
    const a = [Nn(i, G.LOAD, function() {
        o = !0,
        r || t()
    })];
    return i.src && ql ? (r = !0,
    i.decode().then(function() {
        n && t()
    }).catch(function(l) {
        n && (o ? t() : e())
    })) : a.push(Nn(i, G.ERROR, e)),
    function() {
        n = !1,
        a.forEach(et)
    }
}
let vi = null;
class Hu extends Qn {
    constructor(t, e, i, n, r, o) {
        super(),
        this.hitDetectionImage_ = null,
        this.image_ = t,
        this.crossOrigin_ = n,
        this.canvas_ = {},
        this.color_ = o,
        this.unlisten_ = null,
        this.imageState_ = r,
        this.size_ = i,
        this.src_ = e,
        this.tainted_
    }
    initializeImage_() {
        this.image_ = new Image,
        this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_)
    }
    isTainted_() {
        if (this.tainted_ === void 0 && this.imageState_ === ot.LOADED) {
            vi || (vi = wt(1, 1, void 0, {
                willReadFrequently: !0
            })),
            vi.drawImage(this.image_, 0, 0);
            try {
                vi.getImageData(0, 0, 1, 1),
                this.tainted_ = !1
            } catch {
                vi = null,
                this.tainted_ = !0
            }
        }
        return this.tainted_ === !0
    }
    dispatchChangeEvent_() {
        this.dispatchEvent(G.CHANGE)
    }
    handleImageError_() {
        this.imageState_ = ot.ERROR,
        this.unlistenImage_(),
        this.dispatchChangeEvent_()
    }
    handleImageLoad_() {
        this.imageState_ = ot.LOADED,
        this.size_ ? (this.image_.width = this.size_[0],
        this.image_.height = this.size_[1]) : this.size_ = [this.image_.width, this.image_.height],
        this.unlistenImage_(),
        this.dispatchChangeEvent_()
    }
    getImage(t) {
        return this.image_ || this.initializeImage_(),
        this.replaceColor_(t),
        this.canvas_[t] ? this.canvas_[t] : this.image_
    }
    getPixelRatio(t) {
        return this.replaceColor_(t),
        this.canvas_[t] ? t : 1
    }
    getImageState() {
        return this.imageState_
    }
    getHitDetectionImage() {
        if (this.image_ || this.initializeImage_(),
        !this.hitDetectionImage_)
            if (this.isTainted_()) {
                const t = this.size_[0]
                  , e = this.size_[1]
                  , i = wt(t, e);
                i.fillRect(0, 0, t, e),
                this.hitDetectionImage_ = i.canvas
            } else
                this.hitDetectionImage_ = this.image_;
        return this.hitDetectionImage_
    }
    getSize() {
        return this.size_
    }
    getSrc() {
        return this.src_
    }
    load() {
        if (this.imageState_ === ot.IDLE) {
            this.image_ || this.initializeImage_(),
            this.imageState_ = ot.LOADING;
            try {
                this.image_.src = this.src_
            } catch {
                this.handleImageError_()
            }
            this.unlisten_ = dl(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this))
        }
    }
    replaceColor_(t) {
        if (!this.color_ || this.canvas_[t] || this.imageState_ !== ot.LOADED)
            return;
        const e = this.image_
          , i = document.createElement("canvas");
        i.width = Math.ceil(e.width * t),
        i.height = Math.ceil(e.height * t);
        const n = i.getContext("2d");
        n.scale(t, t),
        n.drawImage(e, 0, 0),
        n.globalCompositeOperation = "multiply",
        n.fillStyle = La(this.color_),
        n.fillRect(0, 0, i.width / t, i.height / t),
        n.globalCompositeOperation = "destination-in",
        n.drawImage(e, 0, 0),
        this.canvas_[t] = i
    }
    unlistenImage_() {
        this.unlisten_ && (this.unlisten_(),
        this.unlisten_ = null)
    }
}
function $u(s, t, e, i, n, r) {
    let o = zn.get(t, i, r);
    return o || (o = new Hu(s,t,e,i,n,r),
    zn.set(t, i, r, o)),
    o
}
function Lo(s, t, e, i) {
    return e !== void 0 && i !== void 0 ? [e / s, i / t] : e !== void 0 ? e / s : i !== void 0 ? i / t : 1
}
class Nr extends hl {
    constructor(t) {
        t = t || {};
        const e = t.opacity !== void 0 ? t.opacity : 1
          , i = t.rotation !== void 0 ? t.rotation : 0
          , n = t.scale !== void 0 ? t.scale : 1
          , r = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
        super({
            opacity: e,
            rotation: i,
            scale: n,
            displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
            rotateWithView: r,
            declutterMode: t.declutterMode
        }),
        this.anchor_ = t.anchor !== void 0 ? t.anchor : [.5, .5],
        this.normalizedAnchor_ = null,
        this.anchorOrigin_ = t.anchorOrigin !== void 0 ? t.anchorOrigin : "top-left",
        this.anchorXUnits_ = t.anchorXUnits !== void 0 ? t.anchorXUnits : "fraction",
        this.anchorYUnits_ = t.anchorYUnits !== void 0 ? t.anchorYUnits : "fraction",
        this.crossOrigin_ = t.crossOrigin !== void 0 ? t.crossOrigin : null;
        const o = t.img !== void 0 ? t.img : null;
        this.imgSize_ = t.imgSize;
        let a = t.src;
        W(!(a !== void 0 && o), 4),
        W(!o || o && this.imgSize_, 5),
        (a === void 0 || a.length === 0) && o && (a = o.src || U(o)),
        W(a !== void 0 && a.length > 0, 6),
        W(!((t.width !== void 0 || t.height !== void 0) && t.scale !== void 0), 69);
        const l = t.src !== void 0 ? ot.IDLE : ot.LOADED;
        if (this.color_ = t.color !== void 0 ? Gn(t.color) : null,
        this.iconImage_ = $u(o, a, this.imgSize_ !== void 0 ? this.imgSize_ : null, this.crossOrigin_, l, this.color_),
        this.offset_ = t.offset !== void 0 ? t.offset : [0, 0],
        this.offsetOrigin_ = t.offsetOrigin !== void 0 ? t.offsetOrigin : "top-left",
        this.origin_ = null,
        this.size_ = t.size !== void 0 ? t.size : null,
        t.width !== void 0 || t.height !== void 0) {
            let h, c;
            if (t.size)
                [h,c] = t.size;
            else {
                const u = this.getImage(1);
                if (u instanceof HTMLCanvasElement || u.src && u.complete)
                    h = u.width,
                    c = u.height;
                else {
                    this.initialOptions_ = t;
                    const d = ()=>{
                        if (this.unlistenImageChange(d),
                        !this.initialOptions_)
                            return;
                        const f = this.iconImage_.getSize();
                        this.setScale(Lo(f[0], f[1], t.width, t.height))
                    }
                    ;
                    this.listenImageChange(d);
                    return
                }
            }
            h !== void 0 && this.setScale(Lo(h, c, t.width, t.height))
        }
    }
    clone() {
        let t, e, i;
        return this.initialOptions_ ? (e = this.initialOptions_.width,
        i = this.initialOptions_.height) : (t = this.getScale(),
        t = Array.isArray(t) ? t.slice() : t),
        new Nr({
            anchor: this.anchor_.slice(),
            anchorOrigin: this.anchorOrigin_,
            anchorXUnits: this.anchorXUnits_,
            anchorYUnits: this.anchorYUnits_,
            color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0,
            crossOrigin: this.crossOrigin_,
            imgSize: this.imgSize_,
            offset: this.offset_.slice(),
            offsetOrigin: this.offsetOrigin_,
            opacity: this.getOpacity(),
            rotateWithView: this.getRotateWithView(),
            rotation: this.getRotation(),
            scale: t,
            width: e,
            height: i,
            size: this.size_ !== null ? this.size_.slice() : void 0,
            src: this.getSrc(),
            displacement: this.getDisplacement().slice(),
            declutterMode: this.getDeclutterMode()
        })
    }
    getAnchor() {
        let t = this.normalizedAnchor_;
        if (!t) {
            t = this.anchor_;
            const n = this.getSize();
            if (this.anchorXUnits_ == "fraction" || this.anchorYUnits_ == "fraction") {
                if (!n)
                    return null;
                t = this.anchor_.slice(),
                this.anchorXUnits_ == "fraction" && (t[0] *= n[0]),
                this.anchorYUnits_ == "fraction" && (t[1] *= n[1])
            }
            if (this.anchorOrigin_ != "top-left") {
                if (!n)
                    return null;
                t === this.anchor_ && (t = this.anchor_.slice()),
                (this.anchorOrigin_ == "top-right" || this.anchorOrigin_ == "bottom-right") && (t[0] = -t[0] + n[0]),
                (this.anchorOrigin_ == "bottom-left" || this.anchorOrigin_ == "bottom-right") && (t[1] = -t[1] + n[1])
            }
            this.normalizedAnchor_ = t
        }
        const e = this.getDisplacement()
          , i = this.getScaleArray();
        return [t[0] - e[0] / i[0], t[1] + e[1] / i[1]]
    }
    setAnchor(t) {
        this.anchor_ = t,
        this.normalizedAnchor_ = null
    }
    getColor() {
        return this.color_
    }
    getImage(t) {
        return this.iconImage_.getImage(t)
    }
    getPixelRatio(t) {
        return this.iconImage_.getPixelRatio(t)
    }
    getImageSize() {
        return this.iconImage_.getSize()
    }
    getImageState() {
        return this.iconImage_.getImageState()
    }
    getHitDetectionImage() {
        return this.iconImage_.getHitDetectionImage()
    }
    getOrigin() {
        if (this.origin_)
            return this.origin_;
        let t = this.offset_;
        if (this.offsetOrigin_ != "top-left") {
            const e = this.getSize()
              , i = this.iconImage_.getSize();
            if (!e || !i)
                return null;
            t = t.slice(),
            (this.offsetOrigin_ == "top-right" || this.offsetOrigin_ == "bottom-right") && (t[0] = i[0] - e[0] - t[0]),
            (this.offsetOrigin_ == "bottom-left" || this.offsetOrigin_ == "bottom-right") && (t[1] = i[1] - e[1] - t[1])
        }
        return this.origin_ = t,
        this.origin_
    }
    getSrc() {
        return this.iconImage_.getSrc()
    }
    getSize() {
        return this.size_ ? this.size_ : this.iconImage_.getSize()
    }
    getWidth() {
        const t = this.getScaleArray();
        if (this.size_)
            return this.size_[0] * t[0];
        if (this.iconImage_.getImageState() == ot.LOADED)
            return this.iconImage_.getSize()[0] * t[0]
    }
    getHeight() {
        const t = this.getScaleArray();
        if (this.size_)
            return this.size_[1] * t[1];
        if (this.iconImage_.getImageState() == ot.LOADED)
            return this.iconImage_.getSize()[1] * t[1]
    }
    setScale(t) {
        delete this.initialOptions_,
        super.setScale(t)
    }
    listenImageChange(t) {
        this.iconImage_.addEventListener(G.CHANGE, t)
    }
    load() {
        this.iconImage_.load()
    }
    unlistenImageChange(t) {
        this.iconImage_.removeEventListener(G.CHANGE, t)
    }
}
const Ht = Nr;
class Gr {
    constructor(t) {
        t = t || {},
        this.color_ = t.color !== void 0 ? t.color : null,
        this.lineCap_ = t.lineCap,
        this.lineDash_ = t.lineDash !== void 0 ? t.lineDash : null,
        this.lineDashOffset_ = t.lineDashOffset,
        this.lineJoin_ = t.lineJoin,
        this.miterLimit_ = t.miterLimit,
        this.width_ = t.width
    }
    clone() {
        const t = this.getColor();
        return new Gr({
            color: Array.isArray(t) ? t.slice() : t || void 0,
            lineCap: this.getLineCap(),
            lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
            lineDashOffset: this.getLineDashOffset(),
            lineJoin: this.getLineJoin(),
            miterLimit: this.getMiterLimit(),
            width: this.getWidth()
        })
    }
    getColor() {
        return this.color_
    }
    getLineCap() {
        return this.lineCap_
    }
    getLineDash() {
        return this.lineDash_
    }
    getLineDashOffset() {
        return this.lineDashOffset_
    }
    getLineJoin() {
        return this.lineJoin_
    }
    getMiterLimit() {
        return this.miterLimit_
    }
    getWidth() {
        return this.width_
    }
    setColor(t) {
        this.color_ = t
    }
    setLineCap(t) {
        this.lineCap_ = t
    }
    setLineDash(t) {
        this.lineDash_ = t
    }
    setLineDashOffset(t) {
        this.lineDashOffset_ = t
    }
    setLineJoin(t) {
        this.lineJoin_ = t
    }
    setMiterLimit(t) {
        this.miterLimit_ = t
    }
    setWidth(t) {
        this.width_ = t
    }
}
const It = Gr;
class us {
    constructor(t) {
        t = t || {},
        this.geometry_ = null,
        this.geometryFunction_ = Mo,
        t.geometry !== void 0 && this.setGeometry(t.geometry),
        this.fill_ = t.fill !== void 0 ? t.fill : null,
        this.image_ = t.image !== void 0 ? t.image : null,
        this.renderer_ = t.renderer !== void 0 ? t.renderer : null,
        this.hitDetectionRenderer_ = t.hitDetectionRenderer !== void 0 ? t.hitDetectionRenderer : null,
        this.stroke_ = t.stroke !== void 0 ? t.stroke : null,
        this.text_ = t.text !== void 0 ? t.text : null,
        this.zIndex_ = t.zIndex
    }
    clone() {
        let t = this.getGeometry();
        return t && typeof t == "object" && (t = t.clone()),
        new us({
            geometry: t,
            fill: this.getFill() ? this.getFill().clone() : void 0,
            image: this.getImage() ? this.getImage().clone() : void 0,
            renderer: this.getRenderer(),
            stroke: this.getStroke() ? this.getStroke().clone() : void 0,
            text: this.getText() ? this.getText().clone() : void 0,
            zIndex: this.getZIndex()
        })
    }
    getRenderer() {
        return this.renderer_
    }
    setRenderer(t) {
        this.renderer_ = t
    }
    setHitDetectionRenderer(t) {
        this.hitDetectionRenderer_ = t
    }
    getHitDetectionRenderer() {
        return this.hitDetectionRenderer_
    }
    getGeometry() {
        return this.geometry_
    }
    getGeometryFunction() {
        return this.geometryFunction_
    }
    getFill() {
        return this.fill_
    }
    setFill(t) {
        this.fill_ = t
    }
    getImage() {
        return this.image_
    }
    setImage(t) {
        this.image_ = t
    }
    getStroke() {
        return this.stroke_
    }
    setStroke(t) {
        this.stroke_ = t
    }
    getText() {
        return this.text_
    }
    setText(t) {
        this.text_ = t
    }
    getZIndex() {
        return this.zIndex_
    }
    setGeometry(t) {
        typeof t == "function" ? this.geometryFunction_ = t : typeof t == "string" ? this.geometryFunction_ = function(e) {
            return e.get(t)
        }
        : t ? t !== void 0 && (this.geometryFunction_ = function() {
            return t
        }
        ) : this.geometryFunction_ = Mo,
        this.geometry_ = t
    }
    setZIndex(t) {
        this.zIndex_ = t
    }
}
function qu(s) {
    let t;
    if (typeof s == "function")
        t = s;
    else {
        let e;
        Array.isArray(s) ? e = s : (W(typeof s.getZIndex == "function", 41),
        e = [s]),
        t = function() {
            return e
        }
    }
    return t
}
let Cs = null;
function Ju(s, t) {
    if (!Cs) {
        const e = new at({
            color: "rgba(255,255,255,0.4)"
        })
          , i = new It({
            color: "#3399CC",
            width: 1.25
        });
        Cs = [new us({
            image: new ul({
                fill: e,
                stroke: i,
                radius: 5
            }),
            fill: e,
            stroke: i
        })]
    }
    return Cs
}
function Mo(s) {
    return s.getGeometry()
}
const H = us
  , Qu = "#333";
class zr {
    constructor(t) {
        t = t || {},
        this.font_ = t.font,
        this.rotation_ = t.rotation,
        this.rotateWithView_ = t.rotateWithView,
        this.scale_ = t.scale,
        this.scaleArray_ = Ft(t.scale !== void 0 ? t.scale : 1),
        this.text_ = t.text,
        this.textAlign_ = t.textAlign,
        this.justify_ = t.justify,
        this.repeat_ = t.repeat,
        this.textBaseline_ = t.textBaseline,
        this.fill_ = t.fill !== void 0 ? t.fill : new at({
            color: Qu
        }),
        this.maxAngle_ = t.maxAngle !== void 0 ? t.maxAngle : Math.PI / 4,
        this.placement_ = t.placement !== void 0 ? t.placement : "point",
        this.overflow_ = !!t.overflow,
        this.stroke_ = t.stroke !== void 0 ? t.stroke : null,
        this.offsetX_ = t.offsetX !== void 0 ? t.offsetX : 0,
        this.offsetY_ = t.offsetY !== void 0 ? t.offsetY : 0,
        this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null,
        this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null,
        this.padding_ = t.padding === void 0 ? null : t.padding
    }
    clone() {
        const t = this.getScale();
        return new zr({
            font: this.getFont(),
            placement: this.getPlacement(),
            repeat: this.getRepeat(),
            maxAngle: this.getMaxAngle(),
            overflow: this.getOverflow(),
            rotation: this.getRotation(),
            rotateWithView: this.getRotateWithView(),
            scale: Array.isArray(t) ? t.slice() : t,
            text: this.getText(),
            textAlign: this.getTextAlign(),
            justify: this.getJustify(),
            textBaseline: this.getTextBaseline(),
            fill: this.getFill() ? this.getFill().clone() : void 0,
            stroke: this.getStroke() ? this.getStroke().clone() : void 0,
            offsetX: this.getOffsetX(),
            offsetY: this.getOffsetY(),
            backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0,
            backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0,
            padding: this.getPadding() || void 0
        })
    }
    getOverflow() {
        return this.overflow_
    }
    getFont() {
        return this.font_
    }
    getMaxAngle() {
        return this.maxAngle_
    }
    getPlacement() {
        return this.placement_
    }
    getRepeat() {
        return this.repeat_
    }
    getOffsetX() {
        return this.offsetX_
    }
    getOffsetY() {
        return this.offsetY_
    }
    getFill() {
        return this.fill_
    }
    getRotateWithView() {
        return this.rotateWithView_
    }
    getRotation() {
        return this.rotation_
    }
    getScale() {
        return this.scale_
    }
    getScaleArray() {
        return this.scaleArray_
    }
    getStroke() {
        return this.stroke_
    }
    getText() {
        return this.text_
    }
    getTextAlign() {
        return this.textAlign_
    }
    getJustify() {
        return this.justify_
    }
    getTextBaseline() {
        return this.textBaseline_
    }
    getBackgroundFill() {
        return this.backgroundFill_
    }
    getBackgroundStroke() {
        return this.backgroundStroke_
    }
    getPadding() {
        return this.padding_
    }
    setOverflow(t) {
        this.overflow_ = t
    }
    setFont(t) {
        this.font_ = t
    }
    setMaxAngle(t) {
        this.maxAngle_ = t
    }
    setOffsetX(t) {
        this.offsetX_ = t
    }
    setOffsetY(t) {
        this.offsetY_ = t
    }
    setPlacement(t) {
        this.placement_ = t
    }
    setRepeat(t) {
        this.repeat_ = t
    }
    setRotateWithView(t) {
        this.rotateWithView_ = t
    }
    setFill(t) {
        this.fill_ = t
    }
    setRotation(t) {
        this.rotation_ = t
    }
    setScale(t) {
        this.scale_ = t,
        this.scaleArray_ = Ft(t !== void 0 ? t : 1)
    }
    setStroke(t) {
        this.stroke_ = t
    }
    setText(t) {
        this.text_ = t
    }
    setTextAlign(t) {
        this.textAlign_ = t
    }
    setJustify(t) {
        this.justify_ = t
    }
    setTextBaseline(t) {
        this.textBaseline_ = t
    }
    setBackgroundFill(t) {
        this.backgroundFill_ = t
    }
    setBackgroundStroke(t) {
        this.backgroundStroke_ = t
    }
    setPadding(t) {
        this.padding_ = t
    }
}
const _t = zr;
function td(s, t, e, i, n) {
    fl(s, t, e || 0, i || s.length - 1, n || ed)
}
function fl(s, t, e, i, n) {
    for (; i > e; ) {
        if (i - e > 600) {
            var r = i - e + 1
              , o = t - e + 1
              , a = Math.log(r)
              , l = .5 * Math.exp(2 * a / 3)
              , h = .5 * Math.sqrt(a * l * (r - l) / r) * (o - r / 2 < 0 ? -1 : 1)
              , c = Math.max(e, Math.floor(t - o * l / r + h))
              , u = Math.min(i, Math.floor(t + (r - o) * l / r + h));
            fl(s, t, c, u, n)
        }
        var d = s[t]
          , f = e
          , g = i;
        for (bi(s, e, t),
        n(s[i], d) > 0 && bi(s, e, i); f < g; ) {
            for (bi(s, f, g),
            f++,
            g--; n(s[f], d) < 0; )
                f++;
            for (; n(s[g], d) > 0; )
                g--
        }
        n(s[e], d) === 0 ? bi(s, e, g) : (g++,
        bi(s, g, i)),
        g <= t && (e = g + 1),
        t <= g && (i = g - 1)
    }
}
function bi(s, t, e) {
    var i = s[t];
    s[t] = s[e],
    s[e] = i
}
function ed(s, t) {
    return s < t ? -1 : s > t ? 1 : 0
}
let gl = class {
    constructor(t=9) {
        this._maxEntries = Math.max(4, t),
        this._minEntries = Math.max(2, Math.ceil(this._maxEntries * .4)),
        this.clear()
    }
    all() {
        return this._all(this.data, [])
    }
    search(t) {
        let e = this.data;
        const i = [];
        if (!Sn(t, e))
            return i;
        const n = this.toBBox
          , r = [];
        for (; e; ) {
            for (let o = 0; o < e.children.length; o++) {
                const a = e.children[o]
                  , l = e.leaf ? n(a) : a;
                Sn(t, l) && (e.leaf ? i.push(a) : Rs(t, l) ? this._all(a, i) : r.push(a))
            }
            e = r.pop()
        }
        return i
    }
    collides(t) {
        let e = this.data;
        if (!Sn(t, e))
            return !1;
        const i = [];
        for (; e; ) {
            for (let n = 0; n < e.children.length; n++) {
                const r = e.children[n]
                  , o = e.leaf ? this.toBBox(r) : r;
                if (Sn(t, o)) {
                    if (e.leaf || Rs(t, o))
                        return !0;
                    i.push(r)
                }
            }
            e = i.pop()
        }
        return !1
    }
    load(t) {
        if (!(t && t.length))
            return this;
        if (t.length < this._minEntries) {
            for (let i = 0; i < t.length; i++)
                this.insert(t[i]);
            return this
        }
        let e = this._build(t.slice(), 0, t.length - 1, 0);
        if (!this.data.children.length)
            this.data = e;
        else if (this.data.height === e.height)
            this._splitRoot(this.data, e);
        else {
            if (this.data.height < e.height) {
                const i = this.data;
                this.data = e,
                e = i
            }
            this._insert(e, this.data.height - e.height - 1, !0)
        }
        return this
    }
    insert(t) {
        return t && this._insert(t, this.data.height - 1),
        this
    }
    clear() {
        return this.data = li([]),
        this
    }
    remove(t, e) {
        if (!t)
            return this;
        let i = this.data;
        const n = this.toBBox(t)
          , r = []
          , o = [];
        let a, l, h;
        for (; i || r.length; ) {
            if (i || (i = r.pop(),
            l = r[r.length - 1],
            a = o.pop(),
            h = !0),
            i.leaf) {
                const c = id(t, i.children, e);
                if (c !== -1)
                    return i.children.splice(c, 1),
                    r.push(i),
                    this._condense(r),
                    this
            }
            !h && !i.leaf && Rs(i, n) ? (r.push(i),
            o.push(a),
            a = 0,
            l = i,
            i = i.children[0]) : l ? (a++,
            i = l.children[a],
            h = !1) : i = null
        }
        return this
    }
    toBBox(t) {
        return t
    }
    compareMinX(t, e) {
        return t.minX - e.minX
    }
    compareMinY(t, e) {
        return t.minY - e.minY
    }
    toJSON() {
        return this.data
    }
    fromJSON(t) {
        return this.data = t,
        this
    }
    _all(t, e) {
        const i = [];
        for (; t; )
            t.leaf ? e.push(...t.children) : i.push(...t.children),
            t = i.pop();
        return e
    }
    _build(t, e, i, n) {
        const r = i - e + 1;
        let o = this._maxEntries, a;
        if (r <= o)
            return a = li(t.slice(e, i + 1)),
            Qe(a, this.toBBox),
            a;
        n || (n = Math.ceil(Math.log(r) / Math.log(o)),
        o = Math.ceil(r / Math.pow(o, n - 1))),
        a = li([]),
        a.leaf = !1,
        a.height = n;
        const l = Math.ceil(r / o)
          , h = l * Math.ceil(Math.sqrt(o));
        vo(t, e, i, h, this.compareMinX);
        for (let c = e; c <= i; c += h) {
            const u = Math.min(c + h - 1, i);
            vo(t, c, u, l, this.compareMinY);
            for (let d = c; d <= u; d += l) {
                const f = Math.min(d + l - 1, u);
                a.children.push(this._build(t, d, f, n - 1))
            }
        }
        return Qe(a, this.toBBox),
        a
    }
    _chooseSubtree(t, e, i, n) {
        for (; n.push(e),
        !(e.leaf || n.length - 1 === i); ) {
            let r = 1 / 0, o = 1 / 0, a;
            for (let l = 0; l < e.children.length; l++) {
                const h = e.children[l]
                  , c = Ts(h)
                  , u = rd(t, h) - c;
                u < o ? (o = u,
                r = c < r ? c : r,
                a = h) : u === o && c < r && (r = c,
                a = h)
            }
            e = a || e.children[0]
        }
        return e
    }
    _insert(t, e, i) {
        const n = i ? t : this.toBBox(t)
          , r = []
          , o = this._chooseSubtree(n, this.data, e, r);
        for (o.children.push(t),
        Ai(o, n); e >= 0 && r[e].children.length > this._maxEntries; )
            this._split(r, e),
            e--;
        this._adjustParentBBoxes(n, r, e)
    }
    _split(t, e) {
        const i = t[e]
          , n = i.children.length
          , r = this._minEntries;
        this._chooseSplitAxis(i, r, n);
        const o = this._chooseSplitIndex(i, r, n)
          , a = li(i.children.splice(o, i.children.length - o));
        a.height = i.height,
        a.leaf = i.leaf,
        Qe(i, this.toBBox),
        Qe(a, this.toBBox),
        e ? t[e - 1].children.push(a) : this._splitRoot(i, a)
    }
    _splitRoot(t, e) {
        this.data = li([t, e]),
        this.data.height = t.height + 1,
        this.data.leaf = !1,
        Qe(this.data, this.toBBox)
    }
    _chooseSplitIndex(t, e, i) {
        let n, r = 1 / 0, o = 1 / 0;
        for (let a = e; a <= i - e; a++) {
            const l = ki(t, 0, a, this.toBBox)
              , h = ki(t, a, i, this.toBBox)
              , c = od(l, h)
              , u = Ts(l) + Ts(h);
            c < r ? (r = c,
            n = a,
            o = u < o ? u : o) : c === r && u < o && (o = u,
            n = a)
        }
        return n || i - e
    }
    _chooseSplitAxis(t, e, i) {
        const n = t.leaf ? this.compareMinX : nd
          , r = t.leaf ? this.compareMinY : sd
          , o = this._allDistMargin(t, e, i, n)
          , a = this._allDistMargin(t, e, i, r);
        o < a && t.children.sort(n)
    }
    _allDistMargin(t, e, i, n) {
        t.children.sort(n);
        const r = this.toBBox
          , o = ki(t, 0, e, r)
          , a = ki(t, i - e, i, r);
        let l = wn(o) + wn(a);
        for (let h = e; h < i - e; h++) {
            const c = t.children[h];
            Ai(o, t.leaf ? r(c) : c),
            l += wn(o)
        }
        for (let h = i - e - 1; h >= e; h--) {
            const c = t.children[h];
            Ai(a, t.leaf ? r(c) : c),
            l += wn(a)
        }
        return l
    }
    _adjustParentBBoxes(t, e, i) {
        for (let n = i; n >= 0; n--)
            Ai(e[n], t)
    }
    _condense(t) {
        for (let e = t.length - 1, i; e >= 0; e--)
            t[e].children.length === 0 ? e > 0 ? (i = t[e - 1].children,
            i.splice(i.indexOf(t[e]), 1)) : this.clear() : Qe(t[e], this.toBBox)
    }
}
;
function id(s, t, e) {
    if (!e)
        return t.indexOf(s);
    for (let i = 0; i < t.length; i++)
        if (e(s, t[i]))
            return i;
    return -1
}
function Qe(s, t) {
    ki(s, 0, s.children.length, t, s)
}
function ki(s, t, e, i, n) {
    n || (n = li(null)),
    n.minX = 1 / 0,
    n.minY = 1 / 0,
    n.maxX = -1 / 0,
    n.maxY = -1 / 0;
    for (let r = t; r < e; r++) {
        const o = s.children[r];
        Ai(n, s.leaf ? i(o) : o)
    }
    return n
}
function Ai(s, t) {
    return s.minX = Math.min(s.minX, t.minX),
    s.minY = Math.min(s.minY, t.minY),
    s.maxX = Math.max(s.maxX, t.maxX),
    s.maxY = Math.max(s.maxY, t.maxY),
    s
}
function nd(s, t) {
    return s.minX - t.minX
}
function sd(s, t) {
    return s.minY - t.minY
}
function Ts(s) {
    return (s.maxX - s.minX) * (s.maxY - s.minY)
}
function wn(s) {
    return s.maxX - s.minX + (s.maxY - s.minY)
}
function rd(s, t) {
    return (Math.max(t.maxX, s.maxX) - Math.min(t.minX, s.minX)) * (Math.max(t.maxY, s.maxY) - Math.min(t.minY, s.minY))
}
function od(s, t) {
    const e = Math.max(s.minX, t.minX)
      , i = Math.max(s.minY, t.minY)
      , n = Math.min(s.maxX, t.maxX)
      , r = Math.min(s.maxY, t.maxY);
    return Math.max(0, n - e) * Math.max(0, r - i)
}
function Rs(s, t) {
    return s.minX <= t.minX && s.minY <= t.minY && t.maxX <= s.maxX && t.maxY <= s.maxY
}
function Sn(s, t) {
    return t.minX <= s.maxX && t.minY <= s.maxY && t.maxX >= s.minX && t.maxY >= s.minY
}
function li(s) {
    return {
        children: s,
        height: 1,
        leaf: !0,
        minX: 1 / 0,
        minY: 1 / 0,
        maxX: -1 / 0,
        maxY: -1 / 0
    }
}
function vo(s, t, e, i, n) {
    const r = [t, e];
    for (; r.length; ) {
        if (e = r.pop(),
        t = r.pop(),
        e - t <= i)
            continue;
        const o = t + Math.ceil((e - t) / i / 2) * i;
        td(s, o, t, e, n),
        r.push(t, o, o, e)
    }
}
class ad {
    constructor(t) {
        this.rbush_ = new gl(t),
        this.items_ = {}
    }
    insert(t, e) {
        const i = {
            minX: t[0],
            minY: t[1],
            maxX: t[2],
            maxY: t[3],
            value: e
        };
        this.rbush_.insert(i),
        this.items_[U(e)] = i
    }
    load(t, e) {
        const i = new Array(e.length);
        for (let n = 0, r = e.length; n < r; n++) {
            const o = t[n]
              , a = e[n]
              , l = {
                minX: o[0],
                minY: o[1],
                maxX: o[2],
                maxY: o[3],
                value: a
            };
            i[n] = l,
            this.items_[U(a)] = l
        }
        this.rbush_.load(i)
    }
    remove(t) {
        const e = U(t)
          , i = this.items_[e];
        return delete this.items_[e],
        this.rbush_.remove(i) !== null
    }
    update(t, e) {
        const i = this.items_[U(e)]
          , n = [i.minX, i.minY, i.maxX, i.maxY];
        yi(n, t) || (this.remove(e),
        this.insert(t, e))
    }
    getAll() {
        return this.rbush_.all().map(function(e) {
            return e.value
        })
    }
    getInExtent(t) {
        const e = {
            minX: t[0],
            minY: t[1],
            maxX: t[2],
            maxY: t[3]
        };
        return this.rbush_.search(e).map(function(n) {
            return n.value
        })
    }
    forEach(t) {
        return this.forEach_(this.getAll(), t)
    }
    forEachInExtent(t, e) {
        return this.forEach_(this.getInExtent(t), e)
    }
    forEach_(t, e) {
        let i;
        for (let n = 0, r = t.length; n < r; n++)
            if (i = e(t[n]),
            i)
                return i;
        return i
    }
    isEmpty() {
        return Ni(this.items_)
    }
    clear() {
        this.rbush_.clear(),
        this.items_ = {}
    }
    getExtent(t) {
        const e = this.rbush_.toJSON();
        return ge(e.minX, e.minY, e.maxX, e.maxY, t)
    }
    concat(t) {
        this.rbush_.load(t.rbush_.all());
        for (const e in t.items_)
            this.items_[e] = t.items_[e]
    }
}
const bo = ad;
class ld extends Bt {
    constructor(t) {
        super(),
        this.projection = Et(t.projection),
        this.attributions_ = Po(t.attributions),
        this.attributionsCollapsible_ = t.attributionsCollapsible !== void 0 ? t.attributionsCollapsible : !0,
        this.loading = !1,
        this.state_ = t.state !== void 0 ? t.state : "ready",
        this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1,
        this.interpolate_ = !!t.interpolate,
        this.viewResolver = null,
        this.viewRejector = null;
        const e = this;
        this.viewPromise_ = new Promise(function(i, n) {
            e.viewResolver = i,
            e.viewRejector = n
        }
        )
    }
    getAttributions() {
        return this.attributions_
    }
    getAttributionsCollapsible() {
        return this.attributionsCollapsible_
    }
    getProjection() {
        return this.projection
    }
    getResolutions(t) {
        return null
    }
    getView() {
        return this.viewPromise_
    }
    getState() {
        return this.state_
    }
    getWrapX() {
        return this.wrapX_
    }
    getInterpolate() {
        return this.interpolate_
    }
    refresh() {
        this.changed()
    }
    setAttributions(t) {
        this.attributions_ = Po(t),
        this.changed()
    }
    setState(t) {
        this.state_ = t,
        this.changed()
    }
}
function Po(s) {
    return s ? Array.isArray(s) ? function(t) {
        return s
    }
    : typeof s == "function" ? s : function(t) {
        return [s]
    }
    : null
}
const _l = ld
  , Gt = {
    ADDFEATURE: "addfeature",
    CHANGEFEATURE: "changefeature",
    CLEAR: "clear",
    REMOVEFEATURE: "removefeature",
    FEATURESLOADSTART: "featuresloadstart",
    FEATURESLOADEND: "featuresloadend",
    FEATURESLOADERROR: "featuresloaderror"
};
function hd(s, t) {
    return [[-1 / 0, -1 / 0, 1 / 0, 1 / 0]]
}
let cd = !1;
function ud(s, t, e, i, n, r, o) {
    const a = new XMLHttpRequest;
    a.open("GET", typeof s == "function" ? s(e, i, n) : s, !0),
    t.getType() == "arraybuffer" && (a.responseType = "arraybuffer"),
    a.withCredentials = cd,
    a.onload = function(l) {
        if (!a.status || a.status >= 200 && a.status < 300) {
            const h = t.getType();
            let c;
            h == "json" || h == "text" ? c = a.responseText : h == "xml" ? (c = a.responseXML,
            c || (c = new DOMParser().parseFromString(a.responseText, "application/xml"))) : h == "arraybuffer" && (c = a.response),
            c ? r(t.readFeatures(c, {
                extent: e,
                featureProjection: n
            }), t.readProjection(c)) : o()
        } else
            o()
    }
    ,
    a.onerror = o,
    a.send()
}
function ko(s, t) {
    return function(e, i, n, r, o) {
        const a = this;
        ud(s, t, e, i, n, function(l, h) {
            a.addFeatures(l),
            r !== void 0 && r(l)
        }, o || pi)
    }
}
class xe extends _e {
    constructor(t, e, i) {
        super(t),
        this.feature = e,
        this.features = i
    }
}
class dd extends _l {
    constructor(t) {
        t = t || {},
        super({
            attributions: t.attributions,
            interpolate: !0,
            projection: void 0,
            state: "ready",
            wrapX: t.wrapX !== void 0 ? t.wrapX : !0
        }),
        this.on,
        this.once,
        this.un,
        this.loader_ = pi,
        this.format_ = t.format,
        this.overlaps_ = t.overlaps === void 0 ? !0 : t.overlaps,
        this.url_ = t.url,
        t.loader !== void 0 ? this.loader_ = t.loader : this.url_ !== void 0 && (W(this.format_, 7),
        this.loader_ = ko(this.url_, this.format_)),
        this.strategy_ = t.strategy !== void 0 ? t.strategy : hd;
        const e = t.useSpatialIndex !== void 0 ? t.useSpatialIndex : !0;
        this.featuresRtree_ = e ? new bo : null,
        this.loadedExtentsRtree_ = new bo,
        this.loadingExtentsCount_ = 0,
        this.nullGeometryFeatures_ = {},
        this.idIndex_ = {},
        this.uidIndex_ = {},
        this.featureChangeKeys_ = {},
        this.featuresCollection_ = null;
        let i, n;
        Array.isArray(t.features) ? n = t.features : t.features && (i = t.features,
        n = i.getArray()),
        !e && i === void 0 && (i = new Xt(n)),
        n !== void 0 && this.addFeaturesInternal(n),
        i !== void 0 && this.bindFeaturesCollection_(i)
    }
    addFeature(t) {
        this.addFeatureInternal(t),
        this.changed()
    }
    addFeatureInternal(t) {
        const e = U(t);
        if (!this.addToIndex_(e, t)) {
            this.featuresCollection_ && this.featuresCollection_.remove(t);
            return
        }
        this.setupChangeEvents_(e, t);
        const i = t.getGeometry();
        if (i) {
            const n = i.getExtent();
            this.featuresRtree_ && this.featuresRtree_.insert(n, t)
        } else
            this.nullGeometryFeatures_[e] = t;
        this.dispatchEvent(new xe(Gt.ADDFEATURE,t))
    }
    setupChangeEvents_(t, e) {
        this.featureChangeKeys_[t] = [Y(e, G.CHANGE, this.handleFeatureChange_, this), Y(e, mi.PROPERTYCHANGE, this.handleFeatureChange_, this)]
    }
    addToIndex_(t, e) {
        let i = !0;
        const n = e.getId();
        return n !== void 0 && (n.toString()in this.idIndex_ ? i = !1 : this.idIndex_[n.toString()] = e),
        i && (W(!(t in this.uidIndex_), 30),
        this.uidIndex_[t] = e),
        i
    }
    addFeatures(t) {
        this.addFeaturesInternal(t),
        this.changed()
    }
    addFeaturesInternal(t) {
        const e = []
          , i = []
          , n = [];
        for (let r = 0, o = t.length; r < o; r++) {
            const a = t[r]
              , l = U(a);
            this.addToIndex_(l, a) && i.push(a)
        }
        for (let r = 0, o = i.length; r < o; r++) {
            const a = i[r]
              , l = U(a);
            this.setupChangeEvents_(l, a);
            const h = a.getGeometry();
            if (h) {
                const c = h.getExtent();
                e.push(c),
                n.push(a)
            } else
                this.nullGeometryFeatures_[l] = a
        }
        if (this.featuresRtree_ && this.featuresRtree_.load(e, n),
        this.hasListener(Gt.ADDFEATURE))
            for (let r = 0, o = i.length; r < o; r++)
                this.dispatchEvent(new xe(Gt.ADDFEATURE,i[r]))
    }
    bindFeaturesCollection_(t) {
        let e = !1;
        this.addEventListener(Gt.ADDFEATURE, function(i) {
            e || (e = !0,
            t.push(i.feature),
            e = !1)
        }),
        this.addEventListener(Gt.REMOVEFEATURE, function(i) {
            e || (e = !0,
            t.remove(i.feature),
            e = !1)
        }),
        t.addEventListener(Rt.ADD, i=>{
            e || (e = !0,
            this.addFeature(i.element),
            e = !1)
        }
        ),
        t.addEventListener(Rt.REMOVE, i=>{
            e || (e = !0,
            this.removeFeature(i.element),
            e = !1)
        }
        ),
        this.featuresCollection_ = t
    }
    clear(t) {
        if (t) {
            for (const i in this.featureChangeKeys_)
                this.featureChangeKeys_[i].forEach(et);
            this.featuresCollection_ || (this.featureChangeKeys_ = {},
            this.idIndex_ = {},
            this.uidIndex_ = {})
        } else if (this.featuresRtree_) {
            const i = n=>{
                this.removeFeatureInternal(n)
            }
            ;
            this.featuresRtree_.forEach(i);
            for (const n in this.nullGeometryFeatures_)
                this.removeFeatureInternal(this.nullGeometryFeatures_[n])
        }
        this.featuresCollection_ && this.featuresCollection_.clear(),
        this.featuresRtree_ && this.featuresRtree_.clear(),
        this.nullGeometryFeatures_ = {};
        const e = new xe(Gt.CLEAR);
        this.dispatchEvent(e),
        this.changed()
    }
    forEachFeature(t) {
        if (this.featuresRtree_)
            return this.featuresRtree_.forEach(t);
        this.featuresCollection_ && this.featuresCollection_.forEach(t)
    }
    forEachFeatureAtCoordinateDirect(t, e) {
        const i = [t[0], t[1], t[0], t[1]];
        return this.forEachFeatureInExtent(i, function(n) {
            if (n.getGeometry().intersectsCoordinate(t))
                return e(n)
        })
    }
    forEachFeatureInExtent(t, e) {
        if (this.featuresRtree_)
            return this.featuresRtree_.forEachInExtent(t, e);
        this.featuresCollection_ && this.featuresCollection_.forEach(e)
    }
    forEachFeatureIntersectingExtent(t, e) {
        return this.forEachFeatureInExtent(t, function(i) {
            if (i.getGeometry().intersectsExtent(t)) {
                const r = e(i);
                if (r)
                    return r
            }
        })
    }
    getFeaturesCollection() {
        return this.featuresCollection_
    }
    getFeatures() {
        let t;
        return this.featuresCollection_ ? t = this.featuresCollection_.getArray().slice(0) : this.featuresRtree_ && (t = this.featuresRtree_.getAll(),
        Ni(this.nullGeometryFeatures_) || ui(t, Object.values(this.nullGeometryFeatures_))),
        t
    }
    getFeaturesAtCoordinate(t) {
        const e = [];
        return this.forEachFeatureAtCoordinateDirect(t, function(i) {
            e.push(i)
        }),
        e
    }
    getFeaturesInExtent(t, e) {
        if (this.featuresRtree_) {
            if (!(e && e.canWrapX() && this.getWrapX()))
                return this.featuresRtree_.getInExtent(t);
            const n = Rh(t, e);
            return [].concat(...n.map(r=>this.featuresRtree_.getInExtent(r)))
        }
        return this.featuresCollection_ ? this.featuresCollection_.getArray().slice(0) : []
    }
    getClosestFeatureToCoordinate(t, e) {
        const i = t[0]
          , n = t[1];
        let r = null;
        const o = [NaN, NaN];
        let a = 1 / 0;
        const l = [-1 / 0, -1 / 0, 1 / 0, 1 / 0];
        return e = e || Di,
        this.featuresRtree_.forEachInExtent(l, function(h) {
            if (e(h)) {
                const c = h.getGeometry()
                  , u = a;
                if (a = c.closestPointXY(i, n, o, a),
                a < u) {
                    r = h;
                    const d = Math.sqrt(a);
                    l[0] = i - d,
                    l[1] = n - d,
                    l[2] = i + d,
                    l[3] = n + d
                }
            }
        }),
        r
    }
    getExtent(t) {
        return this.featuresRtree_.getExtent(t)
    }
    getFeatureById(t) {
        const e = this.idIndex_[t.toString()];
        return e !== void 0 ? e : null
    }
    getFeatureByUid(t) {
        const e = this.uidIndex_[t];
        return e !== void 0 ? e : null
    }
    getFormat() {
        return this.format_
    }
    getOverlaps() {
        return this.overlaps_
    }
    getUrl() {
        return this.url_
    }
    handleFeatureChange_(t) {
        const e = t.target
          , i = U(e)
          , n = e.getGeometry();
        if (!n)
            i in this.nullGeometryFeatures_ || (this.featuresRtree_ && this.featuresRtree_.remove(e),
            this.nullGeometryFeatures_[i] = e);
        else {
            const o = n.getExtent();
            i in this.nullGeometryFeatures_ ? (delete this.nullGeometryFeatures_[i],
            this.featuresRtree_ && this.featuresRtree_.insert(o, e)) : this.featuresRtree_ && this.featuresRtree_.update(o, e)
        }
        const r = e.getId();
        if (r !== void 0) {
            const o = r.toString();
            this.idIndex_[o] !== e && (this.removeFromIdIndex_(e),
            this.idIndex_[o] = e)
        } else
            this.removeFromIdIndex_(e),
            this.uidIndex_[i] = e;
        this.changed(),
        this.dispatchEvent(new xe(Gt.CHANGEFEATURE,e))
    }
    hasFeature(t) {
        const e = t.getId();
        return e !== void 0 ? e in this.idIndex_ : U(t)in this.uidIndex_
    }
    isEmpty() {
        return this.featuresRtree_ ? this.featuresRtree_.isEmpty() && Ni(this.nullGeometryFeatures_) : this.featuresCollection_ ? this.featuresCollection_.getLength() === 0 : !0
    }
    loadFeatures(t, e, i) {
        const n = this.loadedExtentsRtree_
          , r = this.strategy_(t, e, i);
        for (let o = 0, a = r.length; o < a; ++o) {
            const l = r[o];
            n.forEachInExtent(l, function(c) {
                return ce(c.extent, l)
            }) || (++this.loadingExtentsCount_,
            this.dispatchEvent(new xe(Gt.FEATURESLOADSTART)),
            this.loader_.call(this, l, e, i, c=>{
                --this.loadingExtentsCount_,
                this.dispatchEvent(new xe(Gt.FEATURESLOADEND,void 0,c))
            }
            , ()=>{
                --this.loadingExtentsCount_,
                this.dispatchEvent(new xe(Gt.FEATURESLOADERROR))
            }
            ),
            n.insert(l, {
                extent: l.slice()
            }))
        }
        this.loading = this.loader_.length < 4 ? !1 : this.loadingExtentsCount_ > 0
    }
    refresh() {
        this.clear(!0),
        this.loadedExtentsRtree_.clear(),
        super.refresh()
    }
    removeLoadedExtent(t) {
        const e = this.loadedExtentsRtree_;
        let i;
        e.forEachInExtent(t, function(n) {
            if (yi(n.extent, t))
                return i = n,
                !0
        }),
        i && e.remove(i)
    }
    removeFeature(t) {
        if (!t)
            return;
        const e = U(t);
        e in this.nullGeometryFeatures_ ? delete this.nullGeometryFeatures_[e] : this.featuresRtree_ && this.featuresRtree_.remove(t),
        this.removeFeatureInternal(t) && this.changed()
    }
    removeFeatureInternal(t) {
        const e = U(t)
          , i = this.featureChangeKeys_[e];
        if (!i)
            return;
        i.forEach(et),
        delete this.featureChangeKeys_[e];
        const n = t.getId();
        return n !== void 0 && delete this.idIndex_[n.toString()],
        delete this.uidIndex_[e],
        this.dispatchEvent(new xe(Gt.REMOVEFEATURE,t)),
        t
    }
    removeFromIdIndex_(t) {
        let e = !1;
        for (const i in this.idIndex_)
            if (this.idIndex_[i] === t) {
                delete this.idIndex_[i],
                e = !0;
                break
            }
        return e
    }
    setLoader(t) {
        this.loader_ = t
    }
    setUrl(t) {
        W(this.format_, 7),
        this.url_ = t,
        this.setLoader(ko(t, this.format_))
    }
}
const xt = dd;
class fd extends Qn {
    constructor(t, e, i) {
        super(),
        i = i || {},
        this.tileCoord = t,
        this.state = e,
        this.interimTile = null,
        this.key = "",
        this.transition_ = i.transition === void 0 ? 250 : i.transition,
        this.transitionStarts_ = {},
        this.interpolate = !!i.interpolate
    }
    changed() {
        this.dispatchEvent(G.CHANGE)
    }
    release() {
        this.state === k.ERROR && this.setState(k.EMPTY)
    }
    getKey() {
        return this.key + "/" + this.tileCoord
    }
    getInterimTile() {
        if (!this.interimTile)
            return this;
        let t = this.interimTile;
        do {
            if (t.getState() == k.LOADED)
                return this.transition_ = 0,
                t;
            t = t.interimTile
        } while (t);
        return this
    }
    refreshInterimChain() {
        if (!this.interimTile)
            return;
        let t = this.interimTile
          , e = this;
        do {
            if (t.getState() == k.LOADED) {
                t.interimTile = null;
                break
            } else
                t.getState() == k.LOADING ? e = t : t.getState() == k.IDLE ? e.interimTile = t.interimTile : e = t;
            t = e.interimTile
        } while (t)
    }
    getTileCoord() {
        return this.tileCoord
    }
    getState() {
        return this.state
    }
    setState(t) {
        if (this.state !== k.ERROR && this.state > t)
            throw new Error("Tile load sequence violation");
        this.state = t,
        this.changed()
    }
    load() {
        Z()
    }
    getAlpha(t, e) {
        if (!this.transition_)
            return 1;
        let i = this.transitionStarts_[t];
        if (!i)
            i = e,
            this.transitionStarts_[t] = i;
        else if (i === -1)
            return 1;
        const n = e - i + 1e3 / 60;
        return n >= this.transition_ ? 1 : Na(n / this.transition_)
    }
    inTransition(t) {
        return this.transition_ ? this.transitionStarts_[t] !== -1 : !1
    }
    endTransition(t) {
        this.transition_ && (this.transitionStarts_[t] = -1)
    }
}
const ml = fd;
class gd extends ml {
    constructor(t, e, i, n, r, o) {
        super(t, e, o),
        this.crossOrigin_ = n,
        this.src_ = i,
        this.key = i,
        this.image_ = new Image,
        n !== null && (this.image_.crossOrigin = n),
        this.unlisten_ = null,
        this.tileLoadFunction_ = r
    }
    getImage() {
        return this.image_
    }
    setImage(t) {
        this.image_ = t,
        this.state = k.LOADED,
        this.unlistenImage_(),
        this.changed()
    }
    handleImageError_() {
        this.state = k.ERROR,
        this.unlistenImage_(),
        this.image_ = _d(),
        this.changed()
    }
    handleImageLoad_() {
        const t = this.image_;
        t.naturalWidth && t.naturalHeight ? this.state = k.LOADED : this.state = k.EMPTY,
        this.unlistenImage_(),
        this.changed()
    }
    load() {
        this.state == k.ERROR && (this.state = k.IDLE,
        this.image_ = new Image,
        this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_)),
        this.state == k.IDLE && (this.state = k.LOADING,
        this.changed(),
        this.tileLoadFunction_(this, this.src_),
        this.unlisten_ = dl(this.image_, this.handleImageLoad_.bind(this), this.handleImageError_.bind(this)))
    }
    unlistenImage_() {
        this.unlisten_ && (this.unlisten_(),
        this.unlisten_ = null)
    }
}
function _d() {
    const s = wt(1, 1);
    return s.fillStyle = "rgba(0,0,0,0)",
    s.fillRect(0, 0, 1, 1),
    s.canvas
}
const pl = gd
  , md = .5
  , pd = 10
  , Ao = .25;
class yd {
    constructor(t, e, i, n, r, o) {
        this.sourceProj_ = t,
        this.targetProj_ = e;
        let a = {};
        const l = Jt(this.targetProj_, this.sourceProj_);
        this.transformInv_ = function(y) {
            const x = y[0] + "/" + y[1];
            return a[x] || (a[x] = l(y)),
            a[x]
        }
        ,
        this.maxSourceExtent_ = n,
        this.errorThresholdSquared_ = r * r,
        this.triangles_ = [],
        this.wrapsXInSource_ = !1,
        this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!n && !!this.sourceProj_.getExtent() && $(n) >= $(this.sourceProj_.getExtent()),
        this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? $(this.sourceProj_.getExtent()) : null,
        this.targetWorldWidth_ = this.targetProj_.getExtent() ? $(this.targetProj_.getExtent()) : null;
        const h = Ve(i)
          , c = ss(i)
          , u = ns(i)
          , d = is(i)
          , f = this.transformInv_(h)
          , g = this.transformInv_(c)
          , _ = this.transformInv_(u)
          , m = this.transformInv_(d)
          , p = pd + (o ? Math.max(0, Math.ceil(Math.log2(Ws(i) / (o * o * 256 * 256)))) : 0);
        if (this.addQuad_(h, c, u, d, f, g, _, m, p),
        this.wrapsXInSource_) {
            let y = 1 / 0;
            this.triangles_.forEach(function(x, E, w) {
                y = Math.min(y, x.source[0][0], x.source[1][0], x.source[2][0])
            }),
            this.triangles_.forEach(x=>{
                if (Math.max(x.source[0][0], x.source[1][0], x.source[2][0]) - y > this.sourceWorldWidth_ / 2) {
                    const E = [[x.source[0][0], x.source[0][1]], [x.source[1][0], x.source[1][1]], [x.source[2][0], x.source[2][1]]];
                    E[0][0] - y > this.sourceWorldWidth_ / 2 && (E[0][0] -= this.sourceWorldWidth_),
                    E[1][0] - y > this.sourceWorldWidth_ / 2 && (E[1][0] -= this.sourceWorldWidth_),
                    E[2][0] - y > this.sourceWorldWidth_ / 2 && (E[2][0] -= this.sourceWorldWidth_);
                    const w = Math.min(E[0][0], E[1][0], E[2][0]);
                    Math.max(E[0][0], E[1][0], E[2][0]) - w < this.sourceWorldWidth_ / 2 && (x.source = E)
                }
            }
            )
        }
        a = {}
    }
    addTriangle_(t, e, i, n, r, o) {
        this.triangles_.push({
            source: [n, r, o],
            target: [t, e, i]
        })
    }
    addQuad_(t, e, i, n, r, o, a, l, h) {
        const c = Qr([r, o, a, l])
          , u = this.sourceWorldWidth_ ? $(c) / this.sourceWorldWidth_ : null
          , d = this.sourceWorldWidth_
          , f = this.sourceProj_.canWrapX() && u > .5 && u < 1;
        let g = !1;
        if (h > 0) {
            if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
                const m = Qr([t, e, i, n]);
                g = $(m) / this.targetWorldWidth_ > Ao || g
            }
            !f && this.sourceProj_.isGlobal() && u && (g = u > Ao || g)
        }
        if (!g && this.maxSourceExtent_ && isFinite(c[0]) && isFinite(c[1]) && isFinite(c[2]) && isFinite(c[3]) && !mt(c, this.maxSourceExtent_))
            return;
        let _ = 0;
        if (!g && (!isFinite(r[0]) || !isFinite(r[1]) || !isFinite(o[0]) || !isFinite(o[1]) || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(l[0]) || !isFinite(l[1]))) {
            if (h > 0)
                g = !0;
            else if (_ = (!isFinite(r[0]) || !isFinite(r[1]) ? 8 : 0) + (!isFinite(o[0]) || !isFinite(o[1]) ? 4 : 0) + (!isFinite(a[0]) || !isFinite(a[1]) ? 2 : 0) + (!isFinite(l[0]) || !isFinite(l[1]) ? 1 : 0),
            _ != 1 && _ != 2 && _ != 4 && _ != 8)
                return
        }
        if (h > 0) {
            if (!g) {
                const m = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2]
                  , p = this.transformInv_(m);
                let y;
                f ? y = (Me(r[0], d) + Me(a[0], d)) / 2 - Me(p[0], d) : y = (r[0] + a[0]) / 2 - p[0];
                const x = (r[1] + a[1]) / 2 - p[1];
                g = y * y + x * x > this.errorThresholdSquared_
            }
            if (g) {
                if (Math.abs(t[0] - i[0]) <= Math.abs(t[1] - i[1])) {
                    const m = [(e[0] + i[0]) / 2, (e[1] + i[1]) / 2]
                      , p = this.transformInv_(m)
                      , y = [(n[0] + t[0]) / 2, (n[1] + t[1]) / 2]
                      , x = this.transformInv_(y);
                    this.addQuad_(t, e, m, y, r, o, p, x, h - 1),
                    this.addQuad_(y, m, i, n, x, p, a, l, h - 1)
                } else {
                    const m = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2]
                      , p = this.transformInv_(m)
                      , y = [(i[0] + n[0]) / 2, (i[1] + n[1]) / 2]
                      , x = this.transformInv_(y);
                    this.addQuad_(t, m, y, n, r, p, x, l, h - 1),
                    this.addQuad_(m, e, i, y, p, o, a, x, h - 1)
                }
                return
            }
        }
        if (f) {
            if (!this.canWrapXInSource_)
                return;
            this.wrapsXInSource_ = !0
        }
        _ & 11 || this.addTriangle_(t, i, n, r, a, l),
        _ & 14 || this.addTriangle_(t, i, e, r, a, o),
        _ && (_ & 13 || this.addTriangle_(e, n, t, o, l, r),
        _ & 7 || this.addTriangle_(e, n, i, o, l, a))
    }
    calculateSourceExtent() {
        const t = Yt();
        return this.triangles_.forEach(function(e, i, n) {
            const r = e.source;
            Oi(t, r[0]),
            Oi(t, r[1]),
            Oi(t, r[2])
        }),
        t
    }
    getTriangles() {
        return this.triangles_
    }
}
const xd = yd;
let Is;
const _i = [];
function Oo(s, t, e, i, n) {
    s.beginPath(),
    s.moveTo(0, 0),
    s.lineTo(t, e),
    s.lineTo(i, n),
    s.closePath(),
    s.save(),
    s.clip(),
    s.fillRect(0, 0, Math.max(t, i) + 1, Math.max(e, n)),
    s.restore()
}
function Ls(s, t) {
    return Math.abs(s[t * 4] - 210) > 2 || Math.abs(s[t * 4 + 3] - .75 * 255) > 2
}
function Ed() {
    if (Is === void 0) {
        const s = wt(6, 6, _i);
        s.globalCompositeOperation = "lighter",
        s.fillStyle = "rgba(210, 0, 0, 0.75)",
        Oo(s, 4, 5, 4, 0),
        Oo(s, 4, 5, 0, 5);
        const t = s.getImageData(0, 0, 3, 3).data;
        Is = Ls(t, 0) || Ls(t, 4) || Ls(t, 8),
        hs(s),
        _i.push(s.canvas)
    }
    return Is
}
function Fo(s, t, e, i) {
    const n = Q(e, t, s);
    let r = Yn(t, i, e);
    const o = t.getMetersPerUnit();
    o !== void 0 && (r *= o);
    const a = s.getMetersPerUnit();
    a !== void 0 && (r /= a);
    const l = s.getExtent();
    if (!l || he(l, n)) {
        const h = Yn(s, r, n) / r;
        isFinite(h) && h > 0 && (r /= h)
    }
    return r
}
function wd(s, t, e, i) {
    const n = ue(e);
    let r = Fo(s, t, n, i);
    return (!isFinite(r) || r <= 0) && Ra(e, function(o) {
        return r = Fo(s, t, o, i),
        isFinite(r) && r > 0
    }),
    r
}
function Sd(s, t, e, i, n, r, o, a, l, h, c, u) {
    const d = wt(Math.round(e * s), Math.round(e * t), _i);
    if (u || (d.imageSmoothingEnabled = !1),
    l.length === 0)
        return d.canvas;
    d.scale(e, e);
    function f(E) {
        return Math.round(E * e) / e
    }
    d.globalCompositeOperation = "lighter";
    const g = Yt();
    l.forEach(function(E, w, R) {
        Eh(g, E.extent)
    });
    const _ = $(g)
      , m = qt(g)
      , p = wt(Math.round(e * _ / i), Math.round(e * m / i), _i);
    u || (p.imageSmoothingEnabled = !1);
    const y = e / i;
    l.forEach(function(E, w, R) {
        const T = E.extent[0] - g[0]
          , L = -(E.extent[3] - g[3])
          , v = $(E.extent)
          , b = qt(E.extent);
        E.image.width > 0 && E.image.height > 0 && p.drawImage(E.image, h, h, E.image.width - 2 * h, E.image.height - 2 * h, T * y, L * y, v * y, b * y)
    });
    const x = Ve(o);
    return a.getTriangles().forEach(function(E, w, R) {
        const T = E.source
          , L = E.target;
        let v = T[0][0]
          , b = T[0][1]
          , D = T[1][0]
          , O = T[1][1]
          , F = T[2][0]
          , K = T[2][1];
        const S = f((L[0][0] - x[0]) / r)
          , M = f(-(L[0][1] - x[1]) / r)
          , I = f((L[1][0] - x[0]) / r)
          , P = f(-(L[1][1] - x[1]) / r)
          , X = f((L[2][0] - x[0]) / r)
          , z = f(-(L[2][1] - x[1]) / r)
          , q = v
          , C = b;
        v = 0,
        b = 0,
        D -= q,
        O -= C,
        F -= q,
        K -= C;
        const pt = [[D, O, 0, 0, I - S], [F, K, 0, 0, X - S], [0, 0, D, O, P - M], [0, 0, F, K, z - M]]
          , B = Ih(pt);
        if (B) {
            if (d.save(),
            d.beginPath(),
            Ed() || !u) {
                d.moveTo(I, P);
                const V = 4
                  , bt = S - I
                  , ut = M - P;
                for (let ct = 0; ct < V; ct++)
                    d.lineTo(I + f((ct + 1) * bt / V), P + f(ct * ut / (V - 1))),
                    ct != V - 1 && d.lineTo(I + f((ct + 1) * bt / V), P + f((ct + 1) * ut / (V - 1)));
                d.lineTo(X, z)
            } else
                d.moveTo(I, P),
                d.lineTo(S, M),
                d.lineTo(X, z);
            d.clip(),
            d.transform(B[0], B[2], B[1], B[3], S, M),
            d.translate(g[0] - q, g[3] - C),
            d.scale(i / e, -i / e),
            d.drawImage(p.canvas, 0, 0),
            d.restore()
        }
    }),
    hs(p),
    _i.push(p.canvas),
    c && (d.save(),
    d.globalCompositeOperation = "source-over",
    d.strokeStyle = "black",
    d.lineWidth = 1,
    a.getTriangles().forEach(function(E, w, R) {
        const T = E.target
          , L = (T[0][0] - x[0]) / r
          , v = -(T[0][1] - x[1]) / r
          , b = (T[1][0] - x[0]) / r
          , D = -(T[1][1] - x[1]) / r
          , O = (T[2][0] - x[0]) / r
          , F = -(T[2][1] - x[1]) / r;
        d.beginPath(),
        d.moveTo(b, D),
        d.lineTo(L, v),
        d.lineTo(O, F),
        d.closePath(),
        d.stroke()
    }),
    d.restore()),
    d.canvas
}
class Cd extends ml {
    constructor(t, e, i, n, r, o, a, l, h, c, u, d) {
        super(r, k.IDLE, {
            interpolate: !!d
        }),
        this.renderEdges_ = u !== void 0 ? u : !1,
        this.pixelRatio_ = a,
        this.gutter_ = l,
        this.canvas_ = null,
        this.sourceTileGrid_ = e,
        this.targetTileGrid_ = n,
        this.wrappedTileCoord_ = o || r,
        this.sourceTiles_ = [],
        this.sourcesListenerKeys_ = null,
        this.sourceZ_ = 0;
        const f = n.getTileCoordExtent(this.wrappedTileCoord_)
          , g = this.targetTileGrid_.getExtent();
        let _ = this.sourceTileGrid_.getExtent();
        const m = g ? di(f, g) : f;
        if (Ws(m) === 0) {
            this.state = k.EMPTY;
            return
        }
        const p = t.getExtent();
        p && (_ ? _ = di(_, p) : _ = p);
        const y = n.getResolution(this.wrappedTileCoord_[0])
          , x = wd(t, i, m, y);
        if (!isFinite(x) || x <= 0) {
            this.state = k.EMPTY;
            return
        }
        const E = c !== void 0 ? c : md;
        if (this.triangulation_ = new xd(t,i,m,_,x * E,y),
        this.triangulation_.getTriangles().length === 0) {
            this.state = k.EMPTY;
            return
        }
        this.sourceZ_ = e.getZForResolution(x);
        let w = this.triangulation_.calculateSourceExtent();
        if (_ && (t.canWrapX() ? (w[1] = N(w[1], _[1], _[3]),
        w[3] = N(w[3], _[1], _[3])) : w = di(w, _)),
        !Ws(w))
            this.state = k.EMPTY;
        else {
            const R = e.getTileRangeForExtentAndZ(w, this.sourceZ_);
            for (let T = R.minX; T <= R.maxX; T++)
                for (let L = R.minY; L <= R.maxY; L++) {
                    const v = h(this.sourceZ_, T, L, a);
                    v && this.sourceTiles_.push(v)
                }
            this.sourceTiles_.length === 0 && (this.state = k.EMPTY)
        }
    }
    getImage() {
        return this.canvas_
    }
    reproject_() {
        const t = [];
        if (this.sourceTiles_.forEach(e=>{
            e && e.getState() == k.LOADED && t.push({
                extent: this.sourceTileGrid_.getTileCoordExtent(e.tileCoord),
                image: e.getImage()
            })
        }
        ),
        this.sourceTiles_.length = 0,
        t.length === 0)
            this.state = k.ERROR;
        else {
            const e = this.wrappedTileCoord_[0]
              , i = this.targetTileGrid_.getTileSize(e)
              , n = typeof i == "number" ? i : i[0]
              , r = typeof i == "number" ? i : i[1]
              , o = this.targetTileGrid_.getResolution(e)
              , a = this.sourceTileGrid_.getResolution(this.sourceZ_)
              , l = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
            this.canvas_ = Sd(n, r, this.pixelRatio_, a, this.sourceTileGrid_.getExtent(), o, l, this.triangulation_, t, this.gutter_, this.renderEdges_, this.interpolate),
            this.state = k.LOADED
        }
        this.changed()
    }
    load() {
        if (this.state == k.IDLE) {
            this.state = k.LOADING,
            this.changed();
            let t = 0;
            this.sourcesListenerKeys_ = [],
            this.sourceTiles_.forEach(e=>{
                const i = e.getState();
                if (i == k.IDLE || i == k.LOADING) {
                    t++;
                    const n = Y(e, G.CHANGE, function(r) {
                        const o = e.getState();
                        (o == k.LOADED || o == k.ERROR || o == k.EMPTY) && (et(n),
                        t--,
                        t === 0 && (this.unlistenSources_(),
                        this.reproject_()))
                    }, this);
                    this.sourcesListenerKeys_.push(n)
                }
            }
            ),
            t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach(function(e, i, n) {
                e.getState() == k.IDLE && e.load()
            })
        }
    }
    unlistenSources_() {
        this.sourcesListenerKeys_.forEach(et),
        this.sourcesListenerKeys_ = null
    }
    release() {
        this.canvas_ && (hs(this.canvas_.getContext("2d")),
        _i.push(this.canvas_),
        this.canvas_ = null),
        super.release()
    }
}
const Js = Cd;
class Td {
    constructor(t) {
        this.highWaterMark = t !== void 0 ? t : 2048,
        this.count_ = 0,
        this.entries_ = {},
        this.oldest_ = null,
        this.newest_ = null
    }
    canExpireCache() {
        return this.highWaterMark > 0 && this.getCount() > this.highWaterMark
    }
    expireCache(t) {
        for (; this.canExpireCache(); )
            this.pop()
    }
    clear() {
        this.count_ = 0,
        this.entries_ = {},
        this.oldest_ = null,
        this.newest_ = null
    }
    containsKey(t) {
        return this.entries_.hasOwnProperty(t)
    }
    forEach(t) {
        let e = this.oldest_;
        for (; e; )
            t(e.value_, e.key_, this),
            e = e.newer
    }
    get(t, e) {
        const i = this.entries_[t];
        return W(i !== void 0, 15),
        i === this.newest_ || (i === this.oldest_ ? (this.oldest_ = this.oldest_.newer,
        this.oldest_.older = null) : (i.newer.older = i.older,
        i.older.newer = i.newer),
        i.newer = null,
        i.older = this.newest_,
        this.newest_.newer = i,
        this.newest_ = i),
        i.value_
    }
    remove(t) {
        const e = this.entries_[t];
        return W(e !== void 0, 15),
        e === this.newest_ ? (this.newest_ = e.older,
        this.newest_ && (this.newest_.newer = null)) : e === this.oldest_ ? (this.oldest_ = e.newer,
        this.oldest_ && (this.oldest_.older = null)) : (e.newer.older = e.older,
        e.older.newer = e.newer),
        delete this.entries_[t],
        --this.count_,
        e.value_
    }
    getCount() {
        return this.count_
    }
    getKeys() {
        const t = new Array(this.count_);
        let e = 0, i;
        for (i = this.newest_; i; i = i.older)
            t[e++] = i.key_;
        return t
    }
    getValues() {
        const t = new Array(this.count_);
        let e = 0, i;
        for (i = this.newest_; i; i = i.older)
            t[e++] = i.value_;
        return t
    }
    peekLast() {
        return this.oldest_.value_
    }
    peekLastKey() {
        return this.oldest_.key_
    }
    peekFirstKey() {
        return this.newest_.key_
    }
    peek(t) {
        if (this.containsKey(t))
            return this.entries_[t].value_
    }
    pop() {
        const t = this.oldest_;
        return delete this.entries_[t.key_],
        t.newer && (t.newer.older = null),
        this.oldest_ = t.newer,
        this.oldest_ || (this.newest_ = null),
        --this.count_,
        t.value_
    }
    replace(t, e) {
        this.get(t),
        this.entries_[t].value_ = e
    }
    set(t, e) {
        W(!(t in this.entries_), 16);
        const i = {
            key_: t,
            newer: null,
            older: this.newest_,
            value_: e
        };
        this.newest_ ? this.newest_.newer = i : this.oldest_ = i,
        this.newest_ = i,
        this.entries_[t] = i,
        ++this.count_
    }
    setSize(t) {
        this.highWaterMark = t
    }
}
const Rd = Td;
function Do(s, t, e, i) {
    return i !== void 0 ? (i[0] = s,
    i[1] = t,
    i[2] = e,
    i) : [s, t, e]
}
function ds(s, t, e) {
    return s + "/" + t + "/" + e
}
function yl(s) {
    return ds(s[0], s[1], s[2])
}
function Id(s) {
    return s.split("/").map(Number)
}
function Ld(s) {
    return (s[1] << s[0]) + s[2]
}
function Md(s, t) {
    const e = s[0]
      , i = s[1]
      , n = s[2];
    if (t.getMinZoom() > e || e > t.getMaxZoom())
        return !1;
    const r = t.getFullTileRange(e);
    return r ? r.containsXY(i, n) : !0
}
class vd extends Rd {
    clear() {
        for (; this.getCount() > 0; )
            this.pop().release();
        super.clear()
    }
    expireCache(t) {
        for (; this.canExpireCache() && !(this.peekLast().getKey()in t); )
            this.pop().release()
    }
    pruneExceptNewestZ() {
        if (this.getCount() === 0)
            return;
        const t = this.peekFirstKey()
          , i = Id(t)[0];
        this.forEach(n=>{
            n.tileCoord[0] !== i && (this.remove(yl(n.tileCoord)),
            n.release())
        }
        )
    }
}
const xl = vd
  , Ms = {
    TILELOADSTART: "tileloadstart",
    TILELOADEND: "tileloadend",
    TILELOADERROR: "tileloaderror"
};
class El {
    constructor(t, e, i, n) {
        this.minX = t,
        this.maxX = e,
        this.minY = i,
        this.maxY = n
    }
    contains(t) {
        return this.containsXY(t[1], t[2])
    }
    containsTileRange(t) {
        return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY
    }
    containsXY(t, e) {
        return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY
    }
    equals(t) {
        return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY
    }
    extend(t) {
        t.minX < this.minX && (this.minX = t.minX),
        t.maxX > this.maxX && (this.maxX = t.maxX),
        t.minY < this.minY && (this.minY = t.minY),
        t.maxY > this.maxY && (this.maxY = t.maxY)
    }
    getHeight() {
        return this.maxY - this.minY + 1
    }
    getSize() {
        return [this.getWidth(), this.getHeight()]
    }
    getWidth() {
        return this.maxX - this.minX + 1
    }
    intersects(t) {
        return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY
    }
}
function ti(s, t, e, i, n) {
    return n !== void 0 ? (n.minX = s,
    n.maxX = t,
    n.minY = e,
    n.maxY = i,
    n) : new El(s,t,e,i)
}
const wl = El
  , ei = [0, 0, 0]
  , Ee = 5;
class bd {
    constructor(t) {
        this.minZoom = t.minZoom !== void 0 ? t.minZoom : 0,
        this.resolutions_ = t.resolutions,
        W(ih(this.resolutions_, function(n, r) {
            return r - n
        }, !0), 17);
        let e;
        if (!t.origins) {
            for (let n = 0, r = this.resolutions_.length - 1; n < r; ++n)
                if (!e)
                    e = this.resolutions_[n] / this.resolutions_[n + 1];
                else if (this.resolutions_[n] / this.resolutions_[n + 1] !== e) {
                    e = void 0;
                    break
                }
        }
        this.zoomFactor_ = e,
        this.maxZoom = this.resolutions_.length - 1,
        this.origin_ = t.origin !== void 0 ? t.origin : null,
        this.origins_ = null,
        t.origins !== void 0 && (this.origins_ = t.origins,
        W(this.origins_.length == this.resolutions_.length, 20));
        const i = t.extent;
        i !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = Ve(i)),
        W(!this.origin_ && this.origins_ || this.origin_ && !this.origins_, 18),
        this.tileSizes_ = null,
        t.tileSizes !== void 0 && (this.tileSizes_ = t.tileSizes,
        W(this.tileSizes_.length == this.resolutions_.length, 19)),
        this.tileSize_ = t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : dr,
        W(!this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_, 22),
        this.extent_ = i !== void 0 ? i : null,
        this.fullTileRanges_ = null,
        this.tmpSize_ = [0, 0],
        this.tmpExtent_ = [0, 0, 0, 0],
        t.sizes !== void 0 ? this.fullTileRanges_ = t.sizes.map(function(n, r) {
            const o = new wl(Math.min(0, n[0]),Math.max(n[0] - 1, -1),Math.min(0, n[1]),Math.max(n[1] - 1, -1));
            if (i) {
                const a = this.getTileRangeForExtentAndZ(i, r);
                o.minX = Math.max(a.minX, o.minX),
                o.maxX = Math.min(a.maxX, o.maxX),
                o.minY = Math.max(a.minY, o.minY),
                o.maxY = Math.min(a.maxY, o.maxY)
            }
            return o
        }, this) : i && this.calculateTileRanges_(i)
    }
    forEachTileCoord(t, e, i) {
        const n = this.getTileRangeForExtentAndZ(t, e);
        for (let r = n.minX, o = n.maxX; r <= o; ++r)
            for (let a = n.minY, l = n.maxY; a <= l; ++a)
                i([e, r, a])
    }
    forEachTileCoordParentTileRange(t, e, i, n) {
        let r, o, a, l = null, h = t[0] - 1;
        for (this.zoomFactor_ === 2 ? (o = t[1],
        a = t[2]) : l = this.getTileCoordExtent(t, n); h >= this.minZoom; ) {
            if (this.zoomFactor_ === 2 ? (o = Math.floor(o / 2),
            a = Math.floor(a / 2),
            r = ti(o, o, a, a, i)) : r = this.getTileRangeForExtentAndZ(l, h, i),
            e(h, r))
                return !0;
            --h
        }
        return !1
    }
    getExtent() {
        return this.extent_
    }
    getMaxZoom() {
        return this.maxZoom
    }
    getMinZoom() {
        return this.minZoom
    }
    getOrigin(t) {
        return this.origin_ ? this.origin_ : this.origins_[t]
    }
    getResolution(t) {
        return this.resolutions_[t]
    }
    getResolutions() {
        return this.resolutions_
    }
    getTileCoordChildTileRange(t, e, i) {
        if (t[0] < this.maxZoom) {
            if (this.zoomFactor_ === 2) {
                const r = t[1] * 2
                  , o = t[2] * 2;
                return ti(r, r + 1, o, o + 1, e)
            }
            const n = this.getTileCoordExtent(t, i || this.tmpExtent_);
            return this.getTileRangeForExtentAndZ(n, t[0] + 1, e)
        }
        return null
    }
    getTileRangeForTileCoordAndZ(t, e, i) {
        if (e > this.maxZoom || e < this.minZoom)
            return null;
        const n = t[0]
          , r = t[1]
          , o = t[2];
        if (e === n)
            return ti(r, o, r, o, i);
        if (this.zoomFactor_) {
            const l = Math.pow(this.zoomFactor_, e - n)
              , h = Math.floor(r * l)
              , c = Math.floor(o * l);
            if (e < n)
                return ti(h, h, c, c, i);
            const u = Math.floor(l * (r + 1)) - 1
              , d = Math.floor(l * (o + 1)) - 1;
            return ti(h, u, c, d, i)
        }
        const a = this.getTileCoordExtent(t, this.tmpExtent_);
        return this.getTileRangeForExtentAndZ(a, e, i)
    }
    getTileRangeForExtentAndZ(t, e, i) {
        this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, ei);
        const n = ei[1]
          , r = ei[2];
        this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, ei);
        const o = ei[1]
          , a = ei[2];
        return ti(n, o, r, a, i)
    }
    getTileCoordCenter(t) {
        const e = this.getOrigin(t[0])
          , i = this.getResolution(t[0])
          , n = Ft(this.getTileSize(t[0]), this.tmpSize_);
        return [e[0] + (t[1] + .5) * n[0] * i, e[1] - (t[2] + .5) * n[1] * i]
    }
    getTileCoordExtent(t, e) {
        const i = this.getOrigin(t[0])
          , n = this.getResolution(t[0])
          , r = Ft(this.getTileSize(t[0]), this.tmpSize_)
          , o = i[0] + t[1] * r[0] * n
          , a = i[1] - (t[2] + 1) * r[1] * n
          , l = o + r[0] * n
          , h = a + r[1] * n;
        return ge(o, a, l, h, e)
    }
    getTileCoordForCoordAndResolution(t, e, i) {
        return this.getTileCoordForXYAndResolution_(t[0], t[1], e, !1, i)
    }
    getTileCoordForXYAndResolution_(t, e, i, n, r) {
        const o = this.getZForResolution(i)
          , a = i / this.getResolution(o)
          , l = this.getOrigin(o)
          , h = Ft(this.getTileSize(o), this.tmpSize_);
        let c = a * (t - l[0]) / i / h[0]
          , u = a * (l[1] - e) / i / h[1];
        return n ? (c = mn(c, Ee) - 1,
        u = mn(u, Ee) - 1) : (c = _n(c, Ee),
        u = _n(u, Ee)),
        Do(o, c, u, r)
    }
    getTileCoordForXYAndZ_(t, e, i, n, r) {
        const o = this.getOrigin(i)
          , a = this.getResolution(i)
          , l = Ft(this.getTileSize(i), this.tmpSize_);
        let h = (t - o[0]) / a / l[0]
          , c = (o[1] - e) / a / l[1];
        return n ? (h = mn(h, Ee) - 1,
        c = mn(c, Ee) - 1) : (h = _n(h, Ee),
        c = _n(c, Ee)),
        Do(i, h, c, r)
    }
    getTileCoordForCoordAndZ(t, e, i) {
        return this.getTileCoordForXYAndZ_(t[0], t[1], e, !1, i)
    }
    getTileCoordResolution(t) {
        return this.resolutions_[t[0]]
    }
    getTileSize(t) {
        return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t]
    }
    getFullTileRange(t) {
        return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null
    }
    getZForResolution(t, e) {
        const i = lr(this.resolutions_, t, e || 0);
        return N(i, this.minZoom, this.maxZoom)
    }
    tileCoordIntersectsViewport(t, e) {
        return Va(e, 0, e.length, 2, this.getTileCoordExtent(t))
    }
    calculateTileRanges_(t) {
        const e = this.resolutions_.length
          , i = new Array(e);
        for (let n = this.minZoom; n < e; ++n)
            i[n] = this.getTileRangeForExtentAndZ(t, n);
        this.fullTileRanges_ = i
    }
}
const Sl = bd;
function Cl(s) {
    let t = s.getDefaultTileGrid();
    return t || (t = Od(s),
    s.setDefaultTileGrid(t)),
    t
}
function Pd(s, t, e) {
    const i = t[0]
      , n = s.getTileCoordCenter(t)
      , r = Wr(e);
    if (!he(r, n)) {
        const o = $(r)
          , a = Math.ceil((r[0] - n[0]) / o);
        return n[0] += o * a,
        s.getTileCoordForCoordAndZ(n, i)
    }
    return t
}
function kd(s, t, e, i) {
    i = i !== void 0 ? i : "top-left";
    const n = Tl(s, t, e);
    return new Sl({
        extent: s,
        origin: Sh(s, i),
        resolutions: n,
        tileSize: e
    })
}
function Ad(s) {
    const t = s || {}
      , e = t.extent || Et("EPSG:3857").getExtent()
      , i = {
        extent: e,
        minZoom: t.minZoom,
        tileSize: t.tileSize,
        resolutions: Tl(e, t.maxZoom, t.tileSize, t.maxResolution)
    };
    return new Sl(i)
}
function Tl(s, t, e, i) {
    t = t !== void 0 ? t : Oh,
    e = Ft(e !== void 0 ? e : dr);
    const n = qt(s)
      , r = $(s);
    i = i > 0 ? i : Math.max(r / e[0], n / e[1]);
    const o = t + 1
      , a = new Array(o);
    for (let l = 0; l < o; ++l)
        a[l] = i / Math.pow(2, l);
    return a
}
function Od(s, t, e, i) {
    const n = Wr(s);
    return kd(n, t, e, i)
}
function Wr(s) {
    s = Et(s);
    let t = s.getExtent();
    if (!t) {
        const e = 180 * xi.degrees / s.getMetersPerUnit();
        t = ge(-e, -e, e, e)
    }
    return t
}
class Fd extends _l {
    constructor(t) {
        super({
            attributions: t.attributions,
            attributionsCollapsible: t.attributionsCollapsible,
            projection: t.projection,
            state: t.state,
            wrapX: t.wrapX,
            interpolate: t.interpolate
        }),
        this.on,
        this.once,
        this.un,
        this.opaque_ = t.opaque !== void 0 ? t.opaque : !1,
        this.tilePixelRatio_ = t.tilePixelRatio !== void 0 ? t.tilePixelRatio : 1,
        this.tileGrid = t.tileGrid !== void 0 ? t.tileGrid : null;
        const e = [256, 256];
        this.tileGrid && Ft(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e),
        this.tileCache = new xl(t.cacheSize || 0),
        this.tmpSize = [0, 0],
        this.key_ = t.key || "",
        this.tileOptions = {
            transition: t.transition,
            interpolate: t.interpolate
        },
        this.zDirection = t.zDirection ? t.zDirection : 0
    }
    canExpireCache() {
        return this.tileCache.canExpireCache()
    }
    expireCache(t, e) {
        const i = this.getTileCacheForProjection(t);
        i && i.expireCache(e)
    }
    forEachLoadedTile(t, e, i, n) {
        const r = this.getTileCacheForProjection(t);
        if (!r)
            return !1;
        let o = !0, a, l, h;
        for (let c = i.minX; c <= i.maxX; ++c)
            for (let u = i.minY; u <= i.maxY; ++u)
                l = ds(e, c, u),
                h = !1,
                r.containsKey(l) && (a = r.get(l),
                h = a.getState() === k.LOADED,
                h && (h = n(a) !== !1)),
                h || (o = !1);
        return o
    }
    getGutterForProjection(t) {
        return 0
    }
    getKey() {
        return this.key_
    }
    setKey(t) {
        this.key_ !== t && (this.key_ = t,
        this.changed())
    }
    getOpaque(t) {
        return this.opaque_
    }
    getResolutions(t) {
        const e = t ? this.getTileGridForProjection(t) : this.tileGrid;
        return e ? e.getResolutions() : null
    }
    getTile(t, e, i, n, r) {
        return Z()
    }
    getTileGrid() {
        return this.tileGrid
    }
    getTileGridForProjection(t) {
        return this.tileGrid ? this.tileGrid : Cl(t)
    }
    getTileCacheForProjection(t) {
        const e = this.getProjection();
        return W(e === null || De(e, t), 68),
        this.tileCache
    }
    getTilePixelRatio(t) {
        return this.tilePixelRatio_
    }
    getTilePixelSize(t, e, i) {
        const n = this.getTileGridForProjection(i)
          , r = this.getTilePixelRatio(e)
          , o = Ft(n.getTileSize(t), this.tmpSize);
        return r == 1 ? o : Wu(o, r, this.tmpSize)
    }
    getTileCoordForTileUrlFunction(t, e) {
        e = e !== void 0 ? e : this.getProjection();
        const i = this.getTileGridForProjection(e);
        return this.getWrapX() && e.isGlobal() && (t = Pd(i, t, e)),
        Md(t, i) ? t : null
    }
    clear() {
        this.tileCache.clear()
    }
    refresh() {
        this.clear(),
        super.refresh()
    }
    updateCacheSize(t, e) {
        const i = this.getTileCacheForProjection(e);
        t > i.highWaterMark && (i.highWaterMark = t)
    }
    useTile(t, e, i, n) {}
}
class Dd extends _e {
    constructor(t, e) {
        super(t),
        this.tile = e
    }
}
const Nd = Fd;
function Gd(s, t) {
    const e = /\{z\}/g
      , i = /\{x\}/g
      , n = /\{y\}/g
      , r = /\{-y\}/g;
    return function(o, a, l) {
        if (o)
            return s.replace(e, o[0].toString()).replace(i, o[1].toString()).replace(n, o[2].toString()).replace(r, function() {
                const h = o[0]
                  , c = t.getFullTileRange(h);
                return W(c, 55),
                (c.getHeight() - o[2] - 1).toString()
            })
    }
}
function zd(s, t) {
    const e = s.length
      , i = new Array(e);
    for (let n = 0; n < e; ++n)
        i[n] = Gd(s[n], t);
    return Wd(i)
}
function Wd(s) {
    return s.length === 1 ? s[0] : function(t, e, i) {
        if (!t)
            return;
        const n = Ld(t)
          , r = Me(n, s.length);
        return s[r](t, e, i)
    }
}
function Xd(s) {
    const t = [];
    let e = /\{([a-z])-([a-z])\}/.exec(s);
    if (e) {
        const i = e[1].charCodeAt(0)
          , n = e[2].charCodeAt(0);
        let r;
        for (r = i; r <= n; ++r)
            t.push(s.replace(e[0], String.fromCharCode(r)));
        return t
    }
    if (e = /\{(\d+)-(\d+)\}/.exec(s),
    e) {
        const i = parseInt(e[2], 10);
        for (let n = parseInt(e[1], 10); n <= i; n++)
            t.push(s.replace(e[0], n.toString()));
        return t
    }
    return t.push(s),
    t
}
class Xr extends Nd {
    constructor(t) {
        super({
            attributions: t.attributions,
            cacheSize: t.cacheSize,
            opaque: t.opaque,
            projection: t.projection,
            state: t.state,
            tileGrid: t.tileGrid,
            tilePixelRatio: t.tilePixelRatio,
            wrapX: t.wrapX,
            transition: t.transition,
            interpolate: t.interpolate,
            key: t.key,
            attributionsCollapsible: t.attributionsCollapsible,
            zDirection: t.zDirection
        }),
        this.generateTileUrlFunction_ = this.tileUrlFunction === Xr.prototype.tileUrlFunction,
        this.tileLoadFunction = t.tileLoadFunction,
        t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction),
        this.urls = null,
        t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url),
        this.tileLoadingKeys_ = {}
    }
    getTileLoadFunction() {
        return this.tileLoadFunction
    }
    getTileUrlFunction() {
        return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction
    }
    getUrls() {
        return this.urls
    }
    handleTileChange(t) {
        const e = t.target
          , i = U(e)
          , n = e.getState();
        let r;
        n == k.LOADING ? (this.tileLoadingKeys_[i] = !0,
        r = Ms.TILELOADSTART) : i in this.tileLoadingKeys_ && (delete this.tileLoadingKeys_[i],
        r = n == k.ERROR ? Ms.TILELOADERROR : n == k.LOADED ? Ms.TILELOADEND : void 0),
        r != null && this.dispatchEvent(new Dd(r,e))
    }
    setTileLoadFunction(t) {
        this.tileCache.clear(),
        this.tileLoadFunction = t,
        this.changed()
    }
    setTileUrlFunction(t, e) {
        this.tileUrlFunction = t,
        this.tileCache.pruneExceptNewestZ(),
        typeof e < "u" ? this.setKey(e) : this.changed()
    }
    setUrl(t) {
        const e = Xd(t);
        this.urls = e,
        this.setUrls(e)
    }
    setUrls(t) {
        this.urls = t;
        const e = t.join(`
`);
        this.generateTileUrlFunction_ ? this.setTileUrlFunction(zd(t, this.tileGrid), e) : this.setKey(e)
    }
    tileUrlFunction(t, e, i) {}
    useTile(t, e, i) {
        const n = ds(t, e, i);
        this.tileCache.containsKey(n) && this.tileCache.get(n)
    }
}
const Yd = Xr;
class Bd extends Yd {
    constructor(t) {
        super({
            attributions: t.attributions,
            cacheSize: t.cacheSize,
            opaque: t.opaque,
            projection: t.projection,
            state: t.state,
            tileGrid: t.tileGrid,
            tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : Zd,
            tilePixelRatio: t.tilePixelRatio,
            tileUrlFunction: t.tileUrlFunction,
            url: t.url,
            urls: t.urls,
            wrapX: t.wrapX,
            transition: t.transition,
            interpolate: t.interpolate !== void 0 ? t.interpolate : !0,
            key: t.key,
            attributionsCollapsible: t.attributionsCollapsible,
            zDirection: t.zDirection
        }),
        this.crossOrigin = t.crossOrigin !== void 0 ? t.crossOrigin : null,
        this.tileClass = t.tileClass !== void 0 ? t.tileClass : pl,
        this.tileCacheForProjection = {},
        this.tileGridForProjection = {},
        this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold,
        this.renderReprojectionEdges_ = !1
    }
    canExpireCache() {
        if (this.tileCache.canExpireCache())
            return !0;
        for (const t in this.tileCacheForProjection)
            if (this.tileCacheForProjection[t].canExpireCache())
                return !0;
        return !1
    }
    expireCache(t, e) {
        const i = this.getTileCacheForProjection(t);
        this.tileCache.expireCache(this.tileCache == i ? e : {});
        for (const n in this.tileCacheForProjection) {
            const r = this.tileCacheForProjection[n];
            r.expireCache(r == i ? e : {})
        }
    }
    getGutterForProjection(t) {
        return this.getProjection() && t && !De(this.getProjection(), t) ? 0 : this.getGutter()
    }
    getGutter() {
        return 0
    }
    getKey() {
        let t = super.getKey();
        return this.getInterpolate() || (t += ":disable-interpolation"),
        t
    }
    getOpaque(t) {
        return this.getProjection() && t && !De(this.getProjection(), t) ? !1 : super.getOpaque(t)
    }
    getTileGridForProjection(t) {
        const e = this.getProjection();
        if (this.tileGrid && (!e || De(e, t)))
            return this.tileGrid;
        const i = U(t);
        return i in this.tileGridForProjection || (this.tileGridForProjection[i] = Cl(t)),
        this.tileGridForProjection[i]
    }
    getTileCacheForProjection(t) {
        const e = this.getProjection();
        if (!e || De(e, t))
            return this.tileCache;
        const i = U(t);
        return i in this.tileCacheForProjection || (this.tileCacheForProjection[i] = new xl(this.tileCache.highWaterMark)),
        this.tileCacheForProjection[i]
    }
    createTile_(t, e, i, n, r, o) {
        const a = [t, e, i]
          , l = this.getTileCoordForTileUrlFunction(a, r)
          , h = l ? this.tileUrlFunction(l, n, r) : void 0
          , c = new this.tileClass(a,h !== void 0 ? k.IDLE : k.EMPTY,h !== void 0 ? h : "",this.crossOrigin,this.tileLoadFunction,this.tileOptions);
        return c.key = o,
        c.addEventListener(G.CHANGE, this.handleTileChange.bind(this)),
        c
    }
    getTile(t, e, i, n, r) {
        const o = this.getProjection();
        if (!o || !r || De(o, r))
            return this.getTileInternal(t, e, i, n, o || r);
        const a = this.getTileCacheForProjection(r)
          , l = [t, e, i];
        let h;
        const c = yl(l);
        a.containsKey(c) && (h = a.get(c));
        const u = this.getKey();
        if (h && h.key == u)
            return h;
        const d = this.getTileGridForProjection(o)
          , f = this.getTileGridForProjection(r)
          , g = this.getTileCoordForTileUrlFunction(l, r)
          , _ = new Js(o,d,r,f,l,g,this.getTilePixelRatio(n),this.getGutter(),(m,p,y,x)=>this.getTileInternal(m, p, y, x, o),this.reprojectionErrorThreshold_,this.renderReprojectionEdges_,this.getInterpolate());
        return _.key = u,
        h ? (_.interimTile = h,
        _.refreshInterimChain(),
        a.replace(c, _)) : a.set(c, _),
        _
    }
    getTileInternal(t, e, i, n, r) {
        let o = null;
        const a = ds(t, e, i)
          , l = this.getKey();
        if (!this.tileCache.containsKey(a))
            o = this.createTile_(t, e, i, n, r, l),
            this.tileCache.set(a, o);
        else if (o = this.tileCache.get(a),
        o.key != l) {
            const h = o;
            o = this.createTile_(t, e, i, n, r, l),
            h.getState() == k.IDLE ? o.interimTile = h.interimTile : o.interimTile = h,
            o.refreshInterimChain(),
            this.tileCache.replace(a, o)
        }
        return o
    }
    setRenderReprojectionEdges(t) {
        if (this.renderReprojectionEdges_ != t) {
            this.renderReprojectionEdges_ = t;
            for (const e in this.tileCacheForProjection)
                this.tileCacheForProjection[e].clear();
            this.changed()
        }
    }
    setTileGridForProjection(t, e) {
        const i = Et(t);
        if (i) {
            const n = U(i);
            n in this.tileGridForProjection || (this.tileGridForProjection[n] = e)
        }
    }
    clear() {
        super.clear();
        for (const t in this.tileCacheForProjection)
            this.tileCacheForProjection[t].clear()
    }
}
function Zd(s, t) {
    s.getImage().src = t
}
const Vd = Bd;
class Ud extends Vd {
    constructor(t) {
        t = t || {};
        const e = t.projection !== void 0 ? t.projection : "EPSG:3857"
          , i = t.tileGrid !== void 0 ? t.tileGrid : Ad({
            extent: Wr(e),
            maxResolution: t.maxResolution,
            maxZoom: t.maxZoom,
            minZoom: t.minZoom,
            tileSize: t.tileSize
        });
        super({
            attributions: t.attributions,
            cacheSize: t.cacheSize,
            crossOrigin: t.crossOrigin,
            interpolate: t.interpolate,
            opaque: t.opaque,
            projection: e,
            reprojectionErrorThreshold: t.reprojectionErrorThreshold,
            tileGrid: i,
            tileLoadFunction: t.tileLoadFunction,
            tilePixelRatio: t.tilePixelRatio,
            tileUrlFunction: t.tileUrlFunction,
            url: t.url,
            urls: t.urls,
            wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
            transition: t.transition,
            attributionsCollapsible: t.attributionsCollapsible,
            zDirection: t.zDirection
        }),
        this.gutter_ = t.gutter !== void 0 ? t.gutter : 0
    }
    getGutter() {
        return this.gutter_
    }
}
const ii = Ud;
function No(s) {
    return new H({
        fill: Ki(s, ""),
        stroke: ji(s, ""),
        text: Kd(s),
        image: jd(s)
    })
}
function Ki(s, t) {
    const e = s[t + "fill-color"];
    if (e)
        return new at({
            color: e
        })
}
function ji(s, t) {
    const e = s[t + "stroke-width"]
      , i = s[t + "stroke-color"];
    if (!(!e && !i))
        return new It({
            width: e,
            color: i,
            lineCap: s[t + "stroke-line-cap"],
            lineJoin: s[t + "stroke-line-join"],
            lineDash: s[t + "stroke-line-dash"],
            lineDashOffset: s[t + "stroke-line-dash-offset"],
            miterLimit: s[t + "stroke-miter-limit"]
        })
}
function Kd(s) {
    const t = s["text-value"];
    return t ? new _t({
        text: t,
        font: s["text-font"],
        maxAngle: s["text-max-angle"],
        offsetX: s["text-offset-x"],
        offsetY: s["text-offset-y"],
        overflow: s["text-overflow"],
        placement: s["text-placement"],
        repeat: s["text-repeat"],
        scale: s["text-scale"],
        rotateWithView: s["text-rotate-with-view"],
        rotation: s["text-rotation"],
        textAlign: s["text-align"],
        justify: s["text-justify"],
        textBaseline: s["text-baseline"],
        padding: s["text-padding"],
        fill: Ki(s, "text-"),
        backgroundFill: Ki(s, "text-background-"),
        stroke: ji(s, "text-"),
        backgroundStroke: ji(s, "text-background-")
    }) : void 0
}
function jd(s) {
    const t = s["icon-src"]
      , e = s["icon-img"];
    if (t || e)
        return new Ht({
            src: t,
            img: e,
            imgSize: s["icon-img-size"],
            anchor: s["icon-anchor"],
            anchorOrigin: s["icon-anchor-origin"],
            anchorXUnits: s["icon-anchor-x-units"],
            anchorYUnits: s["icon-anchor-y-units"],
            color: s["icon-color"],
            crossOrigin: s["icon-cross-origin"],
            offset: s["icon-offset"],
            displacement: s["icon-displacement"],
            opacity: s["icon-opacity"],
            scale: s["icon-scale"],
            width: s["icon-width"],
            height: s["icon-height"],
            rotation: s["icon-rotation"],
            rotateWithView: s["icon-rotate-with-view"],
            size: s["icon-size"],
            declutterMode: s["icon-declutter-mode"]
        });
    const i = s["shape-points"];
    if (i) {
        const r = "shape-";
        return new cl({
            points: i,
            fill: Ki(s, r),
            stroke: ji(s, r),
            radius: s["shape-radius"],
            radius1: s["shape-radius1"],
            radius2: s["shape-radius2"],
            angle: s["shape-angle"],
            displacement: s["shape-displacement"],
            rotation: s["shape-rotation"],
            rotateWithView: s["shape-rotate-with-view"],
            scale: s["shape-scale"],
            declutterMode: s["shape-declutter-mode"]
        })
    }
    const n = s["circle-radius"];
    if (n) {
        const r = "circle-";
        return new ul({
            radius: n,
            fill: Ki(s, r),
            stroke: ji(s, r),
            displacement: s["circle-displacement"],
            scale: s["circle-scale"],
            rotation: s["circle-rotation"],
            rotateWithView: s["circle-rotate-with-view"],
            declutterMode: s["circle-declutter-mode"]
        })
    }
}
const Go = {
    RENDER_ORDER: "renderOrder"
};
class Hd extends ls {
    constructor(t) {
        t = t || {};
        const e = Object.assign({}, t);
        delete e.style,
        delete e.renderBuffer,
        delete e.updateWhileAnimating,
        delete e.updateWhileInteracting,
        super(e),
        this.declutter_ = t.declutter !== void 0 ? t.declutter : !1,
        this.renderBuffer_ = t.renderBuffer !== void 0 ? t.renderBuffer : 100,
        this.style_ = null,
        this.styleFunction_ = void 0,
        this.setStyle(t.style),
        this.updateWhileAnimating_ = t.updateWhileAnimating !== void 0 ? t.updateWhileAnimating : !1,
        this.updateWhileInteracting_ = t.updateWhileInteracting !== void 0 ? t.updateWhileInteracting : !1
    }
    getDeclutter() {
        return this.declutter_
    }
    getFeatures(t) {
        return super.getFeatures(t)
    }
    getRenderBuffer() {
        return this.renderBuffer_
    }
    getRenderOrder() {
        return this.get(Go.RENDER_ORDER)
    }
    getStyle() {
        return this.style_
    }
    getStyleFunction() {
        return this.styleFunction_
    }
    getUpdateWhileAnimating() {
        return this.updateWhileAnimating_
    }
    getUpdateWhileInteracting() {
        return this.updateWhileInteracting_
    }
    renderDeclutter(t) {
        t.declutterTree || (t.declutterTree = new gl(9)),
        this.getRenderer().renderDeclutter(t)
    }
    setRenderOrder(t) {
        this.set(Go.RENDER_ORDER, t)
    }
    setStyle(t) {
        let e;
        if (t === void 0)
            e = Ju;
        else if (t === null)
            e = null;
        else if (typeof t == "function")
            e = t;
        else if (t instanceof H)
            e = t;
        else if (Array.isArray(t)) {
            const i = t.length
              , n = new Array(i);
            for (let r = 0; r < i; ++r) {
                const o = t[r];
                o instanceof H ? n[r] = o : n[r] = No(o)
            }
            e = n
        } else
            e = No(t);
        this.style_ = e,
        this.styleFunction_ = t === null ? void 0 : qu(this.style_),
        this.changed()
    }
}
const $d = Hd
  , sn = {
    BEGIN_GEOMETRY: 0,
    BEGIN_PATH: 1,
    CIRCLE: 2,
    CLOSE_PATH: 3,
    CUSTOM: 4,
    DRAW_CHARS: 5,
    DRAW_IMAGE: 6,
    END_GEOMETRY: 7,
    FILL: 8,
    MOVE_TO_LINE_TO: 9,
    SET_FILL_STYLE: 10,
    SET_STROKE_STYLE: 11,
    STROKE: 12
}
  , Cn = [sn.FILL]
  , Ie = [sn.STROKE]
  , Ye = [sn.BEGIN_PATH]
  , zo = [sn.CLOSE_PATH]
  , A = sn;
class qd {
    drawCustom(t, e, i, n) {}
    drawGeometry(t) {}
    setStyle(t) {}
    drawCircle(t, e) {}
    drawFeature(t, e) {}
    drawGeometryCollection(t, e) {}
    drawLineString(t, e) {}
    drawMultiLineString(t, e) {}
    drawMultiPoint(t, e) {}
    drawMultiPolygon(t, e) {}
    drawPoint(t, e) {}
    drawPolygon(t, e) {}
    drawText(t, e) {}
    setFillStrokeStyle(t, e) {}
    setImageStyle(t, e) {}
    setTextStyle(t, e) {}
}
const Rl = qd;
class Jd extends Rl {
    constructor(t, e, i, n) {
        super(),
        this.tolerance = t,
        this.maxExtent = e,
        this.pixelRatio = n,
        this.maxLineWidth = 0,
        this.resolution = i,
        this.beginGeometryInstruction1_ = null,
        this.beginGeometryInstruction2_ = null,
        this.bufferedMaxExtent_ = null,
        this.instructions = [],
        this.coordinates = [],
        this.tmpCoordinate_ = [],
        this.hitDetectionInstructions = [],
        this.state = {}
    }
    applyPixelRatio(t) {
        const e = this.pixelRatio;
        return e == 1 ? t : t.map(function(i) {
            return i * e
        })
    }
    appendFlatPointCoordinates(t, e) {
        const i = this.getBufferedMaxExtent()
          , n = this.tmpCoordinate_
          , r = this.coordinates;
        let o = r.length;
        for (let a = 0, l = t.length; a < l; a += e)
            n[0] = t[a],
            n[1] = t[a + 1],
            he(i, n) && (r[o++] = n[0],
            r[o++] = n[1]);
        return o
    }
    appendFlatLineCoordinates(t, e, i, n, r, o) {
        const a = this.coordinates;
        let l = a.length;
        const h = this.getBufferedMaxExtent();
        o && (e += n);
        let c = t[e]
          , u = t[e + 1];
        const d = this.tmpCoordinate_;
        let f = !0, g, _, m;
        for (g = e + n; g < i; g += n)
            d[0] = t[g],
            d[1] = t[g + 1],
            m = zs(h, d),
            m !== _ ? (f && (a[l++] = c,
            a[l++] = u,
            f = !1),
            a[l++] = d[0],
            a[l++] = d[1]) : m === lt.INTERSECTING ? (a[l++] = d[0],
            a[l++] = d[1],
            f = !1) : f = !0,
            c = d[0],
            u = d[1],
            _ = m;
        return (r && f || g === e + n) && (a[l++] = c,
        a[l++] = u),
        l
    }
    drawCustomCoordinates_(t, e, i, n, r) {
        for (let o = 0, a = i.length; o < a; ++o) {
            const l = i[o]
              , h = this.appendFlatLineCoordinates(t, e, l, n, !1, !1);
            r.push(h),
            e = l
        }
        return e
    }
    drawCustom(t, e, i, n) {
        this.beginGeometry(t, e);
        const r = t.getType()
          , o = t.getStride()
          , a = this.coordinates.length;
        let l, h, c, u, d;
        switch (r) {
        case "MultiPolygon":
            l = t.getOrientedFlatCoordinates(),
            u = [];
            const f = t.getEndss();
            d = 0;
            for (let g = 0, _ = f.length; g < _; ++g) {
                const m = [];
                d = this.drawCustomCoordinates_(l, d, f[g], o, m),
                u.push(m)
            }
            this.instructions.push([A.CUSTOM, a, u, t, i, mo]),
            this.hitDetectionInstructions.push([A.CUSTOM, a, u, t, n || i, mo]);
            break;
        case "Polygon":
        case "MultiLineString":
            c = [],
            l = r == "Polygon" ? t.getOrientedFlatCoordinates() : t.getFlatCoordinates(),
            d = this.drawCustomCoordinates_(l, 0, t.getEnds(), o, c),
            this.instructions.push([A.CUSTOM, a, c, t, i, Gi]),
            this.hitDetectionInstructions.push([A.CUSTOM, a, c, t, n || i, Gi]);
            break;
        case "LineString":
        case "Circle":
            l = t.getFlatCoordinates(),
            h = this.appendFlatLineCoordinates(l, 0, l.length, o, !1, !1),
            this.instructions.push([A.CUSTOM, a, h, t, i, ze]),
            this.hitDetectionInstructions.push([A.CUSTOM, a, h, t, n || i, ze]);
            break;
        case "MultiPoint":
            l = t.getFlatCoordinates(),
            h = this.appendFlatPointCoordinates(l, o),
            h > a && (this.instructions.push([A.CUSTOM, a, h, t, i, ze]),
            this.hitDetectionInstructions.push([A.CUSTOM, a, h, t, n || i, ze]));
            break;
        case "Point":
            l = t.getFlatCoordinates(),
            this.coordinates.push(l[0], l[1]),
            h = this.coordinates.length,
            this.instructions.push([A.CUSTOM, a, h, t, i]),
            this.hitDetectionInstructions.push([A.CUSTOM, a, h, t, n || i]);
            break
        }
        this.endGeometry(e)
    }
    beginGeometry(t, e) {
        this.beginGeometryInstruction1_ = [A.BEGIN_GEOMETRY, e, 0, t],
        this.instructions.push(this.beginGeometryInstruction1_),
        this.beginGeometryInstruction2_ = [A.BEGIN_GEOMETRY, e, 0, t],
        this.hitDetectionInstructions.push(this.beginGeometryInstruction2_)
    }
    finish() {
        return {
            instructions: this.instructions,
            hitDetectionInstructions: this.hitDetectionInstructions,
            coordinates: this.coordinates
        }
    }
    reverseHitDetectionInstructions() {
        const t = this.hitDetectionInstructions;
        t.reverse();
        let e;
        const i = t.length;
        let n, r, o = -1;
        for (e = 0; e < i; ++e)
            n = t[e],
            r = n[0],
            r == A.END_GEOMETRY ? o = e : r == A.BEGIN_GEOMETRY && (n[2] = e,
            eh(this.hitDetectionInstructions, o, e),
            o = -1)
    }
    setFillStrokeStyle(t, e) {
        const i = this.state;
        if (t) {
            const n = t.getColor();
            i.fillStyle = jt(n || fe)
        } else
            i.fillStyle = void 0;
        if (e) {
            const n = e.getColor();
            i.strokeStyle = jt(n || Bi);
            const r = e.getLineCap();
            i.lineCap = r !== void 0 ? r : Vn;
            const o = e.getLineDash();
            i.lineDash = o ? o.slice() : Wi;
            const a = e.getLineDashOffset();
            i.lineDashOffset = a || Xi;
            const l = e.getLineJoin();
            i.lineJoin = l !== void 0 ? l : Ei;
            const h = e.getWidth();
            i.lineWidth = h !== void 0 ? h : Vi;
            const c = e.getMiterLimit();
            i.miterLimit = c !== void 0 ? c : Yi,
            i.lineWidth > this.maxLineWidth && (this.maxLineWidth = i.lineWidth,
            this.bufferedMaxExtent_ = null)
        } else
            i.strokeStyle = void 0,
            i.lineCap = void 0,
            i.lineDash = null,
            i.lineDashOffset = void 0,
            i.lineJoin = void 0,
            i.lineWidth = void 0,
            i.miterLimit = void 0
    }
    createFill(t) {
        const e = t.fillStyle
          , i = [A.SET_FILL_STYLE, e];
        return typeof e != "string" && i.push(!0),
        i
    }
    applyStroke(t) {
        this.instructions.push(this.createStroke(t))
    }
    createStroke(t) {
        return [A.SET_STROKE_STYLE, t.strokeStyle, t.lineWidth * this.pixelRatio, t.lineCap, t.lineJoin, t.miterLimit, this.applyPixelRatio(t.lineDash), t.lineDashOffset * this.pixelRatio]
    }
    updateFillStyle(t, e) {
        const i = t.fillStyle;
        (typeof i != "string" || t.currentFillStyle != i) && (i !== void 0 && this.instructions.push(e.call(this, t)),
        t.currentFillStyle = i)
    }
    updateStrokeStyle(t, e) {
        const i = t.strokeStyle
          , n = t.lineCap
          , r = t.lineDash
          , o = t.lineDashOffset
          , a = t.lineJoin
          , l = t.lineWidth
          , h = t.miterLimit;
        (t.currentStrokeStyle != i || t.currentLineCap != n || r != t.currentLineDash && !Pe(t.currentLineDash, r) || t.currentLineDashOffset != o || t.currentLineJoin != a || t.currentLineWidth != l || t.currentMiterLimit != h) && (i !== void 0 && e.call(this, t),
        t.currentStrokeStyle = i,
        t.currentLineCap = n,
        t.currentLineDash = r,
        t.currentLineDashOffset = o,
        t.currentLineJoin = a,
        t.currentLineWidth = l,
        t.currentMiterLimit = h)
    }
    endGeometry(t) {
        this.beginGeometryInstruction1_[2] = this.instructions.length,
        this.beginGeometryInstruction1_ = null,
        this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length,
        this.beginGeometryInstruction2_ = null;
        const e = [A.END_GEOMETRY, t];
        this.instructions.push(e),
        this.hitDetectionInstructions.push(e)
    }
    getBufferedMaxExtent() {
        if (!this.bufferedMaxExtent_ && (this.bufferedMaxExtent_ = Sa(this.maxExtent),
        this.maxLineWidth > 0)) {
            const t = this.resolution * (this.maxLineWidth + 1) / 2;
            cr(this.bufferedMaxExtent_, t, this.bufferedMaxExtent_)
        }
        return this.bufferedMaxExtent_
    }
}
const rn = Jd;
class Qd extends rn {
    constructor(t, e, i, n) {
        super(t, e, i, n),
        this.hitDetectionImage_ = null,
        this.image_ = null,
        this.imagePixelRatio_ = void 0,
        this.anchorX_ = void 0,
        this.anchorY_ = void 0,
        this.height_ = void 0,
        this.opacity_ = void 0,
        this.originX_ = void 0,
        this.originY_ = void 0,
        this.rotateWithView_ = void 0,
        this.rotation_ = void 0,
        this.scale_ = void 0,
        this.width_ = void 0,
        this.declutterMode_ = void 0,
        this.declutterImageWithText_ = void 0
    }
    drawPoint(t, e) {
        if (!this.image_)
            return;
        this.beginGeometry(t, e);
        const i = t.getFlatCoordinates()
          , n = t.getStride()
          , r = this.coordinates.length
          , o = this.appendFlatPointCoordinates(i, n);
        this.instructions.push([A.DRAW_IMAGE, r, o, this.image_, this.anchorX_ * this.imagePixelRatio_, this.anchorY_ * this.imagePixelRatio_, Math.ceil(this.height_ * this.imagePixelRatio_), this.opacity_, this.originX_ * this.imagePixelRatio_, this.originY_ * this.imagePixelRatio_, this.rotateWithView_, this.rotation_, [this.scale_[0] * this.pixelRatio / this.imagePixelRatio_, this.scale_[1] * this.pixelRatio / this.imagePixelRatio_], Math.ceil(this.width_ * this.imagePixelRatio_), this.declutterMode_, this.declutterImageWithText_]),
        this.hitDetectionInstructions.push([A.DRAW_IMAGE, r, o, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.width_, this.declutterMode_, this.declutterImageWithText_]),
        this.endGeometry(e)
    }
    drawMultiPoint(t, e) {
        if (!this.image_)
            return;
        this.beginGeometry(t, e);
        const i = t.getFlatCoordinates()
          , n = t.getStride()
          , r = this.coordinates.length
          , o = this.appendFlatPointCoordinates(i, n);
        this.instructions.push([A.DRAW_IMAGE, r, o, this.image_, this.anchorX_ * this.imagePixelRatio_, this.anchorY_ * this.imagePixelRatio_, Math.ceil(this.height_ * this.imagePixelRatio_), this.opacity_, this.originX_ * this.imagePixelRatio_, this.originY_ * this.imagePixelRatio_, this.rotateWithView_, this.rotation_, [this.scale_[0] * this.pixelRatio / this.imagePixelRatio_, this.scale_[1] * this.pixelRatio / this.imagePixelRatio_], Math.ceil(this.width_ * this.imagePixelRatio_), this.declutterMode_, this.declutterImageWithText_]),
        this.hitDetectionInstructions.push([A.DRAW_IMAGE, r, o, this.hitDetectionImage_, this.anchorX_, this.anchorY_, this.height_, this.opacity_, this.originX_, this.originY_, this.rotateWithView_, this.rotation_, this.scale_, this.width_, this.declutterMode_, this.declutterImageWithText_]),
        this.endGeometry(e)
    }
    finish() {
        return this.reverseHitDetectionInstructions(),
        this.anchorX_ = void 0,
        this.anchorY_ = void 0,
        this.hitDetectionImage_ = null,
        this.image_ = null,
        this.imagePixelRatio_ = void 0,
        this.height_ = void 0,
        this.scale_ = void 0,
        this.opacity_ = void 0,
        this.originX_ = void 0,
        this.originY_ = void 0,
        this.rotateWithView_ = void 0,
        this.rotation_ = void 0,
        this.width_ = void 0,
        super.finish()
    }
    setImageStyle(t, e) {
        const i = t.getAnchor()
          , n = t.getSize()
          , r = t.getOrigin();
        this.imagePixelRatio_ = t.getPixelRatio(this.pixelRatio),
        this.anchorX_ = i[0],
        this.anchorY_ = i[1],
        this.hitDetectionImage_ = t.getHitDetectionImage(),
        this.image_ = t.getImage(this.pixelRatio),
        this.height_ = n[1],
        this.opacity_ = t.getOpacity(),
        this.originX_ = r[0],
        this.originY_ = r[1],
        this.rotateWithView_ = t.getRotateWithView(),
        this.rotation_ = t.getRotation(),
        this.scale_ = t.getScaleArray(),
        this.width_ = n[0],
        this.declutterMode_ = t.getDeclutterMode(),
        this.declutterImageWithText_ = e
    }
}
const tf = Qd;
class ef extends rn {
    constructor(t, e, i, n) {
        super(t, e, i, n)
    }
    drawFlatCoordinates_(t, e, i, n) {
        const r = this.coordinates.length
          , o = this.appendFlatLineCoordinates(t, e, i, n, !1, !1)
          , a = [A.MOVE_TO_LINE_TO, r, o];
        return this.instructions.push(a),
        this.hitDetectionInstructions.push(a),
        i
    }
    drawLineString(t, e) {
        const i = this.state
          , n = i.strokeStyle
          , r = i.lineWidth;
        if (n === void 0 || r === void 0)
            return;
        this.updateStrokeStyle(i, this.applyStroke),
        this.beginGeometry(t, e),
        this.hitDetectionInstructions.push([A.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, Wi, Xi], Ye);
        const o = t.getFlatCoordinates()
          , a = t.getStride();
        this.drawFlatCoordinates_(o, 0, o.length, a),
        this.hitDetectionInstructions.push(Ie),
        this.endGeometry(e)
    }
    drawMultiLineString(t, e) {
        const i = this.state
          , n = i.strokeStyle
          , r = i.lineWidth;
        if (n === void 0 || r === void 0)
            return;
        this.updateStrokeStyle(i, this.applyStroke),
        this.beginGeometry(t, e),
        this.hitDetectionInstructions.push([A.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset], Ye);
        const o = t.getEnds()
          , a = t.getFlatCoordinates()
          , l = t.getStride();
        let h = 0;
        for (let c = 0, u = o.length; c < u; ++c)
            h = this.drawFlatCoordinates_(a, h, o[c], l);
        this.hitDetectionInstructions.push(Ie),
        this.endGeometry(e)
    }
    finish() {
        const t = this.state;
        return t.lastStroke != null && t.lastStroke != this.coordinates.length && this.instructions.push(Ie),
        this.reverseHitDetectionInstructions(),
        this.state = null,
        super.finish()
    }
    applyStroke(t) {
        t.lastStroke != null && t.lastStroke != this.coordinates.length && (this.instructions.push(Ie),
        t.lastStroke = this.coordinates.length),
        t.lastStroke = 0,
        super.applyStroke(t),
        this.instructions.push(Ye)
    }
}
const nf = ef;
class sf extends rn {
    constructor(t, e, i, n) {
        super(t, e, i, n)
    }
    drawFlatCoordinatess_(t, e, i, n) {
        const r = this.state
          , o = r.fillStyle !== void 0
          , a = r.strokeStyle !== void 0
          , l = i.length;
        this.instructions.push(Ye),
        this.hitDetectionInstructions.push(Ye);
        for (let h = 0; h < l; ++h) {
            const c = i[h]
              , u = this.coordinates.length
              , d = this.appendFlatLineCoordinates(t, e, c, n, !0, !a)
              , f = [A.MOVE_TO_LINE_TO, u, d];
            this.instructions.push(f),
            this.hitDetectionInstructions.push(f),
            a && (this.instructions.push(zo),
            this.hitDetectionInstructions.push(zo)),
            e = c
        }
        return o && (this.instructions.push(Cn),
        this.hitDetectionInstructions.push(Cn)),
        a && (this.instructions.push(Ie),
        this.hitDetectionInstructions.push(Ie)),
        e
    }
    drawCircle(t, e) {
        const i = this.state
          , n = i.fillStyle
          , r = i.strokeStyle;
        if (n === void 0 && r === void 0)
            return;
        this.setFillStrokeStyles_(),
        this.beginGeometry(t, e),
        i.fillStyle !== void 0 && this.hitDetectionInstructions.push([A.SET_FILL_STYLE, fe]),
        i.strokeStyle !== void 0 && this.hitDetectionInstructions.push([A.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset]);
        const o = t.getFlatCoordinates()
          , a = t.getStride()
          , l = this.coordinates.length;
        this.appendFlatLineCoordinates(o, 0, o.length, a, !1, !1);
        const h = [A.CIRCLE, l];
        this.instructions.push(Ye, h),
        this.hitDetectionInstructions.push(Ye, h),
        i.fillStyle !== void 0 && (this.instructions.push(Cn),
        this.hitDetectionInstructions.push(Cn)),
        i.strokeStyle !== void 0 && (this.instructions.push(Ie),
        this.hitDetectionInstructions.push(Ie)),
        this.endGeometry(e)
    }
    drawPolygon(t, e) {
        const i = this.state
          , n = i.fillStyle
          , r = i.strokeStyle;
        if (n === void 0 && r === void 0)
            return;
        this.setFillStrokeStyles_(),
        this.beginGeometry(t, e),
        i.fillStyle !== void 0 && this.hitDetectionInstructions.push([A.SET_FILL_STYLE, fe]),
        i.strokeStyle !== void 0 && this.hitDetectionInstructions.push([A.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset]);
        const o = t.getEnds()
          , a = t.getOrientedFlatCoordinates()
          , l = t.getStride();
        this.drawFlatCoordinatess_(a, 0, o, l),
        this.endGeometry(e)
    }
    drawMultiPolygon(t, e) {
        const i = this.state
          , n = i.fillStyle
          , r = i.strokeStyle;
        if (n === void 0 && r === void 0)
            return;
        this.setFillStrokeStyles_(),
        this.beginGeometry(t, e),
        i.fillStyle !== void 0 && this.hitDetectionInstructions.push([A.SET_FILL_STYLE, fe]),
        i.strokeStyle !== void 0 && this.hitDetectionInstructions.push([A.SET_STROKE_STYLE, i.strokeStyle, i.lineWidth, i.lineCap, i.lineJoin, i.miterLimit, i.lineDash, i.lineDashOffset]);
        const o = t.getEndss()
          , a = t.getOrientedFlatCoordinates()
          , l = t.getStride();
        let h = 0;
        for (let c = 0, u = o.length; c < u; ++c)
            h = this.drawFlatCoordinatess_(a, h, o[c], l);
        this.endGeometry(e)
    }
    finish() {
        this.reverseHitDetectionInstructions(),
        this.state = null;
        const t = this.tolerance;
        if (t !== 0) {
            const e = this.coordinates;
            for (let i = 0, n = e.length; i < n; ++i)
                e[i] = Fe(e[i], t)
        }
        return super.finish()
    }
    setFillStrokeStyles_() {
        const t = this.state;
        t.fillStyle !== void 0 && this.updateFillStyle(t, this.createFill),
        t.strokeStyle !== void 0 && this.updateStrokeStyle(t, this.applyStroke)
    }
}
const Wo = sf;
function rf(s, t, e, i, n) {
    const r = [];
    let o = e
      , a = 0
      , l = t.slice(e, 2);
    for (; a < s && o + n < i; ) {
        const [h,c] = l.slice(-2)
          , u = t[o + n]
          , d = t[o + n + 1]
          , f = Math.sqrt((u - h) * (u - h) + (d - c) * (d - c));
        if (a += f,
        a >= s) {
            const g = (s - a + f) / f
              , _ = vt(h, u, g)
              , m = vt(c, d, g);
            l.push(_, m),
            r.push(l),
            l = [_, m],
            a == s && (o += n),
            a = 0
        } else if (a < s)
            l.push(t[o + n], t[o + n + 1]),
            o += n;
        else {
            const g = f - a
              , _ = vt(h, u, g / f)
              , m = vt(c, d, g / f);
            l.push(_, m),
            r.push(l),
            l = [_, m],
            a = 0,
            o += n
        }
    }
    return a > 0 && r.push(l),
    r
}
function of(s, t, e, i, n) {
    let r = e, o = e, a = 0, l = 0, h = e, c, u, d, f, g, _, m, p, y, x;
    for (u = e; u < i; u += n) {
        const E = t[u]
          , w = t[u + 1];
        g !== void 0 && (y = E - g,
        x = w - _,
        f = Math.sqrt(y * y + x * x),
        m !== void 0 && (l += d,
        c = Math.acos((m * y + p * x) / (d * f)),
        c > s && (l > a && (a = l,
        r = h,
        o = u),
        l = 0,
        h = u - n)),
        d = f,
        m = y,
        p = x),
        g = E,
        _ = w
    }
    return l += f,
    l > a ? [h, u] : [r, o]
}
const Fi = {
    left: 0,
    end: 0,
    center: .5,
    right: 1,
    start: 1,
    top: 0,
    middle: .5,
    hanging: .2,
    alphabetic: .8,
    ideographic: .8,
    bottom: 1
};
class af extends rn {
    constructor(t, e, i, n) {
        super(t, e, i, n),
        this.labels_ = null,
        this.text_ = "",
        this.textOffsetX_ = 0,
        this.textOffsetY_ = 0,
        this.textRotateWithView_ = void 0,
        this.textRotation_ = 0,
        this.textFillState_ = null,
        this.fillStates = {},
        this.textStrokeState_ = null,
        this.strokeStates = {},
        this.textState_ = {},
        this.textStates = {},
        this.textKey_ = "",
        this.fillKey_ = "",
        this.strokeKey_ = "",
        this.declutterImageWithText_ = void 0
    }
    finish() {
        const t = super.finish();
        return t.textStates = this.textStates,
        t.fillStates = this.fillStates,
        t.strokeStates = this.strokeStates,
        t
    }
    drawText(t, e) {
        const i = this.textFillState_
          , n = this.textStrokeState_
          , r = this.textState_;
        if (this.text_ === "" || !r || !i && !n)
            return;
        const o = this.coordinates;
        let a = o.length;
        const l = t.getType();
        let h = null
          , c = t.getStride();
        if (r.placement === "line" && (l == "LineString" || l == "MultiLineString" || l == "Polygon" || l == "MultiPolygon")) {
            if (!mt(this.getBufferedMaxExtent(), t.getExtent()))
                return;
            let u;
            if (h = t.getFlatCoordinates(),
            l == "LineString")
                u = [h.length];
            else if (l == "MultiLineString")
                u = t.getEnds();
            else if (l == "Polygon")
                u = t.getEnds().slice(0, 1);
            else if (l == "MultiPolygon") {
                const _ = t.getEndss();
                u = [];
                for (let m = 0, p = _.length; m < p; ++m)
                    u.push(_[m][0])
            }
            this.beginGeometry(t, e);
            const d = r.repeat
              , f = d ? void 0 : r.textAlign;
            let g = 0;
            for (let _ = 0, m = u.length; _ < m; ++_) {
                let p;
                d ? p = rf(d * this.resolution, h, g, u[_], c) : p = [h.slice(g, u[_])];
                for (let y = 0, x = p.length; y < x; ++y) {
                    const E = p[y];
                    let w = 0
                      , R = E.length;
                    if (f == null) {
                        const L = of(r.maxAngle, E, 0, E.length, 2);
                        w = L[0],
                        R = L[1]
                    }
                    for (let L = w; L < R; L += c)
                        o.push(E[L], E[L + 1]);
                    const T = o.length;
                    g = u[_],
                    this.drawChars_(a, T),
                    a = T
                }
            }
            this.endGeometry(e)
        } else {
            let u = r.overflow ? null : [];
            switch (l) {
            case "Point":
            case "MultiPoint":
                h = t.getFlatCoordinates();
                break;
            case "LineString":
                h = t.getFlatMidpoint();
                break;
            case "Circle":
                h = t.getCenter();
                break;
            case "MultiLineString":
                h = t.getFlatMidpoints(),
                c = 2;
                break;
            case "Polygon":
                h = t.getFlatInteriorPoint(),
                r.overflow || u.push(h[2] / this.resolution),
                c = 3;
                break;
            case "MultiPolygon":
                const m = t.getFlatInteriorPoints();
                h = [];
                for (let p = 0, y = m.length; p < y; p += 3)
                    r.overflow || u.push(m[p + 2] / this.resolution),
                    h.push(m[p], m[p + 1]);
                if (h.length === 0)
                    return;
                c = 2;
                break
            }
            const d = this.appendFlatPointCoordinates(h, c);
            if (d === a)
                return;
            if (u && (d - a) / 2 !== h.length / c) {
                let m = a / 2;
                u = u.filter((p,y)=>{
                    const x = o[(m + y) * 2] === h[y * c] && o[(m + y) * 2 + 1] === h[y * c + 1];
                    return x || --m,
                    x
                }
                )
            }
            this.saveTextStates_(),
            (r.backgroundFill || r.backgroundStroke) && (this.setFillStrokeStyle(r.backgroundFill, r.backgroundStroke),
            r.backgroundFill && (this.updateFillStyle(this.state, this.createFill),
            this.hitDetectionInstructions.push(this.createFill(this.state))),
            r.backgroundStroke && (this.updateStrokeStyle(this.state, this.applyStroke),
            this.hitDetectionInstructions.push(this.createStroke(this.state)))),
            this.beginGeometry(t, e);
            let f = r.padding;
            if (f != Xe && (r.scale[0] < 0 || r.scale[1] < 0)) {
                let m = r.padding[0]
                  , p = r.padding[1]
                  , y = r.padding[2]
                  , x = r.padding[3];
                r.scale[0] < 0 && (p = -p,
                x = -x),
                r.scale[1] < 0 && (m = -m,
                y = -y),
                f = [m, p, y, x]
            }
            const g = this.pixelRatio;
            this.instructions.push([A.DRAW_IMAGE, a, d, null, NaN, NaN, NaN, 1, 0, 0, this.textRotateWithView_, this.textRotation_, [1, 1], NaN, void 0, this.declutterImageWithText_, f == Xe ? Xe : f.map(function(m) {
                return m * g
            }), !!r.backgroundFill, !!r.backgroundStroke, this.text_, this.textKey_, this.strokeKey_, this.fillKey_, this.textOffsetX_, this.textOffsetY_, u]);
            const _ = 1 / g;
            this.hitDetectionInstructions.push([A.DRAW_IMAGE, a, d, null, NaN, NaN, NaN, 1, 0, 0, this.textRotateWithView_, this.textRotation_, [_, _], NaN, void 0, this.declutterImageWithText_, f, !!r.backgroundFill, !!r.backgroundStroke, this.text_, this.textKey_, this.strokeKey_, this.fillKey_, this.textOffsetX_, this.textOffsetY_, u]),
            this.endGeometry(e)
        }
    }
    saveTextStates_() {
        const t = this.textStrokeState_
          , e = this.textState_
          , i = this.textFillState_
          , n = this.strokeKey_;
        t && (n in this.strokeStates || (this.strokeStates[n] = {
            strokeStyle: t.strokeStyle,
            lineCap: t.lineCap,
            lineDashOffset: t.lineDashOffset,
            lineWidth: t.lineWidth,
            lineJoin: t.lineJoin,
            miterLimit: t.miterLimit,
            lineDash: t.lineDash
        }));
        const r = this.textKey_;
        r in this.textStates || (this.textStates[r] = {
            font: e.font,
            textAlign: e.textAlign || Zi,
            justify: e.justify,
            textBaseline: e.textBaseline || Un,
            scale: e.scale
        });
        const o = this.fillKey_;
        i && (o in this.fillStates || (this.fillStates[o] = {
            fillStyle: i.fillStyle
        }))
    }
    drawChars_(t, e) {
        const i = this.textStrokeState_
          , n = this.textState_
          , r = this.strokeKey_
          , o = this.textKey_
          , a = this.fillKey_;
        this.saveTextStates_();
        const l = this.pixelRatio
          , h = Fi[n.textBaseline]
          , c = this.textOffsetY_ * l
          , u = this.text_
          , d = i ? i.lineWidth * Math.abs(n.scale[0]) / 2 : 0;
        this.instructions.push([A.DRAW_CHARS, t, e, h, n.overflow, a, n.maxAngle, l, c, r, d * l, u, o, 1]),
        this.hitDetectionInstructions.push([A.DRAW_CHARS, t, e, h, n.overflow, a, n.maxAngle, 1, c, r, d, u, o, 1 / l])
    }
    setTextStyle(t, e) {
        let i, n, r;
        if (!t)
            this.text_ = "";
        else {
            const o = t.getFill();
            o ? (n = this.textFillState_,
            n || (n = {},
            this.textFillState_ = n),
            n.fillStyle = jt(o.getColor() || fe)) : (n = null,
            this.textFillState_ = n);
            const a = t.getStroke();
            if (!a)
                r = null,
                this.textStrokeState_ = r;
            else {
                r = this.textStrokeState_,
                r || (r = {},
                this.textStrokeState_ = r);
                const g = a.getLineDash()
                  , _ = a.getLineDashOffset()
                  , m = a.getWidth()
                  , p = a.getMiterLimit();
                r.lineCap = a.getLineCap() || Vn,
                r.lineDash = g ? g.slice() : Wi,
                r.lineDashOffset = _ === void 0 ? Xi : _,
                r.lineJoin = a.getLineJoin() || Ei,
                r.lineWidth = m === void 0 ? Vi : m,
                r.miterLimit = p === void 0 ? Yi : p,
                r.strokeStyle = jt(a.getColor() || Bi)
            }
            i = this.textState_;
            const l = t.getFont() || $a;
            Wc(l);
            const h = t.getScaleArray();
            i.overflow = t.getOverflow(),
            i.font = l,
            i.maxAngle = t.getMaxAngle(),
            i.placement = t.getPlacement(),
            i.textAlign = t.getTextAlign(),
            i.repeat = t.getRepeat(),
            i.justify = t.getJustify(),
            i.textBaseline = t.getTextBaseline() || Un,
            i.backgroundFill = t.getBackgroundFill(),
            i.backgroundStroke = t.getBackgroundStroke(),
            i.padding = t.getPadding() || Xe,
            i.scale = h === void 0 ? [1, 1] : h;
            const c = t.getOffsetX()
              , u = t.getOffsetY()
              , d = t.getRotateWithView()
              , f = t.getRotation();
            this.text_ = t.getText() || "",
            this.textOffsetX_ = c === void 0 ? 0 : c,
            this.textOffsetY_ = u === void 0 ? 0 : u,
            this.textRotateWithView_ = d === void 0 ? !1 : d,
            this.textRotation_ = f === void 0 ? 0 : f,
            this.strokeKey_ = r ? (typeof r.strokeStyle == "string" ? r.strokeStyle : U(r.strokeStyle)) + r.lineCap + r.lineDashOffset + "|" + r.lineWidth + r.lineJoin + r.miterLimit + "[" + r.lineDash.join() + "]" : "",
            this.textKey_ = i.font + i.scale + (i.textAlign || "?") + (i.repeat || "?") + (i.justify || "?") + (i.textBaseline || "?"),
            this.fillKey_ = n ? typeof n.fillStyle == "string" ? n.fillStyle : "|" + U(n.fillStyle) : ""
        }
        this.declutterImageWithText_ = e
    }
}
const lf = {
    Circle: Wo,
    Default: rn,
    Image: tf,
    LineString: nf,
    Polygon: Wo,
    Text: af
};
class hf {
    constructor(t, e, i, n) {
        this.tolerance_ = t,
        this.maxExtent_ = e,
        this.pixelRatio_ = n,
        this.resolution_ = i,
        this.buildersByZIndex_ = {}
    }
    finish() {
        const t = {};
        for (const e in this.buildersByZIndex_) {
            t[e] = t[e] || {};
            const i = this.buildersByZIndex_[e];
            for (const n in i) {
                const r = i[n].finish();
                t[e][n] = r
            }
        }
        return t
    }
    getBuilder(t, e) {
        const i = t !== void 0 ? t.toString() : "0";
        let n = this.buildersByZIndex_[i];
        n === void 0 && (n = {},
        this.buildersByZIndex_[i] = n);
        let r = n[e];
        if (r === void 0) {
            const o = lf[e];
            r = new o(this.tolerance_,this.maxExtent_,this.resolution_,this.pixelRatio_),
            n[e] = r
        }
        return r
    }
}
const Xo = hf;
class cf extends xa {
    constructor(t) {
        super(),
        this.ready = !0,
        this.boundHandleImageChange_ = this.handleImageChange_.bind(this),
        this.layer_ = t,
        this.declutterExecutorGroup = null
    }
    getFeatures(t) {
        return Z()
    }
    getData(t) {
        return null
    }
    prepareFrame(t) {
        return Z()
    }
    renderFrame(t, e) {
        return Z()
    }
    loadedTileCallback(t, e, i) {
        t[e] || (t[e] = {}),
        t[e][i.tileCoord.toString()] = i
    }
    createLoadedTileFinder(t, e, i) {
        return (n,r)=>{
            const o = this.loadedTileCallback.bind(this, i, n);
            return t.forEachLoadedTile(e, n, r, o)
        }
    }
    forEachFeatureAtCoordinate(t, e, i, n, r) {}
    getLayer() {
        return this.layer_
    }
    handleFontsChanged() {}
    handleImageChange_(t) {
        t.target.getState() === ot.LOADED && this.renderIfReadyAndVisible()
    }
    loadImage(t) {
        let e = t.getState();
        return e != ot.LOADED && e != ot.ERROR && t.addEventListener(G.CHANGE, this.boundHandleImageChange_),
        e == ot.IDLE && (t.load(),
        e = t.getState()),
        e == ot.LOADED
    }
    renderIfReadyAndVisible() {
        const t = this.getLayer();
        t && t.getVisible() && t.getSourceState() === "ready" && t.changed()
    }
    disposeInternal() {
        delete this.layer_,
        super.disposeInternal()
    }
}
const uf = cf
  , Yo = [];
let hi = null;
function df() {
    hi = wt(1, 1, void 0, {
        willReadFrequently: !0
    })
}
class ff extends uf {
    constructor(t) {
        super(t),
        this.container = null,
        this.renderedResolution,
        this.tempTransform = $t(),
        this.pixelTransform = $t(),
        this.inversePixelTransform = $t(),
        this.context = null,
        this.containerReused = !1,
        this.pixelContext_ = null,
        this.frameState = null
    }
    getImageData(t, e, i) {
        hi || df(),
        hi.clearRect(0, 0, 1, 1);
        let n;
        try {
            hi.drawImage(t, e, i, 1, 1, 0, 0, 1, 1),
            n = hi.getImageData(0, 0, 1, 1).data
        } catch {
            return hi = null,
            null
        }
        return n
    }
    getBackground(t) {
        let i = this.getLayer().getBackground();
        return typeof i == "function" && (i = i(t.viewState.resolution)),
        i || void 0
    }
    useContainer(t, e, i) {
        const n = this.getLayer().getClassName();
        let r, o;
        if (t && t.className === n && (!i || t && t.style.backgroundColor && Pe(Gn(t.style.backgroundColor), Gn(i)))) {
            const a = t.firstElementChild;
            a instanceof HTMLCanvasElement && (o = a.getContext("2d"))
        }
        if (o && o.canvas.style.transform === e ? (this.container = t,
        this.context = o,
        this.containerReused = !0) : this.containerReused && (this.container = null,
        this.context = null,
        this.containerReused = !1),
        !this.container) {
            r = document.createElement("div"),
            r.className = n;
            let a = r.style;
            a.position = "absolute",
            a.width = "100%",
            a.height = "100%",
            o = wt();
            const l = o.canvas;
            r.appendChild(l),
            a = l.style,
            a.position = "absolute",
            a.left = "0",
            a.transformOrigin = "top left",
            this.container = r,
            this.context = o
        }
        !this.containerReused && i && !this.container.style.backgroundColor && (this.container.style.backgroundColor = i)
    }
    clipUnrotated(t, e, i) {
        const n = Ve(i)
          , r = ss(i)
          , o = ns(i)
          , a = is(i);
        ht(e.coordinateToPixelTransform, n),
        ht(e.coordinateToPixelTransform, r),
        ht(e.coordinateToPixelTransform, o),
        ht(e.coordinateToPixelTransform, a);
        const l = this.inversePixelTransform;
        ht(l, n),
        ht(l, r),
        ht(l, o),
        ht(l, a),
        t.save(),
        t.beginPath(),
        t.moveTo(Math.round(n[0]), Math.round(n[1])),
        t.lineTo(Math.round(r[0]), Math.round(r[1])),
        t.lineTo(Math.round(o[0]), Math.round(o[1])),
        t.lineTo(Math.round(a[0]), Math.round(a[1])),
        t.clip()
    }
    dispatchRenderEvent_(t, e, i) {
        const n = this.getLayer();
        if (n.hasListener(t)) {
            const r = new Ka(t,this.inversePixelTransform,i,e);
            n.dispatchEvent(r)
        }
    }
    preRender(t, e) {
        this.frameState = e,
        this.dispatchRenderEvent_(de.PRERENDER, t, e)
    }
    postRender(t, e) {
        this.dispatchRenderEvent_(de.POSTRENDER, t, e)
    }
    getRenderTransform(t, e, i, n, r, o, a) {
        const l = r / 2
          , h = o / 2
          , c = n / e
          , u = -c
          , d = -t[0] + a
          , f = -t[1];
        return be(this.tempTransform, l, h, c, u, -i, d, f)
    }
    disposeInternal() {
        delete this.frameState,
        super.disposeInternal()
    }
}
const Il = ff;
function gf(s, t, e, i, n, r, o, a, l, h, c, u) {
    let d = s[t]
      , f = s[t + 1]
      , g = 0
      , _ = 0
      , m = 0
      , p = 0;
    function y() {
        g = d,
        _ = f,
        t += i,
        d = s[t],
        f = s[t + 1],
        p += m,
        m = Math.sqrt((d - g) * (d - g) + (f - _) * (f - _))
    }
    do
        y();
    while (t < e - i && p + m < r);
    let x = m === 0 ? 0 : (r - p) / m;
    const E = vt(g, d, x)
      , w = vt(_, f, x)
      , R = t - i
      , T = p
      , L = r + a * l(h, n, c);
    for (; t < e - i && p + m < L; )
        y();
    x = m === 0 ? 0 : (L - p) / m;
    const v = vt(g, d, x)
      , b = vt(_, f, x);
    let D;
    if (u) {
        const M = [E, w, v, b];
        Ga(M, 0, 4, 2, u, M, M),
        D = M[0] > M[2]
    } else
        D = E > v;
    const O = Math.PI
      , F = []
      , K = R + i === t;
    t = R,
    m = 0,
    p = T,
    d = s[t],
    f = s[t + 1];
    let S;
    if (K) {
        y(),
        S = Math.atan2(f - _, d - g),
        D && (S += S > 0 ? -O : O);
        const M = (v + E) / 2
          , I = (b + w) / 2;
        return F[0] = [M, I, (L - r) / 2, S, n],
        F
    }
    n = n.replace(/\n/g, " ");
    for (let M = 0, I = n.length; M < I; ) {
        y();
        let P = Math.atan2(f - _, d - g);
        if (D && (P += P > 0 ? -O : O),
        S !== void 0) {
            let B = P - S;
            if (B += B > O ? -2 * O : B < -O ? 2 * O : 0,
            Math.abs(B) > o)
                return null
        }
        S = P;
        const X = M;
        let z = 0;
        for (; M < I; ++M) {
            const B = D ? I - M - 1 : M
              , V = a * l(h, n[B], c);
            if (t + i < e && p + m < r + z + V / 2)
                break;
            z += V
        }
        if (M === X)
            continue;
        const q = D ? n.substring(I - X, I - M) : n.substring(X, M);
        x = m === 0 ? 0 : (r + z / 2 - p) / m;
        const C = vt(g, d, x)
          , pt = vt(_, f, x);
        F.push([C, pt, z / 2, P, q]),
        r += z
    }
    return F
}
const ni = Yt()
  , we = []
  , ne = []
  , se = []
  , Se = [];
function Bo(s) {
    return s[3].declutterBox
}
const _f = new RegExp("[" + String.fromCharCode(1425) + "-" + String.fromCharCode(2303) + String.fromCharCode(64285) + "-" + String.fromCharCode(65023) + String.fromCharCode(65136) + "-" + String.fromCharCode(65276) + String.fromCharCode(67584) + "-" + String.fromCharCode(69631) + String.fromCharCode(124928) + "-" + String.fromCharCode(126975) + "]");
function Zo(s, t) {
    return (t === "start" || t === "end") && !_f.test(s) && (t = t === "start" ? "left" : "right"),
    Fi[t]
}
function mf(s, t, e) {
    return e > 0 && s.push(`
`, ""),
    s.push(t, ""),
    s
}
class pf {
    constructor(t, e, i, n) {
        this.overlaps = i,
        this.pixelRatio = e,
        this.resolution = t,
        this.alignFill_,
        this.instructions = n.instructions,
        this.coordinates = n.coordinates,
        this.coordinateCache_ = {},
        this.renderedTransform_ = $t(),
        this.hitDetectionInstructions = n.hitDetectionInstructions,
        this.pixelCoordinates_ = null,
        this.viewRotation_ = 0,
        this.fillStates = n.fillStates || {},
        this.strokeStates = n.strokeStates || {},
        this.textStates = n.textStates || {},
        this.widths_ = {},
        this.labels_ = {}
    }
    createLabel(t, e, i, n) {
        const r = t + e + i + n;
        if (this.labels_[r])
            return this.labels_[r];
        const o = n ? this.strokeStates[n] : null
          , a = i ? this.fillStates[i] : null
          , l = this.textStates[e]
          , h = this.pixelRatio
          , c = [l.scale[0] * h, l.scale[1] * h]
          , u = Array.isArray(t)
          , d = l.justify ? Fi[l.justify] : Zo(Array.isArray(t) ? t[0] : t, l.textAlign || Zi)
          , f = n && o.lineWidth ? o.lineWidth : 0
          , g = u ? t : t.split(`
`).reduce(mf, [])
          , {width: _, height: m, widths: p, heights: y, lineWidths: x} = Yc(l, g)
          , E = _ + f
          , w = []
          , R = (E + 2) * c[0]
          , T = (m + f) * c[1]
          , L = {
            width: R < 0 ? Math.floor(R) : Math.ceil(R),
            height: T < 0 ? Math.floor(T) : Math.ceil(T),
            contextInstructions: w
        };
        (c[0] != 1 || c[1] != 1) && w.push("scale", c),
        n && (w.push("strokeStyle", o.strokeStyle),
        w.push("lineWidth", f),
        w.push("lineCap", o.lineCap),
        w.push("lineJoin", o.lineJoin),
        w.push("miterLimit", o.miterLimit),
        w.push("setLineDash", [o.lineDash]),
        w.push("lineDashOffset", o.lineDashOffset)),
        i && w.push("fillStyle", a.fillStyle),
        w.push("textBaseline", "middle"),
        w.push("textAlign", "center");
        const v = .5 - d;
        let b = d * E + v * f;
        const D = []
          , O = [];
        let F = 0, K = 0, S = 0, M = 0, I;
        for (let P = 0, X = g.length; P < X; P += 2) {
            const z = g[P];
            if (z === `
`) {
                K += F,
                F = 0,
                b = d * E + v * f,
                ++M;
                continue
            }
            const q = g[P + 1] || l.font;
            q !== I && (n && D.push("font", q),
            i && O.push("font", q),
            I = q),
            F = Math.max(F, y[S]);
            const C = [z, b + v * p[S] + d * (p[S] - x[M]), .5 * (f + F) + K];
            b += p[S],
            n && D.push("strokeText", C),
            i && O.push("fillText", C),
            ++S
        }
        return Array.prototype.push.apply(w, D),
        Array.prototype.push.apply(w, O),
        this.labels_[r] = L,
        L
    }
    replayTextBackground_(t, e, i, n, r, o, a) {
        t.beginPath(),
        t.moveTo.apply(t, e),
        t.lineTo.apply(t, i),
        t.lineTo.apply(t, n),
        t.lineTo.apply(t, r),
        t.lineTo.apply(t, e),
        o && (this.alignFill_ = o[2],
        this.fill_(t)),
        a && (this.setStrokeStyle_(t, a),
        t.stroke())
    }
    calculateImageOrLabelDimensions_(t, e, i, n, r, o, a, l, h, c, u, d, f, g, _, m) {
        a *= d[0],
        l *= d[1];
        let p = i - a
          , y = n - l;
        const x = r + h > t ? t - h : r
          , E = o + c > e ? e - c : o
          , w = g[3] + x * d[0] + g[1]
          , R = g[0] + E * d[1] + g[2]
          , T = p - g[3]
          , L = y - g[0];
        (_ || u !== 0) && (we[0] = T,
        Se[0] = T,
        we[1] = L,
        ne[1] = L,
        ne[0] = T + w,
        se[0] = ne[0],
        se[1] = L + R,
        Se[1] = se[1]);
        let v;
        return u !== 0 ? (v = be($t(), i, n, 1, 1, u, -i, -n),
        ht(v, we),
        ht(v, ne),
        ht(v, se),
        ht(v, Se),
        ge(Math.min(we[0], ne[0], se[0], Se[0]), Math.min(we[1], ne[1], se[1], Se[1]), Math.max(we[0], ne[0], se[0], Se[0]), Math.max(we[1], ne[1], se[1], Se[1]), ni)) : ge(Math.min(T, T + w), Math.min(L, L + R), Math.max(T, T + w), Math.max(L, L + R), ni),
        f && (p = Math.round(p),
        y = Math.round(y)),
        {
            drawImageX: p,
            drawImageY: y,
            drawImageW: x,
            drawImageH: E,
            originX: h,
            originY: c,
            declutterBox: {
                minX: ni[0],
                minY: ni[1],
                maxX: ni[2],
                maxY: ni[3],
                value: m
            },
            canvasTransform: v,
            scale: d
        }
    }
    replayImageOrLabel_(t, e, i, n, r, o, a) {
        const l = !!(o || a)
          , h = n.declutterBox
          , c = t.canvas
          , u = a ? a[2] * n.scale[0] / 2 : 0;
        return h.minX - u <= c.width / e && h.maxX + u >= 0 && h.minY - u <= c.height / e && h.maxY + u >= 0 && (l && this.replayTextBackground_(t, we, ne, se, Se, o, a),
        Bc(t, n.canvasTransform, r, i, n.originX, n.originY, n.drawImageW, n.drawImageH, n.drawImageX, n.drawImageY, n.scale)),
        !0
    }
    fill_(t) {
        if (this.alignFill_) {
            const e = ht(this.renderedTransform_, [0, 0])
              , i = 512 * this.pixelRatio;
            t.save(),
            t.translate(e[0] % i, e[1] % i),
            t.rotate(this.viewRotation_)
        }
        t.fill(),
        this.alignFill_ && t.restore()
    }
    setStrokeStyle_(t, e) {
        t.strokeStyle = e[1],
        t.lineWidth = e[2],
        t.lineCap = e[3],
        t.lineJoin = e[4],
        t.miterLimit = e[5],
        t.lineDashOffset = e[7],
        t.setLineDash(e[6])
    }
    drawLabelWithPointPlacement_(t, e, i, n) {
        const r = this.textStates[e]
          , o = this.createLabel(t, e, n, i)
          , a = this.strokeStates[i]
          , l = this.pixelRatio
          , h = Zo(Array.isArray(t) ? t[0] : t, r.textAlign || Zi)
          , c = Fi[r.textBaseline || Un]
          , u = a && a.lineWidth ? a.lineWidth : 0
          , d = o.width / l - 2 * r.scale[0]
          , f = h * d + 2 * (.5 - h) * u
          , g = c * o.height / l + 2 * (.5 - c) * u;
        return {
            label: o,
            anchorX: f,
            anchorY: g
        }
    }
    execute_(t, e, i, n, r, o, a, l) {
        let h;
        this.pixelCoordinates_ && Pe(i, this.renderedTransform_) ? h = this.pixelCoordinates_ : (this.pixelCoordinates_ || (this.pixelCoordinates_ = []),
        h = Be(this.coordinates, 0, this.coordinates.length, 2, i, this.pixelCoordinates_),
        fh(this.renderedTransform_, i));
        let c = 0;
        const u = n.length;
        let d = 0, f, g, _, m, p, y, x, E, w, R, T, L, v = 0, b = 0, D = null, O = null;
        const F = this.coordinateCache_
          , K = this.viewRotation_
          , S = Math.round(Math.atan2(-i[1], i[0]) * 1e12) / 1e12
          , M = {
            context: t,
            pixelRatio: this.pixelRatio,
            resolution: this.resolution,
            rotation: K
        }
          , I = this.instructions != n || this.overlaps ? 0 : 200;
        let P, X, z, q;
        for (; c < u; ) {
            const C = n[c];
            switch (C[0]) {
            case A.BEGIN_GEOMETRY:
                P = C[1],
                q = C[3],
                P.getGeometry() ? a !== void 0 && !mt(a, q.getExtent()) ? c = C[2] + 1 : ++c : c = C[2];
                break;
            case A.BEGIN_PATH:
                v > I && (this.fill_(t),
                v = 0),
                b > I && (t.stroke(),
                b = 0),
                !v && !b && (t.beginPath(),
                m = NaN,
                p = NaN),
                ++c;
                break;
            case A.CIRCLE:
                d = C[1];
                const B = h[d]
                  , V = h[d + 1]
                  , bt = h[d + 2]
                  , ut = h[d + 3]
                  , ct = bt - B
                  , Qt = ut - V
                  , Ue = Math.sqrt(ct * ct + Qt * Qt);
                t.moveTo(B + Ue, V),
                t.arc(B, V, Ue, 0, 2 * Math.PI, !0),
                ++c;
                break;
            case A.CLOSE_PATH:
                t.closePath(),
                ++c;
                break;
            case A.CUSTOM:
                d = C[1],
                f = C[2];
                const on = C[3]
                  , Ke = C[4]
                  , an = C.length == 6 ? C[5] : void 0;
                M.geometry = on,
                M.feature = P,
                c in F || (F[c] = []);
                const me = F[c];
                an ? an(h, d, f, 2, me) : (me[0] = h[d],
                me[1] = h[d + 1],
                me.length = 2),
                Ke(me, M),
                ++c;
                break;
            case A.DRAW_IMAGE:
                d = C[1],
                f = C[2],
                E = C[3],
                g = C[4],
                _ = C[5];
                let Ti = C[6];
                const pe = C[7]
                  , ln = C[8]
                  , hn = C[9]
                  , cn = C[10];
                let je = C[11];
                const fs = C[12];
                let St = C[13];
                const Pt = C[14]
                  , Dt = C[15];
                if (!E && C.length >= 20) {
                    w = C[19],
                    R = C[20],
                    T = C[21],
                    L = C[22];
                    const Lt = this.drawLabelWithPointPlacement_(w, R, T, L);
                    E = Lt.label,
                    C[3] = E;
                    const qe = C[23];
                    g = (Lt.anchorX - qe) * this.pixelRatio,
                    C[4] = g;
                    const kt = C[24];
                    _ = (Lt.anchorY - kt) * this.pixelRatio,
                    C[5] = _,
                    Ti = E.height,
                    C[6] = Ti,
                    St = E.width,
                    C[13] = St
                }
                let te;
                C.length > 25 && (te = C[25]);
                let He, ke, ye;
                C.length > 17 ? (He = C[16],
                ke = C[17],
                ye = C[18]) : (He = Xe,
                ke = !1,
                ye = !1),
                cn && S ? je += K : !cn && !S && (je -= K);
                let $e = 0;
                for (; d < f; d += 2) {
                    if (te && te[$e++] < St / this.pixelRatio)
                        continue;
                    const Lt = this.calculateImageOrLabelDimensions_(E.width, E.height, h[d], h[d + 1], St, Ti, g, _, ln, hn, je, fs, r, He, ke || ye, P)
                      , qe = [t, e, E, Lt, pe, ke ? D : null, ye ? O : null];
                    if (l) {
                        if (Pt === "none")
                            continue;
                        if (Pt === "obstacle") {
                            l.insert(Lt.declutterBox);
                            continue
                        } else {
                            let kt, ee;
                            if (Dt) {
                                const Mt = f - d;
                                if (!Dt[Mt]) {
                                    Dt[Mt] = qe;
                                    continue
                                }
                                if (kt = Dt[Mt],
                                delete Dt[Mt],
                                ee = Bo(kt),
                                l.collides(ee))
                                    continue
                            }
                            if (l.collides(Lt.declutterBox))
                                continue;
                            kt && (l.insert(ee),
                            this.replayImageOrLabel_.apply(this, kt)),
                            l.insert(Lt.declutterBox)
                        }
                    }
                    this.replayImageOrLabel_.apply(this, qe)
                }
                ++c;
                break;
            case A.DRAW_CHARS:
                const un = C[1]
                  , yt = C[2]
                  , gs = C[3]
                  , Zl = C[4];
                L = C[5];
                const Vl = C[6]
                  , Vr = C[7]
                  , Ur = C[8];
                T = C[9];
                const _s = C[10];
                w = C[11],
                R = C[12];
                const Kr = [C[13], C[13]]
                  , ms = this.textStates[R]
                  , Ri = ms.font
                  , Ii = [ms.scale[0] * Vr, ms.scale[1] * Vr];
                let Li;
                Ri in this.widths_ ? Li = this.widths_[Ri] : (Li = {},
                this.widths_[Ri] = Li);
                const jr = ll(h, un, yt, 2)
                  , Hr = Math.abs(Ii[0]) * Co(Ri, w, Li);
                if (Zl || Hr <= jr) {
                    const Lt = this.textStates[R].textAlign
                      , qe = (jr - Hr) * Fi[Lt]
                      , kt = gf(h, un, yt, 2, w, qe, Vl, Math.abs(Ii[0]), Co, Ri, Li, S ? 0 : this.viewRotation_);
                    t: if (kt) {
                        const ee = [];
                        let Mt, dn, fn, Ct, At;
                        if (T)
                            for (Mt = 0,
                            dn = kt.length; Mt < dn; ++Mt) {
                                At = kt[Mt],
                                fn = At[4],
                                Ct = this.createLabel(fn, R, "", T),
                                g = At[2] + (Ii[0] < 0 ? -_s : _s),
                                _ = gs * Ct.height + (.5 - gs) * 2 * _s * Ii[1] / Ii[0] - Ur;
                                const ie = this.calculateImageOrLabelDimensions_(Ct.width, Ct.height, At[0], At[1], Ct.width, Ct.height, g, _, 0, 0, At[3], Kr, !1, Xe, !1, P);
                                if (l && l.collides(ie.declutterBox))
                                    break t;
                                ee.push([t, e, Ct, ie, 1, null, null])
                            }
                        if (L)
                            for (Mt = 0,
                            dn = kt.length; Mt < dn; ++Mt) {
                                At = kt[Mt],
                                fn = At[4],
                                Ct = this.createLabel(fn, R, L, ""),
                                g = At[2],
                                _ = gs * Ct.height - Ur;
                                const ie = this.calculateImageOrLabelDimensions_(Ct.width, Ct.height, At[0], At[1], Ct.width, Ct.height, g, _, 0, 0, At[3], Kr, !1, Xe, !1, P);
                                if (l && l.collides(ie.declutterBox))
                                    break t;
                                ee.push([t, e, Ct, ie, 1, null, null])
                            }
                        l && l.load(ee.map(Bo));
                        for (let ie = 0, Ul = ee.length; ie < Ul; ++ie)
                            this.replayImageOrLabel_.apply(this, ee[ie])
                    }
                }
                ++c;
                break;
            case A.END_GEOMETRY:
                if (o !== void 0) {
                    P = C[1];
                    const Lt = o(P, q);
                    if (Lt)
                        return Lt
                }
                ++c;
                break;
            case A.FILL:
                I ? v++ : this.fill_(t),
                ++c;
                break;
            case A.MOVE_TO_LINE_TO:
                for (d = C[1],
                f = C[2],
                X = h[d],
                z = h[d + 1],
                y = X + .5 | 0,
                x = z + .5 | 0,
                (y !== m || x !== p) && (t.moveTo(X, z),
                m = y,
                p = x),
                d += 2; d < f; d += 2)
                    X = h[d],
                    z = h[d + 1],
                    y = X + .5 | 0,
                    x = z + .5 | 0,
                    (d == f - 2 || y !== m || x !== p) && (t.lineTo(X, z),
                    m = y,
                    p = x);
                ++c;
                break;
            case A.SET_FILL_STYLE:
                D = C,
                this.alignFill_ = C[2],
                v && (this.fill_(t),
                v = 0,
                b && (t.stroke(),
                b = 0)),
                t.fillStyle = C[1],
                ++c;
                break;
            case A.SET_STROKE_STYLE:
                O = C,
                b && (t.stroke(),
                b = 0),
                this.setStrokeStyle_(t, C),
                ++c;
                break;
            case A.STROKE:
                I ? b++ : t.stroke(),
                ++c;
                break;
            default:
                ++c;
                break
            }
        }
        v && this.fill_(t),
        b && t.stroke()
    }
    execute(t, e, i, n, r, o) {
        this.viewRotation_ = n,
        this.execute_(t, e, i, this.instructions, r, void 0, void 0, o)
    }
    executeHitDetection(t, e, i, n, r) {
        return this.viewRotation_ = i,
        this.execute_(t, 1, e, this.hitDetectionInstructions, !0, n, r)
    }
}
const yf = pf
  , vs = ["Polygon", "Circle", "LineString", "Image", "Text", "Default"];
class xf {
    constructor(t, e, i, n, r, o) {
        this.maxExtent_ = t,
        this.overlaps_ = n,
        this.pixelRatio_ = i,
        this.resolution_ = e,
        this.renderBuffer_ = o,
        this.executorsByZIndex_ = {},
        this.hitDetectionContext_ = null,
        this.hitDetectionTransform_ = $t(),
        this.createExecutors_(r)
    }
    clip(t, e) {
        const i = this.getClipCoords(e);
        t.beginPath(),
        t.moveTo(i[0], i[1]),
        t.lineTo(i[2], i[3]),
        t.lineTo(i[4], i[5]),
        t.lineTo(i[6], i[7]),
        t.clip()
    }
    createExecutors_(t) {
        for (const e in t) {
            let i = this.executorsByZIndex_[e];
            i === void 0 && (i = {},
            this.executorsByZIndex_[e] = i);
            const n = t[e];
            for (const r in n) {
                const o = n[r];
                i[r] = new yf(this.resolution_,this.pixelRatio_,this.overlaps_,o)
            }
        }
    }
    hasExecutors(t) {
        for (const e in this.executorsByZIndex_) {
            const i = this.executorsByZIndex_[e];
            for (let n = 0, r = t.length; n < r; ++n)
                if (t[n]in i)
                    return !0
        }
        return !1
    }
    forEachFeatureAtCoordinate(t, e, i, n, r, o) {
        n = Math.round(n);
        const a = n * 2 + 1
          , l = be(this.hitDetectionTransform_, n + .5, n + .5, 1 / e, -1 / e, -i, -t[0], -t[1])
          , h = !this.hitDetectionContext_;
        h && (this.hitDetectionContext_ = wt(a, a, void 0, {
            willReadFrequently: !0
        }));
        const c = this.hitDetectionContext_;
        c.canvas.width !== a || c.canvas.height !== a ? (c.canvas.width = a,
        c.canvas.height = a) : h || c.clearRect(0, 0, a, a);
        let u;
        this.renderBuffer_ !== void 0 && (u = Yt(),
        Oi(u, t),
        cr(u, e * (this.renderBuffer_ + n), u));
        const d = Ef(n);
        let f;
        function g(w, R) {
            const T = c.getImageData(0, 0, a, a).data;
            for (let L = 0, v = d.length; L < v; L++)
                if (T[d[L]] > 0) {
                    if (!o || f !== "Image" && f !== "Text" || o.includes(w)) {
                        const b = (d[L] - 3) / 4
                          , D = n - b % a
                          , O = n - (b / a | 0)
                          , F = r(w, R, D * D + O * O);
                        if (F)
                            return F
                    }
                    c.clearRect(0, 0, a, a);
                    break
                }
        }
        const _ = Object.keys(this.executorsByZIndex_).map(Number);
        _.sort(Ze);
        let m, p, y, x, E;
        for (m = _.length - 1; m >= 0; --m) {
            const w = _[m].toString();
            for (y = this.executorsByZIndex_[w],
            p = vs.length - 1; p >= 0; --p)
                if (f = vs[p],
                x = y[f],
                x !== void 0 && (E = x.executeHitDetection(c, l, i, g, u),
                E))
                    return E
        }
    }
    getClipCoords(t) {
        const e = this.maxExtent_;
        if (!e)
            return null;
        const i = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , a = [i, n, i, o, r, o, r, n];
        return Be(a, 0, 8, 2, t, a),
        a
    }
    isEmpty() {
        return Ni(this.executorsByZIndex_)
    }
    execute(t, e, i, n, r, o, a) {
        const l = Object.keys(this.executorsByZIndex_).map(Number);
        l.sort(Ze),
        this.maxExtent_ && (t.save(),
        this.clip(t, i)),
        o = o || vs;
        let h, c, u, d, f, g;
        for (a && l.reverse(),
        h = 0,
        c = l.length; h < c; ++h) {
            const _ = l[h].toString();
            for (f = this.executorsByZIndex_[_],
            u = 0,
            d = o.length; u < d; ++u) {
                const m = o[u];
                g = f[m],
                g !== void 0 && g.execute(t, e, i, n, r, a)
            }
        }
        this.maxExtent_ && t.restore()
    }
}
const bs = {};
function Ef(s) {
    if (bs[s] !== void 0)
        return bs[s];
    const t = s * 2 + 1
      , e = s * s
      , i = new Array(e + 1);
    for (let r = 0; r <= s; ++r)
        for (let o = 0; o <= s; ++o) {
            const a = r * r + o * o;
            if (a > e)
                break;
            let l = i[a];
            l || (l = [],
            i[a] = l),
            l.push(((s + r) * t + (s + o)) * 4 + 3),
            r > 0 && l.push(((s - r) * t + (s + o)) * 4 + 3),
            o > 0 && (l.push(((s + r) * t + (s - o)) * 4 + 3),
            r > 0 && l.push(((s - r) * t + (s - o)) * 4 + 3))
        }
    const n = [];
    for (let r = 0, o = i.length; r < o; ++r)
        i[r] && n.push(...i[r]);
    return bs[s] = n,
    n
}
const Vo = xf;
class wf extends Rl {
    constructor(t, e, i, n, r, o, a) {
        super(),
        this.context_ = t,
        this.pixelRatio_ = e,
        this.extent_ = i,
        this.transform_ = n,
        this.transformRotation_ = n ? rs(Math.atan2(n[1], n[0]), 10) : 0,
        this.viewRotation_ = r,
        this.squaredTolerance_ = o,
        this.userTransform_ = a,
        this.contextFillState_ = null,
        this.contextStrokeState_ = null,
        this.contextTextState_ = null,
        this.fillState_ = null,
        this.strokeState_ = null,
        this.image_ = null,
        this.imageAnchorX_ = 0,
        this.imageAnchorY_ = 0,
        this.imageHeight_ = 0,
        this.imageOpacity_ = 0,
        this.imageOriginX_ = 0,
        this.imageOriginY_ = 0,
        this.imageRotateWithView_ = !1,
        this.imageRotation_ = 0,
        this.imageScale_ = [0, 0],
        this.imageWidth_ = 0,
        this.text_ = "",
        this.textOffsetX_ = 0,
        this.textOffsetY_ = 0,
        this.textRotateWithView_ = !1,
        this.textRotation_ = 0,
        this.textScale_ = [0, 0],
        this.textFillState_ = null,
        this.textStrokeState_ = null,
        this.textState_ = null,
        this.pixelCoordinates_ = [],
        this.tmpLocalTransform_ = $t()
    }
    drawImages_(t, e, i, n) {
        if (!this.image_)
            return;
        const r = Be(t, e, i, n, this.transform_, this.pixelCoordinates_)
          , o = this.context_
          , a = this.tmpLocalTransform_
          , l = o.globalAlpha;
        this.imageOpacity_ != 1 && (o.globalAlpha = l * this.imageOpacity_);
        let h = this.imageRotation_;
        this.transformRotation_ === 0 && (h -= this.viewRotation_),
        this.imageRotateWithView_ && (h += this.viewRotation_);
        for (let c = 0, u = r.length; c < u; c += 2) {
            const d = r[c] - this.imageAnchorX_
              , f = r[c + 1] - this.imageAnchorY_;
            if (h !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
                const g = d + this.imageAnchorX_
                  , _ = f + this.imageAnchorY_;
                be(a, g, _, 1, 1, h, -g, -_),
                o.setTransform.apply(o, a),
                o.translate(g, _),
                o.scale(this.imageScale_[0], this.imageScale_[1]),
                o.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, -this.imageAnchorX_, -this.imageAnchorY_, this.imageWidth_, this.imageHeight_),
                o.setTransform(1, 0, 0, 1, 0, 0)
            } else
                o.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, d, f, this.imageWidth_, this.imageHeight_)
        }
        this.imageOpacity_ != 1 && (o.globalAlpha = l)
    }
    drawText_(t, e, i, n) {
        if (!this.textState_ || this.text_ === "")
            return;
        this.textFillState_ && this.setContextFillState_(this.textFillState_),
        this.textStrokeState_ && this.setContextStrokeState_(this.textStrokeState_),
        this.setContextTextState_(this.textState_);
        const r = Be(t, e, i, n, this.transform_, this.pixelCoordinates_)
          , o = this.context_;
        let a = this.textRotation_;
        for (this.transformRotation_ === 0 && (a -= this.viewRotation_),
        this.textRotateWithView_ && (a += this.viewRotation_); e < i; e += n) {
            const l = r[e] + this.textOffsetX_
              , h = r[e + 1] + this.textOffsetY_;
            a !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1 ? (o.translate(l - this.textOffsetX_, h - this.textOffsetY_),
            o.rotate(a),
            o.translate(this.textOffsetX_, this.textOffsetY_),
            o.scale(this.textScale_[0], this.textScale_[1]),
            this.textStrokeState_ && o.strokeText(this.text_, 0, 0),
            this.textFillState_ && o.fillText(this.text_, 0, 0),
            o.setTransform(1, 0, 0, 1, 0, 0)) : (this.textStrokeState_ && o.strokeText(this.text_, l, h),
            this.textFillState_ && o.fillText(this.text_, l, h))
        }
    }
    moveToLineTo_(t, e, i, n, r) {
        const o = this.context_
          , a = Be(t, e, i, n, this.transform_, this.pixelCoordinates_);
        o.moveTo(a[0], a[1]);
        let l = a.length;
        r && (l -= 2);
        for (let h = 2; h < l; h += 2)
            o.lineTo(a[h], a[h + 1]);
        return r && o.closePath(),
        i
    }
    drawRings_(t, e, i, n) {
        for (let r = 0, o = i.length; r < o; ++r)
            e = this.moveToLineTo_(t, e, i[r], n, !0);
        return e
    }
    drawCircle(t) {
        if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)),
        !!mt(this.extent_, t.getExtent())) {
            if (this.fillState_ || this.strokeState_) {
                this.fillState_ && this.setContextFillState_(this.fillState_),
                this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
                const e = fc(t, this.transform_, this.pixelCoordinates_)
                  , i = e[2] - e[0]
                  , n = e[3] - e[1]
                  , r = Math.sqrt(i * i + n * n)
                  , o = this.context_;
                o.beginPath(),
                o.arc(e[0], e[1], r, 0, 2 * Math.PI),
                this.fillState_ && o.fill(),
                this.strokeState_ && o.stroke()
            }
            this.text_ !== "" && this.drawText_(t.getCenter(), 0, 2, 2)
        }
    }
    setStyle(t) {
        this.setFillStrokeStyle(t.getFill(), t.getStroke()),
        this.setImageStyle(t.getImage()),
        this.setTextStyle(t.getText())
    }
    setTransform(t) {
        this.transform_ = t
    }
    drawGeometry(t) {
        switch (t.getType()) {
        case "Point":
            this.drawPoint(t);
            break;
        case "LineString":
            this.drawLineString(t);
            break;
        case "Polygon":
            this.drawPolygon(t);
            break;
        case "MultiPoint":
            this.drawMultiPoint(t);
            break;
        case "MultiLineString":
            this.drawMultiLineString(t);
            break;
        case "MultiPolygon":
            this.drawMultiPolygon(t);
            break;
        case "GeometryCollection":
            this.drawGeometryCollection(t);
            break;
        case "Circle":
            this.drawCircle(t);
            break
        }
    }
    drawFeature(t, e) {
        const i = e.getGeometryFunction()(t);
        i && (this.setStyle(e),
        this.drawGeometry(i))
    }
    drawGeometryCollection(t) {
        const e = t.getGeometriesArray();
        for (let i = 0, n = e.length; i < n; ++i)
            this.drawGeometry(e[i])
    }
    drawPoint(t) {
        this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        const e = t.getFlatCoordinates()
          , i = t.getStride();
        this.image_ && this.drawImages_(e, 0, e.length, i),
        this.text_ !== "" && this.drawText_(e, 0, e.length, i)
    }
    drawMultiPoint(t) {
        this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        const e = t.getFlatCoordinates()
          , i = t.getStride();
        this.image_ && this.drawImages_(e, 0, e.length, i),
        this.text_ !== "" && this.drawText_(e, 0, e.length, i)
    }
    drawLineString(t) {
        if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)),
        !!mt(this.extent_, t.getExtent())) {
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
                const e = this.context_
                  , i = t.getFlatCoordinates();
                e.beginPath(),
                this.moveToLineTo_(i, 0, i.length, t.getStride(), !1),
                e.stroke()
            }
            if (this.text_ !== "") {
                const e = t.getFlatMidpoint();
                this.drawText_(e, 0, 2, 2)
            }
        }
    }
    drawMultiLineString(t) {
        this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_));
        const e = t.getExtent();
        if (mt(this.extent_, e)) {
            if (this.strokeState_) {
                this.setContextStrokeState_(this.strokeState_);
                const i = this.context_
                  , n = t.getFlatCoordinates();
                let r = 0;
                const o = t.getEnds()
                  , a = t.getStride();
                i.beginPath();
                for (let l = 0, h = o.length; l < h; ++l)
                    r = this.moveToLineTo_(n, r, o[l], a, !1);
                i.stroke()
            }
            if (this.text_ !== "") {
                const i = t.getFlatMidpoints();
                this.drawText_(i, 0, i.length, 2)
            }
        }
    }
    drawPolygon(t) {
        if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)),
        !!mt(this.extent_, t.getExtent())) {
            if (this.strokeState_ || this.fillState_) {
                this.fillState_ && this.setContextFillState_(this.fillState_),
                this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
                const e = this.context_;
                e.beginPath(),
                this.drawRings_(t.getOrientedFlatCoordinates(), 0, t.getEnds(), t.getStride()),
                this.fillState_ && e.fill(),
                this.strokeState_ && e.stroke()
            }
            if (this.text_ !== "") {
                const e = t.getFlatInteriorPoint();
                this.drawText_(e, 0, 2, 2)
            }
        }
    }
    drawMultiPolygon(t) {
        if (this.squaredTolerance_ && (t = t.simplifyTransformed(this.squaredTolerance_, this.userTransform_)),
        !!mt(this.extent_, t.getExtent())) {
            if (this.strokeState_ || this.fillState_) {
                this.fillState_ && this.setContextFillState_(this.fillState_),
                this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
                const e = this.context_
                  , i = t.getOrientedFlatCoordinates();
                let n = 0;
                const r = t.getEndss()
                  , o = t.getStride();
                e.beginPath();
                for (let a = 0, l = r.length; a < l; ++a) {
                    const h = r[a];
                    n = this.drawRings_(i, n, h, o)
                }
                this.fillState_ && e.fill(),
                this.strokeState_ && e.stroke()
            }
            if (this.text_ !== "") {
                const e = t.getFlatInteriorPoints();
                this.drawText_(e, 0, e.length, 2)
            }
        }
    }
    setContextFillState_(t) {
        const e = this.context_
          , i = this.contextFillState_;
        i ? i.fillStyle != t.fillStyle && (i.fillStyle = t.fillStyle,
        e.fillStyle = t.fillStyle) : (e.fillStyle = t.fillStyle,
        this.contextFillState_ = {
            fillStyle: t.fillStyle
        })
    }
    setContextStrokeState_(t) {
        const e = this.context_
          , i = this.contextStrokeState_;
        i ? (i.lineCap != t.lineCap && (i.lineCap = t.lineCap,
        e.lineCap = t.lineCap),
        Pe(i.lineDash, t.lineDash) || e.setLineDash(i.lineDash = t.lineDash),
        i.lineDashOffset != t.lineDashOffset && (i.lineDashOffset = t.lineDashOffset,
        e.lineDashOffset = t.lineDashOffset),
        i.lineJoin != t.lineJoin && (i.lineJoin = t.lineJoin,
        e.lineJoin = t.lineJoin),
        i.lineWidth != t.lineWidth && (i.lineWidth = t.lineWidth,
        e.lineWidth = t.lineWidth),
        i.miterLimit != t.miterLimit && (i.miterLimit = t.miterLimit,
        e.miterLimit = t.miterLimit),
        i.strokeStyle != t.strokeStyle && (i.strokeStyle = t.strokeStyle,
        e.strokeStyle = t.strokeStyle)) : (e.lineCap = t.lineCap,
        e.setLineDash(t.lineDash),
        e.lineDashOffset = t.lineDashOffset,
        e.lineJoin = t.lineJoin,
        e.lineWidth = t.lineWidth,
        e.miterLimit = t.miterLimit,
        e.strokeStyle = t.strokeStyle,
        this.contextStrokeState_ = {
            lineCap: t.lineCap,
            lineDash: t.lineDash,
            lineDashOffset: t.lineDashOffset,
            lineJoin: t.lineJoin,
            lineWidth: t.lineWidth,
            miterLimit: t.miterLimit,
            strokeStyle: t.strokeStyle
        })
    }
    setContextTextState_(t) {
        const e = this.context_
          , i = this.contextTextState_
          , n = t.textAlign ? t.textAlign : Zi;
        i ? (i.font != t.font && (i.font = t.font,
        e.font = t.font),
        i.textAlign != n && (i.textAlign = n,
        e.textAlign = n),
        i.textBaseline != t.textBaseline && (i.textBaseline = t.textBaseline,
        e.textBaseline = t.textBaseline)) : (e.font = t.font,
        e.textAlign = n,
        e.textBaseline = t.textBaseline,
        this.contextTextState_ = {
            font: t.font,
            textAlign: n,
            textBaseline: t.textBaseline
        })
    }
    setFillStrokeStyle(t, e) {
        if (!t)
            this.fillState_ = null;
        else {
            const i = t.getColor();
            this.fillState_ = {
                fillStyle: jt(i || fe)
            }
        }
        if (!e)
            this.strokeState_ = null;
        else {
            const i = e.getColor()
              , n = e.getLineCap()
              , r = e.getLineDash()
              , o = e.getLineDashOffset()
              , a = e.getLineJoin()
              , l = e.getWidth()
              , h = e.getMiterLimit()
              , c = r || Wi;
            this.strokeState_ = {
                lineCap: n !== void 0 ? n : Vn,
                lineDash: this.pixelRatio_ === 1 ? c : c.map(u=>u * this.pixelRatio_),
                lineDashOffset: (o || Xi) * this.pixelRatio_,
                lineJoin: a !== void 0 ? a : Ei,
                lineWidth: (l !== void 0 ? l : Vi) * this.pixelRatio_,
                miterLimit: h !== void 0 ? h : Yi,
                strokeStyle: jt(i || Bi)
            }
        }
    }
    setImageStyle(t) {
        let e;
        if (!t || !(e = t.getSize())) {
            this.image_ = null;
            return
        }
        const i = t.getPixelRatio(this.pixelRatio_)
          , n = t.getAnchor()
          , r = t.getOrigin();
        this.image_ = t.getImage(this.pixelRatio_),
        this.imageAnchorX_ = n[0] * i,
        this.imageAnchorY_ = n[1] * i,
        this.imageHeight_ = e[1] * i,
        this.imageOpacity_ = t.getOpacity(),
        this.imageOriginX_ = r[0],
        this.imageOriginY_ = r[1],
        this.imageRotateWithView_ = t.getRotateWithView(),
        this.imageRotation_ = t.getRotation();
        const o = t.getScaleArray();
        this.imageScale_ = [o[0] * this.pixelRatio_ / i, o[1] * this.pixelRatio_ / i],
        this.imageWidth_ = e[0] * i
    }
    setTextStyle(t) {
        if (!t)
            this.text_ = "";
        else {
            const e = t.getFill();
            if (!e)
                this.textFillState_ = null;
            else {
                const f = e.getColor();
                this.textFillState_ = {
                    fillStyle: jt(f || fe)
                }
            }
            const i = t.getStroke();
            if (!i)
                this.textStrokeState_ = null;
            else {
                const f = i.getColor()
                  , g = i.getLineCap()
                  , _ = i.getLineDash()
                  , m = i.getLineDashOffset()
                  , p = i.getLineJoin()
                  , y = i.getWidth()
                  , x = i.getMiterLimit();
                this.textStrokeState_ = {
                    lineCap: g !== void 0 ? g : Vn,
                    lineDash: _ || Wi,
                    lineDashOffset: m || Xi,
                    lineJoin: p !== void 0 ? p : Ei,
                    lineWidth: y !== void 0 ? y : Vi,
                    miterLimit: x !== void 0 ? x : Yi,
                    strokeStyle: jt(f || Bi)
                }
            }
            const n = t.getFont()
              , r = t.getOffsetX()
              , o = t.getOffsetY()
              , a = t.getRotateWithView()
              , l = t.getRotation()
              , h = t.getScaleArray()
              , c = t.getText()
              , u = t.getTextAlign()
              , d = t.getTextBaseline();
            this.textState_ = {
                font: n !== void 0 ? n : $a,
                textAlign: u !== void 0 ? u : Zi,
                textBaseline: d !== void 0 ? d : Un
            },
            this.text_ = c !== void 0 ? Array.isArray(c) ? c.reduce((f,g,_)=>f += _ % 2 ? " " : g, "") : c : "",
            this.textOffsetX_ = r !== void 0 ? this.pixelRatio_ * r : 0,
            this.textOffsetY_ = o !== void 0 ? this.pixelRatio_ * o : 0,
            this.textRotateWithView_ = a !== void 0 ? a : !1,
            this.textRotation_ = l !== void 0 ? l : 0,
            this.textScale_ = [this.pixelRatio_ * h[0], this.pixelRatio_ * h[1]]
        }
    }
}
const Ll = wf
  , Kt = .5;
function Sf(s, t, e, i, n, r, o) {
    const a = s[0] * Kt
      , l = s[1] * Kt
      , h = wt(a, l);
    h.imageSmoothingEnabled = !1;
    const c = h.canvas
      , u = new Ll(h,Kt,n,null,o)
      , d = e.length
      , f = Math.floor((256 * 256 * 256 - 1) / d)
      , g = {};
    for (let m = 1; m <= d; ++m) {
        const p = e[m - 1]
          , y = p.getStyleFunction() || i;
        if (!i)
            continue;
        let x = y(p, r);
        if (!x)
            continue;
        Array.isArray(x) || (x = [x]);
        const w = (m * f).toString(16).padStart(7, "#00000");
        for (let R = 0, T = x.length; R < T; ++R) {
            const L = x[R]
              , v = L.getGeometryFunction()(p);
            if (!v || !mt(n, v.getExtent()))
                continue;
            const b = L.clone()
              , D = b.getFill();
            D && D.setColor(w);
            const O = b.getStroke();
            O && (O.setColor(w),
            O.setLineDash(null)),
            b.setText(void 0);
            const F = L.getImage();
            if (F && F.getOpacity() !== 0) {
                const I = F.getImageSize();
                if (!I)
                    continue;
                const P = wt(I[0], I[1], void 0, {
                    alpha: !1
                })
                  , X = P.canvas;
                P.fillStyle = w,
                P.fillRect(0, 0, X.width, X.height),
                b.setImage(new Ht({
                    img: X,
                    imgSize: I,
                    anchor: F.getAnchor(),
                    anchorXUnits: "pixels",
                    anchorYUnits: "pixels",
                    offset: F.getOrigin(),
                    opacity: 1,
                    size: F.getSize(),
                    scale: F.getScale(),
                    rotation: F.getRotation(),
                    rotateWithView: F.getRotateWithView()
                }))
            }
            const K = b.getZIndex() || 0;
            let S = g[K];
            S || (S = {},
            g[K] = S,
            S.Polygon = [],
            S.Circle = [],
            S.LineString = [],
            S.Point = []);
            const M = v.getType();
            if (M === "GeometryCollection") {
                const I = v.getGeometriesArrayRecursive();
                for (let P = 0, X = I.length; P < X; ++P) {
                    const z = I[P];
                    S[z.getType().replace("Multi", "")].push(z, b)
                }
            } else
                S[M.replace("Multi", "")].push(v, b)
        }
    }
    const _ = Object.keys(g).map(Number).sort(Ze);
    for (let m = 0, p = _.length; m < p; ++m) {
        const y = g[_[m]];
        for (const x in y) {
            const E = y[x];
            for (let w = 0, R = E.length; w < R; w += 2) {
                u.setStyle(E[w + 1]);
                for (let T = 0, L = t.length; T < L; ++T)
                    u.setTransform(t[T]),
                    u.drawGeometry(E[w])
            }
        }
    }
    return h.getImageData(0, 0, c.width, c.height)
}
function Cf(s, t, e) {
    const i = [];
    if (e) {
        const n = Math.floor(Math.round(s[0]) * Kt)
          , r = Math.floor(Math.round(s[1]) * Kt)
          , o = (N(n, 0, e.width - 1) + N(r, 0, e.height - 1) * e.width) * 4
          , a = e.data[o]
          , l = e.data[o + 1]
          , c = e.data[o + 2] + 256 * (l + 256 * a)
          , u = Math.floor((256 * 256 * 256 - 1) / t.length);
        c && c % u === 0 && i.push(t[c / u - 1])
    }
    return i
}
const Tf = .5
  , Ml = {
    Point: kf,
    LineString: vf,
    Polygon: Of,
    MultiPoint: Af,
    MultiLineString: bf,
    MultiPolygon: Pf,
    GeometryCollection: Mf,
    Circle: If
};
function Rf(s, t) {
    return parseInt(U(s), 10) - parseInt(U(t), 10)
}
function vl(s, t) {
    const e = Qs(s, t);
    return e * e
}
function Qs(s, t) {
    return Tf * s / t
}
function If(s, t, e, i, n) {
    const r = e.getFill()
      , o = e.getStroke();
    if (r || o) {
        const l = s.getBuilder(e.getZIndex(), "Circle");
        l.setFillStrokeStyle(r, o),
        l.drawCircle(t, i)
    }
    const a = e.getText();
    if (a && a.getText()) {
        const l = (n || s).getBuilder(e.getZIndex(), "Text");
        l.setTextStyle(a),
        l.drawText(t, i)
    }
}
function Uo(s, t, e, i, n, r, o) {
    let a = !1;
    const l = e.getImage();
    if (l) {
        const h = l.getImageState();
        h == ot.LOADED || h == ot.ERROR ? l.unlistenImageChange(n) : (h == ot.IDLE && l.load(),
        l.listenImageChange(n),
        a = !0)
    }
    return Lf(s, t, e, i, r, o),
    a
}
function Lf(s, t, e, i, n, r) {
    const o = e.getGeometryFunction()(t);
    if (!o)
        return;
    const a = o.simplifyTransformed(i, n);
    if (e.getRenderer())
        bl(s, a, e, t);
    else {
        const h = Ml[a.getType()];
        h(s, a, e, t, r)
    }
}
function bl(s, t, e, i) {
    if (t.getType() == "GeometryCollection") {
        const r = t.getGeometries();
        for (let o = 0, a = r.length; o < a; ++o)
            bl(s, r[o], e, i);
        return
    }
    s.getBuilder(e.getZIndex(), "Default").drawCustom(t, i, e.getRenderer(), e.getHitDetectionRenderer())
}
function Mf(s, t, e, i, n) {
    const r = t.getGeometriesArray();
    let o, a;
    for (o = 0,
    a = r.length; o < a; ++o) {
        const l = Ml[r[o].getType()];
        l(s, r[o], e, i, n)
    }
}
function vf(s, t, e, i, n) {
    const r = e.getStroke();
    if (r) {
        const a = s.getBuilder(e.getZIndex(), "LineString");
        a.setFillStrokeStyle(null, r),
        a.drawLineString(t, i)
    }
    const o = e.getText();
    if (o && o.getText()) {
        const a = (n || s).getBuilder(e.getZIndex(), "Text");
        a.setTextStyle(o),
        a.drawText(t, i)
    }
}
function bf(s, t, e, i, n) {
    const r = e.getStroke();
    if (r) {
        const a = s.getBuilder(e.getZIndex(), "LineString");
        a.setFillStrokeStyle(null, r),
        a.drawMultiLineString(t, i)
    }
    const o = e.getText();
    if (o && o.getText()) {
        const a = (n || s).getBuilder(e.getZIndex(), "Text");
        a.setTextStyle(o),
        a.drawText(t, i)
    }
}
function Pf(s, t, e, i, n) {
    const r = e.getFill()
      , o = e.getStroke();
    if (o || r) {
        const l = s.getBuilder(e.getZIndex(), "Polygon");
        l.setFillStrokeStyle(r, o),
        l.drawMultiPolygon(t, i)
    }
    const a = e.getText();
    if (a && a.getText()) {
        const l = (n || s).getBuilder(e.getZIndex(), "Text");
        l.setTextStyle(a),
        l.drawText(t, i)
    }
}
function kf(s, t, e, i, n) {
    const r = e.getImage()
      , o = e.getText();
    let a;
    if (r) {
        if (r.getImageState() != ot.LOADED)
            return;
        let l = s;
        if (n) {
            const c = r.getDeclutterMode();
            if (c !== "none")
                if (l = n,
                c === "obstacle") {
                    const u = s.getBuilder(e.getZIndex(), "Image");
                    u.setImageStyle(r, a),
                    u.drawPoint(t, i)
                } else
                    o && o.getText() && (a = {})
        }
        const h = l.getBuilder(e.getZIndex(), "Image");
        h.setImageStyle(r, a),
        h.drawPoint(t, i)
    }
    if (o && o.getText()) {
        let l = s;
        n && (l = n);
        const h = l.getBuilder(e.getZIndex(), "Text");
        h.setTextStyle(o, a),
        h.drawText(t, i)
    }
}
function Af(s, t, e, i, n) {
    const r = e.getImage()
      , o = e.getText();
    let a;
    if (r) {
        if (r.getImageState() != ot.LOADED)
            return;
        let l = s;
        if (n) {
            const c = r.getDeclutterMode();
            if (c !== "none")
                if (l = n,
                c === "obstacle") {
                    const u = s.getBuilder(e.getZIndex(), "Image");
                    u.setImageStyle(r, a),
                    u.drawMultiPoint(t, i)
                } else
                    o && o.getText() && (a = {})
        }
        const h = l.getBuilder(e.getZIndex(), "Image");
        h.setImageStyle(r, a),
        h.drawMultiPoint(t, i)
    }
    if (o && o.getText()) {
        let l = s;
        n && (l = n);
        const h = l.getBuilder(e.getZIndex(), "Text");
        h.setTextStyle(o, a),
        h.drawText(t, i)
    }
}
function Of(s, t, e, i, n) {
    const r = e.getFill()
      , o = e.getStroke();
    if (r || o) {
        const l = s.getBuilder(e.getZIndex(), "Polygon");
        l.setFillStrokeStyle(r, o),
        l.drawPolygon(t, i)
    }
    const a = e.getText();
    if (a && a.getText()) {
        const l = (n || s).getBuilder(e.getZIndex(), "Text");
        l.setTextStyle(a),
        l.drawText(t, i)
    }
}
class Ff extends Il {
    constructor(t) {
        super(t),
        this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this),
        this.animatingOrInteracting_,
        this.hitDetectionImageData_ = null,
        this.renderedFeatures_ = null,
        this.renderedRevision_ = -1,
        this.renderedResolution_ = NaN,
        this.renderedExtent_ = Yt(),
        this.wrappedRenderedExtent_ = Yt(),
        this.renderedRotation_,
        this.renderedCenter_ = null,
        this.renderedProjection_ = null,
        this.renderedRenderOrder_ = null,
        this.replayGroup_ = null,
        this.replayGroupChanged = !0,
        this.declutterExecutorGroup = null,
        this.clipping = !0,
        this.compositionContext_ = null,
        this.opacity_ = 1
    }
    renderWorlds(t, e, i) {
        const n = e.extent
          , r = e.viewState
          , o = r.center
          , a = r.resolution
          , l = r.projection
          , h = r.rotation
          , c = l.getExtent()
          , u = this.getLayer().getSource()
          , d = e.pixelRatio
          , f = e.viewHints
          , g = !(f[gt.ANIMATING] || f[gt.INTERACTING])
          , _ = this.compositionContext_
          , m = Math.round(e.size[0] * d)
          , p = Math.round(e.size[1] * d)
          , y = u.getWrapX() && l.canWrapX()
          , x = y ? $(c) : null
          , E = y ? Math.ceil((n[2] - c[2]) / x) + 1 : 1;
        let w = y ? Math.floor((n[0] - c[0]) / x) : 0;
        do {
            const R = this.getRenderTransform(o, a, h, d, m, p, w * x);
            t.execute(_, 1, R, h, g, void 0, i)
        } while (++w < E)
    }
    setupCompositionContext_() {
        if (this.opacity_ !== 1) {
            const t = wt(this.context.canvas.width, this.context.canvas.height, Yo);
            this.compositionContext_ = t
        } else
            this.compositionContext_ = this.context
    }
    releaseCompositionContext_() {
        if (this.opacity_ !== 1) {
            const t = this.context.globalAlpha;
            this.context.globalAlpha = this.opacity_,
            this.context.drawImage(this.compositionContext_.canvas, 0, 0),
            this.context.globalAlpha = t,
            hs(this.compositionContext_),
            Yo.push(this.compositionContext_.canvas),
            this.compositionContext_ = null
        }
    }
    renderDeclutter(t) {
        this.declutterExecutorGroup && (this.setupCompositionContext_(),
        this.renderWorlds(this.declutterExecutorGroup, t, t.declutterTree),
        this.releaseCompositionContext_())
    }
    renderFrame(t, e) {
        const i = t.pixelRatio
          , n = t.layerStatesArray[t.layerIndex];
        gh(this.pixelTransform, 1 / i, 1 / i),
        hr(this.inversePixelTransform, this.pixelTransform);
        const r = wa(this.pixelTransform);
        this.useContainer(e, r, this.getBackground(t));
        const o = this.context
          , a = o.canvas
          , l = this.replayGroup_
          , h = this.declutterExecutorGroup;
        if ((!l || l.isEmpty()) && (!h || h.isEmpty()))
            return null;
        const c = Math.round(t.size[0] * i)
          , u = Math.round(t.size[1] * i);
        a.width != c || a.height != u ? (a.width = c,
        a.height = u,
        a.style.transform !== r && (a.style.transform = r)) : this.containerReused || o.clearRect(0, 0, c, u),
        this.preRender(o, t);
        const d = t.viewState;
        d.projection,
        this.opacity_ = n.opacity,
        this.setupCompositionContext_();
        let f = !1
          , g = !0;
        if (n.extent && this.clipping) {
            const _ = Ge(n.extent);
            g = mt(_, t.extent),
            f = g && !ce(_, t.extent),
            f && this.clipUnrotated(this.compositionContext_, t, _)
        }
        return g && this.renderWorlds(l, t),
        f && this.compositionContext_.restore(),
        this.releaseCompositionContext_(),
        this.postRender(o, t),
        this.renderedRotation_ !== d.rotation && (this.renderedRotation_ = d.rotation,
        this.hitDetectionImageData_ = null),
        this.container
    }
    getFeatures(t) {
        return new Promise(e=>{
            if (!this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
                const i = [this.context.canvas.width, this.context.canvas.height];
                ht(this.pixelTransform, i);
                const n = this.renderedCenter_
                  , r = this.renderedResolution_
                  , o = this.renderedRotation_
                  , a = this.renderedProjection_
                  , l = this.wrappedRenderedExtent_
                  , h = this.getLayer()
                  , c = []
                  , u = i[0] * Kt
                  , d = i[1] * Kt;
                c.push(this.getRenderTransform(n, r, o, Kt, u, d, 0).slice());
                const f = h.getSource()
                  , g = a.getExtent();
                if (f.getWrapX() && a.canWrapX() && !ce(g, l)) {
                    let _ = l[0];
                    const m = $(g);
                    let p = 0, y;
                    for (; _ < g[0]; )
                        --p,
                        y = m * p,
                        c.push(this.getRenderTransform(n, r, o, Kt, u, d, y).slice()),
                        _ += m;
                    for (p = 0,
                    _ = l[2]; _ > g[2]; )
                        ++p,
                        y = m * p,
                        c.push(this.getRenderTransform(n, r, o, Kt, u, d, y).slice()),
                        _ -= m
                }
                this.hitDetectionImageData_ = Sf(i, c, this.renderedFeatures_, h.getStyleFunction(), l, r, o)
            }
            e(Cf(t, this.renderedFeatures_, this.hitDetectionImageData_))
        }
        )
    }
    forEachFeatureAtCoordinate(t, e, i, n, r) {
        if (!this.replayGroup_)
            return;
        const o = e.viewState.resolution
          , a = e.viewState.rotation
          , l = this.getLayer()
          , h = {}
          , c = function(f, g, _) {
            const m = U(f)
              , p = h[m];
            if (p) {
                if (p !== !0 && _ < p.distanceSq) {
                    if (_ === 0)
                        return h[m] = !0,
                        r.splice(r.lastIndexOf(p), 1),
                        n(f, l, g);
                    p.geometry = g,
                    p.distanceSq = _
                }
            } else {
                if (_ === 0)
                    return h[m] = !0,
                    n(f, l, g);
                r.push(h[m] = {
                    feature: f,
                    layer: l,
                    geometry: g,
                    distanceSq: _,
                    callback: n
                })
            }
        };
        let u;
        const d = [this.replayGroup_];
        return this.declutterExecutorGroup && d.push(this.declutterExecutorGroup),
        d.some(f=>u = f.forEachFeatureAtCoordinate(t, o, a, i, c, f === this.declutterExecutorGroup && e.declutterTree ? e.declutterTree.all().map(g=>g.value) : null)),
        u
    }
    handleFontsChanged() {
        const t = this.getLayer();
        t.getVisible() && this.replayGroup_ && t.changed()
    }
    handleStyleImageChange_(t) {
        this.renderIfReadyAndVisible()
    }
    prepareFrame(t) {
        const e = this.getLayer()
          , i = e.getSource();
        if (!i)
            return !1;
        const n = t.viewHints[gt.ANIMATING]
          , r = t.viewHints[gt.INTERACTING]
          , o = e.getUpdateWhileAnimating()
          , a = e.getUpdateWhileInteracting();
        if (this.ready && !o && n || !a && r)
            return this.animatingOrInteracting_ = !0,
            !0;
        this.animatingOrInteracting_ = !1;
        const l = t.extent
          , h = t.viewState
          , c = h.projection
          , u = h.resolution
          , d = t.pixelRatio
          , f = e.getRevision()
          , g = e.getRenderBuffer();
        let _ = e.getRenderOrder();
        _ === void 0 && (_ = Rf);
        const m = h.center.slice()
          , p = cr(l, g * u)
          , y = p.slice()
          , x = [p.slice()]
          , E = c.getExtent();
        if (i.getWrapX() && c.canWrapX() && !ce(E, t.extent)) {
            const S = $(E)
              , M = Math.max($(p) / 2, S);
            p[0] = E[0] - M,
            p[2] = E[2] + M,
            gr(m, c);
            const I = ur(x[0], c);
            I[0] < E[0] && I[2] < E[2] ? x.push([I[0] + S, I[1], I[2] + S, I[3]]) : I[0] > E[0] && I[2] > E[2] && x.push([I[0] - S, I[1], I[2] - S, I[3]])
        }
        if (this.ready && this.renderedResolution_ == u && this.renderedRevision_ == f && this.renderedRenderOrder_ == _ && ce(this.wrappedRenderedExtent_, p))
            return Pe(this.renderedExtent_, y) || (this.hitDetectionImageData_ = null,
            this.renderedExtent_ = y),
            this.renderedCenter_ = m,
            this.replayGroupChanged = !1,
            !0;
        this.replayGroup_ = null;
        const w = new Xo(Qs(u, d),p,u,d);
        let R;
        this.getLayer().getDeclutter() && (R = new Xo(Qs(u, d),p,u,d));
        let T;
        for (let S = 0, M = x.length; S < M; ++S)
            i.loadFeatures(x[S], u, c);
        const L = vl(u, d);
        let v = !0;
        const b = S=>{
            let M;
            const I = S.getStyleFunction() || e.getStyleFunction();
            if (I && (M = I(S, u)),
            M) {
                const P = this.renderFeature(S, L, M, w, T, R);
                v = v && !P
            }
        }
          , D = Da(p)
          , O = i.getFeaturesInExtent(D);
        _ && O.sort(_);
        for (let S = 0, M = O.length; S < M; ++S)
            b(O[S]);
        this.renderedFeatures_ = O,
        this.ready = v;
        const F = w.finish()
          , K = new Vo(p,u,d,i.getOverlaps(),F,e.getRenderBuffer());
        return R && (this.declutterExecutorGroup = new Vo(p,u,d,i.getOverlaps(),R.finish(),e.getRenderBuffer())),
        this.renderedResolution_ = u,
        this.renderedRevision_ = f,
        this.renderedRenderOrder_ = _,
        this.renderedExtent_ = y,
        this.wrappedRenderedExtent_ = p,
        this.renderedCenter_ = m,
        this.renderedProjection_ = c,
        this.replayGroup_ = K,
        this.hitDetectionImageData_ = null,
        this.replayGroupChanged = !0,
        !0
    }
    renderFeature(t, e, i, n, r, o) {
        if (!i)
            return !1;
        let a = !1;
        if (Array.isArray(i))
            for (let l = 0, h = i.length; l < h; ++l)
                a = Uo(n, t, i[l], e, this.boundHandleStyleImageChange_, r, o) || a;
        else
            a = Uo(n, t, i, e, this.boundHandleStyleImageChange_, r, o);
        return a
    }
}
const Df = Ff;
class Nf extends $d {
    constructor(t) {
        super(t)
    }
    createRenderer() {
        return new Df(this)
    }
}
const Tt = Nf
  , Tn = {
    PRELOAD: "preload",
    USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};
class Gf extends ls {
    constructor(t) {
        t = t || {};
        const e = Object.assign({}, t);
        delete e.preload,
        delete e.useInterimTilesOnError,
        super(e),
        this.on,
        this.once,
        this.un,
        this.setPreload(t.preload !== void 0 ? t.preload : 0),
        this.setUseInterimTilesOnError(t.useInterimTilesOnError !== void 0 ? t.useInterimTilesOnError : !0)
    }
    getPreload() {
        return this.get(Tn.PRELOAD)
    }
    setPreload(t) {
        this.set(Tn.PRELOAD, t)
    }
    getUseInterimTilesOnError() {
        return this.get(Tn.USE_INTERIM_TILES_ON_ERROR)
    }
    setUseInterimTilesOnError(t) {
        this.set(Tn.USE_INTERIM_TILES_ON_ERROR, t)
    }
    getData(t) {
        return super.getData(t)
    }
}
const zf = Gf;
class Wf extends Il {
    constructor(t) {
        super(t),
        this.extentChanged = !0,
        this.renderedExtent_ = null,
        this.renderedPixelRatio,
        this.renderedProjection = null,
        this.renderedRevision,
        this.renderedTiles = [],
        this.newTiles_ = !1,
        this.tmpExtent = Yt(),
        this.tmpTileRange_ = new wl(0,0,0,0)
    }
    isDrawableTile(t) {
        const e = this.getLayer()
          , i = t.getState()
          , n = e.getUseInterimTilesOnError();
        return i == k.LOADED || i == k.EMPTY || i == k.ERROR && !n
    }
    getTile(t, e, i, n) {
        const r = n.pixelRatio
          , o = n.viewState.projection
          , a = this.getLayer();
        let h = a.getSource().getTile(t, e, i, r, o);
        return h.getState() == k.ERROR && a.getUseInterimTilesOnError() && a.getPreload() > 0 && (this.newTiles_ = !0),
        this.isDrawableTile(h) || (h = h.getInterimTile()),
        h
    }
    getData(t) {
        const e = this.frameState;
        if (!e)
            return null;
        const i = this.getLayer()
          , n = ht(e.pixelToCoordinateTransform, t.slice())
          , r = i.getExtent();
        if (r && !he(r, n))
            return null;
        const o = e.pixelRatio
          , a = e.viewState.projection
          , l = e.viewState
          , h = i.getRenderSource()
          , c = h.getTileGridForProjection(l.projection)
          , u = h.getTilePixelRatio(e.pixelRatio);
        for (let d = c.getZForResolution(l.resolution); d >= c.getMinZoom(); --d) {
            const f = c.getTileCoordForCoordAndZ(n, d)
              , g = h.getTile(d, f[1], f[2], o, a);
            if (!(g instanceof pl || g instanceof Js) || g instanceof Js && g.getState() === k.EMPTY)
                return null;
            if (g.getState() !== k.LOADED)
                continue;
            const _ = c.getOrigin(d)
              , m = Ft(c.getTileSize(d))
              , p = c.getResolution(d)
              , y = Math.floor(u * ((n[0] - _[0]) / p - f[1] * m[0]))
              , x = Math.floor(u * ((_[1] - n[1]) / p - f[2] * m[1]))
              , E = Math.round(u * h.getGutterForProjection(l.projection));
            return this.getImageData(g.getImage(), y + E, x + E)
        }
        return null
    }
    loadedTileCallback(t, e, i) {
        return this.isDrawableTile(i) ? super.loadedTileCallback(t, e, i) : !1
    }
    prepareFrame(t) {
        return !!this.getLayer().getSource()
    }
    renderFrame(t, e) {
        const i = t.layerStatesArray[t.layerIndex]
          , n = t.viewState
          , r = n.projection
          , o = n.resolution
          , a = n.center
          , l = n.rotation
          , h = t.pixelRatio
          , c = this.getLayer()
          , u = c.getSource()
          , d = u.getRevision()
          , f = u.getTileGridForProjection(r)
          , g = f.getZForResolution(o, u.zDirection)
          , _ = f.getResolution(g);
        let m = t.extent;
        const p = t.viewState.resolution
          , y = u.getTilePixelRatio(h)
          , x = Math.round($(m) / p * h)
          , E = Math.round(qt(m) / p * h)
          , w = i.extent && Ge(i.extent);
        w && (m = di(m, Ge(i.extent)));
        const R = _ * x / 2 / y
          , T = _ * E / 2 / y
          , L = [a[0] - R, a[1] - T, a[0] + R, a[1] + T]
          , v = f.getTileRangeForExtentAndZ(m, g)
          , b = {};
        b[g] = {};
        const D = this.createLoadedTileFinder(u, r, b)
          , O = this.tmpExtent
          , F = this.tmpTileRange_;
        this.newTiles_ = !1;
        const K = l ? Ys(n.center, p, l, t.size) : void 0;
        for (let pt = v.minX; pt <= v.maxX; ++pt)
            for (let B = v.minY; B <= v.maxY; ++B) {
                if (l && !f.tileCoordIntersectsViewport([g, pt, B], K))
                    continue;
                const V = this.getTile(g, pt, B, t);
                if (this.isDrawableTile(V)) {
                    const ct = U(this);
                    if (V.getState() == k.LOADED) {
                        b[g][V.tileCoord.toString()] = V;
                        let Qt = V.inTransition(ct);
                        Qt && i.opacity !== 1 && (V.endTransition(ct),
                        Qt = !1),
                        !this.newTiles_ && (Qt || !this.renderedTiles.includes(V)) && (this.newTiles_ = !0)
                    }
                    if (V.getAlpha(ct, t.time) === 1)
                        continue
                }
                const bt = f.getTileCoordChildTileRange(V.tileCoord, F, O);
                let ut = !1;
                bt && (ut = D(g + 1, bt)),
                ut || f.forEachTileCoordParentTileRange(V.tileCoord, D, F, O)
            }
        const S = _ / o * h / y;
        be(this.pixelTransform, t.size[0] / 2, t.size[1] / 2, 1 / h, 1 / h, l, -x / 2, -E / 2);
        const M = wa(this.pixelTransform);
        this.useContainer(e, M, this.getBackground(t));
        const I = this.context
          , P = I.canvas;
        hr(this.inversePixelTransform, this.pixelTransform),
        be(this.tempTransform, x / 2, E / 2, S, S, 0, -x / 2, -E / 2),
        P.width != x || P.height != E ? (P.width = x,
        P.height = E) : this.containerReused || I.clearRect(0, 0, x, E),
        w && this.clipUnrotated(I, t, w),
        u.getInterpolate() || (I.imageSmoothingEnabled = !1),
        this.preRender(I, t),
        this.renderedTiles.length = 0;
        let X = Object.keys(b).map(Number);
        X.sort(Ze);
        let z, q, C;
        i.opacity === 1 && (!this.containerReused || u.getOpaque(t.viewState.projection)) ? X = X.reverse() : (z = [],
        q = []);
        for (let pt = X.length - 1; pt >= 0; --pt) {
            const B = X[pt]
              , V = u.getTilePixelSize(B, h, r)
              , ut = f.getResolution(B) / _
              , ct = V[0] * ut * S
              , Qt = V[1] * ut * S
              , Ue = f.getTileCoordForCoordAndZ(Ve(L), B)
              , on = f.getTileCoordExtent(Ue)
              , Ke = ht(this.tempTransform, [y * (on[0] - L[0]) / _, y * (L[3] - on[3]) / _])
              , an = y * u.getGutterForProjection(r)
              , me = b[B];
            for (const Ti in me) {
                const pe = me[Ti]
                  , ln = pe.tileCoord
                  , hn = Ue[1] - ln[1]
                  , cn = Math.round(Ke[0] - (hn - 1) * ct)
                  , je = Ue[2] - ln[2]
                  , fs = Math.round(Ke[1] - (je - 1) * Qt)
                  , St = Math.round(Ke[0] - hn * ct)
                  , Pt = Math.round(Ke[1] - je * Qt)
                  , Dt = cn - St
                  , te = fs - Pt
                  , He = g === B
                  , ke = He && pe.getAlpha(U(this), t.time) !== 1;
                let ye = !1;
                if (!ke)
                    if (z) {
                        C = [St, Pt, St + Dt, Pt, St + Dt, Pt + te, St, Pt + te];
                        for (let $e = 0, un = z.length; $e < un; ++$e)
                            if (g !== B && B < q[$e]) {
                                const yt = z[$e];
                                mt([St, Pt, St + Dt, Pt + te], [yt[0], yt[3], yt[4], yt[7]]) && (ye || (I.save(),
                                ye = !0),
                                I.beginPath(),
                                I.moveTo(C[0], C[1]),
                                I.lineTo(C[2], C[3]),
                                I.lineTo(C[4], C[5]),
                                I.lineTo(C[6], C[7]),
                                I.moveTo(yt[6], yt[7]),
                                I.lineTo(yt[4], yt[5]),
                                I.lineTo(yt[2], yt[3]),
                                I.lineTo(yt[0], yt[1]),
                                I.clip())
                            }
                        z.push(C),
                        q.push(B)
                    } else
                        I.clearRect(St, Pt, Dt, te);
                this.drawTileImage(pe, t, St, Pt, Dt, te, an, He),
                z && !ke ? (ye && I.restore(),
                this.renderedTiles.unshift(pe)) : this.renderedTiles.push(pe),
                this.updateUsedTiles(t.usedTiles, u, pe)
            }
        }
        return this.renderedRevision = d,
        this.renderedResolution = _,
        this.extentChanged = !this.renderedExtent_ || !yi(this.renderedExtent_, L),
        this.renderedExtent_ = L,
        this.renderedPixelRatio = h,
        this.renderedProjection = r,
        this.manageTilePyramid(t, u, f, h, r, m, g, c.getPreload()),
        this.scheduleExpireCache(t, u),
        this.postRender(I, t),
        i.extent && I.restore(),
        I.imageSmoothingEnabled = !0,
        M !== P.style.transform && (P.style.transform = M),
        this.container
    }
    drawTileImage(t, e, i, n, r, o, a, l) {
        const h = this.getTileImage(t);
        if (!h)
            return;
        const c = U(this)
          , u = e.layerStatesArray[e.layerIndex]
          , d = u.opacity * (l ? t.getAlpha(c, e.time) : 1)
          , f = d !== this.context.globalAlpha;
        f && (this.context.save(),
        this.context.globalAlpha = d),
        this.context.drawImage(h, a, a, h.width - 2 * a, h.height - 2 * a, i, n, r, o),
        f && this.context.restore(),
        d !== u.opacity ? e.animate = !0 : l && t.endTransition(c)
    }
    getImage() {
        const t = this.context;
        return t ? t.canvas : null
    }
    getTileImage(t) {
        return t.getImage()
    }
    scheduleExpireCache(t, e) {
        if (e.canExpireCache()) {
            const i = (function(n, r, o) {
                const a = U(n);
                a in o.usedTiles && n.expireCache(o.viewState.projection, o.usedTiles[a])
            }
            ).bind(null, e);
            t.postRenderFunctions.push(i)
        }
    }
    updateUsedTiles(t, e, i) {
        const n = U(e);
        n in t || (t[n] = {}),
        t[n][i.getKey()] = !0
    }
    manageTilePyramid(t, e, i, n, r, o, a, l, h) {
        const c = U(e);
        c in t.wantedTiles || (t.wantedTiles[c] = {});
        const u = t.wantedTiles[c]
          , d = t.tileQueue
          , f = i.getMinZoom()
          , g = t.viewState.rotation
          , _ = g ? Ys(t.viewState.center, t.viewState.resolution, g, t.size) : void 0;
        let m = 0, p, y, x, E, w, R;
        for (R = f; R <= a; ++R)
            for (y = i.getTileRangeForExtentAndZ(o, R, y),
            x = i.getResolution(R),
            E = y.minX; E <= y.maxX; ++E)
                for (w = y.minY; w <= y.maxY; ++w)
                    g && !i.tileCoordIntersectsViewport([R, E, w], _) || (a - R <= l ? (++m,
                    p = e.getTile(R, E, w, n, r),
                    p.getState() == k.IDLE && (u[p.getKey()] = !0,
                    d.isKeyQueued(p.getKey()) || d.enqueue([p, c, i.getTileCoordCenter(p.tileCoord), x])),
                    h !== void 0 && h(p)) : e.useTile(R, E, w, r));
        e.updateCacheSize(m, r)
    }
}
const Xf = Wf;
class Yf extends zf {
    constructor(t) {
        super(t)
    }
    createRenderer() {
        return new Xf(this)
    }
}
const Rn = Yf;
function Bf(s) {
    if (!(s.context instanceof CanvasRenderingContext2D))
        throw new Error("Only works for render events from Canvas 2D layers");
    const t = s.inversePixelTransform[0]
      , e = s.inversePixelTransform[1]
      , i = Math.sqrt(t * t + e * e)
      , n = s.frameState
      , r = uh(s.inversePixelTransform.slice(), n.coordinateToPixelTransform)
      , o = vl(n.viewState.resolution, i);
    let a;
    return new Ll(s.context,i,n.extent,r,n.viewState.rotation,o,a)
}
function Pl(s, t, e) {
    const i = [];
    let n = s(0)
      , r = s(1)
      , o = t(n)
      , a = t(r);
    const l = [r, n]
      , h = [a, o]
      , c = [1, 0]
      , u = {};
    let d = 1e5, f, g, _, m, p, y;
    for (; --d > 0 && c.length > 0; )
        _ = c.pop(),
        n = l.pop(),
        o = h.pop(),
        y = _.toString(),
        y in u || (i.push(o[0], o[1]),
        u[y] = !0),
        m = c.pop(),
        r = l.pop(),
        a = h.pop(),
        p = (_ + m) / 2,
        f = s(p),
        g = t(f),
        Ia(g[0], g[1], o[0], o[1], a[0], a[1]) < e ? (i.push(a[0], a[1]),
        y = m.toString(),
        u[y] = !0) : (c.push(m, p, p, _),
        h.push(a, g, g, o),
        l.push(r, f, f, n));
    return i
}
function Zf(s, t, e, i, n) {
    const r = Et("EPSG:4326");
    return Pl(function(o) {
        return [s, t + (e - t) * o]
    }, Jt(r, i), n)
}
function Vf(s, t, e, i, n) {
    const r = Et("EPSG:4326");
    return Pl(function(o) {
        return [t + (e - t) * o, s]
    }, Jt(r, i), n)
}
const Uf = new It({
    color: "rgba(0,0,0,0.2)"
})
  , Kf = [90, 45, 30, 20, 10, 5, 2, 1, 30 / 60, 20 / 60, 10 / 60, 5 / 60, 2 / 60, 1 / 60, 30 / 3600, 20 / 3600, 10 / 3600, 5 / 3600, 2 / 3600, 1 / 3600];
class jf extends Tt {
    constructor(t) {
        t = t || {};
        const e = Object.assign({
            updateWhileAnimating: !0,
            updateWhileInteracting: !0,
            renderBuffer: 0
        }, t);
        delete e.maxLines,
        delete e.strokeStyle,
        delete e.targetSize,
        delete e.showLabels,
        delete e.lonLabelFormatter,
        delete e.latLabelFormatter,
        delete e.lonLabelPosition,
        delete e.latLabelPosition,
        delete e.lonLabelStyle,
        delete e.latLabelStyle,
        delete e.intervals,
        super(e),
        this.projection_ = null,
        this.maxLat_ = 1 / 0,
        this.maxLon_ = 1 / 0,
        this.minLat_ = -1 / 0,
        this.minLon_ = -1 / 0,
        this.maxX_ = 1 / 0,
        this.maxY_ = 1 / 0,
        this.minX_ = -1 / 0,
        this.minY_ = -1 / 0,
        this.targetSize_ = t.targetSize !== void 0 ? t.targetSize : 100,
        this.maxLines_ = t.maxLines !== void 0 ? t.maxLines : 100,
        this.meridians_ = [],
        this.parallels_ = [],
        this.strokeStyle_ = t.strokeStyle !== void 0 ? t.strokeStyle : Uf,
        this.fromLonLatTransform_ = void 0,
        this.toLonLatTransform_ = void 0,
        this.projectionCenterLonLat_ = null,
        this.bottomLeft_ = null,
        this.bottomRight_ = null,
        this.topLeft_ = null,
        this.topRight_ = null,
        this.meridiansLabels_ = null,
        this.parallelsLabels_ = null,
        t.showLabels && (this.lonLabelFormatter_ = t.lonLabelFormatter == null ? oo.bind(this, "EW") : t.lonLabelFormatter,
        this.latLabelFormatter_ = t.latLabelFormatter == null ? oo.bind(this, "NS") : t.latLabelFormatter,
        this.lonLabelPosition_ = t.lonLabelPosition == null ? 0 : t.lonLabelPosition,
        this.latLabelPosition_ = t.latLabelPosition == null ? 1 : t.latLabelPosition,
        this.lonLabelStyleBase_ = new H({
            text: t.lonLabelStyle !== void 0 ? t.lonLabelStyle.clone() : new _t({
                font: "12px Calibri,sans-serif",
                textBaseline: "bottom",
                fill: new at({
                    color: "rgba(0,0,0,1)"
                }),
                stroke: new It({
                    color: "rgba(255,255,255,1)",
                    width: 3
                })
            })
        }),
        this.lonLabelStyle_ = i=>{
            const n = i.get("graticule_label");
            return this.lonLabelStyleBase_.getText().setText(n),
            this.lonLabelStyleBase_
        }
        ,
        this.latLabelStyleBase_ = new H({
            text: t.latLabelStyle !== void 0 ? t.latLabelStyle.clone() : new _t({
                font: "12px Calibri,sans-serif",
                textAlign: "right",
                fill: new at({
                    color: "rgba(0,0,0,1)"
                }),
                stroke: new It({
                    color: "rgba(255,255,255,1)",
                    width: 3
                })
            })
        }),
        this.latLabelStyle_ = i=>{
            const n = i.get("graticule_label");
            return this.latLabelStyleBase_.getText().setText(n),
            this.latLabelStyleBase_
        }
        ,
        this.meridiansLabels_ = [],
        this.parallelsLabels_ = [],
        this.addEventListener(de.POSTRENDER, this.drawLabels_.bind(this))),
        this.intervals_ = t.intervals !== void 0 ? t.intervals : Kf,
        this.setSource(new xt({
            loader: this.loaderFunction.bind(this),
            strategy: this.strategyFunction.bind(this),
            features: new Xt,
            overlaps: !1,
            useSpatialIndex: !1,
            wrapX: t.wrapX
        })),
        this.featurePool_ = [],
        this.lineStyle_ = new H({
            stroke: this.strokeStyle_
        }),
        this.loadedExtent_ = null,
        this.renderedExtent_ = null,
        this.renderedResolution_ = null,
        this.setRenderOrder(null)
    }
    strategyFunction(t, e) {
        let i = t.slice();
        return this.projection_ && this.getSource().getWrapX() && ur(i, this.projection_),
        this.loadedExtent_ && (xh(this.loadedExtent_, i, e) ? i = this.loadedExtent_.slice() : this.getSource().removeLoadedExtent(this.loadedExtent_)),
        [i]
    }
    loaderFunction(t, e, i) {
        this.loadedExtent_ = t;
        const n = this.getSource()
          , r = this.getExtent() || [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
          , o = di(r, t);
        if (this.renderedExtent_ && yi(this.renderedExtent_, o) && this.renderedResolution_ === e || (this.renderedExtent_ = o,
        this.renderedResolution_ = e,
        Ji(o)))
            return;
        const a = ue(o)
          , l = e * e / 4;
        (!this.projection_ || !De(this.projection_, i)) && this.updateProjectionInfo_(i),
        this.createGraticule_(o, a, e, l);
        let c = this.meridians_.length + this.parallels_.length;
        this.meridiansLabels_ && (c += this.meridians_.length),
        this.parallelsLabels_ && (c += this.parallels_.length);
        let u;
        for (; c > this.featurePool_.length; )
            u = new it,
            this.featurePool_.push(u);
        const d = n.getFeaturesCollection();
        d.clear();
        let f = 0, g, _;
        for (g = 0,
        _ = this.meridians_.length; g < _; ++g)
            u = this.featurePool_[f++],
            u.setGeometry(this.meridians_[g]),
            u.setStyle(this.lineStyle_),
            d.push(u);
        for (g = 0,
        _ = this.parallels_.length; g < _; ++g)
            u = this.featurePool_[f++],
            u.setGeometry(this.parallels_[g]),
            u.setStyle(this.lineStyle_),
            d.push(u)
    }
    addMeridian_(t, e, i, n, r, o) {
        const a = this.getMeridian_(t, e, i, n, o);
        if (mt(a.getExtent(), r)) {
            if (this.meridiansLabels_) {
                const l = this.lonLabelFormatter_(t);
                o in this.meridiansLabels_ ? this.meridiansLabels_[o].text = l : this.meridiansLabels_[o] = {
                    geom: new Wt([]),
                    text: l
                }
            }
            this.meridians_[o++] = a
        }
        return o
    }
    addParallel_(t, e, i, n, r, o) {
        const a = this.getParallel_(t, e, i, n, o);
        if (mt(a.getExtent(), r)) {
            if (this.parallelsLabels_) {
                const l = this.latLabelFormatter_(t);
                o in this.parallelsLabels_ ? this.parallelsLabels_[o].text = l : this.parallelsLabels_[o] = {
                    geom: new Wt([]),
                    text: l
                }
            }
            this.parallels_[o++] = a
        }
        return o
    }
    drawLabels_(t) {
        const e = t.frameState.viewState.rotation
          , i = t.frameState.viewState.resolution
          , n = t.frameState.size
          , r = t.frameState.extent
          , o = ue(r);
        let a = r;
        if (e) {
            const g = n[0] * i
              , _ = n[1] * i;
            a = [o[0] - g / 2, o[1] - _ / 2, o[0] + g / 2, o[1] + _ / 2]
        }
        let l = 0
          , h = 0
          , c = this.latLabelPosition_ < .5;
        const u = this.projection_.getExtent()
          , d = $(u);
        if (this.getSource().getWrapX() && this.projection_.canWrapX() && !ce(u, r)) {
            l = Math.floor((r[0] - u[0]) / d),
            h = Math.ceil((r[2] - u[2]) / d);
            const g = Math.abs(e) > Math.PI / 2;
            c = c !== g
        }
        const f = Bf(t);
        for (let g = l; g <= h; ++g) {
            let _ = this.meridians_.length + this.parallels_.length, m, p, y, x;
            if (this.meridiansLabels_)
                for (p = 0,
                y = this.meridiansLabels_.length; p < y; ++p) {
                    const E = this.meridians_[p];
                    if (!e && g === 0)
                        x = this.getMeridianPoint_(E, r, p);
                    else {
                        const w = E.clone();
                        w.translate(g * d, 0),
                        w.rotate(-e, o),
                        x = this.getMeridianPoint_(w, a, p),
                        x.rotate(e, o)
                    }
                    m = this.featurePool_[_++],
                    m.setGeometry(x),
                    m.set("graticule_label", this.meridiansLabels_[p].text),
                    f.drawFeature(m, this.lonLabelStyle_(m))
                }
            if (this.parallelsLabels_ && (g === l && c || g === h && !c))
                for (p = 0,
                y = this.parallels_.length; p < y; ++p) {
                    const E = this.parallels_[p];
                    if (!e && g === 0)
                        x = this.getParallelPoint_(E, r, p);
                    else {
                        const w = E.clone();
                        w.translate(g * d, 0),
                        w.rotate(-e, o),
                        x = this.getParallelPoint_(w, a, p),
                        x.rotate(e, o)
                    }
                    m = this.featurePool_[_++],
                    m.setGeometry(x),
                    m.set("graticule_label", this.parallelsLabels_[p].text),
                    f.drawFeature(m, this.latLabelStyle_(m))
                }
        }
    }
    createGraticule_(t, e, i, n) {
        const r = this.getInterval_(i);
        if (r == -1) {
            this.meridians_.length = 0,
            this.parallels_.length = 0,
            this.meridiansLabels_ && (this.meridiansLabels_.length = 0),
            this.parallelsLabels_ && (this.parallelsLabels_.length = 0);
            return
        }
        let o = !1;
        const a = this.projection_.getExtent()
          , l = $(a);
        this.getSource().getWrapX() && this.projection_.canWrapX() && !ce(a, t) && ($(t) >= l ? (t[0] = a[0],
        t[2] = a[2]) : o = !0);
        const h = [N(e[0], this.minX_, this.maxX_), N(e[1], this.minY_, this.maxY_)]
          , c = this.toLonLatTransform_(h);
        isNaN(c[1]) && (c[1] = Math.abs(this.maxLat_) >= Math.abs(this.minLat_) ? this.maxLat_ : this.minLat_);
        let u = N(c[0], this.minLon_, this.maxLon_)
          , d = N(c[1], this.minLat_, this.maxLat_);
        const f = this.maxLines_;
        let g, _, m, p, y = t;
        o || (y = [N(t[0], this.minX_, this.maxX_), N(t[1], this.minY_, this.maxY_), N(t[2], this.minX_, this.maxX_), N(t[3], this.minY_, this.maxY_)]);
        const x = Bs(y, this.toLonLatTransform_, void 0, 8);
        let E = x[3]
          , w = x[2]
          , R = x[1]
          , T = x[0];
        if (o || (he(y, this.bottomLeft_) && (T = this.minLon_,
        R = this.minLat_),
        he(y, this.bottomRight_) && (w = this.maxLon_,
        R = this.minLat_),
        he(y, this.topLeft_) && (T = this.minLon_,
        E = this.maxLat_),
        he(y, this.topRight_) && (w = this.maxLon_,
        E = this.maxLat_),
        E = N(E, d, this.maxLat_),
        w = N(w, u, this.maxLon_),
        R = N(R, this.minLat_, d),
        T = N(T, this.minLon_, u)),
        u = Math.floor(u / r) * r,
        p = N(u, this.minLon_, this.maxLon_),
        _ = this.addMeridian_(p, R, E, n, t, 0),
        g = 0,
        o)
            for (; (p -= r) >= T && g++ < f; )
                _ = this.addMeridian_(p, R, E, n, t, _);
        else
            for (; p != this.minLon_ && g++ < f; )
                p = Math.max(p - r, this.minLon_),
                _ = this.addMeridian_(p, R, E, n, t, _);
        if (p = N(u, this.minLon_, this.maxLon_),
        g = 0,
        o)
            for (; (p += r) <= w && g++ < f; )
                _ = this.addMeridian_(p, R, E, n, t, _);
        else
            for (; p != this.maxLon_ && g++ < f; )
                p = Math.min(p + r, this.maxLon_),
                _ = this.addMeridian_(p, R, E, n, t, _);
        for (this.meridians_.length = _,
        this.meridiansLabels_ && (this.meridiansLabels_.length = _),
        d = Math.floor(d / r) * r,
        m = N(d, this.minLat_, this.maxLat_),
        _ = this.addParallel_(m, T, w, n, t, 0),
        g = 0; m != this.minLat_ && g++ < f; )
            m = Math.max(m - r, this.minLat_),
            _ = this.addParallel_(m, T, w, n, t, _);
        for (m = N(d, this.minLat_, this.maxLat_),
        g = 0; m != this.maxLat_ && g++ < f; )
            m = Math.min(m + r, this.maxLat_),
            _ = this.addParallel_(m, T, w, n, t, _);
        this.parallels_.length = _,
        this.parallelsLabels_ && (this.parallelsLabels_.length = _)
    }
    getInterval_(t) {
        const e = this.projectionCenterLonLat_[0]
          , i = this.projectionCenterLonLat_[1];
        let n = -1;
        const r = Math.pow(this.targetSize_ * t, 2)
          , o = []
          , a = [];
        for (let l = 0, h = this.intervals_.length; l < h; ++l) {
            const c = N(this.intervals_[l] / 2, 0, 90)
              , u = N(i, -90 + c, 90 - c);
            if (o[0] = e - c,
            o[1] = u - c,
            a[0] = e + c,
            a[1] = u + c,
            this.fromLonLatTransform_(o, o),
            this.fromLonLatTransform_(a, a),
            Math.pow(a[0] - o[0], 2) + Math.pow(a[1] - o[1], 2) <= r)
                break;
            n = this.intervals_[l]
        }
        return n
    }
    getMeridian_(t, e, i, n, r) {
        const o = Zf(t, e, i, this.projection_, n);
        let a = this.meridians_[r];
        return a ? (a.setFlatCoordinates("XY", o),
        a.changed()) : (a = new Zt(o,"XY"),
        this.meridians_[r] = a),
        a
    }
    getMeridianPoint_(t, e, i) {
        const n = t.getFlatCoordinates();
        let r = 1
          , o = n.length - 1;
        n[r] > n[o] && (r = o,
        o = 1);
        const a = Math.max(e[1], n[r])
          , l = Math.min(e[3], n[o])
          , h = N(e[1] + Math.abs(e[1] - e[3]) * this.lonLabelPosition_, a, l)
          , u = [n[r - 1] + (n[o - 1] - n[r - 1]) * (h - n[r]) / (n[o] - n[r]), h]
          , d = this.meridiansLabels_[i].geom;
        return d.setCoordinates(u),
        d
    }
    getMeridians() {
        return this.meridians_
    }
    getParallel_(t, e, i, n, r) {
        const o = Vf(t, e, i, this.projection_, n);
        let a = this.parallels_[r];
        return a ? (a.setFlatCoordinates("XY", o),
        a.changed()) : a = new Zt(o,"XY"),
        a
    }
    getParallelPoint_(t, e, i) {
        const n = t.getFlatCoordinates();
        let r = 0
          , o = n.length - 2;
        n[r] > n[o] && (r = o,
        o = 0);
        const a = Math.max(e[0], n[r])
          , l = Math.min(e[2], n[o])
          , h = N(e[0] + Math.abs(e[0] - e[2]) * this.latLabelPosition_, a, l)
          , c = n[r + 1] + (n[o + 1] - n[r + 1]) * (h - n[r]) / (n[o] - n[r])
          , u = [h, c]
          , d = this.parallelsLabels_[i].geom;
        return d.setCoordinates(u),
        d
    }
    getParallels() {
        return this.parallels_
    }
    updateProjectionInfo_(t) {
        const e = Et("EPSG:4326")
          , i = t.getWorldExtent();
        this.maxLat_ = i[3],
        this.maxLon_ = i[2],
        this.minLat_ = i[1],
        this.minLon_ = i[0];
        const n = Jt(t, e);
        if (this.minLon_ < this.maxLon_)
            this.toLonLatTransform_ = n;
        else {
            const o = this.minLon_ + this.maxLon_ / 2;
            this.maxLon_ += 360,
            this.toLonLatTransform_ = function(a, l, h) {
                h = h || 2;
                const c = n(a, l, h);
                for (let u = 0, d = c.length; u < d; u += h)
                    c[u] < o && (c[u] += 360);
                return c
            }
        }
        this.fromLonLatTransform_ = Jt(e, t);
        const r = Bs([this.minLon_, this.minLat_, this.maxLon_, this.maxLat_], this.fromLonLatTransform_, void 0, 8);
        this.minX_ = r[0],
        this.maxX_ = r[2],
        this.minY_ = r[1],
        this.maxY_ = r[3],
        this.bottomLeft_ = this.fromLonLatTransform_([this.minLon_, this.minLat_]),
        this.bottomRight_ = this.fromLonLatTransform_([this.maxLon_, this.minLat_]),
        this.topLeft_ = this.fromLonLatTransform_([this.minLon_, this.maxLat_]),
        this.topRight_ = this.fromLonLatTransform_([this.maxLon_, this.maxLat_]),
        this.projectionCenterLonLat_ = this.toLonLatTransform_(ue(t.getExtent())),
        isNaN(this.projectionCenterLonLat_[1]) && (this.projectionCenterLonLat_[1] = Math.abs(this.maxLat_) >= Math.abs(this.minLat_) ? this.maxLat_ : this.minLat_),
        this.projection_ = t
    }
}
const Hf = jf
  , Ps = "units"
  , $f = [1, 2, 5]
  , Pi = 25.4 / .28;
class qf extends Si {
    constructor(t) {
        t = t || {};
        const e = document.createElement("div");
        e.style.pointerEvents = "none",
        super({
            element: e,
            render: t.render,
            target: t.target
        }),
        this.on,
        this.once,
        this.un;
        const i = t.className !== void 0 ? t.className : t.bar ? "ol-scale-bar" : "ol-scale-line";
        this.innerElement_ = document.createElement("div"),
        this.innerElement_.className = i + "-inner",
        this.element.className = i + " " + en,
        this.element.appendChild(this.innerElement_),
        this.viewState_ = null,
        this.minWidth_ = t.minWidth !== void 0 ? t.minWidth : 64,
        this.maxWidth_ = t.maxWidth,
        this.renderedVisible_ = !1,
        this.renderedWidth_ = void 0,
        this.renderedHTML_ = "",
        this.addChangeListener(Ps, this.handleUnitsChanged_),
        this.setUnits(t.units || "metric"),
        this.scaleBar_ = t.bar || !1,
        this.scaleBarSteps_ = t.steps || 4,
        this.scaleBarText_ = t.text || !1,
        this.dpi_ = t.dpi || void 0
    }
    getUnits() {
        return this.get(Ps)
    }
    handleUnitsChanged_() {
        this.updateElement_()
    }
    setUnits(t) {
        this.set(Ps, t)
    }
    setDpi(t) {
        this.dpi_ = t
    }
    updateElement_() {
        const t = this.viewState_;
        if (!t) {
            this.renderedVisible_ && (this.element.style.display = "none",
            this.renderedVisible_ = !1);
            return
        }
        const e = t.center
          , i = t.projection
          , n = this.getUnits()
          , r = n == "degrees" ? "degrees" : "m";
        let o = Yn(i, t.resolution, e, r);
        const a = this.minWidth_ * (this.dpi_ || Pi) / Pi
          , l = this.maxWidth_ !== void 0 ? this.maxWidth_ * (this.dpi_ || Pi) / Pi : void 0;
        let h = a * o
          , c = "";
        if (n == "degrees") {
            const x = xi.degrees;
            h *= x,
            h < x / 60 ? (c = "″",
            o *= 3600) : h < x ? (c = "′",
            o *= 60) : c = "°"
        } else
            n == "imperial" ? h < .9144 ? (c = "in",
            o /= .0254) : h < 1609.344 ? (c = "ft",
            o /= .3048) : (c = "mi",
            o /= 1609.344) : n == "nautical" ? (o /= 1852,
            c = "NM") : n == "metric" ? h < .001 ? (c = "μm",
            o *= 1e6) : h < 1 ? (c = "mm",
            o *= 1e3) : h < 1e3 ? c = "m" : (c = "km",
            o /= 1e3) : n == "us" ? h < .9144 ? (c = "in",
            o *= 39.37) : h < 1609.344 ? (c = "ft",
            o /= .30480061) : (c = "mi",
            o /= 1609.3472) : W(!1, 33);
        let u = 3 * Math.floor(Math.log(a * o) / Math.log(10)), d, f, g, _, m, p;
        for (; ; ) {
            g = Math.floor(u / 3);
            const x = Math.pow(10, g);
            if (d = $f[(u % 3 + 3) % 3] * x,
            f = Math.round(d / o),
            isNaN(f)) {
                this.element.style.display = "none",
                this.renderedVisible_ = !1;
                return
            }
            if (l !== void 0 && f >= l) {
                d = _,
                f = m,
                g = p;
                break
            } else if (f >= a)
                break;
            _ = d,
            m = f,
            p = g,
            ++u
        }
        const y = this.scaleBar_ ? this.createScaleBar(f, d, c) : d.toFixed(g < 0 ? -g : 0) + " " + c;
        this.renderedHTML_ != y && (this.innerElement_.innerHTML = y,
        this.renderedHTML_ = y),
        this.renderedWidth_ != f && (this.innerElement_.style.width = f + "px",
        this.renderedWidth_ = f),
        this.renderedVisible_ || (this.element.style.display = "",
        this.renderedVisible_ = !0)
    }
    createScaleBar(t, e, i) {
        const n = this.getScaleForResolution()
          , r = n < 1 ? Math.round(1 / n).toLocaleString() + " : 1" : "1 : " + Math.round(n).toLocaleString()
          , o = this.scaleBarSteps_
          , a = t / o
          , l = [this.createMarker("absolute")];
        for (let c = 0; c < o; ++c) {
            const u = c % 2 === 0 ? "ol-scale-singlebar-odd" : "ol-scale-singlebar-even";
            l.push(`<div><div class="ol-scale-singlebar ${u}" style="width: ${a}px;"></div>` + this.createMarker("relative") + (c % 2 === 0 || o === 2 ? this.createStepText(c, t, !1, e, i) : "") + "</div>")
        }
        return l.push(this.createStepText(o, t, !0, e, i)),
        (this.scaleBarText_ ? `<div class="ol-scale-text" style="width: ${t}px;">` + r + "</div>" : "") + l.join("")
    }
    createMarker(t) {
        return `<div class="ol-scale-step-marker" style="position: ${t}; top: ${t === "absolute" ? 3 : -10}px;"></div>`
    }
    createStepText(t, e, i, n, r) {
        const a = (t === 0 ? 0 : Math.round(n / this.scaleBarSteps_ * t * 100) / 100) + (t === 0 ? "" : " " + r)
          , l = t === 0 ? -3 : e / this.scaleBarSteps_ * -1
          , h = t === 0 ? 0 : e / this.scaleBarSteps_ * 2;
        return `<div class="ol-scale-step-text" style="margin-left: ${l}px;text-align: ${t === 0 ? "left" : "center"};min-width: ${h}px;left: ${i ? e + "px" : "unset"};">` + a + "</div>"
    }
    getScaleForResolution() {
        const t = Yn(this.viewState_.projection, this.viewState_.resolution, this.viewState_.center, "m")
          , e = this.dpi_ || Pi
          , i = 1e3 / 25.4;
        return t * i * e
    }
    render(t) {
        const e = t.frameState;
        e ? this.viewState_ = e.viewState : this.viewState_ = null,
        this.updateElement_()
    }
}
const Jf = qf
  , ks = "projection"
  , Ko = "coordinateFormat";
class Qf extends Si {
    constructor(t) {
        t = t || {};
        const e = document.createElement("div");
        e.className = t.className !== void 0 ? t.className : "ol-mouse-position",
        super({
            element: e,
            render: t.render,
            target: t.target
        }),
        this.on,
        this.once,
        this.un,
        this.addChangeListener(ks, this.handleProjectionChanged_),
        t.coordinateFormat && this.setCoordinateFormat(t.coordinateFormat),
        t.projection && this.setProjection(t.projection),
        this.renderOnMouseOut_ = t.placeholder !== void 0,
        this.placeholder_ = this.renderOnMouseOut_ ? t.placeholder : "&#160;",
        this.renderedHTML_ = e.innerHTML,
        this.mapProjection_ = null,
        this.transform_ = null,
        this.wrapX_ = t.wrapX !== !1
    }
    handleProjectionChanged_() {
        this.transform_ = null
    }
    getCoordinateFormat() {
        return this.get(Ko)
    }
    getProjection() {
        return this.get(ks)
    }
    handleMouseMove(t) {
        const e = this.getMap();
        this.updateHTML_(e.getEventPixel(t))
    }
    handleMouseOut(t) {
        this.updateHTML_(null)
    }
    setMap(t) {
        if (super.setMap(t),
        t) {
            const e = t.getViewport();
            this.listenerKeys.push(Y(e, Ui.POINTERMOVE, this.handleMouseMove, this)),
            this.renderOnMouseOut_ && this.listenerKeys.push(Y(e, Ui.POINTEROUT, this.handleMouseOut, this)),
            this.updateHTML_(null)
        }
    }
    setCoordinateFormat(t) {
        this.set(Ko, t)
    }
    setProjection(t) {
        this.set(ks, Et(t))
    }
    updateHTML_(t) {
        let e = this.placeholder_;
        if (t && this.mapProjection_) {
            if (!this.transform_) {
                const r = this.getProjection();
                r ? this.transform_ = os(this.mapProjection_, r) : this.transform_ = mr
            }
            const n = this.getMap().getCoordinateFromPixelInternal(t);
            if (n) {
                if (this.transform_(n, n),
                this.wrapX_) {
                    const o = this.getProjection() || this.mapProjection_;
                    gr(n, o)
                }
                const r = this.getCoordinateFormat();
                r ? e = r(n) : e = n.toString()
            }
        }
        (!this.renderedHTML_ || e !== this.renderedHTML_) && (this.element.innerHTML = e,
        this.renderedHTML_ = e)
    }
    render(t) {
        const e = t.frameState;
        e ? this.mapProjection_ != e.viewState.projection && (this.mapProjection_ = e.viewState.projection,
        this.transform_ = null) : this.mapProjection_ = null
    }
}
const tg = Qf;
var jo = Math.PI / 180
  , Ho = 180 / Math.PI
  , $o = function(s, t) {
    this.lon = s,
    this.lat = t,
    this.x = jo * s,
    this.y = jo * t
}
  , kl = function() {
    this.coords = [],
    this.length = 0
};
kl.prototype.move_to = function(s) {
    this.length++,
    this.coords.push(s)
}
;
var eg = function(s) {
    this.properties = s || {},
    this.geometries = []
}
  , Yr = function(s, t, e) {
    if (!s || s.x === void 0 || s.y === void 0)
        throw new Error("GrCi err1");
    if (!t || t.x === void 0 || t.y === void 0)
        throw new Error("GrCi err2");
    this.start = new $o(s.x,s.y),
    this.end = new $o(t.x,t.y),
    this.properties = e || {};
    var i = this.start.x - this.end.x
      , n = this.start.y - this.end.y
      , r = Math.pow(Math.sin(n / 2), 2) + Math.cos(this.start.y) * Math.cos(this.end.y) * Math.pow(Math.sin(i / 2), 2);
    if (this.g = 2 * Math.asin(Math.sqrt(r)),
    this.g == Math.PI)
        throw new Error("GrCi err3");
    if (isNaN(this.g))
        throw new Error("GrCi err4")
};
Yr.prototype.interpolate = function(s) {
    var t = Math.sin((1 - s) * this.g) / Math.sin(this.g)
      , e = Math.sin(s * this.g) / Math.sin(this.g)
      , i = t * Math.cos(this.start.y) * Math.cos(this.start.x) + e * Math.cos(this.end.y) * Math.cos(this.end.x)
      , n = t * Math.cos(this.start.y) * Math.sin(this.start.x) + e * Math.cos(this.end.y) * Math.sin(this.end.x)
      , r = t * Math.sin(this.start.y) + e * Math.sin(this.end.y)
      , o = Ho * Math.atan2(r, Math.sqrt(Math.pow(i, 2) + Math.pow(n, 2)))
      , a = Ho * Math.atan2(n, i);
    return [a, o]
}
;
Yr.prototype.Arc = function(s, t) {
    var e = [];
    if (!s || s <= 2)
        e.push([this.start.lon, this.start.lat]),
        e.push([this.end.lon, this.end.lat]);
    else
        for (var i = 1 / (s - 1), n = 0; n < s; ++n) {
            var r = i * n
              , o = this.interpolate(r);
            e.push(o)
        }
    for (var a = !1, l = 0, h = t && t.offset ? t.offset : 10, c = 180 - h, u = -180 + h, d = 360 - h, f = 1; f < e.length; ++f) {
        var g = e[f - 1][0]
          , _ = e[f][0]
          , m = Math.abs(_ - g);
        m > d && (_ > c && g < u || g > c && _ < u) ? a = !0 : m > l && (l = m)
    }
    var p = [];
    if (a && l < h) {
        var y = [];
        p.push(y);
        for (var x = 0; x < e.length; ++x) {
            var E = parseFloat(e[x][0]);
            if (x > 0 && Math.abs(E - e[x - 1][0]) > d) {
                var w = parseFloat(e[x - 1][0])
                  , R = parseFloat(e[x - 1][1])
                  , T = parseFloat(e[x][0])
                  , L = parseFloat(e[x][1]);
                if (w > -180 && w < u && T == 180 && x + 1 < e.length && e[x - 1][0] > -180 && e[x - 1][0] < u) {
                    y.push([-180, e[x][1]]),
                    x++,
                    y.push([e[x][0], e[x][1]]);
                    continue
                } else if (w > c && w < 180 && T == -180 && x + 1 < e.length && e[x - 1][0] > c && e[x - 1][0] < 180) {
                    y.push([180, e[x][1]]),
                    x++,
                    y.push([e[x][0], e[x][1]]);
                    continue
                }
                if (w < u && T > c) {
                    var v = w;
                    w = T,
                    T = v;
                    var b = R;
                    R = L,
                    L = b
                }
                if (w > c && T < u && (T += 360),
                w <= 180 && T >= 180 && w < T) {
                    var D = (180 - w) / (T - w)
                      , O = D * L + (1 - D) * R;
                    y.push([e[x - 1][0] > c ? 180 : -180, O]),
                    y = [],
                    y.push([e[x - 1][0] > c ? -180 : 180, O]),
                    p.push(y)
                } else
                    y = [],
                    p.push(y);
                y.push([E, e[x][1]])
            } else
                y.push([e[x][0], e[x][1]])
        }
    } else {
        var F = [];
        p.push(F);
        for (var K = 0; K < e.length; ++K)
            F.push([e[K][0], e[K][1]])
    }
    for (var S = new eg(this.properties), M = 0; M < p.length; ++M) {
        var I = new kl;
        S.geometries.push(I);
        for (var P = p[M], X = 0; X < P.length; ++X)
            I.move_to(P[X])
    }
    return S
}
;
const tr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  , ig = s=>s === 2 ? "mph" : s === 3 ? "km/h" : "kn"
  , ng = (s,t,e)=>{
    if (s === "")
        return s;
    if (s == null || s < 0 || s === 102.3 || s === 1023)
        return "-";
    if (t === 1) {
        if (s === 102.2)
            return "≥102 kn";
        if (s === 1022)
            return "≥1022 kn"
    }
    if (t === 2) {
        if (s === 102.2)
            return "≥117.6 mph";
        if (s === 1022)
            return "≥1176 mph"
    }
    if (t === 3) {
        if (s === 102.2)
            return "≥189.3 km/h";
        if (s === 1022)
            return "≥1893 km/h"
    }
    let i = s;
    return t === 2 && (i *= 1.15078),
    t === 3 && (i *= 1.852),
    `${i.toFixed(1)} ${e}`
}
;
function sg(s) {
    return s === void 0 ? "" : s === null || s >= 360 || s < 0 ? "-" : s + "°"
}
function rg(s, t, e, i, n="N/A") {
    return s === null ? n : t.toFixed(e) + i
}
function Al(s) {
    if (s < 0) {
        const t = s & 127;
        let e;
        return t === 0 ? "just now" : t >= 24 ? (e = Math.round(t / 24),
        `${e} day${e > 1 ? "s" : ""} ago`) : `${t} hour${t > 1 ? "s" : ""} ago`
    }
    return s === 0 ? "just now" : `${s} minute${s > 1 ? "s" : ""} ago`
}
const og = ["Other type / Auxiliary", "Unknown type", "High speed craft", "Passenger ship", "Cargo ship", "Fishing vessel", "Tanker", "SAR/Military", "Yacht / sailing vessel"];
function ag(s) {
    return og[s]
}
function Ot(s, t, e) {
    for (; s.length < e; )
        s = t + s;
    return s
}
function lg(s) {
    if (!s || s === 0)
        return "-";
    const t = new Date(s * 1e3);
    return `${tr[t.getUTCMonth()]} ${Ot(t.getUTCDate().toString(), "0", 2)}, ${Ot(t.getUTCHours().toString(), "0", 2)}:${Ot(t.getUTCMinutes().toString(), "0", 2)}`
}
function Br(s, t, e) {
    let i = new Date(s * 1e3), n;
    if (t) {
        let r;
        return e && e === !0 ? r = "" : r = i.getUTCFullYear() + " ",
        n = tr[i.getUTCMonth()] + " " + Ot(i.getUTCDate().toString(), "0", 2) + ", " + r + Ot(i.getUTCHours().toString(), "0", 2) + ":" + Ot(i.getUTCMinutes().toString(), "0", 2) + " UTC",
        n
    } else {
        let r;
        return e && e === !0 ? r = "" : r = i.getFullYear() + " ",
        n = tr[i.getMonth()] + " " + Ot(i.getDate().toString(), "0", 2) + ", " + r + Ot(i.getHours().toString(), "0", 2) + ":" + Ot(i.getMinutes().toString(), "0", 2),
        n
    }
}
function Zr(s) {
    const t = parseFloat(s);
    return !isNaN(t) && isFinite(t) ? parseInt(s) : 0
}
function hg(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}
function rt(s, t) {
    window.gEM && window.gEM.emit(s, t)
}
function In(s, t) {
    window.gEM && window.gEM.on(s, function(e) {
        t(e)
    })
}
function $n(s) {
    const t = []
      , e = Object.keys(s)
      , i = e.length;
    for (let n = 0; n < i; n++) {
        const r = e[n]
          , o = s[r];
        t.push(o !== null && typeof o == "object" ? $n(o) : encodeURIComponent(r) + "=" + encodeURIComponent(o))
    }
    return t.join("&")
}
function qo(s, t, e, i, n, r) {
    const o = new XMLHttpRequest;
    function a() {
        if (!(o.readyState < 4)) {
            if (o.status !== 200) {
                r && r(o);
                return
            }
            o.readyState === 4 && o.response && n(JSON.parse(o.response), i)
        }
    }
    o.onreadystatechange = a,
    o.open(s, t, !0);
    const l = Object.entries(e);
    for (let c = 0, u = l.length; c < u; c++)
        o.setRequestHeader(l[c][0], l[c][1]);
    s === "POST" || s === "PUT" || s === "PATCH" ? (o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
    o.send($n(i))) : o.send(i)
}
const cg = window.IS_BETA ? "/web/vfmap" : "https://static.vesselfinder.net/web/vfmap";
function On(s, t, e) {
    var i = document.createElement("script");
    i.onload = t,
    i.src = (e ? "" : cg) + s + "?" + appver,
    document.head.appendChild(i)
}
const Vt = "https://static.vesselfinder.net/images"
  , Ce = s=>window.vftr ? window.vftr(s) : s
  , ug = s=>document.getElementById(s);
let As = 0
  , Jo = 0;
function Qo(s, t) {
    let e = hg(s)
      , i = ug("myplace-hint")
      , n = document.querySelector(".ol-viewport");
    i ? (clearTimeout(As),
    clearTimeout(Jo),
    i.innerHTML = e,
    i.style.opacity = "1",
    As = setTimeout(()=>{
        n.removeChild(i)
    }
    , t)) : (i = document.createElement("div"),
    i.style.zIndex = 3e3,
    i.id = "myplace-hint",
    i.innerHTML = e,
    n && n.appendChild(i),
    Jo = setTimeout(()=>{
        i.style.opacity = "1"
    }
    , 1),
    As = setTimeout(()=>{
        n.removeChild(i)
    }
    , t))
}
class dg extends H {
    constructor(t) {
        t = t || {},
        super({
            zIndex: t.zIndex,
            geometry: t.geometry
        }),
        this.setRenderer(this._renderer.bind(this)),
        this._lineBorderColor = t.borderColor || "rgba(100, 100, 100, 0.5)",
        this._lineDashPattern = t.lineDash || [20, 10],
        this._width = t.width || 0,
        this._lineJoin = t.lineJoin || "round",
        this._lineCap = t.lineCap || "square"
    }
    _renderer(t, e) {
        const {context: i, pixelRatio: n, feature: r} = e;
        i.save(),
        i.beginPath();
        const o = r.get("color0")
          , a = r.get("outofrange");
        a && i.setLineDash(this._lineDashPattern),
        i.strokeStyle = this._lineBorderColor,
        i.lineWidth = (this._width + 1) * n;
        for (let h = 0; h < t.length - 1; h++) {
            const c = t[h]
              , u = t[h + 1];
            i.moveTo(c[0], c[1]),
            i.lineTo(u[0], u[1])
        }
        i.stroke(),
        i.lineCap = "square";
        const l = r.get("color1");
        if (o !== l) {
            const h = i.createLinearGradient(t[0][0], t[0][1], t[1][0], t[1][1]);
            h.addColorStop(0, o),
            h.addColorStop(1, l),
            i.strokeStyle = h
        } else
            a ? i.strokeStyle = "rgba(0,0,0,0)" : i.strokeStyle = o;
        i.lineWidth = this._width * n,
        i.globalCompositeOperation = "source-over",
        i.stroke(),
        i.restore()
    }
}
const Os = ()=>window.IS_BETA ? "" : window.mapext2Ver;
let si = !1
  , Ln = !1;
function ta(s) {
    let t = s | 0
      , e = Math.abs((s - t) * 60).toFixed(3);
    return (s < 0 && t == 0 ? "-" : "") + t + "° " + Ot(e, "0", 6) + "′"
}
const ea = (s,t)=>`<div class='ol-mouse-position-inner'>
<div class="flx">
  <div class="llbl">Lat:</div><div class="coordinate lat">${s.toFixed(5)}</div>
  <div class="spacer"></div>
  <div class="llbl">Lon:</div><div class="coordinate lon">${t.toFixed(5)}</div>
</div>
<div class="flx">
  <div class="llbl">&nbsp;</div><div class="coordinate lat">${Ot(ta(s), "&nbsp;", 9)}</div>
  <div class="spacer"></div>
  <div class="llbl">&nbsp;</div><div class="coordinate lon">${Ot(ta(t), "&nbsp;", 10)}</div>
</div></div>`;
function qn(s, t) {
    var e = qn.canvas || (qn.canvas = document.createElement("canvas"))
      , i = e.getContext("2d");
    return i.font = t,
    i.measureText(s).width
}
function fg(s, t, e) {
    let i = new ArrayBuffer(e * 2)
      , n = new Uint16Array(i);
    for (let r = 0; r < e; ++r)
        n[r] = s.getUint8(t + r);
    return String.fromCharCode.apply(null, n)
}
const J = "EPSG:3857"
  , nt = "EPSG:4326"
  , ri = "EPSG:900913"
  , gg = 2863311530
  , _g = 1431655765
  , Fs = 13
  , mg = 13
  , ia = 14
  , pg = 50
  , na = 40
  , Mn = 6e5
  , vn = '© <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors.'
  , Le = "12px Open Sans,Helvetica Neue,arial,sans-serif"
  , sa = "bold 14px Open Sans,Helvetica Neue,arial,sans-serif"
  , Ol = "bold 12px Open Sans,Helvetica Neue,arial,sans-serif"
  , yg = "10px Open Sans,Helvetica Neue,arial,sans-serif"
  , xg = "9px Open Sans,Helvetica Neue,arial,sans-serif"
  , Ds = new at({
    color: "#fff"
});
let Fn, tt, Hi, Fl, Dl, Dn, er, Nl, Gl, zl, ir, Wl, Xl;
const Eg = `${Vt}/sar-right.svg`
  , wg = `${Vt}/sar-left.svg`;
function Sg() {
    tt = Math.ceil(rr),
    tt > 4 && (tt = 4),
    Hi = 1 / tt,
    Fn = tt > 1,
    Nl = `${Vt}/m2_m@${tt}.png`,
    Gl = `${Vt}/m2_s@${tt}.png`,
    zl = `${Vt}/m2_lx@${tt}.png`,
    Wl = `${Vt}/picn@${tt}.png`,
    Xl = `${Vt}/poicn@${tt}.png`,
    ir = `${Vt}/trackb@${tt}.png`;
    const s = 27 * tt
      , t = 13 * tt;
    Fl = [s, s],
    Dl = [t, t];
    const e = 17 * tt
      , i = 9 * tt;
    Dn = [e, e],
    er = [i, i]
}
let ra = Array(9)
  , re = "#999999";
const oa = ["rgba(96, 144,208, 0.5)", re, "rgba(193,193,193, 0.5)", re, "rgba(33, 163,33,  0.5)", re, "rgba(31, 254,1  , 0.5)", re, "rgba(255,255,2,   0.7)", re, "rgba(111,198,254, 0.9)", re, "rgba(254,163,33,  0.6)", re, "rgba(255,32, 32,  0.5)", re, "rgba(242,57, 238, 0.5)", re]
  , Cg = [1e6, 1e6, 1e6, 5e5, 25e4, 25e4, 125e3, 125e3, 60250, 60250, 30100, 15e3, 7500, 3500, 1500, 1, 1, 1, 1]
  , nr = "rgba(100, 100, 100, 0.4)"
  , Tg = [[0, 2, "rgba(185, 0,    0,  1.00)"], [2.1, 3.9, "rgba(255, 85,  30,  1.00)"], [4, 5.5, "rgba(255, 150,  0,  1.00)"], [5.6, 7, "rgba(255, 255,  0,  1.00)"], [7.1, 10.1, "rgba(140, 225, 45,  1.00)"], [10.2, 14, "rgba(0,   185, 125, 1.00)"], [14.1, 16, "rgba(0,   165, 215, 1.00)"], [16.1, 1023, "rgba(0,   120, 255, 1.00)"]];
function bn(s) {
    return Tg.find(t=>t[0] <= s && s <= t[1])[2]
}
function aa() {
    return new dg({
        width: 3,
        trackBorderColor: nr,
        lineDash: [10, 20]
    })
}
function la(s) {
    const t = s.get("outofrange");
    return new H({
        stroke: new It({
            color: "#065785",
            width: t ? 1 : 2,
            lineDash: t ? [10, 3] : void 0
        })
    })
}
function Ns(s, t, e, i, n, r, o, a, l) {
    let h = 0;
    return parseInt(e) < 1 ? h = 64 : (h = Math.floor((t + 2.8125) / 5.625),
    h === 64 && (h = 0)),
    new it({
        geometry: s,
        cog: t,
        sog: e,
        ts: i,
        selected: !1,
        ix: h,
        nx: n,
        pid: r,
        wsp: o,
        wdir: a,
        km: l
    })
}
function Rg() {
    return function(s) {
        const t = s.get("selected")
          , e = s.get("ix")
          , i = Dn[0];
        let n;
        return t ? n = da[e] || (da[e] = [new H({
            image: new Ht({
                anchor: er,
                anchorXUnits: "pixels",
                anchorYUnits: "pixels",
                offset: [e * i, i],
                size: Dn,
                scale: Hi,
                src: ir
            }),
            zIndex: 20100
        })]) : n = ua[e] || (ua[e] = [new H({
            image: new Ht({
                anchor: er,
                anchorXUnits: "pixels",
                anchorYUnits: "pixels",
                offset: [e * i, 0],
                size: Dn,
                scale: Hi,
                src: ir
            }),
            zIndex: 20100
        })]),
        n
    }
}
function Ig(s) {
    let t = ra[s];
    if (t)
        return t;
    let e = s * 2
      , i = oa[e]
      , n = oa[e + 1];
    return t = new H({
        stroke: new It({
            color: n,
            width: 1
        }),
        fill: new at({
            color: i
        })
    }),
    ra[s] = t,
    t
}
function Lg(s, t, e, i, n, r, o, a) {
    let l = o * (Math.PI / 180)
      , h = Math.sin(l)
      , c = Math.cos(l)
      , u = Math.cos(s * (Math.PI / 180));
    e = e / u,
    i = i / u,
    n = n / u,
    r = r / u;
    let d = Q([t, s], nt, ri)
      , f = [d[0] + (r - n) / 2 * c + e * h, d[1] - (r - n) / 2 * h + e * c]
      , g = [d[0] + r * c + (e - (e + i) / 4) * h, d[1] - r * h + (e - (e + i) / 4) * c]
      , _ = [d[0] + r * c - i * h, d[1] - r * h - i * c]
      , m = [d[0] - n * c - i * h, d[1] + n * h - i * c]
      , p = [d[0] - n * c + (e - (e + i) / 4) * h, d[1] + n * h + (e - (e + i) / 4) * c]
      , y = new Ir([[Q(f, ri, J), Q(g, ri, J), Q(_, ri, J), Q(m, ri, J), Q(p, ri, J)]])
      , x = new it({
        geometry: y
    });
    return x.setStyle(Ig(a)),
    x
}
function ha(s) {
    var t = document.createElement("link");
    t.href = "https://static.vesselfinder.net/images/" + s,
    t.rel = "preload",
    t.as = "image",
    document.head.appendChild(t)
}
function ca(s) {
    switch (s) {
    case 1:
        return "nautical";
    case 2:
        return "imperial";
    case 3:
        return "metric";
    default:
        return "nautical"
    }
}
function Mg(s, t, e) {
    var i;
    return function() {
        var n = this
          , r = arguments
          , o = function() {
            i = null,
            e || s.apply(n, r)
        }
          , a = e && !i;
        clearTimeout(i),
        i = setTimeout(o, t),
        a && s.apply(n, r)
    }
}
function vg(s, t, e) {
    const i = Math.max(e * 2, 9260)
      , n = s.getSize()
      , r = s.getView();
    return r.fit([t[0] - i, t[1] - i, t[0] + i, t[1] + i], {
        size: n,
        maxZoom: 15
    }),
    r.getZoom()
}
const sr = Array(1782)
  , ua = Array(65)
  , da = Array(65);
function fa(s, t, e, i) {
    let n = s[3]
      , r = s[4];
    return new Ht({
        anchor: [r, r],
        anchorXUnits: "pixels",
        anchorYUnits: "pixels",
        offset: [e, i],
        size: [n, n],
        scale: Hi,
        src: s[0],
        opacity: t
    })
}
function bg() {
    const s = [[Nl, 25, 13, 25 * tt, 13 * tt], [Gl, 21, 11, 21 * tt, 11 * tt], [zl, 29, 15, 29 * tt, 15 * tt]];
    let t = 0;
    for (let e = 0; e <= 2; e++) {
        const i = s[e];
        for (let n = 0; n <= 32; n++) {
            const r = i[3] * n;
            for (let o = 0; o <= 8; o++) {
                const a = i[3] * o;
                sr[t++] = fa(i, 1, r, a),
                sr[t++] = fa(i, .5, r, a)
            }
        }
    }
}
const ga = [["#fff", "#444", "#e2e2e2"], ["#000", "#fff", "#233"], []];
let zt = 1;
function Gs(s, t) {
    const e = s.get("td");
    return e !== -1 ? Al(e) : Br(s.get("tstamp"), t)
}
function _a() {
    return function(s) {
        if (s.get("z") === 1) {
            if (s.get("selected"))
                return null;
            const i = s.get("old") || s.get("vo")
              , n = s.get("name")
              , r = zt !== 5 && zt !== 7 ? ga[1] : ga[0];
            let o;
            if (i) {
                const a = s.get("tstamp")
                  , l = a > 0 ? Br(a, s.get("tf")) : Al(s.get("td"));
                o = new _t({
                    font: yg,
                    text: `${n}
${l}`,
                    fill: new at({
                        color: "#f00"
                    }),
                    textAlign: "left",
                    offsetX: 20,
                    offsetY: 0
                })
            } else
                o = new _t({
                    font: xg,
                    text: n,
                    fill: new at({
                        color: r[2]
                    }),
                    textAlign: "left",
                    offsetX: 8,
                    offsetY: -12
                });
            return new H({
                text: o
            })
        }
    }
}
function Yl(s, t, e) {
    const i = "rgba(255, 252, 250, 0.95)"
      , n = "rgb(180, 180, 180)"
      , r = s.get("name")
      , o = s.get("subtitle");
    return qn(r, t) > qn(o, Le) ? [new H({
        text: new _t({
            font: t,
            text: r,
            fill: new at({
                color: e
            }),
            textAlign: "left",
            offsetX: 24,
            offsetY: -8,
            backgroundFill: new at({
                color: i
            }),
            backgroundStroke: new It({
                width: 1,
                color: n
            }),
            padding: [4, 4, 19, 4]
        }),
        zIndex: 2e4
    }), new H({
        text: new _t({
            font: Le,
            text: o,
            fill: new at({
                color: e
            }),
            textAlign: "left",
            offsetX: 24,
            offsetY: 8
        }),
        zIndex: 2e4
    })] : [new H({
        text: new _t({
            font: Le,
            text: o,
            fill: new at({
                color: e
            }),
            textAlign: "left",
            offsetX: 24,
            offsetY: 8,
            backgroundFill: new at({
                color: i
            }),
            backgroundStroke: new It({
                width: 1,
                color: n
            }),
            padding: [20, 4, 3, 4]
        }),
        zIndex: 2e4
    }), new H({
        text: new _t({
            font: t,
            text: r,
            fill: new at({
                color: e
            }),
            textAlign: "left",
            offsetX: 24,
            offsetY: -8
        }),
        zIndex: 2e4
    })]
}
function Bl(s, t) {
    let e;
    const i = s.get("iconNumber");
    let n = s.get("old");
    const r = s.get("selected");
    if (s.get("sar")) {
        let o;
        i === 1 ? o = Eg : o = wg,
        e = new Ht({
            anchor: [11, 7],
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            offset: [0, 0],
            size: [22, 14],
            imgSize: [22, 14],
            src: o
        })
    } else {
        r && (n = 0);
        const o = s.get("color")
          , a = s.get("size");
        e = sr[594 * a + i * 18 + o * 2 + n]
    }
    if (t) {
        const o = Yl(s, Ol, s.get("sat") ? "#084" : "#000");
        return o.push(new H({
            image: e
        })),
        o
    }
    return new H({
        image: e
    })
}
function Pn() {
    return function(s) {
        return Bl(s, !1)
    }
}
function ma() {
    return function(s) {
        return Bl(s, !0)
    }
}
const Pg = new at({
    color: "#999"
});
function kg() {
    return function(s) {
        return new H({
            text: new _t({
                font: Le,
                text: s.get("name"),
                fill: Pg,
                textAlign: "left",
                offsetX: 0,
                offsetY: 0
            })
        })
    }
}
function kn(s, t, e) {
    const i = `<div class="flx">
    ${s ? '<div class="mapmode mfleet">Fleet mode ON</div>' : ""}
    ${t !== 511 ? '<div class="mapmode mfilter">Vessel Filter ON</div>' : ""}
    ${e ? "" : '<div class="mapmode sfilter">Satellite AIS OFF</div>'}
  </div>`;
    document.getElementById("map-modes").innerHTML = i
}
class Ag {
    constructor(t, e, i) {
        window.ol = {
            Graticule: Hf,
            Overlay: Uu,
            Feature: it,
            PointerInteraction: Ci,
            Sphere: {
                getDistance: Ne,
                getLength: ka
            },
            control: {
                Control: Si
            },
            proj: {
                transform: Q,
                transformExtent: Mi
            },
            geom: {
                LineString: Zt,
                MultiLineString: Io,
                Point: Wt,
                Polygon: Ir
            },
            source: {
                XYZ: ii,
                Vector: xt
            },
            layer: {
                Tile: Rn,
                Vector: Tt
            },
            style: {
                Style: H,
                Stroke: It,
                Icon: Ht,
                Fill: at,
                Text: _t
            }
        },
        this.selectionMarker = new it,
        this.selectionMarkerAdded = !1,
        this.trackIsDrawn = !1,
        this.reportedDest = "",
        this.reportedETA = "",
        this.selected_track_marker = new it({
            selected: !1
        }),
        this.selected_track_label2 = new it({
            type: 2,
            text: ""
        }),
        this.selected_track_label_added = !1,
        this.anchorageZonesSource = null,
        this.anchorageZonesLayer = null,
        this.anchoragesAttached = !1,
        this.nextId = 0,
        this.trackMMSI = -1,
        this.mapInitialized = !1,
        this.firstMapMove = !0,
        this.isRunning = !1,
        this.selectedMMSI = 0,
        this.selectedShipMarker = new it({
            nf: null,
            mmsi: 0,
            tstamp: 0,
            name: "",
            selected: !1
        }),
        this.currentTP = null,
        this.trackMarkersArr = [],
        this.trackMarkersCache = {},
        this.trackZoom = 0,
        this.oldHoverMMSI = 0,
        this.oldHoverPort = "",
        this.oldHoverFeature = null,
        this.preflightAdded = !1,
        this.portPreflightAdded = !1,
        this.preflightIcon = new it({
            type: 1
        }),
        this.preflightLabel = new it({
            name: "",
            type: 2
        }),
        this.preflightPortLabel = new it({
            name: "",
            type: 2
        }),
        this.densityAttached = !1,
        this.measureMode = !1,
        "ontouchstart"in window ? (this.UIT = !0,
        this.tht_s = 6,
        this.tht_t = 6) : (this.UIT = !1,
        this.tht_s = 0,
        this.tht_t = 2),
        this.mworker = e,
        this.target = document.getElementById(t),
        this.options = i,
        Sg(),
        bg(),
        this.shipNames = new xt({
            overlaps: !1
        }),
        this.shipNamesLayer = new Tt({
            className: "MARKERS",
            zIndex: 11,
            source: this.shipNames,
            style: _a()
        }),
        this.markers = new xt({
            overlaps: !1
        }),
        this.markerLayer = new Tt({
            className: "MARKERS",
            zIndex: 13,
            source: this.markers,
            style: Pn(),
            renderBuffer: 40,
            updateWhileInteracting: !0
        }),
        this.satMarkers = new xt({
            overlaps: !1
        }),
        this.satLayer = new Tt({
            className: "MARKERS",
            zIndex: 12,
            source: this.satMarkers,
            style: Pn(),
            visible: this.options.satVisible,
            renderBuffer: 40,
            updateWhileInteracting: !0
        }),
        this.extraMarkers = new xt({
            features: [],
            overlaps: !1
        }),
        this.extraLayer = new Tt({
            className: "MARKERS",
            zIndex: 18,
            source: this.extraMarkers,
            style: ma()
        }),
        this.reconfigP3(this.options.mcb.p3),
        this.vtetiles = new Rn({
            className: "LAYERS",
            zIndex: 1,
            source: this.vtebrightSource
        }),
        this.RMLoaded = !1,
        this.RMVisible = !1,
        this.RMSource = new xt({
            features: []
        }),
        this.RMLayer = new Tt({
            className: "LAYERS",
            zIndex: 6,
            source: this.RMSource,
            style: kg(),
            visible: !1
        }),
        this.shapes = new xt,
        this.shapesLayer = new Tt({
            className: "MARKERS",
            zIndex: 10,
            source: this.shapes
        }),
        this.trackMarkers = new xt,
        this.trackLayer = new Tt({
            className: "MARKERS",
            zIndex: 16,
            source: this.trackMarkers,
            style: Rg(),
            visible: !1,
            renderBuffer: 40,
            updateWhileInteracting: !0
        }),
        this.trackLines = new xt,
        this.trackLineLayer = new Tt({
            className: "MARKERS",
            zIndex: 14,
            source: this.trackLines,
            style: this.options.coloredTrack ? aa : la,
            visible: !1
        }),
        this.pTrackLines = new xt,
        this.pTrackLineLayer = new Tt({
            className: "MARKERS",
            zIndex: 15,
            source: this.pTrackLines,
            style: ()=>new H({
                stroke: new It({
                    color: "#ce064d",
                    width: 2,
                    lineDash: [10, 3]
                })
            }),
            visible: !1
        }),
        this.trackLabels = new xt({
            wrapX: !1
        }),
        this.trackLabelsLayer = new Tt({
            className: "MARKERS",
            zIndex: 20,
            source: this.trackLabels,
            style: this.createTrackLabelsStyle(),
            visible: !1
        }),
        this.preflightLabels = new xt,
        this.preflightLayer = new Tt({
            className: "MARKERS",
            zIndex: 19,
            source: this.preflightLabels,
            style: this.createPreflightLabelsStyle(),
            visible: !0
        });
        let n = new H({
            image: new Ht({
                anchor: [17, 17],
                anchorXUnits: "pixels",
                anchorYUnits: "pixels",
                offset: [0, 0],
                size: [33, 33],
                imgSize: [33, 33],
                src: Vt + "/pmarker2.svg"
            }),
            zIndex: 19990
        });
        this.selectionMarker.setStyle(n),
        this.portMarkers = new xt,
        this.portsLayer = new Tt({
            className: "MARKERS",
            zIndex: 17,
            source: this.portMarkers,
            style: this.createPortMarkerStyle.bind(this),
            visible: this.options.ports
        });
        let r, o, a, l = localStorage.getItem("vesselfinder-mapPosition");
        if (l !== null) {
            let m = l.split(",");
            o = parseFloat(m[1]),
            r = parseFloat(m[2]),
            (isNaN(r) || r === 0) && (isNaN(o) || o === 0) && (o = 0,
            r = 30),
            a = parseInt(m[0]),
            (isNaN(a) || a < 3) && (a = 3)
        } else
            this.options.mcb.emp2 ? (r = this.options.mcb.p_lat,
            o = this.options.mcb.p_lon,
            a = this.options.mcb.emp2z) : (r = 30,
            o = 0,
            a = 3);
        typeof port_lat < "u" && typeof port_lon < "u" && (r = port_lat,
        o = port_lon,
        a = 13),
        this.scaleLine = new Jf({
            units: ca(this.options.distanceUnits)
        }),
        this.mousePosition = new tg({
            coordinateFormat: function(m) {
                return m ? ea(m[1], m[0]) : ""
            },
            wrapX: !0,
            projection: nt
        }),
        this.attribution = new Ja({
            collapsible: !0
        });
        let h = Qa({
            rotate: !1,
            attribution: !1,
            zoom: !0
        }).extend([this.scaleLine, this.mousePosition, this.attribution]);
        const c = {
            enableRotation: !1,
            smoothExtentConstraint: !1,
            minZoom: 2,
            maxZoom: 18,
            extent: Mi([-500, -84.99, 500, 88.99], nt, J)
        };
        _lsreq_ == 0 && (c.zoom = a,
        c.center = lo([o, r]));
        let u = new Ut(c);
        this.oldZoom = a;
        let d = this.options.mst;
        this.options.mcb.p4 ? (this.attachVTEInternal(6),
        zt = 6) : d !== 1 && (this.attachVTEInternal(d),
        zt = d);
        let f = {
            target: t,
            controls: h,
            layers: [this.vtetiles, this.RMLayer, this.shapesLayer, this.shipNamesLayer, this.satLayer, this.markerLayer, this.trackLineLayer, this.pTrackLineLayer, this.trackLayer, this.portsLayer, this.extraLayer, this.preflightLayer, this.trackLabelsLayer],
            view: u
        };
        if (this.map = new Bu(f),
        this.map.getInteractions().getArray().filter(function(m) {
            return m instanceof sl
        })[0].setActive(!1),
        this.options.anchorage_zones && (this.reconfigAnchorageZones(),
        this.attachAnchorageZones()),
        this.map.on("click", m=>{
            if (si && this.measureMode) {
                if (typeof __ctxmnu < "u" && __ctxmnu.isOpen()) {
                    rt("closeCtxMnu");
                    return
                }
                rt("closeButtonMenu"),
                __mapExtA.addMeasureMark(m);
                return
            }
            this.onClick(m)
        }
        ),
        this.map.getViewport().addEventListener("mousemove", m=>this.onMouseMove(m), !1),
        this.moveEndListener = this.moveEndListener.bind(this),
        this.map.on("moveend", Mg(this.moveEndListener, 250, !1), this),
        a < 6) {
            let m;
            tt < 2 ? m = "@1.png" : tt >= 2 && tt <= 4 ? m = `@${tt}.png` : m = ".png",
            setTimeout(function() {
                ha("m2_m" + m),
                ha("m2_lx" + m)
            }, 2e3)
        }
        In("si-close", ()=>this.deselectShip()),
        In("density-layer", ({name: m, opacity: p})=>this.attachDensity(m, p)),
        In("density-opacity", ({value: m})=>this.changeDensityOpacity(m)),
        In("density-layers-off", ()=>this.detachDensity()),
        this.options.graticule && this.toggleGraticule(!0),
        this.reloadRM(this.oldZoom),
        this.mapInitialized = !0
    }
    setUnits(t, e) {
        this.options.speedUnits = t,
        this.options.distanceUnits = e,
        this.trackIsDrawn && this.redrawTrackLabel(),
        this.clearPreflight(),
        this.scaleLine.set("units", ca(e)),
        si && this.measureMode && (__mapExtA.recalculateMeasureMarks(),
        __mapExtA.getMeasureSource().forEachFeature(n=>{
            n.get("selected") && __mapExtA.updateMeasureMarkLabel(n)
        }
        ))
    }
    reloadRM(t) {
        /*
        t > ia ? (this.RMLoaded || (this.RMLoaded = !0,
        this.mworker.postMessage({
            cmd: "loadrm"
        })),
        this.RMVisible || (this.RMLayer.setVisible(!0),
        this.RMVisible = !0)) : this.RMVisible && (this.RMLayer.setVisible(!1),
        this.RMVisible = !1)
    */
    }
    rivermarksPortion(t) {
        const e = t.map(i=>new it({
            geometry: new Wt(lo([i[0], i[1]])),
            name: i[2]
        }));
        this.RMSource.addFeatures(e)
    }
    toggleGraticule(t) {
        Ln ? __mapExtB.toggleGraticule(this, t) : On(`/mapext/mapext2.2b${Os()}.js`, ()=>{
            Ln = !0,
            __mapExtB.toggleGraticule(this, t)
        }
        )
    }
    toggleECALayer(t) {
        Ln ? __mapExtB.toggleECALayer(this, t) : On(`/mapext/mapext2.2b${Os()}.js`, ()=>{
            Ln = !0,
            __mapExtB.toggleECALayer(this, t)
        }
        )
    }
    createContextMenuItems() {
        return [{
            text: this.options.fleetMode ? Ce("Show All vessels") : Ce("Show My Fleets"),
            callback: ()=>{
                setTimeout(()=>{
                    rt("toggle-dmf", !this.options.fleetMode)
                }
                , 250)
            }
        }, {
            text: this.options.satVisible ? Ce("Hide Satellite positions") : Ce("Show Satellite positions"),
            callback: ()=>{
                setTimeout(()=>{
                    rt("toggle-sat", !this.options.satVisible)
                }
                , 250)
            }
        }, {
            text: this.measureMode ? Ce("Exit Measure Distance") : Ce("Measure Distance"),
            classname: this.measureMode ? "ol-ctx-menu-active" : "",
            callback: ()=>{
                this.measureMode ? this.stopMeasureMode() : this.startMeasureMode()
            }
        }, "-", {
            text: Ce("Refresh map"),
            callback: ()=>{
                rt("clearMapRefresh", !0),
                this.refreshMap()
            }
        }]
    }
    attachVTEInternal(t) {
        let e, i = !0;
        t === 1 ? e = this.vtebrightSource : t === 6 ? e = this.vteSimpleSource : t === 7 && (e = this.vteDarkSource),
        this.vtetiles.setSource(e),
        this.attribution.setCollapsed(i)
    }
    attachVTEExt(t) {
        let e;
        this.options.mcb.p4 ? (console.log("P4 override in effect"),
        e = 6) : e = t,
        zt = t,
        this.attachVTE(e),
        this.options.anchorage_zones && !this.anchoragesAttached && this.attachAnchorageZones()
    }
    attachVTE(t) {
        this.attachVTEInternal(t),
        this.markerLayer.set("style", Pn()),
        this.extraLayer.set("style", ma()),
        this.satLayer.set("style", Pn()),
        this.shipNamesLayer.set("style", _a());
        const e = new xt({});
        this.markerLayer.set("source", e),
        this.markerLayer.set("source", this.markers),
        this.extraLayer.set("source", e),
        this.extraLayer.set("source", this.extraMarkers),
        this.shipNamesLayer.set("source", e),
        this.shipNamesLayer.set("source", this.shipNames),
        this.portsLayer.set("source", e),
        this.portsLayer.set("source", this.portMarkers)
    }
    changeDensityOpacity(t) {
        this.densityAttached && this.densityLayer.set("opacity", t)
    }
    detachDensity() {
        this.map.getLayers().remove(this.densityLayer),
        this.densityAttached = !1
    }
    attachDensity(t, e) {
        if (t !== "all")
            return;
        const i = `//density.tiles.vesselfinder.net/${t}/{z}/{x}/{y}.png`
          , n = new ii({
            attributions: vn,
            url: i,
            crossOrigin: null,
            maxZoom: 12,
            minZoom: 3,
            tilePixelRatio: 1
        });
        this.densityAttached && this.map.getLayers().remove(this.densityLayer),
        this.densityLayer = new Rn({
            className: "LAYERS",
            zIndex: 4,
            source: n,
            opacity: e
        }),
        this.map.getLayers().insertAt(1, this.densityLayer),
        this.densityAttached = !0
    }
    startMeasureMode() {
        si ? __mapExtA.startMeasureMode(this) : On(`/mapext/mapext2.2a${Os()}.js`, ()=>{
            si = !0,
            __mapExtA.startMeasureMode(this)
        }
        ),
        rt("change-measure-mode", !0)
    }
    stopMeasureMode() {
        si && __mapExtA.stopMeasureMode(),
        rt("change-measure-mode", !1)
    }
    setSatVisible(t) {
        this.options.satVisible = t,
        t ? (this.satLayer.setVisible(!0),
        this.options.fleetMode || this.refreshMap()) : (this.satLayer.setVisible(!1),
        this.selectionMarkerAdded && this.selectedMMSI === 0 && (this.markers.removeFeature(this.selectionMarker),
        this.selectionMarkerAdded = !1)),
        rt("updateCtxMnu"),
        kn(this.options.fleetMode, this.options.filter, t)
    }
    moveEndListener() {
        const t = this.map.getView()
          , e = Q(t.getCenter(), J, nt);
        if (this.firstMapMove)
            return this.firstMapMove = !1,
            document.querySelector(".ol-mouse-position").innerHTML = ea(e[1], e[0]),
            !1;
        this.isRunning && (rt("clearMapRefresh", !0),
        this.refreshMap());
        let i = t.getZoom();
        (this.oldZoom != i && i > Fs || this.preflightLabel.get("sat")) && this.clearPreflight(),
        this.oldZoom = i,
        localStorage.setItem("vesselfinder-mapPosition", i + "," + e[0] + "," + e[1]),
        this.reloadRM(i),
        typeof __mapExtG < "u" && __mapExtG.isWindyAttached() && __mapExtG.refresh()
    }
    run() {
        return this.isRunning ? !1 : (this.isRunning = !0,
        _lsreq_ == 1 ? (this.selectedMMSI = window.MMSI,
        this.mustShowShip(this.selectedMMSI, !1)) : this.getShipsOnMap(),
        kn(this.options.fleetMode, this.options.filter, this.options.satVisible),
        !0)
    }
    refreshTileSource() {
        this.vtebrightSource.refresh()
    }
    onMouseMove(t) {
        let e = this.map.getEventPixel(t)
          , i = this;
        if (si && this.measureMode) {
            const o = __mapExtA.measureTouchFactor();
            let a = null
              , l = !1;
            this.map.forEachFeatureAtPixel(e, h=>{
                l || (a = h,
                l = !0)
            }
            , {
                hitTolerance: o,
                layerFilter: h=>h === __mapExtA.getMeasureLayer()
            }),
            l && (this.UIT || __mapExtA.getMeasureSource().forEachFeature(h=>h.set("selected", !1)),
            __mapExtA.updateMeasureMarkLabel(a)),
            __mapExtA.updateHelpTooltip(t);
            return
        }
        if (this.UIT || this.trackIsDrawn)
            return;
        let n = this.map.getView().getZoom();
        this.map.forEachFeatureAtPixel(e, function(o, a) {
            let l = a == i.markerLayer || a == i.satLayer || a == i.portsLayer;
            if (a == i.portsLayer) {
                let h = o.get("port_id");
                if (h && h !== "") {
                    if (i.preflightAdded && i.clearPreflight(),
                    i.portPreflightAdded && i.oldHoverPort === h)
                        return !0;
                    let c = o.getGeometry();
                    return i.preflightPortLabel.setGeometry(c),
                    i.preflightPortLabel.set("name", o.get("pn")),
                    i.preflightPortLabel.set("subtitle", o.get("pc")),
                    i.preflightPortLabel.set("type", 3),
                    i.portPreflightAdded || n <= Fs && (i.preflightLabels.addFeature(i.preflightPortLabel),
                    i.portPreflightAdded = !0),
                    i.oldHoverPort = h,
                    !0
                }
            }
            return l && i.addPreflight(o),
            l
        }, {
            hitTolerance: this.tht_s
        }) ? this.target.style.cursor = "pointer" : (this.target.style.cursor = "",
        this.clearPreflight())
    }
    addPreflight(t) {
        this.portPreflightAdded && this.clearPreflight();
        const e = t.get("mty");
        let i, n, r, o, a;
        if (e === 1)
            i = t.get("mmsi"),
            n = t.get("name"),
            o = Gs(t, this.options.timeFormat),
            r = !1,
            a = 2;
        else if (e === 2)
            i = t.get("color"),
            n = "Satellite Position",
            o = ag(i),
            r = !0,
            a = 2;
        else
            return;
        let l = t.getGeometry();
        this.preflightLabel.setGeometry(l),
        this.preflightIcon.setGeometry(l),
        this.preflightLabel.set("name", n),
        this.preflightLabel.set("subtitle", o),
        this.preflightLabel.set("sat", r),
        this.preflightLabel.set("type", a),
        this.oldHoverFeature != null && this.oldHoverFeature.set("selected", !1),
        this.oldHoverMMSI = i,
        this.oldHoverFeature = t.get("nf"),
        this.oldHoverFeature != null && this.oldHoverFeature.set("selected", !0),
        this.preflightAdded || (this.preflightLabels.addFeature(this.preflightLabel),
        this.preflightAdded = !0,
        this.UIT || this.preflightLabels.addFeature(this.preflightIcon))
    }
    clearPreflight() {
        this.preflightAdded = !1,
        this.portPreflightAdded = !1,
        this.oldHoverMMSI = 0,
        this.oldHoverPort = "",
        this.preflightLabels.clear(!0),
        this.preflightLabel.set("sat", !1),
        this.oldHoverFeature != null && (this.oldHoverFeature.set("selected", !1),
        this.oldHoverFeature = null)
    }
    onClick(t) {
        if (rt("closeButtonMenu"),
        this.measureMode)
            return;
        let e = this;
        if (this.trackIsDrawn) {
            let n = !1;
            if (this.map.forEachFeatureAtPixel(t.pixel, function(r) {
                n || (n = !0,
                e.selected_track_marker.set("selected", !1),
                r.set("selected", !0),
                e.selected_track_marker = r,
                e.redrawTrackLabelInternal(),
                e.selected_track_label2.setGeometry(r.getGeometry()),
                e.selected_track_label_added || (e.trackLabels.addFeature(e.selected_track_label2),
                e.selected_track_label_added = !0))
            }, {
                hitTolerance: this.tht_t,
                layerFilter: r=>r === this.trackLayer
            }),
            n) {
                const r = this.selected_track_marker.get("wsp");
                if (this.selected_track_marker.get("wdir") !== null && r !== null)
                    return;
                const a = Q(this.selected_track_marker.getGeometry().getCoordinates(), J, nt)
                  , l = Math.round(a[1] * 6e5) ^ gg
                  , h = Math.round(a[0] * 6e5) ^ _g
                  , c = this.selected_track_marker.get("ts")
                  , u = this.selected_track_marker.get("pid");
                qo("GET", "/api/pub/weather/along-track/" + this.trackMMSI + "/" + h + "/" + l + "/" + c + "/" + u, {}, null, d=>{
                    const {wsp: f, wdir: g, nx: _, success: m} = d;
                    !m || u !== _ || f === null || g === null || (this.selected_track_marker.set("wsp", f),
                    this.selected_track_marker.set("wdir", g),
                    this.redrawTrackLabelInternal())
                }
                , ()=>{}
                );
                return
            }
        }
        let i = !1;
        if (this.map.forEachFeatureAtPixel(t.pixel, function(n, r) {
            if (i || r != e.markerLayer && r != e.satLayer && r != e.portsLayer && r != e.extraLayer)
                return !1;
            let o = n.get("port_id");
            if (o && o !== "")
                return n.get("st") == 1 && setTimeout(function() {
                    window.location.href = prefix + "/ports/" + o
                }, 100),
                !0;
            if (n === e.selectionMarker)
                return !1;
            let a = n.get("mty") === 1 ? n.get("mmsi") : 0;
            return a === void 0 ? !1 : (e.deselectCurrent(),
            a > 0 && e.extraMarkers.addFeature(n),
            e.selectedMMSI = a,
            e.selectedShipMarker = n,
            e.selectedShipMarker.set("selected", !0),
            t.originalEvent.preventDefault(),
            t.originalEvent.stopPropagation(),
            t.originalEvent.cancelBubble = !0,
            t.originalEvent.returnValue = !1,
            t.target = null,
            i = !0,
            setTimeout(function() {
                e.onShipClick(a, e.selectedShipMarker)
            }, 1),
            i)
        }, {
            hitTolerance: this.tht_s
        }),
        !i && !this.trackIsDrawn && this.selectionMarkerAdded) {
            if (window.__velcm.siloading)
                return;
            this.selectedMMSI = 0,
            this.deselectCurrent(),
            this.markers.removeFeature(this.selectionMarker),
            this.selectionMarkerAdded = !1,
            this.clearPreflight(),
            rt("ship-in-view", {
                visible: !1,
                zoom: this.map.getView().getZoom()
            })
        }
        !i && this.trackIsDrawn && (this.selected_track_marker.set("selected", !1),
        this.selected_track_label_added && (this.trackLabels.removeFeature(this.selected_track_label2),
        this.selected_track_label_added = !1))
    }
    deselectShip() {
        !this.trackIsDrawn && this.selectionMarkerAdded && (this.selectedMMSI = 0,
        this.markers.removeFeature(this.selectionMarker),
        this.selectionMarkerAdded = !1,
        this.deselectCurrent(),
        this.clearPreflight())
    }
    deselectCurrent() {
        this.selectedShipMarker.set("selected", !1);
        const t = this.selectedShipMarker.get("nf");
        t && t.set("selected", !1),
        this.extraMarkers.clear()
    }
    onShipClick(t, e) {
        if (this.trackMMSI > 0 && this.trackMMSI !== this.selectedMMSI && this.clearTrack(),
        this.clearPreflight(),
        this.selectionMarker.setGeometry(e.getGeometry()),
        this.selectionMarkerAdded || (this.markers.addFeature(this.selectionMarker),
        this.selectionMarkerAdded = !0),
        t == 0 && e.get("mty") === 2)
            rt("sat-ship", {
                type: e.get("color"),
                lastRep: e.get("tstamp")
            });
        else {
            e.set("subtitle", Gs(e, this.options.timeFormat));
            const i = e.get("nf");
            i && i.set("selected", !0);
            let n = this.map.getView().getZoom();
            rt("ter-ship", {
                mmsi: t,
                sar: e.get("sar"),
                zoom: n
            })
        }
    }
    fadeLayers(t) {
        this.markerLayer.setOpacity(t),
        this.satLayer.setOpacity(t)
    }
    getShipTrackW(t, e, i, n) {
        /*
        let r = this.selectedShipMarker.get("mmsi");
        if (r == 0 || t < 1e8 || t > 999999999 || t != r)
            return;
        this.clearTrack(),
        this.trackMMSI = r;
        let o = this.selectedShipMarker.getGeometry().getCoordinates()
          , a = Q(o, J, nt);
        this.currentTP = {
            point: a,
            position: o,
            cog: e,
            sog: i,
            ts: n,
            ref: 0
        },
        this.mworker.postMessage({
            cmd: "mt",
            mmsi: r
        }),
        this.options.routePrediction && qo("GET", "/api/pub/dm2/" + encodeURIComponent(r) + "?wp=1&t=" + n, {}, null, l=>{
            if (this.trackMMSI === -1 || this.trackMMSI !== r)
                return;
            if (!l.success) {
                this.reportedDest = "",
                this.reportedETA = "",
                rt("predictedTrack", {
                    active: !1
                });
                return
            }
            this.reportedDest = l.dest,
            this.reportedETA = lg(l.reta);
            const {path: h} = l;
            this.drawPredictedTrack(h)
        }
        )
        */
    }
    drawTrackW(t, e) {
        this.trackMMSI === e && this.currentTP !== null && (this.currentTP.ref = t[t.length - 1].ts,
        t.push(this.currentTP),
        this.drawTrack(t))
    }
    addTrackMarker(t, e, i) {
        const n = new Wt([t[0], t[1]])
          , r = this.nextId
          , o = Ns(n, t[3], t[4], t[2], r, r, null, null, i);
        e.push(o),
        this.nextId += 1
    }
    lineIntersect(t, e, i, n) {
        const r = e[1] - t[1]
          , o = t[0] - e[0]
          , a = r * t[0] + o * t[1]
          , l = n[1] - i[1]
          , h = i[0] - n[0]
          , c = l * i[0] + h * i[1]
          , u = r * h - l * o
          , d = (h * a - o * c) / u
          , f = (r * c - l * a) / u;
        return [d, f]
    }
    makeNewTrackPoint(t, e) {
        const [i,n] = t
          , [r,o] = e;
        if (Math.abs(r - i) > 2003750834167605e-8) {
            const a = i < 0 ? -2003750834167605e-8 : 2003750834167605e-8
              , l = [i, n]
              , h = [r, o];
            h[0] += 2 * a;
            const c = this.lineIntersect(l, h, [a, a], [a, -a]);
            return [a, c[1], -a, c[1]]
        }
        return [r, o]
    }
    drawPredictedTrack(t) {
        let e = 0;
        const i = [];
        for (; e <= t.length - 2; ) {
            const r = t[e]
              , o = t[e + 1]
              , a = {
                x: r[0],
                y: r[1]
            }
              , l = {
                x: o[0],
                y: o[1]
            };
            if (Ne(r, o) / 1852 > 1500) {
                const d = new Yr(a,l,{
                    name: "line" + e
                }).Arc(100, {
                    offset: 10
                });
                for (let f = 0; f < d.geometries.length; f++)
                    i.push(d.geometries[f].coords.filter(g=>!isNaN(g[0]) && !isNaN(g[1])))
            } else {
                const u = this.makeNewTrackPoint(Q(r, nt, J), Q(o, nt, J));
                u.length === 4 ? (i.push([r, Q([u[0], u[1]], J, nt)]),
                i.push([Q([u[2], u[3]], J, nt), o])) : i.push([r, o])
            }
            e += 1
        }
        const n = new Io(i);
        n.transform(nt, J),
        this.pTrackLines.addFeature(new it({
            geometry: n,
            outofrange: 2
        })),
        this.trackIsDrawn || this.showTrack(),
        rt("predictedTrack", {
            active: !0,
            reportedDest: this.reportedDest,
            reportedETA: this.reportedETA
        })
    }
    drawTrack(t) {
        let e = 0, i = 0, n, r, o, a, l = !1;
        const h = [];
        let c = []
          , u = !0;
        this.nextId = 0;
        const d = t[0];
        let f = bn(d.sog);
        const g = Q(d.point, nt, J);
        let _ = new Zt([g])
          , [m,p] = g
          , y = [m, p, d.ts, d.cog, d.sog, f, d.point];
        this.addTrackMarker(y, c, 0);
        const x = t.length;
        for (let E = 1; E < x; E++) {
            let w = t[E];
            const R = bn(w.sog);
            a = w.ts;
            const T = Q(w.point, nt, J)
              , [L,v] = T
              , b = y
              , D = [b[0], b[1]];
            if (o = b[2],
            r = a - o,
            r > 0) {
                if (e = Ne(b[6], w.point),
                n = r > 0 ? e / r * 1.9438444924406 : 999999,
                n > pg || e == 0)
                    continue;
                e < na ? u = !1 : (u = !0,
                i += e)
            } else
                u = !1;
            r > 10800 ? l ? _.appendCoordinate(T) : (_.getCoordinates().length > 1 && h.push(new it({
                geometry: _,
                outofrange: !1,
                color0: f,
                color1: R
            })),
            _ = new Zt([D, T]),
            this.addTrackMarker(b, c, i),
            l = !0,
            u = !1) : l ? (h.push(new it({
                geometry: _,
                outofrange: !0,
                color0: nr,
                color1: nr
            })),
            this.addTrackMarker(b, c, i),
            _ = new Zt([D, T]),
            l = !1,
            u = !1) : (_.appendCoordinate(T),
            h.push(new it({
                geometry: _,
                outofrange: !1,
                color0: f,
                color1: R
            })),
            _ = new Zt([T])),
            f = R;
            const {cog: O, sog: F, point: K} = w;
            if (y = [L, v, a, O, F, R, K],
            E < x - 1 && u) {
                const S = new Wt(T)
                  , M = this.nextId;
                let I = Ns(S, O, F, a, M, M, null, null, i);
                this.nextId += 1,
                c.push(I)
            }
        }
        _.getCoordinates().length > 0 && h.push(new it({
            geometry: _,
            outofrange: l,
            color0: f,
            color1: f
        })),
        this.trackLines.addFeatures(h),
        this.trackMarkersCache = {},
        this.trackMarkersArr = c,
        this.trackZoom = this.map.getView().getZoom() | 0,
        this.simplifyAllTracksMarkers(),
        this.simplifyTrack(this.trackZoom),
        this.showTrack(),
        this.options.autoFitTrack && setTimeout(()=>this.fitTrack(), 500)
    }
    simplifyTrack(t) {
        this.trackMarkers.clear();
        const e = this.trackMarkersCache[t] || [];
        this.trackMarkers.addFeatures(e),
        this.selected_track_label_added && !e.find(i=>i.get("pid") === this.selected_track_marker.get("pid")) && this.trackMarkers.addFeature(this.selected_track_marker)
    }
    simplifyAllTracksMarkers() {
        const t = new Map
          , i = this.trackMarkersArr[0].get("km");
        Cg.forEach((n,r)=>{
            if (r < 2)
                return;
            let o = i;
            this.trackMarkersArr.forEach(a=>{
                const l = a.get("pid")
                  , h = t.get(l);
                if (h) {
                    o = h.get("km");
                    return
                }
                const c = a.get("km");
                (c - o > n || l === 0) && (t.set(l, a),
                o = c)
            }
            ),
            this.trackMarkersCache[r] = [...t.values()]
        }
        )
    }
    showTrack() {
        if (this.trackMMSI < 0) {
            rt("trackPanel", {
                active: !1
            });
            return
        }
        this.trackLineLayer.setVisible(!0),
        this.pTrackLineLayer.setVisible(!0),
        this.setTrackWaypoints(this.options.waypoints),
        this.trackIsDrawn = !0,
        this.clearPreflight(),
        this.fadeLayers(.35),
        rt("trackPanel", {
            active: !0
        })
    }
    setTrackWaypoints(t) {
        this.options.waypoints = t,
        this.trackLabelsLayer.setVisible(t),
        this.trackLayer.setVisible(t)
    }
    setColoredTrack(t) {
        this.options.coloredTrack = t,
        this.trackLineLayer.setStyle(t ? aa : la)
    }
    fitTrack() {
        let e = window.innerWidth >= 768 ? [50, 50, 50, 370] : [60, 20, 20, 20];
        const i = this.trackLines.getExtent();
        i[0] === -2003750834167605e-8 && i[2] === 2003750834167605e-8 ? this.map.getView().animate({
            zoom: 2,
            duration: 500
        }) : this.map.getView().fit(i, {
            duration: 500,
            padding: e
        })
    }
    addCurrentTrackPoint(t, e, i, n) {
        if (this.trackMarkersArr.length === 0)
            return;
        const r = this.currentTP.position;
        if (r[0] === t[0] && r[1] === t[1])
            return;
        const o = Jh(t);
        if (Ne(this.currentTP.point, o) >= na) {
            const l = bn(this.currentTP.sog)
              , h = bn(i);
            let c = new Zt([r, t]);
            this.trackLines.addFeature(new it({
                geometry: c,
                outofrange: !1,
                color0: l,
                color1: h
            }));
            const u = this.currentTP.ts
              , d = this.currentTP.ref
              , f = this.currentTP.cog
              , g = this.currentTP.sog;
            if (this.currentTP = {
                point: o,
                position: [t[0], t[1]],
                cog: e,
                sog: i,
                ts: n,
                ref: d
            },
            n - d < 300)
                return;
            const _ = this.nextId;
            let m = Ns(new Wt(r), f, g, u, _, _, null, null, 0);
            this.nextId += 1,
            this.trackMarkers.addFeature(m),
            this.trackMarkersArr.push(m);
            for (let p = 10; p <= 18; p++)
                this.trackMarkersCache[p].push(m);
            this.currentTP.ref = n
        }
    }
    clearTrack() {
        this.trackMMSI = -1,
        this.trackIsDrawn = !1,
        this.currentTP = null,
        this.trackMarkersArr = [],
        this.trackMarkersCache = {},
        this.trackZoom = 0,
        this.trackLines.clear(),
        this.pTrackLines.clear(),
        this.trackMarkers.clear(),
        this.trackLabels.clear(),
        this.selected_track_label_added = !1,
        this.pTrackLineLayer.setVisible(!1),
        this.trackLineLayer.setVisible(!1),
        this.trackLayer.setVisible(!1),
        this.trackLabelsLayer.setVisible(!1),
        this.fadeLayers(1),
        rt("predictedTrack", {
            active: !1
        }),
        rt("trackPanel", {
            active: !1
        })
    }
    redrawTrackLabel() {
        this.selected_track_label_added && (this.trackLabels.removeFeature(this.selected_track_label2),
        this.redrawTrackLabelInternal(),
        this.trackLabels.addFeature(this.selected_track_label2))
    }
    redrawTrackLabelInternal() {
        let t = this.selected_track_marker.get("cog")
          , e = this.selected_track_marker.get("sog")
          , i = this.selected_track_marker.get("nx");
        const r = Br(this.selected_track_marker.get("ts"), this.options.timeFormat, !0) + "  "
          , o = this.options.speedUnits
          , l = "Speed: " + ng(e, o, ig(o)) + " / " + sg(t);
        let h;
        const c = this.selected_track_marker.get("wsp")
          , u = this.selected_track_marker.get("wdir");
        c !== null && u !== null ? h = "Wind: " + rg(c, c * 1.94384, 1, " kn") + " / " + u + "°" : h = "Wind: n/a",
        this.selected_track_label2.set("line1", r),
        this.selected_track_label2.set("line2", l),
        this.selected_track_label2.set("line3", h),
        this.selected_track_label2.set("nx", i)
    }
    setFilter(t) {
        this.options.filter = t,
        this.UIT && this.clearPreflight(),
        this.refreshMap(),
        kn(this.options.fleetMode, this.options.filter, this.options.satVisible)
    }
    setTimeFormat(t) {
        this.options.timeFormat = t,
        this.redrawTrackLabel();
        const e = this.selectedShipMarker.get("nf");
        e !== null && (e.set("tf", t),
        this.shipNames.removeFeature(e),
        this.shipNames.addFeature(e))
    }
    refreshMap() {
        this.isRunning && this.getShipsOnMap()
    }
    refreshMapInFleetMode(t, e, i) {
        this.options.fleetMode = t,
        this.options.fleetGroups = e,
        this.options.fleetColor = i,
        t && this.satMarkers.clear(),
        this.refreshMap(),
        rt("updateCtxMnu", !0),
        kn(this.options.fleetMode, this.options.filter, this.options.satVisible)
    }
    getShipsOnMap() {
        /*
        if (!this.mapInitialized)
            return;
        let t = this.map.getView(), e = t.getZoom() | 0, i = t.calculateExtent(this.map.getSize()), r = Jt(t.getProjection(), "EPSG:4326")(i, []), o, a;
        e <= 3 && window.innerWidth > 1024 ? (a = "-107994000," + Math.floor(r[1] * 6e5) + ",107994000," + Math.floor(r[3] * 6e5),
        o = {
            bbox: a,
            zoom: e,
            mmsi: this.selectedMMSI
        }) : (a = [Math.floor(r[0] * 6e5), Math.floor(r[1] * 6e5), Math.floor(r[2] * 6e5), Math.floor(r[3] * 6e5)].join(","),
        o = {
            bbox: a,
            zoom: e,
            mmsi: this.selectedMMSI,
            ref: Math.random() * 99999
        }),
        this.options.filter < 511 && (o.filter = this.options.filter);
        let l = this.options.fleetMode;
        if (l === !0) {
            o.uid = 1,
            window.islg || (o.demo = 1);
            let c = this.options.fleetGroups;
            c != "" && typeof c < "u" && (o.groups = c),
            this.options.fleetColor && (o.ucm = 1)
        }
        this.mworker.postMessage({
            cmd: "sonm",
            fleet: l,
            params: $n(o),
            z: e
        });
        const h = this.options.mcb;
        if (h.p1) {
            const c = {
                bbox: a,
                zoom: e
            };
            o.ref !== void 0 && (c.ref = o.ref),
            o.filter !== void 0 && (c.filter = o.filter),
            this.options.satVisible && !l && this.mworker.postMessage({
                cmd: "sfl",
                params: $n(c),
                z: e,
                lonmin: r[0],
                lonmax: r[2]
            })
        } else
            setTimeout(()=>this.satMarkers.clear());
        e >= 10 && h.p2 && this.mworker.postMessage({
            cmd: "pwbb",
            latmin: r[1],
            latmax: r[3],
            lonmin: r[0],
            lonmax: r[2]
        })
        */
    }
    drawPortsWBB(t) {
        this.portMarkers.clear();
        let e = [];
        for (let i = 0, n = t.length; i < n; i++) {
            let r = t[i]
              , o = new Wt(Q([r.lon, r.lat], nt, J))
              , a = new it({
                geometry: o,
                t: 0,
                port_id: r.locode,
                pn: r.name,
                pc: r.country,
                st: r.status
            })
              , l = new it({
                geometry: o,
                text: r.name,
                t: 1,
                port_id: r.locode,
                st: r.status
            })
              , h = new it({
                geometry: o,
                text: r.country,
                t: 2,
                port_id: r.locode,
                st: r.status
            });
            e.push(a, l, h)
        }
        this.portMarkers.addFeatures(e)
    }
    drawSAT(t) {
        const e = t.map(i=>{
            const n = new Wt(Q([i.lon, i.lat], nt, J));
            return new it({
                geometry: n,
                tstamp: i.tstamp,
                selected: !1,
                old: i.isOLD,
                color: i.flags,
                iconNumber: i.iconNumber,
                size: 1,
                mty: 2
            })
        }
        );
        this.satMarkers.clear(!0),
        e.length > 0 && this.satMarkers.addFeatures(e)
    }
    drawShipsOnMapBinary(t, e) {
        let i = this.map.getView(), n, r, o = [], a = [], l = [], h, c, u, d, f, g, _, m, p, y, x, E, w, R = !1, T = this.options.fleetMode ? this.options.fleetNames : !1, L = this.options.names && e >= 7 || e > Fs;
        this.options.fleetMode && T && (L = !0);
        let v = L ? 1 : 0
          , b = e > mg
          , D = !1
          , O = t.byteLength
          , F = this.selectedMMSI
          , K = O >= 12 ? t.getInt8(2) : 0;
        if (K >= 8) {
            const M = t.getInt32(4)
              , I = this.options.mcb.p2
              , P = this.options.mcb.p3
              , X = this.options.mcb.p4;
            this.options.mcb = {
                p1: (M & 1) > 0,
                p2: (M & 2) > 0,
                p3: (M & 4) > 0,
                p4: (M & 8) > 0,
                emp1: !1,
                emp1z: 0,
                emp2: !1
            }
            /*
            ,
            I === !1 && this.options.mcb.p2 === !0 && mworker.postMessage({
                cmd: "pjson"
            });
            */
            let z = !1;
            P !== this.options.mcb.p3 && (this.reconfigP3(this.options.mcb.p3),
            z = !0);
            let q = zt;
            X !== this.options.mcb.p4 && (q = this.options.mcb.p4 ? 6 : zt,
            z = !0),
            z && setTimeout(()=>this.attachVTE(q)),
            F = t.getInt32(8)
        }
        let S = 4 + K;
        for (; S < O; ) {
            E = 0;
            let M = t.getInt16(S), I = (M & 240) >> 4, P = (M & 16128) >> 8, X = M & 49152, z;
            if (e > 6)
                switch (X) {
                case 49152:
                    z = 2;
                    break;
                case 32768:
                    z = 0;
                    break;
                default:
                    z = 1;
                    break
                }
            else
                z = 1;
            S += 2,
            u = t.getInt32(S),
            S += 4,
            D = u === F,
            f = t.getInt32(S) / Mn,
            S += 4,
            d = t.getInt32(S) / Mn,
            S += 4,
            y = new Wt(Q([d, f], nt, J)),
            D && (h = t.getInt16(S) / 10,
            S += 2,
            c = t.getInt16(S) / 10,
            S += 2,
            S += 2),
            w = t.getInt8(S),
            S += 1;
            let q = t.getInt8(S);
            if (S += 1,
            S + q > O)
                break;
            x = fg(t, S, q),
            S += q,
            x == "" && (x = u.toString()),
            D && (E = t.getInt32(S),
            S += 4);
            let C = 0;
            if (b && (g = t.getInt16(S),
            S += 2,
            _ = t.getInt16(S),
            S += 2,
            m = t.getInt16(S),
            S += 2,
            p = t.getInt16(S),
            S += 2,
            C = t.getInt16(S),
            S += 2,
            g + _ > 0 && m + p > 0 && g + _ <= 500 && m < 63 && p < 63)) {
                let ut;
                C >= 0 && C <= 360 ? ut = C : P < 32 ? ut = Math.floor(P * 11.25) : ut = -1,
                ut > -1 && a.push(Lg(f, d, g, _, m, p, ut, I))
            }
            let pt = M & 1
              , B = (M & 2) !== 0
              , V = 0;
            B && (b ? V = C : (V = t.getInt16(S),
            S += 2));
            const bt = u === this.selectedMMSI;
            v != 0 ? (r = new it({
                geometry: y,
                name: x,
                old: (M & 4) > 0,
                tstamp: E,
                td: w,
                tf: this.options.timeFormat,
                z: v,
                selected: bt || u === this.oldHoverMMSI
            }),
            l.push(r)) : r = null,
            n = new it({
                geometry: y,
                name: x,
                mmsi: u,
                cog: h,
                sog: c,
                tstamp: E,
                selected: bt,
                sar: B,
                old: pt,
                sar_alt: V,
                color: I,
                iconNumber: P,
                size: z,
                z: v,
                td: w,
                nf: r,
                sat: !1,
                mty: 1
            }),
            o.push(n),
            u === this.trackMMSI && this.trackIsDrawn && this.addCurrentTrackPoint(y.getCoordinates(), h, c, E),
            bt && (this.selectedShipMarker = n,
            R = !0)
        }
        if (this.markers.clear(!0),
        this.shipNames.clear(!0),
        this.shapes.clear(!0),
        this.extraMarkers.clear(!0),
        O === 4 && this.options.filter === 0 && this.clearPreflight(),
        this.markers.addFeatures(o),
        this.shipNames.addFeatures(l),
        this.shapes.addFeatures(a),
        R) {
            this.selectedShipMarker.set("subtitle", Gs(this.selectedShipMarker, this.options.timeFormat)),
            this.selectionMarker.setGeometry(this.selectedShipMarker.getGeometry()),
            this.extraMarkers.addFeature(this.selectedShipMarker),
            this.markers.addFeature(this.selectionMarker),
            this.selectionMarkerAdded = !0;
            let M = i.calculateExtent(this.map.getSize())
              , I = this.selectedShipMarker.getGeometry().getCoordinates()
              , P = he(M, I);
            rt("ship-in-view", {
                visible: P,
                zoom: e
            }),
            this.trackIsDrawn && this.trackZoom !== e && (this.trackZoom = e,
            this.simplifyTrack(this.trackZoom))
        } else
            this.selectionMarkerAdded = !1
    }
    reconfigP3(t) {
        let e, i, n, r;
        Fn && t ? (e = "bright@2x",
        n = "simple@2x",
        r = "dark@2x",
        i = 2) : (e = "bright",
        n = "simple",
        r = "dark",
        i = 1),
        this.vtebrightSource = new ii({
            attributions: vn,
            url: `//map.vesselfinder.net/${e}/{z}/{x}/{y}.png`,
            crossOrigin: null,
            maxZoom: 18,
            minZoom: 2,
            tilePixelRatio: i
        }),
        this.vteSimpleSource = new ii({
            attributions: vn,
            url: `//map.vesselfinder.net/${n}/{z}/{x}/{y}.png`,
            crossOrigin: null,
            maxZoom: 18,
            minZoom: 2,
            tilePixelRatio: i
        }),
        this.vteDarkSource = new ii({
            attributions: vn,
            url: `//map.vesselfinder.net/${r}/{z}/{x}/{y}.png`,
            crossOrigin: null,
            maxZoom: 18,
            minZoom: 2,
            tilePixelRatio: i
        })
    }
    reconfigAnchorageZones() {
        const t = Fn ? "@2x" : "";
        this.anchorageZonesSource = new ii({
            attributions: null,
            url: `//map.vesselfinder.net/seamarks${t}/{z}/{x}/{y}.png?ver=1.1a`,
            crossOrigin: null,
            maxZoom: 18,
            minZoom: 8,
            tilePixelRatio: Fn ? 2 : 1
        }),
        this.anchorageZonesLayer = new Rn({
            className: "LAYERS",
            zIndex: 5,
            source: this.anchorageZonesSource
        })
    }
    attachAnchorageZones() {
        this.anchoragesAttached || zt === 3 || zt === 4 || (this.anchorageZonesSource === null && this.anchorageZonesLayer === null && this.reconfigAnchorageZones(),
        this.anchorageZonesLayer.set("maxResolution", this.map.getView().getResolutionForZoom(8) + 1),
        this.map.getLayers().insertAt(1, this.anchorageZonesLayer),
        this.anchoragesAttached = !0)
    }
    detachAnchorageZones() {
        this.anchoragesAttached && (this.map.getLayers().remove(this.anchorageZonesLayer),
        this.anchoragesAttached = !1)
    }
    toggleAnchorageZones(t) {
        this.options.anchorage_zones = t,
        t ? this.attachAnchorageZones() : this.detachAnchorageZones()
    }
    mustShowShip(t, e) {
        /*
        e ? _lsreq_ = 0 : _lsreq_ = 1,
        this.mworker.postMessage({
            cmd: "ml",
            mmsi: t
        }),
        this.selectedMMSI > 0 && this.selectedMMSI !== t && this.trackIsDrawn && this.clearTrack()
        */
    }
    MLHA(t) {
        t.success ? this.locateShip2(t.mmsi, t.lat / Mn, t.lon / Mn, t.sog, t.sar, t.d) : (setTimeout(()=>Qo(Ce("Ship location unknown"), 2e3)),
        _lsreq_ = 0,
        setTimeout(()=>{
            let e = Q([0, 30], nt, J)
              , i = this.map.getView();
            i.setCenter(e),
            i.setZoom(3),
            this.mapInitialized = !0,
            this.getShipsOnMap()
        }
        , 350))
    }
    locateShip2(t, e, i, n, r, o) {
        let a = this.map.getView();
        this.selectedMMSI = t;
        let l = Q([i, e], nt, J)
          , h = -1
          , c = !1;
        if (r)
            h = 17 - Math.floor(n / 30);
        else {
            const u = t === MMSI && this.options.mcb.emp1 && this.options.mcb.emp1z >= 3 && _lsreq_ === 1;
            u && (o = 0),
            o && o > 0 ? (h = vg(this.map, l, o),
            c = !0) : u ? (h = this.options.mcb.emp1z,
            a.setCenter(l),
            a.setZoom(h),
            c = !0) : h = Math.floor(n) < 2 ? 14 : 10
        }
        this.firstMapMove = !0,
        this.mapInitialized = !0,
        c || (h < 9 && (h = 9),
        h > 17 && (h = 17),
        a.setCenter(l),
        a.setZoom(h)),
        h > 0 && h <= ia && (this.RMLayer.setVisible(!1),
        this.RMVisible = !1),
        this.getShipsOnMap()
    }
    createPreflightLabelsStyle() {
        return function(t) {
            let e = t.get("type"), i, n;
            if (e == 2 ? (i = Ol,
            n = t.get("sat") ? "#084" : "#000") : e == 3 && (i = sa,
            n = "#000",
            e = 2),
            e == 1)
                return new H({
                    image: new Ht({
                        anchor: [17, 17],
                        anchorXUnits: "pixels",
                        anchorYUnits: "pixels",
                        offset: [0, 0],
                        size: [33, 33],
                        imgSize: [33, 33],
                        src: Vt + "/pmarker3.svg"
                    }),
                    zIndex: 19990
                });
            if (e == 2)
                return Yl(t, i, n)
        }
    }
    createTrackLabelsStyle() {
        return function(t, e) {
            if (e >= 9e3)
                return [];
            let i = "rgba(37, 72, 129, 0.9)"
              , n = "rgba(37, 72, 129, 0.4)";
            const r = t.get("line1")
              , o = t.get("line2")
              , a = t.get("line3");
            return [new H({
                text: new _t({
                    font: Le,
                    text: r,
                    fill: Ds,
                    textAlign: "left",
                    offsetX: 24,
                    offsetY: 2
                }),
                zIndex: 20003
            }), new H({
                text: new _t({
                    font: Le,
                    text: o,
                    fill: Ds,
                    textAlign: "left",
                    offsetX: 24,
                    offsetY: 18,
                    backgroundFill: new at({
                        color: i
                    }),
                    backgroundStroke: new It({
                        width: 1,
                        color: n
                    }),
                    padding: [20, 8, 19, 6]
                }),
                zIndex: 20002
            }), new H({
                text: new _t({
                    font: Le,
                    text: a,
                    fill: Ds,
                    textAlign: "left",
                    offsetX: 24,
                    offsetY: 34
                }),
                zIndex: 20003
            })]
        }
    }
    createPortMarkerStyle(t, e) {
        if (e > 160)
            return [];
        let i = t.get("t");
        const n = zt === 5 || zt === 7
          , r = n ? new at({
            color: "#EAEAEA"
        }) : new at({
            color: "#000"
        })
          , o = n ? new It({
            color: "#222"
        }) : new It({
            color: "#fff"
        });
        if (i == 0) {
            let a = t.get("st");
            return new H({
                image: new Ht({
                    anchor: Dl,
                    anchorXUnits: "pixels",
                    anchorYUnits: "pixels",
                    offset: [0, 0],
                    size: Fl,
                    scale: Hi,
                    src: a == 1 ? Wl : Xl
                }),
                zIndex: 19990
            })
        } else if (this.options.names || e <= 10) {
            if (i == 1)
                return new H({
                    text: new _t({
                        font: sa,
                        text: t.get("text"),
                        fill: r,
                        stroke: o,
                        textAlign: "left",
                        offsetX: 15,
                        offsetY: -4
                    }),
                    zIndex: 19990
                });
            if (i == 2)
                return new H({
                    text: new _t({
                        font: Le,
                        text: t.get("text"),
                        fill: r,
                        stroke: o,
                        textAlign: "left",
                        offsetX: 15,
                        offsetY: 8
                    }),
                    zIndex: 19990
                })
        } else
            return []
    }
    getPlaceBox() {
        let t = this.map.getView()
          , e = t.calculateExtent(this.map.getSize())
          , i = Mi(e, J, nt);
        return {
            lonmin: i[0],
            latmin: i[1],
            lonmax: i[2],
            latmax: i[3],
            zoom: t.getZoom() | 0
        }
    }
    onPortLocation(t) {
        let e = this.map.getView();
        e.setCenter(Q([t.lon, t.lat], nt, J)),
        e.setZoom(14),
        this.run() || this.getShipsOnMap()
    }
    centerToShip(t, e) {
        if (this.selectedMMSI === 0)
            this.mustShowShip(t, !1);
        else {
            let i = this.map.getView()
              , n = i.getZoom()
              , r = n > 10 ? n - 4 : n
              , o = this.selectedShipMarker.getGeometry().getCoordinates();
            i.setZoom(r),
            i.setCenter(o),
            setTimeout(()=>{
                i.animate({
                    zoom: e > 6 ? e - 2 : e
                })
            }
            )
        }
    }
    positionToPort(t) {
        /*
        this.mworker.postMessage({
            cmd: "ploc",
            id: t
        })
        */
    }
    positionToPlace(t) {
        const {lonmin: e, latmin: i, lonmax: n, latmax: r, zoom: o, title: a} = t;
        let l = [e, i, n, r]
          , h = this.map.getView()
          , c = Mi(l, nt, J);
        h.fit(c, this.map.getSize()),
        h.setZoom(o),
        setTimeout(()=>Qo(a, 2e3))
    }
    getMapSize() {
        const t = this.map.getSize()
          , e = Mi(this.map.getView().calculateExtent(t), J, nt);
        return {
            mapSize: t,
            extent: e
        }
    }
}
const pa = ()=>({
    1: !1,
    2: !0,
    3: !0,
    4: !0,
    5: !1,
    6: !1,
    7: !0,
    8: !0,
    9: !1,
    10: !0,
    11: !1,
    12: !0
});
function Og() {
    const s = localStorage.getItem("settings-map-other");
    let t;
    return s !== null ? t = {
        ...pa(),
        ...JSON.parse(s)
    } : t = pa(),
    t[5] = !1,
    t[11] = !1,
    t[12] = !0,
    t
}
function Fg() {
    const s = Zr(localStorage.getItem("su")) || 1;
    return s < 1 || s > 3 ? 1 : s
}
function Dg() {
    const s = Zr(localStorage.getItem("du")) || 1;
    return s < 1 || s > 3 ? 1 : s
}
function Ng() {
    const s = localStorage.getItem("vf-other");
    let t = {};
    s !== null && (t = JSON.parse(s));
    const e = t.mst;
    return (!e || e === 3 || e === 4 || e === 2 || e === 5) && (t = {
        mst: 1
    },
    localStorage.setItem("vf-other", JSON.stringify(t))),
    localStorage.setItem("mst", t.mst),
    t.mst
}
function Gg() {
    localStorage.removeItem("settings-map-filter");
    let s = Zr(localStorage.getItem("af2ty"));
    return s === 0 && (s = 511,
    localStorage.setItem("af2ty", s)),
    s
}
function zg(s) {
    if (window.innerWidth > 1024 || window.innerHeight > 1024) {
        const t = window.IS_BETA ? "" : window.mapext2Ver;
        On(`/mapext/mapext2.2e${t}.js`, ()=>{
            window.__ctxmnu.create(s)
        }
        )
    } else
        window.__ctxmnu = {
            initialized: ()=>!1,
            isOpen: ()=>!1
        }
}
function Wg() {
    const s = window.mworker
      , t = Og()
      , e = t[3]
      , i = Fg()
      , n = Dg()
      , r = Ng()
      , o = Gg();
    let a = typeof window.GMCB < "u" ? window.GMCB : {
        p1: !0,
        p2: !0,
        p3: !0,
        p4: !1,
        emp1: !1,
        emp1z: 0,
        emp2: !1
    };
    const l = {
        names: t[1] ? 1 : 0,
        fleetNames: t[2],
        filter: o,
        timeFormat: e,
        speedUnits: i,
        distanceUnits: n,
        satVisible: t[4],
        fleetMode: !1,
        fleetColor: !1,
        eca_zones: t[5],
        anchorage_zones: t[10],
        graticule: t[6],
        routePrediction: t[7],
        ports: t[8],
        autoFitTrack: t[9],
        mst: r,
        waypoints: !0,
        coloredTrack: !1,
        mcb: {
            p1: a.p1,
            p2: a.p2,
            p3: a.p3,
            p4: a.p4,
            emp1: a.emp1,
            emp1z: a.emp1z,
            emp2: a.emp2,
            p_lat: a.p_lat || 0,
            p_lon: a.p_lon || 0,
            emp2z: a.emp2z || 0
        }
    };
    /*
    window.islg && mworker.postMessage({
        cmd: "init"
    }),
    l.mcb.p2 ? s.postMessage({
        cmd: "pjson"
    }) : s.postMessage({
        cmd: "fpjson"
    });
    */
    const h = new Ag("map",s,l);
    window.vfmap = h,
    s.addEventListener("message", c=>{
        const u = c.data;
        switch (u.cmd) {
        case "sonmr":
            h.drawShipsOnMapBinary(new DataView(u.bin), u.z);
            break;
        case "sflr":
            h.drawSAT(u.bin);
            break;
        case "mlr":
            h.MLHA(u.loc);
            break;
        case "plocr":
            h.onPortLocation(u.port);
            break;
        case "pwbbr":
            h.drawPortsWBB(u.list);
            break;
        case "rmr":
            h.rivermarksPortion(u.marks);
            break;
        case "mtr":
            h.drawTrackW(u.list, u.mmsi);
            break;
        case "mte":
            h.showTrack();
            break
        }
    }
    ),
    h.run(),
    zg(h)
}
Wg();
function styleInject(css, ref) {
    if (ref === void 0) {
        ref = {}
    }
    var insertAt = ref.insertAt;
    if (!css || typeof document === "undefined") {
        return
    }
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    if (insertAt === "top") {
        if (head.firstChild) {
            head.insertBefore(style, head.firstChild)
        } else {
            head.appendChild(style)
        }
    } else {
        head.appendChild(style)
    }
    if (style.styleSheet) {
        style.styleSheet.cssText = css
    } else {
        style.appendChild(document.createTextNode(css))
    }
}
;styleInject(``);
