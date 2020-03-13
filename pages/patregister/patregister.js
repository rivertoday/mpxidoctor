// pages/patregister/patregister.js
const app = getApp()
const api = require('../../utils/api')
const {
  $Message
} = require('../../dist/base/index')

var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    patname: '',
    patmobile: '',
    patsex: [{
      id: 1,
      name: '男',
    }, {
      id: 2,
      name: '女',
    }, {
      id: 3,
      name: '未知',
    }],
    currentsex: '未知',
    positionsex: 'left',
    patage: '30',
    password: '',
    subpassword: '',
    valcodeinfo: '发送验证码',
    validate_code: '123123',
    visibleDlg: false,
    hintDlginfo: '',
    visiblePass: false,
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

  inputPatNameEvent: function(e) {
    console.log(">>>inputPatNameEvent: " + e.detail.detail.value)
    this.setData({
      patname: e.detail.detail.value
    })
  },

  inputPatMobileEvent: function(e) {
    console.log(">>>inputPatMobileEvent: " + e.detail.detail.value)
    this.setData({
      patmobile: e.detail.detail.value
    })
  },

  inputPatPassEvent: function(e) {
    console.log(">>>inputPatPassEvent: " + e.detail.detail.value)
    this.setData({
      password: e.detail.detail.value
    })
  },
  inputPatPass2Event: function(e) {
    console.log(">>>inputPatPass2Event: " + e.detail.detail.value)
    this.setData({
      subpassword: e.detail.detail.value
    })
  },
  inputValCodeEvent: function(e) {
    console.log(">>>inputValCodeEvent: " + e.detail.detail.value)
    this.setData({
      validate_code: e.detail.detail.value
    })
  },

  handlePatSexChange({
    detail = {}
  }) {
    this.setData({
      currentsex: detail.value
    });
    console.log(">>>patient sex is " + this.data.currentsex)
  },

  handlePatAgeChange({
    detail
  }) {
    this.setData({
      patage: detail.value
    })
    console.log(">>>patient age is " + this.data.patage)
  },

  submitRegInfo: function(e) {
    console.info(">>>current token: " + actoken)
    let that = this
    if (that.data.patname == '') {
      that.setData({
        hintDlginfo: '您的姓名'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.patmobile == '') {
      that.setData({
        hintDlginfo: '手机号码'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.password == '' || that.data.subpassword == '') {
      that.setData({
        hintDlginfo: '密码'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.password != that.data.subpassword) {
      that.setData({
        visiblePass: true
      });
      return
    }

    //数据都齐全
    wx.showModal({
      title: '确认提交',
      success: function(res) {
        if (res.confirm) {
          //查询该手机号的患者是否存在
          that.searchPatient().then(function(data) {
            console.log(data);
            if (data.count > 0) { //存在，更新患者数据
              let patid = data.results[0].id
              console.log(">>>found patient " + patid)
              $Message({
                content: '抱歉，您的手机号已经注册过了',
                type: 'warning',
                duration: 3
              });
              wx.showToast({
                title: '手机号已注册',
                icon: 'none',
                duration: 2000,
              })
            } else {
              //注册患者
              that.registerPatient().then(function(data) {
                console.log(data);
                that.updatePatient(data).then(function(res){
                  wx.navigateTo({
                    url: '/pages/patlogin/patlogin?title=patlogin'
                  })
                });
              })
            }
          })
        }
      }
    })

  },

  //查询患者是否存在
  searchPatient: function() {
    let that = this
    let schmobile = that.data.patmobile
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/patient/list/?search=" + schmobile,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          resolve(res.data) //查询到的符合电话号码的患者
        },
        fail: function(err) {
          console.log(err)
          reject(err)
        }
      })
    })

    return p
  },

  // 注册患者
  registerPatient: function() {
    let that = this
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/patient/register/",
        method: 'POST',
        data: {
          "mobile": that.data.patmobile,
          "password": that.data.password,
          "subpassword": that.data.subpassword,
          "validate_code": that.data.validate_code
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          resolve(res.data.userId)
        },
        fail: function(err) {
          console.log(err)
          reject(err)
        }
      })
    })

    return p
  },

  //补充患者信息
  updatePatient: function(value) {
    let that = this
    let newPatId = value
    console.log(">>>new patient id is: " + newPatId)

    //更新患者信息
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/patient/" + newPatId + "/",
        method: 'PUT',
        data: {
          "username": that.data.patname,
          "sex": that.data.currentsex,
          "age": that.data.patage,
          "nick_name": "众里寻他千百度",
          "user_img": "null",
          "id_card": "110101198010010001",
          "birthday": "1980-10-01"
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          $Message({
            content: '注册成功！',
            type: 'success',
            duration: 3
          });
          wx.showToast({
            title: '注册成功！',
            icon: 'success',
            duration: 2000,
          })
          resolve(res.data)
        },
        fail: function(err) {
          console.log(err)
          $Message({
            content: '注册失败，请检查您的数据，重新提交！',
            type: 'error',
            duration: 3
          });
          reject(err)
        }
      })
    })

    return p
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(">>>We get into the patient register page!")

    var scene = decodeURIComponent(options.scene)
    console.log(">>>OnLoad get input parameter: " + scene)

    //执行异步函数
    this.myinit().then(function(data) {
      actoken = data
      console.log(">>>getting token success! " + actoken);
    })
  },

  // 初始化
  myinit() {
    let mobile = "88851685168" //局部变量
    let password = "asdf1234"
    let p = api.getAccessToken(mobile, password)
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