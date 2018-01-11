
const getWindowWidthAndHeight= () =>{
    let info ={};
    wx.getSystemInfo({
        success: res=>{
            info = {
                width: res.windowWidth,
                height: res.windowHeight
            }
        }
    });
    return info;
}

module.exports = {
    getWindowWidthAndHeight: getWindowWidthAndHeight
}
