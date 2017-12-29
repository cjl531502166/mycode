import deliveryConfig from '../models/delivery.config.js';
import One from '../utils/one.js';
import M from '../components/modals/common.js';
export default {
    //获取物流运输方式列表
    getDelivers(cb) {
        One.ajax('delivery/config', {}, res => {
            deliveryConfig.delivers = res.data.data.delivery_types;
            deliveryConfig.hotline = res.data.data.hotline;
            cb && cb(res)
        })
    },
    //设置当前物流方式
    setDeliverType(id) {
        deliveryConfig.deliver_type = id;
    },
    //获取运费模板
    getFeeTpl(id) {
        deliveryConfig.delivers.map((item, index, arr) => {
            if (item.id == id) {
                deliveryConfig.fee_tpl = item.fee_tpl;
            }
        })
    },
    //获取收件人列表
    getReceivers(cb) {
        if (deliveryConfig.receiverList.length == 0) {
            One.ajax('user/receiver', {}, res => {
                deliveryConfig.receiverList = res.data.data;
                cb && cb(res)
            })
        } else {
            wx.hideLoading()
        }
    },
    //获取当前收件人
    getCurrReiceiver(id, listArr) {
        deliveryConfig.currReceiver = listArr[id - 1]
    },
    //添加收件人
    addReceiver() { },
    //删除收件人
    deleteReceiver(id, cb) {
        M._alert('确定要删除该收件人？', () => {
            One.ajax('user/receiver-del', { "id": id }, res => {
                if (res.data.code != 0) {
                    deliveryConfig.receiverList = deliveryConfig.receiverList.splice(id - 1, 1);
                    wx.showToast({
                        title: '已删除'
                    })
                    cb && cb()
                }
            })
        })
    },
    //获取发件人列表
    getSenders(cb) {
        if (deliveryConfig.senderList.length == 0) {
            One.ajax('user/sender', {}, res => {
                deliveryConfig.senderList = res.data.data;
                cb && cb(res)
            })
        } else {
            wx.hideLoading()
        }
    },
    //获取当前发件人
    getCurrSender(id, listArr) {
        deliveryConfig.currSender = listArr[id - 1]
    },
    //删除当前发件人
    deleteSender(id, cb) {
        M._alert('确定要删除该发件人？', () => {
            One.ajax('user/sender-del', { "id": id }, res => {
                if (res.data.code != 0) {
                    deliveryConfig.senderList = deliveryConfig.senderList.splice(id - 1, 1);
                    wx.showToast({
                        title: '已删除'
                    })
                    cb && cb()
                }
            })
        })
    },
    //获取发票列表
    getInvoices(cb) {
        if (deliveryConfig.invoiceList.length == 0) {
            // One.ajax('user/sender', {}, res => {
            //     deliveryConfig.senderList = res.data.data;
            //     cb && cb(res)
            // })
        } else {
            wx.hideLoading()
        }
    },
    //获取当前发票
    getCurrInvoice(id, listArr) {
        deliveryConfig.currInvoice = listArr[id - 1]
    },
    //设置默认
    setDefault(requestPort, id) {
        One.ajax(requestPort, { "id": id }, res => {
            if (res.data.code != 0) {
                wx.showToast({
                    title: '设置成功'
                })
            }
        })
    },
}