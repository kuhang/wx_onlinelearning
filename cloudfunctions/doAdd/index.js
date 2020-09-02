// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test-20',
  traceUser: true,
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {

    case 'addStudy': {
      return addStudy(event)
    }
    case 'studyButton': {
      return studyButton(event)
    }
    case 'deleteLike': {
      return deleteLike(event)
    }
    case 'addLike': {
      return addLike(event)
    }

    default: break
  }




}


/**
 * 处理课程收藏
 * 
 */
async function addLike(event) {

  console.info(event)
  let likeRelated = await db.collection('Course-Like').where({
    openId: event.openId == undefined ? event.userInfo.openId : event.openId,
    cid: event.id,
    like: event.like
  }).get();
  if (likeRelated.data.length === 0) {
    await db.collection('Course-Like').add({
      data: {
        _openid: event.openId == undefined ? event.userInfo.openId : event.openId,
        cid: event.id,
        title: event.title,
        teacher: event.teacher,
        imgSrc: event.imgSrc,
        like: event.like

      }
    })
  }

}



/**
 * 移除收藏
 * 
 */
async function deleteLike(event) {

  await db.collection('Course-Like').where({
    _openid: event.openId == undefined ? event.userInfo.openId : event.openId,
    cid: event.id,
  }).remove()

}



//添加学习
async function studyButton(event) {
  return await db.collection('Course-User')
    .where({
      _openid: event.openId == undefined ? event.userInfo.openId : event.openId,
      cid: event.id
    }).get().catch(res => {
      console.log("studyButton失败", res)
    })
}

//增加学习人数
async function addStudy(event) {
  return await db.collection('Course-Info')
    .where({
      cid: event.id
    })
    .update({
      data: {
        "course_intro.count": _.inc(1)
      }
    })
    .catch(res => {
      console.log('改变状态失败', res)

    })

}