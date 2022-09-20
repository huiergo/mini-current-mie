import BoxInfo from './base/boxInfo'
let instance

const BOX_IMG = 'images/enemy.png'
const BOX_WIDTH = 50
const BOX_HEIGHT = 50

//count 必须定义好，所有 count 相加 ， 被 3 整除
const layerList = [
    {
        row: 3,
        column: 3,
        x: 0,//第一层 起始点x
        y: 0,//第一层 起始点y
        count: 3
    },
    {
        row: 2,
        column: 2,
        x: BOX_WIDTH / 2,
        y: BOX_HEIGHT / 2,
        count: 2
    },
    // {
    //     row: 2,
    //     column: 2,
    //     x: BOX_WIDTH / 2 + 10,
    //     y: BOX_HEIGHT / 2 + 10,
    //     count: 2
    // }
]

const IMGTYPE = {
    0: 'images/enemy.png',
    1: 'images/bullet.png',
    // 2: 'images/explosion19.png'
}
const DISABLED_IMGTYPE = {
    0: 'images/hero.png',
    1: 'images/bg.jpg',
    // 2: 'images/explosion7.png'
}



/**
 * 全局状态管理器
 */
export default class DataCenter {
    constructor() {
        if (instance) return instance

        instance = this
        // 层区域： 二维数组 
        this.boxData = []

        // 层区域： 一维数组
        this.boxDataFlat = []

        // 插槽区域： 
        this.stack = []
        this.stackPoolLength = 7

        this.reset()
        console.log(111)
        this.generaterBoxData()
        this.judgeOverlay()
    }

    reset() {
        this.frame = 0
        this.score = 0
        this.bullets = []
        this.enemys = []
        this.animations = []
        this.gameOver = false
    }
    generaterBoxData() {
        // 随机layer 中的 0， 1 --->  0 代表图片显示空， 或者此处不参与drawImage
        //  比如 30个格子， 随机展示5个

        // for (let i = 0; i < layerList[0].row * layerList[0].col ; i++) {
        //     const element = array[i];

        // }
        let totalImgCount = 0
        layerList.map((layerItem, index) => {
            let tempList = []
            totalImgCount += layerItem.count
            for (let i = 0; i < layerItem.row; i++) {
                for (let j = 0; j < layerItem.column; j++) {

                    const boxItem = new BoxInfo({
                        row: i + 1,
                        col: j + 1,
                        layer: index,
                        x: j * BOX_WIDTH + layerItem.x,
                        y: i * BOX_HEIGHT + layerItem.y,
                        img: IMGTYPE[index],
                        disabledImg: DISABLED_IMGTYPE[index],
                        width: BOX_WIDTH,
                        height: BOX_WIDTH,
                        canClick: true,
                        hidden: false,
                        //  todo: elementType
                        elementType: index
                    });
                    console.log('[testItem--->]', boxItem)


                    tempList.push(boxItem)
                    this.boxDataFlat.push(boxItem)
                }
            }
            this.boxData.push(tempList)
        })

        console.log('this.boxDataFlat----> ', this.boxDataFlat)
        let count = this.randomZeroFlag(this.boxDataFlat, 1)
        console.log("randomZeroFlag--->", count)
    }

    /**
     * 抽牌算法： 从总数中，抽取多少个数
     * @param array 
     * @param count 随机多少个数
     */
    randomZeroFlag(array, count) {
        //输出数组
        var out = [];
        //输出个数
        while (out.length < count) {
            var temp = Math.floor((Math.random() * array.length));
            var ttt = array.splice(temp, 1)
            out.push(ttt[0]);
        }
        return out
    }

    judgeOverlay() {
        console.log(222)
        // 如果从第一层开始判断每个元素， 那么有n层的 四个判断， 所以就是 (n-1)*  4次比较
        let array = this.boxDataFlat;
        for (let i = 0; i < array.length - 1; i++) {
            array[i].canClick = true
            for (let j = i + 1; j < array.length; j++) {
                if (array[j].layer > array[i].layer) {
                    // 1层的（2，2） 判断是否被挡住， 需要知道 2层 是否有(1,1) (1,2), (2,1), (2,2)
                    // （2，4）， 需要顶层 : (1,3), (1,4) , (2,3),(2,4)
                    if (array[j].row === array[i].row && array[j].col === array[i].col && !array[j].fallDown) {
                        // （2，4） -> top层： (2,4)
                        array[i].canClick = false
                    }
                    if (array[j].row === array[i].row && array[j].col === array[i].col - 1 && !array[j].fallDown) {
                        // （2，4） -> top层： (2,3)
                        array[i].canClick = false
                    }
                    if (array[j].row === array[i].row - 1 && array[j].col === array[i].col && !array[j].fallDown) {
                        // （2，4） -> top层： (1，4)
                        array[i].canClick = false
                    }
                    if (array[j].row === array[i].row - 1 && array[j].col === array[i].col - 1 && !array[j].fallDown) {
                        // （2，4） -> top层： (1，3)
                        array[i].canClick = false
                    }

                }
            }
        }
        console.log('结果---》', this.boxDataFlat)
    }
}
