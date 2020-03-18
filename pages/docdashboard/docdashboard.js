// pages/docdashboard/docdashboard.js
const api = require('../../utils/api')
const { $Message } = require('../../dist/base/index')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docmobile: '',
    docname: '',
    docdetails: {},
    curpass: '',
    newpass: '',
    newpass2: '',
    currenttab: 'activity',
    tab_activity: true,
    tab_mine: false,
    consults: [],
    visibleDlg: false,
    hintDlginfo: '',
    visiblePass: false
  },

  handleDlgClose() {
    this.setData({
      visibleDlg: false
    });
  },
  handlePassClose() {
    this.setData({
      visiblePass: false
    });
  },

  handleTabChange({
    detail
  }) {
    let that = this
    that.setData({
      currenttab: detail.key
    });
    var curkey = detail.key
    if (curkey == "activity") {
      that.setData({
        tab_activity: true,
        tab_mine: false
      })
    } else if (curkey == "mine") {
      that.setData({
        tab_activity: false,
        tab_mine: true
      })
    }
  },

  inputCurPasswordEvent: function (e) {
    console.log(">>>inputCurPasswordEvent: " + e.detail.detail.value)
    this.setData({
      curpass: e.detail.detail.value
    })
  },
  inputPasswordEvent: function (e) {
    console.log(">>>inputPasswordEvent: " + e.detail.detail.value)
    this.setData({
      newpass: e.detail.detail.value
    })
  },
  inputPassword2Event: function (e) {
    console.log(">>>inputPassword2Event: " + e.detail.detail.value)
    this.setData({
      newpass2: e.detail.detail.value
    })
  },

  docchgpass: function () {
    let that = this
    if (that.data.curpass == '') {
      that.setData({
        hintDlginfo: '当前密码'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.newpass == '' || that.data.newpass2 == '') {
      that.setData({
        hintDlginfo: '新密码'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.newpass != that.data.newpass2) {
      that.setData({
        visiblePass: true
      });
      return
    }

    let url = api.apiurl + "/xiusers/changepassword/"
    let param = {
      "old_password": that.data.curpass,
      "new_password": that.data.newpass2
    }
    let p = api.putData(url, param, actoken)

    p.then(function (res) {
      if (res.status == 'success') {
        $Message({
          content: '密码修改成功！',
          type: 'success',
          duration: 3
        });
      } else {
        $Message({
          content: '密码修改失败，请您重试',
          type: 'error',
          duration: 3
        });
      }
    })
  },

  handleImagePreview(e) {
    let that = this
    wx.previewImage({
      current: that.data.docdetails.qrcode, //当前预览的图片
      urls: [that.data.docdetails.qrcode,], //所有要预览的图片
    })
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
    let that = this
    that.findDoctorId().then(function (docres) {
      console.log(">>>get doctor info " + docres.results[0])
      that.setData({
        docname: docres.results[0].username,
        docdetails: docres.results[0]
      })
      let docid = docres.results[0].id      
      that.getPatientConsults(docid).then(function (data) {
        console.log(">>>get doctor related patient consult info " + data)
        that.setData({
          consults: data.results
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