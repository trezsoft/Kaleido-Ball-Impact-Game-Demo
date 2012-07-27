ig.module(
    'game.entities.player'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

        EntityPlayer = ig.Entity.extend({

            size:{x:128, y:32},
            offset:{x:0, y:0},
            gravityFactor:0,
            maxVel:{x:600, y:200},
            friction:{x:0, y:0},
            type:ig.Entity.TYPE.A, // Player friendly group
            checkAgainst:ig.Entity.TYPE.B,
            collides:ig.Entity.COLLIDES.FIXED,
            animSheet:new ig.AnimationSheet('media/bat.png', 128, 32),
            accelGround:500,


            init:function (x, y, settings) {
                this.parent(x, y, settings);

                this.addAnim('idle', 1, [0]);

            },
            check:function (other) {
                "use strict";

                ig.game.sfxBatHit.play();
                var ballPos = other.pos.x - this.pos.x;
                var relativePos = ( (this.size.x) - ballPos );
                var angle = relativePos * ( Math.PI / (this.size.x) );

                other.vel.x = (Math.cos(angle) * (other.vel.x * 2)) + (this.vel.x / 10);
                //other.vel.x *= 12;
                other.vel.y *= 12;

                this.parent(other);

            },


            update:function () {


                if (ig.input.state('left')) {
                    this.vel.x = -this.accelGround;


                }
                else if (ig.input.state('right')) {
                    this.vel.x = this.accelGround;

                }
                else {
                    this.vel.x = 0;
                }

                this.parent();
            }
        });

    });