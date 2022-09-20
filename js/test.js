function dispearSame(array, count) {
    // let array = deepClone(paramsArr)
    for (let i = 0; i < array.length; i++) {
        //  如果有一个不相等， i 就需要移动到当前 j 的位置
        // 如果都相等 ， 1. 消除3个， 2  i 移动到最后一个 j的位置

        let flag = 1 // 判断 flag === count
        let flagIndexList = []  // 设置 满足条件 的元素 dispear = true
        let c = 1 // 控制 j 加加的次数

        for (let j = i + c; c < count; j++) {
            console.log(i, j, c)
            if (array[i] && array[j] && array[i].elementType === array[j].elementType) {
                flag++
                flagIndexList.push(j)
            }
            c++

            console.log('---> for : ', flag)


        }
        if (flag === count) {
            console.log('----> 相等 ')
            flagIndexList.push(i)
            i = i + count - 1
            flagIndexList.forEach(item => {
                array[item].dispear = true
            })
        }

    }
    // return array
}


let array = [
    {
        elementType: 1,
        dispear: false
    },
    {
        elementType: 1,
        dispear: false
    },
    {
        elementType: 1,
        dispear: false
    },
    {
        elementType: 3,
        dispear: false
    },
    {
        elementType: 2,
        dispear: false
    },
    {
        elementType: 2,
        dispear: false
    },
    {
        elementType: 2,
        dispear: false
    },
    {
        elementType: 2,
        dispear: false
    },
    {
        elementType: 2,
        dispear: false
    }
]

dispearSame(array, 3)
console.log(array)