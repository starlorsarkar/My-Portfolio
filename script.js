// CURSOR
const cur=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();

// CHART BARS
const barData=[{h:45,c:'var(--v2)'},{h:70,c:'var(--v4)'},{h:55,c:'var(--v5)'},{h:85,c:'var(--v1)'},{h:60,c:'var(--v3)'},{h:95,c:'var(--v2)'},{h:40,c:'var(--v6)'}];
const chartEl=document.getElementById('chartBars');
barData.forEach((b,i)=>{const d=document.createElement('div');d.className='bar';d.style.cssText=`height:${b.h}%;background:${b.c};animation-delay:${i*0.12}s`;chartEl.appendChild(d)});

// SKILLS
const skills=[
  {icon:'🐍',name:'Python',pct:90,g:'linear-gradient(90deg,var(--v2),var(--v1))'},
  {icon:'🗄️',name:'SQL',pct:85,g:'linear-gradient(90deg,var(--v4),var(--v3))'},
  {icon:'📊',name:'Power BI',pct:80,g:'linear-gradient(90deg,var(--v2),var(--v3))'},
  {icon:'📈',name:'Tableau',pct:75,g:'linear-gradient(90deg,var(--v4),var(--v5))'},
  {icon:'🐼',name:'Pandas',pct:92,g:'linear-gradient(90deg,var(--v5),var(--v4))'},
  {icon:'🔢',name:'NumPy',pct:85,g:'linear-gradient(90deg,var(--v1),var(--v2))'},
  {icon:'📉',name:'Matplotlib',pct:80,g:'linear-gradient(90deg,var(--v3),var(--v4))'},
  {icon:'🎨',name:'Seaborn',pct:82,g:'linear-gradient(90deg,var(--v5),var(--v2))'},
  {icon:'📋',name:'Excel',pct:88,g:'linear-gradient(90deg,var(--v6),var(--v1))'},
  {icon:'📓',name:'Jupyter',pct:93,g:'linear-gradient(90deg,var(--v1),var(--v6))'},
  {icon:'🔬',name:'EDA',pct:90,g:'linear-gradient(90deg,var(--v2),var(--v4))'},
  {icon:'📦',name:'Statistics',pct:83,g:'linear-gradient(90deg,var(--v3),var(--v5))'},
];
const sg=document.getElementById('skills-grid');
skills.forEach(s=>{sg.innerHTML+=`<div class="sk"><div class="sk-icon">${s.icon}</div><div class="sk-name">${s.name}</div><div class="sk-track"><div class="sk-fill" data-pct="${s.pct}" style="background:${s.g}"></div></div></div>`});
const skillObs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting){document.querySelectorAll('.sk-fill').forEach(f=>{f.style.width=f.dataset.pct+'%'});skillObs.disconnect()}})},{threshold:0.2});
skillObs.observe(sg);

// GITHUB
const GH = 'starlorsarkar';

const TAGS = ['t-pink','t-blue','t-green','t-amber','t-orange'];
const EMOJIS = {python:'🐍',sql:'🗄️',jupyter:'📓',notebook:'📓',power:'📊',tableau:'📈',excel:'📋',dashboard:'📊',analysis:'🔍',data:'📦',visual:'🎨',eda:'🔬',default:'💼'};
function getEmoji(r){const t=((r.name||'')+(r.description||'')+(r.topics||[]).join(' ')).toLowerCase();for(const[k,v] of Object.entries(EMOJIS))if(t.includes(k))return v;return EMOJIS.default}

// 5 pinned projects — edit names here to change what's shown
const PINNED = [
  'Weather_Analysis',
  'HR_ANALYSIS',
  'Customer_Churn_Prediction',
  'Image_Classification_using_ANN',
  'SQL_Project'
];

