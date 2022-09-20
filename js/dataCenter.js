import BoxInfo from './runtime/boxInfo'
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
        count: 0
    },
    {
        row: 3,
        column: 3,
        x: BOX_WIDTH / 2,
        y: BOX_HEIGHT / 2,
        count: 0
    },
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

        // boom
        this.animations = []

        this.reset()
        console.log(111)
        this.generaterBoxData()
        // attention: 
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
        let totalImgCount = 0
        layerList.map((layerItem, index) => {
            let tempList = []
            totalImgCount += layerItem.count
            for (let i = 0; i < layerItem.row; i++) {
                for (let j = 0; j < layerItem.column; j++) {
                    const boxItem = new BoxInfo(
                        i + 1,
                        j + 1,
                        index,
                        j * BOX_WIDTH + layerItem.x,
                        i * BOX_HEIGHT + layerItem.y,
                        IMGTYPE[index],
                        BOX_WIDTH,
                        BOX_WIDTH,
                        index,
                    );

                    tempList.push(boxItem)
                    this.boxDataFlat.push(boxItem)
                }
            }
            this.boxData.push(tempList)
        })

        // this.randomZeroFlag(this.boxDataFlat, 1)
        console.log("-->>boxDataFlat", this.boxDataFlat)
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
    }
}
