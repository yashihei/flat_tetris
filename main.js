/*
 * 何か作らないと、死んでしまいそうだから
 */

/*
 * 定数
 */
var SCREEN_WIDTH    = 480;
var SCREEN_HEIGHT   = 480;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var BLOCK_NUM_X = 12;//壁のぶんも
var BLOCK_NUM_Y = 21;
var BLOCK_NUM = BLOCK_NUM_X * BLOCK_NUM_Y;
var BLOCK_SIZE = 20;//テトリスのブロックは縦横変わらないので

var MINO_NUM = 4;
var MINO_TYPE = [
    0, 0, 0, 0,
    0, 1, 1, 0,
    0, 1, 1, 0,
    0, 0, 0, 0,
]

var COLOR = {RED: 0, BLUE: 1, GREEN: 2, YELLOW: 3};
var TYPE = {NONE: 0, WALL: 1, BLOCK: 2};

/*
 * メイン処理(ページ読み込み後に実行される)
 */
tm.main(function() {
    // アプリケーション作成
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT); // リサイズ
    app.fitWindow();    // 自動フィット
    
    // シーンを切り替える
    app.replaceScene(MainScene());
    
    // 実行
    app.run();
});

tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        this.blockGroup = tm.app.CanvasElement();
        this.addChild(this.blockGroup);

        this.blocks = [];
        this.currentMino;

        //ブロック初期化
        for (var i = 0; i < BLOCK_NUM_Y; ++i) {
            for (var j = 0; j < BLOCK_NUM_X; ++j) {
                var index = i * BLOCK_NUM_X + j;
                this.blocks[index] = Block().addChildTo(this.blockGroup);
                if (j == 0 || j == BLOCK_NUM_X - 1 || i == BLOCK_NUM_Y - 1) {
                    this.blocks[index].type = TYPE.WALL;
                }
                this.blocks[index].x = (BLOCK_SIZE + 1) * j ;
                this.blocks[index].y = (BLOCK_SIZE + 1) * i ;
                console.log(this.blocks[index].x);
                console.log(this.blocks[index].y);
            }
        }

        // this.currentMino = Mino();
        // this.currentMino.flag = false;
        // this.currentMino.status = 
        // this.addChild(this.currentMino);

        // 星スプライト
        this.star = tm.app.StarShape(64, 64);
        this.addChild(this.star);    // シーンに追加
    },

    update: function(app) {
        var p = app.pointing;
        // マウス位置 or タッチ位置に移動
        this.star.x = p.x;
        this.star.y = p.y;
        // クリック or タッチ中は回転させる
        if (app.pointing.getPointing() == true) {
            this.star.rotation += 15;
        }
    },
});

tm.define("Block", {
    superClass: "tm.app.Shape",
    init: function() {
        this.superInit(BLOCK_SIZE, BLOCK_SIZE);
        this.type = TYPE.NONE;//0で無し 1で壁 2以降ブロック
        this.color = 0;
    },
    update: function() {
        if (this.type == TYPE.WALL) {
            this.canvas.clearColor("hsl(0, 0%, 70%)");//壁は灰色で
        } else if (this.type == TYPE.BLOCK) {
            // switch (this.color) {
            //     case COLOR.RED:
            //     case COLOR.BLUE:
            //     case COLOR.GREEN:
            //     case COLOR.YELLOW:
            // }
            //色はswitchでいいかもね
            if (this.color == COLOR.RED) {
                this.canvas.clearColor("hsl(0, 50%, 70%");
            } else if (this.color == COLOR.BLUE) {
            } else if (this.color == COLOR.GREEN) {
            } else if (this.color == COLOR.YELLOW) {
            }
        }
    },
});

tm.define("Mino", {
    init: function() {
        this.status = [];
        this.color = COLOR.RED;
        this.flag = false;//地面についてる？
        this.cnt = 0;
        this.speed = 60;//落ちるスピード(数値ms事に)
    },
    update: function() {
        this.cnt++;
        if (this.cnt % this.speed == 0) {
        }
    },
});