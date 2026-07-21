(function(){
  // FAQ toggle
  window.toggleFaq=function(trigger){
    var item = trigger.closest('.faq-item');
    if (!item) return;
    item.classList.toggle('open');
    trigger.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
  };
})();