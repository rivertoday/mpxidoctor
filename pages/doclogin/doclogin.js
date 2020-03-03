// pages/doclogin/doclogin.js
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

  doclogin: function () {
    wx.navigateTo({
      url: '/pages/docdashboard/docdashboard?title=docdashboard'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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