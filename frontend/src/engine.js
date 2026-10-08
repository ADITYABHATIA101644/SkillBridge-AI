// Resume intelligence engine. All input = the resume's own extracted text; every function is pure and per-resume.
const SK={ // name:[category, regex]
Python:['Programming',/\bpython\d?\b/gi],Java:['Programming',/\bjava\b/gi],C:['Programming',/\bC\s+(?:programming|language)\b|(?<![\w+#.\-])C(?=\s*[,;|•·\/)])/g],'C++':['Programming',/c\+\+/gi],JavaScript:['Programming',/javascript|ecmascript|\bes6\b|(?<![.\w])js\b/gi],TypeScript:['Programming',/typescript/gi],'Data Structures':['Programming',/data structures?|\bdsa\b/gi],Algorithms:['Programming',/\balgorithms?\b/gi],
HTML:['Web',/\bhtml5?\b/gi],CSS:['Web',/\bcss3?\b/gi],React:['Web',/\breact(?:\.?js)?\b(?!\s+to\b)/gi],'Node.js':['Web',/\bnode(?:\.?js)?\b(?!\s+(?:in|of)\b)/gi],Express:['Web',/express\.?js|\bexpress\b(?=\s*[,;|•·\/)]|\s+(?:framework|server|api))/gi],'Next.js':['Web',/next\.?js/gi],'REST APIs':['Web',/\brest(?:ful)?\s*apis?\b|\brestful\b/gi],Django:['Web',/\bdjango\b/gi],Flask:['Web',/\bflask\b/gi],
SQL:['Data',/\bsql\b/gi],MySQL:['Data',/\bmysql\b/gi],PostgreSQL:['Data',/\bpostgres(?:ql)?\b/gi],MongoDB:['Data',/\bmongo(?:db)?\b/gi],Excel:['Data',/\bexcel\b(?!\s+(?:in|at|as|during|to)\b)/gi],'Power BI':['Data',/power\s?-?bi/gi],Tableau:['Data',/\btableau\b/gi],Pandas:['Data',/\bpandas\b/gi],NumPy:['Data',/\bnumpy\b/gi],Statistics:['Data',/\bstatistic(?:s|al)?\b/gi],'Data Analysis':['Data',/data analy(?:sis|tics)/gi],
'Machine Learning':['AI',/machine learning|\bml\b/gi],'Deep Learning':['AI',/deep learning|neural networks?|\bcnn\b/gi],NLP:['AI',/\bnlp\b|natural language processing/gi],TensorFlow:['AI',/tensorflow/gi],PyTorch:['AI',/pytorch/gi],'Scikit-learn':['AI',/scikit[\s-]?learn|sklearn/gi],
AWS:['Cloud',/\baws\b|amazon web services/gi],Azure:['Cloud',/\bazure\b/gi],Docker:['Cloud',/\bdocker\b/gi],Kubernetes:['Cloud',/kubernetes|\bk8s\b/gi],Git:['Cloud',/\bgit\b/gi],GitHub:['Cloud',/\bgithub\b/gi],'CI/CD':['Cloud',/\bci\s*\/\s*cd\b/gi],Linux:['Cloud',/\blinux\b/gi],Networking:['Cloud',/computer networks?|\bnetworking\b(?!\s+(?:event|session))/gi]};
export const ALL=Object.keys(SK);
export const CAT=ALL.reduce((a,s)=>((a[SK[s][0]]??=[]).push(s),a),{});
export const catOf=s=>SK[s]?.[0]||'Programming';
// Role requirements. 'A|B' = any one of them satisfies it. Number = minimum level (1 Beginner..4 Expert).
export const ROLES={
fs:{JavaScript:2,React:2,'Node.js':2,'MongoDB|SQL|PostgreSQL|MySQL':1,'REST APIs':1},
fe:{JavaScript:2,React:2,HTML:1,CSS:1,'REST APIs':1},
be:{'Python|Java|Node.js|Django':2,'REST APIs':2,'SQL|PostgreSQL|MySQL|MongoDB':2,Git:1,Docker:1},
da:{'SQL|MySQL|PostgreSQL':2,Python:2,Excel:2,Pandas:2,Statistics:2,'Power BI|Tableau':2},
bi:{'SQL|MySQL|PostgreSQL':2,'Power BI|Tableau':2,Excel:2,'Data Analysis':1},
ml:{Python:2,'Machine Learning':2,Statistics:1,'NumPy|Pandas':1,'Scikit-learn':1,'Deep Learning|TensorFlow|PyTorch':1},
cl:{'AWS|Azure':2,Linux:2,Docker:2,Kubernetes:1,'CI/CD':1}};
const STRETCH={fs:['TypeScript','Next.js','Docker'],fe:['TypeScript','Next.js','Git'],be:['Kubernetes','CI/CD','AWS'],da:['Tableau','NumPy','Machine Learning'],bi:['Python','Statistics','Tableau'],ml:['PyTorch','Docker','AWS'],cl:['Python','Git','Azure']};
export const skillOf=k=>k.split('|')[0];
export const DEMAND={fs:'High',da:'High',ml:'High',cl:'High'};
export const cleanName=f=>f.replace(/\.[^.]+$/,'').replace(/[_\-.]+/g,' ').replace(/\s+/g,' ').trim().replace(/\b\w/g,c=>c.toUpperCase());
// ---------- text structure ----------
const norm=t=>t.replace(/\r/g,'\n').replace(/[\u00a0\t]+/g,' ').replace(/[•▪●◦■]/g,'•').replace(/ {2,}/g,' ').replace(/\n{3,}/g,'\n\n');
const HEAD=/^(education|academics?|academic (?:background|qualifications?)|(?:work |professional |relevant )?experience|employment(?: history)?|internships?|(?:academic |personal |key )?projects?|certifications?(?: (?:&|and) courses)?|licenses?|courses?|(?:technical |key |core )?skills|technologies|tech stack|achievements|awards|summary|objective|career objective|profile|languages|interests|publications|extracurriculars?)\s*:?$/i;
const GROUP=h=>/educ|academ/i.test(h)?'edu':/experience|employment|intern/i.test(h)?'exp':/project/i.test(h)?'proj':/certif|licen|course/i.test(h)?'cert':/skill|technolog|tech stack/i.test(h)?'skills':'other';
function sections(t){const S={head:[],edu:[],exp:[],proj:[],cert:[],skills:[],other:[]};let cur='head';
 t.split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{const h=l.replace(/[:\-–|]+$/,'').trim();if(h.length<32&&HEAD.test(h))cur=GROUP(h);else S[cur].push(l)});return S}
const bullet=l=>/^[•\-*▪]/.test(l);
const strip=l=>l.replace(/^[•\-*▪]\s*/,'').trim();
const MONTHS='jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec';
const RANGE=new RegExp('((?:'+MONTHS+')[a-z]*\\.?\\s*)?((?:19|20)\\d\\d)\\s*(?:-|–|—|to)\\s*(?:((?:'+MONTHS+')[a-z]*\\.?\\s*)?((?:19|20)\\d\\d)|(present|current|ongoing|now))','i');
const TITLE=/intern|developer|engineer|analyst|trainee|associate|manager|consultant|scientist|assistant|lead|architect|specialist|executive|researcher/i;
const THIS_YEAR=new Date().getFullYear();
function parseExperience(lines){const out=[];let cur=null;
 for(const raw of lines){const l=strip(raw),rg=l.match(RANGE);
  if(!bullet(raw)&&(rg||(TITLE.test(l)&&l.length<90&&!/\b(?:developed|built|created|designed|implemented|worked|used)\b/i.test(l)))){
   if(cur&&!rg&&!cur.duration&&!cur.bullets.length){cur.title+=' — '+l;continue}
   const y0=rg?+rg[2]:null,y1=rg?(rg[4]?+rg[4]:THIS_YEAR):null;
   cur={title:l.replace(RANGE,'').replace(/[()|,–—-]+\s*$/,'').trim()||l,duration:rg?rg[0]:'',years:rg?Math.max(.25,y1-y0):0,bullets:[]};out.push(cur)}
  else if(cur&&cur.bullets.length<4)cur.bullets.push(strip(l))}
 return out.filter(e=>e.title).slice(0,8)}
function parseProjects(lines){const out=[];let cur=null;
 for(const raw of lines){const l=strip(raw);
  if(!bullet(raw)&&l.length<100&&(!cur||cur.bullets.length||/[|:–—]/.test(l)||l.split(' ').length<=8)){cur={name:l.replace(/\s*[|:–—].*$/,'').trim()||l,line:l,bullets:[]};out.push(cur)}
  else if(cur&&cur.bullets.length<4)cur.bullets.push(l)}
 return out.slice(0,8).map(p=>({name:p.name,desc:p.bullets[0]||p.line,tech:skillsIn([p.line,...p.bullets].join('\n')).map(x=>x[0])}))}
const ISSUER=/(coursera|udemy|nptel|google|microsoft|aws|amazon|ibm|oracle|meta|infosys|cisco|hackerrank|linkedin|freecodecamp|great learning|simplilearn)/i;
const parseCerts=lines=>lines.map(strip).filter(l=>l.length>6&&l.length<140).slice(0,10).map(l=>({name:l,issuer:(l.match(ISSUER)||[])[1]||''}));
function parseEducation(S,text){const src=S.edu.length?S.edu.join('\n'):text;
 const deg=(src.match(/\b(b\.?\s?tech|b\.?\s?e\.?|b\.?\s?c\.?\s?a|m\.?\s?c\.?\s?a|m\.?\s?tech|b\.?\s?sc\.?|m\.?\s?sc\.?|mba|bachelor(?:'s)?(?:\s+of\s+[a-z ]{3,30})?|master(?:'s)?(?:\s+of\s+[a-z ]{3,30})?|diploma|ph\.?d)\b\.?/i)||[])[0];
 const uni=((src.split('\n').find(l=>/university|institute|college|\biit\b|\bnit\b|school of/i.test(l))||'').split(/\s*[,|()]\s*/).find(p=>/university|institute|college|\biit\b|\bnit\b|school of/i.test(p))||'').trim();
 const field=(src.match(/(?:computer science|information technology|data science|artificial intelligence|software engineering|electronics|electrical|mechanical|civil|commerce|mathematics|statistics|business administration|computer applications)[a-z &]{0,22}/i)||[])[0];
 const yrs=src.match(/(?:19|20)\d\d/g);const year=yrs?yrs[yrs.length-1]:'';
 return deg||uni?{degree:(deg||'').trim(),university:uni,field:(field||'').trim(),year}:null}
function parsePersonal(text,S){const lines=text.split('\n').map(l=>l.trim()).filter(Boolean).slice(0,8);
 const nm=lines.find(l=>/^[A-Za-z][A-Za-z.'\- ]{3,40}$/.test(l)&&l.split(' ').length>=2&&l.split(' ').length<=4&&!HEAD.test(l)&&!/resume|curriculum|vitae/i.test(l));
 return{name:nm||'',email:(text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)||[])[0]||'',phone:(text.match(/(?:\+\d{1,3}[\s-]?)?[6-9]\d{9}\b|(?:\+\d{1,3}[\s-]?)?\d{5}[\s-]\d{5}\b/)||[])[0]||'',
  location:(lines.join(' ').match(/\b(Chandigarh|Mohali|Kharar|Punjab|Delhi|Gurugram|Gurgaon|Noida|Mumbai|Pune|Bengaluru|Bangalore|Hyderabad|Chennai|Kolkata|Ahmedabad|Jaipur|Haryana|Maharashtra|Karnataka|India)\b/i)||[])[0]||''}}
// find skill mentions in text: [[name, count], ...]
function skillsIn(t){const o=[];ALL.forEach(s=>{const n=(t.match(SK[s][1])||[]).length;if(n)o.push([s,n])});return o}
const EXPL={beginner:1,basic:1,fundamental:1,familiar:1,novice:1,intermediate:2,working:2,proficient:3,advanced:3,strong:3,expert:4};
const XR='(beginner|basic|fundamental|familiar|novice|intermediate|working|proficient|advanced|strong|expert)';
function explicitLevel(t,s){const src=SK[s][1].source,fl=SK[s][1].flags.replace('g','');
 const a=new RegExp(XR+'(?:\\s+(?:knowledge|command|level|skills?))?(?:\\s+(?:of|in|with))?\\s+(?:'+src+')',fl),b=new RegExp('(?:'+src+')\\s*[\\-–:(]\\s*'+XR,fl);
 const m=t.match(a),n=t.match(b);const w=m?m[1]:n?n[n.length-1]:null;return w?EXPL[w.toLowerCase()]:0}
// ---------- main extraction ----------
export function extract(raw,fileName){
 if(!raw||raw.replace(/\s/g,'').length<60)return{err:'notext'};
 const text=norm(raw),S=sections(text),lines=text.split('\n').map(l=>l.trim()).filter(Boolean);
 const found=skillsIn(text);if(!found.length)return{err:'noskills'};
 const experience=parseExperience(S.exp),projects=parseProjects(S.proj),certifications=parseCerts(S.cert),education=parseEducation(S,text),personal=parsePersonal(text,S);
 let expYears=Math.round(experience.reduce((a,e)=>a+e.years,0)*10)/10;
 if(!expYears){const y=text.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs)\s+(?:of\s+)?(?:professional\s+)?experience/i);if(y)expYears=parseFloat(y[1])}
 const skills=found.map(([s])=>{const re=SK[s][1];const cnt=a=>a.filter(l=>{re.lastIndex=0;return re.test(l)}).length;
  const n=cnt(lines),ne=cnt(S.exp),np=cnt(S.proj),nc=cnt(S.cert),ex=explicitLevel(text,s);
  const score=n+2*ne+np+nc+(expYears>=2&&ne?1:0);
  const l=ex||(score>=8&&ne?3:score>=4?2:1);return{n:s,l,c:ex?95:Math.min(92,55+score*5),ev:{lines:n,exp:ne,proj:np,cert:nc,explicit:!!ex}}})
  .sort((a,b)=>b.l-a.l||b.c-a.c);
 const r={rawText:text.slice(0,30000),personal,education,experience,projects,certifications,skills,expYears,intern:/intern/i.test(S.exp.join(' ')+' '+experience.map(e=>e.title).join(' ')),few:skills.length<3};
 r.goal=matches(r)[0].id;return r}
