const dashBoard = ({
    canvasId = '',
    width = 375,
    // 定位
    position = {},
    ranges = [],
    bottomTexts = [],
    unit = '',
    value = '',
    isAnimation = true
}) => {
    // 默认配置
    const dfp = {
        articleWidth: 15, // 圆弧的宽
        min: 0, // 最小值
        max: 130, // 最大值
        color: "#132847", // 圆弧的颜色
        fontColor: '#B0D8F7' // 字体颜色
    };
    const x = width / 2,
        y = width / 2,
        radius = width * 0.8 / 2
    let p = Object.assign(dfp, {
        x,
        y,
        radius
    }, position);
    const arc = Math.PI / 180;
    const textAlign = "center";
    let animationRunIndex;
    //  动画渲染
    const animation = (newValue) => {
        newValue = parseInt(newValue) || 0;
        if (newValue === value) {
            return;
        }
        animationRunIndex = setTimeout(() => {
            // 动画速率
            const a = parseInt(Math.abs(newValue - value) / 4 + 1);
            drawBall(value);
            if (Math.abs(newValue - value) < 1) {
                value = newValue
            } else if (newValue > value) {
                value += a
            } else if (newValue < value) {
                value -= a
            }
            animation(newValue);
        }, 1000 / 16);
    }
    // 主渲染函数
    const drawBall = (newValue) => {
        const text = newValue >= 0 ? newValue.toString() : 0,
            ctx = wx.createContext(),
            level = getLevel(ranges, newValue),
            levelToLast = getLevel(ranges, value);
        // 圆弧
        drawRing(ctx);
        if (value > 0) {
            if (isAnimation) {
                // 值的圆弧
                drawRingToValue(ctx, text, level);
            } else {
                drawRingToValue(ctx, value + "", level);
            }
        }
        // 中心值
        drawCenterValue(ctx, value, levelToLast);
        // 底部文字
        drawBottomTexts(ctx, bottomTexts);
        if (!canvasId) {
            console.log("canvasId 不能为空");
            return;
        }
        wx.drawCanvas({
            canvasId: canvasId,
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
        ranges.map(item => {
            if (item.range[0] <= value && item.range[1] >= value) {
                level = item;
            }
        });
        return level;
    }
    // 关于值的圆弧
    const drawRingToValue = (ctx, value, level) => {
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
    const drawRing = (ctx) => {
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
    const drawCenterValue = (ctx, value) => {
        const fontSize = p.radius / 2.2,
            text = value >= 0 ? value.toString() : "-",
            d = text.length > 2 ? text.length * fontSize / 3.2 : text.length * fontSize / 2.6,
            level = getLevel(ranges || dfp.ranges, parseInt(text));
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(p.fontColor || dfp.fontColor);
        ctx.setTextAlign(textAlign);
        ctx.fillText(text, p.x - d / 2.2, p.y + fontSize / 4);
        if (value >= 0) {
            drawCorner(ctx, d + p.radius / 5, level);
        }
        drawUnit(ctx, d + p.radius / 5, unit);
    }
    //  角标
    const drawCorner = (ctx, d, level) => {
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
    const drawUnit = (ctx, d, unit) => {
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
    const changeValue = (newValue) => {
        animationRunIndex && clearTimeout(animationRunIndex);
        animation(newValue);
    };
    const changePosition = (newPosition) => {
        p = Object.assign(p, newPosition);
    }
    return {
        changeValue,
        changePosition
    }
};

export default dashBoard