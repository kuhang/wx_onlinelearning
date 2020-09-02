

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    courseList: null,
    page: 0,
    historyList:[],
    showhis:1
  },

  /**
   * 
   * @param {搜索} options 
   */

  onChange(e) {
    this.setData({
      value: e.detail
    });
  },
  onSearch() {

    let newhisList = [...this.data.historyList] 
    newhisList.unshift(this.data.value)//添加新内容
    wx.setStorage({
      key:"searchHistory",
      data:[...new Set(newhisList)]  //去重
      //data:this.data.value
    })

    wx.cloud.callFunction({
      name:'getMystudy', 
      data:{
        action:'getSearch',
        value:this.data.value
      }
    }).then(res=>{
      console.log("搜索的info：",res.result.data)
      this.setData({
        courseList:res.result.data,
        showhis:0  //不显示历史记录
      })
    })
    .catch(res=>{
      console.log("搜索云函数请求失败",res)
    })
   
  },

  /**搜索按钮 */
  onClick() {
    
    console.log("搜索value=:",this.data.value)

    let newhisList = [...this.data.historyList] 
    newhisList.unshift(this.data.value)//添加新内容
    wx.setStorage({
      key:"searchHistory",
      data:[...new Set(newhisList)]  //去重
      //data:this.data.value
    })

    wx.cloud.callFunction({
      name:'getMystudy',
      data:{
        action:'getSearch',
        value:this.data.value
      }
    }).then(res=>{
      console.log("搜索的info：",res.result.data)
      this.setData({
        courseList:res.result.data,
        showhis:0  //不显示历史记录
      })
    })
    .catch(res=>{
      console.log("搜索云函数请求失败",res)
    })

  },

  /**显示历史 */
  showHistory(){
    wx.getStorage({
      key: 'searchHistory',
      success: (res)=> {
        console.log(res.data)
        this.setData({
          historyList:res.data
        })
      }
    })
  },

  /**删除历史记录 */
  delHistory(){
    wx.removeStorage({
      key: 'searchHistory',
      success: (res)=> {
        console.log(res)
        this.setData({
          historyList:[]
        })
      }
    })
  },

  /**历史记录搜索 */
  hisSearch(e){
    console.log(e.target.dataset.value)

    wx.cloud.callFunction({
      name:'getMystudy', 
      data:{
        action:'getSearch',
        value:e.target.dataset.value
      }
    }).then(res=>{
     // console.log("搜索的info：",res.result.data)
      this.setData({
        courseList:res.result.data,
        showhis:0  //不显示历史记录
      })
    })
    .catch(res=>{
      console.log("搜索云函数请求失败",res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showHistory()
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