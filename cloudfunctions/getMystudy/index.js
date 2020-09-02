// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-20',
  traceUser: true,
})


const db = cloud.database()
const _ = db.command
//云函数入口函数
exports.main = async (event, context) => {

  console.log('event=:', event)

  switch (event.action) {

    case 'getStudy': {
      return getStudy(event)
    }
    case 'getLike': {
      return getLike(event)
    }
    case 'getSearch': {
      return getSearch(event)
    }
    case 'delCourse': {
      return delCourse(event)
    }
    case 'getCom': {
      return getCom(event)
    }
    case 'delCom': {
      return delCom(event)
    }
    default: break
  }

  // return await db.collection('Test-User').where({
  //   _openid: event.userInfo.openId
  // }).get()


  async function getStudy(event) {
    return await db.collection('Course-User').where({
      _openid: event.userInfo.openId
    }).get()
  }

  async function getLike(event) {
    return await db.collection('Course-Like').where({
      _openid: event.userInfo.openId
    }).get()
  }
}


async function getSearch(event) {
  return await db.collection('Course-Info').where(_.or([{
    title: db.RegExp({
      regexp: '.*' + event.value,
      options: 'i',
    })
  },
  {
    teacher: db.RegExp({
      regexp: '.*' + event.value,
      options: 'i',
    })
  },
  {
    category: db.RegExp({
      regexp: '.*' + event.value,
      options: 'i',
    })
  }
  ])).get()
}

async function delCourse(event) {
  return await db.collection('Course-User').where({
    _openid: event.userInfo.openId,
    cid: event.id
  }).remove()
}

async function getCom(event) {
  return await db.collection('Course-comment')
    .orderBy('comDate', 'desc')
    .where({
      cid: event.id
    })
    .get()

}

async function delCom(event) {
  return await db.collection('Course-comment')
    .where({
      _id: event._id,
      _openid: event.userInfo.openId,
    })
    .remove()
}