import "dotenv/config";
import { searchContext } from "../src/rts.ts";
const USER=process.env.SLACK_USER_TOKEN!;
const BOTID="U0BERDD87FH";
async function u(m:string,b:any){const r=await fetch(`https://slack.com/api/${m}`,{method:"POST",headers:{Authorization:`Bearer ${USER}`,"Content-Type":"application/json"},body:JSON.stringify(b)});return r.json();}
const wait = process.argv[2] === "--wait";
const q = process.argv.slice(wait ? 3 : 2).join(" ");
const cid=(await searchContext({token:USER,query:"Node 18"})).hits[0]?.channelId ?? "C0BG177PNE4";
const s=await u("chat.postMessage",{channel:cid,text:`<@${BOTID}> ${q}`});
console.log("posted:",s.ok, s.ts);
if (wait) {
  for(let i=0;i<15;i++){await new Promise(r=>setTimeout(r,2000));const h=await u("conversations.history",{channel:cid,limit:3,oldest:s.ts});const rep=(h.messages||[]).find((m:any)=>(m.bot_id||m.subtype==="bot_message")&&m.ts>s.ts);if(rep){console.log("REPLIED");process.exit(0);}}
  console.log("NO_REPLY");
}
