// pages/delivery/delivery.js
import M from '../../components/modals/common.js';
import One from '../../utils/one.js'
import deliveryConfig from '../../models/delivery.config.js';
import deliveryService from '../../services/delivery.service.js';
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        delivery_range: null,//订单类型
        deliveryConfig: deliveryConfig, //物流渠道
        senderInfo: null,//发件人信息
        receiverInfo: null,//收件人信息
        invoiceInfo: null, //发票信息
        invoice_switch: null,//是否需要发票
        amount: 0,//订单总金额
        totalWeight: 0,//包裹总重量
        pkgList: [],
        isOK: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        // 初始化数据
        wx.showLoading()
        let totalWeight = 0,
            amount = 0,
            delivery_range = deliveryConfig.orderType,
            deliver_type = deliveryConfig.deliver_type,
            invoice_switch = deliveryConfig.invoice_switch,
            senderInfo = deliveryConfig.currSender ? deliveryConfig.currSender : deliveryConfig.senderList[0],
            receiverInfo = deliveryConfig.currReceiver ? deliveryConfig.currReceiver : deliveryConfig.receiverList[0],
            invoiceInfo = deliveryConfig.currInvoice ? adeliveryConfig.currInvoice : deliveryConfig.invoiceList[0],
            pkgList = deliveryConfig.packageList;
        if (pkgList.length > 0) {
            pkgList.forEach((item, index) => {
                totalWeight += item.weight * 1;
                // amount += item.fee * 1;
            })
        }
        if (deliver_type) {
            this.setData({
                "deliver_type": deliver_type
            })
        }
        if (invoice_switch == 'on') {
            this.setData({
                "invoice_switch": true
            })
        } else {
            this.setData({
                "invoice_switch": false
            })
        }
        //获取下单配置
        if (!deliveryConfig.delivers) {
            deliveryService.getDelivers(() => {
                this.setData({
                    "deliveryConfig": deliveryConfig
                })
            })
        } else {
            wx.hideLoading();
            this.setData({
                "deliveryConfig": deliveryConfig
            })
            //计算总运费
            deliveryConfig.fee_tpl.forEach((item, index, arr) => {
                if ((item.weight - 0) == totalWeight) {
                    amount = item.fee
                    return;
                }
            })
        }
        this.setData({
            "delivery_range": delivery_range,
            "senderInfo": senderInfo,
            "receiverInfo": receiverInfo,
            "invoiceInfo": invoiceInfo,
            "amount": amount,
            "totalWeight": totalWeight,
            "pkgList": pkgList
        })
    },
    radioChange(e) {
        this.setData({
            "deliver_type": e.detail.value
        })
        deliveryService.setDeliverType(e.detail.value);
        deliveryService.getFeeTpl(e.detail.value);
        deliveryConfig.fee_tpl.forEach((item, index, arr) => {
            if ((item.weight - 0) == this.data.totalWeight) {
                this.setData({
                    amount: item.fee
                })
                console.log(this.data);
                return;
            }
        })
    },
    invoWantedChange(e) {
        this.setData({
            "invoice_switch": e.detail.value
        })
        deliveryConfig.invoice_switch = (e.detail.value == true ? 'on' : 'off');
    },
    goBack() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 包裹操作
    addPkg() {
        if (deliveryConfig.deliver_type == 0) {
            M._alert('请选择物流渠道');
            return
        }
        wx.navigateTo({
            url: '/pages/pkginfo/pkginfo'
        })
    },
    delPkg() {
        if (deliveryConfig.packageList.length > 0) {
            M._confirm(
                "你确认删除包裹" + deliveryConfig.packageList.length + "？",
                () => {
                    deliveryConfig.packageList.splice(-1, 1)
                    this.setData({
                        "pkgList": deliveryConfig.packageList
                    })
                }
            )
        } else {
            M._alert('你还没有添加包裹，无法进行删除操作');
        }
    },
    // 添加收件人信息
    addReceiver() {
        wx.navigateTo({
            url: '/pages/receiver_list/receiver_list'
        })
    },
    // 添加发件人信息
    addSender() {
        wx.navigateTo({
            url: '/pages/sender_list/sender_list'
        })
    },
    //添加发票
    addInvoice() {
        wx.navigateTo({
            url: '/pages/invoice_list/invoice_list',
        })
    },
    // 联系客服
    contactServer(e) {
        let tel = e.currentTarget.dataset.value;
        wx.makePhoneCall({
            phoneNumber: tel,
            fail: () => {
                M._alert('操作失败，请稍后重试');
            }
        })
    },
    //验证函数
    verifyFn() {
        if (deliveryConfig.deliver_type == 0) {
            M._alert('请添选择物流渠道');
            return false
        }
        if (!this.data.receiverInfo) {
            M._alert('请添加收件人');
            return false
        }
        if (this.data.delivery_range == 'international' && this.data.senderInfo == '') {
            M._alert('请添加发件人');
            return false
        }
        if (this.data.invoice_switch && this.data.invoiceInfo == '') {
            M._alert('请填写发票信息');
            return false
        }
        if (this.data.pkgList.length == 0) {
            M._alert('请添加包裹');
            return false
        }
        this.data.isOK = true;
    },
    // 保存订单
    saveOrder() {
        this.verifyFn();
        if (this.data.isOK) {
            wx.redirectTo({
                url: '/pages/myorder/order_list'
            })
        }

        // 暂存订单操作..
    },
    // 提交订单
    submitOrder() {
        this.verifyFn();
        if (this.data.isOK) {
            let data = {
                "delivery_range": this.data.delivery_range,
                "delivery_type_id": deliveryConfig.deliver_type,
                "sender_id": this.data.senderInfo.id,
                "receiver_id": this.data.receiverInfo.id,
                "invoice_switch": deliveryConfig.invoice_switch,
                "packeages": this.data.pkgList,
                "packages": this.data.pkgList,
                "weight": this.data.totalWeight
            }
            One.ajax('delivery/create-order', data, res => {
                console.log(res)
            })
        }
    }
})