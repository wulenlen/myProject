import { GameViewer, GameStatus } from "../types";
import { SquareGroup } from "../SquareGroup";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from 'jquery'
import { Game } from "../Game";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
    private nextDom = $('#next')
    private panelDom = $('#panel')
    private scoreDom = $('#score')
    private msgDom = $('#msg')

    init(game: Game): void {
        const {
            panelSize: {width: panelWidth, height: panelHeight},
            nextSize: {width: nextWidth, height: nextHeight}
        } = GameConfig,
        {squareSize: {width: sqWidth, height: sqHeight}} = PageConfig

        //设置宽高
        this.panelDom.css({
            width: panelWidth * sqWidth,
            height: panelHeight * sqHeight,
        })

        this.nextDom.css({
            width: nextWidth * sqWidth,
            height: nextHeight * sqHeight,
        })

        //注册键盘事件
        $(document).keydown(e => {
            const {keyCode} = e
            
            if(keyCode === 37) {
                game.control_left()
            }else if(keyCode === 38) {
                game.control_rotate()
            }else if(keyCode === 39) {
                game.control_right()
            }else if(keyCode === 40) {
                game.control_down()
            }else if(keyCode === 32) {
                if(game.gameStatus === GameStatus.playing) {
                    game.pause()
                }else {
                    game.startGame()
                }
            }
        })
    }

    onGamePause(): void {
        this.msgDom.css({
            visibility: 'visible'
        })
        this.msgDom.find('p').html('游戏暂停')
    }

    onGameStart(): void {
        this.msgDom.css({
            visibility: 'hidden'
        })
    }

    onGameOver(): void {
        this.msgDom.css({
            visibility: 'visible'
        })
        this.msgDom.find('p').html('游戏结束')
    }

    showScore(score: number): void {
        this.scoreDom.html(String(score))
    }

    showNext(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer = new SquarePageViewer(sq, this.nextDom)
        })
    } 
       
    switch(teris: SquareGroup): void {
        teris.squares.forEach(sq => {
            sq.viewer!.remove()
            sq.viewer = new SquarePageViewer(sq, this.panelDom)
        })
    }

    
}