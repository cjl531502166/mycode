// pages/add_receiver/add.js
import { cityData } from '../../utils/cities.js';
import M from '../../components/modals/common.js';
import { pinyin } from '../../utils/pinyin.js';
import One from '../../utils/one.js';
const app = getApp();
Page({
    data: {
        condition: false,
        provinces: [],
        province: '',
        citys: [],
        city: '',
        country: "中国",
        districts: [],
        district: '',
        value: [0, 0, 0],
        values: [0, 0, 0],
        receiverZn: '',
        addressZn: '',//拼音地址
        address: '',
        addrDetail: '',//详细门牌信息
        name: '',//收件人
        cellphone: '',//联系电话
        postnumber: '',//邮政编码
        saveAddr: true,
        fromPage: ''// 来源路径
    },
    pickerShowAndHide() {
        this.setData({
            "condition": !this.data.condition,
        })
    },
    confirm() {
        let addr = this.data.province + ' ' + this.data.city + ' ' + this.data.district;
        this.setData({
            "condition": !this.data.condition,
            "province": this.data.province,
            "city": this.data.city,
            "district": this.data.district,
            "address": addr,
            "addressZn": pinyin.getFullChars(addr)
        })
    },
    getDetailAddr(e) {
        let detailAddr = e.detail.value;
        this.setData({
            "addrDetail": detailAddr,
            "addressZn": pinyin.getFullChars(this.data.address + ' ' + detailAddr)
        })
    },
    onLoad: function (options) {
        var that = this;
        let provinces = [];
        let citys = [];
        let districts = [];

        One.ajax('geo/province', {}, res => {
            provinces = res.data.data;
            One.ajax('geo/city', { 'province': provinces[0] }, res => {
                citys = res.data.data;
                One.ajax('geo/county', {
                    "province": provinces[0],
                    "city": citys[0]
                }, res => {
                    districts = res.data.data;
                    that.setData({
                        'provinces': provinces,
                        'citys': citys,
                        'districts': districts,
                        'province': provinces[0],
                        'city': citys[0],
                        'district': districts[0],
                    })
                })
            })
        })
        this.setData({
            'fromPage': options.page ? options.page : null
        })
        // let citys = [];
        // let districts = [];
        // for (let i = 0; i < cityData.length; i++) {
        //     provinces.push(cityData[i].name);
        // }
        // for (let i = 0; i < cityData[0].sub.length; i++) {
        //     citys.push(cityData[0].sub[i].name)
        // }
        // for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
        //     districts.push(cityData[0].sub[0].sub[i].name)
        // }
    },
    bindChange: function (e) {
        var val = e.detail.value,
            t = this.data.values
        if (val[0] != t[0]) {
            wx.showLoading();
            let citys = [];
            let districts = [];
            One.ajax('geo/city', { "province": this.data.provinces[val[0]] }, res => {
                citys = res.data.data;
                One.ajax('geo/county', {
                    "province": this.data.provinces[val[0]],
                    "city": citys[0]
                }, res => {
                    districts = res.data.data;
                    this.setData({
                        'province': this.data.provinces[val[0]],
                        'city': citys[0],
                        'citys': citys,
                        'district': districts[0],
                        'districts': districts,
                        'values': val,
                        'value': [val[0], 0, 0]
                    })
                })
            })
        }
        if (val[1] != t[1]) {
            wx.showLoading();
            let districts = [];
            One.ajax('geo/county', {
                "province": this.data.provinces[val[0]],
                "city": this.data.citys[val[1]]
            }, res => {
                districts = res.data.data;
                this.setData({
                    'city': this.data.citys[val[1]],
                    'district': districts[0],
                    'districts': districts,
                    'values': val,
                    'value': [val[0], val[1], 0]
                })
            })
        }
        if (val[2] != t[2]) {
            this.setData({
                'district': this.data.districts[val[2]],
                'values': val
            })
        }
        // if (val[0] != t[0]) {
        //     let citys = [];
        //     let districts = [];

        //     for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        //         citys.push(cityData[val[0]].sub[i].name)
        //     }
        //     for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        //         districts.push(cityData[val[0]].sub[0].sub[i].name)
        //     }

        // this.setData({
        //     'province': this.data.provinces[val[0]],
        //     'city': cityData[val[0]].sub[0].name,
        //     'citys': citys,
        //     'district': cityData[val[0]].sub[0].sub[0].name,
        //     'districts': districts,
        //     'values': val,
        //     'value': [val[0], 0, 0]
        // })
        // }
        // if (val[1] != t[1]) {
        //     let districts = [];
        //     for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        //         districts.push(cityData[val[0]].sub[val[1]].sub[i].name)
        //     }

        // this.setData({
        //     'city': this.data.citys[val[1]],
        //     'district': cityData[val[0]].sub[val[1]].sub[0].name,
        //     'districts': districts,
        //     'values': val,
        //     'value': [val[0], val[1], 0]
        // })
        // }
        // if (val[2] != t[2]) {
        //     this.setData({
        //         district: this.data.districts[val[2]],
        //         values: val
        //     })
        // }
    },
    // 名字转换
    setCnName(e) {
        let val = pinyin.getFullChars(e.detail.value);
        this.data.name = e.detail.value;
        this.setData({
            "receiverZn": val
        })
    },
    // 是否保存收件人
    checkboxChange(e) {
        this.data.saveAddr = e.detail.value[0] ? 1 : 0;
    },
    // 检查电话号码输入
    getTel(e) {
        this.data.cellphone = e.detail.value;
    },
    checkPostcode(e) {
        this.data.postnumber = e.detail.value;
    },
    // 保存操作
    saveHandle() {
        let regxPhone = /^1[34578]\d{9}$/,
            regxTel = /^(([0\+]\d{2,3})?(0\d{2,3}))(\d{7,8})((\d{3,}))?$/,
            name = this.data.name,
            tel = this.data.cellphone,
            addr = this.data.province + ' ' + this.data.city + ' ' + this.data.district,
            addrDetail = this.data.addrDetail,
            code = this.data.postnumber,
            receiverInfo = '';
        // 判断姓名格式
        if (name == '') {
            M._alert('姓名不能为空');
            return
        } else if (!isNaN(name)) {
            M._alert('姓名格式不正确');
            return
        } else if (name.length < 2) {
            M._alert('姓名至少包含2个字符');
            return;
        }

        // 判断电话号码
        if (!tel) {
            M._alert('请填写手机号');
            return;
        }
        if (!((regxPhone.test(tel) || regxTel.test(tel)))) {
            M._alert('固话或者手机号码格式不正确\n，固话请加区号');
            return;
        }

        // 判断地址
        if (!addr) {
            M._alert('请选择地区');
            return;
        }
        // 判断门派信息
        if (!addrDetail) {
            M._alert('详细地址未填写');
            return;
        }
        if (code == '') {
            M._alert('邮政编码不能为空');
            return
        } else if (isNaN(code)) {
            M._alert('邮政编码格式不正确');
            return;
        }
        //
        receiverInfo = {
            "country": this.data.country,
            "province": this.data.province,
            "city": this.data.city,
            "district": this.data.district,
            "address": addrDetail,
            "name": name,
            "cellphone": tel,
            "postnumber": code,
            "asdefault": this.data.saveAddr
        }
        if (this.data.fromPage == 'order') {
            app.globalData.currReceiver = receiverInfo
            if (this.data.saveAddr) {
                app.globalData.receiverList.forEach((item, index, array) => {
                    array.asdefault = 0;
                })
                // 发ajax保存地址 请求然后回到下单页面
                One.ajax('user/receiver-add', receiverInfo, res => {
                    console.log(res);
                })
                // wx.redirectTo({
                //     url: '/pages/delivery/delivery'
                // })
            } else {
                wx.redirectTo({
                    url: '/pages/delivery/delivery'
                })
            }
        } else {
            // 保存并返回我的联系人页面
            wx.redirectTo({
                url: '/pages/receivers/receivers',
                success: () => {
                    app.globalData.receiverList.push(receiverInfo);
                }
            })
        }
    }
})