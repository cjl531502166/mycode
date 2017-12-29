Page({
    data: {
        navigateto: '/pages/order_detail/detail?',
        filters: null,
        pkg_list: null,
    },

    onShow: function () {
        this.setData({
            "filters": {
                "f_item_0": {
                    "index": 0,
                    "lists": ["全部品种", "品种1", "品种2", "品种3"]
                },
                "f_item_1": {
                    "index": 0,
                    "lists": ["全部状态", "已付款", "已审核", "已出库", "超重补款", "问题件"]
                },
                "f_item_2": {
                    "date": '全部日期'
                }
            }
        })
        this.setData({
            "order_list": [
                {
                    "url": this.data.navigateto,
                    "id": "LL14888164",
                    "status": "超重补款",
                    "delivery_type": "DHL_Pre优先包",
                    "pkgweight": 10,
                    "datetime": "2017-12-15"
                }, {
                    "url": this.data.navigateto,
                    "id": "LL14888164",
                    "status": "超重补款",
                    "delivery_type": "DHL_Eco经济包",
                    "pkgweight": 15,
                    "datetime": "2017-12-10"
                }
            ]
        })
    },
    onHide: function () {

    },

    onUnload: function () {

    },
    onCategoryChagne(e) {
        this.data.filters.f_item_0.index = e.detail.value;
        this.setData({
            "filters": this.data.filters
        })
    },
    onStatusChagne(e) {
        this.data.filters.f_item_1.index = e.detail.value;
        this.setData({
            "filters": this.data.filters
        })
    },
    onDateChange(e) {
        this.data.filters.f_item_2.date = e.detail.value;
        this.setData({
            "filters": this.data.filters
        })
    }
})