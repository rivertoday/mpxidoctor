// pages/docdashboard/docdashboard.js
const api = require('../../utils/api')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docmobile: '',
    consults: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var scene = decodeURIComponent(options.scene)
    // console.log(">>>OnLoad get input parameter: " + scene)

    let that = this
    that.setData({
      docmobile: options.docmobile
    })

    actoken = wx.getStorageSync("doc_token");
    
    that.findDoctorId().then(function(docres) {
      console.log(">>>get doctor info " + docres.results[0])
      let docid = docres.results[0].id
      that.getPatientConsults(docid).then(function(data) {
        console.log(">>>get doctor related patient consult info " + data)
        that.setData({
          consults: data.results
        })
      })
    })
  },

  findDoctorId() {
    let that = this
    let url = api.apiurl + "/xiusers/doctor/list/?search=" + that.data.docmobile
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  //获取患者向该医生咨询问题
  getPatientConsults(id) {
    let url = api.apiurl + "/consult/list/?doctor=" + id
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