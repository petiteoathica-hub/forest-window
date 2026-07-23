const cards = [
  { name: "小屋の灯", keyword: "【美】希望・灯火", message: "大きく変えなくてもいい\n今日灯せる範囲を灯そう", image: "cards/card01.png", sound: "sounds/aomatsumushiL.mp3", soundMode: "loop" },
  { name: "暖炉の火", keyword: "【善】情熱・火種", message: "小さな火種を守る\n勢いより継続", image: "cards/card02.png", sound: "sounds/bonfire2.mp3", soundMode: "loop" },
  { name: "窓辺の作業机", keyword: "【美】制作・実践", message: "考えるより\n少しだけ手を動かす", image: "cards/card03.png", sound: "sounds/beads.mp3", soundMode: "random" },
  { name: "月の湯", keyword: "【真】調律・休息", message: "答えを探す前に整える", image: "cards/card04.png", sound: "sounds/fountain.mp3", soundMode: "loop" },
  { name: "地下室の宝箱", keyword: "【真】保留・熟成", message: "今は開かないものもある", image: "cards/card05.png", sound: "sounds/magicalroom.mp3", soundMode: "loop" },
  { name: "ソラの書斎", keyword: "【真】記録・整理", message: "言葉にすると見えてくる", image: "cards/card06.png", sound: "sounds/turnthepage.mp3", soundMode: "random" },
  { name: "老師の紙片", keyword: "【善】知恵・余裕", message: "深刻さを\n笑いに変えてみる", image: "cards/card07.png", sound: "sounds/Cluster_Chimes01-06.mp3", soundMode: "random" },
  { name: "真珠色の金魚", keyword: "【真】魂・内なる声", message: "静かな場所に\n答えは泳いでいる", image: "cards/card08.png", sound: "sounds/fountain.mp3", soundMode: "loop" },
  { name: "森の白猫", keyword: "【善】気まぐれ・癒し", message: "予定外の\n優しさを受け取る", image: "cards/card09.png", sound: "sounds/catmeowing.mp3", soundMode: "random" },
  { name: "桃の若木", keyword: "【善】成長・未来", message: "見えなくても育っている", image: "cards/card10.png", sound: "sounds/mejiro.mp3", soundMode: "random" },
  { name: "森の茶会", keyword: "【美】余白・一息つく", message: "湯気がほどけるように\n答えもゆっくり現れる", image: "cards/card11.png" },
  { name: "白日花", keyword: "【真】生命力・蓄え", message: "未来のために\n必要な準備がある", image: "cards/card12.png", sound: "sounds/hiyodori.mp3", soundMode: "random" },
  { name: "灯花", keyword: "【美】勇気・夜の光", message: "闇の中の灯りに目を向けてみる", image: "cards/card13.png", sound: "sounds/HoshiWoKazoete.mp3", soundMode: "loop" },
  { name: "雪解", keyword: "【善】再開・流れ", message: "止まっていたものが\n動き出す", image: "cards/card14.png", sound: "sounds/stream3_loop.mp3", soundMode: "loop" },
  { name: "名もなき空色", keyword: "【美】自由・伸びやか", message: "名前をつけなくても\nそれは喜び", image: "cards/card15.png", sound: "sounds/birdsong.mp3", soundMode: "random" },
  { name: "光のきざはし", keyword: "【真】導き・兆し", message: "光が差した場所に\nまだ知らない道がある", image: "cards/card16.png", sound: "sounds/Angel05-1L.mp3", soundMode: "once" },
  { name: "星降りの湖", keyword: "【真】広い視点・神秘", message: "少し高い場所から眺めてみる", image: "cards/card17.png", sound: "sounds/higurashi2.mp3", soundMode: "loop" },
  { name: "眠り龍の谷", keyword: "【善】力・静観", message: "今は起こさなくていい力もある", image: "cards/card18.png", sound: "sounds/waterfall.mp3", soundMode: "loop" },
  { name: "森のフクロウ", keyword: "【善】観察・洞察", message: "急がず\nまず見る", image: "cards/card19.png", sound: "sounds/owl.mp3", soundMode: "random" },
  { name: "月夜の誓い", keyword: "【美】自己信頼・約束", message: "自分との約束を思い出す", image: "cards/card20.png", sound: "sounds/cricketschirping.mp3", soundMode: "loop" },
  { name: "ローズマリー商会", keyword: "【美】選択・信頼", message: "選ばなかったものが\n良く見えるだけ", image: "cards/card21.png", sound: "sounds/doorbell.mp3", soundMode: "random" },
  { name: "行商人の荷車", keyword: "【善】交換・出会い", message: "持っているものと\n受け取るものは同じではない", image: "cards/card22.png", sound: "sounds/aironbranch.mp3", soundMode: "loop"  },
  { name: "風の抜け道", keyword: "【美】移動・変化", message: "隠していたものに\n風を通してみる", image: "cards/card23.png", sound: "sounds/whisperofleaves2.mp3", soundMode: "loop" },
  { name: "ひと枝", keyword: "【真】感謝・借りる", message: "力を借りればいい\n対価は喜びと感謝だ", image: "cards/card24.png", sound: "sounds/birdsong.mp3", soundMode: "random" },
];

/*soundMode: "once"    // 表示時に1回
soundMode: "loop"    // ループ再生
soundMode: "random"  // 表示時に1回再生、以降はランダム間隔
soundMode: "none"    // 音なし*/
