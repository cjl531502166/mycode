// pages/excharges/excharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      navigateto: '/pages/excharge_detail/excharge_detail?',
      filters: null,
      pkg_list: null,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.setData({
          "filters": {
              "f_item_0": {
                  "index": 0,
                  "lists": ["全部品种", "品种1", "品种2", "品种3"]
              },
              "f_item_1": {
                  "index": 0,
                  "lists": ["超重补款"]
              },
              "f_item_2": {
                  "date": '全部日期'
              }
          }
      });
      this.setData({
          "pkg_list": [
              {
                  "url": this.data.navigateto,
                  "id": "14888164",
                  "status": "超重补款",
                  "delivery_type": "DHL_Pre优先包",
                  "pkgweight": 10,
                  "datetime": "2017-12-15"
              }, {
                  "url": this.data.navigateto,
                  "id": "feageageag",
                  "status": "超重补款",
                  "delivery_type": "DHL_Eco经济包",
                  "pkgweight": 15,
                  "datetime": "2017-12-10"
              }
          ]
      })
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