import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeRichHtml} from '../src/lib/api/richHtml.js';
import {normalizeCmsRecord} from '../src/lib/api/cms.js';
test('preserves formatting and media while stripping unsafe markup',()=>{
 const html=sanitizeRichHtml('<h1>Heading</h1><ul><li><b>Bold</b></li></ul><img src="https://example.com/a.png" alt="Taxi" onerror="bad()"><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe><iframe src="https://evil.test"></iframe><a href="javascript:alert(1)">Click</a><script>alert(1)</script><p style="color: #ff0000; position: fixed">Color</p>');
 assert.ok(html.includes('<h1>Heading</h1>'));assert.ok(html.includes('<ul>'));assert.ok(html.includes('alt="Taxi"'));assert.ok(html.includes('youtube-nocookie.com'));assert.ok(html.includes('color:#ff0000'));
 assert.ok(!/onerror|evil.test|javascript:|<script|position/.test(html));
});
test('published CMS content retains sanitized rich body and video',()=>{
 const page=normalizeCmsRecord('blogs',{slug:'formatted',status:'Published',title:'Blog',content:'<h2>Trip</h2><video src="https://example.com/trip.mp4" controls></video><p><em>Hello</em></p>'});
 assert.ok(page.richHtml.includes('<em>Hello</em>'));assert.ok(page.richHtml.includes('<video'));
});
