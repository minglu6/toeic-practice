(function (global) {
  var KEY = (global.TOEIC && global.TOEIC.STORAGE_KEY) || 'toeic-practice-v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
  function ensure() {
    var d = load();
    if (!d.progress) d.progress = {};
    if (!d.wrong) d.wrong = [];
    if (!d.vocabDone) d.vocabDone = {};
    return d;
  }
  global.ToeicStore = {
    get: ensure,
    setProgress: function (moduleId, meta) {
      var d = ensure();
      d.progress[moduleId] = Object.assign({ updatedAt: Date.now() }, meta || {});
      save(d);
    },
    addWrong: function (item) {
      var d = ensure();
      var id = item.id || (item.module + ':' + item.q);
      d.wrong = d.wrong.filter(function (w) { return w.id !== id; });
      d.wrong.unshift(Object.assign({ id: id, at: Date.now() }, item));
      if (d.wrong.length > 200) d.wrong.length = 200;
      save(d);
    },
    clearWrong: function (id) {
      var d = ensure();
      d.wrong = d.wrong.filter(function (w) { return w.id !== id; });
      save(d);
    },
    markVocab: function (word, known) {
      var d = ensure();
      d.vocabDone[word] = !!known;
      save(d);
    },
    resetAll: function () { localStorage.removeItem(KEY); }
  };
})(window);
