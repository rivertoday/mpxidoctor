// pages/consult/consult.js
const api = require('../../utils/api')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultid:'',
    consultdetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      consultid: options.consultid
    })
    console.log(">>>get consult id " + that.data.consultid)

    that.myinit().then(function(res){
      actoken = res
      that.getConsult().then(function(data){
        console.log(">>>get consult detail "+data)
        that.setData({
          consultdetail: data
        })
      })
    })
  },

  // 初始化
  myinit() {
    let mobile = '88851685168'
    let password = 'asdf1234'
    let p = api.getAccessToken(mobile, password)
    return p
  },

  //获取患者咨询问题
  getConsult() {
    let that = this
    let url = api.apiurl + "/consult/"+that.data.consultid+"/"
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