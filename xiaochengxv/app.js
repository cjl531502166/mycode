//app.js
import One from './utils/one.js';
wx.showLoading.prototype.mask = true;
App({
    onLaunch: function () {
        // 登录
        let that = this;
        if (wx.getStorageSync('token')) {
            One.config.token = wx.getStorageSync('token')
        } else {
            wx.checkSession({
                success: () => {
                    One.config.token = wx.getStorageSync('token')
                },
                fail: () => {
                    wx.login({
                        success: res => {
                            let code = res.code;
                            //发送 res.code 到后台换取 openId, sessionKey, unionId
                            One.ajax(
                                'wxa/login',
                                {
                                    "code": code
                                },
                                res => {
                                    wx.setStorageSync('token', res.data.data.token);
                                    One.config.token = wx.getStorageSync('token');
                                }
                            )
                        }
                    })
                }
            })
        }

        //获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.globalData.userInfo = res.userInfo
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                            One.ajax('user/upload-info', res.userInfo, res => {

                            })
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    }
})