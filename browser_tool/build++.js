function stripComments(str){
    if(str.slice(0,2)=='/*'){
        var j = str.indexOf('*/')+2
        str = str.substr(j)
    }
    return str
}
function doNotUseStrict(str){
    return str.replace(/\n[ \t]*"use strict";[ \t]*\n/g, "\n")
}

function textModuleDefine(str){
    str = str.replace('\n','\\\n', 'g').replace('"','\\"', 'g')
    str='define("'+str+'");'
    return str
}
function normalizeModule(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        var moduleName = base + "/" + moduleName;
        
        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            var moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }
    
    return moduleName;
}
function getDeps(str,name) {
    var m = str.match(/^.*?require\((\"[^"]+"|\'[^']+')\)/gm)
    if (!m)
        return []
     
    m1 = []
    for each(var r in m){
        if(!/\s*\/\//.test(r))
            m1.push(r)
    }
    return m1.map(function(r){        
        r=r.slice(r.indexOf("(")+2, -2)
        r = normalizeModule(name, r)
        return r
    })
}

function stripPluginStr(name){
	if (name.substring(0, pluginStr.length) == pluginStr)
		name = name.substr(pluginStr.length)
	return name
}
function makeExplicitDefine(name){
    var str = doNotUseStrict(stripComments(modules[name]||""))
	
	var depStr = deps[name] ? ' ["' + deps[name].join('","') + ']' : '[]'
	var depStr = '[]'
	str = str.replace(/require\((\"[^"]+"|\'[^']+')\)/gm, function(r){
        var i = r.indexOf("(")
        var rel=r.slice(i+2, -2)
        rel = stripPluginStr(rel)
        var abs = normalizeModule(name, rel)
        return r.slice(0, i+2)+abs+r.slice(-2)
    })
	return str.replace('define(', 'define("'+name + '",'+ depStr + ', ')
}
function processModule(name, text){
	text = text.replace(/\r\n|\r/g, "\n") //  \r\n|\r|\n
	var moduleName = stripPluginStr(name)
	if (moduleName != name) {
        var type = "text"
	}
	
	if (type == "text"){
		text = textModuleDefine(text)
		moduleDeps = []
	}else{
		var moduleDeps = getDeps(text, name)
		deps[moduleName] = moduleDeps.map(stripPluginStr)
	}
	modules[moduleName] = text


	loaded[name] = true
	var i = pending.indexOf(name)
	if (i != -1) {
		pending.splice(i, 1)
	}
	moduleDeps.forEach(function(x){
		if(!loaded[x] && pending.indexOf(x)==-1)
			pending.push(x)
	})
	if (pending.length)
		req()
	else
		finishReq()
}
promise = {
	then:function(f){this.pending.push(f);return this},
	now: function(f){this.pending.unshift(f);return this},
	resolve:function(x){var f = this.pending.shift(); f(x)},
	pending: []
}
function req() {
    var name = pending[0]
	var url = pluginStr + stripPluginStr(name)	
	
    try {
        processModule(name, require(url))
    }catch(e){
        require([url], function(x) {
			processModule(name, x);
		})
    }
    return promise
}
function finishReq(){
    var str = ""
    for (var mn in modules){
        str+=makeExplicitDefine(mn).trim()+"\n\n"
    }
    promise.resolve(str)
}

/************************************************************************************/
var modules = {}, deps = {}, pending = [], loaded = {}, pluginStr = "ace/requirejs/text!", files = {}

function makeMain() {
	modules = {}
	pending = ["ace/editor", "ace/virtual_renderer", "ace/undomanager", "ace/theme/textmate", "ace/multi_select"]
	;["html", "xml", "coffee", "c_cpp", "json"].forEach(function(x){pending.push("ace/mode/"+x)})
	
	promise.pending = []
	
	req().then(function(v){
		files["ace"] = v
		promise.resolve()
	})

	var themes = ["chrome.js", "clouds.js", "clouds_midnight.js", "cobalt.js", "crimson_editor.js", "dawn.js", "eclipse.js", "idle_fingers.js", "kr_theme.js", "merbivore.js", "merbivore_soft.js", "mono_industrial.js", "monokai.js", "pastel_on_dark.js", "solarized_dark.js", "solarized_light.js",  "tomorrow.js", "tomorrow_night.js", "tomorrow_night_blue.js", "tomorrow_night_bright.js", "tomorrow_night_eighties.js", "twilight.js", "vibrant_ink.js"]
	function addTheme(){
		var name = themes.shift()
		if (!name)
			return promise.resolve();
		name = name.replace(".js","")
		modules={}
		pending = ["ace/theme/"+name]
		req().now(function(v){
			files["theme-"+name] = v
			promise.now(addTheme)
			promise.resolve()
		})
	}
	promise.then(addTheme)
	
	var keyb = ["emacs", "vim"]
 	function addKeyb(){
		var name = keyb.shift()
		if (!name)
			return promise.resolve();
		name = name.replace(".js","")
		modules={}
		pending = ["ace/keyboard/"+name]
		loaded["ace/keyboard/state_handler"] = false
		req().now(function(v){
			files["keybinding-"+name] = v
			promise.now(addKeyb)
			promise.resolve()
		})
	}
	promise.then(addKeyb)
	
	promise.then(function(v){
		/* var c = document.getElementById("container") */
		var zip = new JSZip();
		for (var i in files) {
			/* c.appendChild(
				document.createElement("div")
			).textContent = i
			c.appendChild(
				document.createElement("textarea")
			).value =  */
			
			zip.add(i + ".js", files[i]);
		}
		/*img = zip.folder("images");
		img.add("smile.gif", imgData, {base64: true});*/
		content = zip.generate();
		location.href="data:application/zip;base64,"+content;			
	})
}

function makeMode(name) {
	
}




