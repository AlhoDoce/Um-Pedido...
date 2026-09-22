/* ============ CONFIG — edite só aqui ============ */
const CONFIG = {
  nome: "Rayane",
  telefone: "11 99006-5287",
  whatsapp: "5511990065287",

  elogios: [
    "Você tem um jeito que chama atenção sem nem precisar tentar.",
    "Seu sorriso definitivamente não ajuda quem está tentando manter a concentração.",
    "Você tem uma personalidade que fica na cabeça.",
    "Você é daquelas pessoas que deixam uma impressão depois que vão embora."
  ]
};
/* ================================================= */

const stage = document.getElementById('card');
const backBtn = document.getElementById('backBtn');
const progressEl = document.getElementById('progress');
const eggHeart = document.getElementById('eggHeart');
const eggModal = document.getElementById('eggModal');
const eggCard = document.getElementById('eggCard');

let history = [];
let current = null;

function renderScene(sceneFn, {pushHistory=true, showBack=false, progress=null} = {}){
  if(current && pushHistory) history.push(current);
  current = sceneFn;
  stage.classList.remove('enter');
  stage.classList.add('leave');
  setTimeout(()=>{
    stage.innerHTML = '';
    stage.className = 'card';
    sceneFn(stage);
    requestAnimationFrame(()=>stage.classList.add('enter'));
  }, 220);

  backBtn.classList.toggle('show', showBack && history.length>0);
  if(progress){
    progressEl.textContent = progress;
    progressEl.classList.add('show');
  } else {
    progressEl.classList.remove('show');
  }
}

backBtn.addEventListener('click', ()=>{
  if(history.length===0) return;
  const prev = history.pop();
  current = prev;
  stage.classList.remove('enter');
  stage.classList.add('leave');
  setTimeout(()=>{
    stage.innerHTML='';
    stage.className='card';
    prev(stage);
    requestAnimationFrame(()=>stage.classList.add('enter'));
  },220);
  backBtn.classList.toggle('show', history.length>0);
});

function typewrite(node, text, speed=28){
  return new Promise(resolve=>{
    node.textContent = '';
    const caret = document.createElement('span');
    caret.className='caret';
    let i=0;
    function step(){
      if(i<text.length){
        node.textContent = text.slice(0,i+1);
        node.appendChild(caret);
        i++;
        setTimeout(step, speed);
      } else {
        caret.remove();
        resolve();
      }
    }
    step();
  });
}
function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

