import { firstMap, secondMap, imageList, BOX_WIDTH, BOX_HEIGHT } from '../config';
import BoxInfo from '../runtime/boxInfo'

/**
 * 数组交换
 */
export function swap(array, orginIndex, targetIndex) {
    let temp = array[targetIndex]
    array[targetIndex] = array[orginIndex]
    array[orginIndex] = temp
}

/**
* 洗牌算法:
* 该方法就是每次在数组中随机产生一个位置，依次将数组中的每一项与该次产生的随机位置上的元素交换位置：
* @param {arr} 即将重排的数组 
* @returns 重排后的数组
*/
export function shuffle(arr) {
    var l = arr.length
    var index, temp
    while (l > 0) {
        index = Math.floor(Math.random() * l)
        temp = arr[l - 1]
        arr[l - 1] = arr[index]
        arr[index] = temp
        l--
    }
    return arr
}

/**
* 抽牌算法： 从总数中，抽取多少个数
* @param array 
* @param count 随机多少个数
*/
export function randomZeroFlag(array, count) {
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

/**
* 生成box对象算法： 
* @param boxData 
* @param array
*/
export function generaterBoxData(boxData, array, level) {
    let totalImgCount = 0
    let gameMap = level == 1 ? firstMap : secondMap
    console.log(gameMap)
    gameMap.layerList.map((layerItem, index) => {
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
                    imageList[1],
                    BOX_WIDTH,
                    BOX_WIDTH,
                );

                tempList.push(boxItem)
                array.push(boxItem)
            }
        }
        boxData.push(tempList)
    })

    randomZeroFlag(array, totalImgCount)

    fillRandomBox(array, gameMap.typeCount)
}

export function judgeOverlay(boxDataFlat) {
    // 如果从第一层开始判断每个元素， 那么有n层的 四个判断， 所以就是 (n-1)*  4次比较
    let array = boxDataFlat;
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

// 判断3个就消除: 
// 扩展算法： 连着几个消掉
export function willRemoveSame(array, count) {
    // let array = deepClone(paramsArr)
    for (let i = 0; i < array.length; i++) {
        //  如果有一个不相等， i 就需要移动到当前 j 的位置
        // 如果都相等 ， 1. 消除3个， 2  i 移动到最后一个 j的位置

        let flag = 1 // 判断 flag === count
        let flagIndexList = []  // 设置 满足条件 的元素 willRemove = true
        let c = 1 // 控制 j 加加的次数

        for (let j = i + c; c < count; j++) {
            console.log(i, j, c)
            if (array[i] && array[j] && array[i].elementType === array[j].elementType) {
                flag++
                flagIndexList.push(j)
            }
            c++
        }
        if (flag === count) {
            flagIndexList.push(i)
            i = i + count - 1
            flagIndexList.forEach(item => {
                array[item].setWillRemove(true)
            })
        }
    }
}

export function insertElementToArray(array, box) {
    // 具体插入到哪个位置
    let insertIndex = 0;
    let hasSimple = false;

    // 判断插入到什么位置
    array.forEach(element => {
        if (box.elementType == element.elementType) {
            hasSimple = true;
            insertIndex++;
        } else {
            if (hasSimple) return
            else {
                insertIndex++;
            }
        }
    });

    // 插入操作
    if (array.length == insertIndex) {
        array.push(box)
    } else {
        array.splice(insertIndex, 0, box)
    }
}

/**
* 随机box type算法 
* @param typeCount 
* @param array
*/
function fillRandomBox(array, typeCount) {
    if (array.length % 3 != 0) {
        return
    }

    let elementTypeList = []
    let elementType = 0
    let singleCount = Math.floor(array.length / typeCount)
    for (let index = 0; index < array.length; index++) {
        if (index % singleCount == 0) {
            elementType++;
        }
        // 依次生成 111 222 333
        elementTypeList.push(elementType);
    }

    console.log(singleCount, elementTypeList)

    //打乱顺序
    shuffle(elementTypeList)

    // 给打乱后的数组，依次赋值 type类型和imgsrc
    elementTypeList.forEach((type, index) => {
        array[index].setElementType(type)
        array[index].setImgSrc(imageList[type])
    });
}