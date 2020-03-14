// pages/answer/answer.js
const api = require('../../utils/api')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patid: '',
    patname: '',
    patsex: '',
    patage: '',
    docid: '',
    consultid: '',
    consultdetail: {},
    consultimgs: [],
    docanswer: '',
    isReplied: false//用来控制是否让医生回复
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
      consultid: options.consultid
    })

    actoken = wx.getStorageSync("doc_token");
  },

  // 获取患者信息
  getPatient() {
    let that = this
    let url = api.apiurl + "/xiusers/patient/" + that.data.patid + "/"
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  //获取患者咨询问题
  getConsult() {
    let that = this
    let url = api.apiurl + "/consult/" + that.data.consultid + "/"
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  //更新患者咨询的回复
  updateConsult() {
    let that = this
    let url = api.apiurl + "/consult/" + that.data.consultid + "/"
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentDate = date.getFullYear() + "-" + month + "-" + strDate +
      "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    let param = {
      "patient": that.data.patid,
      "desc": that.data.consultdetail.desc,
      "img1_url": that.data.consultdetail.img1_url,
      "img2_url": that.data.consultdetail.img2_url,
      "img3_url": that.data.consultdetail.img3_url,
      "doctor": that.data.docid,
      "answer": that.data.docanswer,
      "created_time": that.data.consultdetail.created_time,
      "answered_time": currentDate,
      "status": "已经回答"
    }
    let p = api.putData(url, param, actoken)

    p.then(function(data){
      if (data.hasOwnProperty("answer")) {//应该能证明回复提交成功了
        wx.showToast({
          title: '回复成功',
          icon: 'success',
          duration: 2000,
        })
        that.onShow()
      }else {
        wx.showToast({
          title: '抱歉出了意外',
          icon: 'none',
          duration: 2000,
        })
      }
    })
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
    let that = this
    that.getConsult().then(function (data) {
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

      if (data.status == "已经回答") {
        that.setData({
          isReplied: true
        })
      }

      that.setData({
        consultdetail: data,
        consultimgs: tmpArray,
        patid: data.patient,
        docid: data.doctor
      })

      that.getPatient().then(function (res) {
        that.setData({
          patname: res.username,
          patsex: res.sex,
          patage: res.age
        })
      })
    })
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