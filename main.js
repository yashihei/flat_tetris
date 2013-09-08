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

        this.map = [];//このマップを書き換えていくのが主になる
        for (var i = 0; i < BLOCK_NUM_Y; ++i) {
            for (var j = 0; j < BLOCK_NUM_X; ++j) {
                var index = i * BLOCK_NUM_X + j;
                if (j == 0 || j == BLOCK_NUM_X - 1 || i == BLOCK_NUM_Y - 1)
                    this.map[index] = -1;//壁
                else
                    this.map[index] = 0;//何もない
            }
        }

        //ブロック描画
        for (var i = 0; i < BLOCK_NUM_Y; ++i) {
            for (var j = 0; j < BLOCK_NUM_X; ++j) {
                var index = i * BLOCK_NUM_X + j;
                if (this.map[index] == 0) continue;
                var block = tm.app.Shape(BLOCK_SIZE, BLOCK_SIZE).addChildTo(this.blockGroup);
                block.x = (BLOCK_SIZE + 1) * j + 20;
                block.y = (BLOCK_SIZE + 1) * i + 20;
                var h = 0;//色相
                var s = 0;//彩度
                var l = 50;//メイド
                if (this.map[index] == -1) s = 0;
                block.canvas.clearColor("hsl({0}, {1}%, {2}%)".format(h, s, l));
            }
        }

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
        //tm.util.Random.randint(,)
    },
});

tm.define("Mino", {
    init: function() {
    },
    update: function() {
    },
});