export const demoExtract=()=>{const s=[['Python',3],['Machine Learning',2],['SQL',2],['Data Structures',3],['Java',2],['NLP',1]];return{skills:s.map(([n,l],i)=>({n,l,c:90-i*4})),goal:'ml',projects:[{name:'Sample ML project',desc:'Demo data',tech:['Python']}],certifications:[{name:'Sample certificate',issuer:''}],experience:[],personal:{},expYears:0,intern:false,education:{degree:'B.E.',university:'',field:'Computer Science',year:''},rawText:''}};
// ---------- matching ----------
export const lvl=(r,k)=>Math.max(0,...k.split('|').map(s=>r.skills.find(x=>x.n===s)?.l||0));
export function roleMatch(r,id){const req=ROLES[id],ks=Object.keys(req);
 const pct=Math.round(ks.reduce((a,k)=>a+Math.min(lvl(r,k),req[k])/req[k],0)/ks.length*100);
 return{id,pct,have:ks.filter(k=>lvl(r,k)>=req[k]),gaps:ks.filter(k=>lvl(r,k)<req[k]),req}}
export const matches=r=>Object.keys(ROLES).map(id=>roleMatch(r,id)).sort((a,b)=>b.pct-a.pct||b.have.length-a.have.length);
export const targets=(r,id)=>{const g=roleMatch(r,id).gaps.map(skillOf);return g.length?g:STRETCH[id].filter(s=>!lvl(r,s)).slice(0,3)};
export function analysis(r){const m=matches(r),sm=roleMatch(r,r.goal).pct;
 return{sm,ready:Math.round(.6*sm+.15*Math.min(100,(r.projects?.length||0)*35)+.1*Math.min(100,(r.certifications?.length||0)*50)+.15*((r.expYears>0||r.intern)?100:40)),recs:m.filter(x=>x.pct>=50).length}}
