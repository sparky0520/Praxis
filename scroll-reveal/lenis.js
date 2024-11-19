var k = "1.1.16";
function w(r, t, e) {
  return Math.max(r, Math.min(t, e));
}
function W(r, t, e) {
  return (1 - e) * r + e * t;
}
function z(r, t, e, i) {
  return W(r, t, 1 - Math.exp(-e * i));
}
function x(r, t) {
  return ((r % t) + t) % t;
}
var y = class {
  isRunning = !1;
  value = 0;
  from = 0;
  to = 0;
  currentTime = 0;
  lerp;
  duration;
  easing;
  onUpdate;
  advance(t) {
    if (!this.isRunning) return;
    let e = !1;
    if (this.duration && this.easing) {
      this.currentTime += t;
      let i = w(0, this.currentTime / this.duration, 1);
      e = i >= 1;
      let s = e ? 1 : this.easing(i);
      this.value = this.from + (this.to - this.from) * s;
    } else
      this.lerp
        ? ((this.value = z(this.value, this.to, this.lerp * 60, t)),
          Math.round(this.value) === this.to &&
            ((this.value = this.to), (e = !0)))
        : ((this.value = this.to), (e = !0));
    e && this.stop(), this.onUpdate?.(this.value, e);
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(t, e, { lerp: i, duration: s, easing: o, onStart: l, onUpdate: m }) {
    (this.from = this.value = t),
      (this.to = e),
      (this.lerp = i),
      (this.duration = s),
      (this.easing = o),
      (this.currentTime = 0),
      (this.isRunning = !0),
      l?.(),
      (this.onUpdate = m);
  }
};
function R(r, t) {
  let e;
  return function (...i) {
    let s = this;
    clearTimeout(e),
      (e = setTimeout(() => {
        (e = void 0), r.apply(s, i);
      }, t));
  };
}
var E = class {
  constructor(t, e, { autoResize: i = !0, debounce: s = 250 } = {}) {
    this.wrapper = t;
    this.content = e;
    i &&
      ((this.debouncedResize = R(this.resize, s)),
      this.wrapper instanceof Window
        ? window.addEventListener("resize", this.debouncedResize, !1)
        : ((this.wrapperResizeObserver = new ResizeObserver(
            this.debouncedResize
          )),
          this.wrapperResizeObserver.observe(this.wrapper)),
      (this.contentResizeObserver = new ResizeObserver(this.debouncedResize)),
      this.contentResizeObserver.observe(this.content)),
      this.resize();
  }
  width = 0;
  height = 0;
  scrollHeight = 0;
  scrollWidth = 0;
  debouncedResize;
  wrapperResizeObserver;
  contentResizeObserver;
  destroy() {
    this.wrapperResizeObserver?.disconnect(),
      this.contentResizeObserver?.disconnect(),
      this.wrapper === window &&
        this.debouncedResize &&
        window.removeEventListener("resize", this.debouncedResize, !1);
  }
  resize = () => {
    this.onWrapperResize(), this.onContentResize();
  };
  onWrapperResize = () => {
    this.wrapper instanceof Window
      ? ((this.width = window.innerWidth), (this.height = window.innerHeight))
      : ((this.width = this.wrapper.clientWidth),
        (this.height = this.wrapper.clientHeight));
  };
  onContentResize = () => {
    this.wrapper instanceof Window
      ? ((this.scrollHeight = this.content.scrollHeight),
        (this.scrollWidth = this.content.scrollWidth))
      : ((this.scrollHeight = this.wrapper.scrollHeight),
        (this.scrollWidth = this.wrapper.scrollWidth));
  };
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height,
    };
  }
};
var g = class {
  events = {};
  emit(t, ...e) {
    let i = this.events[t] || [];
    for (let s = 0, o = i.length; s < o; s++) i[s]?.(...e);
  }
  on(t, e) {
    return (
      this.events[t]?.push(e) || (this.events[t] = [e]),
      () => {
        this.events[t] = this.events[t]?.filter((i) => e !== i);
      }
    );
  }
  off(t, e) {
    this.events[t] = this.events[t]?.filter((i) => e !== i);
  }
  destroy() {
    this.events = {};
  }
};
var _ = 100 / 6,
  p = { passive: !1 },
  T = class {
    constructor(t, e = { wheelMultiplier: 1, touchMultiplier: 1 }) {
      this.element = t;
      this.options = e;
      window.addEventListener("resize", this.onWindowResize, !1),
        this.onWindowResize(),
        this.element.addEventListener("wheel", this.onWheel, p),
        this.element.addEventListener("touchstart", this.onTouchStart, p),
        this.element.addEventListener("touchmove", this.onTouchMove, p),
        this.element.addEventListener("touchend", this.onTouchEnd, p);
    }
    touchStart = { x: 0, y: 0 };
    lastDelta = { x: 0, y: 0 };
    window = { width: 0, height: 0 };
    emitter = new g();
    on(t, e) {
      return this.emitter.on(t, e);
    }
    destroy() {
      this.emitter.destroy(),
        window.removeEventListener("resize", this.onWindowResize, !1),
        this.element.removeEventListener("wheel", this.onWheel, p),
        this.element.removeEventListener("touchstart", this.onTouchStart, p),
        this.element.removeEventListener("touchmove", this.onTouchMove, p),
        this.element.removeEventListener("touchend", this.onTouchEnd, p);
    }
    onTouchStart = (t) => {
      let { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t;
      (this.touchStart.x = e),
        (this.touchStart.y = i),
        (this.lastDelta = { x: 0, y: 0 }),
        this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t });
    };
    onTouchMove = (t) => {
      let { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t,
        s = -(e - this.touchStart.x) * this.options.touchMultiplier,
        o = -(i - this.touchStart.y) * this.options.touchMultiplier;
      (this.touchStart.x = e),
        (this.touchStart.y = i),
        (this.lastDelta = { x: s, y: o }),
        this.emitter.emit("scroll", { deltaX: s, deltaY: o, event: t });
    };
    onTouchEnd = (t) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event: t,
      });
    };
    onWheel = (t) => {
      let { deltaX: e, deltaY: i, deltaMode: s } = t,
        o = s === 1 ? _ : s === 2 ? this.window.width : 1,
        l = s === 1 ? _ : s === 2 ? this.window.height : 1;
      (e *= o),
        (i *= l),
        (e *= this.options.wheelMultiplier),
        (i *= this.options.wheelMultiplier),
        this.emitter.emit("scroll", { deltaX: e, deltaY: i, event: t });
    };
    onWindowResize = () => {
      this.window = { width: window.innerWidth, height: window.innerHeight };
    };
  };
