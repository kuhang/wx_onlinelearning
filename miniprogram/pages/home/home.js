const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImg:[],//轮播图
    navItem: [], //分类导航
    goodIntro: [], //课程推荐

    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1500, //滑动动画时长
    circular: true //是否采用衔接滑动,循环滑动
  },

  /**
    * 轮播图
    */
  getSwiper: function(e){
    db.collection('Swiper').get()
      .then(res => {
        this.setData({
          swiperImg: res.data
        })
      })
  },

  /**
   * 分类导航
   */

  getNavItem: function(e) {
    db.collection('Course-Nav').get()
      .then(res => {
        this.setData({
          navItem: res.data
        })
      })
  },

 
  /***
   * 课程推荐
   */

  getGoodIntro: function (e) {
    db.collection('Course-Info').where({
      intro: _.exists(true)
    }).get()
      .then(res => {
        this.setData({
          goodIntro: res.data
        })
      })
  },

  /**
 * 跳转详情页
 */
goDetail(e) {
  //console.log("点击时传递的参数",e.currentTarget.dataset.id)
 wx.navigateTo({
   url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id,
 })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSwiper() //轮播图
    this.getNavItem() //分类导航
    this.getGoodIntro() //课程推荐
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
    this.getSwiper() 
    this.getGoodIntro()
    wx.showToast({
      title: '刷新成功',
      duration: 1500,
      icon: 'success',
      complete: (res) => {
        wx.stopPullDownRefresh({
          complete: (res) => { },
          fail: (res) => { },
          success: (res) => { },
        })
      },
    })
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