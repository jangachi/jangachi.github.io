(() => {
  // <stdin>
  var Wave = class {
    #color;
    #direction;
    #points = [];
    constructor(color, direction) {
      this.#color = color;
      this.#direction = direction;
    }
    build(width, points) {
      this.#points = [];
      for (var index = 0; index <= points + 2; ++index) {
        var temp = [(index - 1) * width / points, 0, Math.random() * 300, 0.2];
        this.#points.push(temp);
      }
    }
    bounce(canvas) {
      var bounceInternal = (canvas2, points) => {
        points[1] = canvas2.height / 2 * Math.sin(points[2] / 20) + canvas2.height / 2;
        points[2] = points[2] + points[3];
      };
      for (var index = 0; index < this.#points.length; ++index) {
        bounceInternal(canvas, this.#points[index]);
      }
    }
    draw(canvas, context) {
      var calcCenterInternal = (a, b) => {
        return (b - a) / 2 + a;
      };
      context.fillStyle = this.#color;
      context.beginPath();
      context.moveTo(0, canvas.height);
      context.lineTo(this.#points[0][0], this.#points[0][1]);
      for (var index = 0; index < this.#points.length; ++index) {
        if (this.#points[index + 1]) {
          context.quadraticCurveTo(
            this.#points[index][0],
            this.#points[index][1],
            calcCenterInternal(this.#points[index][0], this.#points[index + 1][0]),
            calcCenterInternal(this.#points[index][1], this.#points[index + 1][1])
          );
        } else {
          context.lineTo(
            this.#points[index][0],
            this.#points[index][1] * this.#direction
          );
          context.lineTo(
            canvas.width * this.#direction,
            canvas.height * this.#direction
          );
        }
      }
      context.closePath();
      context.fill();
    }
  };
  function setup_wave(className, height, colors2, count, direction, opacity) {
    "use strict";
    let waves = [];
    let elementStyle;
    let canvas;
    let context;
    for (var index = 0; index < count; ++index) {
      waves.push(new Wave(colors2[index], direction));
    }
    function onLoaded() {
      elementStyle = window.getComputedStyle(document.querySelector(".sky"), null);
      canvas = document.getElementById(className);
      canvas.style.opacity = opacity;
      context = canvas.getContext("2d");
      onResized();
      onAnimate();
    }
    function onResized() {
      canvas.width = window.innerWidth;
      canvas.height = height;
      canvas.style.height = height;
      waves.forEach((wave) => {
        wave.build(canvas.width, 6);
      });
    }
    function onAnimate() {
      var clearColor = elementStyle.getPropertyValue("background-color");
      context.fillStyle = clearColor;
      context.globalCompositeOperation = "source-over";
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < waves.length; i++) {
        waves[i].bounce(canvas);
        waves[i].draw(canvas, context);
      }
      context.fillStyle = clearColor;
      requestAnimationFrame(onAnimate);
    }
    window.addEventListener("resize", onResized, false);
    document.addEventListener("DOMContentLoaded", onLoaded, false);
  }
  var colors = ["#404040", "#303030", "#202020"];
  setup_wave("canvas-up", 60, colors, 3, 1, 1);
  setup_wave("canvas-dn", 60, colors, 3, -1, 0);
})();
