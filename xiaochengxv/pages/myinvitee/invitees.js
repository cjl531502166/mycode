// pages/myinvitee/invitees.js
Page({
    data: {
        inviteeList: null,
    },

    onLoad: function (options) {
        this.setData({
            "inviteeList": [
                {
                    "name":"乐推互动",
                    "order_num":"15",
                    "datestr":"2017-12-11"
                }, {
                    "name": "互动乐推",
                    "order_num": "115",
                    "datestr": "2017-12-18"
                }
            ]
        })
    },
    onShow: function () {

    },
    onShareAppMessage (res) {
        return{
            "title":"德意志物流",
            "path":"/pages/index/index",
            "imageUrl":"/images/invite_bg.png"
        }
        
    }
})