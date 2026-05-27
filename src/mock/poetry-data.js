// 古诗阅读数据: 5种情感分类 + 文言文
export const EMOTION_POEMS = {
  aiguo: [
    { id: 'ag01', title: '过零丁洋', author: '文天祥', dynasty: '宋', fullText: '辛苦遭逢起一经，干戈寥落四周星。山河破碎风飘絮，身世浮沉雨打萍。惶恐滩头说惶恐，零丁洋里叹零丁。人生自古谁无死？留取丹心照汗青。', preview: '人生自古谁无死？留取丹心照汗青。', questions: [{ id: 'q1', stem: '这首诗表达了诗人怎样的情感？', keywords: ['爱国', '忠贞', '宁死不屈', '民族气节'] }, { id: 'q2', stem: '"丹心照汗青"中"丹心"和"汗青"分别指什么？', keywords: ['赤诚的心', '史册', '留名青史'] }] },
    { id: 'ag02', title: '春望', author: '杜甫', dynasty: '唐', fullText: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。', preview: '国破山河在，城春草木深。', questions: [{ id: 'q1', stem: '这首诗表达了诗人怎样的情感？', keywords: ['忧国忧民', '思乡', '战争之痛'] }] },
    { id: 'ag03', title: '示儿', author: '陆游', dynasty: '宋', fullText: '死去元知万事空，但悲不见九州同。王师北定中原日，家祭无忘告乃翁。', preview: '王师北定中原日，家祭无忘告乃翁。', questions: [{ id: 'q1', stem: '诗人临终前最牵挂的是什么？', keywords: ['国家统一', '收复失地', '爱国情怀'] }] },
    { id: 'ag04', title: '满江红', author: '岳飞', dynasty: '宋', fullText: '怒发冲冠，凭栏处、潇潇雨歇。抬望眼，仰天长啸，壮怀激烈。三十功名尘与土，八千里路云和月。莫等闲、白了少年头，空悲切！', preview: '莫等闲、白了少年头，空悲切！', questions: [{ id: 'q1', stem: '"莫等闲"表达了什么情感？', keywords: ['珍惜时间', '报国壮志', '奋发有为'] }] }
  ],
  shanshui: [
    { id: 'ss01', title: '望庐山瀑布', author: '李白', dynasty: '唐', fullText: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。', preview: '飞流直下三千尺，疑是银河落九天。', questions: [{ id: 'q1', stem: '这首诗描绘了怎样的景象？', keywords: ['壮丽', '雄伟', '山水美景', '大自然'] }] },
    { id: 'ss02', title: '望岳', author: '杜甫', dynasty: '唐', fullText: '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。', preview: '会当凌绝顶，一览众山小。', questions: [{ id: 'q1', stem: '"一览众山小"表达了诗人什么样的情怀？', keywords: ['豪迈', '壮志凌云', '登高望远'] }] },
    { id: 'ss03', title: '钱塘湖春行', author: '白居易', dynasty: '唐', fullText: '孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。', preview: '几处早莺争暖树，谁家新燕啄春泥。', questions: [{ id: 'q1', stem: '诗人描绘的春景有什么特点？', keywords: ['生机勃勃', '明媚', '清新'] }] }
  ],
  zhuangzhi: [
    { id: 'zz01', title: '行路难', author: '李白', dynasty: '唐', fullText: '金樽清酒斗十千，玉盘珍羞直万钱。停杯投箸不能食，拔剑四顾心茫然。欲渡黄河冰塞川，将登太行雪满山。闲来垂钓碧溪上，忽复乘舟梦日边。行路难！行路难！多歧路，今安在？长风破浪会有时，直挂云帆济沧海。', preview: '长风破浪会有时，直挂云帆济沧海。', questions: [{ id: 'q1', stem: '诗人面对困境的态度是怎样的？', keywords: ['乐观', '豁达', '坚信未来', '不放弃'] }] },
    { id: 'zz02', title: '登幽州台歌', author: '陈子昂', dynasty: '唐', fullText: '前不见古人，后不见来者。念天地之悠悠，独怆然而涕下！', preview: '前不见古人，后不见来者。', questions: [{ id: 'q1', stem: '诗人"独怆然而涕下"的原因是什么？', keywords: ['怀才不遇', '孤独', '壮志难酬'] }] },
    { id: 'zz03', title: '蜀相', author: '杜甫', dynasty: '唐', fullText: '丞相祠堂何处寻，锦官城外柏森森。出师未捷身先死，长使英雄泪满襟。', preview: '出师未捷身先死，长使英雄泪满襟。', questions: [{ id: 'q1', stem: '诗人借诸葛亮的遭遇表达了什么？', keywords: ['壮志未酬', '惋惜', '感同身受'] }] }
  ],
  tianyuan: [
    { id: 'ty01', title: '归园田居', author: '陶渊明', dynasty: '东晋', fullText: '少无适俗韵，性本爱丘山。误落尘网中，一去三十年。羁鸟恋旧林，池鱼思故渊。开荒南野际，守拙归园田。', preview: '少无适俗韵，性本爱丘山。', questions: [{ id: 'q1', stem: '诗人为什么选择归隐田园？', keywords: ['厌倦官场', '热爱自然', '向往自由'] }] },
    { id: 'ty02', title: '饮酒·其五', author: '陶渊明', dynasty: '东晋', fullText: '结庐在人境，而无车马喧。问君何能尔？心远地自偏。采菊东篱下，悠然见南山。', preview: '采菊东篱下，悠然见南山。', questions: [{ id: 'q1', stem: '"心远地自偏"是什么意思？', keywords: ['心态超脱', '内心宁静', '远离尘嚣'] }] },
    { id: 'ty03', title: '山居秋暝', author: '王维', dynasty: '唐', fullText: '空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。', preview: '明月松间照，清泉石上流。', questions: [{ id: 'q1', stem: '这首诗描绘了怎样的田园生活？', keywords: ['宁静', '闲适', '自然之美'] }] }
  ],
  songbie: [
    { id: 'sb01', title: '送杜少府之任蜀州', author: '王勃', dynasty: '唐', fullText: '城阙辅三秦，风烟望五津。与君离别意，同是宦游人。海内存知己，天涯若比邻。无为在歧路，儿女共沾巾。', preview: '海内存知己，天涯若比邻。', questions: [{ id: 'q1', stem: '诗人对离别持什么态度？', keywords: ['乐观', '豁达', '友谊长存'] }] },
    { id: 'sb02', title: '赠汪伦', author: '李白', dynasty: '唐', fullText: '李白乘舟将欲行，忽闻岸上踏歌声。桃花潭水深千尺，不及汪伦送我情。', preview: '桃花潭水深千尺，不及汪伦送我情。', questions: [{ id: 'q1', stem: '诗人用什么来比喻友情？', keywords: ['桃花潭水', '深厚友谊', '离别不舍'] }] }
  ]
}

// 文言文阅读数据
export const CLASSICAL_TEXTS = [
  {
    id: 'cl01', title: '劝学（节选）', source: '荀子',
    text: '青，取之于蓝，而青于蓝；冰，水为之，而寒于水。木直中绳，輮以为轮，其曲中规。虽有槁暴，不复挺者，輮使之然也。故木受绳则直，金就砺则利，君子博学而日参省乎己，则知明而行无过矣。',
    keyWords: [
      { word: '青', meaning: '靛青（一种染料）', correctExample: '青出于蓝而胜于蓝', wrongExample: '青色（颜色）' },
      { word: '輮', meaning: '通"煣"，用火烤使木弯曲', correctExample: '輮以为轮（用火烤使之成为车轮）', wrongExample: '輮是揉搓的意思' },
      { word: '砺', meaning: '磨刀石', correctExample: '金就砺则利（刀剑在磨刀石上磨就锋利）', wrongExample: '砺是鼓励的意思' },
      { word: '参省', meaning: '检验反省', correctExample: '日参省乎己（每天检验反省自己）', wrongExample: '参加省里的考试' }
    ],
    scorePoints: [
      { id: 'sp1', label: '实词：青', expected: '靛青/染料', points: 2 },
      { id: 'sp2', label: '实词：就', expected: '接近/靠近', points: 2 },
      { id: 'sp3', label: '句式：取之于蓝', expected: '从蓝草中提取（状语后置）', points: 3 }
    ],
    translationQuestions: [
      { id: 'tq1', stem: '翻译：青，取之于蓝，而青于蓝', scorePoints: ['sp1', 'sp3'], referenceAnswer: '靛青是从蓝草中提取的，却比蓝草更青。' },
      { id: 'tq2', stem: '翻译：君子博学而日参省乎己，则知明而行无过矣', scorePoints: ['sp2'], referenceAnswer: '君子广泛地学习并且每天检验反省自己，就能智慧明达、行为没有过错了。' }
    ]
  },
  {
    id: 'cl02', title: '师说（节选）', source: '韩愈',
    text: '古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？惑而不从师，其为惑也，终不解矣。生乎吾前，其闻道也固先乎吾，吾从而师之。',
    keyWords: [
      { word: '师', meaning: '老师（名词）/ 以...为师（意动用法）', correctExample: '吾从而师之（我跟随他并以他为师）', wrongExample: '师就是军队的意思' },
      { word: '受', meaning: '通"授"，传授', correctExample: '传道受业（传授道理和学业）', wrongExample: '接受的意思' },
      { word: '惑', meaning: '疑惑/疑难问题', correctExample: '孰能无惑（谁能没有疑惑呢）', wrongExample: '迷惑/诱惑' },
      { word: '从', meaning: '跟随', correctExample: '从而师之（跟随他）', wrongExample: '听从/服从' }
    ],
    scorePoints: [
      { id: 'sp1', label: '实词：师（意动用法）', expected: '以...为师', points: 3 },
      { id: 'sp2', label: '通假字：受', expected: '通"授"，传授', points: 2 },
      { id: 'sp3', label: '实词：从', expected: '跟随', points: 2 }
    ],
    translationQuestions: [
      { id: 'tq1', stem: '翻译：师者，所以传道受业解惑也', scorePoints: ['sp2'], referenceAnswer: '老师，是用来传授道理、教授学业、解答疑惑的人。' },
      { id: 'tq2', stem: '翻译：吾从而师之', scorePoints: ['sp1', 'sp3'], referenceAnswer: '我跟随他并且以他为师。' }
    ]
  },
  {
    id: 'cl03', title: '陋室铭', source: '刘禹锡',
    text: '山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？',
    keyWords: [
      { word: '馨', meaning: '香气，这里指品德高尚', correctExample: '惟吾德馨（只要我的品德高尚）', wrongExample: '馨是芳香的意思' },
      { word: '鸿儒', meaning: '博学的人', correctExample: '谈笑有鸿儒（一起谈笑的都是博学之人）', wrongExample: '鸿儒是红色的儒家' },
      { word: '白丁', meaning: '平民，这里指没有学问的人', correctExample: '往来无白丁（来往的没有不学无术之人）', wrongExample: '白丁就是白衣服的人' }
    ],
    scorePoints: [
      { id: 'sp1', label: '实词：馨', expected: '品德高尚/德行美好', points: 2 },
      { id: 'sp2', label: '实词：鸿儒', expected: '博学的人/大学问家', points: 2 },
      { id: 'sp3', label: '句式：何陋之有', expected: '有什么简陋的呢（宾语前置）', points: 3 }
    ],
    translationQuestions: [
      { id: 'tq1', stem: '翻译：斯是陋室，惟吾德馨', scorePoints: ['sp1'], referenceAnswer: '这是简陋的屋子，只要我的品德高尚（就不觉得简陋了）。' },
      { id: 'tq2', stem: '翻译：孔子云：何陋之有？', scorePoints: ['sp3'], referenceAnswer: '孔子说：有什么简陋的呢？' }
    ]
  }
]

export function getPoemsByCategory(categoryId) {
  return EMOTION_POEMS[categoryId] || []
}

export function getClassicalText(textId) {
  return CLASSICAL_TEXTS.find(t => t.id === textId) || CLASSICAL_TEXTS[0]
}
