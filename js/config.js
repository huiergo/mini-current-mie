export const BOX_WIDTH = 40;

export const BOX_HEIGHT = 40;

export const BOX_OFFSET_X = 50;

export const BOX_OFFSET_Y = 100;

//count 必须定义好，所有 count 相加 ， 被 3 整除
export const firstMap = {
    layerList: [
        {
            row: 3,
            column: 3,
            x: 0 + BOX_OFFSET_X,//第一层 起始点x
            y: 0 + BOX_OFFSET_Y,//第一层 起始点y
            count: 0
        },
        {
            row: 3,
            column: 3,
            x: BOX_WIDTH / 2 + BOX_OFFSET_X,
            y: BOX_HEIGHT / 2 + BOX_OFFSET_Y,
            count: 0
        },
    ],
    typeCount: 3
};

export const secondMap = {
    layerList: [
        {
            row: 5,
            column: 6,
            x: 0 + BOX_OFFSET_X,//第一层 起始点x
            y: 0 + BOX_OFFSET_Y,//第一层 起始点y
            count: 2
        },
        {
            row: 4,
            column: 5,
            x: BOX_WIDTH / 2 + BOX_OFFSET_X,
            y: BOX_HEIGHT / 2 + BOX_OFFSET_Y,
            count: 3
        }
    ],
    typeCount: 5
}

export const imageList = {
    1: 'images/person1.png',
    2: 'images/person2.png',
    3: 'images/person3.png',
    4: 'images/person4.png',
    5: 'images/person5.png',
    6: 'images/person6.png',
}