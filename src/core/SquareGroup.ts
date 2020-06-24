import { Square } from "./Square";
import { Shape, Point } from "./types";

/**
 * 组合方块
 */
export class SquareGroup {
    private _squares: ReadonlyArray<Square>
    protected isClock: boolean = true   //旋转方向，默认顺时针

    constructor(private _shape: Shape, private _centerPoint: Point, private _color: string) {
        //设置小方块数组
        this._squares = this._shape.map(p => {
            const sq = new Square()

            sq.color = this._color

            return sq
        })

        this.setSquarePoint()
    }

    public get squares() {
        return this._squares
    }

    public get shape() {
        return this._shape
    }

    public get centerPoint(): Point {
        return this._centerPoint
    }

    public set centerPoint(p: Point) {
        this._centerPoint = p

        this.setSquarePoint()
    }

    /**
     * 根据中心坐标以及形状，设置每一个小方块的坐标
     */
    private setSquarePoint() {
        this._shape.forEach((p, i) => {
            this._squares[i].point = {
                x: this._centerPoint.x + p.x,
                y: this._centerPoint.y + p.y
            }
        })
    }


    afterRotateShape(): Shape {
        if(this.isClock) {
            return this._shape.map (p => {
                const newP: Point = {
                    x: -p.y,
                    y: p.x
                }
                return newP
            })
        }else {
            return this._shape.map (p => {
                const newP: Point = {
                    x: p.y,
                    y: -p.x
                }
                return newP
            })
        }
    }

    rotate() {
        const newShape = this.afterRotateShape()

        this._shape = newShape
        this.setSquarePoint()
    }
    
}