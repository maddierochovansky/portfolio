(function(){
  var sf=document.getElementById('starfield');
  for(var i=0;i<130;i++){
    var s=document.createElement('div');
    s.className='star';
    var sz=Math.random()*2+0.4;
    s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;--dur:'+(2+Math.random()*5)+'s;--delay:'+(Math.random()*6)+'s;--lo:'+(0.05+Math.random()*0.15)+';--hi:'+(0.4+Math.random()*0.55);
    sf.appendChild(s);
  }
  var cv=document.getElementById('meteors');
  var ctx=cv.getContext('2d');
  function rsz(){cv.width=innerWidth;cv.height=innerHeight}
  rsz();
  window.addEventListener('resize',rsz);
  function Meteor(init){this.reset(init)}
  Meteor.prototype.reset=function(init){
    this.x=Math.random()*innerWidth*1.4-innerWidth*0.2;
    this.y=init?Math.random()*-innerHeight:-80;
    this.len=90+Math.random()*130;
    this.spd=1.6+Math.random()*2.2;
    this.ang=Math.PI/4+(Math.random()-0.5)*0.25;
    this.w=0.4+Math.random()*0.9;
    this.life=0;this.maxLife=70+Math.random()*110;
    this.peak=0.25+Math.random()*0.4;
  };
  Meteor.prototype.draw=function(){
    this.life++;
    var fi=18,fo=22,a;
    if(this.life<fi)a=(this.life/fi)*this.peak;
    else if(this.life>this.maxLife-fo)a=((this.maxLife-this.life)/fo)*this.peak;
    else a=this.peak;
    if(this.life>=this.maxLife)this.reset();
    var tx=this.x-Math.cos(this.ang)*this.len,ty=this.y-Math.sin(this.ang)*this.len;
    this.x+=Math.cos(this.ang)*this.spd;
    this.y+=Math.sin(this.ang)*this.spd;
    var g=ctx.createLinearGradient(tx,ty,this.x,this.y);
    g.addColorStop(0,'transparent');
    g.addColorStop(1,'rgba(201,168,76,'+a+')');
    ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(this.x,this.y);
    ctx.strokeStyle=g;ctx.lineWidth=this.w;ctx.stroke();
  };
  var meteors=[];
  var animPaused=false;
  var animFrame=null;
  for(var i=0;i<10;i++)meteors.push(new Meteor(true));
  function animLoop(){if(animPaused)return;ctx.clearRect(0,0,cv.width,cv.height);for(var i=0;i<meteors.length;i++)meteors[i].draw();animFrame=requestAnimationFrame(animLoop)}
  animLoop();
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){animPaused=true;if(animFrame)cancelAnimationFrame(animFrame);}
    else{animPaused=false;animLoop();}
  });
  new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){if(animPaused&&!document.hidden){animPaused=false;animLoop();}}
      else{animPaused=true;if(animFrame)cancelAnimationFrame(animFrame);}
    });
  },{threshold:0}).observe(cv);
  function toggleMob(){document.getElementById('mob-menu').classList.toggle('open')}
  function closeMob(){document.getElementById('mob-menu').classList.remove('open')}
  document.addEventListener('click',function(e){
    var m=document.getElementById('mob-menu');
    if(m.classList.contains('open')&&!m.contains(e.target)&&!document.getElementById('ham').contains(e.target))m.classList.remove('open');
  });
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('show')});
  },{threshold:0.07,rootMargin:'0px 0px -20px 0px'});
  document.querySelectorAll('.fade').forEach(function(el){obs.observe(el)});
  function toggleProj(el){
    var isOpen=el.classList.toggle('open');
    var btn=el.querySelector('.proj-toggle');
    if(btn)btn.setAttribute('aria-expanded',isOpen);
  }
  function toggleCert(el){
    var isOpen=el.classList.toggle('open');
    var hdr=el.querySelector('.cert-group-header');
    if(hdr)hdr.setAttribute('aria-expanded',isOpen);
  }
  var scrollTopBtn=document.getElementById('scroll-top');
  window.addEventListener('scroll',function(){
    if(window.scrollY>400)scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  });
  var _sugPool={
    work:["What tools do you use?","What are you certified in?","What is your strongest skill?","Tell me about your projects","What does your automation work look like?","What is your experience with SAP?"],
    background:["Where are you from?","How did you get into operations?","Tell me about your experience","What have you won awards for?","Where have you worked?"],
    personal:["What are you reading?","Where do you want to travel?","What do you do outside of work?","What are you bad at?","Tell me something fun","What have you built professionally?"],
    job:["What are you looking for?","Where are you based?","Are you available to freelance?","Can I book a call?","Are you authorized to work in the US?"],
    fun:["Impress me","What do your coworkers say?","Are you a real person?","What is your weakness?","What would your cats say about you?"]
  };
  var _sugCurrent=[];
  var _sugSeen=[];
  var _sugContextMap={
    work:/tool|software|tech|certif|credential|built|project|automat|invoice|asset|superpower|strength|skill|sap|excel|hubspot|power automate/,
    background:/experience|background|career|history|award|recognition|where.*from|florida|clearwater|how.*get|why ops|worked|got into/,
    personal:/read|book|travel|amsterdam|europe|fun|hobb|outside|personal|free time|cats|pets|weakness|bad at/,
    job:/looking for|open to|freelance|consult|salary|location|remote|book|call|schedule|contact|email|authorized|visa/,
    fun:/impress|convince|coworker|colleague|real person|human|bot|robot|spreadsheet|chaos|42|cats.*say/
  };
  function _allSugs(){var all=[];for(var k in _sugPool)all=all.concat(_sugPool[k]);return all;}
  function _shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function _pickSuggestions(count, preferBucket){
    var pool=preferBucket&&_sugPool[preferBucket]?_sugPool[preferBucket].slice():[];
    var rest=_allSugs().filter(function(s){return pool.indexOf(s)===-1;});
    _shuffle(pool);_shuffle(rest);
    var combined=pool.concat(rest);
    // filter out already seen and currently showing
    var unseen=combined.filter(function(s){return _sugSeen.indexOf(s)===-1&&_sugCurrent.indexOf(s)===-1;});
    // if pool is nearly exhausted, reset seen but keep current visible ones excluded
    if(unseen.length<count){
      _sugSeen=_sugCurrent.slice();
      unseen=combined.filter(function(s){return _sugSeen.indexOf(s)===-1;});
    }
    return unseen.slice(0,count);
  }
  function _renderSuggestions(sugs){
    var el=document.getElementById('chat-suggestions');
    if(!el)return;
    el.innerHTML='';
    _sugCurrent=sugs;
    sugs.forEach(function(txt){
      var btn=document.createElement('button');
      btn.className='sug-btn';
      btn.textContent=txt;
      btn.onclick=function(){askSuggestion(btn)};
      el.appendChild(btn);
    });
  }
  function _initSuggestions(){
    var fixed=["What do you actually do?","What have you built?","What are you looking for?","Impress me"];
    _sugSeen=fixed.slice();
    _sugCurrent=fixed.slice();
    _renderSuggestions(fixed);
  }
  function _refreshSuggestions(bucket){
    var next=_pickSuggestions(3,bucket);
    _sugSeen=_sugSeen.concat(next);
    _sugCurrent=next;
    _renderSuggestions(next);
  }
  function _detectBucket(q){
    for(var k in _sugContextMap){if(_sugContextMap[k].test(q))return k;}
    return null;
  }
  function askSuggestion(btn){
    var text=btn.textContent;
    if(_sugSeen.indexOf(text)===-1)_sugSeen.push(text);
    addUserMsg(text);
    getResponse(text);
  }
  function sendChat(){
    var input=document.getElementById('chat-input'),val=input.value.trim();
    if(!val)return;
    addUserMsg(val);input.value='';getResponse(val);
  }
  function addUserMsg(text){
    var msgs=document.getElementById('chat-messages');
    var div=document.createElement('div');div.className='msg msg-user';div.textContent=text;
    msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
  }
  function addMaddieMsg(text){
    var msgs=document.getElementById('chat-messages');
    var typing=document.createElement('div');typing.className='typing-wrap';
    typing.innerHTML='<span></span><span></span><span></span>';
    msgs.appendChild(typing);msgs.scrollTop=msgs.scrollHeight;
    setTimeout(function(){
      typing.remove();
      var div=document.createElement('div');div.className='msg msg-maddie';div.textContent=text;
      msgs.appendChild(div);msgs.scrollTop=msgs.scrollHeight;
    },900+Math.random()*600);
  }
  var _lastQ='';
  var _impressIdx=0;
  var _impressResponses=[
    "Invoice batches went from 45 minutes to 5. Storage costs that had never been audited. CFO reporting built where none existed. I did most of it without being asked. That is the whole pitch.",
    "Two awards in two years for work that was not in my job description. The job description and what I actually did were related mainly by location.",
    "I came in to process invoices. I ended up automating the invoices, auditing storage no one had looked at, building IT tracking across 120 devices, and writing documentation for all of it. The invoices still got processed.",
    "From AR Coordinator to SAP automation, CFO reporting, and Apple Business Manager rollout. My title did not change. The scope of the work did.",
    "I find the thing nobody documented, figure out why it has been broken, fix it, and document it well enough that it stays fixed without me. That is not a skill most people lead with. It should be."
  ];
  function getResponse(question){
    var q=question.toLowerCase().trim();
    var bucket=_detectBucket(q);
    // impress me
    if(/impress|convince|why.*you|pitch|sell yourself|make.*case/.test(q)){
      addMaddieMsg(_impressResponses[_impressIdx++%_impressResponses.length]);
      _lastQ='';
      setTimeout(function(){_refreshSuggestions('fun');},1200);
      return;
    }
    if(q===_lastQ){addMaddieMsg("Same question, same answer. Still true.");return;}
    _lastQ=q;
    var rules=[
      // protection first
      [/\bf+u+c+k+|s+h+i+t+|\bb+i+t+c+h+|\ba+s+s+h+o+l+e+|\bc+u+n+t+|\bd+i+c+k+|\bc+o+c+k+|\bp+u+s+s+y+|\bt+i+t+s+|\bn+u+d+e+|\bs+e+x+y+|\bf+a+p+|\bh+o+r+n+y+|\blewd\b|\bdirty\b|\bnsfw\b/,"Watch the language. This is a professional portfolio. Mostly."],
      [/\bstupid\b|\bidiot\b|\bdumb\b|\buseless\b|\bworthless\b|\bhate you\b|\bscrew you\b|\bshut up\b/,"Rude. The actual human behind this is much more fun to talk to. maddie.rochovansky@atomicmail.io"],
      [/chatgpt|openai|gpt-?4|claude|anthropic|gemini|llm|language model|are you (an )?ai/,"Technically a bot living on a portfolio site. The specifics are not important. What matters is everything in here is accurate and the person behind it is very much real and available."],
      [/phone number|address|where.*live|home address|personal.*info|private.*info/,"Not going to happen. Email works: maddie.rochovansky@atomicmail.io"],
      [/i can help you|more leads|grow your business|seo|marketing services|my (agency|company|service)|collaboration opportunity/,"This is a job search chatbot, not a sales call. Hard pass."],
      // easter eggs
      [/^(open sesame|password|secret)$/,"You found one. There is at least one more in here somewhere."],
      [/^charlotte$/,"Small. Loud. Runs the place. Does not know she is a cat."],
      [/^griffith$/,"Senior staff. Strong opinions about the thermostat. Currently supervising from across the room."],
      [/^42$/,"Correct. That is the answer. To most things, actually."],
      [/^meow+[!.\s]*$|^mrrrow$|^mrow$/,"Meow :3"],
      [/spreadsheet/,"There is one open right now. There is always one open. I have made peace with it."],
      [/^(hi|hello|hey|howdy|sup|yo|hiya)[!.\s]*$/,"Hi. Ask me anything about Maddie, what she has built, or what she is looking for. Or just try something weird."],
      [/boyfriend|dating|taken|single|relationship/,"Hi Tristen! (or weird stranger)"],
      [/\bchaos\b/,"Managed professionally. Light chaos is where the best work happens anyway."],
      [/^hire her$|^hire maddie$|^hired$/,"Good call. maddie.rochovansky@atomicmail.io"],
      // cats say must come before any rule with 'about you'
      [/what.*cats.*say|cats.*think|griffith.*think|charlotte.*think|cats say/,"Griffith would say: insufficient. Charlotte would say: adequate, I suppose. The bar is high in this household."],
      // specific questions before broad catch-alls
      [/tell me about your project|about.*project/,"Projects span automation, process improvement, data and analytics, financial ops, and systems. The Projects section has highlights from each area with full detail on each one."],
      [/tell me about your experience|about.*experience/,"3+ years across AP, AR, IT operations, and workflow automation. Currently at Mitsubishi International Food Ingredients as Accounts Payable &amp; IT Administrative Assistant (Operations, Finance &amp; IT), operating across operations, finance, and IT functions. Before that, AP Coordinator and AR Coordinator at SCC Soft Computer in Clearwater, FL. The Experience section has the full timeline."],
      [/what ha(s she|ve you) built|built professionally/,"Projects span automation, process improvement, data and analytics, financial ops, and systems. The Projects section has highlights across all of those areas with real numbers and full detail on each one."],
      [/what have you built|show me.*work|portfolio/,"Projects span automation, process improvement, data and analytics, financial ops, and systems. The Projects section has highlights across all of those areas with real numbers and full detail on each one."],
      [/what.*experience.*sap|experience.*with.*sap/,"SAP ERP has been part of the day-to-day since 2022, across both AP and AR roles. Used it for invoice processing, payment runs, and month-end close. Built an Excel pre-validation layer upstream of SAP that eliminated 40+ manual posting corrections per month."],
      [/outside.*work|what do you do.*outside|free time|hobbi/,"Reading, travel, and two cats who run a surprisingly tight household. Trying to get to Europe as often as possible."],
      [/tell.*something fun|tell.*fun|fun fact|something fun/,"There is a spreadsheet that has been open continuously since 2023. The cats have strong opinions about the work-from-home setup. I have never met a process I did not want to map. All three are related."],
      [/how did you get into|how.*get into|got into operations|career path|why ops|how.*end up/,"Finance background, but I kept ending up on the operational side of things. Fixing broken processes, building systems from scratch, figuring out why something has been wrong for two years. That work just fit better than anything else."],
      [/strongest skill|what.*good at|best at|superpower|really good at|strength/,"Finding the thing nobody documented, figuring out why it has been broken, fixing it, and documenting it well enough that it stays fixed. Also Excel. Those two are more related than they sound."],
      // work
      [/^what do you (actually )?do\??$|^who are you\??$|^about (maddie|you|yourself)\??$/,"Operations and process improvement. AP and AR background, IT administration, and workflow automation. I find where things break and build fixes that hold."],
      [/tool|tech stack|software|what.*use/,"Power Automate, Office Scripts, SAP ERP, Excel, SQL, HubSpot, SharePoint, Airtable, Lucidchart, Apple Business Manager, Asana, Monday.com, Microsoft Forms, Certify. If it has documentation I will learn it. If it does not, I will figure it out and write the documentation."],
      [/certif|credential|certified/,"Mix of formal certifications and continuing education across 5 areas: Process & Operations, Risk & Compliance, Supply Chain & Logistics, Data & Technology, and Continuing Education. The featured three are Lean Six Sigma Green Belt, FMEA ISO 31000, and HubSpot Revenue Operations. Full breakdown is in the Certifications section."],
      [/six sigma|lean|green belt/,"Certified Lean Six Sigma Green Belt through SSAA. Also: Process Improvement & Process Mapping Expert, Lean Management & Manufacturing Expert, ISO 9001, and IATF 16949. Process improvement is not just a talking point."],
      [/hubspot|revops|revenue ops/,"HubSpot Revenue Operations certified through HubSpot Academy. Also HubSpot Content Hub Software. RevOps is one of the directions I am actively moving toward."],
      [/\bsap\b/,"SAP ERP has been part of the day-to-day since 2022, across both AP and AR roles. Used it for invoice processing, payment runs, and month-end close. Also built an Excel pre-validation layer upstream of SAP that eliminated 40+ manual posting corrections per month."],
      [/excel|office script/,"Probably the tool I use most. Dashboards, financial reports, validation logic, asset tracking. Office Scripts for automation inside Microsoft 365, and I have built PivotTable and XLOOKUP-heavy models for CFO-level reporting."],
      [/\bsql\b/,"Used SQL at SCC Soft Computer to query invoice data, cross-reference contract pricing, and flag variances. Maintained 99%+ accuracy across 500+ accounts doing it. In the Data & Analytics tab in Projects."],
      [/automat|power automate/,"Invoice batches from 45 minutes to 5. Vendor remittance emails that fire automatically after payment runs. A SharePoint intake system that routes submissions without manual sorting. All of it documented and still running. Automation tab in Projects has the full breakdown."],
      [/proud|favorite|best project/,"The IT Asset Tracking Dashboard. Nobody had formally tracked 120+ devices before. I built the system from scratch, took accuracy from 85% to 98%, and documented it so it runs without me. That is what good work looks like."],
      [/invoice|batch|processing/,"The invoice batch automation took processing time from 45 minutes to 5, running 15+ times a week. Built the Power Automate flow, and separately built an Excel validation layer that eliminated 40+ monthly corrections. Both are in the Automation tab."],
      [/asset.*track|it.*dashboard|device/,"120+ devices across 4 carriers, no centralized tracking. I built a multi-view Excel dashboard with aging reports and departmental breakdowns. Accuracy went from 85% to 98%. In the Data & Analytics tab."],
      [/vendor|remittance|airtable/,"Two vendor-related projects: an Airtable-based vendor management system with intake forms and automated alerts, and a Power Automate flow that triggers remittance emails automatically after payment runs. Both in the Automation tab."],
      [/sharepoint|microsoft 365|m365/,"I built two department-specific SharePoint hubs and a centralized document management structure with Microsoft Forms intake and Power Automate routing. Microsoft 365 Operations Infrastructure project in the Systems tab."],
      [/apple.*business|abm|mdm|device.*manag/,"Led the Apple Business Manager implementation end-to-end across 55+ devices and 4 carriers. In the Systems tab alongside the IT Coordination and Microsoft 365 projects."],
      // background
      [/where.*work|where.*worked|where.*have.*work/,"Mitsubishi International Food Ingredients currently, as Accounts Payable & IT Administrative Assistant. Before that, AP Coordinator and AR Coordinator at SCC Soft Computer. Full timeline is in the Experience section."],
      [/current.*job|current.*role|where.*currently|mifi|mitsubishi/,"Accounts Payable & IT Administrative Assistant at Mitsubishi International Food Ingredients, though the scope covers operations, finance, and IT. 600+ monthly vendor transactions, 120+ devices, CFO-level reporting, SharePoint infrastructure, and a long list of things that are now automated that were not before I got there. Two company awards in 18 months for work outside the job description."],
      [/scc|soft computer|previous.*job|florida.*job/,"AP Coordinator and AR Coordinator at SCC Soft Computer, from mid-2022 to late 2024. Redesigned the expense report process, cut approval cycle time 30%, and used SQL to maintain 99%+ accuracy across 500+ accounts."],
      [/experience|background|career|history|resume|cv/,"3+ years across AP, AR, IT operations, and workflow automation. Currently at Mitsubishi International Food Ingredients operating across operations, finance, and IT functions. Before that, AP Coordinator and AR Coordinator at SCC Soft Computer in Clearwater, FL. The Experience section has the full timeline."],
      [/award|recognition|\belp\b/,"ELP Learning Award Q3 2024 and ELP Initiative Award Q2 2025, both at MIFI. The Learning Award was for continuously building new skills and applying problem-solving to deliver stronger results. The Initiative Award was for identifying issues and improving processes without waiting for direction. Both for doing things that were not in the job description."],
      [/where.*from|hometown|originally|clearwater|florida/,"Originally from Clearwater, FL. Degree from St. Petersburg College in 2022, worked in Florida for two years, then moved to New Jersey. New Jersey has seasons and I have made peace with that."],
      [/education|degree|college|university|school/,"B.A. in Business Administration & Management from St. Petersburg College, FL, 2022."],
      // job search
      [/looking for|open to|seeking|what.*want|what.*looking/,"Remote full-time in Business Operations, Process Improvement, or RevOps. Ideally somewhere the problems are real, the scope is meaningful, and the processes are not already perfect."],
      [/work auth|visa|sponsor|eligible|authorized|citizen|us work/,"Authorized to work in the US. No sponsorship needed."],
      [/location|where.*based|remote|\bnj\b|new jersey/,"Based in New Jersey. Looking for remote work, open to anywhere."],
      [/salary|rate|pay|compensation|how much/,"Happy to discuss specifics directly. I have a number in mind and it is reasonable. maddie.rochovansky@atomicmail.io"],
      [/freelance|consult|hire.*for|available.*project/,"Open to select freelance: workflow automation, operations cleanup, AP and AR setup, SharePoint builds, Excel dashboards, web builds, and SEO. If the problem does not have a clean name yet, those are usually the most interesting ones. The Work With Me page has the full breakdown."],
      [/contact|email|reach|get in touch/,"maddie.rochovansky@atomicmail.io or the contact form at the bottom of the page. If you want to skip the email chain: cal.com/rochovanskym/30min"],
      [/book|call|schedule|calendar|cal\.com|meeting/,"cal.com/rochovanskym/30min. Thirty minutes, no agenda required."],
      [/linkedin/,"linkedin.com/in/maddie-rochovansky"],
      // personal
      [/coworker|colleague|\bteam\b|what.*people.*say|reference/,"The most common variation is: she already fixed that. Sometimes followed by: wait, she did that too?"],
      [/real person|human|\bbot\b|robot|actually (you|maddie)/,"Technically a bot. But everything in here came from a real person who is very much available for hire and would prefer you email her rather than continue interrogating the chatbot."],
      [/bad at|weakness|not good|struggle|honest/,"I notice broken things and cannot leave them alone. That has never once been bad for the job. It has occasionally been bad for my evenings."],
      [/cats|pets|\bcat\b/,"Griffith is senior staff with opinions about the thermostat. Charlotte is chaos in a small body. Both are currently in management and unavailable for comment."],
      [/travel|europe|van gogh|amsterdam/,"All over Europe, ideally. Different cities, different art museums, as much of it as possible. There is no shortage of places on the list."],
      [/read|book|reading|night of the grizzl/,"Currently reading Night of the Grizzlies. Two fatal grizzly attacks in Glacier National Park in one night in 1967. It is a true story and somehow that makes it worse."],
      [/blog|writing|post|article/,"Three articles published on Substack at theknownissues: organizational dysfunction through the Universe 25 experiment, SOP drift through the Ship of Theseus, and Goodhart's Law in management. More in the works. Blog section has all of them."],
      [/boring|lame|dull|not funny/,"Fair. There are limits to what a chatbot on a portfolio site can do. The person behind this is considerably more interesting."],
    ];
    for(var i=0;i<rules.length;i++){
      if(rules[i][0].test(q)){
        addMaddieMsg(rules[i][1]);
        setTimeout(function(){_refreshSuggestions(bucket);},1200);
        return;
      }
    }
    addMaddieMsg("That one is outside my range. Try the actual human: maddie.rochovansky@atomicmail.io");
    setTimeout(function(){_refreshSuggestions(null);},1200);
  }
  function toggleChat(){
    var panel=document.getElementById('chat-panel');
    var isOpening=!panel.classList.contains('open');
    panel.classList.toggle('open');
    if(isOpening)_initSuggestions();
  }
  function openModal(){document.getElementById('contact-modal').classList.add('open');document.body.style.overflow='hidden';}
  function closeModal(){document.getElementById('contact-modal').classList.remove('open');document.body.style.overflow='';}
  function handleModalClick(e){if(e.target===document.getElementById('contact-modal'))closeModal();}
  document.getElementById('contact-form').addEventListener('submit',function(e){
    e.preventDefault();
    var form=this;
    var btn=form.querySelector('.form-submit');
    var errEl=document.getElementById('form-error');
    if(btn.disabled)return;
    btn.textContent='Sending...';btn.disabled=true;
    if(errEl)errEl.style.display='none';
    fetch('https://formspree.io/f/xvzwovee',{
      method:'POST',
      headers:{'Accept':'application/json'},
      body:new FormData(form)
    }).then(function(r){
      if(r.ok){
        document.getElementById('modal-form-wrap').style.display='none';
        document.getElementById('form-success').style.display='block';
        form.reset();
      } else {
        btn.textContent='Send Message';btn.disabled=false;
        if(errEl)errEl.style.display='block';
      }
    }).catch(function(){
      btn.textContent='Send Message';btn.disabled=false;
      if(errEl)errEl.style.display='block';
    });
  });
  var funPhrases=[
    "Has strong opinions about folder naming conventions.",
    "Outvoted by two cats on most major decisions.",
    "Has never met a process I didn't want to map.",
    "Has a color coding system for everything. Yes, everything.",
    "The person at every job who ends up knowing how everything works, whether it's their job or not.",
    "Gets unreasonably satisfied when an automation runs for the first time."
  ];
  var funOrder=[];
  function shuffleFun(){funOrder=funPhrases.map(function(v,i){return i;}).sort(function(){return Math.random()-0.5;});}
  shuffleFun();
  var funIdx=0;
  function rotateFun(){
    var el=document.getElementById('fun-text');
    if(funIdx>=funOrder.length){shuffleFun();funIdx=0;}
    el.classList.remove('visible');
    setTimeout(function(){
      el.textContent=funPhrases[funOrder[funIdx]];
      funIdx++;
      el.classList.add('visible');
    },150);
  }

  function toggleChips(id,btn){
    var wrap=document.getElementById(id);
    var expanded=wrap.classList.toggle('expanded');
    if(!btn.dataset.original)btn.dataset.original=btn.textContent;
    btn.textContent=expanded?'Show less':btn.dataset.original;
  }

  function filterProj(cat, btn) {
    document.querySelectorAll('.proj-filter-btn').forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    document.querySelectorAll('.proj[data-cat]').forEach(function(p){
      if(cat==='all'||p.dataset.cat===cat){p.classList.remove('hidden');}
      else{p.classList.add('hidden');if(p.classList.contains('open')){toggleProj(p);}}
    });
  }
  document.querySelectorAll('.proj[data-cat]').forEach(function(p){
    if(p.dataset.cat!=='automation'){p.classList.add('hidden');}
  });
  window.filterProj=filterProj;
  window.rotateFun=rotateFun;
  window.toggleChips=toggleChips;
  window.openModal=openModal;
  window.closeModal=closeModal;
  window.handleModalClick=handleModalClick;
  window.toggleMob=toggleMob;
  window.closeMob=closeMob;
  window.toggleProj=toggleProj;
  window.toggleCert=toggleCert;
  window.toggleChat=toggleChat;
  window.askSuggestion=askSuggestion;
  window.sendChat=sendChat;

  // Escape key closes modal
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      closeModal();
      var panel=document.getElementById('chat-panel');
      if(panel.classList.contains('open'))panel.classList.remove('open');
    }
  });

  // Close mobile menu on scroll
  window.addEventListener('scroll',function(){
    var m=document.getElementById('mob-menu');
    if(m.classList.contains('open'))m.classList.remove('open');
  },{passive:true});

  // Active nav highlight on scroll
  var sections=document.querySelectorAll('section[id]');
  var navLinks=document.querySelectorAll('.nav-links a[href^="#"]');
  var navObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var id=e.target.getAttribute('id');
        navLinks.forEach(function(a){
          a.classList.toggle('nav-active',a.getAttribute('href')==='#'+id);
        });
      }
    });
  },{threshold:0.25,rootMargin:'-60px 0px -40% 0px'});
  sections.forEach(function(s){navObs.observe(s);});
})();