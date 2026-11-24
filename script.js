const $=id=>document.getElementById(id);
const show=id=>{document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id))};
const v=$('vid');
let done=false;
const toLogin=()=>{if(done)return;done=true;v.pause();show('login')};
$('start').onclick=()=>{$('start').style.display='none';v.play().catch(()=>{v.muted=true;v.play().catch(toLogin)})};
v.onended=toLogin;
const MN=['january','february','march','april','may','june','july','august','september','october','november','december'];
function parseDob(s){
  s=s.trim();let m,D,M,Y;
  if(m=s.match(/^(\d{1,2})\s*[\/\-.\s]\s*(\d{1,2})\s*[\/\-.\s]\s*(\d{4})$/)){D=+m[1];M=+m[2];Y=+m[3]}
  else if(m=s.match(/^(\d{2})(\d{2})(\d{4})$/)){D=+m[1];M=+m[2];Y=+m[3]}
  else if(m=s.match(/^(\d{1,2})(?:st|nd|rd|th)?[\s\-\/.,]*([A-Za-z]{3,9})\.?[\s\-\/.,]*(\d{4})$/)){
    D=+m[1];Y=+m[3];M=MN.findIndex(x=>x.startsWith(m[2].toLowerCase().slice(0,3)))+1;if(!M)return null}
  else return null;
  const b=new Date(Y,M-1,D);
  if(Y<1900||b.getDate()!==D||b.getMonth()!==M-1||b.getFullYear()!==Y)return{bad:1};
  return{D,M,Y,b};
}
$('enter').onclick=()=>{
  const n=$('user').value.trim(),d=$('dob').value.trim(),e=$('err');
  if(!n){e.textContent='Please enter your user name.';return}
  if(!d){e.textContent='Please enter your date of birth.';return}
  const r=parseDob(d);
  if(!r){e.textContent='Please type your date like 14/03/1998 or 14 March 1998.';return}
  if(r.bad){e.textContent='Please enter a valid date.';return}
  const b=r.b,t=new Date();
  if(b>t){e.textContent='Date of birth cannot be in the future.';return}
  let age=t.getFullYear()-b.getFullYear();
  if(t<new Date(t.getFullYear(),b.getMonth(),b.getDate()))age--;
  e.textContent='';
  udob=String(r.D).padStart(2,'0')+'/'+String(r.M).padStart(2,'0')+'/'+r.Y;
  $('hi').textContent='Welcome, '+n;
  $('meta').textContent='Born '+b.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'})+' \u00b7 Age '+age;
  startCount(n,b);
};
$('out').onclick=()=>{$('user').value='';$('dob').value='';show('login')};
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&$('login').classList.contains('on'))$('enter').click()});
const v2=$('vid2'),pad=x=>String(x).padStart(2,'0');
const showTap=()=>{done2=true;$('tap').classList.add('show')};
v2.onended=showTap;
let tm,t0=0,uname='',udob='',done2=false;
function startCount(n,b){
  uname=n;show('count');t0=Date.now();done2=false;$('tap').classList.remove('show');
  v2.currentTime=0;v2.play().catch(()=>{v2.muted=true;v2.play().catch(showTap)});
  const tick=()=>{
    const now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    let nx=new Date(now.getFullYear(),b.getMonth(),b.getDate());
    if(nx.getTime()===today.getTime()){
      $('cl').textContent='Happy Birthday, '+n+'!';
      $('cd').textContent='0';$('ch').textContent=$('cm').textContent=$('cs').textContent='00';return;
    }
    if(nx<now)nx=new Date(now.getFullYear()+1,b.getMonth(),b.getDate());
    const df=nx-now,s=Math.floor(df/1000);
    $('cl').textContent='Next birthday in';
    $('cd').textContent=Math.floor(s/86400);
    $('ch').textContent=pad(Math.floor(s%86400/3600));
    $('cm').textContent=pad(Math.floor(s%3600/60));
    $('cs').textContent=pad(s%60);
  };
  clearInterval(tm);tick();tm=setInterval(tick,1000);
}
function leave(){
  if(!done2||Date.now()-t0<900||!$('count').classList.contains('on'))return;
  clearInterval(tm);v2.pause();startMsg();
}
$('count').addEventListener('click',leave);
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' ')leave()});
const v3=$('vid3'),vb=$('vid3b'),aud=$('aud');
let ty,m0=0,typed=false;
function startMsg(){
  show('msg');m0=Date.now();typed=false;$('mtap').classList.remove('show');
  if(!vb.getAttribute('src'))vb.src=v3.getAttribute('src');
  v3.currentTime=0;vb.currentTime=0;v3.play().catch(()=>{});vb.play().catch(()=>{});
  aud.currentTime=0;aud.volume=.9;aud.play().catch(()=>{});
  const lines=['Dear '+uname,'Advance Happy Birthday! \u{1F382}\u{1F389}','Wishing you lots of happiness, success, and beautiful moments. Stay happy and keep smiling! You deserve a year full of happiness and success. Keep smiling and enjoy every moment of your special day when it arrives. \u{1F496}','Best wishes,','MAHESH..'];
  const box=$('typed');box.textContent='';
  const caret=document.createElement('span');caret.className='caret';
  let li=0,ci=0,chars,node;
  const newLine=()=>{const p=document.createElement('p');node=document.createTextNode('');p.append(node,caret);box.appendChild(p);chars=Array.from(lines[li]);ci=0};
  const step=()=>{
    if(ci<chars.length){node.nodeValue+=chars[ci++];ty=setTimeout(step,chars[ci-1]==='.'||chars[ci-1]==='!'?220:42)}
    else if(++li<lines.length){newLine();ty=setTimeout(step,450)}
    else{typed=true;$('mtap').classList.add('show')}
  };
  clearTimeout(ty);newLine();ty=setTimeout(step,900);
}
$('msg').addEventListener('click',()=>{
  if(!typed||Date.now()-m0<900||!$('msg').classList.contains('on'))return;
  clearTimeout(ty);v3.pause();vb.pause();aud.pause();startWish();
});
let wishSent=false;
function startWish(){
  show('wish');
  $('wishtext').value='';
  $('wishform').style.display='';
  $('wishsent').style.display='none';
  $('wtap').classList.remove('show');
  wishSent=false;
}
$('wishsend').addEventListener('click',(ev)=>{
  ev.stopPropagation();
  const w=$('wishtext').value.trim();
  if(!w)return;
  $('wishform').style.display='none';
  $('wishsent').style.display='';
  wishSent=true;
  const rev=$('rev'),bg=$('aud');
  rev.currentTime=0;rev.volume=1;
  const vol0=bg.volume;bg.volume=Math.min(vol0,.2);
  const restore=()=>{bg.volume=vol0};
  rev.onended=restore;rev.onerror=restore;
  rev.play().catch(restore);
  setTimeout(()=>{$('wtap').classList.add('show')},500);
  fetch('https://api.web3forms.com/submit',{
    method:'POST',
    headers:{'Content-Type':'application/json',Accept:'application/json'},
    body:JSON.stringify({access_key:'7e68ef1c-ebd5-4fe2-95b9-8581dadaa865',subject:'Birthday wish from '+uname,name:uname,dob:udob,wish:w})
  }).catch(()=>{});
});
$('wish').addEventListener('click',()=>{
  if(!wishSent||!$('wtap').classList.contains('show'))return;
  aud.pause();const rv=$('rev');rv.pause();rv.currentTime=0;show('home');
});
