// pages/myprofile/profile.js
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null
    },


    onLoad: function () {
        let email = wx.getStorageSync('email');
        app.globalData.userInfo.email = email;
        this.setData({
            "userInfo": app.globalData.userInfo
        })
    },
    editEmail(){
        wx.navigateTo({
            url: '/pages/editemail/editemail'
        })
    }
})