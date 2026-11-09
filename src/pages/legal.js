/* Az app választott témáját és kiemelőszínét alkalmazza (ha van mentett beállítás); különben a rendszer témája érvényes. */
(function(){try{var d=JSON.parse(localStorage.getItem('olupan.v1')||'null'),s=d&&d.settings||{},r=document.documentElement;
  if(s.theme==='light'||s.theme==='dark')r.setAttribute('data-theme',s.theme);if(s.accent==='orange')r.setAttribute('data-accent','orange')}catch(e){}})();
