// pages/docmain/docmain.js
const app = getApp()
const api = require('../../utils/api')
const { $Message } = require('../../dist/base/index')

var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patid: '',
    docid: '',
    doctordetail: {}
  },

  orderConsult: function () {
    let that = this
    if (that.data.patid !='') {
      // wx.showToast({
      //   title: '患者已经登录！',
      //   icon: 'success',
      //   duration: 1000,
      // })
      let targeturl = '/pages/docconsult/docconsult?title=docconsult&&docid=' + that.data.docid + "&&patid=" + that.data.patid
      wx.navigateTo({
        url: targeturl
      })
    }else {
      $Message({
        content: '抱歉，您还没有登录！',
        type: 'warning',
        duration: 3
      });
      wx.navigateTo({
        url: '/pages/patlogin/patlogin?title=patlogin'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      docid: '30'
    })
    //患者看到医生列表页面，点击跳转到这个医生详情页面，传递过来患者id和医生id
    if (options.patid) {
      that.setData({
        patid: options.patid,
        docid: options.docid
      })
    }

    //options.q的场景仅仅用于微信后台配置的有限测试二维码
    if (options.q) {
      var link = options.q;
      console.log(">>>OnLoad q get link as " + link);
      that.setData({
        docid: link.charAt(link.length - 1)
      })
      console.log(">>>OnLoad q get doctor id: " + that.data.docid)
    }

    //scene的场景是通用的，将来由服务端后台动态生成每个医生的二维码
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      console.log(">>>OnLoad scene get input parameter: " + scene)

      let tmpArr = scene.split("-")
      that.setData({
        patid: tmpArr[0],
        docid: tmpArr[1]
      })
      console.log(">>>OnLoad scene get patient id: " + that.data.patid)
      console.log(">>>OnLoad scene get doctor id: " + that.data.docid)
    }

    //执行异步函数
    this.myinit().then(function (data) {
      actoken = data
      console.log(">>>getting token success! " + actoken);

      that.getDoctor().then(function (res){
        that.setData({
          doctordetail: res
        })
      })
    })
  },

  // 初始化
  myinit() {
    let mobile = "88851685168" //局部变量
    let password = "asdf1234"
    let p = api.getAccessToken(mobile, password)
    return p
  },

  // 获取医生信息
  getDoctor() {
    let that = this
    let url = api.apiurl + "/xiusers/doctor/" + that.data.docid + "/"
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})