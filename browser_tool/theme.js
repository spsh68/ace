define(function(require, exports, module) {

var Range = require("ace/range").Range;
var util = require("browser_tool/acePlayground")

splitEditor = util.createSplitEditor("editor")

jsTemplate = require("ace/requirejs/text!tool/theme.tmpl.js").replace(/\r/g, "")
cssTemplate = require("ace/requirejs/text!tool/theme.tmpl.css").replace(/\r/g, "")

jsTemplate = stripComments(jsTemplate).trim() + "\n"
function stripComments(str){
    if(str.slice(0,2)=='/*'){
        var j = str.indexOf('*/')+2
        str = str.substr(j)
    }
    return str
}

editor1 = splitEditor.editor0
editor1.setShowPrintMargin(false)
editor1.setSession(util.createDoc("", "", "", "xml"));

editor2 = splitEditor.editor1;
themeDoc = util.createDoc("themeDoc", "convertedTheme", "", "javascript")
util.docs.unshift(util.docs.pop())
editor2.setSession(themeDoc);
setTimeout(function(){editor2.container.className = "ace-new-theme ace_editor";}, 1000)

docEl = document.getElementById("doc");
util.fillDropdown(docEl, util.docs)



timeout = null
schedule = function(){
	if(timeout != null) {
		clearTimeout(timeout)
	}
	timeout = setTimeout(update, 800)
}
editor1.session.on('change', schedule)	

update = function (){
    tmTheme = editor1.session.getValue()

    try{
		jsonTheme = parseTheme(tmTheme)
        styles = extractStyles(jsonTheme);
    }catch(e){
        themeDoc.setValue('error\n'+e)
        return
    }

    styles.cssClass = "ace-new-theme"
    css = fillTemplate(cssTemplate, styles);
    document.getElementById("ace-new-theme").innerHTML = css;

    if(docEl.selectedIndex==0)
        updateThemeDoc()
}

updateThemeDoc = function(){
    name = document.getElementById("name").value
    aceTheme = createTheme(name, styles, cssTemplate, jsTemplate)
    themeDoc.setValue(aceTheme)
}


util.bindDropdown("doc", function(value) {
	var doc = util.docsByName[value];
	if(doc == themeDoc)
		update()

	editor2.setSession(doc);	
});


var textmateThemes = [
	"Active4D.tmTheme",
   "All Hallows Eve.tmTheme",
   "Amy.tmTheme",
   "Blackboard.tmTheme",
   "Brilliance Black.tmTheme",
   "Brilliance Dull.tmTheme",
   "Clouds Midnight.tmTheme",
   "Clouds.tmTheme",
   "Cobalt.tmTheme",
   "Dawn.tmTheme",
   "Eiffel.tmTheme",
   "Espresso Libre.tmTheme",
   "IDLE.tmTheme",
   "LAZY.tmTheme",
   "LICENSE",
   "Mac Classic.tmTheme",
   "MagicWB (Amiga).tmTheme",
   "Merbivore Soft.tmTheme",
   "Merbivore.tmTheme",
   "Monokai.tmTheme",
   "Pastels on Dark.tmTheme",
   "Slush and Poppies.tmTheme",
   "Solarized-dark.tmTheme",
   "Solarized-light.tmTheme",
   "SpaceCadet.tmTheme",
   "Sunburst.tmTheme",
   "Tomorrow-Night-Blue.tmTheme",
   "Tomorrow-Night-Bright.tmTheme",
   "Tomorrow-Night-Eighties.tmTheme",
   "Tomorrow-Night.tmTheme",
   "Tomorrow.tmTheme",
   "Twilight.tmTheme",
   "Vibrant Ink.tmTheme",
   "Zenburnesque.tmTheme",
   "iPlastic.tmTheme",
   "idleFingers.tmTheme",
   "krTheme.tmTheme",
   "monoindustrial.tmTheme"]

util.fillDropdown("themeEl", textmateThemes)

util.bindDropdown("themeEl", function(value) {

	net.get("./tool/tmthemes/" + value, function(x){
		tmTheme = x
		
		var name = value.replace(/\..*$/, "")
		document.getElementById("name").value = name
		if (themes[name]){
		}
		
		editor1.session.doc.setValue(x)
	})
});


});

/*

a=makeReq("file:///C:/Users/LED/Desktop/00/ace/tool/tmthemes/").split("\n")
a.shift();a.shift()
a.map(function(x){
	x= x.match(/ (.*?) /)
	if (x)
		return x[1]
})

*/