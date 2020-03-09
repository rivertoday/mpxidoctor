// pages/docconsult/docconsult.js
const api = require('../../utils/api')
var actoken = ""
var doctorID = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    imgurls: [],
    patname: '',
    patmobile: '',
    patconsult: '',
    clinicname: '',
    docname: ''
  },

  inputPatNameEvent: function (e) {
    console.log(">>>inputPatNameEvent: " + e.detail.detail.value)
    this.setData({
      patname: e.detail.detail.value
    })
  },

  inputPatMobileEvent: function (e) {
    console.log(">>>inputPatMobileEvent: " + e.detail.detail.value)
    this.setData({
      patmobile: e.detail.detail.value
    })
  },

  inputConsultEvent: function (e) {
    console.log(">>>inputConsultEvent: " + e.detail.detail.value)
    this.setData({
      patconsult: e.detail.detail.value
    })
  },

  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        const images1 = images.length <= 3 ? images : images.slice(0, 3)
        this.setData({
          images: images1
        })
      }
    })
  },

  removeImage(e) {
    var that = this;
    var images = that.data.images;
    // 获取要删除的第几张图片的下标
    const idx = e.currentTarget.dataset.idx
    // splice  第一个参数是下表值  第二个参数是删除的数量
    images.splice(idx, 1)
    this.setData({
      images: images
    })
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var scene = decodeURIComponent(options.scene)
    console.log(">>>OnLoad get input parameter: " + scene)
    let that = this
    let tmpArr = scene.split("-")
    doctorID = tmpArr[1]
    console.log(">>>OnLoad get doctor id: " + doctorID)
    

    that.myinit().then(function(data) {
      actoken = data
      console.log(">>>getting token success! " + actoken)
      that.getDoctorInfo().then(function(res){        
        that.setWelcomeTitle(res)
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

  getDoctorInfo() {
    let url = api.apiurl + "/xiusers/doctor/" + doctorID + "/"
    console.log(">>>doctor info url " + url)
    let param = ""
    let p = api.getData(url, param, actoken)
    return p
  },

  setWelcomeTitle(res) {
    let that = this
    console.log(">>>welcome title " + res['username'])
    that.setData({
      docname: res['username'],
      clinicname: res['hospital']
    })
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