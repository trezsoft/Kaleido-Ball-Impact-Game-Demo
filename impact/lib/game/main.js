ig.module(
    'game.main'
)
    .requires(
    'impact.game',
    'game.entities.player',
    'game.entities.ball',
    'game.levels.level0',
    'game.levels.level1',
    'game.levels.level2',
    'game.levels.level3',
    'game.levels.level4',
    'game.levels.level5',
    'game.levels.level6',
    'game.levels.level7',
    'game.levels.level8',
    'game.levels.level9',
    'game.levels.level10',
    'game.hudPanel',
    'impact.debug.debug',
    'plugins.value-map',
    'plugins.dynamic-map'
)
    .defines(function () {

        MyGame = ig.Game.extend({

            gravity:300,
            player:null,
            vMap:null,
            dMap:null,
            blocks:null,
            playerScore:0,
            sfxBatHit:new ig.Sound('media/sound/HitBatHard.*'),
            sfxBrickHit:new ig.Sound('media/sound/StarPongPlain.*'),
            sfxBrickKill:new ig.Sound('media/sound/IceCubeExploding.*'),
            sfxBrickBlast:new ig.Sound('media/sound/DynamiteBlast.*'),
            sfxWallHit:new ig.Sound('media/sound/HitPongBat.*'),
            hudTiles:new ig.Image('media/counter_blue_001_32.png'),
            blockTiles:new ig.Image('media/blocks.png'),
            pauseImage:new ig.Image('media/paused.png'),
            gameoverImage:new ig.Image('media/gameover.png'),
            logoImage:new ig.Image('media/logo.png'),
            pressxImage:new ig.Image('media/pressx.png'),
            hud:null,
            currentLevel:0,
            levelTime:null,
            playerLives:10,
            levelBlocks:0,
            ballDead:false,
            mode:null,


            init:function () {

                // hide map layers (prevent draw in game)
                ig.BackgroundMap.inject(
                    {
                        visible:true,

                        draw:function () {
                            "use strict";
                            if (!this.visible) return;

                            this.parent();

                        }
                    }
                );


                // Bind keys
                ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
                ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
                ig.input.bind(ig.KEY.X, 'jump');
                ig.input.bind(ig.KEY.C, 'shoot');
                ig.input.bind(ig.KEY.P, 'pause');

                //setup HUD
                this.hud = new HudPanel(this.hudTiles, 32, 13, 1, 1, 1);
                this.player = this.getEntitiesByType(EntityPlayer)[0];
                tapjs.play();
                this.loadLevel(ig.global[ "LevelLevel" + this.currentLevel.toString()]);

            },
            loadLevel:function (level) {

                this.parent(ig.copy(level));

                var vm = ig.game.getMapByName('tilevalues');
                vm.visible = false;
                this.vMap = new ig.ValueMap(vm.tilesize, vm.data, true);

                var dm = ig.game.getMapByName('deathtiles');
                dm.visible = false;
                this.dMap = new ig.ValueMap(dm.tilesize, dm.data, false);
                this.dMap.removeCollision = false;

                this.createBlocks();

                this.levelTime = new ig.Timer();

                if (this.currentLevel == 0) {
                    this.mode = MyGame.MODE.MENU;
                }
                else {
                    this.mode = MyGame.MODE.BALLRELEASE;
                }


            },
            spawnBall:function () {

                if (ig.input.pressed('jump')) {

                    ig.game.spawnEntity(EntityBall, 230, 265);
                    this.mode = MyGame.MODE.GAME;
                    return;
                }

                this.draw();
                this.pressxImage.draw(48, 340);


            },
            levelComplete:function () {

                this.currentLevel += 1;
                if (this.currentLevel == 11) {

                    this.mode = MyGame.MODE.GAMEOVER;

                }
                else {
                    this.mode = MyGame.MODE.BALLRELEASE;
                    this.loadLevelDeferred(ig.global[ "LevelLevel" + this.currentLevel.toString()]);

                }

            },
            pauseGame:function () {
                if (ig.input.pressed('jump')) {
                    this.mode = MyGame.MODE.GAME;
                    return;
                }
                this.draw();
                this.pauseImage.draw(10, 250);

            },
            mainMenu:function () {

                if (ig.input.pressed('jump')) {

                    this.currentLevel = 0;
                    this.playerScore = 0;
                    this.playerLives = 10;
                    this.levelBlocks = 0;
                    this.hud.resetHud(this.playerLives);
                    this.mode = MyGame.MODE.GAME;
                    this.loadLevelDeferred(ig.global[ "LevelLevel" + this.currentLevel.toString()]);

                    return;
                }

                this.draw();
                this.logoImage.draw(40, 150);
                this.pressxImage.draw(48, 340);

            },
            gameOver:function () {

                if (ig.input.pressed('jump')) {

                    tapjsHighScores.save(this.playerScore);

                    this.mode = MyGame.MODE.MENU;
                    return;
                }

                this.draw();
                this.gameoverImage.draw(56, 250);

            },

            createBlocks:function () {

                // creates the blocks layer as a new dynamic layer from the vMap data
                // get a ref to the blocks layer
                this.blocks = new ig.DynamicMap(this.blockTiles, 32, 15, 20, 0, 0);

                for (var y = 0; y < this.vMap.data.length; ++y) {
                    var row = this.vMap.data[y];
                    for (var x = 0; x < row.length; ++x) {

                        if (this.vMap.data[y][x] > 0) {
                            this.blocks.Map.data[y][x] = (this.vMap.data[y][x]) - 1;
                            this.levelBlocks += 1;
                        }
                    }
                }

                this.blocks.draw(true);

            },

            update:function () {


                if (ig.input.pressed('jump')) {
                    this.mode = MyGame.MODE.PAUSED;
                }

                if (this.playerLives == 0) {
                    this.mode = MyGame.MODE.GAMEOVER;
                    this.ballDead = false;
                }

                if (this.ballDead) {
                    this.mode = MyGame.MODE.BALLRELEASE;
                    this.ballDead = false;
                }

                if (this.levelBlocks == 0) {
                    this.levelComplete();
                }

                this.parent();


            },

            draw:function () {

                this.parent();
                this.blocks.draw(false);
                this.hud.draw(false);

            },
            run:function () {

                if (this.mode == MyGame.MODE.GAME) {
                    this.update();
                    this.draw();
                }
                else if (this.mode == MyGame.MODE.MENU) {
                    this.mainMenu();
                }
                else if (this.mode == MyGame.MODE.STATS) {

                    this.levelComplete();
                }
                else if (this.mode == MyGame.MODE.BALLRELEASE) {

                    this.spawnBall();
                }
                else if (this.mode == MyGame.MODE.PAUSED) {

                    this.pauseGame();
                }
                else if (this.mode == MyGame.MODE.GAMEOVER) {

                    this.gameOver();
                }
            }

        });

        MyGame.MODE =
        {
            GAME:1,
            STATS:2,
            MENU:3,
            BALLRELEASE:4,
            PAUSED:5,
            GAMEOVER:6
        };

        ig.main('#canvas', MyGame, 60, 480, 640, 1);

    });
