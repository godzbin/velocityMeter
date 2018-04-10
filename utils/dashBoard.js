const dashBoard = ({
    canvasId = '',
    width = 375,
    position = {},
    ranges = [],
    bottomTexts = [],
    unit = '',
    value = '',
    isAnimation = true
}) => {
    // 默认配置
    const dfp = {
        x: width / 2,
        y: width / 2,
        radius: width * 0.8 / 2,
        articleWidth: 15, // 圆弧的宽
        min: 0, // 最小值
        max: 130, // 最大值
        color: '#132847', // 圆弧的颜色
        fontColor: '#B0D8F7', // 字体颜色
        textAlign: 'center'
    };
    const arc = Math.PI / 180

    let p = Object.assign({}, dfp, position)
    let animationRunIndex
    //  动画渲染
    const animation = (newValue) => {
        newValue = newValue || 0
        animationRunIndex = setTimeout(() => {
            // 动画速率
            if (Math.abs(newValue - value) < 3) {
                value = newValue
            } else {
                value += parseInt((newValue - value) / 3)
            }
            drawBall()
            newValue !== value && animation(newValue)
        }, 1000 / 16)
    }
    // 主渲染函数
    const drawBall = (newValue) => {
        const ctx = wx.createContext(),
            levelToLast = getLevel(value)
        // 圆弧
        drawRing(ctx)
        // 当前值的实体圆弧
        drawRingToValue(ctx, value + '', levelToLast)
        // 中心值
        drawCenterValue(ctx, value, levelToLast)
        // 底部文字
        drawBottomTexts(ctx)
        if (!canvasId) {
            console.log("canvasId 不能为空")
            return
        }
        wx.drawCanvas({
            canvasId: canvasId,
            actions: ctx.getActions()
        });
    };
    // 获取范围等级
    const getLevel = (value) => {
        let level = {}
        ranges.map(item => {
            const range = item.range
            if (range[0] <= value && range[1] >= value) {
                level = item
            }
        });
        return level
    }
    // 关于值的圆弧
    const drawRingToValue = (ctx, value, level) => {
        let aw = p.articleWidth,
            m = p.radius - aw / 2,
            ring = 270 / p.max,
            vr = value <= p.max ? (value * ring) : (p.max * ring),
            startRrc = arc * 3 * 45,
            endRrc = startRrc + (arc * vr);
        // 外圆弧
        ctx.beginPath(0);
        ctx.arc(p.x, p.y, m, startRrc, endRrc, false);
        ctx.setLineWidth(aw);
        ctx.setStrokeStyle(level.color);
        ctx.stroke();
        ctx.closePath();
        ctx.setFillStyle(level.color);
        ctx.setStrokeStyle(p.color);
        // 两个圆角
        ctx.beginPath(0);
        // 结束圆角
        ctx.arc(p.x - Math.cos(arc * (vr - 45)) * m,
            p.y - Math.sin(arc * (vr - 45)) * m,
            aw / 2,
            endRrc,
            endRrc + Math.PI * 2,
            false);
        ctx.fill();
        ctx.closePath();
        // 开始圆角
        ctx.beginPath(0);
        ctx.arc(
            p.x - Math.sin(startRrc) * m,
            p.y - Math.cos(startRrc) * m,
            aw / 2,
            arc * 7 * 45,
            arc * 15 * 45,
            false);
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
            textLength = text.length,
            d = textLength > 2 ? textLength * fontSize / 3.2 : textLength * fontSize / 2.6,
            level = getLevel(value);
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(p.fontColor || dfp.fontColor);
        ctx.setTextAlign(p.textAlign);
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
        ctx.setTextAlign(p.textAlign);
        ctx.fillText(name, p.x + d, p.y - fs / 1.2);
    };
    // 单位
    const drawUnit = (ctx, d, unit) => {
        const fs = p.radius / 5;
        ctx.setFontSize(fs / 2);
        ctx.setFillStyle(p.fontColor);
        ctx.setTextAlign(p.textAlign);
        ctx.fillText(unit, p.x + d / 1.5, p.y + fs / 2.3);
    };
    // 底部文字
    const drawBottomTexts = (ctx) => {
        ctx.setFontSize(p.radius * 0.12);
        ctx.setTextAlign(p.textAlign);

        let y = p.y + p.radius * 0.72;
        bottomTexts.map((item, i) => {
            const text = (item.getTextToValue || "").replace(/{{value}}/g, item.value);
            y += p.radius * 0.25 * i;
            ctx.setFillStyle(item.color);
            ctx.fillText(text, p.x, y);
        });
    };
    const changeValue = (newValue) => {
        animationRunIndex && clearTimeout(animationRunIndex);
        animation(newValue);
    };
    const changePosition = (newPosition) => {
        p = Object.assign(p, newPosition);
    }
    const setBottomTexts = (newBottomTexts) => {
        bottomTexts = newBottomTexts;
    }
    return {
        changeValue,
        changePosition,
        setBottomTexts
    }
};

export default dashBoard