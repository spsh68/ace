CodeMirror.runMode
var mode = CodeMirror.getMode({indentUnit: 2}, "text/css");
string = $0.value
state = CodeMirror.startState(mode);
 var tl=[]
 t=Date.now()

    tt=[]
    var stream = new CodeMirror.StringStream(string);
    while (!stream.eol()) {
      var style = mode.token(stream, state);
      tt.push({value:stream.current(),style:style})
      stream.start = stream.pos;
    }
    
    tl.push(tt)
  
  t-Date.now() 
  //-1999
#>>
var mode = CodeMirror.getMode({indentUnit: 2}, "text/css");
string = $0.value
 var lines = CodeMirror.splitLines(string), state = CodeMirror.startState(mode);
 var tl=[]
 t=Date.now()
  for (var i = 0, e = lines.length; i < e; ++i) {
    tt=[]
    var stream = new CodeMirror.StringStream(lines[i]);
    while (!stream.eol()) {
      var style = mode.token(stream, state);
      tt.push({value:stream.current(),style:style})
      stream.start = stream.pos;
    }
    
    tl.push(tt)
  }
  t-Date.now() 
  //-2244
#>>
tokenizer = env.editor.session.$mode.$tokenizer
rows=[]
var lines = env.editor.session.doc.$lines
lastRow = lines.length
t=Date.now()
for (var row=0; row<=lastRow; row++) {
        var tokens = tokenizer.getLineTokens(lines[row] || "", state);
        var state = tokens.state;
        rows.push(tokens);
}
t-Date.now()  
//-299