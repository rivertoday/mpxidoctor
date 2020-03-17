// pages/patdashboard/patdashboard.js
const api = require('../../utils/api')
const { $Message } = require('../../dist/base/index')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patid: '',
    patmobile: '',
    patdetails: {},
    curpass: '',
    newpass: '',
    newpass2: '',
    currenttab: 'group',
    tab_group: true,
    tab_activity: false,
    tab_mine: false,
    consults: [
      // {
      //   id: 1,
      //   created_time: '2020-03-10T14:18:20.421Z',
      //   desc: '胃有点疼',
      // }, {
      //   id: 2,
      //   created_time: '2020-03-10T14:18:20.421Z',
      //   desc: '肠有点疼',
      // }, {
      //   id: 3,
      //   created_time: '2020-03-10T14:18:20.421Z',
      //   desc: '肝有点疼',
      // }
    ],
    doctors: [],
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
    if (curkey == "group") {
      that.setData({
        tab_group: true,
        tab_activity: false,
        tab_mine: false
      })
    } else if (curkey == "activity") {
      that.setData({
        tab_group: false,
        tab_activity: true,
        tab_mine: false
      })
    } else if (curkey == "mine") {
      that.setData({
        tab_group: false,
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

  patchgpass: function () {
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

    p.then(function(res){
      if (res.status == 'success') {
        $Message({
          content: '密码修改成功！',
          type: 'success',
          duration: 3
        });
      }else {
        $Message({
          content: '密码修改失败，请您重试',
          type: 'error',
          duration: 3
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //wx.hideTabBar();
    // var scene = decodeURIComponent(options.scene)
    // console.log(">>>OnLoad get input parameter: " + scene)
    let that = this
    // var date = new Date();
    // var mytime = date.toLocaleTimeString(); //获取当前时间
    // console.log(">>>current time " + mytime)

    that.setData({
      patmobile: options.patmobile
    })

    actoken = wx.getStorageSync("pat_token");
  },

  getDoctors() {
    let that = this
    let url = api.apiurl + "/xiusers/doctor/list/"
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  findPatientId() {
    let that = this
    let url = api.apiurl + "/xiusers/patient/list/?search=" + that.data.patmobile
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  //获取患者咨询问题
  getPatientConsults() {
    let that = this
    let url = api.apiurl + "/consult/list/?patient=" + that.data.patid
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
    that.getDoctors().then(function(docres) {
      console.log(">>>get doctor number " + docres.count)
      that.setData({
        doctors: docres.results
      })

      that.findPatientId().then(function(patres) {
        console.log(">>>get patient info " + patres.results[0])
        that.setData({
          patid: patres.results[0].id,
          patdetails: patres.results[0]
        })
        that.getPatientConsults().then(function(data) {
          console.log(">>>get patient consult info " + data)
          that.setData({
            consults: data.results
          })
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