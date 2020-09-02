
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'test-20',
  traceUser: true,
})

exports.main = (event, context) => {
  console.log(event)
  console.log(context)

  
  const wxContext = cloud.getWXContext()

  return {
    openid: event.userInfo.openId,
    userInfo:event.userInfo,
  }
}

