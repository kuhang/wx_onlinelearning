const db = wx.cloud.database()
const app = getApp()
let ID = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoSrc: '',
    count: '',
    courseInfo: '',  //couser_intro
    courseDetail: '',  //课程的所有字段
    like: false,
    likeimgSrc: '../../images/like1.png',
    likeText: "收藏",
    activeName: '1',  // 默认下拉按钮的控制
    cateStatues: -1,  // 目录部分颜色的改变
    status: 0,  //底部添加学习按钮的控制
    fileID: '',
    userInfo: '',
    value: '',
    comList: [],
    endList: ''


  },

  /**
   * 收藏按钮
   */
  clickLike: async function () {

    wx.showLoading({
      title: '请稍等...',
    })
    try {
      let that = this;
      let like = that.data.like;
      // console.log("let like = ：", like)

      if (like == "true") {
        await wx.cloud.callFunction({
          name: 'doAdd',
          data: {
            action: "deleteLike",
            id: that.data.courseDetail.cid,
            openId: wx.getStorageSync("openid"),
          }
        })
        //console.log("取消收藏的like=：", that.data.like)
        that.setData({
          like: "false",
          likeimgSrc: "../../images/like1.png",
          likeText: "收藏",

        })
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 1500
        })
      }
      else {
        await wx.cloud.callFunction({
          name: 'doAdd',
          data: {
            action: 'addLike',
            openId: wx.getStorageSync("openid"),
            id: that.data.courseDetail.cid,
            title: that.data.courseInfo.title,
            teacher: that.data.courseInfo.teacher,
            imgSrc: that.data.courseInfo.imgSrc,
            like: true,


          }
        })
        // console.log("添加收藏的like=：", that.data.like)
        that.setData({
          like: "true",
          likeimgSrc: "../../images/like2.png",
          likeText: "已收藏"

        })

        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1500
        })
      }
    }
    catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    }
    finally {
      wx.hideLoading({
        complete: (res) => { },
      })
    }

  },



  /***
   * 添加学习记录
   */
  addStudy() {



    console.log("点击获取的课程人数：", this.data.courseInfo.count)

    //调用云函数更新人数
    wx.cloud.callFunction({
      name: "doAdd",
      data: {
        action: "addStudy",
        id: ID,
      }
    }).then(res => {
      console.log('改变状态成功:', res)

      db.collection('Course-Info').where({
        cid: ID
      }).get()
        .then(res => {

          this.setData({
            count: res.data[0].course_intro.count,
            status: 1
          })
          wx.showToast({
            title: '添加成功',
            duration: 1000,
            icon: 'success',
            mask: true,
          })
          console.log('当前最近学习count：', this.data.count)
        })
    }).catch(res => {
      console.log('改变状态失败', res)
    })

    // 添加到我的学习

    wx.showLoading({  ////显示loading
      title: '添加中...',
      mask: true,
    })

    db.collection('Course-User').add({
      data: {
        title: this.data.courseInfo.title,
        teacher: this.data.courseInfo.teacher,
        imgSrc: this.data.courseInfo.imgSrc,
        cid: this.data.courseDetail.cid,
        status: 1
      }
    }).then(res => {
      this.setData({
        status: 1
      })
      console.log("成功添加我的学习", res)
      wx.hideLoading({ //隐藏loading
        complete: (res) => { },
        fail: (res) => { },
        success: (res) => { },
      })

    }).catch(res => {
      console.log("添加失败", res)
    })

  },

  onChange(event) {
    this.setData({
      activeName: event.detail
    });


  },

  /**
   * 
   * 选择视频 
   */
  selectVideo(e) {
    console.log('当前的状态值：', e.currentTarget.dataset.index)
    var cateStatues = e.currentTarget.dataset.index
    var videoSrc = this.data.courseDetail.video_list[cateStatues].videoSrc
    // wx.setStorageSync('cateStatues', cateStatues)


    this.setData({
      cateStatues: cateStatues,
      videoSrc: videoSrc,
      //endData:this.data.courseDetail.cid+cateStatues
    })
    console.log("当前页视频SRC", videoSrc)

  },

  /**
   * 
   * @param {播放完成} options 
   */
  playEnd() {

    db.collection('Test-User').add({
      data: {
        cid: this.data.courseDetail.cid,
        cateid: this.data.cateStatues,
        playEnd: true

      }
    })
      .then(res => {

      })

  },
  playErr() {
    wx.showToast({
      title: '视频出错',
      icon: 'none',
      duration: 1700
    })
  },

  /**
   * 生命周期函数--监听页面加载  onLoad  onLoad
   */
  onLoad: async function (options) {

    //查看是否已学完


    db.collection('Test-User').where({
      _openid: wx.getStorageSync("openid"),
      cid: options.id,
      //cateid:wx.getStorageSync('cateStatues')
    }).get()
      .then(res => {
        console.log('学完的课程', res.data[0])
        this.setData({
          endList: res.data[0]
        })
      })


    //  //查询新增我的学习
    wx.cloud.callFunction({
      name: "doAdd",
      data: {
        action: "studyButton",
        openId: wx.getStorageSync("openid"),
        id: options.id,
      }
    }).then(res => {
      console.log("查询新增我的学习:", res)

      this.setData({
        status: res.result.data.length
      })
    }).catch(res => {
      console.log("云函数查询失败:", res)
    })


    // 详情部分

    console.log("options的值：", options)
    ID = options.id
    db.collection('Course-Info').where({
      cid: ID
    }).get()
      .then(res => {
        console.log("详情页数据请求的全部数据：", res.data[0])
        // like = res.data[0].like
        var courseInfo = res.data[0].course_intro
        var count = res.data[0].course_intro.count

        this.setData({
          count: count,
          courseDetail: res.data[0],
          courseInfo: courseInfo,

          userInfo: app.globalData.userInfo //获取用户信息


        })
        // console.log("课程info.res：", courseInfo.res)
        console.log("课程info：", courseInfo)
        console.log("openid:", wx.getStorageSync("openid"))
      })
      .catch(res => {
        console.log("详情页数据请求失败：", res)
      })

    //获取收藏状态：
    db.collection('Course-Like').where({
      cid: ID,
      _openid: wx.getStorageSync("openid")
    }).get()
      .then(res => {
        console.log("Course-Like的查询数据", res)

        let likeState = res.data
        console.log("likeState.length=", likeState.length)

        this.setData({
          like: likeState.length == 1 ? 'true' : 'false',
          likeimgSrc: likeState.length == 1 ? "../../images/like2.png" : "../../images/like1.png",
          likeText: likeState.length == 1 ? "已收藏" : "收藏"
        })
        console.log("Course_Like的like：", this.data.like)

      })



  },

  /**下载课件 */
  downRes(e) {
    wx.showLoading({
      title: '下载中',

    })
    console.log('e=', e)

    var fileID = e.currentTarget.dataset.res
    wx.cloud.downloadFile({
      fileID: fileID, // 'cloud://test-20.7465-test-20-1301342246/resourse/javaspring-c1-1.pdf',
      success: res => {
        // get temp file path
        console.log('res.tempFilePath', res.tempFilePath)
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
            wx.hideLoading({
              complete: (res) => {
                wx.showToast({
                  title: '下载成功',
                  icon: 'success',
                  duration: 1500
                })
              },
            })

          }
        })
      },
      fail: err => {
        console.log('下载失败', err)
        wx.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 1500
        })
      }
    })

  },


  /**
    * 
    * @param {获取输入的文字} options 
    */
  getInput(e) {
    // console.log('输入的文字：',e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },


  /**
   * 日期转换
   */

  dateFormat(fmt, date) {
    let ret;
    const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      };
    };
    return fmt;
  },

  /**
   * 
   * @param {发表按钮} options 
   */
  sentBtn() {
    if (this.data.value == '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '发表中',
    })
    var olddate = new Date()
    var newdate = this.dateFormat("YYYY/mm/dd", olddate)
    console.log('newdate', newdate)
    db.collection('Course-comment')
      .add({
        data: {
          avatarUrl: this.data.userInfo.avatarUrl,
          nickName: this.data.userInfo.nickName,
          cid: this.data.courseDetail.cid,
          comContent: this.data.value,
          comTime: newdate,
          comDate: olddate
        }
      })
      .then(res => {
        console.log("评论上传成功", res)
        wx.hideLoading({
          complete: (res) => { },
        })
        this.setData({
          value: '',
        })
        this.getCom()
      })
      .catch(res => {
        console.log("评论失败", res)
        wx.showToast({
          title: '小程序出现问题，评论失败',
          icon: 'none'
        })
      })
  },


  /**获取评论 */
  getCom() {
    wx.cloud.callFunction({
      name: 'getMystudy',
      data: {
        action: 'getCom',
        id: this.data.courseDetail.cid,
      }
    }).then(res => {
      console.log('评论列表：', res.result.data)
      this.setData({
        comList: res.result.data
      })
    })
  },

  /**
   * 删除评论
   */
  delCom(e) {
    wx.showModal({
      title: '提示',
      content: '将删除此条评论',
      success: (res) => {
        if (res.confirm) {
          // console.log('用户点击确定')
          //console.log('删除操作data-id',e.target.dataset.id)

          // db.collection('Course-comment')
          //   .where({
          //     _id: e.target.dataset.id,
          //     _openid: this.data.userInfo.openid,
          //   })
          //   .remove()
          //   .then(res => {
          //     console.log('评论删除成功', res)
          //     this.getCom()
          //   })
          //   .catch(res => {
          //     console.log('删除失败', res)
          //   })
          wx.cloud.callFunction({
            name: 'getMystudy',
            data: {
              action: 'delCom',
              _id: e.target.dataset.id
            }
          }).then(res => {
            this.getCom()
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 1500
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    //this.getCom()
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

    if (!app.globalData.userInfo) {
      // wx.navigateTo({
      //   url: '../login/login'
      // })
      wx.showModal({
        title: '提示',
        content: '请先微信登录',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
           wx.switchTab({
             url: '/pages/home/home',
           })
          }
        }
      })
    }
    // this.getCom();


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
    console.log(ID)
    return {
      title: "微学堂WeLearn小程序的分享",
      path: '/pages/detail/detail?id=' + ID,
    }

  }
})