const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseInfo: [],
    
  },
/**
   * 继续学习
   * @param {*} options 
   */
  goStudy(e) {
    console.log('前端传递的data为：', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
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
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getMystudy',
      data:{
        action:'getLike'
      }
    }).then(res => {
      wx.hideLoading({
        complete: (res) => {},
      })
      console.log('查询的结果：', res.result.data)
      var courseInfo = res.result.data
      this.setData({
        courseInfo: courseInfo,
        
      })
    }).catch(res => {
      console.log("调用失败", res)
    })
  


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