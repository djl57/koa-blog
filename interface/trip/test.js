const router = require('koa-router')()
const DB = require('../../dbs/db')
const collectionName = 'cover'
const collectionName2 = 'plan'

router.post('/cover', async ctx => {
  console.log(ctx.url)
  const result = ctx.request.body
  result.status = 0
  const insert = await DB.insert(collectionName, result)
  if (insert.result.ok === 1) {
    ctx.body = { code: 0, msg: '封面插入成功', }
  } else {
    ctx.body = { code: 1, msg: '封面插入失败' }
  }
})

module.exports = router
