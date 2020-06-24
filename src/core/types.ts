import { SquareGroup } from "./SquareGroup";
import { Game } from "./Game";

export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface IViewer {
    /**
     * 显示
     */
    show(): void;

    /**
     * 移除
     */
    remove(): void;
}

export type Shape = Point[]

export enum MoveDirection {
    left,
    right,
    down
}

export enum GameStatus {
    init,  //未开始
    playing,  //进行中
    pause,   //暂停
    over     //结束
}

export interface GameViewer {
    showNext(teris: SquareGroup): void
    switch(teris: SquareGroup): void
    /**
     * 游戏初始化
     * @param game 
     */
    init(game: Game): void

    showScore(score: number): void

    onGamePause(): void

    onGameStart(): void

    onGameOver(): void
}