export const gapKind=(have,req)=>have>=req?'s':have>0?'m':'c';
export const boost=m=>Math.min(97,m.pct+Math.round((100-m.pct)*.75));
export function diff(p,n){if(!p)return null;const pm=Object.fromEntries(p.skills.map(s=>[s.n,s.l])),nm=Object.fromEntries(n.skills.map(s=>[s.n,s.l]));
 const k=a=>a.map(x=>x.toLowerCase().trim());const nw=(a,b,f)=>b.filter(x=>!k(a.map(f)).includes(f(x).toLowerCase().trim())).map(f);
 const ed=e=>e?[e.degree,e.field,e.university,e.year].filter(Boolean).join(' · '):'';
 return{newSk:Object.keys(nm).filter(s=>!(s in pm)),remSk:Object.keys(pm).filter(s=>!(s in nm)),updSk:Object.keys(nm).filter(s=>s in pm&&pm[s]!==nm[s]).map(s=>[s,pm[s],nm[s]]),
  newExp:nw(p.experience||[],n.experience||[],e=>e.title),newProj:nw(p.projects||[],n.projects||[],x=>x.name),newCert:nw(p.certifications||[],n.certifications||[],x=>x.name),newEdu:ed(n.education)&&ed(n.education)!==ed(p.education)?ed(n.education):''}}
