// pages/docconsult/docconsult.js
const api = require('../../utils/api')
const { $Message } = require('../../dist/base/index')

var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    imgurls: [],
    patid: '',
    docid: '',
    patmobile: '',
    patconsult: '',
    doctordetail: {},
    visibleDlg: false,
    hintDlginfo: '',
  },  
  handleDlgClose() {
    this.setData({
      visibleDlg: false
    });
  },

  inputConsultEvent: function(e) {
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

  submitConsultInfo: function(e) {
    console.info(">>>current token: " + actoken)
    let that = this    
    if (that.data.patconsult == '') {
      that.setData({
        hintDlginfo: '您的问题'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.images.length < 1) {
      that.setData({
        hintDlginfo: '影像图片'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }

    //数据都齐全
    wx.showModal({
      title: '确认提交',
      success: function(res) {
        if (res.confirm) {
          if (that.data.images.length > 0) { //有影像图片
            wx.showLoading({
              title: '上传图片中...',
              mask: true
            });

            var uploads = [];
            for (let i = 0; i < that.data.images.length; i++) {
              uploads[i] = that.uploadFile(that.data.images[i])
            }

            Promise.all(uploads).then((res) => {
              wx.hideLoading()
              for (let j = 0; j < res.length; j++) {
                console.log(">>>urls: " + res[j])
              }
              that.setData({
                imgurls: res,
              })

              //创建咨询单
              that.createConsult().then(function(data) {
                console.log(data);
                wx.navigateTo({
                  url: '/pages/patdashboard/patdashboard?title=patdashboard&&patmobile='+that.data.patmobile
                })              
              })

            }).catch((error) => {
              console.log(error);
            });
          } else { //无影像图片

          }
        }
      }
    })
  },


  // 上传文件
  uploadFile: function(pic) {
    return new Promise((resolve, reject) => {
      console.log(pic)
      wx.uploadFile({
        url: api.apiurl + "/consult/uploadimg/",
        filePath: pic,
        name: "file",
        header: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(">>>uploadimg url: " + res.data)
          resolve(res.data)
        },
        fail: function(err) {
          console.log(err)
          reject(err)
        }
      })
    });
  },
  
  //创建咨询信息
  createConsult: function(data) {
    let that = this
    let patid = data
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

    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/consult/",
        method: 'POST',
        data: {
          "patient": parseInt(that.data.patid),
          "doctor": parseInt(that.data.docid),
          "desc": that.data.patconsult,
          "img1_url": that.data.imgurls[0] ? that.data.imgurls[0] : "null",
          "img2_url": that.data.imgurls[1] ? that.data.imgurls[1] : "null",
          "img3_url": that.data.imgurls[2] ? that.data.imgurls[2] : "null",
          "created_time": currentDate,
          "status": "等待回答"
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          that.data.images = []
          $Message({
            content: '提交成功，请等待专家回复！',
            type: 'success',
            duration: 3
          });
          resolve(res.data) //生成的咨询信息
        },
        fail: function(err) {
          console.log(err)
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
    let that = this
    that.setData({
      docid: options.docid,
      patid: options.patid
    })

    console.log(">>>OnLoad option get patient id: " + that.data.patid)
    console.log(">>>OnLoad option get doctor id: " + that.data.docid)

    that.myinit().then(function(data) {
      actoken = data
      console.log(">>>getting token success! " + actoken)
      that.getDoctorInfo().then(function(res) {
        that.setData({
          doctordetail: res
        })
        that.getPatientMobile().then(function(patres){
          that.setData({
            patmobile: patres.mobile
          })
        })
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

  //获取医生信息
  getDoctorInfo() {
    let that = this
    let url = api.apiurl + "/xiusers/doctor/" + that.data.docid + "/"
    console.log(">>>doctor info url " + url)
    let param = ""
    let p = api.getData(url, param, actoken)
    return p
  },

  //获取患者手机，用于咨询提交成功后跳转回患者主页面
  getPatientMobile() {
    let that = this
    let url = api.apiurl + "/xiusers/patient/" + that.data.patid + "/"
    console.log(">>>patient info url " + url)
    let param = ""
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