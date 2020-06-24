import { Square } from "../Square";
import { IViewer } from "../types";
import PageConfig from './PageConfig'
import $ from 'jquery';

/**
 * 显示一个小方块到页面上
 */

export class SquarePageViewer implements IViewer {
    private dom?: JQuery<HTMLElement>
    private isRemove: boolean = false   //是否移除，默认没有移除
    
    constructor(
        private square: Square,
        private container: JQuery<HTMLElement>
    ) {

    }

    show(): void {
        const {width, height} = PageConfig.squareSize,
            {point: {x, y}, color} = this.square

        if(this.isRemove) return

        if(!this.dom) {
            this.dom = $('<div>').css({
                position: 'absolute',
                width,
                height,
                border: '1px solid #ccc',
                boxSizing: 'border-box'
            }).appendTo(this.container)
        }

        this.dom.css({
            left: x * width,
            top: y * height,
            background: color
        })
    }
    
    remove(): void {
        if(this.dom) {
            this.dom.remove()
            this.isRemove = true
        }
    }
}