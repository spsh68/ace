define(function(require, exports, module) {
  
    net = require("ace/lib/net");
    dom = require("ace/lib/dom");
    event = require("ace/lib/event");
    Range = require("ace/range").Range;
    Editor = require("ace/editor").Editor;
    Renderer = require("ace/virtual_renderer").VirtualRenderer;
    theme = require("ace/theme/textmate");
    EditSession = require("ace/edit_session").EditSession;
    UndoManager = require("ace/undomanager").UndoManager;


exports.docs = [];
var docsByName = exports.docsByName = {};
exports.modes = [];
var modesByName = exports.modesByName = {};

exports.createDoc = function(name, desc, file, mode) {
    var doc = new EditSession(file||"");
    doc.name = name;
    doc.desc = desc;
    doc.setMode(modesByName[mode||name]||modesByName["text"]);
    doc.setUndoManager(new UndoManager());
	
	if (name) {
		exports.docs.push(doc)
		exports.docsByName[doc.name] = doc
	}
	return doc
};
exports.removeDoc = function(name) {
}

exports.WrappedDoc = function(name, desc, file) {
    var doc = createDoc.apply(this, arguments);
   // doc.setUseWrapMode(true);
   // doc.setWrapLimitRange(80, 80);
	return doc
};

exports.Mode = function(name, desc, clazz, extensions) {
	clazz = clazz.Mode
	clazz.prototype.createWorker = function(){};
	clazz.prototype.supportsFile = function(filename) {
		return filename.match(this.extRe);
	};
	
	var mode = new clazz();
    mode.name = name;
    mode.desc = desc;
    mode.clazz = clazz;
    
    mode.extRe = new RegExp("^.*\\.(" + extensions.join("|") + ")$", "g");
	
	exports.modes.push(mode)
	exports.modesByName[mode.name] = mode
	
	return mode
};

// Modes //{
    exports.Mode("c_cpp", "C/C++", require("ace/mode/c_cpp"), ["c", "cpp", "cxx", "h", "hpp"]),
    exports.Mode("clojure", "Clojure", require("ace/mode/clojure"), ["clj"]),
    exports.Mode("coffee", "CoffeeScript", require("ace/mode/coffee"), ["coffee"]),
    exports.Mode("coldfusion", "ColdFusion", require("ace/mode/coldfusion"), ["cfm"]),
    exports.Mode("csharp", "C#", require("ace/mode/csharp"), ["cs"]),
    exports.Mode("css", "CSS", require("ace/mode/css"), ["css"]),
    exports.Mode("groovy", "Groovy", require("ace/mode/groovy"), ["groovy"]),
    exports.Mode("haxe", "haXe", require("ace/mode/haxe"), ["hx"]),
    exports.Mode("html", "HTML", require("ace/mode/html"), ["html", "htm"]),
    exports.Mode("java", "Java", require("ace/mode/java"), ["java"]),
    exports.Mode("javascript", "JavaScript", require("ace/mode/javascript"), ["js"]),
    exports.Mode("json", "JSON", require("ace/mode/json"), ["json"]),
    exports.Mode("latex", "LaTeX", require("ace/mode/latex"), ["tex"]),
    exports.Mode("lua", "Lua", require("ace/mode/lua"), ["lua"]),
    exports.Mode("markdown", "MarkDown", require("ace/mode/markdown"), ["md", "markdown"]),
    exports.Mode("ocaml", "OCaml", require("ace/mode/ocaml"), ["ml", "mli"]),
    exports.Mode("perl", "Perl", require("ace/mode/perl"), ["pl", "pm"]),
    exports.Mode("php", "PHP",require("ace/mode/php"), ["php"]),
    exports.Mode("powershell", "Powershell", require("ace/mode/powershell"), ["ps1"]),
    exports.Mode("python", "Python", require("ace/mode/python"), ["py"]),
    exports.Mode("scala", "Scala", require("ace/mode/scala"), ["scala"]),
    exports.Mode("scss", "SCSS", require("ace/mode/scss"), ["scss"]),
    exports.Mode("ruby", "Ruby", require("ace/mode/ruby"), ["rb"]),
    exports.Mode("sql", "SQL", require("ace/mode/sql"), ["sql"]),
    exports.Mode("svg", "SVG", require("ace/mode/SVG"), ["svg"]),
    exports.Mode("text", "Text", require("ace/mode/text"), ["txt"]),
    exports.Mode("textile", "Textile", require("ace/mode/textile"), ["textile"]),
    exports.Mode("xml", "XML", require("ace/mode/xml"), ["xml"])
//}
// sessions //{
	exports.createDoc("javascript", "JavaScript", require("ace/requirejs/text!demo/kitchen-sink/docs/javascript.js")),
	exports.createDoc("text", "Plain Text", require("ace/requirejs/text!demo/kitchen-sink/docs/plaintext.txt")),
	exports.createDoc("coffee", "Coffeescript", require("ace/requirejs/text!demo/kitchen-sink/docs/coffeescript.coffee")),
	exports.createDoc("json", "JSON", require("ace/requirejs/text!demo/kitchen-sink/docs/json.json")),
	exports.createDoc("css", "CSS", require("ace/requirejs/text!demo/kitchen-sink/docs/css.css")),
	exports.createDoc("scss", "SCSS", require("ace/requirejs/text!demo/kitchen-sink/docs/scss.scss")),
	exports.createDoc("html", "HTML", require("ace/requirejs/text!demo/kitchen-sink/docs/html.html")),
	exports.createDoc("xml", "XML", require("ace/requirejs/text!demo/kitchen-sink/docs/xml.xml")),
	exports.createDoc("svg", "SVG", require("ace/requirejs/text!demo/kitchen-sink/docs/svg.svg")),
	exports.createDoc("php", "PHP", require("ace/requirejs/text!demo/kitchen-sink/docs/php.php")),
	exports.createDoc("coldfusion", "ColdFusion", require("ace/requirejs/text!demo/kitchen-sink/docs/coldfusion.cfm")),
	exports.createDoc("python", "Python", require("ace/requirejs/text!demo/kitchen-sink/docs/python.py")),
	exports.createDoc("ruby", "Ruby", require("ace/requirejs/text!demo/kitchen-sink/docs/ruby.rb")),
	exports.createDoc("perl", "Perl", require("ace/requirejs/text!demo/kitchen-sink/docs/perl.pl")),
	exports.createDoc("ocaml", "OCaml", require("ace/requirejs/text!demo/kitchen-sink/docs/ocaml.ml")),
	exports.createDoc("lua", "Lua", require("ace/requirejs/text!demo/kitchen-sink/docs/lua.lua")),
	exports.createDoc("java", "Java", require("ace/requirejs/text!demo/kitchen-sink/docs/java.java")),
	exports.createDoc("clojure", "Clojure", require("ace/requirejs/text!demo/kitchen-sink/docs/clojure.clj")),
	exports.createDoc("groovy", "Groovy", require("ace/requirejs/text!demo/kitchen-sink/docs/groovy.groovy")),
	exports.createDoc("scala", "Scala", require("ace/requirejs/text!demo/kitchen-sink/docs/scala.scala")),
	exports.createDoc("csharp", "C#", require("ace/requirejs/text!demo/kitchen-sink/docs/csharp.cs")),
	exports.createDoc("powershell", "Powershell", require("ace/requirejs/text!demo/kitchen-sink/docs/powershell.ps1")),
	exports.createDoc("c_cpp", "C/C++", require("ace/requirejs/text!demo/kitchen-sink/docs/cpp.cpp")),
	exports.createDoc("haxe", "haXe", require("ace/requirejs/text!demo/kitchen-sink/docs/Haxe.hx")),
	exports.createDoc("markdown", "Markdown", require("ace/requirejs/text!demo/kitchen-sink/docs/markdown.md")),
	exports.createDoc("textile", "Textile", require("ace/requirejs/text!demo/kitchen-sink/docs/textile.textile")),
	exports.createDoc("latex", "LaTeX", require("ace/requirejs/text!demo/kitchen-sink/docs/latex.tex"))
//}

exports.edit = function(el) {
	if (typeof(el) == "string")
		el = document.getElementById(el);

	var editor = new Editor(new Renderer(el, require("ace/theme/textmate")));

	editor.resize();
	event.addListener(window, "resize", function() {
		editor.resize();
	});
	return editor;
};


var Split = function(){

};
(function(){
	this.execute = function(options) {
        this.$u.execute(options);
    };

}).call(Split.prototype);

var SplitRoot = function(el, theme, position, getSize) {
	dom.importCssString("\
splitter {\
	border: 1px solid #C6C6D2;\
	width: 0px;\
	cursor: ew-resize;\
	z-index:1}\
splitter:hover {\
	margin-left: -2px;\
	width:3px;\
	border-color: #B5B4E0;\
}\
", "splitEditor")

	el.style.position = position || "relative";
	this.container = el
	this.getSize = getSize || this.getSize
	this.resize = this.$resize.bind(this)
	
	event.addListener(el.ownerDocument.defaultView, "resize", this.resize);
	this.editor = this.createEditor()
};
(function(){
	this.createEditor = function() {
        var el = document.createElement("div");
        el.className = this.$editorCSS;
        el.style.cssText = "position: absolute; top:0px; bottom:0px";
        this.$container.appendChild(el);
        var session = new EditSession("");
        var editor = new Editor(new Renderer(el, this.$theme));

        /*editor.on("focus", function() {
            this._emit("focus", editor);
        }.bind(this));*/

        this.$editors.push(editor);
        editor.setFontSize(this.$fontSize);
        return editor;
    };
	this.$resize = function() {
		var size = this.getSize(this.container);
		this.rect = {
			x: size.left,
			y: size.top,
			w: size.width,
			h: size.height,
		}
		this.item.resize(this.rect)
	};
	this.getSize = function(el) {
		return el.getBoundingClientRect()
    };
	this.destroy = function() {
		var win = this.container.ownerDocument.defaultView;
		event.removeListener(win, "resize", this.resize);
    };

}).call(SplitRoot.prototype);


exports.createSplitEditor = function(el) {
	if (typeof(el) == "string")
		el = document.getElementById(el);

	dom.importCssString("\
	splitter {\
		border: 1px solid #C6C6D2;\
		width: 0px;\
		cursor: ew-resize;\
		z-index:1}\
	splitter:hover {\
		margin-left: -2px;\
		width:3px;\
		border-color: #B5B4E0;\
	}\
	", "splitEditor")
	var e0 = document.createElement("div");
	var s = document.createElement("splitter");
	var e1 = document.createElement("div");
	el.appendChild(e0)
	el.appendChild(e1)
	el.appendChild(s)
	e0.style.position = e1.style.position = s.style.position = "absolute";
	el.style.position = "relative"
	var split = {$container: el};
	
	split.editor0 = split[0] = new Editor(new Renderer(e0, require("ace/theme/textmate")));
	split.editor1 = split[1] = new Editor(new Renderer(e1, require("ace/theme/textmate")));
	split.splitter = s
	
	s.ratio = 0.5
	
	split.resize = function resize(){
		var height = el.parentNode.clientHeight - el.offsetTop;
		var total = el.clientWidth;
		var w1 = total * s.ratio
		var w2 = total * (1- s.ratio)
		s.style.left = w1 - 1 + "px";
		s.style.height = el.style.height = height + "px";
		
		var st0 = split[0].container.style
		var st1 = split[1].container.style
		st0.width = w1 + "px";
		st1.width = w2 + "px";
		st0.left = 0 + "px";
		st1.left = w1 + "px";
		
		st0.top = st1.top = "0px";
		st0.height = st1.height = height + "px";		
		
		split[0].resize();
		split[1].resize();
	}
	
	split.onMouseDown = function(e) {
		var rect = el.getBoundingClientRect()
        var x = e.clientX;
        var y = e.clientY;
        
        var button = e.button;
        if (button !== 0) {
            return;
        }

        var onMouseMove = function(e) {
            x = e.clientX;
			y = e.clientY;
        };
		var onResizeEnd = function(e) {
            clearInterval(timerId);
        };

        var onResizeInterval = function() {
			s.ratio = (x - rect.left) / rect.width            
			split.resize()
        };

        event.capture(s, onMouseMove, onResizeEnd);
        var timerId = setInterval(onResizeInterval, 40);

        return e.preventDefault();
    };
 

	
	event.addListener(s, "mousedown", split.onMouseDown);
	event.addListener(window, "resize", split.resize);
	split.resize()
	return split;
}

/***************************/
exports.bindDropdown = function(el, callback, noInit) {
	if (typeof el == "string")
		el = document.getElementById(el);
	var onChange = function() {
		callback(el.value);
	};
	el.onchange = onChange;
	noInit || onChange();
}

exports.fillDropdown = function(el, list){
	if (typeof el == "string")
		el = document.getElementById(el);
	list.forEach(function(item) {
		var option = document.createElement("option");
		option.setAttribute("value", item.name || item);
		option.innerHTML = item.desc || item;
		el.appendChild(option);
	});
}
/***************************/
exports.stripLeadingComments = function(str) {
    if(str.slice(0,2)=='/*'){
        var j = str.indexOf('*/')+2
        str = str.substr(j)
    }
    return str.trim() + "\n"
}

});