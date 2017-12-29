// pages/editemail/editemail.js
import M from '../../components/modals/common.js';
const app = getApp();
Page({

    data: {
        userEmail: null,
        errMsg:""
    },

    onLoad: function () {
        this.setData({
            "userEmail":wx.getStorageSync('email')
        })
    },
    getEmail(e){
        this.data.userEmail = e.detail.value;
        console.log(e.detail.value)
    },
    changeEmail(){
        let email = this.data.userEmail,
            reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (!email) {
            this.setData({
                errMsg: "请输入邮箱地址"
            })
        }
        else if (!reg.test(email)) {
            this.setData({
                errMsg: "请输入正确的邮箱地址"
            })
        }
        else {
            this.setData({ errMsg: "修改成功" })
            wx.setStorageSync("email", email);
            wx.showToast({
                title: '修改成功',
            });
        }
    }
})