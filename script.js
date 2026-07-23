// ========================================
// タイマーの共通管理
// ========================================
const timerRegistry = new Map();

// 指定した名前のタイマーがあれば停止し、管理表から取り除く
function clearManagedTimer(name) {
  const timer = timerRegistry.get(name);

  if (!timer) {
    return;
  }

  if (timer.type === "interval") {
    clearInterval(timer.id);
  } else {
    clearTimeout(timer.id);
  }

  timerRegistry.delete(name);
}

// 複数のタイマーをまとめて停止する
function clearManagedTimers(...names) {
  names.forEach(clearManagedTimer);
}

// 名前付きのsetTimeoutを登録し、同名の古いタイマーがあれば置き換える
function setManagedTimeout(name, callback, delay) {
  clearManagedTimer(name);

  const id = setTimeout(() => {
    timerRegistry.delete(name);
    callback();
  }, delay);

  timerRegistry.set(name, { id, type: "timeout" });
}

// 名前付きのsetIntervalを登録し、同名の古いタイマーがあれば置き換える
function setManagedInterval(name, callback, delay) {
  clearManagedTimer(name);

  const id = setInterval(callback, delay);
  timerRegistry.set(name, { id, type: "interval" });
}

// ========================================
// カードの抽選・表示・タップ操作
// ========================================
const cardPointerState = {
  activePointerId: null,
  longPressTriggered: false,
  pointerCanceled: false,
  actionLocked: false,
};

// カード操作の状態と、途中の長押し判定を初期状態へ戻す
function resetCardPointerState() {
  clearManagedTimer("longPress");

  cardPointerState.activePointerId = null;
  cardPointerState.longPressTriggered = false;
  cardPointerState.pointerCanceled = false;
  cardPointerState.actionLocked = false;
}

// 短く押したときだけ、演出後の再抽選を1回開始する
function handleCardClick() {
  if (
    cardPointerState.longPressTriggered ||
    cardPointerState.pointerCanceled ||
    cardPointerState.actionLocked
  ) {
    return;
  }

  cardPointerState.actionLocked = true;

  const app = document.getElementById("app");
  app.classList.add("opening");

  setManagedTimeout("openingDraw", () => {
    drawCard();
  }, 1350);

  setManagedTimeout("openingEnd", () => {
    app.classList.remove("opening");
  }, 1900);
}

// 主要な指または左クリックで、0.8秒の長押し判定を開始する
function handleCardPointerDown(event) {
  if (
    !event.isPrimary ||
    event.button !== 0 ||
    cardPointerState.activePointerId !== null ||
    cardPointerState.actionLocked
  ) {
    return;
  }

  cardPointerState.activePointerId = event.pointerId;
  cardPointerState.longPressTriggered = false;
  cardPointerState.pointerCanceled = false;

  setManagedTimeout("longPress", () => {
    if (cardPointerState.activePointerId !== event.pointerId) {
      return;
    }

    cardPointerState.longPressTriggered = true;
    cardPointerState.actionLocked = true;
    startLanternEffect();

    setManagedTimeout("galleryOpen", () => {
      openGallery();
    }, 1200);
  }, 800);
}

// 指やマウスをカード上で離し、未成立の長押し判定を停止する
function handleCardPointerUp(event) {
  if (cardPointerState.activePointerId !== event.pointerId) {
    return;
  }

  clearManagedTimer("longPress");
  cardPointerState.activePointerId = null;
}

// カード外への移動や端末側の中断時に、未成立の長押し判定を中止する
function cancelCardPointerPress(event) {
  if (cardPointerState.activePointerId !== event.pointerId) {
    return;
  }

  clearManagedTimer("longPress");
  cardPointerState.activePointerId = null;
  cardPointerState.pointerCanceled = true;
}

// 最初の抽選演出を開始し、演出の途中でカードを表示する
function startOracle() {
  const app = document.getElementById("app");
  const button = document.getElementById("drawButton");

  button.disabled = true;
  app.classList.add("opening");

  setManagedTimeout("openingDraw", () => {
    drawCard();
    button.style.display = "none";
  }, 1350);

  setManagedTimeout("openingEnd", () => {
    app.classList.remove("opening");
  }, 1900);
}

// カードをランダムに1枚選び、内容と画像を画面に表示する
function drawCard() {
  resetCardPointerState();

  // カード指定表示テスト用
  // const randomIndex = 15;
  const randomIndex = Math.floor(Math.random() * cards.length);
  const card = cards[randomIndex];
  console.log("抽選:", randomIndex, card.name, card.sound);
  
  document.getElementById("result").innerHTML = `
    <h2 class="card-name">${card.name}</h2>
    <img class="card-image" id="cardImage" src="${card.image}" alt="${card.name}" draggable="false">
    <p class="keyword">${card.keyword}</p>
    <p class="message">${card.message}</p>
  `;

  cardAudioManager.play(card);

  const cardImage = document.getElementById("cardImage");

  cardImage.addEventListener("click", handleCardClick);
  cardImage.addEventListener("pointerdown", handleCardPointerDown);
  cardImage.addEventListener("pointerup", handleCardPointerUp);
  cardImage.addEventListener("pointerleave", cancelCardPointerPress);
  cardImage.addEventListener("pointercancel", cancelCardPointerPress);

  // 長押し時にブラウザのメニューが表示されるのを防ぐ
  cardImage.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
}