// ---------- courses / roadmap / opportunities ----------
export const COURSE={TensorFlow:['TensorFlow for Beginners','Coursera',4],PyTorch:['PyTorch Zero to Mastery','Udemy',6],'Deep Learning':['Deep Learning Specialization','NPTEL',8],'Machine Learning':['ML Foundations','Coursera',6],'Scikit-learn':['Scikit-learn in Practice','Kaggle Learn',2],NLP:['NLP with Transformers','Hugging Face',4],Python:['Advanced Python','NPTEL',3],SQL:['Advanced SQL','Udemy',3],MySQL:['MySQL for Developers','Udemy',3],Excel:['Excel for Analytics','Coursera',2],'Power BI':['Power BI Essentials','Microsoft Learn',3],Tableau:['Tableau Fundamentals','Coursera',3],Statistics:['Statistics for Data Science','NPTEL',4],Pandas:['Data Analysis with Pandas','Kaggle Learn',3],NumPy:['NumPy for Data Science','Coursera',2],'Data Analysis':['Data Analysis with Python','Coursera',4],JavaScript:['Modern JavaScript','freeCodeCamp',4],TypeScript:['TypeScript Handbook & Practice','freeCodeCamp',3],React:['React Complete Guide','Udemy',5],'Next.js':['Next.js App Router Course','Vercel Learn',3],'Node.js':['Node.js Bootcamp','Udemy',4],Express:['Express API Development','Udemy',3],MongoDB:['MongoDB University M001','MongoDB',3],'REST APIs':['REST API Design','Coursera',2],HTML:['HTML5 Foundations','freeCodeCamp',2],CSS:['Responsive CSS','freeCodeCamp',2],Django:['Django for Everybody','Coursera',5],Flask:['Flask Web Development','Udemy',3],PostgreSQL:['PostgreSQL Essentials','Udemy',3],Git:['Git & GitHub Basics','freeCodeCamp',1],Docker:['Docker Mastery','Udemy',3],Kubernetes:['Kubernetes for Beginners','KodeKloud',4],'CI/CD':['CI/CD with GitHub Actions','Udemy',2],AWS:['AWS Cloud Practitioner','AWS Skill Builder',4],Azure:['Azure Fundamentals AZ-900','Microsoft Learn',3],Linux:['Linux Fundamentals','NPTEL',3],Networking:['Computer Networks','NPTEL',4],Algorithms:['Algorithms Specialization','Coursera',6],C:['C Programming','NPTEL',4]};
export const courses=(r,id)=>{const ga=roleMatch(r,id).gaps.length>0;return targets(r,id).map(s=>{const c=COURSE[s]||[s+' Basics','Coursera',3];const need=ROLES[id][Object.keys(ROLES[id]).find(k=>k.split('|').includes(s))]||2;
 return{s,name:c[0],plat:c[1],wk:c[2],rel:ga?Math.max(80,98-Math.max(0,need-lvl(r,s))*2-c[2]):Math.max(70,86-c[2]),diff:lvl(r,s)?1:0}})};
export function roadmap(r,id){const m=roleMatch(r,id),t=targets(r,id),mod=m.gaps.filter(g=>lvl(r,g)>0).map(skillOf),cr=m.gaps.filter(g=>!lvl(r,g)).map(skillOf);
 return[{k:0,sk:mod.length?mod:m.have.slice(0,2).map(skillOf),wk:2,d:1},{k:1,sk:cr.length?cr:t,wk:Math.max(2,(cr.length||t.length)*2),d:2},{k:2,sk:t,wk:3,d:2,proj:1},{k:3,sk:[],wk:2,d:1,ready:1}]}
const CITY=['Bengaluru','Hyderabad','Chandigarh','Pune','Gurugram'];
export const opps=(r,goal)=>{const ms=matches(r),alt=ms.find(x=>x.id!==goal)?.id||goal,ids=[goal,goal,alt];
 return ids.map((id,i)=>{const m=roleMatch(r,id);return{kind:i,id,city:CITY[(id.charCodeAt(0)+id.charCodeAt(1)+i)%5],exp:i==1?'0-2 yrs':'Fresher',pct:Math.max(0,m.pct-i*3),req:Object.keys(m.req).slice(0,4).map(skillOf)}})};
