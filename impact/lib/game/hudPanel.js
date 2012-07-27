ig.module(
    'game.hudPanel'
)
    .requires(
    'plugins.dynamic-map'
)
    .defines(function () {
        HudPanel = ig.DynamicMap.extend(
            {

                score:0,
                lives:10,

                init:function (panelTileSet, panelTileSize, panelSizeX, panelSizeY, panelPosX, panelPosY) {

                    this.parent(panelTileSet, panelTileSize, panelSizeX, panelSizeY, panelPosX, panelPosY);
                    this.resetHud(this.lives);

                },
                resetHud:function (lives) {
                    this.setTile(0, 12, 1);
                    this.setTile(0, 11, 1);
                    this.setTile(0, 10, 1);
                    this.setTile(0, 9, 1);
                    this.setTile(0, 1, 1);
                    this.setTile(0, 0, 1);
                    this.score = 0;
                    this.lives = lives;
                    this.setLives(this.lives);

                },
                increaseScore:function (value) {

                    this.score += value;

                    var units = this.getNumber(this.score, 1);
                    var tens = this.getNumber(this.score, 2);
                    var hundreds = this.getNumber(this.score, 3);
                    var thousands = this.getNumber(this.score, 4);

                    this.setTile(0, 12, units);
                    this.setTile(0, 11, tens);
                    this.setTile(0, 10, hundreds);
                    this.setTile(0, 9, thousands);

                    this.draw(true);

                },
                getNumber:function (num, pos) {
                    var sNum = num + "";

                    if (pos > sNum.length || pos <= 0) {
                        return 1;
                    }

                    return parseInt(sNum[sNum.length - pos]) + 1;

                },
                setLives:function (value) {

                    var units = this.getNumber(value, 1);
                    var tens = this.getNumber(value, 2);

                    this.setTile(0, 1, units);
                    this.setTile(0, 0, tens);

                    this.draw(true);

                },

                decreaseLives:function (value) {

                    this.lives -= value;

                    var units = this.getNumber(this.lives, 1);
                    var tens = this.getNumber(this.lives, 2);

                    this.setTile(0, 1, units);
                    this.setTile(0, 0, tens);

                    this.draw(true);

                },

                draw:function (forceReDraw) {

                    this.parent(forceReDraw);

                }

            });
    });