// ========================================
// カードごとの音声再生
// ========================================
const cardAudioManager = {
  player: new Audio(),
  currentCard: null,
  sessionId: 0,

  // 前の音声を停止してから、カードのsoundModeに合う再生方法を選ぶ
  play(card) {
    this.stop();

    if (!card.sound || card.soundMode === "none") {
      return;
    }

    this.currentCard = card;
    this.player.src = card.sound;
    this.player.loop = false;

    switch (card.soundMode) {
      case "loop":
        this.playLoop();
        break;

      case "random":
        this.startRandom(card);
        break;

      case "once":
      default:
        this.playOnce();
        break;
    }
  },

  // 再生中の音声とランダム再生の予約をすべて停止する
  stop() {
    this.sessionId += 1;
    clearManagedTimer("randomSound");

    this.currentCard = null;
    this.resetPlayer();
  },

  // 音声プレイヤーを停止し、次のカードで使える初期状態へ戻す
  resetPlayer() {
    this.player.pause();
    this.player.currentTime = 0;
    this.player.loop = false;
    this.player.removeAttribute("src");
    this.player.load();
  },

  // ブラウザに再生を拒否された場合も、画面の処理を止めずに再生を試す
  safePlay() {
    this.player.play().catch(() => {});
  },

  // 音声を1回だけ再生する
  playOnce() {
    this.player.loop = false;
    this.safePlay();
  },

  // 音声のループを有効にして再生する
  playLoop() {
    this.player.loop = true;
    this.safePlay();
  },

  // randomモードの初回再生を予約する
  startRandom(card) {
    this.scheduleRandom(card, true, this.sessionId);
  },

  // randomモードの音声を一定の範囲内のランダムな間隔で再生する
  scheduleRandom(card, isFirstPlay, sessionId) {
    const minDelay = isFirstPlay ? 0 : 30000;
    const maxDelay = isFirstPlay ? 5000 : 90000;

    const delay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setManagedTimeout("randomSound", () => {
      if (
        this.sessionId !== sessionId ||
        this.currentCard !== card
      ) {
        return;
      }

      this.player.currentTime = 0;
      this.safePlay();

      this.scheduleRandom(card, false, sessionId);
    }, delay);
  },
};

// ========================================
// 長押し時のランタン演出
// ========================================

// カードの長押しを検知したときにランタンの光を表示する
function startLanternEffect() {
  const app = document.getElementById("app");
  app.classList.add("lantern-opening");

  setManagedTimeout("lanternEnd", () => {
    app.classList.remove("lantern-opening");
  }, 1200);
}

// ========================================
// ギャラリーモード
// ========================================
let galleryCurrent = 1;
const galleryTotal = cards.length;

const galleryMode = document.getElementById("galleryMode");
const galleryFrame = document.getElementById("galleryFrame");
const galleryFlash = document.getElementById("galleryFlash");

// カード番号を2桁にそろえ、ギャラリー画像のパスを作る
function getGalleryImagePath(number) {
  const padded = String(number).padStart(2, "0");
  return `cards/card${padded}_0.png`;
}

// 通常画面を隠し、1枚目からギャラリーの自動表示を開始する
function openGallery() {
  cardAudioManager.stop();
  
  const app = document.getElementById("app");

  clearManagedTimers("openingDraw", "openingEnd", "longPress", "lanternEnd");
  clearManagedTimers("galleryAuto", "galleryFlash");

  app.classList.remove("opening", "lantern-opening");
  galleryFlash.classList.remove("active");
  app.classList.add("hidden");
  galleryMode.classList.remove("hidden");

  galleryCurrent = 1;
  galleryFrame.style.backgroundImage = `url("${getGalleryImagePath(galleryCurrent)}")`;

  setManagedInterval("galleryAuto", nextGalleryImage, 8000);
}

// ギャラリーの自動表示を止め、通常のカード画面へ戻る
function closeGallery() {
  const app = document.getElementById("app");

  clearManagedTimers("galleryAuto", "galleryFlash");
  resetCardPointerState();

  galleryFlash.classList.remove("active");
  galleryMode.classList.add("hidden");
  app.classList.remove("hidden");
}

// 次のギャラリー画像を先読みし、白い演出を挟んで切り替える
function nextGalleryImage() {
  let next = galleryCurrent + 1;

  if (next > galleryTotal) {
    next = 1;
  }

  const nextPath = getGalleryImagePath(next);

  const preload = new Image();
  preload.src = nextPath;

  preload.onload = () => {
    galleryFlash.classList.add("active");

    setManagedTimeout("galleryFlash", () => {
      galleryFrame.style.backgroundImage = `url("${nextPath}")`;
      galleryCurrent = next;

      galleryFlash.classList.remove("active");
    }, 1200);
  };
}