/* ============ PARTICLES ============ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W,H,particles=[];
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize);
resize();

function makeParticles(n){
  particles = [];
  for(let i=0;i<n;i++){
    particles.push({
      x: Math.random()*W, y: Math.random()*H,
      r: 1 + Math.random()*2.2,
      vy: 0.12 + Math.random()*0.28,
      vx: (Math.random()-0.5)*0.12,
      o: 0.15 + Math.random()*0.35,
      heart: Math.random() < 0.12
    });
  }
}
makeParticles(46);

function drawHeart(x,y,size,alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x,y);
  ctx.scale(size/10,size/10);
  ctx.beginPath();
  ctx.moveTo(0,3);
  ctx.bezierCurveTo(0,0,-5,0,-5,-3);
  ctx.bezierCurveTo(-5,-6,-1,-7,0,-4);
  ctx.bezierCurveTo(1,-7,5,-6,5,-3);
  ctx.bezierCurveTo(5,0,0,0,0,3);
  ctx.fillStyle = '#ff3b54';
  ctx.fill();
  ctx.restore();
}

function loop(){
  ctx.clearRect(0,0,W,H);
  for(const p of particles){
    p.y -= p.vy; p.x += p.vx;
    if(p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
    if(p.heart){ drawHeart(p.x,p.y,p.r*3.2,p.o*0.8); }
    else{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(200,30,58,${p.o})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(loop);
}
loop();

function redFlash(intensity=1){
  const burst = document.createElement('div');
  burst.style.cssText = `position:fixed;inset:0;background:radial-gradient(circle at 50% 40%, rgba(255,59,84,${0.16*intensity}) 0%, transparent 65%);pointer-events:none;z-index:3;opacity:0;transition:opacity .5s ease;`;
  document.body.appendChild(burst);
  requestAnimationFrame(()=>burst.style.opacity='1');
  setTimeout(()=>{ burst.style.opacity='0'; setTimeout(()=>burst.remove(),600); }, 700);
}

function celebrate(){
  const burstLayer = document.getElementById('burst');
  const colors = ['#c81e3a','#ff3b54','#f2a9b5','#f7efee'];
  for(let i=0;i<60;i++){
    const p = document.createElement('div');
    const isHeart = Math.random()<0.35;
    const size = 6+Math.random()*8;
    p.textContent = isHeart ? '♥' : '';
    p.style.cssText = `
      position:fixed; left:${45+Math.random()*10}%; top:${40+Math.random()*10}%;
      width:${size}px;height:${size}px;
      background:${isHeart?'transparent':colors[Math.floor(Math.random()*colors.length)]};
      color:${colors[Math.floor(Math.random()*colors.length)]};
      font-size:${size+6}px; border-radius:${isHeart?'0':'2px'};
      opacity:1; pointer-events:none; z-index:4;
    `;
    burstLayer.appendChild(p);
    const angle = Math.random()*Math.PI*2;
    const dist = 120+Math.random()*260;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - 60;
    const rot = (Math.random()-0.5)*540;
    const dur = 900+Math.random()*700;
    p.animate([
      {transform:'translate(0,0) rotate(0deg)', opacity:1},
      {transform:`translate(${dx}px, ${dy+260}px) rotate(${rot}deg)`, opacity:0}
    ], {duration:dur, easing:'cubic-bezier(.2,.7,.2,1)', fill:'forwards'});
    setTimeout(()=>p.remove(), dur+50);
  }
}

/* ============ SCENES ============ */

function sceneIntro(root){
  root.innerHTML = `
    <p class="eyebrow" id="hi"></p>
    <h1 class="min-h" id="l1"></h1>
    <p class="min-h sub" id="l2"></p>
    <p class="min-h sub" id="l3"></p>
    <div class="btn-row" id="go" style="opacity:0; transition:opacity .5s ease;"></div>
  `;
  const hi = root.querySelector('#hi');
  const l1 = root.querySelector('#l1');
  const l2 = root.querySelector('#l2');
  const l3 = root.querySelector('#l3');
  const go = root.querySelector('#go');
  (async ()=>{
    await typewrite(hi, `Oi, ${CONFIG.nome}...`, 34);
    await wait(400);
    await typewrite(l1, 'Eu preciso te fazer uma pergunta.', 30);
    await wait(700);
    await typewrite(l2, 'Mas como eu poderia simplesmente perguntar...', 24);
    await wait(700);
    await typewrite(l3, '...se eu posso fazer isso de um jeito muito mais interessante?', 22);
    await wait(300);
    go.innerHTML = `<button class="btn big" id="btn">Tá, quero ver 👀</button>`;
    go.style.opacity='1';
    go.querySelector('#btn').onclick = ()=> renderScene(sceneQuiz1, {showBack:true, progress:'1 / 6'});
  })();
}

function sceneQuiz1(root){
  root.innerHTML = `
    <p class="eyebrow">pergunta rápida</p>
    <h2>Você gosta de receber<br>convites inesperados?</h2>
    <div class="btn-row">
      <button class="btn" id="a">Sim</button>
      <button class="btn ghost" id="b">Depende...</button>
    </div>
  `;
  const next = ()=> renderScene(sceneQuiz2, {showBack:true, progress:'2 / 6'});
  root.querySelector('#a').onclick = next;
  root.querySelector('#b').onclick = next;
}

