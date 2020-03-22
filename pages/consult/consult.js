// pages/consult/consult.js
const api = require('../../utils/api')
const { $Message } = require('../../dist/base/index')
var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    docid: '',
    docname: '',
    consultid: '',
    consultdetail: {},
    consultimgs: [],
    showrounds:[
      false,
      false,
      false,
      false,
      false
    ],
    qarounds:[],
    ques1:'',
    ques2: '',
    ques3: '',
    ques4: '',
    ques5: ''
  },

  handleImagePreview(e) {
    let that = this
    const idx = e.target.dataset.idx
    const images = that.data.consultimgs
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },

  inputQA1Event: function (e) {
    console.log(">>>inputQA1Event: " + e.detail.detail.value)
    this.setData({
      ques1: e.detail.detail.value
    })
  },
  inputQA2Event: function (e) {
    console.log(">>>inputQA2Event: " + e.detail.detail.value)
    this.setData({
      ques2: e.detail.detail.value
    })
  },
  inputQA3Event: function (e) {
    console.log(">>>inputQA3Event: " + e.detail.detail.value)
    this.setData({
      ques3: e.detail.detail.value
    })
  },
  inputQA4Event: function (e) {
    console.log(">>>inputQA4Event: " + e.detail.detail.value)
    this.setData({
      ques4: e.detail.detail.value
    })
  },
  inputQA5Event: function (e) {
    console.log(">>>inputQA5Event: " + e.detail.detail.value)
    this.setData({
      ques5: e.detail.detail.value
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

    actoken = wx.getStorageSync("pat_token");
  },

  // 获取医生信息
  getDoctor() {
    let that = this
    let url = api.apiurl + "/xiusers/doctor/" + that.data.docid + "/"
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

  getRelatedQA(){
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

  // 提交第一个追问
  SubmitQ1() {
    let that = this
    if (that.data.ques1 == ''){
      $Message({
        content: '你啥都没写啊？',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/"
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
      "question": that.data.ques1,
      "asked_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.postData(url, param, actoken)
    p.then(function(res){
      console.log(">>>submitq1 successful. ")
      $Message({
        content: '提交成功，请等待专家回复！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '提交成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第二个追问
  SubmitQ2() {
    let that = this
    if (that.data.ques2 == '') {
      $Message({
        content: '你啥都没写啊？',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/"
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
      "question": that.data.ques2,
      "asked_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.postData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submitq2 successful. ")
      $Message({
        content: '提交成功，请等待专家回复！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '提交成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第三个追问
  SubmitQ3() {
    let that = this
    if (that.data.ques3 == '') {
      $Message({
        content: '你啥都没写啊？',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/"
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
      "question": that.data.ques3,
      "asked_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.postData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submitq3 successful. ")
      $Message({
        content: '提交成功，请等待专家回复！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '提交成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第四个追问
  SubmitQ4() {
    let that = this
    if (that.data.ques4 == '') {
      $Message({
        content: '你啥都没写啊？',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/"
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
      "question": that.data.ques4,
      "asked_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.postData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submitq4 successful. ")
      $Message({
        content: '提交成功，请等待专家回复！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '提交成功',
        showCancel: false,
        success: function (sres) {
          if (sres.confirm) {
            that.onShow()
          }
        }
      })
    })
  },

  // 提交第五个追问
  SubmitQ5() {
    let that = this
    if (that.data.ques5 == '') {
      $Message({
        content: '你啥都没写啊？',
        type: 'warning',
        duration: 3
      });
      return
    }

    let url = api.apiurl + "/consult/qaround/"
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
      "question": that.data.ques5,
      "asked_time": currentDate,
      "consult": that.data.consultid
    }
    let p = api.postData(url, param, actoken)
    p.then(function (res) {
      console.log(">>>submitq5 successful. ")
      $Message({
        content: '提交成功，请等待专家回复！',
        type: 'success',
        duration: 3
      });
      wx.showModal({
        title: '提交成功',
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
    for (let i=0; i<5; i++) {
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

      if (data.is_answered) {//如果初始回复已经完成，则可以开始追问
        for (let j = 0; j < 6 - data.max_round; j++) {
          myRounds[j] = true
        }
        that.getRelatedQA().then(function(qares){
          that.setData({
            qarounds: qares.results
          })
        })
      }      

      that.setData({
        consultdetail: data,
        consultimgs: tmpArray,
        docid: data.doctor,
        showrounds: myRounds
      })

      that.getDoctor().then(function (res) {
        that.setData({
          docname: res.username
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