// pages/pkginfo/pkginfo.js
import M from '../../components/modals/common.js';
import deliveryConfig from '../../models/delivery.config.js';
import deliveryService from '../../services/delivery.service.js';
import Category from '../../models/goods.categories.js';
import categoryService from '../../services/category.service.js'
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        "fee_tpl": null,//运费模板
        "categories": Category,//类目相关数据
        "cateIndex": "",
        "packageId": '',
        "package": {
            "weight": '',//购买包裹重量
            "fee": 0,//运费
            "goods": {
                "category": "",
                "customcode": "",
                "description": "",
                "num": "",
                "price": "",
                "weight": "",
                "customdeclarprice": ""
            }
        },
        "viewObj": [

        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //修改操作
        let that = this, id;
        this.data.packageId = id = options.packageId ? options.packageId : null;
        if (id) {
            //计算包裹运费
           deliveryService.getFeeTpl(deliveryConfig.deliver_type);
           deliveryConfig.fee_tpl.forEach((item, index, arr) => {
                if (deliveryConfig.packageList[id].weight == item.weight) {
                    that.data.package.fee = item.fee;
                    return
                }
            })
            this.setData({
                "package": {
                    "weight": deliveryConfig.packageList[id].weight,
                    "fee": that.data.package.fee
                }
            })
            deliveryConfig.packageList[id].goods.forEach((item, index, arr) => {
                that.data.viewObj.push({
                    "cateIndex": that.data.cateIndex,
                    "goods": item
                })
            });
            this.setData({ "viewObj": that.data.viewObj })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        //获取品类
        categoryService.getCategories(res => {
            this.setData({
                "categories": Category
            })
        })
        //获取运费模板
        deliveryService.getFeeTpl(deliveryConfig.deliver_type);
        this.data.fee_tpl = deliveryConfig.fee_tpl;
    },

    // 添加品种
    addCate() {
        if (!this.data.package.weight) {
            M._alert('请填写购买包裹总重量');
            return
        }
        this.data.viewObj.push({
            "goods": this.data.package.goods,
            "cateIndex": this.data.cateIndex
        });
        this.setData({
            "viewObj": this.data.viewObj
        })
    },
    // 品种选择
    bindCateChange(e) {
        let id = e.currentTarget.dataset.id;
        this.data.viewObj[id].cateIndex = e.detail.value;
        this.data.viewObj[id].goods.category = this.data.categories.categoryArr[e.detail.value].name_cn;
        this.data.viewObj[id].goods.customcode = this.data.categories.categoryArr[e.detail.value].code;
        this.setData({
            "viewObj": this.data.viewObj
        })
    },
    removeItem(e) {
        let id = e.currentTarget.dataset.id;
        this.data.viewObj.splice(id, 1);
        this.setData({
            "viewObj": this.data.viewObj
        })
    },
    chkNum(e) {
        let val = e.detail.value,
            id = e.currentTarget.dataset.id,
            regNum = /^[1-9]*$/;
        if (!regNum.test(val)) {
            M._alert('数量必须为非0整数')
        } else {
            this.data.viewObj[id].goods.num = val;
            // 计算海关报价
            if (this.data.viewObj[id].goods.price) {
                this.data.viewObj[id].goods.customdeclarprice = this.data.viewObj[id].goods.price * val;
                this.setData({
                    "viewObj": this.data.viewObj
                })
            }
        }
    },
    chkDescp(e) {
        let val = e.detail.value,
            id = e.currentTarget.dataset.id;
        this.data.viewObj[id].goods.description = val
    },
    chkPrice(e) {
        let val = e.detail.value,
            id = e.currentTarget.dataset.id;
        if (val <= 0) {
            M._alert('单价必须大于0')
            return
        }
        if (val && isNaN(val)) {
            M._alert('价格必须为数字')
        } else {
            this.data.viewObj[id].goods.price = val;
            // 计算海关报价
            if (this.data.viewObj[id].goods.num) {
                this.data.viewObj[id].goods.customdeclarprice = this.data.viewObj[id].goods.num * val;
                this.setData({
                    "viewObj": this.data.viewObj
                })
            }
        }
    },
    chkWeight(e) {
        let val = e.detail.value,
            id = e.currentTarget.dataset.id;
        if (val && val > 0) {
            let total = 0;
            if (isNaN(val)) {
                M._alert('重量必须为数字');
            } else {
                this.data.viewObj[id].goods.weight = val;
            }
            this.data.viewObj.map((item, index, arr) => {
                total += item.goods.weight * 1;
            })
            if (total > this.data.package.weight) {
                M._alert('物品净重之和不能大于包裹总重量')
                this.data.viewObj[id].goods.weight = 0;
            } else {
                this.data.viewObj[id].goods.weight = val;
            }

        } else {
            M._alert('总净重必须大于0')
        }
    },
    // 购买包裹重量
    chkPkgWeight(e) {
        let weight = e.detail.value,
            id = e.currentTarget.dataset.id,
            that = this;
        if (weight && isNaN(weight)) {
            M._alert('重量必须为数字')
        } else if (weight > 30) {
            M._alert('包裹重量不能大于30kg');
        } else {
            this.data.package.weight = weight;
            // 计算运费
            this.data.fee_tpl.map((item, index) => {
                if ((item.weight - 0) == weight) {
                    that.data.package.fee = item.fee;
                    that.setData({
                        "package": that.data.package
                    })
                    return;
                }
            })
        }
    },
    confirmAdd() {
        let currPackage = {}, goodsArr = [], that = this;
        if (!this.data.package.weight) {
            M._alert('请填写购买包裹总重量');
            return
        }
        if (this.data.viewObj.length <= 0) {
            M._alert('请添加品种');
            return
        }
        // 判断包裹内容
        this.data.viewObj.map((item, index) => {
            for (let key in item.goods) {
                if (item.goods[key] == '') {
                    M._alert('请确认页面信息填写正确后提交');
                    return;
                }
            }
            goodsArr.push(that.data.viewObj[index].goods)
            currPackage = {
                "weight": that.data.package.weight,
                "goods": goodsArr
            }
        })
        wx.redirectTo({
            url: '/pages/delivery/delivery',
            success: () => {
                if (that.data.id != '') {
                    //修改
                    deliveryConfig.packageList.splice(that.data.id, 1, currPackage)
                } else {
                    //添加
                    deliveryConfig.packageList.push(currPackage);
                }
            }
        })
    }
})