var L = class {
  _isScrolling = !1;
  _isStopped = !1;
  _isLocked = !1;
  _preventNextNativeScrollEvent = !1;
  _resetVelocityTimeout = null;
  __rafID = null;
  isTouching;
  time = 0;
  userData = {};
  lastVelocity = 0;
  velocity = 0;
  direction = 0;
  options;
  targetScroll;
  animatedScroll;
  animate = new y();
  emitter = new g();
  dimensions;
  virtualScroll;
  constructor({
    wrapper: t = window,
    content: e = document.documentElement,
    eventsTarget: i = t,
    smoothWheel: s = !0,
    syncTouch: o = !1,
    syncTouchLerp: l = 0.075,
    touchInertiaMultiplier: m = 35,
    duration: v,
    easing: u = (H) => Math.min(1, 1.001 - Math.pow(2, -10 * H)),
    lerp: h = 0.1,
    infinite: c = !1,
    orientation: b = "vertical",
    gestureOrientation: n = "vertical",
    touchMultiplier: a = 1,
    wheelMultiplier: f = 1,
    autoResize: S = !0,
    prevent: d,
    virtualScroll: N,
    overscroll: M = !0,
    autoRaf: O = !1,
    __experimental__naiveDimensions: D = !1,
  } = {}) {
    (window.lenisVersion = k),
      (!t || t === document.documentElement || t === document.body) &&
        (t = window),
      (this.options = {
        wrapper: t,
        content: e,
        eventsTarget: i,
        smoothWheel: s,
        syncTouch: o,
        syncTouchLerp: l,
        touchInertiaMultiplier: m,
        duration: v,
        easing: u,
        lerp: h,
        infinite: c,
        gestureOrientation: n,
        orientation: b,
        touchMultiplier: a,
        wheelMultiplier: f,
        autoResize: S,
        prevent: d,
        virtualScroll: N,
        overscroll: M,
        autoRaf: O,
        __experimental__naiveDimensions: D,
      }),
      (this.dimensions = new E(t, e, { autoResize: S })),
      this.updateClassName(),
      (this.targetScroll = this.animatedScroll = this.actualScroll),
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1),
      this.options.wrapper.addEventListener(
        "pointerdown",
        this.onPointerDown,
        !1
      ),
      (this.virtualScroll = new T(i, {
        touchMultiplier: a,
        wheelMultiplier: f,
      })),
      this.virtualScroll.on("scroll", this.onVirtualScroll),
      this.options.autoRaf && (this.__rafID = requestAnimationFrame(this.raf));
  }
  destroy() {
    this.emitter.destroy(),
      this.options.wrapper.removeEventListener(
        "scroll",
        this.onNativeScroll,
        !1
      ),
      this.options.wrapper.removeEventListener(
        "pointerdown",
        this.onPointerDown,
        !1
      ),
      this.virtualScroll.destroy(),
      this.dimensions.destroy(),
      this.cleanUpClassName(),
      this.__rafID && cancelAnimationFrame(this.__rafID);
  }
  on(t, e) {
    return this.emitter.on(t, e);
  }
  off(t, e) {
    return this.emitter.off(t, e);
  }
  setScroll(t) {
    this.isHorizontal
      ? (this.rootElement.scrollLeft = t)
      : (this.rootElement.scrollTop = t);
  }
  onPointerDown = (t) => {
    t.button === 1 && this.reset();
  };
  onVirtualScroll = (t) => {
    if (
      typeof this.options.virtualScroll == "function" &&
      this.options.virtualScroll(t) === !1
    )
      return;
    let { deltaX: e, deltaY: i, event: s } = t;
    if (
      (this.emitter.emit("virtual-scroll", { deltaX: e, deltaY: i, event: s }),
      s.ctrlKey || s.lenisStopPropagation)
    )
      return;
    let o = s.type.includes("touch"),
      l = s.type.includes("wheel");
    if (
      ((this.isTouching = s.type === "touchstart" || s.type === "touchmove"),
      this.options.syncTouch &&
        o &&
        s.type === "touchstart" &&
        !this.isStopped &&
        !this.isLocked)
    ) {
      this.reset();
      return;
    }
    let v = e === 0 && i === 0,
      u =
        (this.options.gestureOrientation === "vertical" && i === 0) ||
        (this.options.gestureOrientation === "horizontal" && e === 0);
    if (v || u) return;
    let h = s.composedPath();
    h = h.slice(0, h.indexOf(this.rootElement));
    let c = this.options.prevent;
    if (
      h.find(
        (d) =>
          d instanceof HTMLElement &&
          ((typeof c == "function" && c?.(d)) ||
            d.hasAttribute?.("data-lenis-prevent") ||
            (o && d.hasAttribute?.("data-lenis-prevent-touch")) ||
            (l && d.hasAttribute?.("data-lenis-prevent-wheel")))
      )
    )
      return;
    if (this.isStopped || this.isLocked) {
      s.preventDefault();
      return;
    }
    if (!((this.options.syncTouch && o) || (this.options.smoothWheel && l))) {
      (this.isScrolling = "native"),
        this.animate.stop(),
        (s.lenisStopPropagation = !0);
      return;
    }
    let n = i;
    this.options.gestureOrientation === "both"
      ? (n = Math.abs(i) > Math.abs(e) ? i : e)
      : this.options.gestureOrientation === "horizontal" && (n = e),
      (!this.options.overscroll ||
        this.options.infinite ||
        (this.options.wrapper !== window &&
          ((this.animatedScroll > 0 && this.animatedScroll < this.limit) ||
            (this.animatedScroll === 0 && i > 0) ||
            (this.animatedScroll === this.limit && i < 0)))) &&
        (s.lenisStopPropagation = !0),
      s.preventDefault();
    let a = o && this.options.syncTouch,
      S = o && s.type === "touchend" && Math.abs(n) > 5;
    S && (n = this.velocity * this.options.touchInertiaMultiplier),
      this.scrollTo(this.targetScroll + n, {
        programmatic: !1,
        ...(a
          ? { lerp: S ? this.options.syncTouchLerp : 1 }
          : {
              lerp: this.options.lerp,
              duration: this.options.duration,
              easing: this.options.easing,
            }),
      });
  };
  resize() {
    this.dimensions.resize(),
      (this.animatedScroll = this.targetScroll = this.actualScroll),
      this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  onNativeScroll = () => {
    if (
      (this._resetVelocityTimeout !== null &&
        (clearTimeout(this._resetVelocityTimeout),
        (this._resetVelocityTimeout = null)),
      this._preventNextNativeScrollEvent)
    ) {
      this._preventNextNativeScrollEvent = !1;
      return;
    }
    if (this.isScrolling === !1 || this.isScrolling === "native") {
      let t = this.animatedScroll;
      (this.animatedScroll = this.targetScroll = this.actualScroll),
        (this.lastVelocity = this.velocity),
        (this.velocity = this.animatedScroll - t),
        (this.direction = Math.sign(this.animatedScroll - t)),
        (this.isScrolling = "native"),
        this.emit(),
        this.velocity !== 0 &&
          (this._resetVelocityTimeout = setTimeout(() => {
            (this.lastVelocity = this.velocity),
              (this.velocity = 0),
              (this.isScrolling = !1),
              this.emit();
          }, 400));
    }
  };
  reset() {
    (this.isLocked = !1),
      (this.isScrolling = !1),
      (this.animatedScroll = this.targetScroll = this.actualScroll),
      (this.lastVelocity = this.velocity = 0),
      this.animate.stop();
  }
  start() {
    this.isStopped && ((this.isStopped = !1), this.reset());
  }
  stop() {
    this.isStopped ||
      ((this.isStopped = !0), this.animate.stop(), this.reset());
  }
  raf = (t) => {
    let e = t - (this.time || t);
    (this.time = t),
      this.animate.advance(e * 0.001),
      this.options.autoRaf && (this.__rafID = requestAnimationFrame(this.raf));
  };
  scrollTo(
    t,
    {
      offset: e = 0,
      immediate: i = !1,
      lock: s = !1,
      duration: o = this.options.duration,
      easing: l = this.options.easing,
      lerp: m = this.options.lerp,
      onStart: v,
      onComplete: u,
      force: h = !1,
      programmatic: c = !0,
      userData: b,
    } = {}
  ) {
    if (!((this.isStopped || this.isLocked) && !h)) {
      if (typeof t == "string" && ["top", "left", "start"].includes(t)) t = 0;
      else if (typeof t == "string" && ["bottom", "right", "end"].includes(t))
        t = this.limit;
      else {
        let n;
        if (
          (typeof t == "string"
            ? (n = document.querySelector(t))
            : t instanceof HTMLElement && t?.nodeType && (n = t),
          n)
        ) {
          if (this.options.wrapper !== window) {
            let f = this.rootElement.getBoundingClientRect();
            e -= this.isHorizontal ? f.left : f.top;
          }
          let a = n.getBoundingClientRect();
          t = (this.isHorizontal ? a.left : a.top) + this.animatedScroll;
        }
      }
      if (typeof t == "number") {
        if (
          ((t += e),
          (t = Math.round(t)),
          this.options.infinite
            ? c && (this.targetScroll = this.animatedScroll = this.scroll)
            : (t = w(0, t, this.limit)),
          t === this.targetScroll)
        ) {
          v?.(this), u?.(this);
          return;
        }
        if (((this.userData = b ?? {}), i)) {
          (this.animatedScroll = this.targetScroll = t),
            this.setScroll(this.scroll),
            this.reset(),
            this.preventNextNativeScrollEvent(),
            this.emit(),
            u?.(this),
            (this.userData = {});
          return;
        }
        c || (this.targetScroll = t),
          this.animate.fromTo(this.animatedScroll, t, {
            duration: o,
            easing: l,
            lerp: m,
            onStart: () => {
              s && (this.isLocked = !0),
                (this.isScrolling = "smooth"),
                v?.(this);
            },
            onUpdate: (n, a) => {
              (this.isScrolling = "smooth"),
                (this.lastVelocity = this.velocity),
                (this.velocity = n - this.animatedScroll),
                (this.direction = Math.sign(this.velocity)),
                (this.animatedScroll = n),
                this.setScroll(this.scroll),
                c && (this.targetScroll = n),
                a || this.emit(),
                a &&
                  (this.reset(),
                  this.emit(),
                  u?.(this),
                  (this.userData = {}),
                  this.preventNextNativeScrollEvent());
            },
          });
      }
    }
  }
  preventNextNativeScrollEvent() {
    (this._preventNextNativeScrollEvent = !0),
      requestAnimationFrame(() => {
        this._preventNextNativeScrollEvent = !1;
      });
  }
  get rootElement() {
    return this.options.wrapper === window
      ? document.documentElement
      : this.options.wrapper;
  }
  get limit() {
    return this.options.__experimental__naiveDimensions
      ? this.isHorizontal
        ? this.rootElement.scrollWidth - this.rootElement.clientWidth
        : this.rootElement.scrollHeight - this.rootElement.clientHeight
      : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  get actualScroll() {
    return this.isHorizontal
      ? this.rootElement.scrollLeft
      : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite
      ? x(this.animatedScroll, this.limit)
      : this.animatedScroll;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(t) {
    this._isScrolling !== t &&
      ((this._isScrolling = t), this.updateClassName());
  }
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(t) {
    this._isStopped !== t && ((this._isStopped = t), this.updateClassName());
  }
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(t) {
    this._isLocked !== t && ((this._isLocked = t), this.updateClassName());
  }
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  get className() {
    let t = "lenis";
    return (
      this.isStopped && (t += " lenis-stopped"),
      this.isLocked && (t += " lenis-locked"),
      this.isScrolling && (t += " lenis-scrolling"),
      this.isScrolling === "smooth" && (t += " lenis-smooth"),
      t
    );
  }
  updateClassName() {
    this.cleanUpClassName(),
      (this.rootElement.className =
        `${this.rootElement.className} ${this.className}`.trim());
  }
  cleanUpClassName() {
    this.rootElement.className = this.rootElement.className
      .replace(/lenis(-\w+)?/g, "")
      .trim();
  }
};
globalThis.Lenis = L;
//# sourceMappingURL=lenis.min.js.map
