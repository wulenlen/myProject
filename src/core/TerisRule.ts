import { Shape, Point, MoveDirection } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
import { Square } from "./Square";

/**
 * 该类中提供一系列函数，根据游戏规则判断各种情况
 */
export class TerisRule {
    /**
     * 判断某个形状的方块是否能移动到目标位置
     * @param shape 形状
     * @param targetPoint 目标位置
     */
    static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
        //假设中心点已经移动到了目标位置，算出每个小方块的坐标
        const targetSquarePoints: Point[] = shape.map(p => {
                return {
                    x: p.x + targetPoint.x,
                    y: p.y + targetPoint.y
                }
            }),
            { width: gamePanelWidth, height: gamePanelHeight } = GameConfig.panelSize

        //边界判断
        if(targetSquarePoints.some(p => 
            p.x < 0 || p.x > gamePanelWidth - 1 || p.y < 0 || p.y > gamePanelHeight - 1
        )) {
            return false
        }

        //判断是否与已有的方块有重叠
        if(targetSquarePoints.some(p => exists.some(sq => sq.point.x === p.x && sq.point.y === p.y))) {
            return false
        }

        return true
    }

    static move(teris: SquareGroup, targetPoint: Point, exists: Square[]): boolean;
    static move(teris: SquareGroup, direction: MoveDirection, exists: Square[]): boolean;
    static move(teris: SquareGroup, targetPointOrDirection: Point | MoveDirection, exists: Square[]): boolean {
        if(isPoint(targetPointOrDirection)) {
            if(this.canIMove(teris.shape, targetPointOrDirection, exists)) {
                teris.centerPoint = targetPointOrDirection
                return true;
            }
        }else {
            const direction = targetPointOrDirection
            let targetPoint: Point

            if(direction === MoveDirection.down) {
                targetPoint = {
                    x: teris.centerPoint.x,
                    y: teris.centerPoint.y + 1
                }
            }else if(direction === MoveDirection.left) {
                targetPoint = {
                    x: teris.centerPoint.x - 1,
                    y: teris.centerPoint.y
                }
            }else {
                targetPoint = {
                    x: teris.centerPoint.x + 1,
                    y: teris.centerPoint.y
                }
            }

            return this.move(teris, targetPoint, exists)
        }
        

        return false
    }

    static moveDirectly(teris: SquareGroup, direction: MoveDirection, exists: Square[]) {
        while(this.move(teris, direction, exists)) {}
    }

    static rotate(teris: SquareGroup, exists: Square[]): boolean {
        const newShape = teris.afterRotateShape()

        if(this.canIMove(newShape, teris.centerPoint, exists)) {
            teris.rotate()
            return true
        }

        return false
    }

    /**
     * 消除,返回移除几行
     * @param exists 
     */
    static deleteSquares(exists: Square[]): number {
        //获得y坐标数组
        const yArr = exists.map(sq => sq.point.y)
        //获得最大/小值
        const maxY = Math.max(...yArr),
            minY = Math.min(...yArr)

        let num = 0

        for(let y = minY; y <= maxY; y++) {
            if(this.deleteLine(exists, y)) {
                num ++
            }
        }

        return num

    }

    /**
     * 消除一行
     * @param exists 
     * @param y 
     */
    private static deleteLine(exists: Square[], y: number): boolean {
        const squares = exists.filter(sq => sq.point.y === y),
            len = squares.length

        if(len === GameConfig.panelSize.width) {
            squares.forEach(sq => {
                const index = exists.indexOf(sq)
                
                //从界面移除
                if(sq.viewer) {
                    sq.viewer.remove()
                }

                exists.splice(index, 1)
                
            })

            //让这行以上的方块下落
            exists.filter(sq => sq.point.y < y).forEach(sq => {
                sq.point = {
                    x: sq.point.x,
                    y: sq.point.y + 1
                }
            })

            return true
        }

        return false
    }

}

/**
 * 类型保护
 * @param obj 
 */
function isPoint(obj: any): obj is Point {
    if(typeof obj.x === 'undefined') {
        return false
    }

    return true
}