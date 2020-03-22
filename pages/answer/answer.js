// pages/answer/answer.js
const api = require('../../utils/api')
const { $Message } = require('../../dist/base/index')
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
    isReplied: false,//用来控制是否让医生回复
    showrounds: [
      false,
      false,
      false,
      false,
      false
    ],
    qarounds: [],
    ans1: '',
    ans2: '',
    ans3: '',
    ans4: '',
    ans5: ''
  },

  inputAnswerEvent: function(e) {
    console.log(">>>inputAnswerEvent: " + e.detail.detail.value)
    this.setData({
      docanswer: e.detail.detail.value
    })
  },

  inputQA1Event: function (e) {
    console.log(">>>inputQA1Event: " + e.detail.detail.value)
    this.setData({
      ans1: e.detail.detail.value
    })
  },
  inputQA2Event: function (e) {
    console.log(">>>inputQA2Event: " + e.detail.detail.value)
    this.setData({
      ans2: e.detail.detail.value
    })
  },
  inputQA3Event: function (e) {
    console.log(">>>inputQA3Event: " + e.detail.detail.value)
    this.setData({
      ans3: e.detail.detail.value
    })
  },
  inputQA4Event: function (e) {
    console.log(">>>inputQA4Event: " + e.detail.detail.value)
    this.setData({
      ans4: e.detail.detail.value
    })
  },
  inputQA5Event: function (e) {
    console.log(">>>inputQA5Event: " + e.detail.detail.value)
    this.setData({
      ans5: e.detail.detail.value
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
      "is_answered": true,
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

  getRelatedQA() {
    let that = this
    let url = api.apiurl + "/consult/qaround/list/?consult=" + that.data.consultid
    let param = ''
    let p = api.getData(url, param, actoken)
    return p
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  // 提交第一个追问的回复
  SubmitA1() {
    let that = this
    if (typeof (that.data.qarounds[0]) == "undefined") {
      $Message({
        content: '患者还没有追问，还不能回复',
        type: 'warning',
        duration: 3
      });
      return
    }
    if (that.data.ans1 == '') {
      $Message({
        content: '您得回复点内容……',
        type: 'warning',
        duration: 3
      });
      return
    }
    

    let url = api.apiurl + "/consult/qaround/" + that.data.qarounds[0].id + "/"
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
      "round": 1,
      "question": that.data.qarounds[0].question,
      "answer": that.data.ans1,
      "asked_time": that.data.qarounds[0].asked_time,
      "answered_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.putData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submita1 successful. ")
      $Message({
        content: '回复成功！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '回复成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第二个追问的回复
  SubmitA2() {
    let that = this
    if (typeof (that.data.qarounds[1]) == "undefined") {
      $Message({
        content: '患者还没有追问，还不能回复',
        type: 'warning',
        duration: 3
      });
      return
    }
    if (that.data.ans2 == '') {
      $Message({
        content: '您得回复点内容……',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/" + that.data.qarounds[1].id + "/"
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
      "round": 2,
      "question": that.data.qarounds[1].question,
      "answer": that.data.ans2,
      "asked_time": that.data.qarounds[1].asked_time,
      "answered_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.putData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submita2 successful. ")
      $Message({
        content: '回复成功！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '回复成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第三个追问的回复
  SubmitA3() {
    let that = this
    if (typeof (that.data.qarounds[2]) == "undefined") {
      $Message({
        content: '患者还没有追问，还不能回复',
        type: 'warning',
        duration: 3
      });
      return
    }
    if (that.data.ans3 == '') {
      $Message({
        content: '您得回复点内容……',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/" + that.data.qarounds[2].id + "/"
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
      "round": 3,
      "question": that.data.qarounds[2].question,
      "answer": that.data.ans3,
      "asked_time": that.data.qarounds[2].asked_time,
      "answered_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.putData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submita3 successful. ")
      $Message({
        content: '回复成功！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '回复成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第四个追问的回复
  SubmitA4() {
    let that = this
    if (typeof (that.data.qarounds[3]) == "undefined") {
      $Message({
        content: '患者还没有追问，还不能回复',
        type: 'warning',
        duration: 3
      });
      return
    }
    if (that.data.ans4 == '') {
      $Message({
        content: '您得回复点内容……',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/" + that.data.qarounds[3].id + "/"
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
      "round": 4,
      "question": that.data.qarounds[3].question,
      "answer": that.data.ans4,
      "asked_time": that.data.qarounds[3].asked_time,
      "answered_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.putData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submita4 successful. ")
      $Message({
        content: '回复成功！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '回复成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第五个追问的回复
  SubmitA5() {
    let that = this
    if (typeof(that.data.qarounds[4]) == "undefined") {
      $Message({
        content: '患者还没有追问，还不能回复',
        type: 'warning',
        duration: 3
      });
      return
    }
    if (that.data.ans5 == '') {
      $Message({
        content: '您得回复点内容……',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/" + that.data.qarounds[4].id + "/"
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
      "round": 5,
      "question": that.data.qarounds[4].question,
      "answer": that.data.ans5,
      "asked_time": that.data.qarounds[4].asked_time,
      "answered_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.putData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submita5 successful. ")
      $Message({
        content: '回复成功！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '回复成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    var myRounds = new Array();
    for (let i = 0; i < 5; i++) {
      myRounds[i] = false
    }

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

      if (data.is_answered) {//如果初始回复已经完成，并且得有追问，然后才能追答
        for (let j = 0; j < 6 - data.max_round; j++) {
          myRounds[j] = true
        }
        that.getRelatedQA().then(function (qares) {
          that.setData({
            qarounds: qares.results
          })
        })
      }

      that.setData({
        consultdetail: data,
        consultimgs: tmpArray,
        patid: data.patient,
        docid: data.doctor,
        showrounds: myRounds
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