// OCR模拟器: 模拟手写识别结果
// 75%有1-3个错字 / 15%完全正确 / 10%低置信度触发重拍

export function simulateOcr(correctAnswer) {
  const roll = Math.random()

  // 10% low confidence → retry
  if (roll < 0.1) {
    return {
      recognizedText: '',
      confidence: 0.3 + Math.random() * 0.3,
      wrongPositions: [],
      status: 'low_confidence'
    }
  }

  // 15% perfect
  if (roll < 0.25) {
    return {
      recognizedText: correctAnswer,
      confidence: 0.92 + Math.random() * 0.08,
      wrongPositions: [],
      status: 'perfect'
    }
  }

  // 75% with 1-3 errors
  const chars = [...correctAnswer]
  const wrongCount = 1 + Math.floor(Math.random() * 3) // 1-3 errors
  const wrongPositions = []
  const recognizedChars = [...chars]

  for (let i = 0; i < wrongCount; i++) {
    const pos = Math.floor(Math.random() * chars.length)
    if (!wrongPositions.includes(pos) && chars[pos].trim()) {
      wrongPositions.push(pos)
      // Generate a similar-looking wrong character
      recognizedChars[pos] = generateSimilarChar(chars[pos])
    }
  }

  return {
    recognizedText: recognizedChars.join(''),
    confidence: 0.75 + Math.random() * 0.15,
    wrongPositions,
    status: 'with_errors'
  }
}

// Generate a visually similar or commonly confused character
function generateSimilarChar(char) {
  const confusions = {
    '光': ['关', '广', '先'],
    '霜': ['双', '孀', '露'],
    '晓': ['小', '哓', '绕'],
    '鸟': ['乌', '岛', '袅'],
    '海': ['每', '梅', '晦'],
    '层': ['成', '曾', '僧'],
    '禾': ['木', '未', '末'],
    '盘': ['般', '磐', '搬'],
    '炉': ['庐', '芦', '颅'],
    '川': ['穿', '州', '钏'],
    '绝': ['决', '诀', '掘'],
    '蓑': ['衰', '哀', '衷'],
    '线': ['钱', '浅', '践'],
    '缝': ['逢', '峰', '锋'],
    '玉': ['王', '国', '宝'],
    '绦': ['条', '涤', '绺'],
    '征': ['战', '证', '症'],
    '胡': ['湖', '糊', '瑚'],
    '滟': ['艳', '滟', '焰'],
    '蒙': ['濛', '朦', '矇'],
    '日': ['曰', '目', '白'],
    '山': ['出', '三', '川'],
    '千': ['干', '于', '千'],
    '万': ['方', '力', '刀'],
    '中': ['巾', '申', '甲'],
    '白': ['百', '自', '日'],
    '春': ['椿', '蝽', '春'],
    '花': ['化', '华', '画'],
    '月': ['目', '用', '自'],
    '风': ['凤', '凡', '几'],
    '落': ['洛', '络', '路'],
    '知': ['如', '和', '加'],
    '多': ['夕', '名', '罗'],
    '少': ['小', '尔', '心'],
    '明': ['朋', '朗', '萌'],
    '黄': ['簧', '璜', '广'],
    '河': ['何', '呵', '苛']
  }

  const options = confusions[char] || [String.fromCharCode(char.charCodeAt(0) + 1)]
  return options[Math.floor(Math.random() * options.length)]
}
