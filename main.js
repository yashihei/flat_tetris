/*
 * 何か作らないと、死んでしまいそうだから
 */

/*
 * 定数
 */
var SCREEN_WIDTH    = 400;
var SCREEN_HEIGHT   = 440;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var BLOCK_NUM_X = 12;//壁のぶんも
var BLOCK_NUM_Y = 21;
var BLOCK_NUM = BLOCK_NUM_X * BLOCK_NUM_Y;
var BLOCK_SIZE = 20;//テトリスのブロックは縦横変わらないので

var MINO_NUM_X = 4;
var MINO_NUM_Y = 4;
var MINO_NUM = 16;

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

        this.cnt = 0;//カウントでふ
        this.blocks = new Array();

        //ブロック初期化
        for (var i = 0; i < BLOCK_NUM_Y; ++i) {
            this.blocks[i] = new Array();
            for (var j = 0; j < BLOCK_NUM_X; ++j) {
                this.blocks[i][j] = Block().addChildTo(this.blockGroup);
                if (j == 0 || j == BLOCK_NUM_X - 1 || i == BLOCK_NUM_Y - 1) {
                    this.blocks[i][j].type = TYPE.WALL;
                }
                //座標は左上ではなく中心っぽいのです ていうかサンプルの星で気づくべきだった…
                //sprite.origin.x sprite.origin.yを設定することで左上を頂点とできるみたい
                this.blocks[i][j].x = (BLOCK_SIZE + 1) * j + BLOCK_SIZE/2;
                this.blocks[i][j].y = (BLOCK_SIZE + 1) * i + BLOCK_SIZE/2;
            }
        }

        //this.mino = Mino(new Array(new Point(0, -1), new Point(1, -1), new Point(0, 0), new Point(1, 1)), 1, COLOR.RED);
        this.minos = new Array(
            Mino(new Array(new Point(0, -1), new Point(1, -1), new Point(0, 0), new Point(1, 0)), 1, COLOR.RED)
        );

        //ミノの場所
        this.pos = new Point(4, 1);

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

        // this.cnt++;
        // var nextPos = new Point(this.pos.x, this.pos.y);
        // if ((this.cnt + 1) % 60 == 0) nextPos.y++;

        // for (var i = 0; i < 4; i++) {
        // }

        //var time = ((app.frame / app.fps) * 1000)|0;
        //console.log((app.frame/app.fps * 1000)|0);
    },
});

tm.define("Block", {
    superClass: "tm.app.Shape",
    init: function() {
        this.superInit(BLOCK_SIZE, BLOCK_SIZE);
        this.type = TYPE.NONE;//0で無し 1で壁 2ブロック
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
                this.canvas.clearColor("hsl(0, 50%, 70%)");
            } else if (this.color == COLOR.BLUE) {
            } else if (this.color == COLOR.GREEN) {
            } else if (this.color == COLOR.YELLOW) {
            }
        }
    },
});

function Point(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

tm.define("Mino", {
    init: function(point, n, color) {
        this.point = new Array(n);
        this.color = color;
        this.n = n;//パターン数

        for (var i = 0; i < n; i++) {//パターン数
            this.point[i] = new Point();
            //とりまコピー
            for (var j = 0; j < 4; j++) {
                this.point[i][j] = point[j];
            }
            //回転パターンが有る場合は生成
            // for (var j = 0; j < MINO_NUM; j++) {
            // }
        }
    },
    update: function() {
    },
});

// tm.define("Mino", {
//     init: function() {
//         //this.status = [];
//         this.color = COLOR.RED;
//         this.flag = false;//地面についてる？
//         this.cnt = 0;
//         this.speed = 60;//落ちるスピード(数値ms事に)
//         this.x;
//         this.y;
//     },
//     update: function() {
//         this.cnt++;
//         if (this.cnt % this.speed == 0) {
//         }
//     },
// });