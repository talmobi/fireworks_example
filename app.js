console.clear();
setTimeout(
  (function () {
    var appEl = document.getElementById('app');
    var canvasEl = document.createElement('canvas');

    appEl.appendChild(canvasEl);

    var w = 400;
    var h = (w * 9 / 16) | 0;

    canvasEl.width = w;
    canvasEl.height = h;
    var ctx = canvasEl.getContext('2d');

    var GLOBALS = {
      width: w,
      height: h,
      gravity: 0.1,
      friction: 0.99,
    };

    var entities = [];

    function Particle (position, speed) {
      this.position = position || { x: 0, y: 0 };
      this.speed = speed || { x: 0, y: 0 };
      this.removed = false;

      this.tick = function () {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        this.speed.y += GLOBALS.gravity;

        this.speed.x *= GLOBALS.friction;

        if (this.position.y > GLOBALS.height) {
          this.removed = true;
        }

        this.onRemoved = function () {
          // do nothing
        };
      };
    };

    function Firework (position, speed) {
      this.position = position || { x: 0, y: 0 };
      this.speed = speed || { x: 0, y: 0 };
      this.removed = false;

      this.tick = function () {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        this.speed.y += GLOBALS.gravity;

        this.speed.x *= GLOBALS.friction;

        if (this.speed.y >= 1) {
          this.removed = true;
        }

        this.onRemoved = function () {
          // spawn particles on removed
          for (var i = 0; i < 40; i++) {
            var pos = {
              x: this.position.x,
              y: this.position.y
            };
            var spd = {
              x: Math.random() * 4 - 2 + this.speed.x / 2,
              y: Math.random() * 4 - 3.5 + this.speed.y / 2
            };
            var p = new Particle(pos, spd);
            entities.push(p);
          };
        };
      };
    };

    var FPS = 60;
    var MS_PER_FRAME = 1000 / FPS;

    function shootFirework() {
      var f = new Firework({
        x: GLOBALS.width / 2,
        y: GLOBALS.height - 20
      }, {
        x: Math.random() * 4 - 2,
        y: -5
      });

      entities.push(f);
    }

    shootFirework();

    function update () {

      // update all entities
      for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        e.tick();
        if (e.removed) {
          e.onRemoved();
          entities.splice( entities.indexOf(e), 1 );
        };
      }

      /* render */
      // clear the screen
      ctx.clearRect(0, 0, GLOBALS.width, GLOBALS.height);
      ctx.strokeStyle = "white";

      // draw all entities
      for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        if (!e.removed) {
          var pos = e.position;

          ctx.strokeStyle = "white";

          if (e.constructor !== Firework) {
            // colour the particles super mario star style
            var r = (Math.random() * 255) | 0;
            var g = (Math.random() * 255) | 0;
            var b = (Math.random() * 255) | 0;
            ctx.strokeStyle = "rgb(<r>,<g>,<b>)"
              .replace('<r>', r)
              .replace('<g>', g)
              .replace('<b>', b);

          }

          ctx.strokeRect(pos.x, pos.y, 3, 3);
        }
      }

      // shoot randomly more fireworks
      if (Math.random() * 100 < 2) {
        shootFirework();
      }

      setTimeout(update, MS_PER_FRAME);
    };

    // kickstart the game loop
    setTimeout(update, MS_PER_FRAME);

    console.log("app loaded");
  })
, 50);

