/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var event = require("pilot/event");
/**pilot*/
event.addMultiMouseDownListener = function(el, button, count, timeout, callback) {
    var clicks = 0;
    var startX, startY;

    var listener = function(e) {
        clicks += 1;
        if (clicks == 1) {
            startX = e.clientX;
            startY = e.clientY;

            setTimeout(function() {
                clicks = 0;
            }, timeout || 600);
        }

        if (event.getButton(e) != button
          || Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5)
            clicks = 0;

        if (clicks == count) {
            clicks = 0;
            callback(e);
			return event.preventDefault(e);
        }
		console.log(clicks)
    };

    event.addListener(el, "mousedown", listener);
};
/**pilot*/


var MouseHandler = function(editor) {
    this.editor = editor;
	var self = this;
    event.addListener(editor.container, "mousedown", function(e) {
        editor.focus();
        return self.dragState == 'mousedown' || event.preventDefault(e);
    });
    event.addListener(editor.container, "selectstart", function(e) {
        return event.preventDefault(e);
    });
    
    var mouseTarget = editor.renderer.getMouseEventTarget();
    event.addListener(mouseTarget, "mousedown", this.onMouseDown.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 2, 500, this.onMouseDoubleClick.bind(this));
    event.addMultiMouseDownListener(mouseTarget, 0, 3, 600, this.onMouseTripleClick.bind(this));
    event.addMouseWheelListener(mouseTarget, this.onMouseWheel.bind(this));
	

	event.addListener(mouseTarget, "drop", function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);    
        var pos = editor.renderer.screenToTextCoordinates(pageX, pageY);
		console.log(self.dragState,'*******')
		if (self.dragState == 'dragstart'){
			var range = editor.getSelectionRange()
			var l = range.compare(pos.row, pos.column)
			console.log(l)
			if (l==0){
				editor.focus()
				editor.selection.clearSelection(pos.row, pos.column);
				editor.moveCursorToPosition(pos);
				self.dragState = 'drop'
				return event.preventDefault(e);			
			}
			
			if (e.dataTransfer.dropEffect == 'move'&& l<0)
				editor.session.remove(range)
		}
		
		self.dragState = 'drop'
		
		var text = e.dataTransfer.getData('text/plain')
		
		editor.moveCursorToPosition(pos);
		editor.selection.clearSelection(pos.row, pos.column);
		editor.insert(text)
		if (l>0 && e.dataTransfer.dropEffect == 'move')
			editor.session.remove(range)
		editor.selection.setSelectionAnchor(pos.row, pos.column);		
		editor.focus()
		
		return event.preventDefault(e);
    });
	event.addListener(editor.container, "dragstart", function(e){
		e.dataTransfer.setData('text/plain', editor.getCopyText());
		self.dragState = 'dragstart';
		e.dataTransfer.addElement(self.proxy)
	});
	
	var pageX, pageY
	event.addListener(mouseTarget, "dragover", function(e) {
		pageX = event.getDocumentX(e);
		pageY = event.getDocumentY(e);
        return event.preventDefault(e);
    });/*
	event.addListener(mouseTarget, "dragenter", function(e) {
		console.log("dragenter",pageX,pageY)
		event.preventDefault(e)
		var dropIndicator = editor.renderer.$cursorLayer.cursor
        var onSelectionInterval = function() {
            if (pageX === undefined || pageY === undefined)
                return;
    
            var cursor = editor.renderer.screenToTextCoordinates(pageX, pageY);
            
			var cl = editor.renderer.$cursorLayer
			cl.position = cursor
			cl.cursor.style.visibility = "visible";
			var pixelPos = cl.getPixelPosition(true);
			//console.log(pixelPos, cursor)
			cl.cursor.style.left = pixelPos.left + "px";
			cl.cursor.style.top = pixelPos.top + "px"; 
        };
		var timerId = setInterval(onSelectionInterval, 20);	
		var onDragLeave = function(e) {
			console.log("dragleave")
			event.removeListener(mouseTarget, "dragleave", onDragLeave)
			clearInterval(timerId);
		}
		event.addListener(mouseTarget, "dragleave", onDragLeave)
    });*/
};

