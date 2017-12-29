class One {
    config = {
        requestURI: 'https://api.gd.letwx.com/v1/',
        token: ''
    }
    ajax(port, data, succCb, failCb, method) {
        if (arguments.length < 2) {
            console.log('至少2个参数')
            return
        }
        if (typeof port !== 'string') {
            console.log('第一个参数必须是一个字符串')
            return
        }
        if (!data instanceof Object) {
            console.log('第二个参数必须是一个对象')
            return
        }
        if (succCb && Object.prototype.toString.call(succCb) !== '[object Function]') {
            console.log('第三四个参数必须是一个对象')
            return
        }
        if (failCb && Object.prototype.toString.call(failCb) !== '[object Function]') {
            console.log('第三四个参数必须是一个对象')
            return
        }
        wx.request({
            url: this.config.requestURI + port+'?token='+this.config.token,
            data: data,
            method: method ? method : "POST",
            success: (res) => {
                succCb && succCb(res)
                wx.hideLoading()
            },
            fail: (res) => {
                failCb && failCb(res)
                wx.hideLoading()
            }
        })
    }
}
export default new One()