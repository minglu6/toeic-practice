(function (global) {
  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }

  function bindOptions(root, picks) {
    root.querySelectorAll('.q').forEach(function (q) {
      var id = q.getAttribute('data-q');
      q.querySelectorAll('.opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (q.classList.contains('locked')) return;
          q.querySelectorAll('.opt').forEach(function (b) { b.classList.remove('picked'); });
          btn.classList.add('picked');
          picks[id] = btn.getAttribute('data-v');
        });
      });
    });
  }

  function grade(root, picks, moduleId) {
    var right = 0, total = 0;
    root.querySelectorAll('.q').forEach(function (q) {
      total++;
      var ans = q.getAttribute('data-ans');
      var id = q.getAttribute('data-q');
      q.classList.add('locked');
      q.querySelectorAll('.opt').forEach(function (btn) {
        btn.disabled = true;
        var v = btn.getAttribute('data-v');
        btn.classList.remove('picked', 'correct', 'wrong');
        if (v === ans) btn.classList.add('correct');
        else if (picks[id] === v) btn.classList.add('wrong');
      });
      if (picks[id] === ans) right++;
      else if (global.ToeicStore) {
        global.ToeicStore.addWrong({
          module: moduleId || 'quiz',
          q: id,
          ans: ans,
          picked: picks[id] || null,
          stem: (q.querySelector('.stem') || {}).textContent || id
        });
      }
    });
    return { right: right, total: total };
  }

  function reset(root, picks) {
    Object.keys(picks).forEach(function (k) { delete picks[k]; });
    root.querySelectorAll('.q').forEach(function (q) {
      q.classList.remove('locked');
      q.querySelectorAll('.opt').forEach(function (btn) {
        btn.disabled = false;
        btn.classList.remove('picked', 'correct', 'wrong');
      });
    });
  }

  function attachTimer(bar, checkBtn) {
    if (!bar) return { stop: function () {} };
    var recSec = parseInt(bar.getAttribute('data-rec-sec'), 10) || 180;
    var elapsed = 0, paused = false, finished = false;
    var clock = bar.querySelector('.clock') || document.getElementById('timerClock');
    var status = bar.querySelector('.status') || document.getElementById('timerStatus');
    var pauseBtn = bar.querySelector('.btn-timer') || document.getElementById('timerPause');
    function tick() {
      if (paused || finished) return;
      elapsed += 1;
      if (clock) clock.textContent = fmt(elapsed);
      if (elapsed > recSec) {
        bar.classList.add('over');
        if (status) status.textContent = '超时 +' + fmt(elapsed - recSec);
      } else {
        bar.classList.remove('over');
        if (status) status.textContent = '计时中';
      }
    }
    var timerId = setInterval(tick, 1000);
    if (status) status.textContent = '计时中';
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        if (finished) return;
        paused = !paused;
        pauseBtn.textContent = paused ? '继续' : '暂停';
        if (status) status.textContent = paused ? ('已暂停 · ' + (clock ? clock.textContent : '')) : '计时中';
      });
    }
    function stop() {
      if (finished) return;
      finished = true; paused = true;
      clearInterval(timerId);
      if (pauseBtn) { pauseBtn.textContent = '已结束'; pauseBtn.disabled = true; }
      var msg = '完成用时 ' + fmt(elapsed);
      if (elapsed > recSec) msg += '（超时 ' + fmt(elapsed - recSec) + '）';
      if (status) status.textContent = msg;
      return msg;
    }
    if (checkBtn) checkBtn.addEventListener('click', stop);
    return { stop: stop, getElapsed: function () { return elapsed; } };
  }

  function renderOptions(choices) {
    return ['A', 'B', 'C', 'D'].filter(function (k) { return choices[k] != null; }).map(function (k) {
      return '<button type="button" class="opt" data-v="' + k + '">(' + k + ') ' + escapeHtml(choices[k]) + '</button>';
    }).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  global.ToeicQuiz = {
    bindOptions: bindOptions,
    grade: grade,
    reset: reset,
    attachTimer: attachTimer,
    renderOptions: renderOptions,
    escapeHtml: escapeHtml,
    fmt: fmt
  };
})(window);
