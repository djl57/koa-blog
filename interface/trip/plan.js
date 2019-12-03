const router = require('koa-router')()
const DB = require('../../dbs/db')
const collectionName = 'cover'
const collectionName2 = 'plan'

router.get('/test', async ctx => {
  // console.log(result)
  console.log(ctx.url)
  ctx.body = { code: 0, msg: '行程添加成功' }
})
router.post('/post', async ctx => {
  const result = ctx.request.body
  console.log(result)
  ctx.body = { code: 0, msg: '行程添加成功' }
})
/**
 * destination:"北京"
 * endDate:"2019年05月10日"
 * openId:"oktrh5Ar0pGJ8EiqVze1e2IfNBas"
 * peoNum:"1"
 * startDate:"2019年05月09日"
 * status: 
 * 返回一个旅程id
 */
router.post('/cover', async ctx => {
  console.log(ctx.url)
  const result = ctx.request.body
  /**
   * 0：进行中旅程
   * 1：已完成旅程
   */
  result.status = 0
  const insert = await DB.insert(collectionName, result)
  if (insert.result.ok === 1) {
    ctx.body = { code: 0, msg: '封面插入成功', }
  } else {
    ctx.body = { code: 1, msg: '封面插入失败' }
  }
})

/**
 * planId: -1（新建旅程后进入plan页面，其他页面进入plan页面拿具体的旅程id）
 * openId： ''
 */
router.get('/getCurPlan', async ctx => {
  const params = ctx.url.split('?')[1].split('&')
  const planId = params[0].split('=')[1]
  const openId = params[1].split('=')[1]
  const res = await DB.find(collectionName, { "openId": openId })
  if (res.length > 0) {
    if (planId === '-1') {
      ctx.body = { code: 0, msg: '获取当前行程封面成功', data: res[res.length - 1] }
    } else {
      let data = {}
      for (let props of res) {
        // const id = await DB.getObjectId(planId)
        // console.log(props._id)
        // console.log(id)
        if (props._id == planId) {
          data = props
        }
      }
      ctx.body = { code: 0, msg: '获取当前行程封面成功', data: data }
    }
  } else {
    ctx.body = { code: 1, msg: '获取当前行程封面失败' }
  }
})

/**
 * title: '行程名称',
 * startTime: '出发时间',
 * tripMode: '出行方式',
 * budget: '费用估计',
 * takeTime: '计划用时'
 * curNav: '0'（旅程第一天）
 * num: '0'（第一天的第一个行程）
 * openId: ''
 * planId：'旅程id'
 */
router.post('/plan', async ctx => {
  const result = ctx.request.body
  // console.log(result)
  const insert = await DB.insert(collectionName2, result)
  if (insert.result.ok === 1) {
    ctx.body = { code: 0, msg: '行程添加成功' }
  } else {
    ctx.body = { code: 1, msg: '行程添加失败' }
  }
})

/**
 * 获得某旅程的所有行程
 * planId: -1 || _id
 */
router.get('/getPlans', async ctx => {
  // console.log(ctx.url)
  const planId = ctx.url.split('?')[1].split('=')[1]
  const res = await DB.find(collectionName2, { "planId": planId })
  // console.log(res)
  if (res.length > 0) {
    ctx.body = { code: 0, msg: '获取行程成功', data: res }
  } else {
    ctx.body = { code: 0, msg: '暂无行程', data: [] }
  }
})

/**
 * 获得旅程
 * openId: ''
 * status: 0（获得所有未完成旅程），1（获得所有已完成旅程），2（获得所有旅程）
 */
router.get('/getOnCovers', async ctx => {
  const params = ctx.url.split('?')[1].split('&')
  const openId = params[0].split('=')[1]
  const status = +params[1].split('=')[1]

  const res = await DB.find(collectionName, { "openId": openId })
  if (res.length > 0) {
    let data = []
    for (let prop of res) {
      if (prop.status === status) {
        data.push(prop)
      }
    }
    ctx.body = { code: 0, msg: '获取旅程成功', data: data }
  } else {
    ctx.body = { code: 0, msg: '暂无旅程', data: [] }
  }
})

/**
 * 修改行程内容
 * _id
 * title: '行程名称',
 * startTime: '出发时间',
 * tripMode: '出行方式',
 * budget: '费用估计',
 * takeTime: '计划用时'
 * curNav: '0'（旅程第一天）
 * num: '0'（第一天的第一个行程）
 * openId: ''
 * planId
 */
router.post('/editPlan', async ctx => {
  const result = ctx.request.body
  // console.log(result)
  const updateData = {
    title: result.title,
    startTime: result.startTime,
    tripMode: result.tripMode,
    budget: result.budget,
    takeTime: result.takeTime
  }
  const up = { _id: await DB.getObjectId(result._id) }
  // console.log(up)
  const update = await DB.update(collectionName2, up, updateData)
  if (update.result.ok === 1) {
    ctx.body = { code: 0, msg: '行程修改成功' }
  } else {
    ctx.body = { code: 1, msg: '行程修改失败' }
  }
})

router.post('/delPlan', async ctx => {
  const result = ctx.request.body
  const up = { _id: await DB.getObjectId(result.id) }
  // console.log(up)
  const remove = await DB.remove(collectionName2, up)
  // console.log(remove)
  if (remove.result.ok === 1) {
    ctx.body = { code: 0, msg: '行程删除成功' }
  } else {
    ctx.body = { code: 1, msg: '行程删除失败' }
  }
})

router.post('/coverFinish', async ctx => {
  const result = ctx.request.body
  // console.log(result)
  const up = { _id: await DB.getObjectId(result.id) }
  const update = await DB.update(collectionName, up, { status: 1 })
  if (update.result.ok === 1) {
    ctx.body = { code: 0, msg: '旅程状态修改成功' }
  } else {
    ctx.body = { code: 1, msg: '旅程状态修改失败' }
  }
})

module.exports = router
