// 段位定义
export const TIERS = [
  { name: '青铜', index: 0, color: '#CD7F32', bg: '#F5E6D3', minScore: 0 },
  { name: '白银', index: 1, color: '#95A5A6', bg: '#E8ECED', minScore: 90 },
  { name: '黄金', index: 2, color: '#F1C40F', bg: '#FDF5D6', minScore: 85 },
  { name: '铂金', index: 3, color: '#5DADE2', bg: '#E1F0FA', minScore: 85 },
  { name: '钻石', index: 4, color: '#48C9B0', bg: '#D5F5E3', minScore: 85 },
  { name: '王者', index: 5, color: '#9B59B6', bg: '#F0E6F6', minScore: 85 }
]

// 10大考点
export const EXAM_POINTS = [
  { id: 'ziyin', name: '字音', icon: '🔊' },
  { id: 'zixing', name: '字形', icon: '✍️' },
  { id: 'tongyici', name: '同义词', icon: '🔄' },
  { id: 'paixu', name: '排序', icon: '🔢' },
  { id: 'bingju', name: '病句', icon: '🏥' },
  { id: 'biaodian', name: '标点', icon: '〰️' },
  { id: 'xiuci', name: '修辞', icon: '🎨' },
  { id: 'chengyu', name: '成语', icon: '📚' },
  { id: 'wenxue', name: '文学常识', icon: '📖' },
  { id: 'chuantong', name: '传统文化', icon: '🏮' }
]

// 情感分类 (古诗阅读)
export const EMOTION_CATEGORIES = [
  { id: 'aiguo', name: '爱国情怀', emoji: '🇨🇳', color: '#E74C3C' },
  { id: 'shanshui', name: '大美河山', emoji: '🌄', color: '#27AE60' },
  { id: 'zhuangzhi', name: '壮志未酬', emoji: '😮‍💨', color: '#8E44AD' },
  { id: 'tianyuan', name: '田园闲适', emoji: '🌿', color: '#229954' },
  { id: 'songbie', name: '友情送别', emoji: '👋', color: '#2980B9' }
]

// 应用文体类型
export const PRACTICAL_FORMATS = [
  { id: 'tongzhi', name: '通知', example: '关于举办运动会的通知' },
  { id: 'qishi', name: '启事', example: '寻物启事' },
  { id: 'qingjia', name: '请假条', example: '请假条' },
  { id: 'yaoqing', name: '邀请函', example: '元旦晚会邀请函' },
  { id: 'changyi', name: '倡议书', example: '节约用水倡议书' },
  { id: 'shenqing', name: '申请书', example: '加入学生会申请书' }
]

// 写作聚焦点
export const FEEDBACK_FOCUS = [
  { id: 'structure', name: '结构优化', icon: '🔧', desc: '段落安排、首尾呼应' },
  { id: 'detail', name: '细节丰富', icon: '✏️', desc: '加入例子、描写' },
  { id: 'language', name: '语言润色', icon: '📝', desc: '减少重复词、修改病句' }
]

// Coach消息场景
export const COACH_SCENARIOS = {
  consecutiveError: {
    icon: '⚠️',
    color: '#E74C3C',
    templates: [
      "注意！'{tag}'这个点你又混了，{n}道题{minutes}分钟搞掉它 →",
      "兄弟，'{tag}'又错了！今天花{minutes}分钟把这{n}道题干掉 →"
    ]
  },
  progress: {
    icon: '🎉',
    color: '#27AE60',
    templates: [
      "'{point}'正确率{from}%→{to}%，稳住了！明天主攻{target} →",
      "厉害！'{point}'进步明显，继续保持！接下来攻克{target} →"
    ]
  },
  inactive: {
    icon: '💤',
    color: '#F39C12',
    templates: [
      "兄弟{day}天没来了，错题快溢出啦，花{minutes}分钟清{n}题就行 →",
      "{day}天不见，你的错题本在召唤！{minutes}分钟来两题？→"
    ]
  }
}
