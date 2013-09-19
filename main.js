/*
 * js!!!!!!!!!!!!!!!
 * TODO:
 * initとupdate分ける
 * x,y反転
 * blockinit
 * 下のしろ
 */

/*
 * 定数
 */

var BLOCK_NUM_X = 12;//壁のぶんも
var BLOCK_NUM_Y = 21;
var BLOCK_NUM = BLOCK_NUM_X * BLOCK_NUM_Y;
var BLOCK_SIZE = 20;//テトリスのブロックは縦横変わらないので

var MINO_NUM_X = 4;
var MINO_NUM_Y = 4;
var MINO_NUM = 16;

var SCREEN_WIDTH    = BLOCK_NUM_X * BLOCK_SIZE + BLOCK_NUM_X - 1;
var SCREEN_HEIGHT   = BLOCK_NUM_Y * BLOCK_SIZE + BLOCK_NUM_Y - 1;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var COLOR = {BROWN: 0, RED: 1, ORANGE: 2, YELLOW: 3, GREEN: 4, LIGHT_BLUE: 5, BLUE: 6, PURPLE: 7, NONE: 10};
//var TYPE = {NONE: 0, WALL: 1, BLOCK: 2};

var SQS_NUM = 4;

/*
 * メイン処理(ページ読み込み後に実行される)
 */
tm.main(function() {
    // アプリケーション作成
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT); // リサイズ
    app.fitWindow();    // 自動フィット
    
    // シーンを切り替える
    app.replaceScene(TitleScene());
    
    // 実行
    app.run();
});

tm.define("TitleScene", {
    superClass : "tm.app.TitleScene",

    init : function() {
        this.superInit({
            title: "FlatTetris",
            width : SCREEN_WIDTH,
            height : SCREEN_HEIGHT,
        });

        //click start
        var cts = tm.app.Label("CLICK START");
        cts.x = SCREEN_WIDTH/2;
        cts.y = SCREEN_HEIGHT/2 + 100;
        cts.fontSize = 26;
        cts.align = "center";
        cts.baseline = "middle";
        cts.width = SCREEN_WIDTH/2;
        this.addChild(cts);
        cts.tweener.fadeOut(500).fadeIn(1000).setLoop(true);

        this.onpointingstart = function() {
            this.app.replaceScene(MainScene());
        }
    },
});

