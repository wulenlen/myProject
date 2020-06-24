import { GameStatus, MoveDirection, GameViewer } from "./types";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import GameConfig from "./GameConfig";
import { Square } from "./Square";

export class Game {
    //游戏状态
    private _gameStatus: GameStatus = GameStatus.init
    //当前玩家操作的方块
    private _curTeris?: SquareGroup
    //下一个方块
    private _nextTeris: SquareGroup
    //计时器
    private _timer?: number
    //自由下落间隔时间
    private _duration: number = GameConfig.level[0].duration
    //当前游戏中已存在的方块
    private _exists: Square[] = []
    //积分
    private _score: number = 0

    constructor(private _viewer: GameViewer) {
        this._nextTeris  = createTeris({x: 0, y: 0})
        this.createNext()
        this._viewer.init(this)
        this._viewer.showScore(this.score)
    }

    public get gameStatus() {
        return this._gameStatus
    }

    public get score() {
        return this._score
    }

    public set score(n) {
        this._score = n
        this._viewer.showScore(n)
        const level = GameConfig.level.filter(it => it.score <= n).pop()!
        if(level.duration !== this._duration) {
            clearInterval(this._timer)
            this._timer = undefined
            this._duration = level.duration
            console.log(this._duration)
            this.autoDrop()
        }
    }

    private createNext() {
        this._nextTeris  = createTeris({x: 0, y: 0})
        this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris)
        this._viewer.showNext(this._nextTeris)
    }

    private init() {
        this._exists.forEach(sq => {
            if(sq.viewer) {
                sq.viewer.remove()
            }
        })
        this._exists = []
        this._curTeris = undefined
        this.score = 0
        this.createNext()
    }

    /**
     * 游戏开始
     */
    startGame() {
        //改变游戏状态
        if(this._gameStatus === GameStatus.playing) return

        if(this._gameStatus === GameStatus.over) {
            this.init()
        }

        this._gameStatus = GameStatus.playing
        if(!this._curTeris) {
            this.switchTeris()
        }
        this.autoDrop()

        this._viewer.onGameStart()
    }

    /**
     * 游戏暂停
     */
    pause() {
        if(this._gameStatus === GameStatus.playing) {
            this._gameStatus = GameStatus.pause
            clearInterval(this._timer)
            this._timer = undefined

            this._viewer.onGamePause()
        }
    }

    control_left() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.left, this._exists)
        }
    }

    control_right() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.move(this._curTeris, MoveDirection.right, this._exists)
        }
    }

    control_down() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.moveDirectly(this._curTeris, MoveDirection.down, this._exists)
            this.hitBottom()
        }
    }

    control_rotate() {
        if(this._curTeris && this._gameStatus === GameStatus.playing) {
            TerisRule.rotate(this._curTeris, this._exists)
        }
    }

    /**
     * 当前方块自由下落
     */
    private autoDrop() {
        if(this._timer || this._gameStatus !== GameStatus.playing) return

        this._timer = setInterval(() => {
            if(this._curTeris) {
                if(!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
                    this.hitBottom()
                }
            }
        }, this._duration)
    }

    /**
     * 触底
     */
    private hitBottom() {
        this._exists.push(...this._curTeris!.squares)
        const num = TerisRule.deleteSquares(this._exists)
        this.addScore(num)
        this.switchTeris()
    }

    private addScore(lineNum: number) {
        if(lineNum === 0){
            return
        }else if(lineNum === 1) {
            this.score += 10
        }else if(lineNum === 2) {
            this.score += 25
        }else if(lineNum === 3) {
            this.score += 50
        }else {
            this.score += 100
        }
    }

    /**
     * 切换方块
     */
    private switchTeris() {
        this._curTeris = this._nextTeris
        this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris)
        
        if(!TerisRule.canIMove(this._curTeris.shape, this._curTeris.centerPoint, this._exists)) {
            //游戏结束
            this._curTeris.squares.forEach(sq => {
                if(sq.viewer) {
                    sq.viewer.remove()
                }
            })
            this._gameStatus = GameStatus.over
            clearInterval(this._timer)
            this._timer = undefined
            this._viewer.onGameOver()
            return
        }

        this.createNext()
        this._viewer.switch(this._curTeris)
    }

    /**
     * 设置中心点坐标，让该方块出现在区域中上方
     * @param width 
     * @param teris 
     */
    private resetCenterPoint(width: number, teris: SquareGroup) {
        const x = Math.ceil(width / 2 - 1),
            y = 0

        teris.centerPoint = {x, y}
        while(teris.squares.some(it => it.point.y < 0)) {
            teris.centerPoint = {
                x: teris.centerPoint.x,
                y: teris.centerPoint.y + 1
            }
        }
    }
}