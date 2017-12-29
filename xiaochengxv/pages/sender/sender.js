import deliveryConfig from '../../models/delivery.config.js';
import deliveryService from '../../services/delivery.service.js';
Page({
    data: {
        deliveryConfig: deliveryConfig
    },
    onLoad() {
        wx.showLoading();
        deliveryService.getSenders(res => {
            this.setData({
                'deliveryConfig': deliveryConfig
            })
        })
    },
    // 设置默认地址
    addressChange(e) {
        let currIndex = e.detail.value - 0;
        deliveryService.setDefault('user/sender-set-default', currIndex);
    },
    deleteAddr(e) {
        let id = e.currentTarget.dataset.id;
        deliveryService.deleteSender(id, res => {
            this.setData({
                'deliveryConfig': deliveryConfig
            })
        })
    }
})