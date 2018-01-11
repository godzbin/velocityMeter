//index.js
//获取应用实例
const util = require("../../utils/util.js")
const DB = require('../../utils/dashBoard.js')
const app = getApp()

Page({
    data: {
        address: "深圳市龙岗区",
        statusToSwitch: false,
        statusToAuto: false,
        disableToSwitch: false,
        disableToAuto: true,
        canvasWidth: 375,
        canvasHeight: 80,
        value: 0,
        // 圆盘配置 
        dashBoard: {
            canvasId: "dashBoard", // canvas 的 Id
            position: {
                // x: 150, // 圆心 X 坐标
                // y: 150, // 圆心 y 坐标
                // radius: 120, // 半径
                articleWidth: 15, // 圆弧的宽
                min: 0, // 最小值
                max: 250, // 最大值
                color: "#132847", // 圆弧的颜色
                fontColor: '#B0D8F7' // 字体颜色
            },
            isAnimation: true,
            width: 375,
            initValue: 0, // 初始值
            value: -1, // 结束值
            unit: "μg/m³", // 下标单位
            // 圆弧及上标显示值的范围参数设置
            // ranges: [],
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
            }
        },

        // 档位配置
        levels: [1, 2, 3, 4, 5],
        levelValue: 0
    },
    setDashBoardToValue: function(newValue) {
        var dashBoardConfigs = this.data.dashBoard;
        dashBoardConfigs.initValue = dashBoardConfigs.value;
        dashBoardConfigs.value = newValue;
        this.setData({ dashBoard: dashBoardConfigs });
        DB.dashBoard(this.data.dashBoard);
    },

    setRomValue: function () {
        var ram = parseInt(Math.random() * 250);
        this.setData({ value: ram });
        this.setDashBoardToValue(ram);
    },
    selectLevel: function (e) {
        var $value = e.currentTarget.dataset.value;
        this.setData({
            levelValue: $value
        });
    },
    onLoad: function () {
        const width = util.getWindowWidthAndHeight().width;
        const self = this;
        this.setData({ canvasWidth: width });
        this.data.dashBoard.width = width * 0.8;
        console.log(this.data.dashBoard);
        self.setRomValue();
        const interval = setInterval(function () {
            self.setRomValue();
        }, 1000);
        this.setData({
            interval: interval
        });

    },
    unLoad: function () {
        clearInterval(this.data.interval);
    },
    touchSwitch: function (e) {
        if (!this.data.disableToSwitch) {
            this.setData({ statusToSwitch: !this.data.statusToSwitch });
        }
    },
    touchAuto: function (e) {
        if (!this.data.disableToAuto) {
            this.setData({ statusToAuto: !this.data.statusToAuto });
        }
    }
})
