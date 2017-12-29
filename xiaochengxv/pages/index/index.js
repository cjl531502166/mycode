//index.js
//获取应用实例
const app = getApp()
import M from '../../components/modals/common.js';
import newsModel from '../../models/news.model.js';
import newsSevice from '../../services/news.service.js';
import deliveryConfig from '../../models/delivery.config.js';
import deliveryService from '../../services/delivery.service.js';
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        inputVal: '',
        RadioModalHidden: '',//radiogroup 模态框隐藏状态
        isEmailBind: '',//邮箱绑定状态
        newsModel: newsModel,
        radioItem: null,
        orderType: '', //物流订单类型
        emailAddr: '', //邮箱地址
        errMsg: ''//错误提示
    },
    onShow: function () {
        newsSevice.getNews(()=>{
            this.setData({
                newsModel: newsModel
            })
        });
        
        // 初始化所有数据
        this.setData({
            "radioItem": [
                {
                    "value": "德国境内单",
                    "name": "germany",
                    "checked": true
                }, {
                    "value": "欧盟境内单",
                    "name": "europ"
                }, {
                    "value": "国际包裹单",
                    "name": "international"
                }
            ],
            emailAddr: '',
            orderType: '',
            inputVal: '',
            errMsg: '',
            RadioModalHidden: true
        })       
        // 初始化默认物流订单类型
        this.data.radioItem.map((item, index) => {
            item.checked && (this.data.orderType = item.name);
        })

        //判断是否绑定邮箱
        if (wx.getStorageSync('email')) {
            this.setData({ 'isEmailBind': true })
        } else {
            this.setData({ 'isEmailBind': false })
        }
    },
    onLoad: function () {
        wx.showLoading();
    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    // 获取输入物流单号
    getDeliveryNo(e) {
        this.data.inputVal = e.detail.value;
    },
    //获取输入邮箱
    getEmailArr(e) {
        this.data.emailAddr = e.detail.value;
    },
    // 查询快递单号
    trackPkg() {
        //输入验证
        let value = this.data.inputVal.replace(/(\s*$)/g, '');
        if (!value) {
            this.data.errMsg = '快递单号不能为空';
        }
        else if (!(/^[a-zA-Z0-9]+$/.test(value))) {
            this.data.errMsg = '您输入的快递单号格式不正确';
        }
        else if (value.length < 13) {
            this.data.errMsg = '请输入13位快递单号';
        } else {
            //操作
            wx.navigateTo({
                url: '/pages/delivery_detail/delivery_detail?tracknum=' + value
            })
            return false;
        }
        M._alert(this.data.errMsg);
    },
    radioChange(e) {
        this.data.orderType = e.detail.value;
    },
    tapHandle(e) {
        let url = e.currentTarget.dataset.url;
        if (url == '/pages/delivery/delivery') {
            return this.setData({ "RadioModalHidden": false })
        }
        // 页面跳转
        wx.navigateTo({
            url: url
        })
    },
    // 选择物流类型
    deliveryType() {
        this.setData({ "RadioModalHidden": true });
        wx.navigateTo({
            url: '/pages/delivery/delivery'
        })
        deliveryConfig.orderType = this.data.orderType;
    },
    seeMore() {
        wx.navigateTo({
            url: '/pages/news_notices/news_notice'
        })
    },
    // 绑定邮箱
    bindEmailHandle() {
        let email = this.data.emailAddr,
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
            this.setData({ errMsg: "" })
            wx.setStorageSync("email", email);
            //邮箱绑定成功的操作
            this.setData({ "isEmailBind": true })
        }
    }
})
