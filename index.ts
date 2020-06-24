type user = {
    name: string,
    age: number
}

let u: user = {
    name: 'lenlen',
    age: 3
}

let a: string[] = ['11']

let fun = (num: number) => {}

//只有声明和初始化在同一行,ts类型推断才会起作用
// let n = 1
let n  
n = 50
n = 'ddd'

let b = [1, '2', true]

//元组：和数组类似的数据结构，每一个元素代表一个记录的不同类型
let d: [number, string, boolean] = [1, '2', true]

//接口：用来描述一个对象的属性名和属性值的类型
interface User {
    name: string,
    age: number,
    fun(): void
}

const p: User = {
    name: 'ss',
    age: 9,
    fun() {
        console.log('user')
    }
}

//类
// extends 继承, implements 接口实现
// 修饰符 private public protected static

//parcel-bundler自动配置在浏览器环境使用ts, faker生成假数据