(function() {

    this.$scrollSpeed = 1;
    this.setScrollSpeed = function(speed) {
        this.$scrollSpeed = speed;
    };
    
    this.getScrollSpeed = function() {
        return this.$scrollSpeed;
    };
	

	
	this.prepareToDrag = function(e, pos){
		var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);
        var editor = this.editor;
		var self = this;
		
		this.dragState = 'mousedown';
		var t=e.target
		t.setAttribute("draggable", true);
		if(!this.proxy){
			this.proxy = document.createElement('div')
			this.proxy.style.cssText = 'position:fixed'
			editor.container.appendChild(this.proxy)
		}
		var onDragEnd = function(e){
			if(self.dragState == 'drop')
				self.dragState = ''					
			else if(e.dataTransfer.dropEffect == 'move'){
				editor.moveCursorToPosition(editor.session.remove(editor.getSelectionRange()));
				editor.clearSelection();
			}
			endDrag(e)
		}
	
		var mousePageX, mousePageY;
		function onMouseMove(e) {            
			mousePageX = event.getDocumentX(e);
			mousePageY = event.getDocumentY(e);
            e.stopPropagation();
        }

        function endDrag(e) {
            document.removeEventListener("mousemove", onMouseMove, true);
            document.removeEventListener("mouseup", endDrag, true);
			event.removeListener(self.proxy, "dragend", onDragEnd)
            onMouseMove(e)
			if(self.dragState == 'mousedown'){
				if (mousePageX !== undefined && mousePageY !== undefined)
					pos = editor.renderer.screenToTextCoordinates(mousePageX, mousePageY);
				editor.moveCursorToPosition(pos)
				editor.selection.clearSelection(pos.row, pos.column);
				console.log(pos)
			}
			self.dragState = ''
			t && t.removeAttribute("draggable")	
        }

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", endDrag, true);
		
		event.addListener(this.proxy, "dragend", onDragEnd)	
		
	};
    
    this.onMouseDown = function(e) {
        var pageX = event.getDocumentX(e);
        var pageY = event.getDocumentY(e);
        var editor = this.editor;
    
        var pos = editor.renderer.screenToTextCoordinates(pageX, pageY);
        pos.row = Math.max(0, Math.min(pos.row, editor.session.getLength()-1));
    
        var button = event.getButton(e)
        var isEmpty = editor.selection.isEmpty()
        if (button != 0) {
            if (isEmpty) {
                editor.moveCursorToPosition(pos);
            }
            if(button == 2) {
                editor.textInput.onContextMenu({x: pageX, y: pageY}, isEmpty);
                event.capture(editor.container, function(){}, editor.textInput.onContextMenuClose);
            }
            return;
        }
    
        if (e.shiftKey)
            editor.selection.selectToPosition(pos)
		else if(!isEmpty && editor.getSelectionRange().contains(pos.row, pos.column)) {
			this.prepareToDrag(e, pos)			
			return event.stopPropagation(e);
		} 
        else {
            editor.moveCursorToPosition(pos);
            if (!editor.$clickSelection)
                editor.selection.clearSelection(pos.row, pos.column);
        }
    
        editor.renderer.scrollCursorIntoView();
    
        var self = this;
        var mousePageX, mousePageY;
    
        var onMouseSelection = function(e) {
            mousePageX = event.getDocumentX(e);
            mousePageY = event.getDocumentY(e);
        };
    
        var onMouseSelectionEnd = function() {
            clearInterval(timerId);
            self.$clickSelection = null;
        };
    
        var onSelectionInterval = function() {
            if (mousePageX === undefined || mousePageY === undefined)
                return;
    
            var cursor = editor.renderer.screenToTextCoordinates(mousePageX, mousePageY);
            cursor.row = Math.max(0, Math.min(cursor.row, editor.session.getLength()-1));
    
            if (self.$clickSelection) {
                if (self.$clickSelection.contains(cursor.row, cursor.column)) {
                    editor.selection.setSelectionRange(self.$clickSelection);
                } else {
                    if (self.$clickSelection.compare(cursor.row, cursor.column) == -1) {
                        var anchor = self.$clickSelection.end;
                    } else {
                        var anchor = self.$clickSelection.start;
                    }
                    editor.selection.setSelectionAnchor(anchor.row, anchor.column);
                    editor.selection.selectToPosition(cursor);
                }
            }
            else {
                editor.selection.selectToPosition(cursor);
            }
    
            editor.renderer.scrollCursorIntoView();
        };
    
        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(onSelectionInterval, 20);
    
        return event.preventDefault(e);
    };
    
    this.onMouseDoubleClick = function(e) {
        this.editor.selection.selectWord();
        this.$clickSelection = this.editor.getSelectionRange();
		this.dragState = '';
    };
    
    this.onMouseTripleClick = function(e) {
        this.editor.selection.selectLine();
        this.$clickSelection = this.editor.getSelectionRange();
		this.dragState = '';
    };
    
    this.onMouseWheel = function(e) {
        var speed = this.$scrollSpeed * 2;
    
        this.editor.renderer.scrollBy(e.wheelX * speed, e.wheelY * speed);
        return event.preventDefault(e);
    };


}).call(MouseHandler.prototype);

exports.MouseHandler = MouseHandler;
});