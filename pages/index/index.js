//index.js
//获取应用实例
// const util = require("../../utils/util.js")
// const DB = require('../../utils/dashBoard.js')
import util from '../../utils/util.js'
import dashBoard from '../../utils/dashBoard.js'
import dashBoardConfig from '../../utils/dashBoardConfig.js'
const app = getApp()
Page({
    data: {
        address: "深圳市龙岗区",
        canvasWidth: 375,
        canvasHeight: 80,
        value: 0,
        // 圆盘配置 
        dashBoardConfig
    },
    setDashBoardToValue(newValue, DB) {
        DB.changeValue(newValue);
    },
    setRomValue(DB) {
        var ram = parseInt(Math.random() * 250);
        this.setData({
            value: ram
        });
        this.setDashBoardToValue(ram, DB);
    },
    onLoad() {
        this.setData({
            canvasWidth: util.getWindowWidthAndHeight().width
        });
        let {
            dashBoardConfig
        } = this.data;
        dashBoardConfig.width = this.data.canvasWidth * 0.8;
        this.setData({
            dashBoardConfig
        })
        let DB = dashBoard(this.data.dashBoardConfig);
        this.setRomValue(DB);
        let interval = setInterval(() => {
            this.setRomValue(DB);
        }, 1000);
        this.setData({
            interval
        });
    },
    unLoad() {
        clearInterval(this.data.interval);
    }
})