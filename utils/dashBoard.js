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
    let p = Object.assign({}, dfp, position)
    const {
        x,
        y,
        radius,
        articleWidth,
        max,
        color,
        fontColor,
        textAlign
    } = p
    const arc = Math.PI / 180,
        PI2 = Math.PI * 2,
        arc45 = arc * 45,
        radiusToArticle = articleWidth / 2
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
            console.log('canvasId 不能为空')
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
    // 当前值的圆弧
    const drawRingToValue = (ctx, value, {
        color
    }) => {
        const m = radius - radiusToArticle,
            ring = 270 / max,
            valueRing = (value < max ? value : max) * ring,
            arcValueRing = arc * valueRing,
            startRrc = arc45 * 3,
            endRrc = startRrc + arcValueRing
        // 外圆弧
        ctx.beginPath(0)
        ctx.arc(x, y, m, startRrc, endRrc, false)
        ctx.setLineWidth(articleWidth)
        ctx.setStrokeStyle(color)
        ctx.stroke()
        ctx.closePath()
        ctx.setFillStyle(color)
        ctx.setStrokeStyle(p.color)
        // 两个圆角
        ctx.beginPath(0)
        // 结束圆角
        ctx.arc(
            x - Math.cos(arcValueRing - arc45) * m,
            y - Math.sin(arcValueRing - arc45) * m,
            radiusToArticle,
            endRrc,
            endRrc + PI2,
            false)
        ctx.fill()
        ctx.closePath()
        // 开始圆角
        ctx.beginPath(0)
        ctx.arc(
            x - Math.sin(startRrc) * m,
            y - Math.cos(startRrc) * m,
            radiusToArticle,
            arc45 * 7,
            arc45 * 15,
            false)
        ctx.fill()
        ctx.closePath()
    };
    // 圆弧
    const drawRing = (ctx) => {
        const m = radius - radiusToArticle,
            startArc = arc45 * 3,
            endArc = arc45
        ctx.beginPath(0);
        // 弧
        ctx.arc(x, y, m, startArc, endArc + PI2)
        ctx.setLineWidth(articleWidth)
        ctx.setStrokeStyle(color)
        ctx.stroke()
        ctx.closePath()
        // 两个圆角
        ctx.setFillStyle(color)
        ctx.setStrokeStyle(color)
        ctx.beginPath(0)
        // 结束圆角
        ctx.arc(x + Math.sin(endArc) * m, y + Math.cos(endArc) * m, radiusToArticle, endArc, arc45 * 6)
        ctx.fill()
        ctx.closePath()

        ctx.beginPath(0)
        // 开始圆角
        ctx.arc(x - Math.sin(startArc) * m, y - Math.cos(startArc) * m, radiusToArticle, arc45 * 7, arc45 * 11)
        ctx.fill()
        ctx.closePath()
    };
    // 中心数值
    const drawCenterValue = (ctx, value) => {
        const fontSize = radius / 2.2,
            text = value >= 0 ? value.toString() : '-',
            textLength = text.length,
            d = textLength * fontSize / (textLength > 2 ? 3.2 : 2.6),
            level = getLevel(value)
        ctx.setFontSize(fontSize)
        ctx.setFillStyle(fontColor)
        ctx.setTextAlign(textAlign)
        ctx.fillText(text, x - d / 2.2, y + fontSize / 4)
        if (value >= 0) {
            drawCorner(ctx, d + radius / 5, level)
        }
        drawUnit(ctx, d + radius / 5);
    }
    //  角标
    const drawCorner = (ctx, d, {
        fontColor,
        name = '',
        color
    }) => {
        d = d / 1.5
        const fs = radius / 6
        ctx.beginPath(0)
        ctx.setFillStyle(color)
        ctx.arc(x + d - fs / 1.5, y - fs, fs / 2, arc45 * 2, arc45 * 6)
        ctx.arc(x + d + fs / 1.5, y - fs, fs / 2, arc45 * 6, arc45 * 10)
        ctx.fill();
        ctx.setFontSize(fs / 2.2)
        ctx.setFillStyle(fontColor)
        ctx.setTextAlign(textAlign)
        ctx.fillText(name, x + d, y - fs / 1.2)
    };
    // 单位
    const drawUnit = (ctx, d) => {
        const fs = radius / 5
        ctx.setFontSize(fs / 2)
        ctx.setFillStyle(fontColor)
        ctx.setTextAlign(textAlign)
        ctx.fillText(unit, x + d / 1.5, y + fs / 2.3)
    };
    // 底部文字
    const drawBottomTexts = (ctx) => {
        ctx.setFontSize(radius * 0.12)
        ctx.setTextAlign(textAlign)
        let ty = y + radius * 0.72
        bottomTexts.map(({
            getTextToValue = '',
            value,
            color
        }, i) => {
            const text = (getTextToValue).replace(/{{value}}/g, value)
            ty += radius * 0.25 * i
            ctx.setFillStyle(color)
            ctx.fillText(text, x, ty)
        });
    };
    const changeValue = (newValue) => {
        animationRunIndex && clearTimeout(animationRunIndex)
        animation(newValue)
    };
    const changePosition = (newPosition) => {
        p = Object.assign(p, newPosition)
    }
    const setBottomTexts = (newBottomTexts) => {
        bottomTexts = newBottomTexts
    }
    return {
        changeValue,
        changePosition,
        setBottomTexts
    }
};

export default dashBoard