const DESCRIPTIONS = {
  'weather-analysis':               'Analysed historical weather data to identify climate patterns, seasonal trends, and anomalies. Used Python and visualisation libraries to surface actionable insights from temperature, humidity, and precipitation data.',
  'hr-analysis':                    'Explored HR datasets to surface patterns in employee attrition, department performance, and demographics using Python and data visualisation tools.',
  'customer-churn-prediction':      'Built a machine learning model to predict customer churn using classification algorithms. Performed feature engineering and EDA to identify key drivers of churn and improve retention strategies.',
  'image-classification-using-ann': 'Developed an Artificial Neural Network to classify images across multiple categories. Implemented data preprocessing, model training, and evaluation using Python and deep learning frameworks.',
  'sql-project':                    'Designed and queried relational databases to solve real-world business problems. Leveraged advanced SQL techniques including joins, subqueries, window functions, and aggregations to extract meaningful insights.',
};

async function loadProjects(){
  try{
    // Fetch stats from all repos (for the stats strip)
    const allRes = await fetch(`https://api.github.com/users/${GH}/repos?per_page=100`);
    const allRepos = await allRes.json();
    if(Array.isArray(allRepos)){
      document.getElementById('repo-count').textContent = allRepos.length;
      document.getElementById('star-count').textContent = allRepos.reduce((a,r)=>a+r.stargazers_count,0);
    }

    // Fetch only the 4 pinned repos individually
    const results = await Promise.all(
      PINNED.map(name =>
        fetch(`https://api.github.com/repos/${GH}/${name}`)
          .then(r => r.json())
          .catch(() => null)
      )
    );

    const container = document.getElementById('proj-container');
    const grid = document.createElement('div');
    grid.className = 'proj-grid';

    results.forEach((r, i) => {
      if(!r || r.message) return;
      const key = r.name.toLowerCase().replace(/[-_]/g,'-');
      const desc = DESCRIPTIONS[key] || r.description || 'A data analytics project exploring insights from real-world datasets using Python and visualisation tools.';
      const emoji = getEmoji(r);
      const topics = (r.topics||[]).slice(0,4);
      const updated = new Date(r.updated_at).toLocaleDateString('en-GB',{year:'numeric',month:'short'});
      const displayName = r.name.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

      const card = document.createElement('div');
      card.className = 'proj-card reveal';
      card.style.transitionDelay = `${i*0.08}s`;
      card.innerHTML=`
        <div class="proj-top">
          <div class="proj-emoji">${emoji}</div>
          <div class="proj-links">
            ${r.homepage?`<a href="${r.homepage}" target="_blank" class="proj-link">↗ Demo</a>`:''}
            <a href="${r.html_url}" target="_blank" class="proj-link">⌥ Code</a>
          </div>
        </div>
        <div class="proj-name">${displayName}</div>
        <div class="proj-desc">${desc}</div>
        <div class="proj-tags">
          ${topics.map((t,j)=>`<span class="tag ${TAGS[j%TAGS.length]}">${t}</span>`).join('')}
          ${r.language?`<span class="tag t-blue">${r.language}</span>`:''}
          ${r.stargazers_count>0?`<span class="tag t-amber">★ ${r.stargazers_count}</span>`:''}
          <span style="margin-left:auto;font-size:0.62rem;color:var(--dim);align-self:center">${updated}</span>
        </div>`;
      grid.appendChild(card);
    });

    container.innerHTML='';
    container.appendChild(grid);
    document.querySelectorAll('.proj-card').forEach(el=>revObs.observe(el));

  }catch(e){
    console.error('loadProjects error:', e);
    document.getElementById('proj-container').innerHTML=`<p style="color:var(--muted);text-align:center;padding:3rem">Couldn't load projects — <a href="https://github.com/${GH}?tab=repositories" target="_blank" style="color:var(--v2)">View on GitHub →</a></p>`;
  }
}

// SCROLL REVEAL
const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target)}})},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

// SEND MSG
function sendMsg(btn){btn.textContent='Message Sent ✓';btn.style.background='linear-gradient(135deg,var(--v5),var(--v4))';setTimeout(()=>{btn.textContent='Send Message →';btn.style.background=''},3500)}

loadProjects();
