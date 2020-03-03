//import regeneratorRuntime from 'runtime.js'
const apiurl = "http://127.0.0.1:8000"
const client_id = "EtBlBYFGxNAcHpn3j5bKRcdvmbe6Rn3dK0lYEp8X"
const client_secret = "XTy25ZVWLpvDzXfYVenrkVD5a5k7wQpaNMKtFBdZCkzhv7hl1VlcD7MpJYW9cSeWcgtYQ1NpYDRhcs0SQneipAKQUEnVR7zXRja7EWO3jYgr4eTozEc6g7Nf8eoMBH0x"
const scope_users = "users"
const scope_consult = "consult"

const getAccessToken = (mobile, password) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiurl + "/o/token/",
      method: 'POST',
      data: {
        "username": mobile,
        "password": password,
        "grant_type": "password",
        "scope": scope_users + " " + scope_consult,
        "client_id": client_id,
        "client_secret": client_secret
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(">>>Get accesstoken successed!")
        var json = res.data;
        console.log(">>>accesstoken result: ");
        console.log(json);
        console.log(json["access_token"]);
        resolve(json["access_token"])
      },
      fail: function (err) {
        console.log(">>>Get accesstoken failed!")
        console.log(err)
        reject("failed")
      }
    })
  })
}

// request get 请求
const getData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      success(res) {
        console.log(res)
        resolve(res.data)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

// request post 请求
const postData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: param,
      success(res) {
        console.log(res)
        resolve(res.data)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}


module.exports = {
  apiurl: apiurl,
  client_id: client_id,
  client_secret: client_secret,
  scope_users: scope_users,
  scope_consult: scope_consult,
  getAccessToken: getAccessToken,
  getData: getData,
  postData: postData,
}
