/**
 * 得到相应范围内的随机数（无法取到最大值）
 * @param min 
 * @param max 
 */

export function getRandom(min: number, max: number): number {
    const dec = max - min

    return Math.floor(Math.random() * dec + min)
}