
const dashBoard = data => {
    // 默认配置
    const dfp = {
        x: 150, // 圆心 X 坐标
        y: 150, // 圆心 y 坐标
        radius: 120, // 半径
        articleWidth: 15, // 圆弧的宽
        min: 0, // 最小值
        max: 130, // 最大值
        color: "#132847", // 圆弧的颜色
        fontColor: '#B0D8F7', // 字体颜色
        isAnimation: true,
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
    };
    const p = data.position || dfp;
    p.x = data.width / 2;
    p.y = data.width / 2;
    p.radius = data.width * 0.8 / 2;
    const arc = Math.PI / 180;
    const textAlign = "center";
    //  动画渲染
    const animation = value => {
        value = parseInt(value) || 0;
        setTimeout(() => {
            // 动画速率
            const a = parseInt(Math.abs(value - data.value) / 8 + 1);
            drawBall(data, value);
            if (value > data.value) {
                value -= a;
                animation(value);
            } else if (value < data.value) {
                value += a;
                animation(value);
            }
        }, 17);
    }
    // 主渲染函数
    const drawBall = (data, value) => {
        const text = value  >= 0? value.toString() : 0,
            ctx = wx.createContext(),
            level = getLevel(data.ranges || dfp.ranges, value),
            levelToLast = getLevel(data.rangs || dfp.ranges, data.value);
        // 圆弧
        drawRing(ctx, data);
        if(data.value > 0){
            var isAnimation = data.hasOwnProperty("isAnimation") ? data.isAnimation : dpf.isAnimation; 
            if (isAnimation ){
                // 值的圆弧
                drawRingToValue(ctx, data, text, level);
            }else{
                drawRingToValue(ctx, data, data.value + "", level);
            }
        }
        // 中心值
        drawCenterValue(ctx, data, data.value, levelToLast);
        // 底部文字
        drawBottomTexts(ctx, data.bottomTexts);
        if (!data.canvasId) {
            console.log("canvasId 不能为空");
            return;
        }
        wx.drawCanvas({
            canvasId: data.canvasId,
            actions: ctx.getActions()
        });
    };
    // 获取范围等级
    const getLevel = (ranges, value) => {
        ranges = ranges || dfp.ranges;
        value = value || 0;
        var level = ranges.length > 1 ? ranges[ranges.length - 1] : {};
        if (value === 0) {
            level = {};
        }
        ranges.map(data => {
            if (data.range[0] <= value && data.range[1] >= value) {
                level = data;
            }
        });
        return level;
    }
    // 关于值的圆弧
    const drawRingToValue = (ctx, data, value, level) => {
        const aw = p.articleWidth || dfp.articleWidth,
            m = p.radius - aw / 2,
            ring = 270 / p.max,
            vr = value <= p.max ? (value * ring) : (p.max * ring),
            startRrc = arc * 3 * 45,
            endRrc = startRrc + (arc * vr);
        ctx.beginPath(0);
        // 外圆弧
        ctx.arc(p.x, p.y, p.radius - aw / 2, startRrc, endRrc, false);
        ctx.setLineWidth(aw);
        ctx.setStrokeStyle(level.color);
        ctx.stroke();
        ctx.closePath();
        ctx.setFillStyle(level.color);
        ctx.setStrokeStyle(p.color || dfp.color);
        ctx.beginPath(0);
        // 结束圆角
        ctx.arc(p.x - Math.cos(arc * (vr - 45)) * m,
            p.y - Math.sin(arc * (vr - 45)) * m,
            aw / 2, endRrc, endRrc + Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        // 开始圆角
        ctx.beginPath(0);
        ctx.arc(p.x - Math.sin(startRrc) * m, p.y - Math.cos(startRrc) * m, aw / 2, arc * 7 * 45, arc * 15 * 45, false);
        ctx.fill();
        ctx.closePath();
    };
    // 圆弧
    const drawRing = (ctx, data) => {
        const arc45 = arc * 45,
            articleWidth = p.articleWidth || dfp.articleWidth,
            radiusToArticle = articleWidth / 2,
            m = p.radius - articleWidth / 2,
            startArc = arc45 * 3,
            endArc = arc45;
        ctx.beginPath(0);
        // 弧
        ctx.arc(p.x, p.y, p.radius - radiusToArticle, startArc, endArc + Math.PI * 2);
        ctx.setLineWidth(articleWidth);
        ctx.setStrokeStyle(p.color || dfp.color);
        ctx.stroke();
        ctx.closePath();
        // 两个圆角
        ctx.setFillStyle(p.color || dfp.color);
        ctx.setStrokeStyle(p.color || dfp.color);
        ctx.beginPath(0);
        // 结束圆角
        ctx.arc(p.x + Math.sin(endArc) * m, p.y + Math.cos(endArc) * m, radiusToArticle, endArc, endArc + arc45 * 5);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath(0);
        // 开始圆角
        ctx.arc(p.x - Math.sin(startArc) * m, p.y - Math.cos(startArc) * m, radiusToArticle, arc45 * 7, arc45 * 11);
        ctx.fill();
        ctx.closePath();
    };
    // 中心数值
    const drawCenterValue = (ctx, data, value) => {
        const fontSize = p.radius / 2.2,
            text = value >= 0 ? value.toString() : "-",
            d = text.length > 2 ? text.length * fontSize / 3.2 : text.length * fontSize / 2.6,
            level = getLevel(data.ranges || dfp.ranges, parseInt(text)),
            unit = data.unit;
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(p.fontColor || dfp.fontColor);
        ctx.setTextAlign(textAlign);
        ctx.fillText(text, p.x - d / 2.2, p.y + fontSize / 4);
        if (data.value >= 0) {
            drawCorner(ctx, data, d + p.radius / 5, level);
        }
        drawUnit(ctx, data, d + p.radius / 5, unit);
    }
    //  角标
    const drawCorner = (ctx, data, d, level) => {
        const name = level.name || "",
            fs = p.radius / 6,
            arc45 = arc * 45;
        d = d / 1.5;
        ctx.beginPath(0);
        ctx.setFillStyle(level.color);
        ctx.arc(p.x + d - fs / 1.5, p.y - fs, fs / 2, arc45 * 2, arc45 * 6);
        ctx.arc(p.x + d + fs / 1.5, p.y - fs, fs / 2, arc45 * 6, arc45 * 10);
        ctx.fill();
        ctx.setFontSize(fs / 2.2);
        ctx.setFillStyle(level.fontColor || dfp.fontColor);
        ctx.setTextAlign(textAlign);
        ctx.fillText(name, p.x + d, p.y - fs / 1.2);
    };

    // 单位
    const drawUnit = (ctx, data, d, unit) => {
        const fs = p.radius / 5;
        d = d / 1.5;
        ctx.setFontSize(fs / 2);
        ctx.setFillStyle(p.fontColor || dfp.fontColor);
        ctx.setTextAlign(textAlign);
        ctx.fillText(unit, p.x + d, p.y + fs / 2.3);
    };
    // 底部文字
    const drawBottomTexts = (ctx, bottomTexts) => {
        ctx.setFontSize(p.radius * 0.12);
        ctx.setTextAlign(textAlign);
        var l = 0;
        for (var i in bottomTexts) {
            var item = bottomTexts[i];
            const y = p.y + p.radius * 0.72 + (p.radius * 0.25 * l);
            var text = item.getTextToValue || "";
            text = text.replace(/{{value}}/g, item.value);
            ctx.setFillStyle(item.color || dfp.fontColor);
            ctx.fillText(text || "", p.x, y);
            l++;
        }

    };
    // 执行动画
    animation(data.initValue);
};

module.exports = {
    dashBoard: dashBoard
}