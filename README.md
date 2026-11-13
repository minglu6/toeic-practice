# 托业考试练习

可安装的托业（TOEIC L&R）练习 **PWA**：听力 Part 1–4、阅读 Part 5–7、词汇与语法基础、本机错题本。

**在线地址：** https://minglu6.github.io/toeic-practice/

## 模块

| 模块 | 说明 |
|------|------|
| Part 1 | 照片描述（真实照片 + 音频；来源见 `images/part1/SOURCES.md`） |
| Part 2 | 应答问题（音频） |
| Part 3–4 | 对话 / 独白，答完后显示原文·译文·简析 |
| Part 5–6 | 句子 / 段落填空 |
| Part 7 | 单篇 / 双篇 / 三篇试卷风界面（计时 3:00 / 3:45） |
| 基础 | 词汇 60+、语法速练、错题本（localStorage） |

练习内容为**原创模拟题**，非正式 ETS 考题。

## 本地预览

```bash
cd toeic-practice
python3 -m http.server 8080
# 打开 http://localhost:8080/
```

重新生成听力样例音频（需 edge-tts）：

```bash
/workspace/.venv-tts/bin/python scripts/gen-listening-audio.py
```

## 技术

静态 HTML/CSS/JS · Service Worker 缓存外壳 · GitHub Pages（`/toeic-practice/`）。