function sceneQuiz2(root){
  root.innerHTML = `
    <p class="eyebrow">outra rapidinha</p>
    <h2>E se o convite vier acompanhado<br>de uma pessoa que claramente<br>ficou nervosa pra fazer esse convite?</h2>
    <div class="btn-row">
      <button class="btn" id="a">Interessante 👀</button>
      <button class="btn ghost" id="b">Agora fiquei curiosa</button>
    </div>
    <p class="sub min-h" id="res" style="margin-top:18px;"></p>
    <div class="btn-row" id="nextRow" style="opacity:0; transition:opacity .4s ease;"></div>
  `;
  const res = root.querySelector('#res');
  const nextRow = root.querySelector('#nextRow');
  const proceed = async ()=>{
    root.querySelector('#a').closest('.btn-row').style.display='none';
    await typewrite(res, 'Ótimo. Estamos avançando.', 26);
    nextRow.innerHTML = `<button class="btn" id="go">Continuar</button>`;
    nextRow.style.opacity='1';
    nextRow.querySelector('#go').onclick = ()=> renderScene(sceneElogios, {showBack:true, progress:'3 / 6'});
  };
  root.querySelector('#a').onclick = proceed;
  root.querySelector('#b').onclick = proceed;
}

function sceneElogios(root){
  root.innerHTML = `
    <p class="eyebrow">antes de chegar na pergunta...</p>
    <h2>Acho justo deixar<br>algumas coisas registradas.</h2>
    <div class="stack" id="list" style="margin-top:20px; text-align:left;"></div>
    <div class="btn-row" id="nextRow" style="opacity:0; transition:opacity .4s ease;"></div>
  `;
  const list = root.querySelector('#list');
  const nextRow = root.querySelector('#nextRow');
  (async ()=>{
    for(const linha of CONFIG.elogios){
      await wait(280);
      const p = document.createElement('p');
      p.style.cssText = 'border-left:2px solid var(--red); padding-left:14px; opacity:0; transform:translateX(-6px); transition:opacity .5s ease, transform .5s ease;';
      list.appendChild(p);
      requestAnimationFrame(()=>{ p.style.opacity='1'; p.style.transform='translateX(0)'; });
      await typewrite(p, linha, 16);
    }
    await wait(500);
    const p2 = document.createElement('p');
    p2.className='sub';
    p2.style.marginTop='16px';
    list.after(p2);
    await typewrite(p2, 'Pronto. Agora que eu já falei demais... podemos continuar.', 18);
    nextRow.innerHTML = `<button class="btn" id="go">Continuar</button>`;
    nextRow.style.opacity='1';
    nextRow.querySelector('#go').onclick = ()=> renderScene(sceneHumor, {showBack:true, progress:'4 / 6'});
  })();
}

function sceneHumor(root){
  root.innerHTML = `
    <div class="terminal">
      <div class="t-title">ANÁLISE DO CONVITE</div>
      <div id="rows"></div>
    </div>
    <p class="min-h" id="diag" style="margin-top:20px;"></p>
    <div class="btn-row" id="nextRow" style="opacity:0; transition:opacity .4s ease;"></div>
  `;
  const rows = root.querySelector('#rows');
  const data = [
    ['Coragem para perguntar','87%'],
    ['Nervosismo','73%'],
    ['Chance de ficar pensando "eu deveria ter perguntado"','100%'],
    ['Motivo principal',CONFIG.nome==='NOME_DELA' ? 'você.' : CONFIG.nome+'.']
  ];
  (async ()=>{
    for(const [label,val] of data){
      await wait(340);
      const row = document.createElement('div');
      row.className='t-row';
      row.innerHTML = `<span>${label}</span><b>${val}</b>`;
      row.style.opacity='0';
      rows.appendChild(row);
      requestAnimationFrame(()=>{ row.style.transition='opacity .4s ease'; row.style.opacity='1'; });
    }
    await wait(600);
    const diag = root.querySelector('#diag');
    const l1 = document.createElement('p');
    l1.className='sub';
    diag.appendChild(l1);
    await typewrite(l1, 'Diagnóstico final:', 26);
    await wait(300);
    const l2 = document.createElement('p');
    l2.style.fontFamily='var(--serif)';
    l2.style.fontSize='20px';
    diag.appendChild(l2);
    await typewrite(l2, 'Melhor perguntar logo.', 28);
    const nextRow = root.querySelector('#nextRow');
    nextRow.innerHTML = `<button class="btn" id="go">Concordo 👀</button>`;
    nextRow.style.opacity='1';
    nextRow.querySelector('#go').onclick = ()=> renderScene(sceneSuspense, {showBack:true, progress:'5 / 6'});
  })();
}

