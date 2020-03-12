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
    docname: '',
    visibleDlg: false,
    hintDlginfo: '',
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
    patage: '30'
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

  handleDlgClose() {
    this.setData({
      visibleDlg: false
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
    if (that.data.currentsex == '') {
      that.setData({
        hintDlginfo: '性别'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.patage == '') {
      that.setData({
        hintDlginfo: '年龄'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.patconsult == '') {
      that.setData({
        hintDlginfo: '您的问题'
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

              //查询该手机号的患者是否存在
              that.searchPatient().then(function(data) {
                console.log(data);
                if (data.count > 0) { //存在，更新患者数据
                  let patid = data.results[0].id
                  console.log(">>>found patient " + patid)
                  wx.showToast({
                    title: '手机已经存在',
                    icon: 'none',
                    duration: 1000,
                  })
                  return that.createConsult(patid)
                } else { //不存在，需要注册患者
                  that.registerPatient().then(function(data) {
                    let patid = data
                    console.log(">>>created new patient " + patid);
                    that.updatePatient(patid).then(function(res) {
                      return that.createConsult(patid)
                    })
                  })
                }
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
          "password": that.data.patmobile,
          "subpassword": that.data.patmobile,
          "validate_code": 123456 //that.data.validate_code
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '您是新用户，创建账号成功，密码是您的手机号，后续请自行修改！',
            icon: 'success',
            duration: 2000,
          })
          resolve(res.data.userId)
        },
        fail: function(err) {
          console.log(err)
          // wx.showToast({
          //   title: '创建账号失败',
          //   icon: 'none',
          //   duration: 1000,
          // })
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
    // for (let k = 0; k < that.data.imgurls.length; k++) {
    //   console.log(">>>imgurl " + k + " " + that.data.imgurls[k])
    // }

    //更新患者信息
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/patient/" + newPatId + "/",
        method: 'PUT',
        data: {
          "username": that.data.patname,
          "sex": that.data.currentsex,
          "age": that.data.patage,
          "nick_name": "苦海寻医",
          "id_card": "110101198010010001",
          "birthday": "1980-10-01"
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          // wx.showToast({
          //   title: '更新成功',
          //   icon: 'success',
          //   duration: 1000,
          // })
          resolve(res.data)
        },
        fail: function(err) {
          console.log(err)
          wx.showToast({
            title: '更新失败',
            icon: 'none',
            duration: 1000,
          })
          reject(err)
        }
      })
    })

    return p
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
          "patient": patid,
          "doctor": parseInt(doctorID),
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
          wx.showToast({
            title: '提交成功，请等待医生回复！',
            icon: 'success',
            duration: 1000,
          })
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
    doctorID = 1
    //options.q的场景仅仅用于微信后台配置的有限测试二维码
    if (options.q) {
      var link = options.q;　　
      console.log(">>>OnLoad q get link as " + link);      
      doctorID = link.charAt(link.length - 1)
      console.log(">>>OnLoad q get doctor id: " + doctorID)
    }
    
    //scene的场景是通用的，将来由服务端后台动态生成每个医生的二维码
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      console.log(">>>OnLoad scene get input parameter: " + scene)
      
      let tmpArr = scene.split("-")
      doctorID = tmpArr[1]
      console.log(">>>OnLoad get doctor id: " + doctorID)
    }

    that.myinit().then(function(data) {
      actoken = data
      console.log(">>>getting token success! " + actoken)
      that.getDoctorInfo().then(function(res) {
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