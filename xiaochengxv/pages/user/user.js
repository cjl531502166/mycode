// pages/user/user.js
const app = getApp();
Page({
    data: {
        userInfo: {}
    },
    onShow() {
        //获取绑定的邮箱
        let email = wx.getStorageSync('email');
        if (app.globalData.userInfo) {
            app.globalData.userInfo.email = email;
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    res.userInfo.email = email;
                    app.globalData.userInfo = res.userInfo;
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    onLoad() {
        
    }
})