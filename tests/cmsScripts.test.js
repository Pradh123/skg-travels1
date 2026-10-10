import test from 'node:test';import assert from 'node:assert/strict';
import {parseCmsScripts} from '../src/lib/api/cmsScripts.js';import {normalizeCmsRecord} from '../src/lib/api/cms.js';import {createPageMetadata} from '../src/data/seo.js';
test('keywords and separate script fields survive normalization and metadata generation',()=>{
 const page=normalizeCmsRecord('blogs',{status:'Published',title:'Taxi guide',slug:'taxi-guide',keywords:'taxi, airport',headScripts:'<script type="application/ld+json">{"@type":"Article"}</script>',bodyScripts:'<script src="https://example.com/track.js"></script>'});
 assert.deepEqual(createPageMetadata(page).keywords,['taxi','airport']);assert.equal(parseCmsScripts(page.headScripts)[0].type,'application/ld+json');assert.equal(parseCmsScripts(page.bodyScripts)[0].src,'https://example.com/track.js');
 assert.deepEqual(parseCmsScripts('<script type="application/ld+json">bad</script><script src="javascript:bad()"></script>'),[]);
})
