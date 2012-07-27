ig.module(
    'game.entities.starburst'
)
    .requires(
    'impact.entity'
)
    .defines(function () {

        EntityStarburst = ig.Entity.extend({

            size:{x:128, y:128},
            maxVel:{x:0, y:0},
            friction:{x:0, y:0},

            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.NONE,
            collides:ig.Entity.COLLIDES.NEVER,
            gravityFactor:0,
            flash:1,

            aSheet1:new ig.AnimationSheet('media/fx/flash_mb.png', 128, 128),
            aSheet2:new ig.AnimationSheet('media/fx/flash_rm.png', 128, 128),
            aSheet3:new ig.AnimationSheet('media/fx/flash_br.png', 128, 128),
            aSheet4:new ig.AnimationSheet('media/fx/flash_pb.png', 128, 128),
            aSheet5:new ig.AnimationSheet('media/fx/flash_yp.png', 128, 128),
            aSheet6:new ig.AnimationSheet('media/fx/flash_gy.png', 128, 128),


            init:function (x, y, settings) {

                this.parent(x, y, settings);

                this.anims.flash1 = new ig.Animation(this.aSheet1, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                this.anims.flash2 = new ig.Animation(this.aSheet2, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                this.anims.flash3 = new ig.Animation(this.aSheet3, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                this.anims.flash4 = new ig.Animation(this.aSheet4, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                this.anims.flash5 = new ig.Animation(this.aSheet5, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                this.anims.flash6 = new ig.Animation(this.aSheet6, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);


                this.currentAnim = this.anims['flash' + this.flash].rewind();
            },
            update:function () {

                if (this.currentAnim.loopCount > 0) {
                    this.kill();
                }

                this.parent();

            }


        });

    });