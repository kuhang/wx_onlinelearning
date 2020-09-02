//app.js
App({

  globalData: {
    openid: "",
    userInfo: null,
  },

  onLaunch: function () {
//var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-20',
        traceUser: true,
      })
    };

console.log('this.globalData.userInfo',this.globalData.userInfo)
   // var openid = wx.getStorageSync('openid');
   var userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      // this.setData({
      //   userInfo:this.globalData.userInfo
      // })
      this.globalData.userInfo = userInfo
    } else {

     // var that = this
      wx.cloud.callFunction({
        name: 'login'
      }).then(res=>{
    
        console.log(res.result.openid)
        console.log('res.result.userInfo=',res.result.userInfo)
        var userInfo = res.result.userInfo
      
        wx.setStorageSync("openid", res.result.openid)
        
       
        wx.setStorageSync('userInfo',res.result.userInfo)
      })

    }
    console.info(this.globalData.openid)
    
  },

})
