const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: '',
    page: 0
  },
  /**
   * 获取课程列表
   */
  getList: function (e) {
    db.collection('Course-Info').where({
      tag: '思政课堂'
    }).limit(10).get()
      .then(res => {
        console.log(res.data)

        this.setData({
          courseList: res.data
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
this.getList()
wx.showToast({
  title: '刷新成功',
  duration: 1500,
  icon: 'success',
  complete: (res) => {
    wx.stopPullDownRefresh({
      complete: (res) => {},
      fail: (res) => {},
      success: (res) => {},
    })
  },
})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底了")
    let page = this.data.page + 10;
    console.log("当前页面数是：", page)

    wx.showLoading({
      title: '加载中...',
      complete: (res) => {
        console.log('加载中...', res)
      },
      fail: (res) => {
        console.log('加载失败', res)
      },
      mask: true,
      success: (res) => {
        console.log('加载成功', res)
      },
    })

    db.collection('Course-Info').where({
      tag: '思政课堂'
    }).limit(10).skip(page)
      .get()
      .then(res => {

        let new_data = res.data
        let old_data = this.data.courseList

        this.setData({
          courseList: old_data.concat(new_data),
          page: page
        })
        console.log("成功新增10条数据", new_data)

        wx.hideLoading({
          complete: (res) => { },
          fail: (res) => { },
          success: (res) => { },
        })
        
        if(new_data.length<1){
          wx.showToast({
            title: '已经全部加载完成！',
            complete: (res) => {
              console.log('显示完成',res)},
            duration: 1500,
            fail: (res) => {
              console.log('显示失败',res)
            },
            icon: 'none',
            mask: true,
            success: (res) => {},
          })
        }

      })
      .catch(res => {
        console.log("刷新数据失败", res)
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})