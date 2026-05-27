export function getPeerData() {
  return {
    classmates: [
      { id: 'p01', name: '张三', tier: '铂金', avatar: '', isFriend: true, online: true },
      { id: 'p02', name: '李四', tier: '黄金', avatar: '', isFriend: true, online: false },
      { id: 'p03', name: '王五', tier: '白银', avatar: '', isFriend: false, online: true },
      { id: 'p04', name: '赵六', tier: '钻石', avatar: '', isFriend: true, online: true },
      { id: 'p05', name: '陈七', tier: '青铜', avatar: '', isFriend: false, online: false }
    ],
    highestTier: '钻石',
    friends: [
      { id: 'p01', name: '张三', tier: '铂金', avatar: '' },
      { id: 'p02', name: '李四', tier: '黄金', avatar: '' },
      { id: 'p04', name: '赵六', tier: '钻石', avatar: '' }
    ]
  }
}
