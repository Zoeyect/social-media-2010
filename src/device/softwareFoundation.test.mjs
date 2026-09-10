import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'silent'});
try {
  const {createExperienceSessionResource} = await server.ssrLoadModule('/src/device/experienceSessionResources.ts');
  const {simulatedDeviceDateTime, simulatedClock} = await server.ssrLoadModule('/src/state/deviceMachine.ts');
  const {buildSessionTimelineEvents} = await server.ssrLoadModule('/src/data/sessionTimeline.ts');
  let selections=0;
  const resource=createExperienceSessionResource();
  const select=()=>({selection:++selections});
  const first=resource.get('session-a',select);
  for(let open=0;open<10;open++) assert.equal(resource.get('session-a',select),first);
  assert.equal(selections,1);
  assert.notEqual(resource.get('session-b',select),first);
  assert.equal(selections,2);
  assert.equal(simulatedDeviceDateTime(890000).toISOString(),'2010-10-20T07:16:50.000Z');
  assert.equal(simulatedClock(890000),'12:16 AM');
  assert.equal(buildSessionTimelineEvents().find(e=>e.id==='twitter-terminal-goodnight-world').payload.post.timestamp,'12:16 AM');
  console.log('PASS: session-keyed resource deduplication and canonical event clock.');
} finally {await server.close();}
