if (window.require)
	var config = window.require

var define = function(module, deps, payload) {
    if (arguments.length == 2)
        payload = deps;

    if (typeof module !== 'string') {
        console.error('dropping module because define wasn\'t a string.');
        return;
    }
    if(!require.modules[module])
        require.modules[module] = payload;
};

var require = function(module, callback, root) {
	if (typeof  callback === "string" && !root)
		root = callback;

    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(module[i]);
            if (!dep)
                return loadScripts.apply(window, arguments);
            params.push(dep);
        }
        if (callback) {
            callback.apply(null, params);
        }
    }
    else if (typeof module === 'string') {
        var payload = lookup(module);
        if (!payload && _require.original)
            return;

        if (callback)
            callback();

        return payload;
    }
    else {
        if (_require.original)
            return _require.original.apply(window, arguments);
    }
};

require.modules = {};

var lookup = function(moduleName) {
    var module = require.modules[moduleName];
    if (module == null) {
        //console.error('Missing module: ' + moduleName);
        return null;
    }

    if (typeof module === 'function') {
        var exports = {};
        module(require, exports, { id: moduleName, uri: '' });
        // cache the resulting module object for next time
        require.modules[moduleName] = exports;
        return exports;
    }

    return module;
};

var normalizeModule = function(parentId, moduleName) {
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

var lookup = function(parentId, moduleName) {

    moduleName = normalizeModule(parentId, moduleName);

    var module = require.modules[moduleName];
    if (module == null) {
        return null;
    }

    if (typeof module === 'function') {
        var exports = {};
        var mod = {
            id: moduleName, 
            uri: '',
            exports: exports
        }
        
        var req = function(module, callback, root) {
            return require(module, callback, root || moduleName);
        };
        
        var returnValue = module(req, exports, mod);
        exports = returnValue || mod.exports;
            
        // cache the resulting module object for next time
        require.modules[moduleName] = exports;
        return exports;
    }

    return module;
};


