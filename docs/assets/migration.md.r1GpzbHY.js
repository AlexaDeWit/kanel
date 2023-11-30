import{_ as e,o as a,c as t,R as s}from"./chunks/framework.tNgZIIMt.js";const u=JSON.parse('{"title":"Migrating from v2","description":"","frontmatter":{},"headers":[],"relativePath":"migration.md","filePath":"migration.md"}'),i={name:"migration.md"},n=s(`<h1 id="migrating-from-v2" tabindex="-1">Migrating from v2 <a class="header-anchor" href="#migrating-from-v2" aria-label="Permalink to &quot;Migrating from v2&quot;">​</a></h1><p>Version 3 introduces significant changes in how Kanel is configured and unless you ran it with an absolute minimum of customization, you will need to make some adjustments.</p><p>You can see the new type for the configuration object in <a href="../packages/kanel/src/Config.ts">Config.ts</a>.</p><h2 id="index-ts" tabindex="-1">index.ts <a class="header-anchor" href="#index-ts" aria-label="Permalink to &quot;index.ts&quot;">​</a></h2><p>Kanel no longer generates an <code>index.ts</code> file per default. There is a hook provided called <code>generateIndexFile</code> which you can use if you want it.</p><p><strong>Note:</strong> even with this, it no longer creates the composed id types etc., which I believe I was the only one using anyway.</p><p>In <code>.kanelrc.js</code>:</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">generateIndexFile</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;kanel&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  connection: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;...&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // Generate an index file with exports of everything</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  preRenderHooks: [generateIndexFile],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h2 id="nominators" tabindex="-1">Nominators <a class="header-anchor" href="#nominators" aria-label="Permalink to &quot;Nominators&quot;">​</a></h2><p>The nominators have been replaced by <code>getMetadata</code>, <code>getPropertyMetadata</code> and <code>generateIdentifierType</code>. These functions can be configured to return a custom name, comment and other things to customize your output.</p><p>The hooks are more or less intact as <a href="./postRenderHooks.html">postRenderHooks</a>. Those take a path and an array of strings, allowing you to do crude processing if necessary. However, you will probably prefer to create <a href="./preRenderHooks.html">preRenderHooks</a> that operate on more abstract data models and allow you more flexibility.</p><h2 id="ignoring-entities" tabindex="-1">Ignoring entities <a class="header-anchor" href="#ignoring-entities" aria-label="Permalink to &quot;Ignoring entities&quot;">​</a></h2><p>The <code>schema.ignore</code> property has been replaced by one general <code>typeFilter</code> function which can filter out any table, view or other entity that you don&#39;t want to process.</p><p>If you used to have an ignore property like this:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>ignore: [/^celery/, /^djcelery/],</span></span></code></pre></div><p>you could replace it with this:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>typeFilter: d =&gt; ![/^celery/, /^djcelery/].some((v) =&gt; v.test(d.name)),</span></span></code></pre></div><h2 id="customtypemap" tabindex="-1">customTypeMap <a class="header-anchor" href="#customtypemap" aria-label="Permalink to &quot;customTypeMap&quot;">​</a></h2><p>The <code>customTypeMap</code> has changed slightly as well. It should now be indexed by <code>schemaName.typeName</code>. For builtin types, this means you specify them as <code>pg_catalog.float8</code> etc. Also, you no longer have to specify array types explicitly as these should be resolved using the same rules as non-array types.</p><h2 id="external-types" tabindex="-1">External types <a class="header-anchor" href="#external-types" aria-label="Permalink to &quot;External types&quot;">​</a></h2><p>The <code>externalTypesFolder</code> has been removed. Kanel will now assume that all types that are referenced as a simple string are built-in Typescript types (like <code>string</code>, <code>number</code>, <code>Record&lt;&gt;</code>, etc.). If you want to refer to a type that you created in a different file or that exists in an external package, you need to reference it as a <code>TypeImport</code>. You can do that in tagged comments like this: <code>@type(EmailString, &quot;./models/types/EmailString&quot;, false, true) Email address</code> -- this will import a type called <code>EmailString</code> from a file of the same name in the types folder. It will be imported as a named import.</p>`,21),o=[n];function r(l,p,h,d,c,g){return a(),t("div",null,o)}const k=e(i,[["render",r]]);export{u as __pageData,k as default};
