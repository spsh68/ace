define(function(require, exports, module) {

require("ace/layer/text").Text.prototype.$textToken={}
tooltip = {}
tooltip.node = document.documentElement.appendChild(document.createElement("div"))
var st = tooltip.node.style
st.position = "fixed"
st.display = "none"
st.background = "lightyellow"
st.borderRadius = "3px"
st.border = "1px solid blue"
st.padding = "1px"
st.zIndex = 1000;

tooltip.attach = function(editor){
	editor.tooltip = this
	tooltip.oldTarget = tooltip.node
	event.addListener(editor.container, "mousemove", function(e){
		var n = tooltip.node
		var st = n.style
		st.left = e.clientX + 10 + "px"
		st.top = e.clientY + 10 + "px"
		
	})
	event.addListener(editor.container, "mouseout", function(e){
		tooltip.node.style.display = "none"	
		//tooltip.oldTarget.style.outline = ""
	})
	event.addListener(editor.container, "mouseover", function(e){
		tooltip.node.style.display = ""
		tooltip.oldTarget.style.outline = ""
		tooltip.oldTarget = e.target
		if (tooltip.oldTarget.nodeName != "SPAN")
			return
		var st = e.target.style
		st.outline = "1px solid lime"
		st.outlineOffset = "-1px"
		
		tooltip.node.textContent = e.target.className.trim().replace(/\s+/g,".").replace(/ace_/g,"")
	})
}


var Range = require("ace/range").Range;
var util = require("browser_tool/acePlayground")

splitEditor = util.createSplitEditor("editor")

jsTemplate = require("ace/requirejs/text!tool/theme.tmpl.js").replace(/\r/g, "")
cssTemplate = require("ace/requirejs/text!tool/theme.tmpl.css").replace(/\r/g, "")

jsTemplate = util.stripLeadingComments(jsTemplate).trim() + "\n"


editor1 = splitEditor.editor0
editor1.setShowPrintMargin(false)
editor1.setSession(util.createDoc("", "", "", "javascript"));

editor2 = splitEditor.editor1;
editor2.setSession(util.docsByName.javascript);

tooltip.attach(editor2)


timeout = null
schedule = function(){
	if(timeout != null) {
		clearTimeout(timeout)
	}
	timeout = setTimeout(update, 800)
}
editor1.session.on('change', schedule)	

update = function (){
	eval(editor1.session.getValue())
	rules = require(modePath)
	rules = rules[Object.keys(rules)[0]]
	var Tokenizer = require("ace/tokenizer").Tokenizer;
	tk = new Tokenizer(new rules().getRules());
	editor2.session.bgTokenizer.setTokenizer(tk)
}


docEl = document.getElementById("doc");
util.fillDropdown(docEl, util.docs)
util.bindDropdown("doc", function(value) {
	var doc = util.docsByName[value];
	editor2.setSession(doc);
});


var highlightRuleNames = 
["c_cpp_highlight_rules.js"
,"clojure_highlight_rules.js"
,"coffee_highlight_rules.js"
,"coldfusion_highlight_rules.js"
,"csharp_highlight_rules.js"
,"css_highlight_rules.js"
,"doc_comment_highlight_rules.js"
,"groovy_highlight_rules.js"
,"haxe_highlight_rules.js"
,"html_highlight_rules.js"
,"java_highlight_rules.js"
,"javascript_highlight_rules.js"
,"json_highlight_rules.js"
,"latex_highlight_rules.js"
,"lua_highlight_rules.js"
,"markdown_highlight_rules.js"
,"ocaml_highlight_rules.js"
,"perl_highlight_rules.js"
,"php_highlight_rules.js"
,"powershell_highlight_rules.js"
,"python_highlight_rules.js"
,"regexp_highlight_rules.js"
,"ruby_highlight_rules.js"
,"scad_highlight_rules.js"
,"scala_highlight_rules.js"
,"scss_highlight_rules.js"
,"sql_highlight_rules.js"
,"svg_highlight_rules.js"
,"text_highlight_rules.js"
,"textile_highlight_rules.js"
,"xml_highlight_rules.js"
]
highlightRules = {}

modeEl = document.getElementById("modeEl");
util.fillDropdown(modeEl, highlightRuleNames)
util.bindDropdown(modeEl, function(value) {
	net.get("../ace/lib/ace/mode/" + value, function(x){
		ruleText = util.stripLeadingComments(x)		
		var desc = value.replace(/\..*$/, "")
		
		modePath = "ace/mode/"+value
		
		ruleText = ruleText.replace("define(", 'define("'+ modePath +'", ')
		
		//editor1.setSession(util.createDoc("", desc, ruleText, "javascript"))
		editor1.session.doc.setValue(ruleText);

	})
	//editor1.setSession(sessions1);
}, "noInit");




tablist = document.getElementById("tablist")
setTabs = function(sessions){
	tablist.innerHTML = ""
	sessions.forEach(addTab)
}
addTab = function(session){
	var el = document.createElement("button")
	el.textContent = session.desc
	el.session = session
	tablist.appendChild(el)
}
event.addListener(tablist, "click", function(e){
	editor1.setSession(e.target.session);
})

});

/*

a=makeReq("file:///G:/javascript/ace/ace/lib/ace/mode/").split("\n")
a.shift();a.shift()
a=a.map(function(x){
    x= x.match(/ (.*?) /)
	if (x)
		return x[1]
})

a.forEach(function(x){
    if(/highlight/.test(x))
        jn.say(x)
})
*/