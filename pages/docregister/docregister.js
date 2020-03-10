// pages/docregister/docregister.js
const app = getApp()
const api = require('../../utils/api')

var actoken = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    imgurls: [],
    docname: '',
    docmobile: '',
    clinicname: '',
    password: '',
    subpassword: '',
    valcodeinfo: '发送验证码',
    validate_code: '',
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

  inputDocNameEvent: function(e) {
    console.log(">>>inputDocNameEvent: " + e.detail.detail.value)
    this.setData({
      docname: e.detail.detail.value
    })
  },

  inputDocMobileEvent: function(e) {
    console.log(">>>inputDocMobileEvent: " + e.detail.detail.value)
    this.setData({
      docmobile: e.detail.detail.value
    })
  },

  inputClinicNameEvent: function(e) {
    console.log(">>>inputClinicNameEvent: " + e.detail.detail.value)
    this.setData({
      clinicname: e.detail.detail.value
    })
  },

  inputDocPassEvent: function(e) {
    console.log(">>>inputDocPassEvent: " + e.detail.detail.value)
    this.setData({
      password: e.detail.detail.value
    })
  },
  inputDocPass2Event: function(e) {
    console.log(">>>inputDocPass2Event: " + e.detail.detail.value)
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

  submitRegInfo: function(e) {
    console.info(">>>current token: " + actoken)
    let that = this
    if (that.data.docname == '') {
      that.setData({
        hintDlginfo: '您的姓名'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.docmobile == '') {
      that.setData({
        hintDlginfo: '手机号码'
      })
      that.setData({
        visibleDlg: true
      });
      return
    }
    if (that.data.clinicname == '') {
      that.setData({
        hintDlginfo: '诊所名称'
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
    if (that.data.images.length == 0) {
      that.setData({
        hintDlginfo: '您的头像和诊所图片'
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

            //查询该手机号的医生是否存在
            that.searchDoctor().then(function (data) {
              console.log(data);
              if (data.count > 0) {//存在，更新医生数据
                let docid = data.results[0].id
                console.log(">>>found doctor " + docid)
                wx.showToast({
                  title: '抱歉，您的手机号已经注册过了',
                  icon: 'none',
                  duration: 2000,
                })
              }else {
                //注册医生
                that.registerDoctor().then(function (data) {
                  console.log(data);
                  return that.updateDoctor(data);
                })
              }
            })

          }).catch((error) => {
            console.log(error);
          });
        }
      }
    })
  },

  // 上传文件
  uploadFile: function(pic) {
    return new Promise((resolve, reject) => {
      console.log(pic)
      wx.uploadFile({
        url: api.apiurl + "/xiusers/uploadimg/",
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

  //查询医生是否存在
  searchDoctor: function () {
    let that = this
    let schmobile = that.data.docmobile
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/doctor/list/?search=" + schmobile,
        method: 'GET',
        data: {},
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function (res) {
          console.log(res.data)
          resolve(res.data)//查询到的符合电话号码的医生
        },
        fail: function (err) {
          console.log(err)
          reject(err)
        }
      })
    })

    return p
  },

  // 注册医生
  registerDoctor: function() {
    let that = this
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/doctor/register/",
        method: 'POST',
        data: {
          //"username": that.data.docname,
          "mobile": that.data.docmobile,
          "password": that.data.password,
          "subpassword": that.data.subpassword,
          //"hospital": that.data.clinicname,
          //"hospital_img": that.data.imgurls[1],
          "validate_code": 123456//that.data.validate_code
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

  //补充医生信息
  updateDoctor: function(value) {
    let that = this
    let newDocId = value
    console.log(">>>new doctor id is: " + newDocId)
    // for (let k = 0; k < that.data.imgurls.length; k++) {
    //   console.log(">>>imgurl " + k + " " + that.data.imgurls[k])
    // }

    //更新医生信息
    let p = new Promise((resolve, reject) => {
      wx.request({
        url: api.apiurl + "/xiusers/doctor/" + newDocId + "/",
        method: 'PUT',
        data: {
          "username": that.data.docname,
          "sex": "未知",
          "nick_name": "医之大者",
          "id_card": "110101195010010001",
          "birthday": "1950-10-01",
          "hospital": that.data.clinicname,
          "hospital_img": that.data.imgurls[1],
          "department": "未知",
          "good_point": "国医堂",
          "good_at": "养心正气",
          "summary": "医者仁心"          
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": "Bearer " + actoken
        },
        success: function(res) {
          console.log(res.data)
          that.data.images = []
          wx.showToast({
            title: '注册成功，请等待审核结果！',
            icon: 'success',
            duration: 2000,
          })
          resolve(res.data)
        },
        fail: function(err) {
          console.log(err)
          wx.showToast({
            title: '注册失败，请重新进入页面提交数据！',
            icon: 'none',
            duration: 2000,
          })
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
    var scene = decodeURIComponent(options.scene)
    console.log(">>>OnLoad get input parameter: " + scene)

    //执行异步函数
    this.myinit().then(function (data) {
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