const dashBoardConfig = {
    canvasId: "dashBoard", // canvas 的 Id
    position: {
        // x: 150, // 圆心 X 坐标
        // y: 150, // 圆心 y 坐标
        // radius: 120, // 半径
        articleWidth: 15, // 圆弧的宽
        min: 0, // 最小值
        max: 250, // 最大值
        color: "#132847", // 圆弧的颜色
        fontColor: '#B0D8F7', // 字体颜色
        
    },
    isAnimation: true,
    width: 375,
    value: 0, // 结束值
    unit: "μg/m³", // 下标单位
    // 圆弧及上标显示值的范围参数设置
    // 底部文字与颜色
    bottomTexts: {
        "airVolume": {
            color: "#B0D8F7",
            value: 0,
            getTextToValue: "风量 {{value}} m³/h"
        },
        "filterElement": {
            color: "#B0D8F7",
            value: 0,
            getTextToValue: "滤芯:{{value}}%"
        }
    },
    ranges: [{
        name: "优",
        range: [1, 35],
        color: "#00e400",
        fontColor: "#ffffff"
    }, {
        name: "良",
        range: [36, 75],
        color: "#ffff00",
        fontColor: "#666666"
    }, {
        name: "轻度污染",
        range: [76, 115],
        color: "#e17e00",
        fontColor: "#ffffff"
    }, {
        name: "中度污染",
        range: [116, 150],
        color: "#ff0000",
        fontColor: "#ffffff"
    }, {
        name: "重度污染",
        range: [151, 250],
        color: "#99004e",
        fontColor: "#ffffff"
    }, {
        name: "严重污染",
        range: [250, 250],
        color: "#7e0023",
        fontColor: "#ffffff"
    }]
}
export default dashBoardConfig