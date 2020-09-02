const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    userPhoto:'../../images/unlogin.png'
  },

  bindGetUserInfo(e){
    
    wx.navigateTo({
        url: '../login/login'
      }) 
  },
/**
 * 
 * @param {显示联系方式} options 
 */
showWecode(){
  wx.previewImage({
    urls: ['https://7465-test-20-1301342246.tcb.qcloud.la/images/wechat.png?sign=3aab84706b84498544f0fa38bf769dba&t=1586591412'],
    current: 'https://7465-test-20-1301342246.tcb.qcloud.la/images/wechat.png?sign=3aab84706b84498544f0fa38bf769dba&t=1586591412'
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = app.globalData.userInfo
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        duration:3000
      })
      // wx.navigateTo({
      //   url: '../login/login'
      // }) 
    }else if(this.data.userInfo == null){
      console.log('userInfo=:',userInfo)   
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})