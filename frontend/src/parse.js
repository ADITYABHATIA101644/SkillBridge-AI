import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth/mammoth.browser';
pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;
const fail=c=>{const e=new Error(c);e.code=c;return e};
// OCR fallback for scanned (image-only) PDFs. tesseract.js downloads its language data on first use (needs internet).
async function ocr(d,max=3){const {createWorker}=await import('tesseract.js');const w=await createWorker('eng');let o='';
 try{for(let p=1;p<=Math.min(d.numPages,max);p++){const pg=await d.getPage(p),vp=pg.getViewport({scale:2}),cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;
  await pg.render({canvas:cv,canvasContext:cv.getContext('2d'),viewport:vp}).promise;o+=(await w.recognize(cv)).data.text+'\n'}}finally{await w.terminate()}return o}
// Returns {text, ocr}. Throws Error with code: empty | type | doc | corrupt | notext
export async function readFile(f,onStage=()=>{}){
 if(!f||!f.size)throw fail('empty');
 const ext=f.name.split('.').pop().toLowerCase();
 if(!['pdf','docx','doc','txt'].includes(ext))throw fail('type');
 if(ext==='doc')throw fail('doc');
 let buf;try{buf=await f.arrayBuffer()}catch{throw fail('corrupt')}
 let text='',used=false;
 try{
  if(ext==='pdf'){const d=await pdfjs.getDocument({data:buf}).promise;
   for(let p=1;p<=d.numPages;p++){const c=await(await d.getPage(p)).getTextContent();let y=null;
    for(const it of c.items){if(!('str' in it))continue;const yy=it.transform?it.transform[5]:null;if(y!==null&&yy!==null&&Math.abs(yy-y)>3)text+='\n';else if(text&&!text.endsWith('\n')&&!text.endsWith(' '))text+=' ';text+=it.str;if(it.hasEOL)text+='\n';if(yy!==null)y=yy}text+='\n'}
   if(text.replace(/\s/g,'').length<80){onStage('ocr');text=await ocr(d);used=true}}
  else if(ext==='docx')text=(await mammoth.extractRawText({arrayBuffer:buf})).value;
  else text=new TextDecoder().decode(buf);
 }catch(e){if(e.code)throw e;throw fail('corrupt')}
 if(text.replace(/\s/g,'').length<60)throw fail('notext');
 return{text,ocr:used}}