function sceneSuspense(root){
  root.innerHTML = `
    <p class="eyebrow" id="l1"></p>
    <h2 class="min-h" id="l2"></h2>
    <div class="countdown min-h" id="count"></div>
  `;
  const l1 = root.querySelector('#l1');
  const l2 = root.querySelector('#l2');
  const count = root.querySelector('#count');
  (async ()=>{
    await typewrite(l1, 'Tá...', 40);
    await wait(500);
    await typewrite(l2, 'Agora chegou a hora.', 30);
    await wait(700);
    for(const n of ['3','2','1']){
      count.textContent = n;
      count.style.animation='none';
      void count.offsetWidth;
      count.style.animation='cardIn .4s ease';
      await wait(700);
    }
    count.textContent = '';
    const stop = document.createElement('h2');
    root.querySelector('.card')?.appendChild;
    root.appendChild(stop);
    stop.textContent = 'Espera.';
    await wait(200);
    const btnRow = document.createElement('div');
    btnRow.className='btn-row';
    btnRow.innerHTML = `<button class="btn ghost" id="huh">😐 COMO ASSIM?</button>`;
    root.appendChild(btnRow);
    btnRow.querySelector('#huh').onclick = async ()=>{
      btnRow.remove();
      const p = document.createElement('p');
      p.className='sub';
      p.style.marginTop='14px';
      root.appendChild(p);
      redFlash(0.5);
      await typewrite(p, 'Eu precisava de mais alguns segundos de coragem.', 22);
      await wait(700);
      const row2 = document.createElement('div');
      row2.className='btn-row';
      row2.innerHTML = `<button class="btn big" id="go">Agora vai.</button>`;
      root.appendChild(row2);
      row2.querySelector('#go').onclick = ()=> renderScene(sceneQuestion, {showBack:true, progress:'6 / 6'});
    };
  })();
}

function sceneQuestion(root){
  root.innerHTML = `
    <p class="eyebrow" id="pre"></p>
    <h1 id="q" style="min-height:1.3em;"></h1>
    <div class="btn-row" id="options" style="opacity:0; transition:opacity .6s ease; margin-top:26px;"></div>
  `;
  const pre = root.querySelector('#pre');
  const q = root.querySelector('#q');
  (async ()=>{
    await typewrite(pre, `Então, ${CONFIG.nome}...`, 32);
    await wait(400);
    await typewrite(q, 'Quer sair comigo?', 50);
    const options = root.querySelector('#options');
    options.innerHTML = `
      <button class="btn big" id="yes1">SIM ❤️</button>
      <button class="btn big" id="yes2">CLARO QUE SIM 😌</button>
      <button class="btn ghost" id="unsure">Ainda não tenho certeza</button>
    `;
    options.style.opacity='1';
    options.querySelector('#yes1').onclick = goSuccess;
    options.querySelector('#yes2').onclick = goSuccess;
    options.querySelector('#unsure').onclick = ()=> renderScene(sceneUnsure, {showBack:true});
  })();
}

function goSuccess(){
  renderScene(sceneSuccess, {showBack:false});
  setTimeout(celebrate, 350);
}

function sceneUnsure(root){
  root.innerHTML = `
    <h2>Tudo bem.</h2>
    <p>Sem pressão nenhuma ❤️</p>
    <p class="sub">Quando quiser, a pergunta continua bem aqui.</p>
    <div class="btn-row"><button class="btn ghost" id="back">Voltar pra pergunta</button></div>
  `;
  root.querySelector('#back').onclick = ()=> renderScene(sceneQuestion, {showBack:false});
}

