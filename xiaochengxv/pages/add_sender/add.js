// pages/add_sender/add.js
import M from '../../components/modals/common.js';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sender: '',
        contact: '',
        street: '',
        houseNo: '',
        postCode: '',
        extraInfo: '',
        city: '',
        country: 'Germany',
        saveAddr: true,
        fromPage: null
    },

    onLoad: function (options) {
        this.setData({
            "fromPage": options.page ? options.page : null
        })
    },

    onShow: function () {

    },
    getName(e) {
        let reg = /[a-zA-Z]/,
            val = e.detail.value.replace(/\s/ig, '');
        if (val && !reg.test(val)) {
            M._alert('发件人姓名必须是英文')
            return
        }
        this.data.sender = e.detail.value;
    },
    getTel(e) {
        let regxPhone = /^1[34578]\d{9}$/,
            regxTel = /^(([0\+]\d{2,3})?(0\d{2,3}))(\d{7,8})((\d{3,}))?$/,
            tel = e.detail.value;
        if (tel && !(regxPhone.test(tel) || regxTel.test(tel))) {
            M._alert('固话或者手机号码格式不正确\n，固话请加区号');
            return;
        }
        this.data.contact = e.detail.value;
    },
    getStreet(e) {
        let reg = /[a-zA-Z]/,
            val = e.detail.value;
        if (val && !reg.test(val)) {
            M._alert('街道信息必须为英文')
            return
        }
        this.data.street = e.detail.value
    },
    getHouseNo(e) {
        let val = e.detail.value.replace(/\s/ig, '');
        if (val && isNaN(val)) {
            M._alert('门牌号必须为数字')
            return
        }
        this.data.houseNo = e.detail.value;
    },
    checkPostcode(e) {
        let val = e.detail.value.replace(/\s/ig, '');
        if (val && (isNaN(val) || val.length < 5)) {
            M._alert('邮政编码必须位5位数字')
            return
        }
        this.data.postCode = e.detail.value
    },
    getCity(e) {
        let val = e.detail.value,
            reg = /[a-zA-Z]/;
        if (val && !reg.test(val)) {
            M._alert('城市必须为英文')
            return
        }
        this.data.city = e.detail.value;
    },
    checkboxChange(e) {
        this.data.saveAddr = e.detail.value[0] ? 1 : 0;
    },
    saveHandle() {
        let senderInfo = '';
        if (this.data.sender == '') {
            M._alert('请填写发件人');
            return
        }
        if (this.data.street == '') {
            M._alert('请填写街道信息');
            return
        }
        if (this.data.houseNo == '') {
            M._alert('请填写门牌号');
            return
        }
        if (this.data.postCode == '') {
            M._alert('请填写邮政编码');
            return
        }
        if (this.data.city == '') {
            M._alert('请填写所在城市');
            return
        }
        senderInfo = {
            "sender": this.data.sender,
            "contact": this.data.contact,
            "postCode": this.data.postCode,
            "address": this.data.extraInfo + ' ' + this.data.houseNo + ' ' + this.data.street + ' ' + this.data.city + ' ' + this.data.country,
            "default": this.data.saveAddr,
        }
        if (this.data.fromPage == 'order') {
            app.globalData.currSender = senderInfo
            if (this.data.saveAddr) {
                app.globalData.senderList.forEach((item, index, array) => {
                    array.default = false;
                })
                // 发ajax 请求然后回到下单页面
            } else {
                wx.navigateTo({
                    url: '/pages/delivery/delivery'
                })
            }
        } else {
            wx.navigateTo({
                url: '/pages/sender/sender'
            })
        }

    }
})