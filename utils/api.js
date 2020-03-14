//import regeneratorRuntime from 'runtime.js'
const apiurl = "http://127.0.0.1:8000"
//const apiurl = "https://www.rivertoday.tech"
const client_id = "dmCgAL4L4C7zxTpgViMN7FzujAe9Mftj0wZyU89r"
const client_secret = "Cudzs5RtONgDZnG8GFfuLtxQoXteH57nxiL6ePHih9QOx43kol5mWm83DLeoALL3dyO8cUts8SRaQCdJbRE7y30XCUloLUpM4FFRnMxQCVIIMWMheelHMNCkjQqEsgyU"
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
        var json = res.data;
        console.log(">>>getAccessToken result: ");
        console.log(json);
        if (json.hasOwnProperty("access_token")) {
          console.log(json["access_token"]);
          resolve(json["access_token"])
        }else{
          console.log(json["error"])
          resolve(json["error"])
        }
      },
      fail: function (err) {
        console.log(">>>Get accesstoken failed!")
        console.log(err)
        reject("failed")
      }
    })
  })
}

// request get 查询请求
const getData = (url, param, token) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'GET',
      data: param,
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": "Bearer " + token
      },
      success(res) {        
        var json = res.data;
        console.log(json)
        resolve(json)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

// request post 创建请求
const postData = (url, param, token) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: param,
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": "Bearer " + token
      },
      success(res) {
        var json = res.data;
        console.log(json)
        resolve(json)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}

// request put 更新请求
const putData = (url, param, token) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'PUT',
      data: param,
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": "Bearer " + token
      },
      success(res) {
        var json = res.data;
        console.log(json)
        resolve(json)
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
  putData: putData,
}
