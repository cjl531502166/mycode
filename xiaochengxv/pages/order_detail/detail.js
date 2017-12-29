// pages/order_detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  onLoad: function (options) {
  
  },
 
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  trackPkg(e){
      let num = e.currentTarget.dataset.num;
      wx.redirectTo({
          url: '/pages/delivery_detail/delivery_detail?deliverynum=' + num
      })
  }
})