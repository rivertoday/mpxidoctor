// pages/answer/answer.js
const api = require('../../utils/api')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docid: '',
    consultid: '',
    consultdetail: {},
    docanswer: '',
    consultimgs: []
  },

  inputAnswerEvent: function(e) {
    console.log(">>>inputAnswerEvent: " + e.detail.detail.value)
    this.setData({
      docanswer: e.detail.detail.value
    })
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.consultimgs
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      consultid: options.consultid,
      docid: options.docid
    })

    actoken = wx.getStorageSync("doc_token");

    that.getConsult().then(function(data) {
      console.log(">>>get consult detail " + data)

      let tmpArray = []
      if (data.img1_url != "null") {
        tmpArray.push(data.img1_url)
      }
      if (data.img2_url != "null") {
        tmpArray.push(data.img2_url)
      }
      if (data.img3_url != "null") {
        tmpArray.push(data.img3_url)
      }

      that.setData({
        consultdetail: data,
        consultimgs: tmpArray
      })
    })
  },

  //获取患者咨询问题
  getConsult() {
    let that = this
    let url = api.apiurl + "/consult/" + that.data.consultid + "/"
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})