tm.define("MainScene", {
    superClass: "tm.app.Scene",

    init: function() {
        // 親の初期化
        this.superInit();

        var blockGroup = tm.app.CanvasElement();
        this.addChild(blockGroup);

        var blocks = [];//
        for (var i = 0; i < BLOCK_NUM_Y; i++) {
            blocks[i] = [];
        }

        //ブロック初期化
        for (var i = 0; i < BLOCK_NUM_Y; ++i) {
            for (var j = 0; j < BLOCK_NUM_X; ++j) {
                blocks[j][i] = Block().addChildTo(blockGroup);
                if (j == 0 || j == BLOCK_NUM_X - 1 || i == BLOCK_NUM_Y - 1) {
                    blocks[j][i].color = COLOR.BROWN;
                }
                //座標は左上ではなく中心っぽいのです ていうかサンプルの星で気づくべきだった…
                //sprite.origin.x sprite.origin.yを設定することで左上を頂点とできるみたい
                //xとyがあれなので反転させよう
                blocks[j][i].y = (BLOCK_SIZE + 1) * i + BLOCK_SIZE/2;
                blocks[j][i].x = (BLOCK_SIZE + 1) * j + BLOCK_SIZE/2;
            }
        }

        var minos = [//
            Mino([Point(-1, 0), Point(0, 0), Point(1, 0), Point(2, 0)], 2, COLOR.LIGHT_BLUE),//棒
            Mino([Point(0, -1), Point(1, -1), Point(0, 0), Point(1, 0)], 1, COLOR.YELLOW),//正方形
            Mino([Point(-1, -1), Point(-1, 0), Point(0, 0), Point(1, 0)], 4, COLOR.BLUE),//l1
            Mino([Point(-1, 0), Point(0, 0), Point(1, 0), Point(1, -1)], 4, COLOR.ORANGE),//l2
            Mino([Point(-1, 0), Point(0, 0), Point(0, 1), Point(1, 1)], 2, COLOR.GREEN),
            Mino([Point(-1, 1), Point(0, 1), Point(0, 0), Point(1, 0)], 2, COLOR.RED),
            Mino([Point(-1, 0), Point(0, 0), Point(1, 0), Point(0, 1)], 4, COLOR.PURPLE),
        ];

        //ミノの状態
        var pos = Point(5, 1);
        var mino = minos[tm.util.Random.randint(0, 6)];
        // var mino = minos[0];
        // var rot = tm.util.Random.randint(0, mino.n - 1);
        var rot = 0;
        var cnt = 0;
        var fallCycle = 30;
        var wait = 0;
        //var goflag = false;

        // 星スプライト
        var star = tm.app.StarShape(64, 64);
        this.addChild(star);    // シーンに追加

        this.update = function(app) {
            var p = app.pointing;

            //var star = this.star;//おぶじぇくとはさんｓにょう
            star.x = p.x;
            star.y = p.y;
            // クリック or タッチ中は回転させる
            if (p.getPointing() == true) {
                star.rotation += 35;
            }

            //ここからテトリス
            cnt++;
            if (wait > 0) wait--;

            var nextPos = Point(pos.x, pos.y);
            var nextRot = rot;
            var sqs = [];
            var nextSqs = [];

            var key = app.keyboard;
            var self = this;

            //キーによる移動が早すぎ(左右)なので修正すす
            if ((cnt + 1) % fallCycle == 0) {
                nextPos.y++;
            } else if (key.getKey("left") && wait == 0) { 
                nextPos.x--;
                wait += 2;
            } else if (key.getKey("right") && wait == 0) {
                nextPos.x++;
                wait += 2;
            } else if (key.getKey("down")) {
                nextPos.y++;
            } else if (key.getKeyDown("up")) {//回転
                nextRot++;
                nextRot %= mino.n;
                // for (var i = 0; i < SQS_NUM; i++) {
                //     console.log(mino.sq[nextRot][i].x, mino.sq[nextRot][i].y);
                // }
            } else if (key.getKeyDown("z")) {
                // while (true) {
                //     nextPos.y++;
                //     console.log("aaa");
                //     if (!this.getSqs(mino, nextPos, rot, sqs, blocks)) {
                //         // this.getSqs(mino, nextPos, rot, nextSqs, blocks);
                //         // this.putSqs(blocks, nextSqs, mino.color);
                //         fallFlag = true;
                //         break;
                //     }
                // }
            }

            this.getSqs(mino, pos, rot, sqs, blocks);//いまいるところね
            this.putSqs(blocks, sqs, COLOR.NONE);//今いるところを黒くぬるのだっだだ

            if (this.getSqs(mino, nextPos, nextRot, nextSqs, blocks)) {
                this.putSqs(blocks, nextSqs, mino.color);
                pos = nextPos;
                rot = nextRot;
            } else {
                this.putSqs(blocks, sqs, mino.color);
                if (nextPos.y == pos.y + 1) {//次が示されているのに行けなかった場合（つまり止まった）
                    //ライン消せる？
                    for (var y = 0; y < BLOCK_NUM_Y - 1; y++) {
                        var deleteFlag = true;
                        for (var x = 1; x < BLOCK_NUM_X - 1; x++) {
                            if (blocks[x][y].color == COLOR.NONE) {
                                deleteFlag = false;
                                break;
                            }
                        }
                        if (deleteFlag) {
                            //１つずつずらす
                            for (var k = y; k >= 1; k--) {
                                for (var x = 0; x < BLOCK_NUM_X - 1; x++) {
                                    blocks[x][k].color = blocks[x][k - 1].color;
                                }
                            }
                            console.log("yojo");
                        }
                    }

                    // 初期位置に置く(関数化しよう )
                    pos = Point(5, 1);
                    mino = minos[tm.util.Random.randint(0, 6)];
                    rot = 0;
                    // rot = tm.util.Random.randint(0, mino.n - 1);
                    fallCnt = 0;
                    fallCycle = 30;

                    //ゲームおバー
                    if (!this.getSqs(mino, pos, rot, sqs, blocks)) {//おけない時
                        this.putSqs(blocks, sqs, mino.color);
                        for (var y = 0; y < BLOCK_NUM_Y - 1; y++) {
                            for (var x = 1; x < BLOCK_NUM_X - 1; x++) {
                                if (blocks[x][y].color != COLOR.NONE) blocks[x][y].color = COLOR.RED;
                            }
                        }
                        console.log("yojofugaaaaaaaaaaaaaa");
                        app.replaceScene(GameOver());
                    }
                }
            }
        }
    },

    getSqs: function(mino, pos, rot, sqs, blocks) {//今のミノとミノの位置とパターンを教えて、sqsを得ましょう！
        var overlap = false;
        for (var i = 0; i < SQS_NUM; i++) {
            var p = Point(pos.x + mino.sq[rot][i].x, pos.y + mino.sq[rot][i].y);
            //overlap |= p.x < 0 || p.x > BLOCK_NUM_X || p.y < 0 || p.y > BLOCK_NUM_Y || blocks[p.x][p.y].color != COLOR.NONE;//問題？
            if (p.x < 0 || p.x > BLOCK_NUM_X - 1 || p.y < 0 || p.y > BLOCK_NUM_Y - 1) {
                overlap |= true;
            } else if (blocks[p.x][p.y].color != COLOR.NONE) {
                overlap |= true;
            }
            sqs[i] = p;
        }
        return !overlap;
    },

    putSqs: function(blocks, sqs, color) {
        for (var i = 0; i < SQS_NUM; i++) {
            blocks[sqs[i].x][sqs[i].y].color = color;
        }
    },

    // update: function(app) {
    // },
});

