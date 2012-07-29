define(function(require, exports, module) {


require("marked/marked")
var Range = require("ace/range").Range;
var util = require("browser_tool/acePlayground")

splitEditor = util.createSplitEditor("editor")



editor1 = splitEditor.editor0
editor1.setShowPrintMargin(false)
editor1.setSession(util.docsByName.markdown);

editor2 = splitEditor.editor1;
var c = editor2.container
editor2.destroy()
c.className = "markdown-body" 
c = c.cloneNode(false)
editor2.container.parentNode.replaceChild(c, editor2.container)

editor2 = splitEditor.editor1 = splitEditor[1] ={
	container:c,
	resize:	function(){}
}


timeout = null
schedule = function schedule(){
	if(timeout != null) {
		clearTimeout(timeout)
	}
	timeout = setTimeout(update, 800)
}
editor1.session.on('change', schedule)	

update = function update(){
    md = editor1.session.getValue()

    editor2.container.innerHTML = marked.parse(md)
}

schedule()





});
