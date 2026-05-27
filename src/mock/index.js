// Mock基础设施 - 延迟模拟工具

export function delay(ms) {
  return new Promise(resolve => {
    const jitter = Math.random() * ms * 0.4
    setTimeout(resolve, ms + jitter)
  })
}

// 模拟网络请求延迟 200-800ms
export function mockRequest(min = 200, max = 800) {
  return delay(min + Math.random() * (max - min))
}

// 模拟成功响应
export function mockResponse(data, min = 200, max = 600) {
  return mockRequest(min, max).then(() => ({ code: 200, data, message: 'success' }))
}

// 模拟分页响应
export function mockPageResponse(list, page, pageSize, total) {
  return mockResponse({
    list,
    page,
    pageSize,
    total: total || list.length,
    hasMore: page * pageSize < (total || list.length)
  })
}

// 随机从数组中取N个元素
export function randomPick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// 随机整数
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 随机打乱数组
export function shuffle(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 加权随机选择 (weights数组对应arr各元素的权重)
export function weightedPick(arr, weights) {
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let random = Math.random() * totalWeight
  for (let i = 0; i < arr.length; i++) {
    random -= weights[i]
    if (random <= 0) return arr[i]
  }
  return arr[arr.length - 1]
}