tm.define("GameOver", {
    superClass : "tm.app.ResultScene",
    init : function(time) {
        this.superInit({
            score: "未実装",
            msg: "てとりすおいしい！",
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        });
    },
    onnextscene: function() {
        this.app.replaceScene(TitleScene());
    },
});

tm.define("Block", {
    superClass: "tm.app.Shape",
    init: function() {
        this.superInit(BLOCK_SIZE, BLOCK_SIZE);
        this.color = COLOR.NONE;
    },
    update: function() {
        if (this.color == COLOR.NONE) {
            this.canvas.clear();
            return;
        }
        var h, s;
        if(this.color != COLOR.BROWN) {
            s = 50;
        } else {
            s = 0;
        }
        switch (this.color) {
            case COLOR.BROWN:
            case COLOR.RED:
                h = 0; break;
            case COLOR.ORANGE:
                h = 30; break;
            case COLOR.YELLOW:
                h = 60; break;
            case COLOR.GREEN:
                h = 120; break;
            case COLOR.LIGHT_BLUE:
                h = 180; break;
            case COLOR.BLUE:
                h = 230; break;
            case COLOR.PURPLE:
                h = 280; break;
            case defalut:
                console.log("color error");
        }
        this.canvas.clearColor("hsl({0}, {1}%, 70%)".format(h, s));
    },
});

tm.define("Point", {
    init: function(x, y) {
        this.x = x;
        this.y = y;
    },
})

tm.define("Mino", {
    init: function(point, n, color) {
        this.sq = [];
        this.color = color;
        this.n = n;//パターン数

        for (var i = 0; i < n; i++) {//パターン数
            this.sq[i] = [];
            for (var j = 0; j < SQS_NUM; j++) {
                this.sq[i][j] = point[j];
            }
            for (var j = 0; j < SQS_NUM; j++) {
                point[j] = this.rotate(point[j]);//次に代入する時は９０度回転
                //this.sq[i][j] = this.rotate(this.sq[i][j]);//回転(これだと全部同じになってしまう)
            }
        }
    },
    rotate: function(p) {
        return Point(p.y, -p.x);
    },
});
