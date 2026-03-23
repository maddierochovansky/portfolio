(function(){
  // Starfield
  var sf=document.getElementById('starfield');
  for(var i=0;i<80;i++){
    var s=document.createElement('div');
    s.className='star';
    var sz=Math.random()*1.8+0.4;
    s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;--dur:'+(2.5+Math.random()*3)+'s;--delay:'+(Math.random()*4)+'s;--lo:'+(0.05+Math.random()*0.12)+';--hi:'+(0.4+Math.random()*0.4)+';';
    sf.appendChild(s);
  }

  // Fade on scroll
  var fades=document.querySelectorAll('.fade');
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('show');}});
  },{threshold:0.08});
  fades.forEach(function(el){observer.observe(el);});

  // Scroll top button
  var st=document.getElementById('scroll-top');
  window.addEventListener('scroll',function(){
    st.classList.toggle('visible',window.scrollY>400);
  });

  // FAQ toggle
  window.toggleFaq=function(item){
    item.classList.toggle('open');
  };
})();