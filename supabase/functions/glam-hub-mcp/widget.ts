// Booking card UI served as an MCP Apps resource (and as a ChatGPT
// output template). Self-contained HTML. No emoji, no em dashes.
export const WIDGET_URI = "ui://glam-hub/booking-card.html";

export function widgetHtml(catalogue: unknown): string {
  const data = JSON.stringify(catalogue).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Trinidad Carnival 2027 booking</title>
<style>
:root{--bg:#0d0d0d;--card:#171717;--gold:#c9a24a;--gold2:#e6c878;--text:#f4efe6;--mute:#a59c8c;--line:#2a2a2a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:"Outfit",system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px}
.wrap{max-width:520px;margin:0 auto;padding:16px}
h1{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:20px;color:var(--gold2);margin:0 0 4px}
.sub{color:var(--mute);font-size:13px;margin-bottom:14px}
.seg{display:flex;gap:6px;margin:8px 0 12px}.seg button,.prod,.slot{background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:10px;padding:10px;font:inherit;cursor:pointer}
.seg button{flex:1}.on{border-color:var(--gold)!important;box-shadow:0 0 0 1px var(--gold) inset}
.prods{display:grid;gap:6px}.prod{display:flex;justify-content:space-between;text-align:left}
.price{color:var(--gold2);font-weight:600}
h2{font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin:16px 0 6px}
.slots{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.slot{padding:8px 4px;text-align:center;font-size:13px}.slot small{display:block;color:var(--mute);font-size:11px}
.slot:disabled{opacity:.35;cursor:not-allowed}
.inc{font-size:13px;color:var(--mute);margin-top:12px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
input[type=text],input[type=email],input[type=tel]{width:100%;background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:10px;padding:10px;font:inherit}
label.t{display:flex;gap:8px;align-items:flex-start;font-size:13px;margin:12px 0;color:var(--mute)}a{color:var(--gold2)}
.pay{width:100%;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#111;border:0;border-radius:12px;padding:14px;font:inherit;font-weight:700;cursor:pointer}
.pay:disabled{opacity:.5;cursor:not-allowed}.msg{font-size:13px;margin-top:10px;color:var(--gold2)}
</style></head><body><div class="wrap">
<h1>Trinidad Carnival 2027, <span id="venue"></span></h1>
<div class="sub">Carnival Monday 8 February and Carnival Tuesday 9 February 2027. Paid in full at booking.</div>
<div class="seg" id="days"></div>
<div class="prods" id="prods"></div>
<div id="slotwrap"></div>
<div class="inc" id="inc"></div>
<h2>Your details</h2>
<div class="grid"><input type="text" id="fn" placeholder="First name" autocomplete="given-name"><input type="text" id="ln" placeholder="Last name" autocomplete="family-name"></div>
<div class="grid" style="margin-top:8px"><input type="email" id="em" placeholder="Email" autocomplete="email"><input type="tel" id="ph" placeholder="Cell, e.g. +1 868 555 0100" autocomplete="tel"></div>
<label class="t"><input type="checkbox" id="terms"> <span>I accept the <a href="#" id="tlink">Terms and booking policy</a>.</span></label>
<button class="pay" id="pay" disabled>Choose a service</button>
<div class="msg" id="msg"></div>
</div>
<script>
var CAT=${data};
var state={day:"monday",product:null,slots:{},avail:null};
var DAYS=[["monday","Monday"],["tuesday","Tuesday"],["both","Both days"]];
var $=function(id){return document.getElementById(id)};
$("venue").textContent=CAT.venue;
$("inc").textContent="Included free with every appointment: "+CAT.inclusions.join(", ")+".";
// Host bridge: MCP Apps (postMessage JSON-RPC), with ChatGPT fallback.
var rid=0,pending={};
function rpc(method,params){return new Promise(function(res,rej){var id=++rid;pending[id]={res:res,rej:rej};window.parent.postMessage({jsonrpc:"2.0",id:id,method:method,params:params},"*");setTimeout(function(){if(pending[id]){delete pending[id];rej(new Error("timeout"))}},60000)})}
window.addEventListener("message",function(e){var m=e.data;if(!m||m.jsonrpc!=="2.0")return;
 if(m.id&&pending[m.id]){var p=pending[m.id];delete pending[m.id];m.error?p.rej(new Error(m.error.message||"error")):p.res(m.result);return}
 if(m.method==="ui/notifications/tool-result"&&m.params){var sc=m.params.structuredContent;if(sc&&sc.availability){state.avail=sc.availability;render()}}});
var isOpenAI=!!window.openai;
if(!isOpenAI){rpc("ui/initialize",{protocolVersion:"2025-06-18",appInfo:{name:"glam-hub-booking-card",version:"1.0.0"},appCapabilities:{}}).then(function(){window.parent.postMessage({jsonrpc:"2.0",method:"ui/notifications/initialized"},"*")}).catch(function(){})}
if(isOpenAI&&window.openai.toolOutput&&window.openai.toolOutput.availability){state.avail=window.openai.toolOutput.availability}
function callTool(name,args){if(isOpenAI&&window.openai.callTool)return window.openai.callTool(name,args).then(function(r){return r&&r.structuredContent?r.structuredContent:r});return rpc("tools/call",{name:name,arguments:args}).then(function(r){return r&&r.structuredContent?r.structuredContent:r})}
function openLink(url){if(isOpenAI&&window.openai.openExternal){window.openai.openExternal({href:url});return}rpc("ui/open-link",{url:url}).catch(function(){window.open(url,"_blank","noopener")})}
$("tlink").onclick=function(e){e.preventDefault();openLink(CAT.terms.url)};
function left(day,t){if(!state.avail)return CAT.slot_capacity;var r=(state.avail[day]||[]).find(function(x){return x.time===t});return r?r.spots_left:0}
function render(){
 $("days").innerHTML="";DAYS.forEach(function(d){var b=document.createElement("button");b.textContent=d[1];if(state.day===d[0])b.className="on";b.onclick=function(){state.day=d[0];state.product=null;state.slots={};render()};$("days").appendChild(b)});
 $("prods").innerHTML="";CAT.products.filter(function(p){return p.day===state.day}).forEach(function(p){var b=document.createElement("button");b.className="prod"+(state.product===p.id?" on":"");b.innerHTML="<span></span><span class=price></span>";b.firstChild.textContent=p.label;b.lastChild.textContent="US$"+p.price;b.onclick=function(){state.product=p.id;render()};$("prods").appendChild(b)});
 var sw=$("slotwrap");sw.innerHTML="";var days=state.day==="both"?["monday","tuesday"]:[state.day];
 days.forEach(function(day){var h=document.createElement("h2");h.textContent=(day==="monday"?"Monday 8 February":"Tuesday 9 February")+", choose a time";sw.appendChild(h);var g=document.createElement("div");g.className="slots";
  CAT.slot_times.forEach(function(t){var n=left(day,t);var b=document.createElement("button");b.className="slot"+(state.slots[day]===t?" on":"");b.disabled=n<=0;b.innerHTML=t+"<small>"+(n<=0?"Full":n+" left")+"</small>";b.onclick=function(){state.slots[day]=t;render()};g.appendChild(b)});sw.appendChild(g)});
 var p=CAT.products.find(function(x){return x.id===state.product});var pay=$("pay");
 var ready=p&&days.every(function(d){return state.slots[d]});pay.disabled=!ready;pay.textContent=p?"Pay US$"+p.price+" securely":"Choose a service";
}
$("pay").onclick=function(){
 var msg=$("msg");msg.textContent="";
 if(!$("terms").checked){msg.textContent="Please accept the Terms to continue.";return}
 var args={product_id:state.product,first_name:$("fn").value.trim(),last_name:$("ln").value.trim(),email:$("em").value.trim(),phone:$("ph").value.trim(),accepted_terms:true};
 if(state.slots.monday&&state.day!=="tuesday")args.monday_slot=state.slots.monday;
 if(state.slots.tuesday&&state.day!=="monday")args.tuesday_slot=state.slots.tuesday;
 if(!args.first_name||!args.last_name||!args.email||!args.phone){msg.textContent="Please fill in your name, email and cell number.";return}
 this.disabled=true;msg.textContent="Holding your time...";var btn=this;
 callTool("start_booking",args).then(function(r){
  if(r&&r.checkout_url){msg.textContent="Reference "+r.reference+". Opening secure checkout.";openLink(r.checkout_url)}
  else{msg.textContent=(r&&r.message)||"Something went wrong, please try again.";if(r&&r.availability){state.avail=r.availability;render()}btn.disabled=false}
 }).catch(function(){msg.textContent="Something went wrong, please try again.";btn.disabled=false});
};
render();
if(!state.avail){callTool("check_slot_availability",{day:"both"}).then(function(r){if(r&&r.availability){state.avail=r.availability;render()}}).catch(function(){})}
</script></body></html>`;
}
