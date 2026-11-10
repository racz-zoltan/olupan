/* Az app választott témáját és kiemelőszínét alkalmazza (ha van mentett beállítás); különben a rendszer témája érvényes. */
(function(){try{var u=JSON.parse(localStorage.getItem('olupan.ui')||'null'),d=u?null:JSON.parse(localStorage.getItem('olupan.v1')||'null'),s=u||(d&&d.settings)||{},r=document.documentElement;
  if(s.theme==='light'||s.theme==='dark')r.setAttribute('data-theme',s.theme);if(s.accent==='orange'||s.accent==='pink')r.setAttribute('data-accent',s.accent)}catch(e){}})();
