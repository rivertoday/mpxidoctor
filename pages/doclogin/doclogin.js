// pages/doclogin/doclogin.js
const api = require('../../utils/api')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docmobile: '',
    docpass: ''
  },

  inputMobileEvent: function (e) {
    console.log(">>>inputMobileEvent: " + e.detail.detail.value)
    this.setData({
      docmobile: e.detail.detail.value
    })
  },

  inputPasswordEvent: function (e) {
    console.log(">>>inputPasswordEvent: " + e.detail.detail.value)
    this.setData({
      docpass: e.detail.detail.value
    })
  },

  docregister: function () {
    wx.navigateTo({
      url: '/pages/docregister/docregister?title=docregister'
    })
  },

  doclogin: function () {
    let that = this
    that.myLogin().then(function (res) {
      console.log(">>>doclogin " + res)
      if (res.indexOf("invalid") != -1) {
        wx.showToast({
          title: '抱歉，您输入的手机和密码不正确！',
          icon: 'none',
          duration: 2000,
        })
      } else {
        //将医生登录的token保存到本地storage
        wx.setStorageSync("doc_token", res);
        wx.reLaunch({
          url: '/pages/docdashboard/docdashboard?title=docdashboard&&docmobile='+that.data.docmobile
        })
      }    
    })
  },

  // 初始化
  myLogin() {
    let that = this
    let mobile = that.data.docmobile
    let password = that.data.docpass
    let p = api.getAccessToken(mobile, password)
    return p
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.clearStorageSync()
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