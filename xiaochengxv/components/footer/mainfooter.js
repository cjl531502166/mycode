// components/mainfooter.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state_in: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    state: null
  },
  attached(){
    this.setData({
      state: this.properties.state_in
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navigateTo(e){
      let url = e.currentTarget.dataset.url;
      wx.switchTab({
        url: url
      })
    }
  }
})
