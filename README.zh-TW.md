# 🎹 Lo-Fi Pong Wars

> 彩色陣營的領地攻防戰，撞擊同時即時演算出放鬆的 Lo-Fi 爵士和弦。零外部音檔、零依賴，純瀏覽器執行。

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/"><strong>▶ 線上試玩</strong></a> • 
  <a href="#操作快捷鍵">操作快捷鍵</a> • 
  <a href="#快速開始">快速開始</a> • 
  <a href="README.md">English</a>
</p>

<p align="center">
  <a href="https://yujunwang.github.io/lofi-pong-wars/">
    <img src="pic/demo.gif" alt="Lo-Fi Pong Wars Demo" width="440" style="border-radius: 16px; box-shadow: 0 16px 40px rgba(0,0,0,0.55);">
  </a>
</p>

---

## 這是什麼？

改編自經典開源專案 [Pong Wars](https://github.com/vnglst/pong-wars) 的零玩家環境模擬。  
球體每次撞擊並翻轉領地時，都會透過 Web Audio API 即時合成出對應音符。隨著陣營推移，背景和弦會自動換調，畫布也以有機圓角與水墨漣漪呈現攻防消長。

### 特色重點
- **100% 程式碼實時合成音訊**：完全不載入任何 MP3 或音訊檔案。內建 4 種風格（`Lo-Fi Study`、`Cyber Synth`、`Zen Garden`、`8-Bit Arcade`）。
- **支援 2 到 6 球陣營對抗**：自由切換 2P 至 6P 佈局（雙人、三角、四方、風車、六邊形），每顆球各自掌管獨立的樂器聲部。
- **有機極簡畫布**：捨棄多餘的立體描邊，採用平整色塊、動態圓角倒角（Fillets）與撞擊水墨擴散。
- **內建專注工作台**：按 `Studio` 即可展開上浮面板，附帶 25/50 分鐘番茄鐘、黑膠底噪開關與速度音量微調。
- **本機雙擊即開**：點擊 `index.html` 即可離線遊玩。不需 Node.js、不需 npm 安裝，完全零構建步驟。

---

## 操作快捷鍵

| 按鍵 | 動作 |
| :--- | :--- |
| `Space` | 暫停 / 繼續 |
| `2` ～ `6` | 切換對戰陣營數量（2P 至 6P） |
| `S` | 切換音樂風格（Lo-Fi → Cyber → Zen → 8-Bit） |
| `P` | 切換色彩主題色票 |
| `點擊 / 拖曳` | 在畫布上發射排斥衝擊波彈開球體 |

---

## 快速開始

不需要安裝任何套件或環境，複製專案後直接打開即可：

```bash
git clone https://github.com/YuJunWang/lofi-pong-wars.git
cd lofi-pong-wars

# 直接用瀏覽器開啟 index.html
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

線上體驗：[yujunwang.github.io/lofi-pong-wars](https://yujunwang.github.io/lofi-pong-wars/)

---

## 致敬與授權

- 靈感源自 [Koen van Gilst's Pong Wars](https://github.com/vnglst/pong-wars)。
- 開發與維護者：[Yu-Jun Wang](https://github.com/YuJunWang/lofi-pong-wars)。
- 採用 [MIT 授權條款](LICENSE)。
