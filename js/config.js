/* 托业考试练习 · asset base for GitHub Pages /toeic-practice/ */
window.TOEIC = window.TOEIC || {};
window.TOEIC.NAME = '托业考试练习';
window.TOEIC.STORAGE_KEY = 'toeic-practice-v1';
window.TOEIC.BASE = (function () {
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].src || '';
    var m = src.match(/^(.*\/)js\/config\.js(?:\?.*)?$/);
    if (m) return m[1];
  }
  // fallback: project pages
  var p = location.pathname;
  var marker = '/toeic-practice/';
  var idx = p.indexOf(marker);
  if (idx >= 0) return p.slice(0, idx + marker.length);
  if (/\/(listening|reading|basics)\//.test(p)) return '../';
  return './';
})();