function sceneSuccess(root){
  root.innerHTML = `
    <h1>EU SABIA! 😎❤️</h1>
    <p class="sub">Ok... oficialmente temos um encontro para marcar.</p>
    <p>Agora vem a parte importante.</p>
    <div class="btn-row"><button class="btn big" id="go">Continuar</button></div>
  `;
  root.querySelector('#go').onclick = ()=> renderScene(scenePhone, {showBack:false});
}

function scenePhone(root){
  root.innerHTML = `
    <p class="eyebrow">recompensa desbloqueada 🔓</p>
    <h2>Toque no cadeado.</h2>
    <div class="lock" id="lock">🔒</div>
    <div id="reveal" style="display:none;">
      <p style="margin-top:6px;">Parabéns, você desbloqueou meu número.</p>
      <p class="sub">📱</p>
      <div class="phone-box"><div class="phone-number">${CONFIG.telefone}</div></div>
      <div class="btn-row">
        <button class="btn" id="save">Salvar contato 📲</button>
        <button class="btn ghost" id="wa">Mandar mensagem no WhatsApp 💬</button>
      </div>
      <div class="btn-row" style="margin-top:26px;"><button class="btn ghost" id="go">Continuar →</button></div>
    </div>
  `;
  const lock = root.querySelector('#lock');
  lock.onclick = ()=>{
    if(lock.classList.contains('open')) return;
    lock.classList.add('open');
    lock.textContent = '🔓';
    lock.style.cursor='default';
    redFlash(0.7);
    setTimeout(()=>{ root.querySelector('#reveal').style.display='block'; }, 350);
  };

  root.querySelector('#save').onclick = ()=>{
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${CONFIG.nome==='NOME_DELA' ? 'Meu convite' : CONFIG.nome}\nTEL;TYPE=CELL:${CONFIG.telefone}\nEND:VCARD`;
    const blob = new Blob([vcard], {type:'text/vcard'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'contato.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };
  root.querySelector('#wa').onclick = ()=>{
    window.open(`https://wa.me/${CONFIG.whatsapp}`, '_blank');
  };
  root.querySelector('#go').onclick = ()=> renderScene(sceneFinal, {showBack:false});
}

function sceneFinal(root){
  root.innerHTML = `
    <h2>Agora ficou oficialmente<br>mais fácil combinar esse encontro.</h2>
    <p class="sub">Só falta decidir quando. 👀</p>
    <p>Obrigado por entrar na brincadeira. ❤️</p>
    <p class="sub" style="margin-top:18px;">Agora pode salvar meu número antes que eu fique com vergonha de novo.</p>
    <div class="btn-row"><button class="btn big" id="go">Fechar com estilo ✨</button></div>
  `;
  root.querySelector('#go').onclick = ()=>{
    celebrate();
    renderScene(sceneClosing, {showBack:false});
  };
}

function sceneClosing(root){
  root.innerHTML = `<h1 style="font-size:clamp(40px,10vw,64px);">❤️</h1>`;
}

/* easter egg */
eggHeart.addEventListener('click', ()=>{
  eggCard.innerHTML = `
    <h2>Você encontrou o segredo.</h2>
    <p class="sub">Confissão final:</p>
    <p>Eu provavelmente poderia ter simplesmente te mandado uma mensagem...</p>
    <p>...mas fazer um site foi muito mais divertido.</p>
    <p class="sub">Espero que tenha valido a pena. 😅❤️</p>
    <div class="btn-row egg-close"><button class="btn ghost" id="close">Fechar</button></div>
  `;
  eggModal.classList.add('show');
  eggCard.querySelector('#close').onclick = ()=> eggModal.classList.remove('show');
});
eggModal.addEventListener('click', (e)=>{ if(e.target===eggModal) eggModal.classList.remove('show'); });

/* boot */
renderScene(sceneIntro, {pushHistory:false});
