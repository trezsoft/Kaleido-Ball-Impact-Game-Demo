ig.module(
    'game.entities.ball'
)
    .requires(
    'impact.entity',
    'game.entities.starburst'
)
    .defines(function () {

        EntityBall = ig.Entity.extend({
            gravityFactor:0,
            size:{x:23, y:23},
            offset:{x:2, y:2},
            collides:ig.Entity.COLLIDES.PASSIVE,
            maxVel:{x:350, y:350},
            animSheet:new ig.AnimationSheet('media/balls.png', 24, 24),
            type:ig.Entity.TYPE.B,
            bounciness:1,
            ballValue:0,


            init:function (x, y, settings) {

                this.parent(x, y, settings);
                this.addAnim('magenta', 0.1, [0]);
                this.addAnim('red', 0.1, [1]);
                this.addAnim('blue', 0.1, [2]);
                this.addAnim('purple', 0.1, [3]);
                this.addAnim('yellow', 0.1, [4]);
                this.addAnim('green', 0.1, [5]);

                this.currentAnim = this.anims.blue;
                this.ballValue = 3;
                this.vel.x = 10;
                this.vel.y = 350;

            },
            update:function () {

                // check if ball is on a death tile ( we could use them to inflict damage by value !)
                var dValue = ig.game.dMap.getValue(this.pos.x, this.pos.y);

                if (dValue > 0) {

                    ig.game.playerLives -= 1;
                    ig.game.hud.decreaseLives(1);
                    ig.game.ballDead = true;
                    this.kill();

                }

                this.parent();

            },

            handleMovementTrace:function (res) {

                var offsetx, offsety, tValue;
                if (res.collision.y) {

                    offsety = this.vel.y < 0 ? -1 : ig.game.collisionMap.tilesize + 1;
                    offsetx = !ig.game.collisionMap.getTile(res.pos.x + (this.size.x / 2), res.pos.y + offsety) ? ig.game.collisionMap.getTile(res.pos.x, res.pos.y + offsety) ? 0 : 32 : this.size.x / 2;

                    tValue = ig.game.vMap.decreaseValue((res.pos.x + offsetx), res.pos.y + offsety, 1);

                    this.updateTiles(tValue, res.pos.x + offsetx, res.pos.y + offsety);


                }

                if (res.collision.x) {

                    offsetx = this.vel.x < 0 ? -1 : ig.game.collisionMap.tilesize + 1;
                    offsety = ig.game.collisionMap.getTile(res.pos.y + (this.size.y / 2), res.pos.x + offsetx) ? this.size.y / 2 : ig.game.collisionMap.getTile(res.pos.x + offsetx, res.pos.y) ? 0 : 32;

                    tValue = ig.game.vMap.decreaseValue((res.pos.x + offsetx), res.pos.y + offsety, 1);

                    this.updateTiles(tValue, res.pos.x + offsetx, res.pos.y + offsety);

                }

                this.parent(res);

            },
            updateTiles:function (tValue, posx, posy) {
                var score = 0;


                if (tValue == this.ballValue) {
                    ig.game.sfxBrickBlast.play();
                    var settings = {flash:tValue};
                    ig.game.spawnEntity(EntityStarburst, posx - 72, posy - 72, settings);
                    ig.game.vMap.setValue(posx, posy, 0);
                    ig.game.blocks.Map.setTile((posx), posy, 0);
                    score = tValue * 10;
                    ig.game.levelBlocks -= 1;
                    this.changeBallColor(tValue);
                }
                else if (tValue == 1) {
                    ig.game.sfxBrickKill.play();
                    ig.game.blocks.Map.setTile(posx, posy, 0);
                    score = 10;
                    ig.game.levelBlocks -= 1;
                    this.changeBallColor(tValue);
                }
                else if (tValue > 1) {
                    ig.game.sfxBrickHit.play();
                    ig.game.blocks.Map.setTile((posx), posy, tValue - 1);
                    score = 1;
                    this.changeBallColor(tValue);
                }
                else {
                    ig.game.sfxWallHit.play();
                }

                ig.game.hud.increaseScore(score);
                ig.game.blocks.draw(true);

            },
            changeBallColor:function (tileValue) {
                switch (tileValue) {
                    case 1:
                        this.currentAnim = this.anims.magenta;
                        this.ballValue = 1;
                        break;
                    case 2:
                        this.currentAnim = this.anims.red;
                        this.ballValue = 2;
                        break;
                    case 3:
                        this.currentAnim = this.anims.blue;
                        this.ballValue = 3;
                        break;
                    case 4:
                        this.currentAnim = this.anims.purple;
                        this.ballValue = 4;
                        break;
                    case 5:
                        this.currentAnim = this.anims.yellow;
                        this.ballValue = 5;
                        break;
                    case 6:
                        this.currentAnim = this.anims.green;
                        this.ballValue = 6;
                        break;
                }


            }


        });

    });