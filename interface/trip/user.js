const router = require('koa-router')()
const DB = require('../../dbs/db')
const collectionName = 'user'
const https = require('https');

router.post('/getOpenId', async ctx => {
  const {code} = ctx.request.body
  const appid = 'wx652153c89cca9a5d',
        secret = '81f002b9549f017dc642708312e30f4a',
        js_code = code;
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${js_code}&grant_type=authorization_code`
  let data = await new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.on('data', (data) => {
        resolve(JSON.parse(data))
      });
    }).on('error', (e) => {
      reject(e)
    });
  })
  if (data.errcode) {
    ctx.body = { code: data.errcode, msg: data.errmsg }
  } else {
    ctx.body = { code: 0, msg: 'success', data: data }
  }

})

router.post('/userInfo', async ctx => {
  const result = ctx.request.body
  /**
   * nickName: 用户昵称
   * avatarUrl：用户头像
   * gender：性别（0：为止；1：男；2：女）
   * country：国家
   * province：省份
   * city：城市
   * language：country，province，city 所用的语言（en	英文；zh_CN	简体中文；zh_TW	繁体中文）
   * openId：用户唯一标识
   */
  const find = await DB.find(collectionName, {openId: result.openId})
  if(find.length > 0) {
    const res = await DB.update(collectionName, {openId: result.openId}, result)
    if(res.result.ok === 1) {
      ctx.body = { code: 0, msg: '用户信息修改成功' }
    } else {
      ctx.body = { code: 1, msg: '用户信息修改失败' }
    }
  } else {
    const res = await DB.insert(collectionName, result)
    if(res.result.ok === 1) {
      ctx.body = { code: 0, msg: '用户信息上传成功' }
    } else {
      ctx.body = { code: 1, msg: '用户信息上传失败' }
    }
  }
})

// router.get('/user/getUsers', async ctx => {
//   const res = await DB.find(collectionName, {})
//   if (res.length > 0) {
//     ctx.body = { code: 0, msg: '获取所有用户成功', data: res }
//   } else {
//     ctx.body = { code: 1, msg: '获取所有用户失败' }
//   }
// })

module.exports = router
