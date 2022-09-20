function deepClone(obj = {}) {
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }

    let result
    if (obj instanceof Array) {
        result = []
    } else {
        result = {}
    }

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = deepClone(obj[key])
        }
    }

    return result
}

export function swap(array, orginIndex, targetIndex) {
    let temp = array[targetIndex]
    array[targetIndex] = array[orginIndex]
    array[orginIndex] = temp
}