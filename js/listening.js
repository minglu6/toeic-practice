(function () {
  var BASE = (window.TOEIC && window.TOEIC.BASE) || '../';
  function abs(p) {
    if (!p) return p;
    if (/^https?:|^\//.test(p)) return p;
    return BASE + p.replace(/^\.\//, '');
  }

  function explainListening(set, kind) {
    var html = '<h2>原文</h2>';
    if (kind === 'part1') {
      html += '<div class="zh">';
      ['A','B','C','D'].forEach(function (k) {
        html += '<p><b>(' + k + ')</b> ' + ToeicQuiz.escapeHtml(set.transcript[k]) +
          (k === set.answer ? ' ← 正确答案' : '') + '</p>';
      });
      html += '</div><h2>译文与简析</h2><div class="item"><div class="ans">答案 · ' + set.answer + '</div>';
      html += '<p>' + ToeicQuiz.escapeHtml(set.zh.passage) + '</p>';
      html += '<p>' + ToeicQuiz.escapeHtml(set.zh.rationale) + '</p></div>';
    } else if (kind === 'part2') {
      html += '<div class="zh"><p><b>Q.</b> ' + ToeicQuiz.escapeHtml(set.question) + '</p>';
      ['A','B','C'].forEach(function (k) {
        html += '<p><b>(' + k + ')</b> ' + ToeicQuiz.escapeHtml(set.choices[k]) +
          (k === set.answer ? ' ← 正确答案' : '') + '</p>';
      });
      html += '</div><h2>译文与简析</h2><div class="item"><div class="ans">答案 · ' + set.answer + '</div>';
      html += '<div class="qzh">' + ToeicQuiz.escapeHtml(set.zh.q) + '</div>';
      html += '<div class="opts-zh">';
      ['A','B','C'].forEach(function (k) {
        html += '(' + k + ') ' + ToeicQuiz.escapeHtml(set.zh.opts[k]) + '<br>';
      });
      html += '</div><p>' + ToeicQuiz.escapeHtml(set.zh.rationale) + '</p></div>';
    } else {
      html += '<div class="zh">';
      if (Array.isArray(set.transcript_en)) {
        set.transcript_en.forEach(function (line, i) {
          html += '<p>' + ToeicQuiz.escapeHtml(line) + '</p>';
        });
      } else {
        html += '<p>' + ToeicQuiz.escapeHtml(set.transcript_en) + '</p>';
      }
      html += '</div><h2>译文</h2><div class="zh">';
      if (Array.isArray(set.transcript_zh)) {
        set.transcript_zh.forEach(function (line) {
          html += '<p>' + ToeicQuiz.escapeHtml(line) + '</p>';
        });
      } else {
        html += '<p>' + ToeicQuiz.escapeHtml(set.transcript_zh) + '</p>';
      }
      html += '</div><h2>答案与简析</h2>';
      (set.questions || []).forEach(function (qq) {
        html += '<div class="item"><div class="ans">' + qq.q + ' · ' + qq.answer + '</div>';
        html += '<div class="qzh">' + ToeicQuiz.escapeHtml(qq.zh_stem) + '</div>';
        html += '<div class="opts-zh">';
        Object.keys(qq.zh_opts).forEach(function (k) {
          html += '(' + k + ') ' + ToeicQuiz.escapeHtml(qq.zh_opts[k]) + '<br>';
        });
        html += '</div><p>' + ToeicQuiz.escapeHtml(qq.rationale) + '</p></div>';
      });
    }
    return html;
  }

  window.ToeicListening = {
    abs: abs,
    explainListening: explainListening,
    load: function (part) {
      return fetch(abs('data/' + part + '.json')).then(function (r) { return r.json(); });
    }
  };
})();
