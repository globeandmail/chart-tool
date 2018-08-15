/* Chart Tool v1.3.0-0 | https://github.com/globeandmail/chart-tool | MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ChartToolInit = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.5.7' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document$1 = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && _has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? _ctx(out, _global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var _library = true;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: _library ? 'pure' : 'global',
	  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var f$1 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$1
	};

	var f$2 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$2
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// 19.1.2.1 Object.assign(target, source, ...)





	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	var _objectAssign = !$assign || _fails(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = _toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = _objectGops.f;
	  var isEnum = _objectPie.f;
	  while (aLen > index) {
	    var S = _iobject(arguments[index++]);
	    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;

	// 19.1.3.1 Object.assign(target, source)


	_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

	var assign = _core.Object.assign;

	var isMobile = createCommonjsModule(function (module) {
	/**
	 * isMobile.js v0.4.1
	 *
	 * A simple library to detect Apple phones and tablets,
	 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
	 * and any kind of seven inch device, via user agent sniffing.
	 *
	 * @author: Kai Mallea (kmallea@gmail.com)
	 *
	 * @license: http://creativecommons.org/publicdomain/zero/1.0/
	 */
	(function (global) {

	    var apple_phone         = /iPhone/i,
	        apple_ipod          = /iPod/i,
	        apple_tablet        = /iPad/i,
	        android_phone       = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, // Match 'Android' AND 'Mobile'
	        android_tablet      = /Android/i,
	        amazon_phone        = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
	        amazon_tablet       = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
	        windows_phone       = /Windows Phone/i,
	        windows_tablet      = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, // Match 'Windows' AND 'ARM'
	        other_blackberry    = /BlackBerry/i,
	        other_blackberry_10 = /BB10/i,
	        other_opera         = /Opera Mini/i,
	        other_chrome        = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
	        other_firefox       = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i, // Match 'Firefox' AND 'Mobile'
	        seven_inch = new RegExp(
	            '(?:' +         // Non-capturing group

	            'Nexus 7' +     // Nexus 7

	            '|' +           // OR

	            'BNTV250' +     // B&N Nook Tablet 7 inch

	            '|' +           // OR

	            'Kindle Fire' + // Kindle Fire

	            '|' +           // OR

	            'Silk' +        // Kindle Fire, Silk Accelerated

	            '|' +           // OR

	            'GT-P1000' +    // Galaxy Tab 7 inch

	            ')',            // End non-capturing group

	            'i');           // Case-insensitive matching

	    var match = function(regex, userAgent) {
	        return regex.test(userAgent);
	    };

	    var IsMobileClass = function(userAgent) {
	        var ua = userAgent || navigator.userAgent;

	        // Facebook mobile app's integrated browser adds a bunch of strings that
	        // match everything. Strip it out if it exists.
	        var tmp = ua.split('[FBAN');
	        if (typeof tmp[1] !== 'undefined') {
	            ua = tmp[0];
	        }

	        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
	        // iPhone" string. Same probable happens on other tablet platforms.
	        // This will confuse detection so strip it out if it exists.
	        tmp = ua.split('Twitter');
	        if (typeof tmp[1] !== 'undefined') {
	            ua = tmp[0];
	        }

	        this.apple = {
	            phone:  match(apple_phone, ua),
	            ipod:   match(apple_ipod, ua),
	            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
	            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
	        };
	        this.amazon = {
	            phone:  match(amazon_phone, ua),
	            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
	            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
	        };
	        this.android = {
	            phone:  match(amazon_phone, ua) || match(android_phone, ua),
	            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
	            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
	        };
	        this.windows = {
	            phone:  match(windows_phone, ua),
	            tablet: match(windows_tablet, ua),
	            device: match(windows_phone, ua) || match(windows_tablet, ua)
	        };
	        this.other = {
	            blackberry:   match(other_blackberry, ua),
	            blackberry10: match(other_blackberry_10, ua),
	            opera:        match(other_opera, ua),
	            firefox:      match(other_firefox, ua),
	            chrome:       match(other_chrome, ua),
	            device:       match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
	        };
	        this.seven_inch = match(seven_inch, ua);
	        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

	        // excludes 'other' devices and ipods, targeting touchscreen phones
	        this.phone = this.apple.phone || this.android.phone || this.windows.phone;

	        // excludes 7 inch devices, classifying as phone or tablet is left to the user
	        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

	        if (typeof window === 'undefined') {
	            return this;
	        }
	    };

	    var instantiate = function() {
	        var IM = new IsMobileClass();
	        IM.Class = IsMobileClass;
	        return IM;
	    };

	    if (module.exports && typeof window === 'undefined') {
	        //node
	        module.exports = IsMobileClass;
	    } else if (module.exports && typeof window !== 'undefined') {
	        //browserify
	        module.exports = instantiate();
	    } else {
	        global.isMobile = instantiate();
	    }

	})(commonjsGlobal);
	});

	function ascending(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector(compare) {
	  if (compare.length === 1) compare = ascendingComparator(compare);
	  return {
	    left: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) < 0) lo = mid + 1;
	        else hi = mid;
	      }
	      return lo;
	    },
	    right: function(a, x, lo, hi) {
	      if (lo == null) lo = 0;
	      if (hi == null) hi = a.length;
	      while (lo < hi) {
	        var mid = lo + hi >>> 1;
	        if (compare(a[mid], x) > 0) hi = mid;
	        else lo = mid + 1;
	      }
	      return lo;
	    }
	  };
	}

	function ascendingComparator(f) {
	  return function(d, x) {
	    return ascending(f(d), x);
	  };
	}

	var ascendingBisect = bisector(ascending);
	var bisectRight = ascendingBisect.right;

	function extent(values, valueof) {
	  var n = values.length,
	      i = -1,
	      value,
	      min,
	      max;

	  if (valueof == null) {
	    while (++i < n) { // Find the first comparable value.
	      if ((value = values[i]) != null && value >= value) {
	        min = max = value;
	        while (++i < n) { // Compare the remaining values.
	          if ((value = values[i]) != null) {
	            if (min > value) min = value;
	            if (max < value) max = value;
	          }
	        }
	      }
	    }
	  }

	  else {
	    while (++i < n) { // Find the first comparable value.
	      if ((value = valueof(values[i], i, values)) != null && value >= value) {
	        min = max = value;
	        while (++i < n) { // Compare the remaining values.
	          if ((value = valueof(values[i], i, values)) != null) {
	            if (min > value) min = value;
	            if (max < value) max = value;
	          }
	        }
	      }
	    }
	  }

	  return [min, max];
	}

	function range(start, stop, step) {
	  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	  var i = -1,
	      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	      range = new Array(n);

	  while (++i < n) {
	    range[i] = start + i * step;
	  }

	  return range;
	}

	var e10 = Math.sqrt(50),
	    e5 = Math.sqrt(10),
	    e2 = Math.sqrt(2);

	function ticks(start, stop, count) {
	  var reverse,
	      i = -1,
	      n,
	      ticks,
	      step;

	  stop = +stop, start = +start, count = +count;
	  if (start === stop && count > 0) return [start];
	  if (reverse = stop < start) n = start, start = stop, stop = n;
	  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

	  if (step > 0) {
	    start = Math.ceil(start / step);
	    stop = Math.floor(stop / step);
	    ticks = new Array(n = Math.ceil(stop - start + 1));
	    while (++i < n) ticks[i] = (start + i) * step;
	  } else {
	    start = Math.floor(start * step);
	    stop = Math.ceil(stop * step);
	    ticks = new Array(n = Math.ceil(start - stop + 1));
	    while (++i < n) ticks[i] = (start - i) / step;
	  }

	  if (reverse) ticks.reverse();

	  return ticks;
	}

	function tickIncrement(start, stop, count) {
	  var step = (stop - start) / Math.max(0, count),
	      power = Math.floor(Math.log(step) / Math.LN10),
	      error = step / Math.pow(10, power);
	  return power >= 0
	      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
	      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
	}

	function tickStep(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10) step1 *= 10;
	  else if (error >= e5) step1 *= 5;
	  else if (error >= e2) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	function max$1(values, valueof) {
	  var n = values.length,
	      i = -1,
	      value,
	      max;

	  if (valueof == null) {
	    while (++i < n) { // Find the first comparable value.
	      if ((value = values[i]) != null && value >= value) {
	        max = value;
	        while (++i < n) { // Compare the remaining values.
	          if ((value = values[i]) != null && value > max) {
	            max = value;
	          }
	        }
	      }
	    }
	  }

	  else {
	    while (++i < n) { // Find the first comparable value.
	      if ((value = valueof(values[i], i, values)) != null && value >= value) {
	        max = value;
	        while (++i < n) { // Compare the remaining values.
	          if ((value = valueof(values[i], i, values)) != null && value > max) {
	            max = value;
	          }
	        }
	      }
	    }
	  }

	  return max;
	}

	function min$2(values, valueof) {
	  var n = values.length,
	      i = -1,
	      value,
	      min;

	  if (valueof == null) {
	    while (++i < n) { // Find the first comparable value.
	      if ((value = values[i]) != null && value >= value) {
	        min = value;
	        while (++i < n) { // Compare the remaining values.
	          if ((value = values[i]) != null && min > value) {
	            min = value;
	          }
	        }
	      }
	    }
	  }

	  else {
	    while (++i < n) { // Find the first comparable value.
	      if ((value = valueof(values[i], i, values)) != null && value >= value) {
	        min = value;
	        while (++i < n) { // Compare the remaining values.
	          if ((value = valueof(values[i], i, values)) != null && min > value) {
	            min = value;
	          }
	        }
	      }
	    }
	  }

	  return min;
	}

	var prefix = "$";

	function Map() {}

	Map.prototype = map$1.prototype = {
	  constructor: Map,
	  has: function(key) {
	    return (prefix + key) in this;
	  },
	  get: function(key) {
	    return this[prefix + key];
	  },
	  set: function(key, value) {
	    this[prefix + key] = value;
	    return this;
	  },
	  remove: function(key) {
	    var property = prefix + key;
	    return property in this && delete this[property];
	  },
	  clear: function() {
	    for (var property in this) if (property[0] === prefix) delete this[property];
	  },
	  keys: function() {
	    var keys = [];
	    for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
	    return keys;
	  },
	  values: function() {
	    var values = [];
	    for (var property in this) if (property[0] === prefix) values.push(this[property]);
	    return values;
	  },
	  entries: function() {
	    var entries = [];
	    for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
	    return entries;
	  },
	  size: function() {
	    var size = 0;
	    for (var property in this) if (property[0] === prefix) ++size;
	    return size;
	  },
	  empty: function() {
	    for (var property in this) if (property[0] === prefix) return false;
	    return true;
	  },
	  each: function(f) {
	    for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
	  }
	};

	function map$1(object, f) {
	  var map = new Map;

	  // Copy constructor.
	  if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

	  // Index array by numeric index or specified key function.
	  else if (Array.isArray(object)) {
	    var i = -1,
	        n = object.length,
	        o;

	    if (f == null) while (++i < n) map.set(i, object[i]);
	    else while (++i < n) map.set(f(o = object[i], i, object), o);
	  }

	  // Convert object to map.
	  else if (object) for (var key in object) map.set(key, object[key]);

	  return map;
	}

	function Set$1() {}

	var proto = map$1.prototype;

	Set$1.prototype = set.prototype = {
	  constructor: Set$1,
	  has: proto.has,
	  add: function(value) {
	    value += "";
	    this[prefix + value] = value;
	    return this;
	  },
	  remove: proto.remove,
	  clear: proto.clear,
	  values: proto.keys,
	  size: proto.size,
	  empty: proto.empty,
	  each: proto.each
	};

	function set(object, f) {
	  var set = new Set$1;

	  // Copy constructor.
	  if (object instanceof Set$1) object.each(function(value) { set.add(value); });

	  // Otherwise, assume it’s an array.
	  else if (object) {
	    var i = -1, n = object.length;
	    if (f == null) while (++i < n) set.add(object[i]);
	    else while (++i < n) set.add(f(object[i], i, object));
	  }

	  return set;
	}

	var array$1 = Array.prototype;

	var map$2 = array$1.map;
	var slice$1 = array$1.slice;

	var implicit = {name: "implicit"};

	function ordinal(range) {
	  var index = map$1(),
	      domain = [],
	      unknown = implicit;

	  range = range == null ? [] : slice$1.call(range);

	  function scale(d) {
	    var key = d + "", i = index.get(key);
	    if (!i) {
	      if (unknown !== implicit) return unknown;
	      index.set(key, i = domain.push(d));
	    }
	    return range[(i - 1) % range.length];
	  }

	  scale.domain = function(_) {
	    if (!arguments.length) return domain.slice();
	    domain = [], index = map$1();
	    var i = -1, n = _.length, d, key;
	    while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
	    return scale;
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range = slice$1.call(_), scale) : range.slice();
	  };

	  scale.unknown = function(_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  scale.copy = function() {
	    return ordinal()
	        .domain(domain)
	        .range(range)
	        .unknown(unknown);
	  };

	  return scale;
	}

	function band() {
	  var scale = ordinal().unknown(undefined),
	      domain = scale.domain,
	      ordinalRange = scale.range,
	      range$$1 = [0, 1],
	      step,
	      bandwidth,
	      round = false,
	      paddingInner = 0,
	      paddingOuter = 0,
	      align = 0.5;

	  delete scale.unknown;

	  function rescale() {
	    var n = domain().length,
	        reverse = range$$1[1] < range$$1[0],
	        start = range$$1[reverse - 0],
	        stop = range$$1[1 - reverse];
	    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
	    if (round) step = Math.floor(step);
	    start += (stop - start - step * (n - paddingInner)) * align;
	    bandwidth = step * (1 - paddingInner);
	    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
	    var values = range(n).map(function(i) { return start + step * i; });
	    return ordinalRange(reverse ? values.reverse() : values);
	  }

	  scale.domain = function(_) {
	    return arguments.length ? (domain(_), rescale()) : domain();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range$$1 = [+_[0], +_[1]], round = true, rescale();
	  };

	  scale.bandwidth = function() {
	    return bandwidth;
	  };

	  scale.step = function() {
	    return step;
	  };

	  scale.round = function(_) {
	    return arguments.length ? (round = !!_, rescale()) : round;
	  };

	  scale.padding = function(_) {
	    return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
	  };

	  scale.paddingInner = function(_) {
	    return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
	  };

	  scale.paddingOuter = function(_) {
	    return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
	  };

	  scale.align = function(_) {
	    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
	  };

	  scale.copy = function() {
	    return band()
	        .domain(domain())
	        .range(range$$1)
	        .round(round)
	        .paddingInner(paddingInner)
	        .paddingOuter(paddingOuter)
	        .align(align);
	  };

	  return rescale();
	}

	function pointish(scale) {
	  var copy = scale.copy;

	  scale.padding = scale.paddingOuter;
	  delete scale.paddingInner;
	  delete scale.paddingOuter;

	  scale.copy = function() {
	    return pointish(copy());
	  };

	  return scale;
	}

	function point() {
	  return pointish(band().paddingInner(1));
	}

	function define(constructor, factory, prototype) {
	  constructor.prototype = factory.prototype = prototype;
	  prototype.constructor = constructor;
	}

	function extend(parent, definition) {
	  var prototype = Object.create(parent.prototype);
	  for (var key in definition) prototype[key] = definition[key];
	  return prototype;
	}

	function Color() {}

	var darker = 0.7;
	var brighter = 1 / darker;

	var reI = "\\s*([+-]?\\d+)\\s*",
	    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
	    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
	    reHex3 = /^#([0-9a-f]{3})$/,
	    reHex6 = /^#([0-9a-f]{6})$/,
	    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
	    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
	    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
	    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
	    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
	    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

	var named = {
	  aliceblue: 0xf0f8ff,
	  antiquewhite: 0xfaebd7,
	  aqua: 0x00ffff,
	  aquamarine: 0x7fffd4,
	  azure: 0xf0ffff,
	  beige: 0xf5f5dc,
	  bisque: 0xffe4c4,
	  black: 0x000000,
	  blanchedalmond: 0xffebcd,
	  blue: 0x0000ff,
	  blueviolet: 0x8a2be2,
	  brown: 0xa52a2a,
	  burlywood: 0xdeb887,
	  cadetblue: 0x5f9ea0,
	  chartreuse: 0x7fff00,
	  chocolate: 0xd2691e,
	  coral: 0xff7f50,
	  cornflowerblue: 0x6495ed,
	  cornsilk: 0xfff8dc,
	  crimson: 0xdc143c,
	  cyan: 0x00ffff,
	  darkblue: 0x00008b,
	  darkcyan: 0x008b8b,
	  darkgoldenrod: 0xb8860b,
	  darkgray: 0xa9a9a9,
	  darkgreen: 0x006400,
	  darkgrey: 0xa9a9a9,
	  darkkhaki: 0xbdb76b,
	  darkmagenta: 0x8b008b,
	  darkolivegreen: 0x556b2f,
	  darkorange: 0xff8c00,
	  darkorchid: 0x9932cc,
	  darkred: 0x8b0000,
	  darksalmon: 0xe9967a,
	  darkseagreen: 0x8fbc8f,
	  darkslateblue: 0x483d8b,
	  darkslategray: 0x2f4f4f,
	  darkslategrey: 0x2f4f4f,
	  darkturquoise: 0x00ced1,
	  darkviolet: 0x9400d3,
	  deeppink: 0xff1493,
	  deepskyblue: 0x00bfff,
	  dimgray: 0x696969,
	  dimgrey: 0x696969,
	  dodgerblue: 0x1e90ff,
	  firebrick: 0xb22222,
	  floralwhite: 0xfffaf0,
	  forestgreen: 0x228b22,
	  fuchsia: 0xff00ff,
	  gainsboro: 0xdcdcdc,
	  ghostwhite: 0xf8f8ff,
	  gold: 0xffd700,
	  goldenrod: 0xdaa520,
	  gray: 0x808080,
	  green: 0x008000,
	  greenyellow: 0xadff2f,
	  grey: 0x808080,
	  honeydew: 0xf0fff0,
	  hotpink: 0xff69b4,
	  indianred: 0xcd5c5c,
	  indigo: 0x4b0082,
	  ivory: 0xfffff0,
	  khaki: 0xf0e68c,
	  lavender: 0xe6e6fa,
	  lavenderblush: 0xfff0f5,
	  lawngreen: 0x7cfc00,
	  lemonchiffon: 0xfffacd,
	  lightblue: 0xadd8e6,
	  lightcoral: 0xf08080,
	  lightcyan: 0xe0ffff,
	  lightgoldenrodyellow: 0xfafad2,
	  lightgray: 0xd3d3d3,
	  lightgreen: 0x90ee90,
	  lightgrey: 0xd3d3d3,
	  lightpink: 0xffb6c1,
	  lightsalmon: 0xffa07a,
	  lightseagreen: 0x20b2aa,
	  lightskyblue: 0x87cefa,
	  lightslategray: 0x778899,
	  lightslategrey: 0x778899,
	  lightsteelblue: 0xb0c4de,
	  lightyellow: 0xffffe0,
	  lime: 0x00ff00,
	  limegreen: 0x32cd32,
	  linen: 0xfaf0e6,
	  magenta: 0xff00ff,
	  maroon: 0x800000,
	  mediumaquamarine: 0x66cdaa,
	  mediumblue: 0x0000cd,
	  mediumorchid: 0xba55d3,
	  mediumpurple: 0x9370db,
	  mediumseagreen: 0x3cb371,
	  mediumslateblue: 0x7b68ee,
	  mediumspringgreen: 0x00fa9a,
	  mediumturquoise: 0x48d1cc,
	  mediumvioletred: 0xc71585,
	  midnightblue: 0x191970,
	  mintcream: 0xf5fffa,
	  mistyrose: 0xffe4e1,
	  moccasin: 0xffe4b5,
	  navajowhite: 0xffdead,
	  navy: 0x000080,
	  oldlace: 0xfdf5e6,
	  olive: 0x808000,
	  olivedrab: 0x6b8e23,
	  orange: 0xffa500,
	  orangered: 0xff4500,
	  orchid: 0xda70d6,
	  palegoldenrod: 0xeee8aa,
	  palegreen: 0x98fb98,
	  paleturquoise: 0xafeeee,
	  palevioletred: 0xdb7093,
	  papayawhip: 0xffefd5,
	  peachpuff: 0xffdab9,
	  peru: 0xcd853f,
	  pink: 0xffc0cb,
	  plum: 0xdda0dd,
	  powderblue: 0xb0e0e6,
	  purple: 0x800080,
	  rebeccapurple: 0x663399,
	  red: 0xff0000,
	  rosybrown: 0xbc8f8f,
	  royalblue: 0x4169e1,
	  saddlebrown: 0x8b4513,
	  salmon: 0xfa8072,
	  sandybrown: 0xf4a460,
	  seagreen: 0x2e8b57,
	  seashell: 0xfff5ee,
	  sienna: 0xa0522d,
	  silver: 0xc0c0c0,
	  skyblue: 0x87ceeb,
	  slateblue: 0x6a5acd,
	  slategray: 0x708090,
	  slategrey: 0x708090,
	  snow: 0xfffafa,
	  springgreen: 0x00ff7f,
	  steelblue: 0x4682b4,
	  tan: 0xd2b48c,
	  teal: 0x008080,
	  thistle: 0xd8bfd8,
	  tomato: 0xff6347,
	  turquoise: 0x40e0d0,
	  violet: 0xee82ee,
	  wheat: 0xf5deb3,
	  white: 0xffffff,
	  whitesmoke: 0xf5f5f5,
	  yellow: 0xffff00,
	  yellowgreen: 0x9acd32
	};

	define(Color, color, {
	  displayable: function() {
	    return this.rgb().displayable();
	  },
	  toString: function() {
	    return this.rgb() + "";
	  }
	});

	function color(format) {
	  var m;
	  format = (format + "").trim().toLowerCase();
	  return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
	      : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
	      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
	      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
	      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
	      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
	      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
	      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
	      : named.hasOwnProperty(format) ? rgbn(named[format])
	      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
	      : null;
	}

	function rgbn(n) {
	  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
	}

	function rgba(r, g, b, a) {
	  if (a <= 0) r = g = b = NaN;
	  return new Rgb(r, g, b, a);
	}

	function rgbConvert(o) {
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Rgb;
	  o = o.rgb();
	  return new Rgb(o.r, o.g, o.b, o.opacity);
	}

	function rgb(r, g, b, opacity) {
	  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
	}

	function Rgb(r, g, b, opacity) {
	  this.r = +r;
	  this.g = +g;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Rgb, rgb, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
	  },
	  rgb: function() {
	    return this;
	  },
	  displayable: function() {
	    return (0 <= this.r && this.r <= 255)
	        && (0 <= this.g && this.g <= 255)
	        && (0 <= this.b && this.b <= 255)
	        && (0 <= this.opacity && this.opacity <= 1);
	  },
	  toString: function() {
	    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
	    return (a === 1 ? "rgb(" : "rgba(")
	        + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
	        + Math.max(0, Math.min(255, Math.round(this.b) || 0))
	        + (a === 1 ? ")" : ", " + a + ")");
	  }
	}));

	function hsla(h, s, l, a) {
	  if (a <= 0) h = s = l = NaN;
	  else if (l <= 0 || l >= 1) h = s = NaN;
	  else if (s <= 0) h = NaN;
	  return new Hsl(h, s, l, a);
	}

	function hslConvert(o) {
	  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Color)) o = color(o);
	  if (!o) return new Hsl;
	  if (o instanceof Hsl) return o;
	  o = o.rgb();
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      min = Math.min(r, g, b),
	      max = Math.max(r, g, b),
	      h = NaN,
	      s = max - min,
	      l = (max + min) / 2;
	  if (s) {
	    if (r === max) h = (g - b) / s + (g < b) * 6;
	    else if (g === max) h = (b - r) / s + 2;
	    else h = (r - g) / s + 4;
	    s /= l < 0.5 ? max + min : 2 - max - min;
	    h *= 60;
	  } else {
	    s = l > 0 && l < 1 ? 0 : h;
	  }
	  return new Hsl(h, s, l, o.opacity);
	}

	function hsl(h, s, l, opacity) {
	  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
	}

	function Hsl(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hsl, hsl, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Hsl(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = this.h % 360 + (this.h < 0) * 360,
	        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
	        l = this.l,
	        m2 = l + (l < 0.5 ? l : 1 - l) * s,
	        m1 = 2 * l - m2;
	    return new Rgb(
	      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
	      hsl2rgb(h, m1, m2),
	      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
	      this.opacity
	    );
	  },
	  displayable: function() {
	    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
	        && (0 <= this.l && this.l <= 1)
	        && (0 <= this.opacity && this.opacity <= 1);
	  }
	}));

	/* From FvD 13.37, CSS Color Module Level 3 */
	function hsl2rgb(h, m1, m2) {
	  return (h < 60 ? m1 + (m2 - m1) * h / 60
	      : h < 180 ? m2
	      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
	      : m1) * 255;
	}

	var deg2rad = Math.PI / 180;
	var rad2deg = 180 / Math.PI;

	var Kn = 18,
	    Xn = 0.950470, // D65 standard referent
	    Yn = 1,
	    Zn = 1.088830,
	    t0 = 4 / 29,
	    t1 = 6 / 29,
	    t2 = 3 * t1 * t1,
	    t3 = t1 * t1 * t1;

	function labConvert(o) {
	  if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
	  if (o instanceof Hcl) {
	    var h = o.h * deg2rad;
	    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var b = rgb2xyz(o.r),
	      a = rgb2xyz(o.g),
	      l = rgb2xyz(o.b),
	      x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
	      y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
	      z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
	  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
	}

	function lab(l, a, b, opacity) {
	  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
	}

	function Lab(l, a, b, opacity) {
	  this.l = +l;
	  this.a = +a;
	  this.b = +b;
	  this.opacity = +opacity;
	}

	define(Lab, lab, extend(Color, {
	  brighter: function(k) {
	    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  darker: function(k) {
	    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
	  },
	  rgb: function() {
	    var y = (this.l + 16) / 116,
	        x = isNaN(this.a) ? y : y + this.a / 500,
	        z = isNaN(this.b) ? y : y - this.b / 200;
	    y = Yn * lab2xyz(y);
	    x = Xn * lab2xyz(x);
	    z = Zn * lab2xyz(z);
	    return new Rgb(
	      xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
	      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
	      xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
	      this.opacity
	    );
	  }
	}));

	function xyz2lab(t) {
	  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
	}

	function lab2xyz(t) {
	  return t > t1 ? t * t * t : t2 * (t - t0);
	}

	function xyz2rgb(x) {
	  return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
	}

	function rgb2xyz(x) {
	  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
	}

	function hclConvert(o) {
	  if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
	  if (!(o instanceof Lab)) o = labConvert(o);
	  var h = Math.atan2(o.b, o.a) * rad2deg;
	  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
	}

	function hcl(h, c, l, opacity) {
	  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
	}

	function Hcl(h, c, l, opacity) {
	  this.h = +h;
	  this.c = +c;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Hcl, hcl, extend(Color, {
	  brighter: function(k) {
	    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function(k) {
	    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function() {
	    return labConvert(this).rgb();
	  }
	}));

	var A = -0.14861,
	    B = +1.78277,
	    C = -0.29227,
	    D = -0.90649,
	    E = +1.97294,
	    ED = E * D,
	    EB = E * B,
	    BC_DA = B * C - D * A;

	function cubehelixConvert(o) {
	  if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
	  if (!(o instanceof Rgb)) o = rgbConvert(o);
	  var r = o.r / 255,
	      g = o.g / 255,
	      b = o.b / 255,
	      l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
	      bl = b - l,
	      k = (E * (g - l) - C * bl) / D,
	      s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
	      h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
	  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
	}

	function cubehelix(h, s, l, opacity) {
	  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
	}

	function Cubehelix(h, s, l, opacity) {
	  this.h = +h;
	  this.s = +s;
	  this.l = +l;
	  this.opacity = +opacity;
	}

	define(Cubehelix, cubehelix, extend(Color, {
	  brighter: function(k) {
	    k = k == null ? brighter : Math.pow(brighter, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  darker: function(k) {
	    k = k == null ? darker : Math.pow(darker, k);
	    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
	  },
	  rgb: function() {
	    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
	        l = +this.l,
	        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
	        cosh = Math.cos(h),
	        sinh = Math.sin(h);
	    return new Rgb(
	      255 * (l + a * (A * cosh + B * sinh)),
	      255 * (l + a * (C * cosh + D * sinh)),
	      255 * (l + a * (E * cosh)),
	      this.opacity
	    );
	  }
	}));

	function constant$1(x) {
	  return function() {
	    return x;
	  };
	}

	function linear(a, d) {
	  return function(t) {
	    return a + t * d;
	  };
	}

	function exponential(a, b, y) {
	  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
	    return Math.pow(a + t * b, y);
	  };
	}

	function gamma(y) {
	  return (y = +y) === 1 ? nogamma : function(a, b) {
	    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
	  };
	}

	function nogamma(a, b) {
	  var d = b - a;
	  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
	}

	var interpolateRgb = (function rgbGamma(y) {
	  var color$$1 = gamma(y);

	  function rgb$$1(start, end) {
	    var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
	        g = color$$1(start.g, end.g),
	        b = color$$1(start.b, end.b),
	        opacity = nogamma(start.opacity, end.opacity);
	    return function(t) {
	      start.r = r(t);
	      start.g = g(t);
	      start.b = b(t);
	      start.opacity = opacity(t);
	      return start + "";
	    };
	  }

	  rgb$$1.gamma = rgbGamma;

	  return rgb$$1;
	})(1);

	function array$2(a, b) {
	  var nb = b ? b.length : 0,
	      na = a ? Math.min(nb, a.length) : 0,
	      x = new Array(na),
	      c = new Array(nb),
	      i;

	  for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
	  for (; i < nb; ++i) c[i] = b[i];

	  return function(t) {
	    for (i = 0; i < na; ++i) c[i] = x[i](t);
	    return c;
	  };
	}

	function date(a, b) {
	  var d = new Date;
	  return a = +a, b -= a, function(t) {
	    return d.setTime(a + b * t), d;
	  };
	}

	function interpolateNumber(a, b) {
	  return a = +a, b -= a, function(t) {
	    return a + b * t;
	  };
	}

	function object(a, b) {
	  var i = {},
	      c = {},
	      k;

	  if (a === null || typeof a !== "object") a = {};
	  if (b === null || typeof b !== "object") b = {};

	  for (k in b) {
	    if (k in a) {
	      i[k] = interpolate(a[k], b[k]);
	    } else {
	      c[k] = b[k];
	    }
	  }

	  return function(t) {
	    for (k in i) c[k] = i[k](t);
	    return c;
	  };
	}

	var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
	    reB = new RegExp(reA.source, "g");

	function zero(b) {
	  return function() {
	    return b;
	  };
	}

	function one(b) {
	  return function(t) {
	    return b(t) + "";
	  };
	}

	function interpolateString(a, b) {
	  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
	      am, // current match in a
	      bm, // current match in b
	      bs, // string preceding current number in b, if any
	      i = -1, // index in s
	      s = [], // string constants and placeholders
	      q = []; // number interpolators

	  // Coerce inputs to strings.
	  a = a + "", b = b + "";

	  // Interpolate pairs of numbers in a & b.
	  while ((am = reA.exec(a))
	      && (bm = reB.exec(b))) {
	    if ((bs = bm.index) > bi) { // a string precedes the next number in b
	      bs = b.slice(bi, bs);
	      if (s[i]) s[i] += bs; // coalesce with previous string
	      else s[++i] = bs;
	    }
	    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
	      if (s[i]) s[i] += bm; // coalesce with previous string
	      else s[++i] = bm;
	    } else { // interpolate non-matching numbers
	      s[++i] = null;
	      q.push({i: i, x: interpolateNumber(am, bm)});
	    }
	    bi = reB.lastIndex;
	  }

	  // Add remains of b.
	  if (bi < b.length) {
	    bs = b.slice(bi);
	    if (s[i]) s[i] += bs; // coalesce with previous string
	    else s[++i] = bs;
	  }

	  // Special optimization for only a single match.
	  // Otherwise, interpolate each of the numbers and rejoin the string.
	  return s.length < 2 ? (q[0]
	      ? one(q[0].x)
	      : zero(b))
	      : (b = q.length, function(t) {
	          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
	          return s.join("");
	        });
	}

	function interpolate(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant$1(b)
	      : (t === "number" ? interpolateNumber
	      : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
	      : b instanceof color ? interpolateRgb
	      : b instanceof Date ? date
	      : Array.isArray(b) ? array$2
	      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
	      : interpolateNumber)(a, b);
	}

	function interpolateRound(a, b) {
	  return a = +a, b -= a, function(t) {
	    return Math.round(a + b * t);
	  };
	}

	var degrees = 180 / Math.PI;

	var identity$1 = {
	  translateX: 0,
	  translateY: 0,
	  rotate: 0,
	  skewX: 0,
	  scaleX: 1,
	  scaleY: 1
	};

	function decompose(a, b, c, d, e, f) {
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
	    translateX: e,
	    translateY: f,
	    rotate: Math.atan2(b, a) * degrees,
	    skewX: Math.atan(skewX) * degrees,
	    scaleX: scaleX,
	    scaleY: scaleY
	  };
	}

	var cssNode,
	    cssRoot,
	    cssView,
	    svgNode;

	function parseCss(value) {
	  if (value === "none") return identity$1;
	  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
	  cssNode.style.transform = value;
	  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
	  cssRoot.removeChild(cssNode);
	  value = value.slice(7, -1).split(",");
	  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
	}

	function parseSvg(value) {
	  if (value == null) return identity$1;
	  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
	  svgNode.setAttribute("transform", value);
	  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
	  value = value.matrix;
	  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
	}

	function interpolateTransform(parse, pxComma, pxParen, degParen) {

	  function pop(s) {
	    return s.length ? s.pop() + " " : "";
	  }

	  function translate(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push("translate(", null, pxComma, null, pxParen);
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb || yb) {
	      s.push("translate(" + xb + pxComma + yb + pxParen);
	    }
	  }

	  function rotate(a, b, s, q) {
	    if (a !== b) {
	      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
	      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "rotate(" + b + degParen);
	    }
	  }

	  function skewX(a, b, s, q) {
	    if (a !== b) {
	      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
	    } else if (b) {
	      s.push(pop(s) + "skewX(" + b + degParen);
	    }
	  }

	  function scale(xa, ya, xb, yb, s, q) {
	    if (xa !== xb || ya !== yb) {
	      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
	      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
	    } else if (xb !== 1 || yb !== 1) {
	      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
	    }
	  }

	  return function(a, b) {
	    var s = [], // string constants and placeholders
	        q = []; // number interpolators
	    a = parse(a), b = parse(b);
	    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
	    rotate(a.rotate, b.rotate, s, q);
	    skewX(a.skewX, b.skewX, s, q);
	    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
	    a = b = null; // gc
	    return function(t) {
	      var i = -1, n = q.length, o;
	      while (++i < n) s[(o = q[i]).i] = o.x(t);
	      return s.join("");
	    };
	  };
	}

	var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
	var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

	var rho = Math.SQRT2;

	function constant$2(x) {
	  return function() {
	    return x;
	  };
	}

	function number$1(x) {
	  return +x;
	}

	var unit = [0, 1];

	function deinterpolateLinear(a, b) {
	  return (b -= (a = +a))
	      ? function(x) { return (x - a) / b; }
	      : constant$2(b);
	}

	function deinterpolateClamp(deinterpolate) {
	  return function(a, b) {
	    var d = deinterpolate(a = +a, b = +b);
	    return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
	  };
	}

	function reinterpolateClamp(reinterpolate) {
	  return function(a, b) {
	    var r = reinterpolate(a = +a, b = +b);
	    return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
	  };
	}

	function bimap(domain, range$$1, deinterpolate, reinterpolate) {
	  var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
	  if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
	  else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
	  return function(x) { return r0(d0(x)); };
	}

	function polymap(domain, range$$1, deinterpolate, reinterpolate) {
	  var j = Math.min(domain.length, range$$1.length) - 1,
	      d = new Array(j),
	      r = new Array(j),
	      i = -1;

	  // Reverse descending domains.
	  if (domain[j] < domain[0]) {
	    domain = domain.slice().reverse();
	    range$$1 = range$$1.slice().reverse();
	  }

	  while (++i < j) {
	    d[i] = deinterpolate(domain[i], domain[i + 1]);
	    r[i] = reinterpolate(range$$1[i], range$$1[i + 1]);
	  }

	  return function(x) {
	    var i = bisectRight(domain, x, 1, j) - 1;
	    return r[i](d[i](x));
	  };
	}

	function copy(source, target) {
	  return target
	      .domain(source.domain())
	      .range(source.range())
	      .interpolate(source.interpolate())
	      .clamp(source.clamp());
	}

	// deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
	// reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
	function continuous(deinterpolate, reinterpolate) {
	  var domain = unit,
	      range$$1 = unit,
	      interpolate$$1 = interpolate,
	      clamp = false,
	      piecewise$$1,
	      output,
	      input;

	  function rescale() {
	    piecewise$$1 = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
	    output = input = null;
	    return scale;
	  }

	  function scale(x) {
	    return (output || (output = piecewise$$1(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
	  }

	  scale.invert = function(y) {
	    return (input || (input = piecewise$$1(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
	  };

	  scale.domain = function(_) {
	    return arguments.length ? (domain = map$2.call(_, number$1), rescale()) : domain.slice();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range$$1 = slice$1.call(_), interpolate$$1 = interpolateRound, rescale();
	  };

	  scale.clamp = function(_) {
	    return arguments.length ? (clamp = !!_, rescale()) : clamp;
	  };

	  scale.interpolate = function(_) {
	    return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
	  };

	  return rescale();
	}

	// Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimal(1.23) returns ["123", 0].
	function formatDecimal(x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	  var i, coefficient = x.slice(0, i);

	  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	  return [
	    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	    +x.slice(i + 1)
	  ];
	}

	function exponent(x) {
	  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	}

	function formatGroup(grouping, thousands) {
	  return function(value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	}

	function formatNumerals(numerals) {
	  return function(value) {
	    return value.replace(/[0-9]/g, function(i) {
	      return numerals[+i];
	    });
	  };
	}

	// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
	var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

	function formatSpecifier(specifier) {
	  return new FormatSpecifier(specifier);
	}

	formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

	function FormatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
	  var match;
	  this.fill = match[1] || " ";
	  this.align = match[2] || ">";
	  this.sign = match[3] || "-";
	  this.symbol = match[4] || "";
	  this.zero = !!match[5];
	  this.width = match[6] && +match[6];
	  this.comma = !!match[7];
	  this.precision = match[8] && +match[8].slice(1);
	  this.trim = !!match[9];
	  this.type = match[10] || "";
	}

	FormatSpecifier.prototype.toString = function() {
	  return this.fill
	      + this.align
	      + this.sign
	      + this.symbol
	      + (this.zero ? "0" : "")
	      + (this.width == null ? "" : Math.max(1, this.width | 0))
	      + (this.comma ? "," : "")
	      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	      + (this.trim ? "~" : "")
	      + this.type;
	};

	// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
	function formatTrim(s) {
	  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (s[i]) {
	      case ".": i0 = i1 = i; break;
	      case "0": if (i0 === 0) i0 = i; i1 = i; break;
	      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
	    }
	  }
	  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
	}

	var prefixExponent;

	function formatPrefixAuto(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1],
	      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	      n = coefficient.length;
	  return i === n ? coefficient
	      : i > n ? coefficient + new Array(i - n + 1).join("0")
	      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	}

	function formatRounded(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1];
	  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	}

	var formatTypes = {
	  "%": function(x, p) { return (x * 100).toFixed(p); },
	  "b": function(x) { return Math.round(x).toString(2); },
	  "c": function(x) { return x + ""; },
	  "d": function(x) { return Math.round(x).toString(10); },
	  "e": function(x, p) { return x.toExponential(p); },
	  "f": function(x, p) { return x.toFixed(p); },
	  "g": function(x, p) { return x.toPrecision(p); },
	  "o": function(x) { return Math.round(x).toString(8); },
	  "p": function(x, p) { return formatRounded(x * 100, p); },
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	  "x": function(x) { return Math.round(x).toString(16); }
	};

	function identity$2(x) {
	  return x;
	}

	var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

	function formatLocale(locale) {
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$2,
	      currency = locale.currency,
	      decimal = locale.decimal,
	      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$2,
	      percent = locale.percent || "%";

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);

	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        trim = specifier.trim,
	        type = specifier.type;

	    // The "n" type is an alias for ",g".
	    if (type === "n") comma = true, type = "g";

	    // The "" type, and any invalid type, is an alias for ".12~g".
	    else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

	    // If zero fill is specified, padding goes after sign and before digits.
	    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

	    // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.
	    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

	    // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?
	    var formatType = formatTypes[type],
	        maybeSuffix = /[defgprs%]/.test(type);

	    // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].
	    precision = precision == null ? 6
	        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	        : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i, n, c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value;

	        // Perform the initial formatting.
	        var valueNegative = value < 0;
	        value = formatType(Math.abs(value), precision);

	        // Trim insignificant zeros.
	        if (trim) value = formatTrim(value);

	        // If a negative value rounds to zero during formatting, treat as positive.
	        if (valueNegative && +value === 0) valueNegative = false;

	        // Compute the prefix and suffix.
	        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

	        // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.
	        if (maybeSuffix) {
	          i = -1, n = value.length;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      }

	      // If the fill character is not "0", grouping is applied before padding.
	      if (comma && !zero) value = group(value, Infinity);

	      // Compute the padding.
	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : "";

	      // If the fill character is "0", grouping is applied after padding.
	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	      // Reconstruct the final output based on the desired alignment.
	      switch (align) {
	        case "<": value = valuePrefix + value + valueSuffix + padding; break;
	        case "=": value = valuePrefix + padding + value + valueSuffix; break;
	        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
	        default: value = padding + valuePrefix + value + valueSuffix; break;
	      }

	      return numerals(value);
	    }

	    format.toString = function() {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function(value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	}

	var locale;
	var format;
	var formatPrefix;

	defaultLocale({
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});

	function defaultLocale(definition) {
	  locale = formatLocale(definition);
	  format = locale.format;
	  formatPrefix = locale.formatPrefix;
	  return locale;
	}

	function precisionFixed(step) {
	  return Math.max(0, -exponent(Math.abs(step)));
	}

	function precisionPrefix(step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	}

	function precisionRound(step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent(max) - exponent(step)) + 1;
	}

	function tickFormat(domain, count, specifier) {
	  var start = domain[0],
	      stop = domain[domain.length - 1],
	      step = tickStep(start, stop, count == null ? 10 : count),
	      precision;
	  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
	  switch (specifier.type) {
	    case "s": {
	      var value = Math.max(Math.abs(start), Math.abs(stop));
	      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
	      return formatPrefix(specifier, value);
	    }
	    case "":
	    case "e":
	    case "g":
	    case "p":
	    case "r": {
	      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	      break;
	    }
	    case "f":
	    case "%": {
	      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	      break;
	    }
	  }
	  return format(specifier);
	}

	function linearish(scale) {
	  var domain = scale.domain;

	  scale.ticks = function(count) {
	    var d = domain();
	    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	  };

	  scale.tickFormat = function(count, specifier) {
	    return tickFormat(domain(), count, specifier);
	  };

	  scale.nice = function(count) {
	    if (count == null) count = 10;

	    var d = domain(),
	        i0 = 0,
	        i1 = d.length - 1,
	        start = d[i0],
	        stop = d[i1],
	        step;

	    if (stop < start) {
	      step = start, start = stop, stop = step;
	      step = i0, i0 = i1, i1 = step;
	    }

	    step = tickIncrement(start, stop, count);

	    if (step > 0) {
	      start = Math.floor(start / step) * step;
	      stop = Math.ceil(stop / step) * step;
	      step = tickIncrement(start, stop, count);
	    } else if (step < 0) {
	      start = Math.ceil(start * step) / step;
	      stop = Math.floor(stop * step) / step;
	      step = tickIncrement(start, stop, count);
	    }

	    if (step > 0) {
	      d[i0] = Math.floor(start / step) * step;
	      d[i1] = Math.ceil(stop / step) * step;
	      domain(d);
	    } else if (step < 0) {
	      d[i0] = Math.ceil(start * step) / step;
	      d[i1] = Math.floor(stop * step) / step;
	      domain(d);
	    }

	    return scale;
	  };

	  return scale;
	}

	function linear$1() {
	  var scale = continuous(deinterpolateLinear, interpolateNumber);

	  scale.copy = function() {
	    return copy(scale, linear$1());
	  };

	  return linearish(scale);
	}

	function nice(domain, interval) {
	  domain = domain.slice();

	  var i0 = 0,
	      i1 = domain.length - 1,
	      x0 = domain[i0],
	      x1 = domain[i1],
	      t;

	  if (x1 < x0) {
	    t = i0, i0 = i1, i1 = t;
	    t = x0, x0 = x1, x1 = t;
	  }

	  domain[i0] = interval.floor(x0);
	  domain[i1] = interval.ceil(x1);
	  return domain;
	}

	var t0$1 = new Date,
	    t1$1 = new Date;

	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = new Date(+date)), date;
	  }

	  interval.floor = interval;

	  interval.ceil = function(date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function(date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function(date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function(start, stop, step) {
	    var range = [], previous;
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
	    while (previous < start && start < stop);
	    return range;
	  };

	  interval.filter = function(test) {
	    return newInterval(function(date) {
	      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
	    }, function(date, step) {
	      if (date >= date) {
	        if (step < 0) while (++step <= 0) {
	          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
	        } else while (--step >= 0) {
	          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
	        }
	      }
	    });
	  };

	  if (count) {
	    interval.count = function(start, end) {
	      t0$1.setTime(+start), t1$1.setTime(+end);
	      floori(t0$1), floori(t1$1);
	      return Math.floor(count(t0$1, t1$1));
	    };

	    interval.every = function(step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null
	          : !(step > 1) ? interval
	          : interval.filter(field
	              ? function(d) { return field(d) % step === 0; }
	              : function(d) { return interval.count(0, d) % step === 0; });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function() {
	  // noop
	}, function(date, step) {
	  date.setTime(+date + step);
	}, function(start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function(k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function(date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function(date, step) {
	    date.setTime(+date + step * k);
	  }, function(start, end) {
	    return (end - start) / k;
	  });
	};
	var milliseconds = millisecond.range;

	var durationSecond = 1e3;
	var durationMinute = 6e4;
	var durationHour = 36e5;
	var durationDay = 864e5;
	var durationWeek = 6048e5;

	var second = newInterval(function(date) {
	  date.setTime(Math.floor(date / durationSecond) * durationSecond);
	}, function(date, step) {
	  date.setTime(+date + step * durationSecond);
	}, function(start, end) {
	  return (end - start) / durationSecond;
	}, function(date) {
	  return date.getUTCSeconds();
	});
	var seconds = second.range;

	var minute = newInterval(function(date) {
	  date.setTime(Math.floor(date / durationMinute) * durationMinute);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getMinutes();
	});
	var minutes = minute.range;

	var hour = newInterval(function(date) {
	  var offset = date.getTimezoneOffset() * durationMinute % durationHour;
	  if (offset < 0) offset += durationHour;
	  date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getHours();
	});
	var hours = hour.range;

	var day = newInterval(function(date) {
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setDate(date.getDate() + step);
	}, function(start, end) {
	  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
	}, function(date) {
	  return date.getDate() - 1;
	});
	var days = day.range;

	function weekday(i) {
	  return newInterval(function(date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
	  });
	}

	var sunday = weekday(0);
	var monday = weekday(1);
	var tuesday = weekday(2);
	var wednesday = weekday(3);
	var thursday = weekday(4);
	var friday = weekday(5);
	var saturday = weekday(6);

	var sundays = sunday.range;

	var month = newInterval(function(date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function(start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function(date) {
	  return date.getMonth();
	});
	var months = month.range;

	var year = newInterval(function(date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function(start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function(date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};
	var years = year.range;

	var utcMinute = newInterval(function(date) {
	  date.setUTCSeconds(0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getUTCMinutes();
	});
	var utcMinutes = utcMinute.range;

	var utcHour = newInterval(function(date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getUTCHours();
	});
	var utcHours = utcHour.range;

	var utcDay = newInterval(function(date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function(start, end) {
	  return (end - start) / durationDay;
	}, function(date) {
	  return date.getUTCDate() - 1;
	});
	var utcDays = utcDay.range;

	function utcWeekday(i) {
	  return newInterval(function(date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function(start, end) {
	    return (end - start) / durationWeek;
	  });
	}

	var utcSunday = utcWeekday(0);
	var utcMonday = utcWeekday(1);
	var utcTuesday = utcWeekday(2);
	var utcWednesday = utcWeekday(3);
	var utcThursday = utcWeekday(4);
	var utcFriday = utcWeekday(5);
	var utcSaturday = utcWeekday(6);

	var utcSundays = utcSunday.range;

	var utcMonth = newInterval(function(date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function(start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function(date) {
	  return date.getUTCMonth();
	});
	var utcMonths = utcMonth.range;

	var utcYear = newInterval(function(date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function(start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function(date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};
	var utcYears = utcYear.range;

	function localDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	    date.setFullYear(d.y);
	    return date;
	  }
	  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	}

	function utcDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }
	  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	}

	function newYear(y) {
	  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	}

	function formatLocale$1(locale) {
	  var locale_dateTime = locale.dateTime,
	      locale_date = locale.date,
	      locale_time = locale.time,
	      locale_periods = locale.periods,
	      locale_weekdays = locale.days,
	      locale_shortWeekdays = locale.shortDays,
	      locale_months = locale.months,
	      locale_shortMonths = locale.shortMonths;

	  var periodRe = formatRe(locale_periods),
	      periodLookup = formatLookup(locale_periods),
	      weekdayRe = formatRe(locale_weekdays),
	      weekdayLookup = formatLookup(locale_weekdays),
	      shortWeekdayRe = formatRe(locale_shortWeekdays),
	      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	      monthRe = formatRe(locale_months),
	      monthLookup = formatLookup(locale_months),
	      shortMonthRe = formatRe(locale_shortMonths),
	      shortMonthLookup = formatLookup(locale_shortMonths);

	  var formats = {
	    "a": formatShortWeekday,
	    "A": formatWeekday,
	    "b": formatShortMonth,
	    "B": formatMonth,
	    "c": null,
	    "d": formatDayOfMonth,
	    "e": formatDayOfMonth,
	    "f": formatMicroseconds,
	    "H": formatHour24,
	    "I": formatHour12,
	    "j": formatDayOfYear,
	    "L": formatMilliseconds,
	    "m": formatMonthNumber,
	    "M": formatMinutes,
	    "p": formatPeriod,
	    "Q": formatUnixTimestamp,
	    "s": formatUnixTimestampSeconds,
	    "S": formatSeconds,
	    "u": formatWeekdayNumberMonday,
	    "U": formatWeekNumberSunday,
	    "V": formatWeekNumberISO,
	    "w": formatWeekdayNumberSunday,
	    "W": formatWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatYear,
	    "Y": formatFullYear,
	    "Z": formatZone,
	    "%": formatLiteralPercent
	  };

	  var utcFormats = {
	    "a": formatUTCShortWeekday,
	    "A": formatUTCWeekday,
	    "b": formatUTCShortMonth,
	    "B": formatUTCMonth,
	    "c": null,
	    "d": formatUTCDayOfMonth,
	    "e": formatUTCDayOfMonth,
	    "f": formatUTCMicroseconds,
	    "H": formatUTCHour24,
	    "I": formatUTCHour12,
	    "j": formatUTCDayOfYear,
	    "L": formatUTCMilliseconds,
	    "m": formatUTCMonthNumber,
	    "M": formatUTCMinutes,
	    "p": formatUTCPeriod,
	    "Q": formatUnixTimestamp,
	    "s": formatUnixTimestampSeconds,
	    "S": formatUTCSeconds,
	    "u": formatUTCWeekdayNumberMonday,
	    "U": formatUTCWeekNumberSunday,
	    "V": formatUTCWeekNumberISO,
	    "w": formatUTCWeekdayNumberSunday,
	    "W": formatUTCWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatUTCYear,
	    "Y": formatUTCFullYear,
	    "Z": formatUTCZone,
	    "%": formatLiteralPercent
	  };

	  var parses = {
	    "a": parseShortWeekday,
	    "A": parseWeekday,
	    "b": parseShortMonth,
	    "B": parseMonth,
	    "c": parseLocaleDateTime,
	    "d": parseDayOfMonth,
	    "e": parseDayOfMonth,
	    "f": parseMicroseconds,
	    "H": parseHour24,
	    "I": parseHour24,
	    "j": parseDayOfYear,
	    "L": parseMilliseconds,
	    "m": parseMonthNumber,
	    "M": parseMinutes,
	    "p": parsePeriod,
	    "Q": parseUnixTimestamp,
	    "s": parseUnixTimestampSeconds,
	    "S": parseSeconds,
	    "u": parseWeekdayNumberMonday,
	    "U": parseWeekNumberSunday,
	    "V": parseWeekNumberISO,
	    "w": parseWeekdayNumberSunday,
	    "W": parseWeekNumberMonday,
	    "x": parseLocaleDate,
	    "X": parseLocaleTime,
	    "y": parseYear,
	    "Y": parseFullYear,
	    "Z": parseZone,
	    "%": parseLiteralPercent
	  };

	  // These recursive directive definitions must be deferred.
	  formats.x = newFormat(locale_date, formats);
	  formats.X = newFormat(locale_time, formats);
	  formats.c = newFormat(locale_dateTime, formats);
	  utcFormats.x = newFormat(locale_date, utcFormats);
	  utcFormats.X = newFormat(locale_time, utcFormats);
	  utcFormats.c = newFormat(locale_dateTime, utcFormats);

	  function newFormat(specifier, formats) {
	    return function(date) {
	      var string = [],
	          i = -1,
	          j = 0,
	          n = specifier.length,
	          c,
	          pad,
	          format;

	      if (!(date instanceof Date)) date = new Date(+date);

	      while (++i < n) {
	        if (specifier.charCodeAt(i) === 37) {
	          string.push(specifier.slice(j, i));
	          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	          else pad = c === "e" ? " " : "0";
	          if (format = formats[c]) c = format(date, pad);
	          string.push(c);
	          j = i + 1;
	        }
	      }

	      string.push(specifier.slice(j, i));
	      return string.join("");
	    };
	  }

	  function newParse(specifier, newDate) {
	    return function(string) {
	      var d = newYear(1900),
	          i = parseSpecifier(d, specifier, string += "", 0),
	          week, day$$1;
	      if (i != string.length) return null;

	      // If a UNIX timestamp is specified, return it.
	      if ("Q" in d) return new Date(d.Q);

	      // The am-pm flag is 0 for AM, and 1 for PM.
	      if ("p" in d) d.H = d.H % 12 + d.p * 12;

	      // Convert day-of-week and week-of-year to day-of-year.
	      if ("V" in d) {
	        if (d.V < 1 || d.V > 53) return null;
	        if (!("w" in d)) d.w = 1;
	        if ("Z" in d) {
	          week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
	          week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
	          week = utcDay.offset(week, (d.V - 1) * 7);
	          d.y = week.getUTCFullYear();
	          d.m = week.getUTCMonth();
	          d.d = week.getUTCDate() + (d.w + 6) % 7;
	        } else {
	          week = newDate(newYear(d.y)), day$$1 = week.getDay();
	          week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
	          week = day.offset(week, (d.V - 1) * 7);
	          d.y = week.getFullYear();
	          d.m = week.getMonth();
	          d.d = week.getDate() + (d.w + 6) % 7;
	        }
	      } else if ("W" in d || "U" in d) {
	        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
	        day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	        d.m = 0;
	        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
	      }

	      // If a time zone is specified, all fields are interpreted as UTC and then
	      // offset according to the specified time zone.
	      if ("Z" in d) {
	        d.H += d.Z / 100 | 0;
	        d.M += d.Z % 100;
	        return utcDate(d);
	      }

	      // Otherwise, all fields are in local time.
	      return newDate(d);
	    };
	  }

	  function parseSpecifier(d, specifier, string, j) {
	    var i = 0,
	        n = specifier.length,
	        m = string.length,
	        c,
	        parse;

	    while (i < n) {
	      if (j >= m) return -1;
	      c = specifier.charCodeAt(i++);
	      if (c === 37) {
	        c = specifier.charAt(i++);
	        parse = parses[c in pads ? specifier.charAt(i++) : c];
	        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	      } else if (c != string.charCodeAt(j++)) {
	        return -1;
	      }
	    }

	    return j;
	  }

	  function parsePeriod(d, string, i) {
	    var n = periodRe.exec(string.slice(i));
	    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortWeekday(d, string, i) {
	    var n = shortWeekdayRe.exec(string.slice(i));
	    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseWeekday(d, string, i) {
	    var n = weekdayRe.exec(string.slice(i));
	    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortMonth(d, string, i) {
	    var n = shortMonthRe.exec(string.slice(i));
	    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseMonth(d, string, i) {
	    var n = monthRe.exec(string.slice(i));
	    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseLocaleDateTime(d, string, i) {
	    return parseSpecifier(d, locale_dateTime, string, i);
	  }

	  function parseLocaleDate(d, string, i) {
	    return parseSpecifier(d, locale_date, string, i);
	  }

	  function parseLocaleTime(d, string, i) {
	    return parseSpecifier(d, locale_time, string, i);
	  }

	  function formatShortWeekday(d) {
	    return locale_shortWeekdays[d.getDay()];
	  }

	  function formatWeekday(d) {
	    return locale_weekdays[d.getDay()];
	  }

	  function formatShortMonth(d) {
	    return locale_shortMonths[d.getMonth()];
	  }

	  function formatMonth(d) {
	    return locale_months[d.getMonth()];
	  }

	  function formatPeriod(d) {
	    return locale_periods[+(d.getHours() >= 12)];
	  }

	  function formatUTCShortWeekday(d) {
	    return locale_shortWeekdays[d.getUTCDay()];
	  }

	  function formatUTCWeekday(d) {
	    return locale_weekdays[d.getUTCDay()];
	  }

	  function formatUTCShortMonth(d) {
	    return locale_shortMonths[d.getUTCMonth()];
	  }

	  function formatUTCMonth(d) {
	    return locale_months[d.getUTCMonth()];
	  }

	  function formatUTCPeriod(d) {
	    return locale_periods[+(d.getUTCHours() >= 12)];
	  }

	  return {
	    format: function(specifier) {
	      var f = newFormat(specifier += "", formats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    parse: function(specifier) {
	      var p = newParse(specifier += "", localDate);
	      p.toString = function() { return specifier; };
	      return p;
	    },
	    utcFormat: function(specifier) {
	      var f = newFormat(specifier += "", utcFormats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    utcParse: function(specifier) {
	      var p = newParse(specifier, utcDate);
	      p.toString = function() { return specifier; };
	      return p;
	    }
	  };
	}

	var pads = {"-": "", "_": " ", "0": "0"},
	    numberRe = /^\s*\d+/, // note: ignores next directive
	    percentRe = /^%/,
	    requoteRe = /[\\^$*+?|[\]().{}]/g;

	function pad(value, fill, width) {
	  var sign = value < 0 ? "-" : "",
	      string = (sign ? -value : value) + "",
	      length = string.length;
	  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	}

	function requote(s) {
	  return s.replace(requoteRe, "\\$&");
	}

	function formatRe(names) {
	  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	}

	function formatLookup(names) {
	  var map = {}, i = -1, n = names.length;
	  while (++i < n) map[names[i].toLowerCase()] = i;
	  return map;
	}

	function parseWeekdayNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.w = +n[0], i + n[0].length) : -1;
	}

	function parseWeekdayNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.u = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.U = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberISO(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.V = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.W = +n[0], i + n[0].length) : -1;
	}

	function parseFullYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 4));
	  return n ? (d.y = +n[0], i + n[0].length) : -1;
	}

	function parseYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	}

	function parseZone(d, string, i) {
	  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
	  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	}

	function parseMonthNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	}

	function parseDayOfMonth(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.d = +n[0], i + n[0].length) : -1;
	}

	function parseDayOfYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	}

	function parseHour24(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.H = +n[0], i + n[0].length) : -1;
	}

	function parseMinutes(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.M = +n[0], i + n[0].length) : -1;
	}

	function parseSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.S = +n[0], i + n[0].length) : -1;
	}

	function parseMilliseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.L = +n[0], i + n[0].length) : -1;
	}

	function parseMicroseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 6));
	  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
	}

	function parseLiteralPercent(d, string, i) {
	  var n = percentRe.exec(string.slice(i, i + 1));
	  return n ? i + n[0].length : -1;
	}

	function parseUnixTimestamp(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.Q = +n[0], i + n[0].length) : -1;
	}

	function parseUnixTimestampSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
	}

	function formatDayOfMonth(d, p) {
	  return pad(d.getDate(), p, 2);
	}

	function formatHour24(d, p) {
	  return pad(d.getHours(), p, 2);
	}

	function formatHour12(d, p) {
	  return pad(d.getHours() % 12 || 12, p, 2);
	}

	function formatDayOfYear(d, p) {
	  return pad(1 + day.count(year(d), d), p, 3);
	}

	function formatMilliseconds(d, p) {
	  return pad(d.getMilliseconds(), p, 3);
	}

	function formatMicroseconds(d, p) {
	  return formatMilliseconds(d, p) + "000";
	}

	function formatMonthNumber(d, p) {
	  return pad(d.getMonth() + 1, p, 2);
	}

	function formatMinutes(d, p) {
	  return pad(d.getMinutes(), p, 2);
	}

	function formatSeconds(d, p) {
	  return pad(d.getSeconds(), p, 2);
	}

	function formatWeekdayNumberMonday(d) {
	  var day$$1 = d.getDay();
	  return day$$1 === 0 ? 7 : day$$1;
	}

	function formatWeekNumberSunday(d, p) {
	  return pad(sunday.count(year(d), d), p, 2);
	}

	function formatWeekNumberISO(d, p) {
	  var day$$1 = d.getDay();
	  d = (day$$1 >= 4 || day$$1 === 0) ? thursday(d) : thursday.ceil(d);
	  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
	}

	function formatWeekdayNumberSunday(d) {
	  return d.getDay();
	}

	function formatWeekNumberMonday(d, p) {
	  return pad(monday.count(year(d), d), p, 2);
	}

	function formatYear(d, p) {
	  return pad(d.getFullYear() % 100, p, 2);
	}

	function formatFullYear(d, p) {
	  return pad(d.getFullYear() % 10000, p, 4);
	}

	function formatZone(d) {
	  var z = d.getTimezoneOffset();
	  return (z > 0 ? "-" : (z *= -1, "+"))
	      + pad(z / 60 | 0, "0", 2)
	      + pad(z % 60, "0", 2);
	}

	function formatUTCDayOfMonth(d, p) {
	  return pad(d.getUTCDate(), p, 2);
	}

	function formatUTCHour24(d, p) {
	  return pad(d.getUTCHours(), p, 2);
	}

	function formatUTCHour12(d, p) {
	  return pad(d.getUTCHours() % 12 || 12, p, 2);
	}

	function formatUTCDayOfYear(d, p) {
	  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
	}

	function formatUTCMilliseconds(d, p) {
	  return pad(d.getUTCMilliseconds(), p, 3);
	}

	function formatUTCMicroseconds(d, p) {
	  return formatUTCMilliseconds(d, p) + "000";
	}

	function formatUTCMonthNumber(d, p) {
	  return pad(d.getUTCMonth() + 1, p, 2);
	}

	function formatUTCMinutes(d, p) {
	  return pad(d.getUTCMinutes(), p, 2);
	}

	function formatUTCSeconds(d, p) {
	  return pad(d.getUTCSeconds(), p, 2);
	}

	function formatUTCWeekdayNumberMonday(d) {
	  var dow = d.getUTCDay();
	  return dow === 0 ? 7 : dow;
	}

	function formatUTCWeekNumberSunday(d, p) {
	  return pad(utcSunday.count(utcYear(d), d), p, 2);
	}

	function formatUTCWeekNumberISO(d, p) {
	  var day$$1 = d.getUTCDay();
	  d = (day$$1 >= 4 || day$$1 === 0) ? utcThursday(d) : utcThursday.ceil(d);
	  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
	}

	function formatUTCWeekdayNumberSunday(d) {
	  return d.getUTCDay();
	}

	function formatUTCWeekNumberMonday(d, p) {
	  return pad(utcMonday.count(utcYear(d), d), p, 2);
	}

	function formatUTCYear(d, p) {
	  return pad(d.getUTCFullYear() % 100, p, 2);
	}

	function formatUTCFullYear(d, p) {
	  return pad(d.getUTCFullYear() % 10000, p, 4);
	}

	function formatUTCZone() {
	  return "+0000";
	}

	function formatLiteralPercent() {
	  return "%";
	}

	function formatUnixTimestamp(d) {
	  return +d;
	}

	function formatUnixTimestampSeconds(d) {
	  return Math.floor(+d / 1000);
	}

	var locale$1;
	var timeFormat;
	var timeParse;
	var utcFormat;
	var utcParse;

	defaultLocale$1({
	  dateTime: "%x, %X",
	  date: "%-m/%-d/%Y",
	  time: "%-I:%M:%S %p",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	});

	function defaultLocale$1(definition) {
	  locale$1 = formatLocale$1(definition);
	  timeFormat = locale$1.format;
	  timeParse = locale$1.parse;
	  utcFormat = locale$1.utcFormat;
	  utcParse = locale$1.utcParse;
	  return locale$1;
	}

	var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	function formatIsoNative(date) {
	  return date.toISOString();
	}

	var formatIso = Date.prototype.toISOString
	    ? formatIsoNative
	    : utcFormat(isoSpecifier);

	function parseIsoNative(string) {
	  var date = new Date(string);
	  return isNaN(date) ? null : date;
	}

	var parseIso = +new Date("2000-01-01T00:00:00.000Z")
	    ? parseIsoNative
	    : utcParse(isoSpecifier);

	var durationSecond$1 = 1000,
	    durationMinute$1 = durationSecond$1 * 60,
	    durationHour$1 = durationMinute$1 * 60,
	    durationDay$1 = durationHour$1 * 24,
	    durationWeek$1 = durationDay$1 * 7,
	    durationMonth = durationDay$1 * 30,
	    durationYear = durationDay$1 * 365;

	function date$1(t) {
	  return new Date(t);
	}

	function number$2(t) {
	  return t instanceof Date ? +t : +new Date(+t);
	}

	function calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format) {
	  var scale = continuous(deinterpolateLinear, interpolateNumber),
	      invert = scale.invert,
	      domain = scale.domain;

	  var formatMillisecond = format(".%L"),
	      formatSecond = format(":%S"),
	      formatMinute = format("%I:%M"),
	      formatHour = format("%I %p"),
	      formatDay = format("%a %d"),
	      formatWeek = format("%b %d"),
	      formatMonth = format("%B"),
	      formatYear = format("%Y");

	  var tickIntervals = [
	    [second$$1,  1,      durationSecond$1],
	    [second$$1,  5,  5 * durationSecond$1],
	    [second$$1, 15, 15 * durationSecond$1],
	    [second$$1, 30, 30 * durationSecond$1],
	    [minute$$1,  1,      durationMinute$1],
	    [minute$$1,  5,  5 * durationMinute$1],
	    [minute$$1, 15, 15 * durationMinute$1],
	    [minute$$1, 30, 30 * durationMinute$1],
	    [  hour$$1,  1,      durationHour$1  ],
	    [  hour$$1,  3,  3 * durationHour$1  ],
	    [  hour$$1,  6,  6 * durationHour$1  ],
	    [  hour$$1, 12, 12 * durationHour$1  ],
	    [   day$$1,  1,      durationDay$1   ],
	    [   day$$1,  2,  2 * durationDay$1   ],
	    [  week,  1,      durationWeek$1  ],
	    [ month$$1,  1,      durationMonth ],
	    [ month$$1,  3,  3 * durationMonth ],
	    [  year$$1,  1,      durationYear  ]
	  ];

	  function tickFormat(date$$1) {
	    return (second$$1(date$$1) < date$$1 ? formatMillisecond
	        : minute$$1(date$$1) < date$$1 ? formatSecond
	        : hour$$1(date$$1) < date$$1 ? formatMinute
	        : day$$1(date$$1) < date$$1 ? formatHour
	        : month$$1(date$$1) < date$$1 ? (week(date$$1) < date$$1 ? formatDay : formatWeek)
	        : year$$1(date$$1) < date$$1 ? formatMonth
	        : formatYear)(date$$1);
	  }

	  function tickInterval(interval, start, stop, step) {
	    if (interval == null) interval = 10;

	    // If a desired tick count is specified, pick a reasonable tick interval
	    // based on the extent of the domain and a rough estimate of tick size.
	    // Otherwise, assume interval is already a time interval and use it.
	    if (typeof interval === "number") {
	      var target = Math.abs(stop - start) / interval,
	          i = bisector(function(i) { return i[2]; }).right(tickIntervals, target);
	      if (i === tickIntervals.length) {
	        step = tickStep(start / durationYear, stop / durationYear, interval);
	        interval = year$$1;
	      } else if (i) {
	        i = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
	        step = i[1];
	        interval = i[0];
	      } else {
	        step = Math.max(tickStep(start, stop, interval), 1);
	        interval = millisecond$$1;
	      }
	    }

	    return step == null ? interval : interval.every(step);
	  }

	  scale.invert = function(y) {
	    return new Date(invert(y));
	  };

	  scale.domain = function(_) {
	    return arguments.length ? domain(map$2.call(_, number$2)) : domain().map(date$1);
	  };

	  scale.ticks = function(interval, step) {
	    var d = domain(),
	        t0 = d[0],
	        t1 = d[d.length - 1],
	        r = t1 < t0,
	        t;
	    if (r) t = t0, t0 = t1, t1 = t;
	    t = tickInterval(interval, t0, t1, step);
	    t = t ? t.range(t0, t1 + 1) : []; // inclusive stop
	    return r ? t.reverse() : t;
	  };

	  scale.tickFormat = function(count, specifier) {
	    return specifier == null ? tickFormat : format(specifier);
	  };

	  scale.nice = function(interval, step) {
	    var d = domain();
	    return (interval = tickInterval(interval, d[0], d[d.length - 1], step))
	        ? domain(nice(d, interval))
	        : scale;
	  };

	  scale.copy = function() {
	    return copy(scale, calendar(year$$1, month$$1, week, day$$1, hour$$1, minute$$1, second$$1, millisecond$$1, format));
	  };

	  return scale;
	}

	function scaleTime() {
	  return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
	}

	var CUSTOM = false;
	var prefix$1 = "ct-";
	var monthsAbr = [
		"Jan.",
		"Feb.",
		"Mar.",
		"Apr.",
		"May",
		"June",
		"July",
		"Aug.",
		"Sept.",
		"Oct.",
		"Nov.",
		"Dec.",
		"Jan."
	];
	var debounce = 500;
	var tipTimeout = 5000;
	var ratioMobile = 1.15;
	var ratioDesktop = 0.65;
	var dateFormat = "%Y-%m-%d";
	var timeFormat$1 = "%H:%M";
	var margin = {
		top: 10,
		right: 3,
		bottom: 0,
		left: 0
	};
	var tipOffset = {
		vertical: 2,
		horizontal: 1
	};
	var tipPadding = {
		top: 4,
		right: 9,
		bottom: 4,
		left: 9
	};
	var tipRadius = 3.5;
	var yAxis = {
		display: true,
		scale: "linear",
		ticks: "auto",
		orient: "right",
		format: "comma",
		prefix: "",
		suffix: "",
		min: "",
		max: "",
		rescale: false,
		nice: true,
		paddingRight: 9,
		tickLowerBound: 3,
		tickUpperBound: 8,
		tickGoal: 5,
		widthThreshold: 420,
		dy: "",
		textX: 0,
		textY: 0
	};
	var xAxis = {
		display: true,
		scale: "time",
		ticks: "auto",
		orient: "bottom",
		format: "comma",
		prefix: "",
		suffix: "",
		min: "",
		max: "",
		rescale: false,
		nice: false,
		rangePoints: 1,
		tickTarget: 6,
		ticksSmall: 4,
		widthThreshold: 420,
		dy: 0.7,
		barOffset: 9,
		tickHeight: 7,
		textX: 6,
		textY: 7
	};
	var barHeight = 25;
	var barLabelOffset = 6;
	var scatterplotRadius = 4;
	var bands = {
		padding: 0.12,
		offset: 0.06,
		outerPadding: 0.06
	};
	var social = {
		facebook: {
			label: "Facebook",
			icon: "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg",
			redirect: "",
			appID: ""
		},
		twitter: {
			label: "Twitter",
			icon: "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg",
			via: "",
			hashtag: ""
		},
		email: {
			label: "Email",
			icon: "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"
		},
		sms: {
			label: "SMS",
			icon: "https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"
		}
	};
	var image = {
		enable: false,
		base_path: "",
		expiration: 30000,
		filename: "thumbnail",
		extension: "png",
		thumbnailWidth: 460
	};

	var version = "1.3.0";
	var buildVer = "0";

	var chartSettings = {

	  prefix: prefix$1,
	  CUSTOM: CUSTOM,
	  version: version,
	  build: buildVer,
	  id: '',
	  data: '',
	  dateFormat: dateFormat,
	  timeFormat: timeFormat$1,
	  image: image,
	  heading: '',
	  qualifier: '',
	  source: '',
	  index: '',
	  hasHours: false,
	  social: social,
	  baseClass: ((prefix$1) + "chart"),
	  customClass: '',

	  options: {
	    annotations: true,
	    expanded: false,
	    footer: true,
	    head: true,
	    indexed: false,
	    interpolation: 'linear',
	    legend: true,
	    qualifier: true,
	    share_data: true,
	    social: true,
	    stacked: false,
	    tips: true,
	    type: 'line',
	    x_axis: true,
	    y_axis: true
	  },

	  xAxis: xAxis,
	  yAxis: yAxis,

	  annotations: {
	    highlight: [],
	    range: [],
	    text: [],
	    pointer: []
	  },

	  exportable: false, // this can be overwritten by the backend as needed
	  editable: false,
	  debounce: debounce,
	  tipTimeout: tipTimeout,
	  monthsAbr: monthsAbr,

	  dimensions: {
	    width: 0,
	    computedWidth: function() {
	      return this.width - this.margin.left - this.margin.right;
	    },
	    height: function() {
	      var ratioScale = linear$1().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
	      return Math.round(ratioScale(this.width));
	    },
	    computedHeight: function() {
	      return (this.height() - this.headerHeight - this.footerHeight - this.margin.top - this.margin.bottom);
	    },
	    ratioMobile: ratioMobile,
	    ratioDesktop: ratioDesktop,
	    margin: margin,
	    tipPadding: tipPadding,
	    tipOffset: tipOffset,
	    headerHeight: 0,
	    footerHeight: 0,
	    xAxisHeight: 0,
	    yAxisHeight: function() {
	      return (this.computedHeight() - this.xAxisHeight);
	    },
	    xAxisWidth: 0,
	    labelWidth: 0,
	    yAxisPaddingRight: yAxis.paddingRight,
	    tickWidth: function() {
	      return (this.computedWidth() - (this.labelWidth + this.yAxisPaddingRight));
	    },
	    barHeight: barHeight,
	    barLabelOffset: barLabelOffset,
	    scatterplotRadius: scatterplotRadius,
	    bands: {
	      padding: bands.padding,
	      offset: bands.offset,
	      outerPadding: bands.outerPadding
	    }
	  }

	};

	var xhtml = "http://www.w3.org/1999/xhtml";

	var namespaces = {
	  svg: "http://www.w3.org/2000/svg",
	  xhtml: xhtml,
	  xlink: "http://www.w3.org/1999/xlink",
	  xml: "http://www.w3.org/XML/1998/namespace",
	  xmlns: "http://www.w3.org/2000/xmlns/"
	};

	function namespace(name) {
	  var prefix = name += "", i = prefix.indexOf(":");
	  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
	  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
	}

	function creatorInherit(name) {
	  return function() {
	    var document = this.ownerDocument,
	        uri = this.namespaceURI;
	    return uri === xhtml && document.documentElement.namespaceURI === xhtml
	        ? document.createElement(name)
	        : document.createElementNS(uri, name);
	  };
	}

	function creatorFixed(fullname) {
	  return function() {
	    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
	  };
	}

	function creator(name) {
	  var fullname = namespace(name);
	  return (fullname.local
	      ? creatorFixed
	      : creatorInherit)(fullname);
	}

	function none() {}

	function selector(selector) {
	  return selector == null ? none : function() {
	    return this.querySelector(selector);
	  };
	}

	function selection_select(select) {
	  if (typeof select !== "function") select = selector(select);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function empty() {
	  return [];
	}

	function selectorAll(selector) {
	  return selector == null ? empty : function() {
	    return this.querySelectorAll(selector);
	  };
	}

	function selection_selectAll(select) {
	  if (typeof select !== "function") select = selectorAll(select);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        subgroups.push(select.call(node, node.__data__, i, group));
	        parents.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, parents);
	}

	var matcher = function(selector) {
	  return function() {
	    return this.matches(selector);
	  };
	};

	if (typeof document !== "undefined") {
	  var element = document.documentElement;
	  if (!element.matches) {
	    var vendorMatches = element.webkitMatchesSelector
	        || element.msMatchesSelector
	        || element.mozMatchesSelector
	        || element.oMatchesSelector;
	    matcher = function(selector) {
	      return function() {
	        return vendorMatches.call(this, selector);
	      };
	    };
	  }
	}

	var matcher$1 = matcher;

	function selection_filter(match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Selection(subgroups, this._parents);
	}

	function sparse(update) {
	  return new Array(update.length);
	}

	function selection_enter() {
	  return new Selection(this._enter || this._groups.map(sparse), this._parents);
	}

	function EnterNode(parent, datum) {
	  this.ownerDocument = parent.ownerDocument;
	  this.namespaceURI = parent.namespaceURI;
	  this._next = null;
	  this._parent = parent;
	  this.__data__ = datum;
	}

	EnterNode.prototype = {
	  constructor: EnterNode,
	  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
	  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
	  querySelector: function(selector) { return this._parent.querySelector(selector); },
	  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
	};

	function constant$3(x) {
	  return function() {
	    return x;
	  };
	}

	var keyPrefix = "$"; // Protect against keys like “__proto__”.

	function bindIndex(parent, group, enter, update, exit, data) {
	  var i = 0,
	      node,
	      groupLength = group.length,
	      dataLength = data.length;

	  // Put any non-null nodes that fit into update.
	  // Put any null nodes into enter.
	  // Put any remaining data into enter.
	  for (; i < dataLength; ++i) {
	    if (node = group[i]) {
	      node.__data__ = data[i];
	      update[i] = node;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Put any non-null nodes that don’t fit into exit.
	  for (; i < groupLength; ++i) {
	    if (node = group[i]) {
	      exit[i] = node;
	    }
	  }
	}

	function bindKey(parent, group, enter, update, exit, data, key) {
	  var i,
	      node,
	      nodeByKeyValue = {},
	      groupLength = group.length,
	      dataLength = data.length,
	      keyValues = new Array(groupLength),
	      keyValue;

	  // Compute the key for each node.
	  // If multiple nodes have the same key, the duplicates are added to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if (node = group[i]) {
	      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
	      if (keyValue in nodeByKeyValue) {
	        exit[i] = node;
	      } else {
	        nodeByKeyValue[keyValue] = node;
	      }
	    }
	  }

	  // Compute the key for each datum.
	  // If there a node associated with this key, join and add it to update.
	  // If there is not (or the key is a duplicate), add it to enter.
	  for (i = 0; i < dataLength; ++i) {
	    keyValue = keyPrefix + key.call(parent, data[i], i, data);
	    if (node = nodeByKeyValue[keyValue]) {
	      update[i] = node;
	      node.__data__ = data[i];
	      nodeByKeyValue[keyValue] = null;
	    } else {
	      enter[i] = new EnterNode(parent, data[i]);
	    }
	  }

	  // Add any remaining nodes that were not bound to data to exit.
	  for (i = 0; i < groupLength; ++i) {
	    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
	      exit[i] = node;
	    }
	  }
	}

	function selection_data(value, key) {
	  if (!value) {
	    data = new Array(this.size()), j = -1;
	    this.each(function(d) { data[++j] = d; });
	    return data;
	  }

	  var bind = key ? bindKey : bindIndex,
	      parents = this._parents,
	      groups = this._groups;

	  if (typeof value !== "function") value = constant$3(value);

	  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
	    var parent = parents[j],
	        group = groups[j],
	        groupLength = group.length,
	        data = value.call(parent, parent && parent.__data__, j, parents),
	        dataLength = data.length,
	        enterGroup = enter[j] = new Array(dataLength),
	        updateGroup = update[j] = new Array(dataLength),
	        exitGroup = exit[j] = new Array(groupLength);

	    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

	    // Now connect the enter nodes to their following update node, such that
	    // appendChild can insert the materialized enter node before this node,
	    // rather than at the end of the parent node.
	    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
	      if (previous = enterGroup[i0]) {
	        if (i0 >= i1) i1 = i0 + 1;
	        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
	        previous._next = next || null;
	      }
	    }
	  }

	  update = new Selection(update, parents);
	  update._enter = enter;
	  update._exit = exit;
	  return update;
	}

	function selection_exit() {
	  return new Selection(this._exit || this._groups.map(sparse), this._parents);
	}

	function selection_merge(selection$$1) {

	  for (var groups0 = this._groups, groups1 = selection$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Selection(merges, this._parents);
	}

	function selection_order() {

	  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
	    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
	      if (node = group[i]) {
	        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
	        next = node;
	      }
	    }
	  }

	  return this;
	}

	function selection_sort(compare) {
	  if (!compare) compare = ascending$1;

	  function compareNode(a, b) {
	    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
	  }

	  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        sortgroup[i] = node;
	      }
	    }
	    sortgroup.sort(compareNode);
	  }

	  return new Selection(sortgroups, this._parents).order();
	}

	function ascending$1(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function selection_call() {
	  var callback = arguments[0];
	  arguments[0] = this;
	  callback.apply(null, arguments);
	  return this;
	}

	function selection_nodes() {
	  var nodes = new Array(this.size()), i = -1;
	  this.each(function() { nodes[++i] = this; });
	  return nodes;
	}

	function selection_node() {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
	      var node = group[i];
	      if (node) return node;
	    }
	  }

	  return null;
	}

	function selection_size() {
	  var size = 0;
	  this.each(function() { ++size; });
	  return size;
	}

	function selection_empty() {
	  return !this.node();
	}

	function selection_each(callback) {

	  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
	    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
	      if (node = group[i]) callback.call(node, node.__data__, i, group);
	    }
	  }

	  return this;
	}

	function attrRemove(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant(name, value) {
	  return function() {
	    this.setAttribute(name, value);
	  };
	}

	function attrConstantNS(fullname, value) {
	  return function() {
	    this.setAttributeNS(fullname.space, fullname.local, value);
	  };
	}

	function attrFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttribute(name);
	    else this.setAttribute(name, v);
	  };
	}

	function attrFunctionNS(fullname, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
	    else this.setAttributeNS(fullname.space, fullname.local, v);
	  };
	}

	function selection_attr(name, value) {
	  var fullname = namespace(name);

	  if (arguments.length < 2) {
	    var node = this.node();
	    return fullname.local
	        ? node.getAttributeNS(fullname.space, fullname.local)
	        : node.getAttribute(fullname);
	  }

	  return this.each((value == null
	      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
	      ? (fullname.local ? attrFunctionNS : attrFunction)
	      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
	}

	function window$1(node) {
	  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
	      || (node.document && node) // node is a Window
	      || node.defaultView; // node is a Document
	}

	function styleRemove(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant(name, value, priority) {
	  return function() {
	    this.style.setProperty(name, value, priority);
	  };
	}

	function styleFunction(name, value, priority) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) this.style.removeProperty(name);
	    else this.style.setProperty(name, v, priority);
	  };
	}

	function selection_style(name, value, priority) {
	  return arguments.length > 1
	      ? this.each((value == null
	            ? styleRemove : typeof value === "function"
	            ? styleFunction
	            : styleConstant)(name, value, priority == null ? "" : priority))
	      : styleValue(this.node(), name);
	}

	function styleValue(node, name) {
	  return node.style.getPropertyValue(name)
	      || window$1(node).getComputedStyle(node, null).getPropertyValue(name);
	}

	function propertyRemove(name) {
	  return function() {
	    delete this[name];
	  };
	}

	function propertyConstant(name, value) {
	  return function() {
	    this[name] = value;
	  };
	}

	function propertyFunction(name, value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    if (v == null) delete this[name];
	    else this[name] = v;
	  };
	}

	function selection_property(name, value) {
	  return arguments.length > 1
	      ? this.each((value == null
	          ? propertyRemove : typeof value === "function"
	          ? propertyFunction
	          : propertyConstant)(name, value))
	      : this.node()[name];
	}

	function classArray(string) {
	  return string.trim().split(/^|\s+/);
	}

	function classList(node) {
	  return node.classList || new ClassList(node);
	}

	function ClassList(node) {
	  this._node = node;
	  this._names = classArray(node.getAttribute("class") || "");
	}

	ClassList.prototype = {
	  add: function(name) {
	    var i = this._names.indexOf(name);
	    if (i < 0) {
	      this._names.push(name);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  remove: function(name) {
	    var i = this._names.indexOf(name);
	    if (i >= 0) {
	      this._names.splice(i, 1);
	      this._node.setAttribute("class", this._names.join(" "));
	    }
	  },
	  contains: function(name) {
	    return this._names.indexOf(name) >= 0;
	  }
	};

	function classedAdd(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.add(names[i]);
	}

	function classedRemove(node, names) {
	  var list = classList(node), i = -1, n = names.length;
	  while (++i < n) list.remove(names[i]);
	}

	function classedTrue(names) {
	  return function() {
	    classedAdd(this, names);
	  };
	}

	function classedFalse(names) {
	  return function() {
	    classedRemove(this, names);
	  };
	}

	function classedFunction(names, value) {
	  return function() {
	    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
	  };
	}

	function selection_classed(name, value) {
	  var names = classArray(name + "");

	  if (arguments.length < 2) {
	    var list = classList(this.node()), i = -1, n = names.length;
	    while (++i < n) if (!list.contains(names[i])) return false;
	    return true;
	  }

	  return this.each((typeof value === "function"
	      ? classedFunction : value
	      ? classedTrue
	      : classedFalse)(names, value));
	}

	function textRemove() {
	  this.textContent = "";
	}

	function textConstant(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.textContent = v == null ? "" : v;
	  };
	}

	function selection_text(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? textRemove : (typeof value === "function"
	          ? textFunction
	          : textConstant)(value))
	      : this.node().textContent;
	}

	function htmlRemove() {
	  this.innerHTML = "";
	}

	function htmlConstant(value) {
	  return function() {
	    this.innerHTML = value;
	  };
	}

	function htmlFunction(value) {
	  return function() {
	    var v = value.apply(this, arguments);
	    this.innerHTML = v == null ? "" : v;
	  };
	}

	function selection_html(value) {
	  return arguments.length
	      ? this.each(value == null
	          ? htmlRemove : (typeof value === "function"
	          ? htmlFunction
	          : htmlConstant)(value))
	      : this.node().innerHTML;
	}

	function raise$1() {
	  if (this.nextSibling) this.parentNode.appendChild(this);
	}

	function selection_raise() {
	  return this.each(raise$1);
	}

	function lower() {
	  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
	}

	function selection_lower() {
	  return this.each(lower);
	}

	function selection_append(name) {
	  var create = typeof name === "function" ? name : creator(name);
	  return this.select(function() {
	    return this.appendChild(create.apply(this, arguments));
	  });
	}

	function constantNull() {
	  return null;
	}

	function selection_insert(name, before) {
	  var create = typeof name === "function" ? name : creator(name),
	      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
	  return this.select(function() {
	    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
	  });
	}

	function remove() {
	  var parent = this.parentNode;
	  if (parent) parent.removeChild(this);
	}

	function selection_remove() {
	  return this.each(remove);
	}

	function selection_cloneShallow() {
	  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
	}

	function selection_cloneDeep() {
	  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
	}

	function selection_clone(deep) {
	  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
	}

	function selection_datum(value) {
	  return arguments.length
	      ? this.property("__data__", value)
	      : this.node().__data__;
	}

	var filterEvents = {};

	var event = null;

	if (typeof document !== "undefined") {
	  var element$1 = document.documentElement;
	  if (!("onmouseenter" in element$1)) {
	    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
	  }
	}

	function filterContextListener(listener, index, group) {
	  listener = contextListener(listener, index, group);
	  return function(event) {
	    var related = event.relatedTarget;
	    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
	      listener.call(this, event);
	    }
	  };
	}

	function contextListener(listener, index, group) {
	  return function(event1) {
	    var event0 = event; // Events can be reentrant (e.g., focus).
	    event = event1;
	    try {
	      listener.call(this, this.__data__, index, group);
	    } finally {
	      event = event0;
	    }
	  };
	}

	function parseTypenames(typenames) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    return {type: t, name: name};
	  });
	}

	function onRemove(typename) {
	  return function() {
	    var on = this.__on;
	    if (!on) return;
	    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
	      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	      } else {
	        on[++i] = o;
	      }
	    }
	    if (++i) on.length = i;
	    else delete this.__on;
	  };
	}

	function onAdd(typename, value, capture) {
	  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
	  return function(d, i, group) {
	    var on = this.__on, o, listener = wrap(value, i, group);
	    if (on) for (var j = 0, m = on.length; j < m; ++j) {
	      if ((o = on[j]).type === typename.type && o.name === typename.name) {
	        this.removeEventListener(o.type, o.listener, o.capture);
	        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
	        o.value = value;
	        return;
	      }
	    }
	    this.addEventListener(typename.type, listener, capture);
	    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
	    if (!on) this.__on = [o];
	    else on.push(o);
	  };
	}

	function selection_on(typename, value, capture) {
	  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

	  if (arguments.length < 2) {
	    var on = this.node().__on;
	    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
	      for (i = 0, o = on[j]; i < n; ++i) {
	        if ((t = typenames[i]).type === o.type && t.name === o.name) {
	          return o.value;
	        }
	      }
	    }
	    return;
	  }

	  on = value ? onAdd : onRemove;
	  if (capture == null) capture = false;
	  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
	  return this;
	}

	function customEvent(event1, listener, that, args) {
	  var event0 = event;
	  event1.sourceEvent = event;
	  event = event1;
	  try {
	    return listener.apply(that, args);
	  } finally {
	    event = event0;
	  }
	}

	function dispatchEvent(node, type, params) {
	  var window = window$1(node),
	      event = window.CustomEvent;

	  if (typeof event === "function") {
	    event = new event(type, params);
	  } else {
	    event = window.document.createEvent("Event");
	    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
	    else event.initEvent(type, false, false);
	  }

	  node.dispatchEvent(event);
	}

	function dispatchConstant(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params);
	  };
	}

	function dispatchFunction(type, params) {
	  return function() {
	    return dispatchEvent(this, type, params.apply(this, arguments));
	  };
	}

	function selection_dispatch(type, params) {
	  return this.each((typeof params === "function"
	      ? dispatchFunction
	      : dispatchConstant)(type, params));
	}

	var root = [null];

	function Selection(groups, parents) {
	  this._groups = groups;
	  this._parents = parents;
	}

	function selection() {
	  return new Selection([[document.documentElement]], root);
	}

	Selection.prototype = selection.prototype = {
	  constructor: Selection,
	  select: selection_select,
	  selectAll: selection_selectAll,
	  filter: selection_filter,
	  data: selection_data,
	  enter: selection_enter,
	  exit: selection_exit,
	  merge: selection_merge,
	  order: selection_order,
	  sort: selection_sort,
	  call: selection_call,
	  nodes: selection_nodes,
	  node: selection_node,
	  size: selection_size,
	  empty: selection_empty,
	  each: selection_each,
	  attr: selection_attr,
	  style: selection_style,
	  property: selection_property,
	  classed: selection_classed,
	  text: selection_text,
	  html: selection_html,
	  raise: selection_raise,
	  lower: selection_lower,
	  append: selection_append,
	  insert: selection_insert,
	  remove: selection_remove,
	  clone: selection_clone,
	  datum: selection_datum,
	  on: selection_on,
	  dispatch: selection_dispatch
	};

	function select(selector) {
	  return typeof selector === "string"
	      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
	      : new Selection([[selector]], root);
	}

	function sourceEvent() {
	  var current = event, source;
	  while (source = current.sourceEvent) current = source;
	  return current;
	}

	function point$1(node, event) {
	  var svg = node.ownerSVGElement || node;

	  if (svg.createSVGPoint) {
	    var point = svg.createSVGPoint();
	    point.x = event.clientX, point.y = event.clientY;
	    point = point.matrixTransform(node.getScreenCTM().inverse());
	    return [point.x, point.y];
	  }

	  var rect = node.getBoundingClientRect();
	  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
	}

	function mouse(node) {
	  var event = sourceEvent();
	  if (event.changedTouches) event = event.changedTouches[0];
	  return point$1(node, event);
	}

	function touch(node, touches, identifier) {
	  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

	  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
	    if ((touch = touches[i]).identifier === identifier) {
	      return point$1(node, touch);
	    }
	  }

	  return null;
	}

	var noop = {value: function() {}};

	function dispatch() {
	  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
	    if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
	    _[t] = [];
	  }
	  return new Dispatch(_);
	}

	function Dispatch(_) {
	  this._ = _;
	}

	function parseTypenames$1(typenames, types) {
	  return typenames.trim().split(/^|\s+/).map(function(t) {
	    var name = "", i = t.indexOf(".");
	    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
	    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
	    return {type: t, name: name};
	  });
	}

	Dispatch.prototype = dispatch.prototype = {
	  constructor: Dispatch,
	  on: function(typename, callback) {
	    var _ = this._,
	        T = parseTypenames$1(typename + "", _),
	        t,
	        i = -1,
	        n = T.length;

	    // If no callback was specified, return the callback of the given type and name.
	    if (arguments.length < 2) {
	      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
	      return;
	    }

	    // If a type was specified, set the callback for the given type and name.
	    // Otherwise, if a null callback was specified, remove callbacks of the given name.
	    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
	    while (++i < n) {
	      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
	      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
	    }

	    return this;
	  },
	  copy: function() {
	    var copy = {}, _ = this._;
	    for (var t in _) copy[t] = _[t].slice();
	    return new Dispatch(copy);
	  },
	  call: function(type, that) {
	    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  },
	  apply: function(type, that, args) {
	    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
	  }
	};

	function get(type, name) {
	  for (var i = 0, n = type.length, c; i < n; ++i) {
	    if ((c = type[i]).name === name) {
	      return c.value;
	    }
	  }
	}

	function set$1(type, name, callback) {
	  for (var i = 0, n = type.length; i < n; ++i) {
	    if (type[i].name === name) {
	      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
	      break;
	    }
	  }
	  if (callback != null) type.push({name: name, value: callback});
	  return type;
	}

	var EOL = {},
	    EOF = {},
	    QUOTE = 34,
	    NEWLINE = 10,
	    RETURN = 13;

	function objectConverter(columns) {
	  return new Function("d", "return {" + columns.map(function(name, i) {
	    return JSON.stringify(name) + ": d[" + i + "]";
	  }).join(",") + "}");
	}

	function customConverter(columns, f) {
	  var object = objectConverter(columns);
	  return function(row, i) {
	    return f(object(row), i, columns);
	  };
	}

	// Compute unique columns in order of discovery.
	function inferColumns(rows) {
	  var columnSet = Object.create(null),
	      columns = [];

	  rows.forEach(function(row) {
	    for (var column in row) {
	      if (!(column in columnSet)) {
	        columns.push(columnSet[column] = column);
	      }
	    }
	  });

	  return columns;
	}

	function dsv(delimiter) {
	  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
	      DELIMITER = delimiter.charCodeAt(0);

	  function parse(text, f) {
	    var convert, columns, rows = parseRows(text, function(row, i) {
	      if (convert) return convert(row, i - 1);
	      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
	    });
	    rows.columns = columns || [];
	    return rows;
	  }

	  function parseRows(text, f) {
	    var rows = [], // output rows
	        N = text.length,
	        I = 0, // current character index
	        n = 0, // current line number
	        t, // current token
	        eof = N <= 0, // current token followed by EOF?
	        eol = false; // current token followed by EOL?

	    // Strip the trailing newline.
	    if (text.charCodeAt(N - 1) === NEWLINE) --N;
	    if (text.charCodeAt(N - 1) === RETURN) --N;

	    function token() {
	      if (eof) return EOF;
	      if (eol) return eol = false, EOL;

	      // Unescape quotes.
	      var i, j = I, c;
	      if (text.charCodeAt(j) === QUOTE) {
	        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
	        if ((i = I) >= N) eof = true;
	        else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
	        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
	        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
	      }

	      // Find next delimiter or newline.
	      while (I < N) {
	        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
	        else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
	        else if (c !== DELIMITER) continue;
	        return text.slice(j, i);
	      }

	      // Return last token before EOF.
	      return eof = true, text.slice(j, N);
	    }

	    while ((t = token()) !== EOF) {
	      var row = [];
	      while (t !== EOL && t !== EOF) row.push(t), t = token();
	      if (f && (row = f(row, n++)) == null) continue;
	      rows.push(row);
	    }

	    return rows;
	  }

	  function format(rows, columns) {
	    if (columns == null) columns = inferColumns(rows);
	    return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
	      return columns.map(function(column) {
	        return formatValue(row[column]);
	      }).join(delimiter);
	    })).join("\n");
	  }

	  function formatRows(rows) {
	    return rows.map(formatRow).join("\n");
	  }

	  function formatRow(row) {
	    return row.map(formatValue).join(delimiter);
	  }

	  function formatValue(text) {
	    return text == null ? ""
	        : reFormat.test(text += "") ? "\"" + text.replace(/"/g, "\"\"") + "\""
	        : text;
	  }

	  return {
	    parse: parse,
	    parseRows: parseRows,
	    format: format,
	    formatRows: formatRows
	  };
	}

	var csv = dsv(",");

	var csvParse = csv.parse;
	var csvParseRows = csv.parseRows;

	var tsv = dsv("\t");

	var pi = Math.PI,
	    tau = 2 * pi,
	    epsilon = 1e-6,
	    tauEpsilon = tau - epsilon;

	function Path() {
	  this._x0 = this._y0 = // start of current subpath
	  this._x1 = this._y1 = null; // end of current subpath
	  this._ = "";
	}

	function path() {
	  return new Path;
	}

	Path.prototype = path.prototype = {
	  constructor: Path,
	  moveTo: function(x, y) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
	  },
	  closePath: function() {
	    if (this._x1 !== null) {
	      this._x1 = this._x0, this._y1 = this._y0;
	      this._ += "Z";
	    }
	  },
	  lineTo: function(x, y) {
	    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  quadraticCurveTo: function(x1, y1, x, y) {
	    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
	    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  arcTo: function(x1, y1, x2, y2, r) {
	    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
	    var x0 = this._x1,
	        y0 = this._y1,
	        x21 = x2 - x1,
	        y21 = y2 - y1,
	        x01 = x0 - x1,
	        y01 = y0 - y1,
	        l01_2 = x01 * x01 + y01 * y01;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x1,y1).
	    if (this._x1 === null) {
	      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
	    }

	    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
	    else if (!(l01_2 > epsilon)) ;

	    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
	    // Equivalently, is (x1,y1) coincident with (x2,y2)?
	    // Or, is the radius zero? Line to (x1,y1).
	    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
	      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
	    }

	    // Otherwise, draw an arc!
	    else {
	      var x20 = x2 - x0,
	          y20 = y2 - y0,
	          l21_2 = x21 * x21 + y21 * y21,
	          l20_2 = x20 * x20 + y20 * y20,
	          l21 = Math.sqrt(l21_2),
	          l01 = Math.sqrt(l01_2),
	          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
	          t01 = l / l01,
	          t21 = l / l21;

	      // If the start tangent is not coincident with (x0,y0), line to.
	      if (Math.abs(t01 - 1) > epsilon) {
	        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
	      }

	      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
	    }
	  },
	  arc: function(x, y, r, a0, a1, ccw) {
	    x = +x, y = +y, r = +r;
	    var dx = r * Math.cos(a0),
	        dy = r * Math.sin(a0),
	        x0 = x + dx,
	        y0 = y + dy,
	        cw = 1 ^ ccw,
	        da = ccw ? a0 - a1 : a1 - a0;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x0,y0).
	    if (this._x1 === null) {
	      this._ += "M" + x0 + "," + y0;
	    }

	    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
	    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
	      this._ += "L" + x0 + "," + y0;
	    }

	    // Is this arc empty? We’re done.
	    if (!r) return;

	    // Does the angle go the wrong way? Flip the direction.
	    if (da < 0) da = da % tau + tau;

	    // Is this a complete circle? Draw two arcs to complete the circle.
	    if (da > tauEpsilon) {
	      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
	    }

	    // Is this arc non-empty? Draw an arc!
	    else if (da > epsilon) {
	      this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
	    }
	  },
	  rect: function(x, y, w, h) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
	  },
	  toString: function() {
	    return this._;
	  }
	};

	function constant$4(x) {
	  return function constant() {
	    return x;
	  };
	}

	var pi$1 = Math.PI;

	function Linear(context) {
	  this._context = context;
	}

	Linear.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; // proceed
	      default: this._context.lineTo(x, y); break;
	    }
	  }
	};

	function curveLinear(context) {
	  return new Linear(context);
	}

	function x(p) {
	  return p[0];
	}

	function y(p) {
	  return p[1];
	}

	function line() {
	  var x$$1 = x,
	      y$$1 = y,
	      defined = constant$4(true),
	      context = null,
	      curve = curveLinear,
	      output = null;

	  function line(data) {
	    var i,
	        n = data.length,
	        d,
	        defined0 = false,
	        buffer;

	    if (context == null) output = curve(buffer = path());

	    for (i = 0; i <= n; ++i) {
	      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
	        if (defined0 = !defined0) output.lineStart();
	        else output.lineEnd();
	      }
	      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
	    }

	    if (buffer) return output = null, buffer + "" || null;
	  }

	  line.x = function(_) {
	    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$4(+_), line) : x$$1;
	  };

	  line.y = function(_) {
	    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$4(+_), line) : y$$1;
	  };

	  line.defined = function(_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), line) : defined;
	  };

	  line.curve = function(_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	  };

	  line.context = function(_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	  };

	  return line;
	}

	function area() {
	  var x0 = x,
	      x1 = null,
	      y0 = constant$4(0),
	      y1 = y,
	      defined = constant$4(true),
	      context = null,
	      curve = curveLinear,
	      output = null;

	  function area(data) {
	    var i,
	        j,
	        k,
	        n = data.length,
	        d,
	        defined0 = false,
	        buffer,
	        x0z = new Array(n),
	        y0z = new Array(n);

	    if (context == null) output = curve(buffer = path());

	    for (i = 0; i <= n; ++i) {
	      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
	        if (defined0 = !defined0) {
	          j = i;
	          output.areaStart();
	          output.lineStart();
	        } else {
	          output.lineEnd();
	          output.lineStart();
	          for (k = i - 1; k >= j; --k) {
	            output.point(x0z[k], y0z[k]);
	          }
	          output.lineEnd();
	          output.areaEnd();
	        }
	      }
	      if (defined0) {
	        x0z[i] = +x0(d, i, data), y0z[i] = +y0(d, i, data);
	        output.point(x1 ? +x1(d, i, data) : x0z[i], y1 ? +y1(d, i, data) : y0z[i]);
	      }
	    }

	    if (buffer) return output = null, buffer + "" || null;
	  }

	  function arealine() {
	    return line().defined(defined).curve(curve).context(context);
	  }

	  area.x = function(_) {
	    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), x1 = null, area) : x0;
	  };

	  area.x0 = function(_) {
	    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$4(+_), area) : x0;
	  };

	  area.x1 = function(_) {
	    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : x1;
	  };

	  area.y = function(_) {
	    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), y1 = null, area) : y0;
	  };

	  area.y0 = function(_) {
	    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$4(+_), area) : y0;
	  };

	  area.y1 = function(_) {
	    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$4(+_), area) : y1;
	  };

	  area.lineX0 =
	  area.lineY0 = function() {
	    return arealine().x(x0).y(y0);
	  };

	  area.lineY1 = function() {
	    return arealine().x(x0).y(y1);
	  };

	  area.lineX1 = function() {
	    return arealine().x(x1).y(y0);
	  };

	  area.defined = function(_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), area) : defined;
	  };

	  area.curve = function(_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
	  };

	  area.context = function(_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
	  };

	  return area;
	}

	var slice$2 = Array.prototype.slice;

	function point$2(that, x, y) {
	  that._context.bezierCurveTo(
	    (2 * that._x0 + that._x1) / 3,
	    (2 * that._y0 + that._y1) / 3,
	    (that._x0 + 2 * that._x1) / 3,
	    (that._y0 + 2 * that._y1) / 3,
	    (that._x0 + 4 * that._x1 + x) / 6,
	    (that._y0 + 4 * that._y1 + y) / 6
	  );
	}

	function Basis(context) {
	  this._context = context;
	}

	Basis.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 =
	    this._y0 = this._y1 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 3: point$2(this, this._x1, this._y1); // proceed
	      case 2: this._context.lineTo(this._x1, this._y1); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6); // proceed
	      default: point$2(this, x, y); break;
	    }
	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	  }
	};

	function curveBasis(context) {
	  return new Basis(context);
	}

	function sign(x) {
	  return x < 0 ? -1 : 1;
	}

	// Calculate the slopes of the tangents (Hermite-type interpolation) based on
	// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
	// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
	// NOV(II), P. 443, 1990.
	function slope3(that, x2, y2) {
	  var h0 = that._x1 - that._x0,
	      h1 = x2 - that._x1,
	      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
	      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
	      p = (s0 * h1 + s1 * h0) / (h0 + h1);
	  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
	}

	// Calculate a one-sided slope.
	function slope2(that, t) {
	  var h = that._x1 - that._x0;
	  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
	}

	// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
	// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
	// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
	function point$5(that, t0, t1) {
	  var x0 = that._x0,
	      y0 = that._y0,
	      x1 = that._x1,
	      y1 = that._y1,
	      dx = (x1 - x0) / 3;
	  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
	}

	function MonotoneX(context) {
	  this._context = context;
	}

	MonotoneX.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 =
	    this._y0 = this._y1 =
	    this._t0 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 2: this._context.lineTo(this._x1, this._y1); break;
	      case 3: point$5(this, this._t0, slope2(this, this._t0)); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    var t1 = NaN;

	    x = +x, y = +y;
	    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; point$5(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
	      default: point$5(this, this._t0, t1 = slope3(this, x, y)); break;
	    }

	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	    this._t0 = t1;
	  }
	};

	function MonotoneY(context) {
	  this._context = new ReflectContext(context);
	}

	(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
	  MonotoneX.prototype.point.call(this, y, x);
	};

	function ReflectContext(context) {
	  this._context = context;
	}

	ReflectContext.prototype = {
	  moveTo: function(x, y) { this._context.moveTo(y, x); },
	  closePath: function() { this._context.closePath(); },
	  lineTo: function(x, y) { this._context.lineTo(y, x); },
	  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
	};

	function Natural(context) {
	  this._context = context;
	}

	Natural.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x = [];
	    this._y = [];
	  },
	  lineEnd: function() {
	    var x = this._x,
	        y = this._y,
	        n = x.length;

	    if (n) {
	      this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
	      if (n === 2) {
	        this._context.lineTo(x[1], y[1]);
	      } else {
	        var px = controlPoints(x),
	            py = controlPoints(y);
	        for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
	          this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
	        }
	      }
	    }

	    if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	    this._x = this._y = null;
	  },
	  point: function(x, y) {
	    this._x.push(+x);
	    this._y.push(+y);
	  }
	};

	// See https://www.particleincell.com/2012/bezier-splines/ for derivation.
	function controlPoints(x) {
	  var i,
	      n = x.length - 1,
	      m,
	      a = new Array(n),
	      b = new Array(n),
	      r = new Array(n);
	  a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
	  for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
	  a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
	  for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
	  a[n - 1] = r[n - 1] / b[n - 1];
	  for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
	  b[n - 1] = (x[n] + a[n - 1]) / 2;
	  for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
	  return [a, b];
	}

	function curveNatural(context) {
	  return new Natural(context);
	}

	function Step(context, t) {
	  this._context = context;
	  this._t = t;
	}

	Step.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x = this._y = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (0 < this._t && this._t < 1 && this._point === 2) this._context.lineTo(this._x, this._y);
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    if (this._line >= 0) this._t = 1 - this._t, this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; // proceed
	      default: {
	        if (this._t <= 0) {
	          this._context.lineTo(this._x, y);
	          this._context.lineTo(x, y);
	        } else {
	          var x1 = this._x * (1 - this._t) + x * this._t;
	          this._context.lineTo(x1, this._y);
	          this._context.lineTo(x1, y);
	        }
	        break;
	      }
	    }
	    this._x = x, this._y = y;
	  }
	};

	function curveStep(context) {
	  return new Step(context, 0.5);
	}

	function stepBefore(context) {
	  return new Step(context, 0);
	}

	function stepAfter(context) {
	  return new Step(context, 1);
	}

	function none$1(series, order) {
	  if (!((n = series.length) > 1)) return;
	  for (var i = 1, j, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
	    s0 = s1, s1 = series[order[i]];
	    for (j = 0; j < m; ++j) {
	      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
	    }
	  }
	}

	function none$2(series) {
	  var n = series.length, o = new Array(n);
	  while (--n >= 0) o[n] = n;
	  return o;
	}

	function stackValue(d, key) {
	  return d[key];
	}

	function stack() {
	  var keys = constant$4([]),
	      order = none$2,
	      offset = none$1,
	      value = stackValue;

	  function stack(data) {
	    var kz = keys.apply(this, arguments),
	        i,
	        m = data.length,
	        n = kz.length,
	        sz = new Array(n),
	        oz;

	    for (i = 0; i < n; ++i) {
	      for (var ki = kz[i], si = sz[i] = new Array(m), j = 0, sij; j < m; ++j) {
	        si[j] = sij = [0, +value(data[j], ki, j, data)];
	        sij.data = data[j];
	      }
	      si.key = ki;
	    }

	    for (i = 0, oz = order(sz); i < n; ++i) {
	      sz[oz[i]].index = i;
	    }

	    offset(sz, oz);
	    return sz;
	  }

	  stack.keys = function(_) {
	    return arguments.length ? (keys = typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : keys;
	  };

	  stack.value = function(_) {
	    return arguments.length ? (value = typeof _ === "function" ? _ : constant$4(+_), stack) : value;
	  };

	  stack.order = function(_) {
	    return arguments.length ? (order = _ == null ? none$2 : typeof _ === "function" ? _ : constant$4(slice$2.call(_)), stack) : order;
	  };

	  stack.offset = function(_) {
	    return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
	  };

	  return stack;
	}

	// defined in rollup.config.js
	var bucket = "chartprod";

	var toString$1 = {}.toString;

	var _cof$1 = function (it) {
	  return toString$1.call(it).slice(8, -1);
	};

	var _core$1 = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.5.7' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1$1 = _core$1.version;

	var _global$1 = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _shared$1 = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global$1[SHARED] || (_global$1[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core$1.version,
	  mode: 'global',
	  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id$1 = 0;
	var px$1 = Math.random();
	var _uid$1 = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px$1).toString(36));
	};

	var _wks = createCommonjsModule(function (module) {
	var store = _shared$1('wks');

	var Symbol = _global$1.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid$1)('Symbol.' + name));
	};

	$exports.store = store;
	});

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG = _wks('toStringTag');
	// ES3 wrong here
	var ARG = _cof$1(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof$1(O)
	    // ES3 arguments fallback
	    : (B = _cof$1(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var _isObject$1 = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject$1 = function (it) {
	  if (!_isObject$1(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails$1 = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors$1 = !_fails$1(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document$2 = _global$1.document;
	// typeof document.createElement is 'object' in old IE
	var is$1 = _isObject$1(document$2) && _isObject$1(document$2.createElement);
	var _domCreate$1 = function (it) {
	  return is$1 ? document$2.createElement(it) : {};
	};

	var _ie8DomDefine$1 = !_descriptors$1 && !_fails$1(function () {
	  return Object.defineProperty(_domCreate$1('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive$1 = function (it, S) {
	  if (!_isObject$1(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject$1(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject$1(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject$1(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP$1 = Object.defineProperty;

	var f$3 = _descriptors$1 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject$1(O);
	  P = _toPrimitive$1(P, true);
	  _anObject$1(Attributes);
	  if (_ie8DomDefine$1) try {
	    return dP$1(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp$1 = {
		f: f$3
	};

	var _propertyDesc$1 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide$1 = _descriptors$1 ? function (object, key, value) {
	  return _objectDp$1.f(object, key, _propertyDesc$1(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty$1 = {}.hasOwnProperty;
	var _has$1 = function (it, key) {
	  return hasOwnProperty$1.call(it, key);
	};

	var _redefine = createCommonjsModule(function (module) {
	var SRC = _uid$1('src');
	var TO_STRING = 'toString';
	var $toString = Function[TO_STRING];
	var TPL = ('' + $toString).split(TO_STRING);

	_core$1.inspectSource = function (it) {
	  return $toString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) _has$1(val, 'name') || _hide$1(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) _has$1(val, SRC) || _hide$1(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === _global$1) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    _hide$1(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    _hide$1(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});
	});

	// 19.1.3.6 Object.prototype.toString()

	var test = {};
	test[_wks('toStringTag')] = 'z';
	if (test + '' != '[object z]') {
	  _redefine(Object.prototype, 'toString', function toString() {
	    return '[object ' + _classof(this) + ']';
	  }, true);
	}

	// 7.1.4 ToInteger
	var ceil$1 = Math.ceil;
	var floor$1 = Math.floor;
	var _toInteger$1 = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor$1 : ceil$1)(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined$1 = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined$1(that));
	    var i = _toInteger$1(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _aFunction$1 = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx$1 = function (fn, that, length) {
	  _aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE$1 = 'prototype';

	var $export$1 = function (type, name, source) {
	  var IS_FORCED = type & $export$1.F;
	  var IS_GLOBAL = type & $export$1.G;
	  var IS_STATIC = type & $export$1.S;
	  var IS_PROTO = type & $export$1.P;
	  var IS_BIND = type & $export$1.B;
	  var target = IS_GLOBAL ? _global$1 : IS_STATIC ? _global$1[name] || (_global$1[name] = {}) : (_global$1[name] || {})[PROTOTYPE$1];
	  var exports = IS_GLOBAL ? _core$1 : _core$1[name] || (_core$1[name] = {});
	  var expProto = exports[PROTOTYPE$1] || (exports[PROTOTYPE$1] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? _ctx$1(out, _global$1) : IS_PROTO && typeof out == 'function' ? _ctx$1(Function.call, out) : out;
	    // extend global
	    if (target) _redefine(target, key, out, type & $export$1.U);
	    // export
	    if (exports[key] != out) _hide$1(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	_global$1.core = _core$1;
	// type bitmap
	$export$1.F = 1;   // forced
	$export$1.G = 2;   // global
	$export$1.S = 4;   // static
	$export$1.P = 8;   // proto
	$export$1.B = 16;  // bind
	$export$1.W = 32;  // wrap
	$export$1.U = 64;  // safe
	$export$1.R = 128; // real proto method for `library`
	var _export$1 = $export$1;

	var _iterators = {};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject$1 = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof$1(it) == 'String' ? it.split('') : Object(it);
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject$1 = function (it) {
	  return _iobject$1(_defined$1(it));
	};

	// 7.1.15 ToLength

	var min$4 = Math.min;
	var _toLength$1 = function (it) {
	  return it > 0 ? min$4(_toInteger$1(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max$3 = Math.max;
	var min$5 = Math.min;
	var _toAbsoluteIndex$1 = function (index, length) {
	  index = _toInteger$1(index);
	  return index < 0 ? max$3(index + length, 0) : min$5(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes$1 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject$1($this);
	    var length = _toLength$1(O.length);
	    var index = _toAbsoluteIndex$1(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var shared$1 = _shared$1('keys');

	var _sharedKey$1 = function (key) {
	  return shared$1[key] || (shared$1[key] = _uid$1(key));
	};

	var arrayIndexOf$1 = _arrayIncludes$1(false);
	var IE_PROTO$1 = _sharedKey$1('IE_PROTO');

	var _objectKeysInternal$1 = function (object, names) {
	  var O = _toIobject$1(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO$1) _has$1(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has$1(O, key = names[i++])) {
	    ~arrayIndexOf$1(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys$1 = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys$1 = Object.keys || function keys(O) {
	  return _objectKeysInternal$1(O, _enumBugKeys$1);
	};

	var _objectDps = _descriptors$1 ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject$1(O);
	  var keys = _objectKeys$1(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) _objectDp$1.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document$3 = _global$1.document;
	var _html = document$3 && document$3.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$2 = _sharedKey$1('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$2 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate$1('iframe');
	  var i = _enumBugKeys$1.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$2][_enumBugKeys$1[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$2] = _anObject$1(O);
	    result = new Empty();
	    Empty[PROTOTYPE$2] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$2] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var def = _objectDp$1.f;

	var TAG$1 = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has$1(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide$1(IteratorPrototype, _wks('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc$1(1, next) });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	// 7.1.13 ToObject(argument)

	var _toObject$1 = function (it) {
	  return Object(_defined$1(it));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$3 = _sharedKey$1('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject$1(O);
	  if (_has$1(O, IE_PROTO$3)) return O[IE_PROTO$3];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (typeof IteratorPrototype[ITERATOR] != 'function') _hide$1(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if (BUGGY || VALUES_BUG || !proto[ITERATOR]) {
	    _hide$1(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export$1(_export$1.P + _export$1.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var $at = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) _hide$1(ArrayProto, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject$1(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var ITERATOR$1 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;

	var DOMIterables = {
	  CSSRuleList: true, // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true, // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true, // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys$1(DOMIterables), i = 0; i < collections.length; i++) {
	  var NAME = collections[i];
	  var explicit = DOMIterables[NAME];
	  var Collection = _global$1[NAME];
	  var proto$1 = Collection && Collection.prototype;
	  var key;
	  if (proto$1) {
	    if (!proto$1[ITERATOR$1]) _hide$1(proto$1, ITERATOR$1, ArrayValues);
	    if (!proto$1[TO_STRING_TAG]) _hide$1(proto$1, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) if (!proto$1[key]) _redefine(proto$1, key, es6_array_iterator[key], true);
	  }
	}

	var _redefineAll = function (target, src, safe) {
	  for (var key in src) _redefine(target, key, src[key], safe);
	  return target;
	};

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	// call something on iterator step with safe closing on error

	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject$1(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject$1(ret.call(iterator));
	    throw e;
	  }
	};

	// check on default Array iterator

	var ITERATOR$2 = _wks('iterator');
	var ArrayProto$1 = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
	};

	var ITERATOR$3 = _wks('iterator');

	var core_getIteratorMethod = _core$1.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
	  var f = _ctx$1(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (_isArrayIter(iterFn)) for (length = _toLength$1(iterable.length); length > index; index++) {
	    result = entries ? f(_anObject$1(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = _iterCall(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;
	});

	var SPECIES = _wks('species');

	var _setSpecies = function (KEY) {
	  var C = _global$1[KEY];
	  if (_descriptors$1 && C && !C[SPECIES]) _objectDp$1.f(C, SPECIES, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var _meta = createCommonjsModule(function (module) {
	var META = _uid$1('meta');


	var setDesc = _objectDp$1.f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !_fails$1(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!_isObject$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!_has$1(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!_has$1(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !_has$1(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};
	});
	var _meta_1 = _meta.KEY;
	var _meta_2 = _meta.NEED;
	var _meta_3 = _meta.fastKey;
	var _meta_4 = _meta.getWeak;
	var _meta_5 = _meta.onFreeze;

	var _validateCollection = function (it, TYPE) {
	  if (!_isObject$1(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};

	var dP$2 = _objectDp$1.f;









	var fastKey = _meta.fastKey;

	var SIZE = _descriptors$1 ? '_s' : 'size';

	var getEntry = function (that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};

	var _collectionStrong = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      _anInstance(that, C, NAME, '_i');
	      that._t = NAME;         // collection type
	      that._i = _objectCreate(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    _redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = _validateCollection(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = _validateCollection(this, NAME);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        _validateCollection(this, NAME);
	        var f = _ctx$1(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(_validateCollection(this, NAME), key);
	      }
	    });
	    if (_descriptors$1) dP$2(C.prototype, 'size', {
	      get: function () {
	        return _validateCollection(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if (index !== 'F') that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function (C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    _iterDefine(C, NAME, function (iterated, kind) {
	      this._t = _validateCollection(iterated, NAME); // target
	      this._k = kind;                     // kind
	      this._l = undefined;                // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return _iterStep(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return _iterStep(0, entry.k);
	      if (kind == 'values') return _iterStep(0, entry.v);
	      return _iterStep(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    _setSpecies(NAME);
	  }
	};

	var ITERATOR$4 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$4]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$4]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$4] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	var f$4 = {}.propertyIsEnumerable;

	var _objectPie$1 = {
		f: f$4
	};

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$5 = _descriptors$1 ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject$1(O);
	  P = _toPrimitive$1(P, true);
	  if (_ie8DomDefine$1) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has$1(O, P)) return _propertyDesc$1(!_objectPie$1.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$5
	};

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */


	var check = function (O, proto) {
	  _anObject$1(O);
	  if (!_isObject$1(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = _ctx$1(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	var setPrototypeOf = _setProto.set;
	var _inheritIfRequired = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject$1(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  } return that;
	};

	var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = _global$1[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};
	  var fixMethod = function (KEY) {
	    var fn = proto[KEY];
	    _redefine(proto, KEY,
	      KEY == 'delete' ? function (a) {
	        return IS_WEAK && !_isObject$1(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'has' ? function has(a) {
	        return IS_WEAK && !_isObject$1(a) ? false : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'get' ? function get(a) {
	        return IS_WEAK && !_isObject$1(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
	      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
	        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
	    );
	  };
	  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !_fails$1(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    _redefineAll(C.prototype, methods);
	    _meta.NEED = true;
	  } else {
	    var instance = new C();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = _fails$1(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    var ACCEPT_ITERABLES = _iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && _fails$1(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new C();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });
	    if (!ACCEPT_ITERABLES) {
	      C = wrapper(function (target, iterable) {
	        _anInstance(target, C, NAME);
	        var that = _inheritIfRequired(new Base(), target, C);
	        if (iterable != undefined) _forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      });
	      C.prototype = proto;
	      proto.constructor = C;
	    }
	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
	    // weak collections should not contains .clear method
	    if (IS_WEAK && proto.clear) delete proto.clear;
	  }

	  _setToStringTag(C, NAME);

	  O[NAME] = C;
	  _export$1(_export$1.G + _export$1.W + _export$1.F * (C != Base), O);

	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

	var SET = 'Set';

	// 23.2 Set Objects
	var es6_set = _collection(SET, function (get) {
	  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value) {
	    return _collectionStrong.def(_validateCollection(this, SET), value = value === 0 ? 0 : value, value);
	  }
	}, _collectionStrong);

	var _arrayFromIterable = function (iter, ITERATOR) {
	  var result = [];
	  _forOf(iter, false, result.push, result, ITERATOR);
	  return result;
	};

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON


	var _collectionToJson = function (NAME) {
	  return function toJSON() {
	    if (_classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return _arrayFromIterable(this);
	  };
	};

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON


	_export$1(_export$1.P + _export$1.R, 'Set', { toJSON: _collectionToJson('Set') });

	// https://tc39.github.io/proposal-setmap-offrom/


	var _setCollectionOf = function (COLLECTION) {
	  _export$1(_export$1.S, COLLECTION, { of: function of() {
	    var length = arguments.length;
	    var A = new Array(length);
	    while (length--) A[length] = arguments[length];
	    return new this(A);
	  } });
	};

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
	_setCollectionOf('Set');

	// https://tc39.github.io/proposal-setmap-offrom/





	var _setCollectionFrom = function (COLLECTION) {
	  _export$1(_export$1.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
	    var mapFn = arguments[1];
	    var mapping, A, n, cb;
	    _aFunction$1(this);
	    mapping = mapFn !== undefined;
	    if (mapping) _aFunction$1(mapFn);
	    if (source == undefined) return new this();
	    A = [];
	    if (mapping) {
	      n = 0;
	      cb = _ctx$1(mapFn, arguments[2], 2);
	      _forOf(source, false, function (nextItem) {
	        A.push(cb(nextItem, n++));
	      });
	    } else {
	      _forOf(source, false, A.push, A);
	    }
	    return new this(A);
	  } });
	};

	// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
	_setCollectionFrom('Set');

	var set$2 = _core$1.Set;

	var _createProperty = function (object, index, value) {
	  if (index in object) _objectDp$1.f(object, index, _propertyDesc$1(0, value));
	  else object[index] = value;
	};

	_export$1(_export$1.S + _export$1.F * !_iterDetect(function (iter) { }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = _toObject$1(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = core_getIteratorMethod(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = _ctx$1(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = _toLength$1(O.length);
	      for (result = new C(length); length > index; index++) {
	        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

	var from = _core$1.Array.from;

	function debounce$1(fn, params, timeout, root) {
	  var timeoutID = -1;
	  return (function () {
	    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
	    timeoutID = root.setTimeout(function () {
	      fn(params);
	    }, timeout);
	  });
	}

	function clearChart(cont) {
	  if (typeof document !== 'undefined') {
	    var el = isElement(cont) ? cont : document.querySelector(cont);
	    while (el && el.querySelectorAll('svg').length) {
	      var svg = el.querySelectorAll('svg');
	      svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
	    }
	    while (el && el.querySelectorAll('div').length) {
	      var div = el.querySelectorAll('div');
	      div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
	    }
	  }
	  return cont;
	}

	function clearObj(obj) {
	  if (obj.chartObj) { obj.chartObj = undefined; }
	  return obj;
	}

	function getBounding(selector$$1, dimension) {
	  if (isElement(selector$$1)) {
	    return selector$$1.getBoundingClientRect()[dimension];
	  } else {
	    return document.querySelector(selector$$1).getBoundingClientRect()[dimension];
	  }

	}

	var TimeObj = function TimeObj() {
	  this.second = 1000;
	  this.minute = this.second * 60;
	  this.hour = this.minute * 60;
	  this.day = this.hour * 24;
	  this.week = this.day * 7;
	  this.month = this.day * 30;
	  this.year = this.day * 365;
	  this.today = new Date();
	};

	function wrapAnnoText(textNode) {
	  textNode.each(function() {

	    var text = select(this),
	      lineHeight = 1.0, // ems
	      x = text.attr('x'),
	      dy = parseFloat(text.attr('dy')) || 0;

	    var words = text.text().split('\n').reverse(),
	      line$$1 = [],
	      lineNumber = 0,
	      word,
	      tspan = text.text(null).append('tspan')
	        .attr('x', x)
	        .attr('dy', (dy + "em"));

	    while (word = words.pop()) {
	      line$$1.push(word);
	      tspan.text(line$$1.join(' '));
	      if (line$$1.length > 1) {
	        line$$1.pop();
	        tspan.text(line$$1.join(' '));
	        line$$1 = [word];
	        tspan = text.append('tspan')
	          .attr('x', x)
	          .attr('dy', ((++lineNumber > 0 ? lineHeight : 0) + "em"))
	          .text(word);
	      }
	    }
	  });
	}

	function wrapText(textNode, width) {

	  textNode.each(function() {

	    var text = select(this),
	      y = text.attr('y'),
	      lineHeight = 1.0, // ems
	      x = 0,
	      dy = parseFloat(text.attr('dy'));

	    var words = text.text().split(/\s+/).reverse(),
	      line$$1 = [],
	      lineNumber = 0,
	      word,
	      tspan = text.text(null).append('tspan')
	        .attr('x', x)
	        .attr('y', y)
	        .attr('dy', (dy + "em"));

	    while (word = words.pop()) {
	      line$$1.push(word);
	      tspan.text(line$$1.join(' '));
	      if (tspan.node().getComputedTextLength() > width && line$$1.length > 1) {
	        line$$1.pop();
	        tspan.text(line$$1.join(' '));
	        line$$1 = [word];
	        tspan = text.append('tspan')
	          .attr('x', x)
	          .attr('y', y)
	          .attr('dy', ((++lineNumber * lineHeight + dy) + "em"))
	          .text(word);
	      }
	    }
	  });
	}

	function timeDiff(d1, d2, tolerance, data) {

	  var diff = d2 - d1,
	    time = new TimeObj();

	  var ctx;

	  // returning the context
	  if ((diff / time.year) > tolerance) { ctx = 'years'; }
	  else if ((diff / time.month) > tolerance) { ctx = 'months'; }
	  else if ((diff / time.week) > tolerance) { ctx = 'weeks'; }
	  else if ((diff / time.day) > tolerance) { ctx = 'days'; }
	  else if ((diff / time.hour) > tolerance) { ctx = 'hours'; }
	  else if ((diff / time.min) > tolerance) { ctx = 'minutes'; }
	  else { ctx = 'days'; }
	  // if none of these work i feel bad for you son
	  // i've got 99 problems but an if/else ain't one

	  // data passed in, looking at drawing tips
	  if (data && (ctx === 'years' || ctx === 'months')) {
	    var uniqueDayValues = data.uniqueDayValues;
	    var uniqueMonthValues = data.uniqueMonthValues;

	    if (ctx === 'years') {
	      // if only one unique day value, but multiple unique month values, probably monthly data
	      if (uniqueDayValues.length === 1 && uniqueMonthValues.length > 1) { ctx = 'monthly'; }
	      // if many unique day values and multiple unique month values, probably months data
	      if (uniqueDayValues.length > 1 && uniqueMonthValues.length > 1) { ctx = 'months'; }
	    }

	    if (ctx == 'months') {
	      // if only one unique day value, and only one unique month values, probably annual data
	      if (uniqueDayValues.length === 1 && uniqueMonthValues.length === 1) { ctx = 'years'; }
	      // if only one unique day value and many unique months, probably monthly data
	      if (uniqueDayValues.length === 1 && uniqueMonthValues.length > 1) { ctx = 'monthly'; }
	    }
	  }

	  return ctx;

	}

	function timeInterval(data) {

	  var dataLength = data.length,
	    d1 = data[0].key,
	    d2 = data[dataLength - 1].key;

	  var intervals = [
	    { fn: years, step: 1 },
	    { fn: months, step: 3 }, // quarters
	    { fn: months, step: 1 },
	    { fn: days, step: 1 },
	    { fn: hours, step: 1 },
	    { fn: minutes, step: 1 }
	  ];

	  var ret;

	  for (var i = 0; i < intervals.length; i++) {
	    var intervalCandidate = intervals[i].fn(d1, d2, intervals[i].step).length;
	    if (intervalCandidate >= dataLength - 1) {
	      ret = intervalCandidate;
	      break;
	    }
	  }

	  return ret;

	}

	function getCurve(interp) {
	  switch (interp) {
	    case 'linear':
	      return curveLinear;
	    case 'step':
	      return curveStep;
	    case 'step-before':
	      return stepBefore;
	    case 'step-after':
	      return stepAfter;
	    case 'cardinal':
	    case 'monotone':
	    case 'natural':
	      return curveNatural;
	  }
	}

	function getTranslate(node) {
	  var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	  g.setAttributeNS(null, 'transform', node.getAttribute('transform'));
	  var matrix = g.transform.baseVal.consolidate().matrix;
	  return [matrix.e, matrix.f];
	}

	function getThumbnailPath(obj) {
	  var imgSettings = obj.image;
	  imgSettings.bucket = bucket;
	  var id = obj.id.replace(obj.prefix, '');

	  return ("https://s3.amazonaws.com/" + (imgSettings.bucket) + "/" + (imgSettings.base_path) + id + "/" + (imgSettings.filename) + "." + (imgSettings.extension));
	}

	function generateThumb(container, obj) {

	  var settings = new chartSettings();

	  var imgSettings = settings.image;

	  var cont = document.querySelector(container),
	    fallback = cont.querySelector(("." + (settings.prefix) + "base64img"));

	  if (imgSettings && imgSettings.enable && obj.data.id) {

	    var img = document.createElement('img');

	    img.setAttribute('src', getThumbnailPath(obj));
	    img.setAttribute('alt', obj.data.heading);
	    img.setAttribute('class', ((settings.prefix) + "thumbnail"));

	    cont.appendChild(img);

	  } else if (fallback) {

	    fallback.style.display = 'block';

	  }

	}

	function csvToTable(target, data) {
	  var parsedCSV = csvParseRows(data);
	  target.append('table').selectAll('tr')
	    .data(parsedCSV).enter()
	    .append('tr').selectAll('td')
	    .data(function (d) { return d; }).enter()
	    .append('td')
	    .text(function (d) { return d; });
	}

	function getUniqueValues(data) {
	  return Array.from(new Set(data));
	}

	function resolveObjectPath(path, obj) {
	  return path.split('.').reduce(function (prev, curr) {
	    return prev ? prev[curr] : undefined;
	  }, obj || self);
	}

	function getUniqueDateValues(data, type, key) {
	  var allDates = data.map(function (d) {
	    switch (type) {
	      case 'day': return resolveObjectPath(key, d).getDate();
	      case 'month': return resolveObjectPath(key, d).getMonth();
	      case 'year': return resolveObjectPath(key, d).getFullYear();
	    }
	  });
	  return getUniqueValues(allDates);
	}

	function isElement(el) {
	  var isString = typeof cont === 'string';
	  return !isString && el.nodeName;
	}

	/**
	 * Data parsing module. Takes a CSV and turns it into an Object, and optionally determines the formatting to use when parsing dates.
	 * @module utils/dataparse
	 */

	function inputDate(scaleType, defaultFormat, declaredFormat) {
	  if (scaleType === 'time' || scaleType === 'ordinal-time') {
	    return declaredFormat || defaultFormat;
	  } else {
	    return undefined;
	  }
	}

	function parse(csv, inputDateFormat, index, stacked, type) {

	  var val;

	  var firstVals = {};

	  var keys = csvParseRows(csv.match(/^.*$/m)[0])[0];

	  var groupingKey, dotSizingKey;

	  var isScatterplot = type && type === 'scatterplot';

	  if (isScatterplot) {
	    if (keys.length > 3) { groupingKey = keys[3]; }
	    if (keys.length >= 4) { dotSizingKey = keys[4]; }
	  }

	  if (groupingKey) { keys.splice(keys.indexOf(groupingKey), 1); }
	  if (dotSizingKey) { keys.splice(keys.indexOf(dotSizingKey), 1); }

	  var data = csvParse(csv, function (d, i) {

	    var obj = {};

	    if (inputDateFormat) {
	      var dateFormat = timeParse(inputDateFormat);
	      if (isScatterplot) {
	        obj.key = d[keys[0]];
	        // key will be along x-axis
	        d[keys[1]] = dateFormat(d[keys[1]]);
	      } else {
	        obj.key = dateFormat(d[keys[0]]);
	      }
	    } else {
	      obj.key = d[keys[0]];
	    }

	    if (groupingKey) { obj.group = d[groupingKey]; }
	    if (dotSizingKey) { obj.size = d[dotSizingKey]; }

	    obj.series = [];

	    for (var j = 1; j < keys.length; j++) {

	      var key = keys[j];

	      if (d[key] === 0 || d[key] === '') { d[key] = '__undefined__'; }

	      if (index) {

	        if (i === 0 && !firstVals[key]) {
	          firstVals[key] = d[key];
	        }

	        if (index === '0') {
	          val = ((d[key] / firstVals[key]) - 1) * 100;
	        } else {
	          val = (d[key] / firstVals[key]) * index;
	        }

	      } else {
	        val = d[key];
	      }

	      obj.series.push({
	        val: val,
	        key: key
	      });

	    }

	    return obj;

	  });

	  var groups = groupingKey ? getUniqueValues(data.map(function (d) { return d.group; })) : undefined;

	  var seriesAmount = data[0].series.length;

	  var stackedData;

	  if (stacked && keys.length > 2) {
	    var stackFn = stack().keys(keys.slice(1));
	    stackedData = stackFn(range(data.length).map(function (i) {
	      var o = {};
	      o[keys[0]] = data[i].key;
	      for (var j = 0; j < data[i].series.length; j++) {
	        if (!data[i].series[j].val || data[i].series[j].val === '__undefined__') {
	          o[data[i].series[j].key] = '0';
	        } else {
	          o[data[i].series[j].key] = data[i].series[j].val;
	        }
	      }
	      return o;
	    }));
	  }

	  var dateKey = isScatterplot ? 'series.0.val' : 'key',
	    uniqueDayValues = inputDateFormat ? getUniqueDateValues(data, 'day', dateKey) : undefined,
	    uniqueMonthValues = inputDateFormat ? getUniqueDateValues(data, 'month', dateKey) : undefined,
	    uniqueYearValues = inputDateFormat ? getUniqueDateValues(data, 'year', dateKey) : undefined;

	  return {
	    csv: csv,
	    inputDateFormat: inputDateFormat,
	    data: data,
	    seriesAmount: seriesAmount,
	    keys: keys,
	    stackedData: stackedData,
	    uniqueDayValues: uniqueDayValues,
	    uniqueMonthValues: uniqueMonthValues,
	    uniqueYearValues: uniqueYearValues,
	    groupingKey: groupingKey,
	    dotSizingKey: dotSizingKey,
	    groups: groups
	  };

	}

	function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function isFloat(n) {
	  return n === +n && n !== (n|0);
	}

	function isUndefined(val) {
	  return val === undefined ? true : false;
	}

	function extend$1(from, to) {

	  var target;

	  if (from == null || typeof from != 'object') { return from; }
	  if (from.constructor != Object && from.constructor != Array) { return from; }
	  if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
	    from.constructor == String || from.constructor == Number || from.constructor == Boolean)
	    { return new from.constructor(from); }

	  target = to || new from.constructor();

	  for (var name in from) {
	    target[name] = typeof target[name] == 'undefined' ? extend$1(from[name], null) : target[name];
	  }

	  return target;
	}

	function roundToPrecision(number, precision) {
	  var p = Math.pow(10, precision);
	  return Math.round(number * p) / p;
	}

	function recipe(obj) {

	  var t = extend$1(chartSettings),
	    embed = obj.data,
	    chart = embed.chart;

	  // I'm not a big fan of indenting stuff like this but making
	  // an exception in this case because eyes were bleeding

	  t.dispatch    = obj.dispatch;
	  t.version     = embed.version                 || t.version;
	  t.id          = obj.id                        || t.id;
	  t.heading     = embed.heading                 || t.heading;
	  t.qualifier   = embed.qualifier               || t.qualifier;
	  t.source      = embed.source                  || t.source;
	  t.customClass = chart.class                   || t.customClass;
	  t.xAxis       = extend$1(t.xAxis, chart.x_axis) || t.xAxis;
	  t.yAxis       = extend$1(t.yAxis, chart.y_axis) || t.yAxis;

	  var o = t.options,
	    co = chart.options;

	  // 'options' area of embed code
	  o.type          = chart.options.type          || o.type;
	  o.interpolation = chart.options.interpolation || o.interpolation;

	  o.social      = !isUndefined(co.social) === true ? co.social           : o.social;
	  o.share_data  = !isUndefined(co.share_data) === true ? co.share_data   : o.share_data;
	  o.stacked     = !isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
	  o.expanded    = !isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
	  o.head        = !isUndefined(co.head) === true ? co.head               : o.head;
	  o.legend      = !isUndefined(co.legend) === true ? co.legend           : o.legend;
	  o.qualifier   = !isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
	  o.footer      = !isUndefined(co.footer) === true ? co.footer           : o.footer;
	  o.x_axis      = !isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
	  o.y_axis      = !isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
	  o.tips        = !isUndefined(co.tips) === true ? co.tips               : o.tips;
	  o.annotations = !isUndefined(co.annotations) === true ? co.annotations : o.annotations;
	  o.index       = !isUndefined(co.indexed) === true ? co.indexed         : o.index;

	  //  these are specific to the t object and don't exist in the embed
	  t.baseClass        = embed.baseClass  || t.baseClass;
	  t.dimensions.width = embed.width      || t.dimensions.width;
	  t.prefix           = chart.prefix     || t.prefix;
	  t.exportable       = chart.exportable || t.exportable;
	  t.editable         = chart.editable   || t.editable;

	  if (t.exportable) {
	    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
	    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
	    if (chart.exportable.height) { t.dimensions.height = function () { return chart.exportable.height; }; }
	  }

	  if (chart.hasHours) { t.dateFormat += " " + (t.timeFormat); }

	  t.hasHours   = chart.hasHours   || t.hasHours;
	  t.dateFormat = chart.dateFormat || t.dateFormat;

	  t.dateFormat = inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
	  t.data = parse(chart.data, t.dateFormat, o.index, o.stacked, o.type) || t.data;

	  t.annotations = chart.annotations || t.annotations;
	  if (chart.annotationHandlers) { t.annotationHandlers = chart.annotationHandlers; }

	  if (!t.data.stackedData) { o.stacked = false; }

	  t.seriesHighlight = function () {
	    return (t.data.seriesAmount && t.data.seriesAmount <= 1) ? 1 : 0;
	  };

	  return t;

	}

	var frame = 0, // is an animation frame pending?
	    timeout = 0, // is a timeout pending?
	    interval = 0, // are any timers active?
	    pokeDelay = 1000, // how frequently we check for clock skew
	    taskHead,
	    taskTail,
	    clockLast = 0,
	    clockNow = 0,
	    clockSkew = 0,
	    clock = typeof performance === "object" && performance.now ? performance : Date,
	    setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function(f) { setTimeout(f, 17); };

	function now() {
	  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
	}

	function clearNow() {
	  clockNow = 0;
	}

	function Timer() {
	  this._call =
	  this._time =
	  this._next = null;
	}

	Timer.prototype = timer.prototype = {
	  constructor: Timer,
	  restart: function(callback, delay, time) {
	    if (typeof callback !== "function") throw new TypeError("callback is not a function");
	    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
	    if (!this._next && taskTail !== this) {
	      if (taskTail) taskTail._next = this;
	      else taskHead = this;
	      taskTail = this;
	    }
	    this._call = callback;
	    this._time = time;
	    sleep();
	  },
	  stop: function() {
	    if (this._call) {
	      this._call = null;
	      this._time = Infinity;
	      sleep();
	    }
	  }
	};

	function timer(callback, delay, time) {
	  var t = new Timer;
	  t.restart(callback, delay, time);
	  return t;
	}

	function timerFlush() {
	  now(); // Get the current time, if not already set.
	  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
	  var t = taskHead, e;
	  while (t) {
	    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
	    t = t._next;
	  }
	  --frame;
	}

	function wake() {
	  clockNow = (clockLast = clock.now()) + clockSkew;
	  frame = timeout = 0;
	  try {
	    timerFlush();
	  } finally {
	    frame = 0;
	    nap();
	    clockNow = 0;
	  }
	}

	function poke() {
	  var now = clock.now(), delay = now - clockLast;
	  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
	}

	function nap() {
	  var t0, t1 = taskHead, t2, time = Infinity;
	  while (t1) {
	    if (t1._call) {
	      if (time > t1._time) time = t1._time;
	      t0 = t1, t1 = t1._next;
	    } else {
	      t2 = t1._next, t1._next = null;
	      t1 = t0 ? t0._next = t2 : taskHead = t2;
	    }
	  }
	  taskTail = t0;
	  sleep(time);
	}

	function sleep(time) {
	  if (frame) return; // Soonest alarm already set, or will be.
	  if (timeout) timeout = clearTimeout(timeout);
	  var delay = time - clockNow;
	  if (delay > 24) {
	    if (time < Infinity) timeout = setTimeout(wake, delay);
	    if (interval) interval = clearInterval(interval);
	  } else {
	    if (!interval) clockLast = clockNow, interval = setInterval(poke, pokeDelay);
	    frame = 1, setFrame(wake);
	  }
	}

	function timeout$1(callback, delay, time) {
	  var t = new Timer;
	  delay = delay == null ? 0 : +delay;
	  t.restart(function(elapsed) {
	    t.stop();
	    callback(elapsed + delay);
	  }, delay, time);
	  return t;
	}

	var emptyOn = dispatch("start", "end", "interrupt");
	var emptyTween = [];

	var CREATED = 0;
	var SCHEDULED = 1;
	var STARTING = 2;
	var STARTED = 3;
	var RUNNING = 4;
	var ENDING = 5;
	var ENDED = 6;

	function schedule(node, name, id, index, group, timing) {
	  var schedules = node.__transition;
	  if (!schedules) node.__transition = {};
	  else if (id in schedules) return;
	  create$1(node, id, {
	    name: name,
	    index: index, // For context during callback.
	    group: group, // For context during callback.
	    on: emptyOn,
	    tween: emptyTween,
	    time: timing.time,
	    delay: timing.delay,
	    duration: timing.duration,
	    ease: timing.ease,
	    timer: null,
	    state: CREATED
	  });
	}

	function init(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
	  return schedule;
	}

	function set$3(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
	  return schedule;
	}

	function get$1(node, id) {
	  var schedule = node.__transition;
	  if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
	  return schedule;
	}

	function create$1(node, id, self) {
	  var schedules = node.__transition,
	      tween;

	  // Initialize the self timer when the transition is created.
	  // Note the actual delay is not known until the first callback!
	  schedules[id] = self;
	  self.timer = timer(schedule, 0, self.time);

	  function schedule(elapsed) {
	    self.state = SCHEDULED;
	    self.timer.restart(start, self.delay, self.time);

	    // If the elapsed delay is less than our first sleep, start immediately.
	    if (self.delay <= elapsed) start(elapsed - self.delay);
	  }

	  function start(elapsed) {
	    var i, j, n, o;

	    // If the state is not SCHEDULED, then we previously errored on start.
	    if (self.state !== SCHEDULED) return stop();

	    for (i in schedules) {
	      o = schedules[i];
	      if (o.name !== self.name) continue;

	      // While this element already has a starting transition during this frame,
	      // defer starting an interrupting transition until that transition has a
	      // chance to tick (and possibly end); see d3/d3-transition#54!
	      if (o.state === STARTED) return timeout$1(start);

	      // Interrupt the active transition, if any.
	      // Dispatch the interrupt event.
	      if (o.state === RUNNING) {
	        o.state = ENDED;
	        o.timer.stop();
	        o.on.call("interrupt", node, node.__data__, o.index, o.group);
	        delete schedules[i];
	      }

	      // Cancel any pre-empted transitions. No interrupt event is dispatched
	      // because the cancelled transitions never started. Note that this also
	      // removes this transition from the pending list!
	      else if (+i < id) {
	        o.state = ENDED;
	        o.timer.stop();
	        delete schedules[i];
	      }
	    }

	    // Defer the first tick to end of the current frame; see d3/d3#1576.
	    // Note the transition may be canceled after start and before the first tick!
	    // Note this must be scheduled before the start event; see d3/d3-transition#16!
	    // Assuming this is successful, subsequent callbacks go straight to tick.
	    timeout$1(function() {
	      if (self.state === STARTED) {
	        self.state = RUNNING;
	        self.timer.restart(tick, self.delay, self.time);
	        tick(elapsed);
	      }
	    });

	    // Dispatch the start event.
	    // Note this must be done before the tween are initialized.
	    self.state = STARTING;
	    self.on.call("start", node, node.__data__, self.index, self.group);
	    if (self.state !== STARTING) return; // interrupted
	    self.state = STARTED;

	    // Initialize the tween, deleting null tween.
	    tween = new Array(n = self.tween.length);
	    for (i = 0, j = -1; i < n; ++i) {
	      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
	        tween[++j] = o;
	      }
	    }
	    tween.length = j + 1;
	  }

	  function tick(elapsed) {
	    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
	        i = -1,
	        n = tween.length;

	    while (++i < n) {
	      tween[i].call(null, t);
	    }

	    // Dispatch the end event.
	    if (self.state === ENDING) {
	      self.on.call("end", node, node.__data__, self.index, self.group);
	      stop();
	    }
	  }

	  function stop() {
	    self.state = ENDED;
	    self.timer.stop();
	    delete schedules[id];
	    for (var i in schedules) return; // eslint-disable-line no-unused-vars
	    delete node.__transition;
	  }
	}

	function interrupt(node, name) {
	  var schedules = node.__transition,
	      schedule$$1,
	      active,
	      empty = true,
	      i;

	  if (!schedules) return;

	  name = name == null ? null : name + "";

	  for (i in schedules) {
	    if ((schedule$$1 = schedules[i]).name !== name) { empty = false; continue; }
	    active = schedule$$1.state > STARTING && schedule$$1.state < ENDING;
	    schedule$$1.state = ENDED;
	    schedule$$1.timer.stop();
	    if (active) schedule$$1.on.call("interrupt", node, node.__data__, schedule$$1.index, schedule$$1.group);
	    delete schedules[i];
	  }

	  if (empty) delete node.__transition;
	}

	function selection_interrupt(name) {
	  return this.each(function() {
	    interrupt(this, name);
	  });
	}

	function tweenRemove(id, name) {
	  var tween0, tween1;
	  return function() {
	    var schedule$$1 = set$3(this, id),
	        tween = schedule$$1.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = tween0 = tween;
	      for (var i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1 = tween1.slice();
	          tween1.splice(i, 1);
	          break;
	        }
	      }
	    }

	    schedule$$1.tween = tween1;
	  };
	}

	function tweenFunction(id, name, value) {
	  var tween0, tween1;
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    var schedule$$1 = set$3(this, id),
	        tween = schedule$$1.tween;

	    // If this node shared tween with the previous node,
	    // just assign the updated shared tween and we’re done!
	    // Otherwise, copy-on-write.
	    if (tween !== tween0) {
	      tween1 = (tween0 = tween).slice();
	      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
	        if (tween1[i].name === name) {
	          tween1[i] = t;
	          break;
	        }
	      }
	      if (i === n) tween1.push(t);
	    }

	    schedule$$1.tween = tween1;
	  };
	}

	function transition_tween(name, value) {
	  var id = this._id;

	  name += "";

	  if (arguments.length < 2) {
	    var tween = get$1(this.node(), id).tween;
	    for (var i = 0, n = tween.length, t; i < n; ++i) {
	      if ((t = tween[i]).name === name) {
	        return t.value;
	      }
	    }
	    return null;
	  }

	  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
	}

	function tweenValue(transition, name, value) {
	  var id = transition._id;

	  transition.each(function() {
	    var schedule$$1 = set$3(this, id);
	    (schedule$$1.value || (schedule$$1.value = {}))[name] = value.apply(this, arguments);
	  });

	  return function(node) {
	    return get$1(node, id).value[name];
	  };
	}

	function interpolate$1(a, b) {
	  var c;
	  return (typeof b === "number" ? interpolateNumber
	      : b instanceof color ? interpolateRgb
	      : (c = color(b)) ? (b = c, interpolateRgb)
	      : interpolateString)(a, b);
	}

	function attrRemove$1(name) {
	  return function() {
	    this.removeAttribute(name);
	  };
	}

	function attrRemoveNS$1(fullname) {
	  return function() {
	    this.removeAttributeNS(fullname.space, fullname.local);
	  };
	}

	function attrConstant$1(name, interpolate$$1, value1) {
	  var value00,
	      interpolate0;
	  return function() {
	    var value0 = this.getAttribute(name);
	    return value0 === value1 ? null
	        : value0 === value00 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value1);
	  };
	}

	function attrConstantNS$1(fullname, interpolate$$1, value1) {
	  var value00,
	      interpolate0;
	  return function() {
	    var value0 = this.getAttributeNS(fullname.space, fullname.local);
	    return value0 === value1 ? null
	        : value0 === value00 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value1);
	  };
	}

	function attrFunction$1(name, interpolate$$1, value) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var value0, value1 = value(this);
	    if (value1 == null) return void this.removeAttribute(name);
	    value0 = this.getAttribute(name);
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	function attrFunctionNS$1(fullname, interpolate$$1, value) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var value0, value1 = value(this);
	    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
	    value0 = this.getAttributeNS(fullname.space, fullname.local);
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	function transition_attr(name, value) {
	  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$1;
	  return this.attrTween(name, typeof value === "function"
	      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
	      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
	      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
	}

	function attrTweenNS(fullname, value) {
	  function tween() {
	    var node = this, i = value.apply(node, arguments);
	    return i && function(t) {
	      node.setAttributeNS(fullname.space, fullname.local, i(t));
	    };
	  }
	  tween._value = value;
	  return tween;
	}

	function attrTween(name, value) {
	  function tween() {
	    var node = this, i = value.apply(node, arguments);
	    return i && function(t) {
	      node.setAttribute(name, i(t));
	    };
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_attrTween(name, value) {
	  var key = "attr." + name;
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  var fullname = namespace(name);
	  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
	}

	function delayFunction(id, value) {
	  return function() {
	    init(this, id).delay = +value.apply(this, arguments);
	  };
	}

	function delayConstant(id, value) {
	  return value = +value, function() {
	    init(this, id).delay = value;
	  };
	}

	function transition_delay(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? delayFunction
	          : delayConstant)(id, value))
	      : get$1(this.node(), id).delay;
	}

	function durationFunction(id, value) {
	  return function() {
	    set$3(this, id).duration = +value.apply(this, arguments);
	  };
	}

	function durationConstant(id, value) {
	  return value = +value, function() {
	    set$3(this, id).duration = value;
	  };
	}

	function transition_duration(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each((typeof value === "function"
	          ? durationFunction
	          : durationConstant)(id, value))
	      : get$1(this.node(), id).duration;
	}

	function easeConstant(id, value) {
	  if (typeof value !== "function") throw new Error;
	  return function() {
	    set$3(this, id).ease = value;
	  };
	}

	function transition_ease(value) {
	  var id = this._id;

	  return arguments.length
	      ? this.each(easeConstant(id, value))
	      : get$1(this.node(), id).ease;
	}

	function transition_filter(match) {
	  if (typeof match !== "function") match = matcher$1(match);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
	      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
	        subgroup.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, this._name, this._id);
	}

	function transition_merge(transition$$1) {
	  if (transition$$1._id !== this._id) throw new Error;

	  for (var groups0 = this._groups, groups1 = transition$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
	    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
	      if (node = group0[i] || group1[i]) {
	        merge[i] = node;
	      }
	    }
	  }

	  for (; j < m0; ++j) {
	    merges[j] = groups0[j];
	  }

	  return new Transition(merges, this._parents, this._name, this._id);
	}

	function start(name) {
	  return (name + "").trim().split(/^|\s+/).every(function(t) {
	    var i = t.indexOf(".");
	    if (i >= 0) t = t.slice(0, i);
	    return !t || t === "start";
	  });
	}

	function onFunction(id, name, listener) {
	  var on0, on1, sit = start(name) ? init : set$3;
	  return function() {
	    var schedule$$1 = sit(this, id),
	        on = schedule$$1.on;

	    // If this node shared a dispatch with the previous node,
	    // just assign the updated shared dispatch and we’re done!
	    // Otherwise, copy-on-write.
	    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

	    schedule$$1.on = on1;
	  };
	}

	function transition_on(name, listener) {
	  var id = this._id;

	  return arguments.length < 2
	      ? get$1(this.node(), id).on.on(name)
	      : this.each(onFunction(id, name, listener));
	}

	function removeFunction(id) {
	  return function() {
	    var parent = this.parentNode;
	    for (var i in this.__transition) if (+i !== id) return;
	    if (parent) parent.removeChild(this);
	  };
	}

	function transition_remove() {
	  return this.on("end.remove", removeFunction(this._id));
	}

	function transition_select(select$$1) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select$$1 !== "function") select$$1 = selector(select$$1);

	  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
	      if ((node = group[i]) && (subnode = select$$1.call(node, node.__data__, i, group))) {
	        if ("__data__" in node) subnode.__data__ = node.__data__;
	        subgroup[i] = subnode;
	        schedule(subgroup[i], name, id, i, subgroup, get$1(node, id));
	      }
	    }
	  }

	  return new Transition(subgroups, this._parents, name, id);
	}

	function transition_selectAll(select$$1) {
	  var name = this._name,
	      id = this._id;

	  if (typeof select$$1 !== "function") select$$1 = selectorAll(select$$1);

	  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        for (var children = select$$1.call(node, node.__data__, i, group), child, inherit = get$1(node, id), k = 0, l = children.length; k < l; ++k) {
	          if (child = children[k]) {
	            schedule(child, name, id, k, children, inherit);
	          }
	        }
	        subgroups.push(children);
	        parents.push(node);
	      }
	    }
	  }

	  return new Transition(subgroups, parents, name, id);
	}

	var Selection$1 = selection.prototype.constructor;

	function transition_selection() {
	  return new Selection$1(this._groups, this._parents);
	}

	function styleRemove$1(name, interpolate$$1) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var style = window$1(this).getComputedStyle(this, null),
	        value0 = style.getPropertyValue(name),
	        value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	function styleRemoveEnd(name) {
	  return function() {
	    this.style.removeProperty(name);
	  };
	}

	function styleConstant$1(name, interpolate$$1, value1) {
	  var value00,
	      interpolate0;
	  return function() {
	    var value0 = window$1(this).getComputedStyle(this, null).getPropertyValue(name);
	    return value0 === value1 ? null
	        : value0 === value00 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value1);
	  };
	}

	function styleFunction$1(name, interpolate$$1, value) {
	  var value00,
	      value10,
	      interpolate0;
	  return function() {
	    var style = window$1(this).getComputedStyle(this, null),
	        value0 = style.getPropertyValue(name),
	        value1 = value(this);
	    if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
	    return value0 === value1 ? null
	        : value0 === value00 && value1 === value10 ? interpolate0
	        : interpolate0 = interpolate$$1(value00 = value0, value10 = value1);
	  };
	}

	function transition_style(name, value, priority) {
	  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$1;
	  return value == null ? this
	          .styleTween(name, styleRemove$1(name, i))
	          .on("end.style." + name, styleRemoveEnd(name))
	      : this.styleTween(name, typeof value === "function"
	          ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
	          : styleConstant$1(name, i, value), priority);
	}

	function styleTween(name, value, priority) {
	  function tween() {
	    var node = this, i = value.apply(node, arguments);
	    return i && function(t) {
	      node.style.setProperty(name, i(t), priority);
	    };
	  }
	  tween._value = value;
	  return tween;
	}

	function transition_styleTween(name, value, priority) {
	  var key = "style." + (name += "");
	  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
	  if (value == null) return this.tween(key, null);
	  if (typeof value !== "function") throw new Error;
	  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
	}

	function textConstant$1(value) {
	  return function() {
	    this.textContent = value;
	  };
	}

	function textFunction$1(value) {
	  return function() {
	    var value1 = value(this);
	    this.textContent = value1 == null ? "" : value1;
	  };
	}

	function transition_text(value) {
	  return this.tween("text", typeof value === "function"
	      ? textFunction$1(tweenValue(this, "text", value))
	      : textConstant$1(value == null ? "" : value + ""));
	}

	function transition_transition() {
	  var name = this._name,
	      id0 = this._id,
	      id1 = newId();

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        var inherit = get$1(node, id0);
	        schedule(node, name, id1, i, group, {
	          time: inherit.time + inherit.delay + inherit.duration,
	          delay: 0,
	          duration: inherit.duration,
	          ease: inherit.ease
	        });
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id1);
	}

	var id$2 = 0;

	function Transition(groups, parents, name, id) {
	  this._groups = groups;
	  this._parents = parents;
	  this._name = name;
	  this._id = id;
	}

	function transition(name) {
	  return selection().transition(name);
	}

	function newId() {
	  return ++id$2;
	}

	var selection_prototype = selection.prototype;

	Transition.prototype = transition.prototype = {
	  constructor: Transition,
	  select: transition_select,
	  selectAll: transition_selectAll,
	  filter: transition_filter,
	  merge: transition_merge,
	  selection: transition_selection,
	  transition: transition_transition,
	  call: selection_prototype.call,
	  nodes: selection_prototype.nodes,
	  node: selection_prototype.node,
	  size: selection_prototype.size,
	  empty: selection_prototype.empty,
	  each: selection_prototype.each,
	  on: transition_on,
	  attr: transition_attr,
	  attrTween: transition_attrTween,
	  style: transition_style,
	  styleTween: transition_styleTween,
	  text: transition_text,
	  remove: transition_remove,
	  tween: transition_tween,
	  delay: transition_delay,
	  duration: transition_duration,
	  ease: transition_ease
	};

	function cubicInOut(t) {
	  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
	}

	var pi$2 = Math.PI;

	var tau$2 = 2 * Math.PI;

	var defaultTiming = {
	  time: null, // Set on use.
	  delay: 0,
	  duration: 250,
	  ease: cubicInOut
	};

	function inherit(node, id) {
	  var timing;
	  while (!(timing = node.__transition) || !(timing = timing[id])) {
	    if (!(node = node.parentNode)) {
	      return defaultTiming.time = now(), defaultTiming;
	    }
	  }
	  return timing;
	}

	function selection_transition(name) {
	  var id,
	      timing;

	  if (name instanceof Transition) {
	    id = name._id, name = name._name;
	  } else {
	    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
	  }

	  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
	    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
	      if (node = group[i]) {
	        schedule(node, name, id, i, group, timing || inherit(node, id));
	      }
	    }
	  }

	  return new Transition(groups, this._parents, name, id);
	}

	selection.prototype.interrupt = selection_interrupt;
	selection.prototype.transition = selection_transition;

	function attrsFunction(selection$$1, map) {
	  return selection$$1.each(function() {
	    var x = map.apply(this, arguments), s = select(this);
	    for (var name in x) s.attr(name, x[name]);
	  });
	}

	function attrsObject(selection$$1, map) {
	  for (var name in map) selection$$1.attr(name, map[name]);
	  return selection$$1;
	}

	function selection_attrs(map) {
	  return (typeof map === "function" ? attrsFunction : attrsObject)(this, map);
	}

	function stylesFunction(selection$$1, map, priority) {
	  return selection$$1.each(function() {
	    var x = map.apply(this, arguments), s = select(this);
	    for (var name in x) s.style(name, x[name], priority);
	  });
	}

	function stylesObject(selection$$1, map, priority) {
	  for (var name in map) selection$$1.style(name, map[name], priority);
	  return selection$$1;
	}

	function selection_styles(map, priority) {
	  return (typeof map === "function" ? stylesFunction : stylesObject)(this, map, priority == null ? "" : priority);
	}

	function propertiesFunction(selection$$1, map) {
	  return selection$$1.each(function() {
	    var x = map.apply(this, arguments), s = select(this);
	    for (var name in x) s.property(name, x[name]);
	  });
	}

	function propertiesObject(selection$$1, map) {
	  for (var name in map) selection$$1.property(name, map[name]);
	  return selection$$1;
	}

	function selection_properties(map) {
	  return (typeof map === "function" ? propertiesFunction : propertiesObject)(this, map);
	}

	function attrsFunction$1(transition, map) {
	  return transition.each(function() {
	    var x = map.apply(this, arguments), t = select(this).transition(transition);
	    for (var name in x) t.attr(name, x[name]);
	  });
	}

	function attrsObject$1(transition, map) {
	  for (var name in map) transition.attr(name, map[name]);
	  return transition;
	}

	function transition_attrs(map) {
	  return (typeof map === "function" ? attrsFunction$1 : attrsObject$1)(this, map);
	}

	function stylesFunction$1(transition, map, priority) {
	  return transition.each(function() {
	    var x = map.apply(this, arguments), t = select(this).transition(transition);
	    for (var name in x) t.style(name, x[name], priority);
	  });
	}

	function stylesObject$1(transition, map, priority) {
	  for (var name in map) transition.style(name, map[name], priority);
	  return transition;
	}

	function transition_styles(map, priority) {
	  return (typeof map === "function" ? stylesFunction$1 : stylesObject$1)(this, map, priority == null ? "" : priority);
	}

	selection.prototype.attrs = selection_attrs;
	selection.prototype.styles = selection_styles;
	selection.prototype.properties = selection_properties;
	transition.prototype.attrs = transition_attrs;
	transition.prototype.styles = transition_styles;

	function base(container, obj) {

	  var margin = obj.dimensions.margin;

	  var chartBase = select(container)
	    .insert('svg', ("." + (obj.prefix) + "chart_source"))
	    .attrs({
	      'class': ((obj.baseClass) + "_svg " + (obj.prefix) + (obj.customClass) + " " + (obj.prefix) + "type_" + (obj.options.type) + " " + (obj.prefix) + "series-" + (obj.data.seriesAmount)),
	      'width': obj.dimensions.computedWidth() + margin.left + margin.right,
	      'height': obj.dimensions.computedHeight() + margin.top + margin.bottom,
	      'version': 1.1,
	      'xmlns': 'http://www.w3.org/2000/svg'
	    });

	  // background rect
	  chartBase
	    .append('rect')
	    .attrs({
	      'class': ((obj.prefix) + "bg"),
	      'x': 0,
	      'y': 0,
	      'width': obj.dimensions.computedWidth(),
	      'height': obj.dimensions.computedHeight(),
	      'transform': ("translate(" + (margin.left) + ", " + (margin.top) + ")")
	    });

	  var graph = chartBase.append('g')
	    .attrs({
	      'class': ((obj.prefix) + "graph"),
	      'transform': ("translate(" + (margin.left) + ", " + (margin.top) + ")")
	    });

	  return graph;

	}

	function header(container, obj) {

	  var headerGroup = select(container)
	    .append('div')
	    .classed(((obj.prefix) + "chart_title " + (obj.prefix) + (obj.customClass)), true);

	  // hack necessary to ensure PDF fields are sized properly
	  if (obj.exportable) {
	    headerGroup.style('width', ((obj.exportable.width) + "px"));
	  }

	  if ((obj.heading !== '' || obj.editable) && obj.options.head) {
	    var headerText = headerGroup
	      .append('div')
	      .attr('class', ((obj.prefix) + "chart_title-text"))
	      .text(obj.heading);

	    if (obj.editable) {
	      headerText
	        .attr('contentEditable', true)
	        .classed('editable-chart_title', true);
	    }

	  }

	  var qualifier;

	  if ((obj.qualifier !== '' || obj.editable) && obj.options.qualifier) {
	    qualifier = headerGroup
	      .append('div')
	      .attrs({
	        'class': function () {
	          var str = (obj.prefix) + "chart_qualifier";
	          if (obj.editable) { str += ' editable-chart_qualifier'; }
	          return str;
	        },
	        'contentEditable': function () { return obj.editable ? true : false; }
	      })
	      .text(obj.qualifier);
	  }

	  var legend;

	  if (obj.data.keys.length > 2) {

	    legend = headerGroup.append('div')
	      .classed(((obj.prefix) + "chart_legend"), true);

	    var keys;

	    if (obj.options.type === 'scatterplot') {
	      keys = obj.data.groups ? obj.data.groups.slice() : [];
	    } else {
	      keys = obj.data.keys.slice();
	      keys.shift(); // get rid of the first item as it doesnt represent a series
	    }

	    if (obj.options.type === 'multiline') {
	      keys = [keys[0], keys[1]];
	      legend.classed(((obj.prefix) + "chart_legend-" + (obj.options.type)), true);
	    }

	    var legendItem = legend.selectAll(("div." + (obj.prefix) + "legend_item"))
	      .data(keys)
	      .enter()
	      .append('div')
	      .attr('class', function (d, i) {
	        return ((obj.prefix) + "legend_item " + (obj.prefix) + "legend_item_" + i);
	      });

	    legendItem.append('span')
	      .attr('class', ((obj.prefix) + "legend_item_icon"))
	      .text('\u00A0');

	    legendItem.append('span')
	      .attr('class', ((obj.prefix) + "legend_item_text"))
	      .text(function (d) { return d; });
	  }

	  obj.dimensions.headerHeight = headerGroup.node().getBoundingClientRect().height;

	  return {
	    headerGroup: headerGroup,
	    legend: legend,
	    qualifier: qualifier
	  };

	}

	function footer(container, obj) {

	  var footerGroup;

	  if (obj.source !== '' || obj.editable) {
	    footerGroup = select(container)
	      .append('div')
	      .classed(((obj.prefix) + "chart_source"), true);

	    // hack necessary to ensure PDF fields are sized properly
	    if (obj.exportable) {
	      footerGroup.style('width', ((obj.exportable.width) + "px"));
	    }

	    var footerText = footerGroup.append('div')
	      .attr('class', ((obj.prefix) + "chart_source-text"))
	      .text(obj.source);

	    if (obj.editable) {
	      footerText
	        .attr('contentEditable', true)
	        .classed('editable-chart_source', true);
	    }

	    obj.dimensions.footerHeight = footerGroup.node().getBoundingClientRect().height;

	  }

	  return {
	    footerGroup: footerGroup
	  };

	}

	var slice$3 = Array.prototype.slice;

	function identity$5(x) {
	  return x;
	}

	var top = 1,
	    right = 2,
	    bottom = 3,
	    left = 4,
	    epsilon$2 = 1e-6;

	function translateX(x) {
	  return "translate(" + (x + 0.5) + ",0)";
	}

	function translateY(y) {
	  return "translate(0," + (y + 0.5) + ")";
	}

	function number$3(scale) {
	  return function(d) {
	    return +scale(d);
	  };
	}

	function center(scale) {
	  var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
	  if (scale.round()) offset = Math.round(offset);
	  return function(d) {
	    return +scale(d) + offset;
	  };
	}

	function entering() {
	  return !this.__axis;
	}

	function axis(orient, scale) {
	  var tickArguments = [],
	      tickValues = null,
	      tickFormat = null,
	      tickSizeInner = 6,
	      tickSizeOuter = 6,
	      tickPadding = 3,
	      k = orient === top || orient === left ? -1 : 1,
	      x = orient === left || orient === right ? "x" : "y",
	      transform = orient === top || orient === bottom ? translateX : translateY;

	  function axis(context) {
	    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
	        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$5) : tickFormat,
	        spacing = Math.max(tickSizeInner, 0) + tickPadding,
	        range = scale.range(),
	        range0 = +range[0] + 0.5,
	        range1 = +range[range.length - 1] + 0.5,
	        position = (scale.bandwidth ? center : number$3)(scale.copy()),
	        selection = context.selection ? context.selection() : context,
	        path = selection.selectAll(".domain").data([null]),
	        tick = selection.selectAll(".tick").data(values, scale).order(),
	        tickExit = tick.exit(),
	        tickEnter = tick.enter().append("g").attr("class", "tick"),
	        line = tick.select("line"),
	        text = tick.select("text");

	    path = path.merge(path.enter().insert("path", ".tick")
	        .attr("class", "domain")
	        .attr("stroke", "#000"));

	    tick = tick.merge(tickEnter);

	    line = line.merge(tickEnter.append("line")
	        .attr("stroke", "#000")
	        .attr(x + "2", k * tickSizeInner));

	    text = text.merge(tickEnter.append("text")
	        .attr("fill", "#000")
	        .attr(x, k * spacing)
	        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

	    if (context !== selection) {
	      path = path.transition(context);
	      tick = tick.transition(context);
	      line = line.transition(context);
	      text = text.transition(context);

	      tickExit = tickExit.transition(context)
	          .attr("opacity", epsilon$2)
	          .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

	      tickEnter
	          .attr("opacity", epsilon$2)
	          .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
	    }

	    tickExit.remove();

	    path
	        .attr("d", orient === left || orient == right
	            ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
	            : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

	    tick
	        .attr("opacity", 1)
	        .attr("transform", function(d) { return transform(position(d)); });

	    line
	        .attr(x + "2", k * tickSizeInner);

	    text
	        .attr(x, k * spacing)
	        .text(format);

	    selection.filter(entering)
	        .attr("fill", "none")
	        .attr("font-size", 10)
	        .attr("font-family", "sans-serif")
	        .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

	    selection
	        .each(function() { this.__axis = position; });
	  }

	  axis.scale = function(_) {
	    return arguments.length ? (scale = _, axis) : scale;
	  };

	  axis.ticks = function() {
	    return tickArguments = slice$3.call(arguments), axis;
	  };

	  axis.tickArguments = function(_) {
	    return arguments.length ? (tickArguments = _ == null ? [] : slice$3.call(_), axis) : tickArguments.slice();
	  };

	  axis.tickValues = function(_) {
	    return arguments.length ? (tickValues = _ == null ? null : slice$3.call(_), axis) : tickValues && tickValues.slice();
	  };

	  axis.tickFormat = function(_) {
	    return arguments.length ? (tickFormat = _, axis) : tickFormat;
	  };

	  axis.tickSize = function(_) {
	    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
	  };

	  axis.tickSizeInner = function(_) {
	    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
	  };

	  axis.tickSizeOuter = function(_) {
	    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
	  };

	  axis.tickPadding = function(_) {
	    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
	  };

	  return axis;
	}

	function axisRight(scale) {
	  return axis(right, scale);
	}

	function axisBottom(scale) {
	  return axis(bottom, scale);
	}

	function axisLeft(scale) {
	  return axis(left, scale);
	}

	function scaleManager(obj, axisType) {

	  var axis = obj[axisType],
	    scaleObj = new ScaleObj(obj, axis, axisType);

	  var scale = setScaleType(scaleObj.type);

	  scale.domain(scaleObj.domain);

	  setRangeArgs(scale, scaleObj);

	  if (axis.nice) { niceify(scale, axisType, scaleObj); }

	  if (scaleObj.type === 'ordinal') {
	    scale
	      .align(0.5)
	      .paddingInner(scaleObj.bands.padding)
	      .paddingOuter(scaleObj.bands.outerPadding);
	  }

	  return {
	    obj: scaleObj,
	    scale: scale
	  };

	}

	var ScaleObj = function ScaleObj(obj, axis, axisType) {
	  this.type = axis.scale;
	  this.domain = setDomain(obj, axis, axisType);
	  this.rangeType = 'range';
	  this.range = setRange(obj, axisType);
	  this.bands = obj.dimensions.bands;
	  this.rangePoints = axis.rangePoints || 1.0;
	};

	function setScaleType(type) {
	  switch (type) {
	    case 'time': return scaleTime();
	    case 'ordinal': return band();
	    case 'ordinal-time': return point();
	    case 'linear': return linear$1();
	    default: return linear$1();
	  }
	}

	function setRange(obj, axisType) {

	  var range$$1;

	  if (axisType === 'xAxis') {
	    range$$1 = [0, obj.dimensions.tickWidth()]; // operating on width
	  } else if (axisType === 'yAxis') {
	    range$$1 = [obj.dimensions.yAxisHeight(), 0]; // operating on height
	  }

	  return range$$1;

	}

	function setRangeArgs(scale, scaleObj) {
	  if (scaleObj.rangeType === 'range') {
	    if (scaleObj.type === 'ordinal-time') {
	      return scale[scaleObj.rangeType](scaleObj.range).padding(0.5).align(0);
	    } else {
	      return scale[scaleObj.rangeType](scaleObj.range);
	    }
	  }
	}

	function setDomain(obj, axis, axisType) {
	  var data = obj.data;

	  var domain;

	  switch(axis.scale) {
	    case 'time':
	      domain = setDateDomain(data, axis.min, axis.max, obj.options.type);
	      break;
	    case 'linear':
	      domain = setNumericalDomain(data, axis.min, axis.max, {
	        stacked: obj.options.stacked,
	        scatterplot: obj.options.type === 'scatterplot',
	        axisType: axisType,
	        forceMaxVal: obj.options.type === 'area' || obj.options.type === 'column' || obj.options.type === 'bar'
	      });
	      break;
	    case 'ordinal':
	    case 'ordinal-time':
	      domain = setDiscreteDomain(data);
	      break;
	  }

	  return domain;

	}

	function setDateDomain(data, min, max, type) {
	  var startDate, endDate;
	  if (min && max) {
	    startDate = min;
	    endDate = max;
	  } else {

	    var isScatterplot = type && type === 'scatterplot',
	      dateKey = isScatterplot ? 'series.0.val' : 'key',
	      dateRange = extent(data.data, function (d) { return resolveObjectPath(dateKey, d); });

	    startDate = min || new Date(dateRange[0]);
	    endDate = max || new Date(dateRange[1]);
	  }
	  return [startDate, endDate];
	}

	function setNumericalDomain(data, vmin, vmax, options) {

	  var minVal, maxVal;

	  var mArr = [];

	  map$1(data.data, function (d) {
	    if (options.scatterplot) {
	      mArr.push(Number(d.series[options.axisType === 'xAxis' ? 0 : 1].val));
	    } else {
	      for (var j = 0; j < d.series.length; j++) {
	        mArr.push(Number(d.series[j].val));
	      }
	    }
	  });

	  if (options.stacked) {
	    maxVal = max$1(data.stackedData, function (layer) {
	      return max$1(layer, function (d) { return d[1]; });
	    });
	  } else {
	    maxVal = max$1(mArr);
	  }

	  minVal = min$2(mArr);

	  if (vmin) {
	    minVal = vmin;
	  } else if (minVal > 0) {
	    minVal = 0;
	  }

	  if (vmax) {
	    maxVal = vmax;
	  } else if (maxVal < 0 && options.forceMaxVal) {
	    maxVal = 0;
	  }

	  return [minVal, maxVal];

	}

	function setDiscreteDomain(data) {
	  return data.data.map(function (d) { return d.key; });
	}

	function niceify(scale, axisType, scaleObj) {
	  switch(scaleObj.type) {
	    case 'time':
	      niceifyTime(scale, timeDiff(scale.domain()[0], scale.domain()[1], 3));
	      break;
	    case 'linear':
	      niceifyNumerical(scale);
	      break;
	  }
	}

	function niceifyTime(scale, context) {
	  var interval = timeInterval(context);
	  scale.domain(scale.domain()).nice(interval);
	}

	function niceifyNumerical(scale) {
	  scale.domain(scale.domain()).nice();
	}

	function axisFactory(axisObj, scale) {
	  switch (axisObj.orient) {
	    case 'left': return axisLeft(scale);
	    case 'right': return axisRight(scale);
	    case 'bottom': return axisBottom(scale);
	  }
	}

	function axisManager(node, obj, scale, axisType) {

	  var axisObj = obj[axisType],
	    axis = new axisFactory(axisObj, scale);

	  var prevAxis = node.select(("." + (obj.prefix) + "axis-group." + (obj.prefix) + axisType)).node();

	  if (prevAxis !== null) { select(prevAxis).remove(); }

	  var axisGroup = node.append('g')
	    .attr('class', ((obj.prefix) + "axis-group " + (obj.prefix) + axisType));

	  if (axisType === 'xAxis') {
	    appendXAxis(axisGroup, obj, scale, axis, axisType);
	  } else if (axisType === 'yAxis') {
	    appendYAxis(axisGroup, obj, scale, axis, axisType);
	  }

	  return {
	    node: axisGroup,
	    axis: axis
	  };

	}

	function determineFormat(context) {
	  switch (context) {
	    case 'years': return timeFormat('%Y');
	    case 'months': return timeFormat('%b');
	    case 'weeks': return timeFormat('%W');
	    case 'days': return timeFormat('%j');
	    case 'hours': return timeFormat('%H');
	    case 'minutes': return timeFormat('%M');
	  }
	}

	function appendXAxis(axisGroup, obj, scale, axis, axisType) {

	  var axisObj = obj[axisType];

	  var axisSettings;

	  if (obj.exportable && obj.exportable.x_axis) {
	    axisSettings = Object.assign(axisObj, obj.exportable.x_axis);
	  } else {
	    axisSettings = axisObj;
	  }

	  axisSettings.axisType = axisType;

	  axisGroup
	    .attr('transform', ("translate(0, " + (obj.dimensions.yAxisHeight()) + ")"));

	  var axisNode = axisGroup.append('g')
	    .attr('class', ((obj.prefix) + "x-axis"));

	  switch(axisObj.scale) {
	    case 'time':
	      timeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	    case 'ordinal':
	      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
	      break;
	    case 'ordinal-time':
	      ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings);
	      break;
	    case 'linear':
	      linearAxis(obj, axis, axisNode, axisSettings);
	      break;
	  }

	  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;

	  if (obj.options.type === 'scatterplot') {

	    axisNode.selectAll('.tick line')
	      .attrs({
	        'y1': 0,
	        'y2': obj.dimensions.xAxisHeight - obj.dimensions.computedHeight()
	      });

	  }

	}

	function appendYAxis(axisGroup, obj, scale, axis, axisType) {

	  axisGroup.attr('transform', 'translate(0,0)');

	  var axisNode = axisGroup.append('g').attr('class', ((obj.prefix) + "y-axis"));

	  var axisObj = obj[axisType];

	  var axisSettings;

	  if (obj.exportable && obj.exportable.y_axis) {
	    axisSettings = Object.assign(axisObj, obj.exportable.y_axis);
	  } else {
	    axisSettings = axisObj;
	  }

	  axisSettings.axisType = axisType;

	  obj.dimensions.yAxisPaddingRight = axisSettings.paddingRight;

	  switch(axisObj.scale) {
	    case 'linear':
	      linearAxis(obj, axis, axisNode, axisSettings);
	      break;
	    case 'ordinal':
	      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
	      break;
	  }

	}

	function linearAxis(obj, axis, axisNode, axisSettings) {

	  var range$$1;

	  if (axisSettings.axisType === 'xAxis') { range$$1 = [0, obj.dimensions.tickWidth()]; }
	  if (axisSettings.axisType === 'yAxis') { range$$1 = [obj.dimensions.yAxisHeight(), 0]; }

	  axis.scale().range(range$$1);

	  axis.tickValues(tickFinderLinear(axis.scale(), axisSettings)); // can generalize to tickFinder instead of X or Y?

	  axisNode.call(axis);

	  axisNode.selectAll('g')
	    .filter(function (d) { return d; })
	    .classed(((obj.prefix) + "minor"), true);

	  if (axisSettings.axisType === 'yAxis') {

	    axisNode.selectAll('.tick text')
	      .attr('transform', 'translate(0,0)')
	      .call(updateTextY, axisNode, obj, axis, axisSettings)
	      .call(repositionTextY, obj.dimensions, axisSettings.textX);

	    axisNode.selectAll('.tick line')
	      .attrs({
	        'x1': obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	        'x2': obj.dimensions.computedWidth()
	      });

	  } else {

	    axisNode.selectAll('text')
	      .call(updateTextX, axisNode, obj, axis, axisSettings);

	    // if necessary, drop ticks
	    axisNode.selectAll('.tick')
	      .call(dropTicks);

	  }

	}

	function timeAxis(axisNode, obj, scale, axis, axisSettings) {

	  var domain = scale.domain(),
	    ctx = timeDiff(domain[0], domain[1], 3),
	    currentFormat = determineFormat(ctx);

	  axis.tickFormat(currentFormat);

	  var ticks$$1, tickGoal;

	  if (axisSettings.ticks === 'auto') {
	    tickGoal = axisSettings.tickTarget;
	  } else {
	    tickGoal = axisSettings.ticks;
	  }

	  if (obj.dimensions.tickWidth() > axisSettings.widthThreshold) {
	    ticks$$1 = tickFinderDates(domain, ctx, tickGoal);
	  } else {
	    ticks$$1 = tickFinderDates(domain, ctx, axisSettings.ticksSmall);
	  }

	  if (obj.options.type !== 'column') {
	    axis.tickValues(ticks$$1);
	  } else {
	    axis.ticks();
	  }

	  axisNode.call(axis);

	  axisNode.selectAll('text')
	    .attrs({
	      'x': axisSettings.textX,
	      'y': axisSettings.textY,
	      'dy': ((axisSettings.dy) + "em")
	    })
	    .style('text-anchor', 'start')
	    .call(setTickFormatDate, ctx, axisSettings.ems, obj.monthsAbr);

	  if (obj.options.type === 'column') { dropRedundantTicks(axisNode, ctx); }

	  axisNode.selectAll('.tick')
	    .call(dropTicks);

	  axisNode.selectAll('line')
	    .attr('y2', axisSettings.tickHeight);

	}

	function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {

	  axis.tickPadding(0);

	  var bandWidth = scale.bandwidth();

	  axisNode.call(axis);

	  if (axisSettings.axisType === 'xAxis') {
	    axisNode.selectAll('text')
	      .style('text-anchor', 'middle')
	      .attr('dy', ((axisSettings.dy) + "em"))
	      .attr('y', axisSettings.textY)
	      .call(wrapText, bandWidth);

	    var xPos = -(bandWidth / 2) - ((scale.step() * dimensions.bands.padding) / 2);

	    axisNode.selectAll('line')
	      .attrs({
	        'x1': xPos,
	        'x2': xPos
	      });

	    axisNode.selectAll('line')
	      .attr('y2', axisSettings.tickHeight);

	    var lastTick = axisNode.append('g')
	      .attrs({
	        'class': 'tick',
	        'transform': ("translate(" + (dimensions.tickWidth() + (bandWidth / 2) + ((scale.step() * dimensions.bands.padding) / 2)) + ",0)")
	      });

	    lastTick.append('line')
	      .attrs({
	        'y2': axisSettings.tickHeight,
	        'x1': xPos,
	        'x2': xPos
	      });

	  } else {

	    axisNode.selectAll('line').remove();
	    axisNode.selectAll('text').attr('x', 0);

	    var maxLabelWidth;

	    if (dimensions.width > axisSettings.widthThreshold) {
	      maxLabelWidth = dimensions.computedWidth() / 3.5;
	    } else {
	      maxLabelWidth = dimensions.computedWidth() / 3;
	    }


	    if (axisNode.node().getBBox().width > maxLabelWidth) {
	      axisNode.selectAll('text')
	        .call(wrapText, maxLabelWidth)
	        .each(function() {
	          var tspans = select(this).selectAll('tspan'),
	            tspanCount = tspans._groups[0].length,
	            textHeight = select(this).node().getBBox().height;
	          if (tspanCount > 1) {
	            tspans.attr('y', ((textHeight / tspanCount) / 2) - (textHeight / 2));
	          }
	        });
	    }

	    dimensions.labelWidth = axisNode.node().getBBox().width;

	    select(axisNode.node().parentNode).attr('transform', ("translate(" + (dimensions.labelWidth) + ",0)"));

	  }

	}

	function ordinalTimeAxis(axisNode, obj, scale, axis, axisSettings) {

	  var domain = scale.domain(),
	    ctx = timeDiff(domain[0], domain[domain.length - 1], 3),
	    currentFormat = determineFormat(ctx);

	  axis.tickFormat(currentFormat);

	  axisNode.call(axis);

	  axisNode.selectAll('text')
	    .attrs({
	      'x': axisSettings.textX,
	      'y': axisSettings.textY,
	      'dy': ((axisSettings.dy) + "em")
	    })
	    .style('text-anchor', 'start')
	    .call(setTickFormatDate, ctx, axisSettings.ems, obj.monthsAbr);

	  var ordinalTickPadding;

	  if (obj.dimensions.computedWidth() > obj.xAxis.widthThreshold) {
	    ordinalTickPadding = 7;
	  } else {
	    ordinalTickPadding = 4;
	  }

	  axisNode.selectAll('.tick')
	    .call(ordinalTimeTicks, axisNode, ctx, scale, ordinalTickPadding);

	  axisNode.selectAll('line')
	    .attr('y2', axisSettings.tickHeight);

	}

	function setTickFormatDate(selection$$1, ctx, ems, monthsAbr) {

	  var prevYear,
	    prevMonth,
	    prevDate,
	    dYear,
	    dMonth,
	    dDate,
	    dHour,
	    dMinute;

	  selection$$1.text(function(d) {

	    var node = select(this);

	    var dStr;

	    switch (ctx) {
	      case 'years':
	        dStr = d.getFullYear();
	        break;
	      case 'months':
	        dMonth = monthsAbr[d.getMonth()];
	        dYear = d.getFullYear();
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	        dStr = dMonth;
	        prevYear = dYear;
	        break;
	      case 'weeks':
	      case 'days':
	        dYear = d.getFullYear();
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	        dStr = dMonth !== prevMonth ? (dMonth + " " + dDate) : dDate;
	        if (dYear !== prevYear) {
	          newTextNode(node, dYear, ems);
	        }
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case 'hours': {
	        dMonth = monthsAbr[d.getMonth()];
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();

	        var dHourStr,
	          dMinuteStr;

	        // Convert from 24h time
	        var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';
	        if (dHour === 0) {
	          dHourStr = 12;
	        } else if (dHour > 12) {
	          dHourStr = dHour - 12;
	        } else {
	          dHourStr = dHour;
	        }

	        // Make minutes follow Globe style
	        if (dMinute === 0) {
	          dMinuteStr = '';
	        } else if (dMinute < 10) {
	          dMinuteStr = ":0" + dMinute;
	        } else {
	          dMinuteStr = ":" + dMinute;
	        }

	        dStr = "" + dHourStr + dMinuteStr + " " + suffix;

	        if (dDate !== prevDate) {
	          var dateStr = dMonth + " " + dDate;
	          newTextNode(node, dateStr, ems);
	        }

	        prevDate = dDate;

	        break;
	      }
	      default:
	        dStr = d;
	        break;
	    }

	    return dStr;

	  });

	}

	function setTickFormat(fmt, d) {
	  // checking for a format and formatting axis values accordingly

	  switch (fmt) {
	    case 'general':
	      return format('')(d);
	    case 'si':
	    case 'comma':
	      return isFloat(parseFloat(d)) ? format(',.2f')(d) : format(',')(d);
	    case 'round1':
	      return format(',.1f')(d);
	    case 'round2':
	      return format(',.2f')(d);
	    case 'round3':
	      return format(',.3f')(d);
	    case 'round4':
	      return format(',.4f')(d);
	    default:
	      return format(',')(d);
	  }

	}

	function updateTextX(textNodes, axisNode, obj, axis, axisObj) {

	  textNodes
	    .text(function (d, i) {
	      var val = setTickFormat(axisObj.format, d);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || '') + val + (axisObj.suffix || '');
	      }
	      return val;
	    });

	}

	function updateTextY(textNodes, axisNode, obj, axis, axisObj) {

	  var arr = [];

	  textNodes
	    .attr('transform', 'translate(0,0)')
	    .text(function (d, i) {
	      var val = setTickFormat(axisObj.format, d);
	      if (i === axis.tickValues().length - 1) {
	        val = (axisObj.prefix || '') + val + (axisObj.suffix || '');
	      }
	      return val;
	    })
	    .text(function() {
	      var sel = select(this);
	      var textChar = sel.node().getBoundingClientRect().width;
	      arr.push(textChar);
	      return sel.text();
	    })
	    .attrs({
	      'dy': function() {
	        if (axisObj.dy !== '') {
	          return ((axisObj.dy) + "em");
	        } else {
	          return select(this).attr('dy');
	        }
	      },
	      'x': function() {
	        if (axisObj.textX !== '') {
	          return axisObj.textX;
	        } else {
	          return select(this).attr('x');
	        }
	      },
	      'y': function() {
	        if (axisObj.textY !== '') {
	          return axisObj.textY;
	        } else {
	          return select(this).attr('y');
	        }
	      }
	    });

	  obj.dimensions.labelWidth = max$1(arr);

	}

	function repositionTextY(text, dimensions, textX) {
	  text.attrs({
	    'transform': ("translate(" + (dimensions.labelWidth - textX) + ",0)"),
	    'x': 0
	  });
	}

	// Clones current text selection and appends
	// a new text node below the selection
	function newTextNode(selection$$1, text, ems) {

	  var nodeName = selection$$1.property('nodeName'),
	    parent = select(selection$$1.node().parentNode),
	    lineHeight = ems || 1.6, // ems
	    dy = parseFloat(selection$$1.attr('dy')),
	    x = parseFloat(selection$$1.attr('x')),
	    textAnchor = selection$$1.style('text-anchor');

	  var cloned = parent.append(nodeName)
	    .attr('dy', ((lineHeight + dy) + "em"))
	    .attr('x', x)
	    .style('text-anchor', textAnchor)
	    .text(text);

	  return cloned;

	}

	// tick dropping functions

	function dropTicks(selection$$1, opts) {

	  var options = opts || {};

	  var tolerance = options.tolerance || 0,
	    from = options.from || 0,
	    to = options.to || selection$$1._groups[0].length;

	  for (var j = from; j < to; j++) {

	    var c = selection$$1._groups[0][j]; // current selection
	    var n = selection$$1._groups[0][j + 1]; // next selection

	    if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect) { continue; }

	    while ((c.getBoundingClientRect().right + tolerance) > n.getBoundingClientRect().left) {

	      if (select(n).data()[0] === selection$$1.data()[to]) {
	        select(c).remove();
	      } else {
	        select(n).remove();
	      }

	      j++;

	      n = selection$$1._groups[0][j + 1];

	      if (!n) { break; }

	    }

	  }

	}

	function dropRedundantTicks(selection$$1, ctx) {

	  var ticks$$1 = selection$$1.selectAll('.tick');

	  var prevYear, prevMonth, prevDate, prevHour, prevMinute, dYear, dMonth, dDate, dHour, dMinute;

	  ticks$$1.each(function(d) {
	    switch (ctx) {
	      case 'years':
	        dYear = d.getFullYear();
	        if (dYear === prevYear) {
	          select(this).remove();
	        }
	        prevYear = dYear;
	        break;
	      case 'months':
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        if ((dMonth === prevMonth) && (dYear === prevYear)) {
	          select(this).remove();
	        }
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case 'weeks':
	      case 'days':
	        dYear = d.getFullYear();
	        dMonth = d.getMonth();
	        dDate = d.getDate();

	        if ((dDate === prevDate) && (dMonth === prevMonth) && (dYear === prevYear)) {
	          select(this).remove();
	        }

	        prevDate = dDate;
	        prevMonth = dMonth;
	        prevYear = dYear;
	        break;
	      case 'hours':
	        dDate = d.getDate();
	        dHour = d.getHours();
	        dMinute = d.getMinutes();

	        if ((dDate === prevDate) && (dHour === prevHour) && (dMinute === prevMinute)) {
	          select(this).remove();
	        }

	        prevDate = dDate;
	        prevHour = dHour;
	        prevMinute = dMinute;
	        break;
	    }
	  });

	}

	function dropOversetTicks(axisNode, tickWidth) {

	  var axisGroupWidth = axisNode.node().getBBox().width,
	    tickArr = axisNode.selectAll('.tick')._groups[0];

	  if (tickArr.length) {

	    var firstTickOffset = getTranslate(tickArr[0])[0];

	    var lastTick = tickArr[tickArr.length - 1];

	    if ((axisGroupWidth + firstTickOffset) >= tickWidth) {
	      select(lastTick).classed('last-tick-hide', true);
	      // axisGroupWidth = axisNode.node().getBBox().width;
	      // tickArr = axisNode.selectAll('.tick')._groups[0];
	    } else {
	      select(lastTick).classed('last-tick-hide', false);
	    }

	  }

	}

	function tickFinderDates(domain, period, tickGoal) {

	  // set ranges
	  var startDate = domain[0],
	    endDate = domain[1];

	  // set upper and lower bounds for number of steps per tick
	  // i.e. if you have four months and set steps to 1, you'll get 4 ticks
	  // and if you have six months and set steps to 2, you'll get 3 ticks
	  var stepLowerBound = 1,
	    stepUpperBound = 12,
	    tickCandidates = [];

	  var closestArr;

	  var intervals = {
	    years: years,
	    months: months,
	    weeks: sundays,
	    days: days,
	    hours: hours,
	    minutes: minutes
	  };

	  // using the tick bounds, generate multiple arrays-in-objects using
	  // different tick steps. push all those generated objects to tickCandidates
	  for (var i = stepLowerBound; i <= stepUpperBound; i++) {
	    var obj = {};
	    obj.interval = i;
	    obj.arr = intervals[period](startDate, endDate, i).length;
	    tickCandidates.push(obj);
	  }

	  // reduce to find a best candidate based on the defined tickGoal
	  if (tickCandidates.length > 1) {
	    closestArr = tickCandidates.reduce(function (prev, curr) {
	      return (Math.abs(curr.arr - tickGoal) < Math.abs(prev.arr - tickGoal) ? curr : prev);
	    });
	  } else if (tickCandidates.length === 1) {
	    closestArr = tickCandidates[0];
	  } else {
	    // sigh. we tried.
	    closestArr.interval = 1;
	  }

	  var tickArr = intervals[period](startDate, endDate, closestArr.interval);

	  var startDiff = tickArr[0] - startDate,
	    tickDiff = tickArr[1] - tickArr[0];

	  // if distance from startDate to tickArr[0] is greater than half the
	  // distance between tickArr[1] and tickArr[0], add startDate to tickArr

	  if (startDiff > (tickDiff / 2)) { tickArr.unshift(startDate); }

	  return tickArr;

	}

	function tickFinderLinear(scale, tickSettings) {

	  // In a nutshell:
	  // Checks if an explicit number of ticks has been declared
	  // If not, sets lower and upper bounds for the number of ticks
	  // Iterates over those and makes sure that there are tick arrays where
	  // the last value in the array matches the domain max value
	  // if so, tries to find the tick number closest to tickGoal out of the winners,
	  // and returns that arr to the scale for use

	  var min = scale.domain()[0],
	    max = scale.domain()[1];

	  if (tickSettings.ticks !== 'auto') {

	    return scale.ticks(tickSettings.ticks);

	  } else {

	    var tickLowerBound = tickSettings.tickLowerBound,
	      tickUpperBound = tickSettings.tickUpperBound,
	      tickGoal = tickSettings.tickGoal,
	      arr = [],
	      tickCandidates = [];

	    var closestArr;

	    for (var i = tickLowerBound; i <= tickUpperBound; i++) {
	      var tickCandidate = scale.ticks(i);

	      if (min < 0) {
	        if ((tickCandidate[0] === min) && (tickCandidate[tickCandidate.length - 1] === max)) {
	          arr.push(tickCandidate);
	        }
	      } else {
	        if (tickCandidate[tickCandidate.length - 1] === max) {
	          arr.push(tickCandidate);
	        }
	      }
	    }

	    arr.forEach(function (value) { tickCandidates.push(value.length); });

	    if (tickCandidates.length > 1) {
	      closestArr = tickCandidates.reduce(function (prev, curr) {
	        return (Math.abs(curr - tickGoal) < Math.abs(prev - tickGoal) ? curr : prev);
	      });
	    } else if (tickCandidates.length === 1) {
	      closestArr = tickCandidates[0];
	    } else {
	      closestArr = null;
	    }

	    return scale.ticks(closestArr);

	  }
	}


	function ordinalTimeTicks(selection$$1, axisNode, ctx, scale, tolerance) {

	  dropRedundantTicks(axisNode, ctx);

	  // dropRedundantTicks has modified the selection, so we need to reselect
	  // to get a proper idea of what's still available
	  var newSelection = axisNode.selectAll('.tick');

	  // if the context is 'years', every tick is a majortick so we can
	  // just pass on the block below
	  if (ctx !== 'years') {

	    // array for any 'major ticks', i.e. ticks with a change in context
	    // one level up. i.e., a 'months' context set of ticks with a change in the year,
	    // or 'days' context ticks with a change in month or year
	    var majorTicks = [];

	    var prevYear, prevMonth, prevDate, dYear, dMonth, dDate;

	    newSelection.each(function(d) {
	      var currSel = select(this);
	      switch (ctx) {
	        case 'months':
	          dYear = d.getFullYear();
	          if (dYear !== prevYear) { majorTicks.push(currSel); }
	          prevYear = d.getFullYear();
	          break;
	        case 'weeks':
	        case 'days':
	          dYear = d.getFullYear();
	          dMonth = d.getMonth();
	          if ((dMonth !== prevMonth) && (dYear !== prevYear)) {
	            majorTicks.push(currSel);
	          } else if (dMonth !== prevMonth) {
	            majorTicks.push(currSel);
	          } else if (dYear !== prevYear) {
	            majorTicks.push(currSel);
	          }
	          prevMonth = d.getMonth();
	          prevYear = d.getFullYear();
	          break;
	        case 'hours':
	          dDate = d.getDate();
	          if (dDate !== prevDate) { majorTicks.push(currSel); }
	          prevDate = dDate;
	          break;
	      }
	    });

	    if (majorTicks.length > 1) {

	      for (var i = 0; i < majorTicks.length + 1; i++) {

	        var t0 = (void 0), tn = (void 0);

	        if (i === 0) { // from t0 to m0
	          t0 = 0;
	          tn = newSelection.data().indexOf(majorTicks[0].data()[0]);
	        } else if (i === (majorTicks.length)) { // from mn to tn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection._groups[0].length - 1;
	        } else { // from m0 to mn
	          t0 = newSelection.data().indexOf(majorTicks[i - 1].data()[0]);
	          tn = newSelection.data().indexOf(majorTicks[i].data()[0]);
	        }

	        if (tn - t0) {
	          dropTicks(newSelection, {
	            from: t0,
	            to: tn,
	            tolerance: tolerance
	          });
	        }

	      }

	    } else {
	      dropTicks(newSelection, { tolerance: tolerance });
	    }

	  } else {
	    dropTicks(newSelection, { tolerance: tolerance });
	  }

	}

	function axisCleanup(node, obj, xAxisObj, yAxisObj) {

	  // this section is kinda gross, sorry:
	  // resets ranges and dimensions, redraws yAxis, redraws xAxis
	  // …then redraws yAxis again if tick wrapping has changed xAxis height

	  var newXAxisObj, newYAxisObj;

	  newYAxisObj = axisManager(node, obj, yAxisObj.axis.scale(), 'yAxis');

	  var scaleObj = {
	    rangeType: 'range',
	    range: xAxisObj.range || [0, obj.dimensions.tickWidth()],
	    bands: obj.dimensions.bands,
	    rangePoints: obj.xAxis.rangePoints
	  };

	  setRangeArgs(xAxisObj.axis.scale(), scaleObj);

	  var prevXAxisHeight = obj.dimensions.xAxisHeight;

	  newXAxisObj = axisManager(node, obj, xAxisObj.axis.scale(), 'xAxis');

	  newXAxisObj.node
	    .attr('transform', ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", " + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")"));

	  if (obj.xAxis.scale !== 'ordinal') {
	    dropOversetTicks(newXAxisObj.node, obj.dimensions.tickWidth());
	  }

	  if (prevXAxisHeight !== obj.dimensions.xAxisHeight) {
	    newYAxisObj = axisManager(node, obj, yAxisObj.axis.scale(), 'yAxis');
	  }

	  // reset x-axis object values
	  xAxisObj.node = newXAxisObj.node;
	  xAxisObj.axis = newXAxisObj.axis;

	  // reset y-axis object values
	  yAxisObj.node = newYAxisObj.node;
	  yAxisObj.axis = newYAxisObj.axis;

	}

	function addZeroLine(obj, node, Axis, axisType) {
	  var ticks$$1 = Axis.axis.tickValues(),
	    tickMin = ticks$$1[0],
	    tickMax = ticks$$1[ticks$$1.length - 1];

	  if ((tickMin <= 0) && (0 <= tickMax)) {
	    var refGroup = Axis.node.selectAll((".tick:not(." + (obj.prefix) + "minor)")),
	      refLine = refGroup.select('line');

	    // zero line
	    var zeroLine = node.append('line')
	      .style('shape-rendering', 'crispEdges')
	      .attr('class', ((obj.prefix) + "zero-line"));

	    var transform = [0, 0];

	    transform[0] += getTranslate(node.select(("." + (obj.prefix + axisType))).node())[0];
	    transform[1] += getTranslate(node.select(("." + (obj.prefix + axisType))).node())[1];
	    transform[0] += getTranslate(refGroup.node())[0];
	    transform[1] += getTranslate(refGroup.node())[1];

	    if (axisType === 'xAxis') {
	      zeroLine.attrs({
	        'y1': refLine.attr('y1'),
	        'y2': refLine.attr('y2'),
	        'x1': 0,
	        'x2': 0,
	        'transform': ("translate(" + (transform[0]) + "," + (transform[1]) + ")")
	      });

	    } else if (axisType === 'yAxis') {

	      zeroLine.attrs({
	        'x1': refLine.attr('x1'),
	        'x2': refLine.attr('x2'),
	        'y1': 0,
	        'y2': 0,
	        'transform': ("translate(" + (transform[0]) + "," + (transform[1]) + ")")
	      });

	    }

	  }

	}

	function lineChart(node, obj) {

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  if (xScaleObj.obj.type === 'ordinal') {
	    xScale
	      .range([0, obj.dimensions.tickWidth()])
	      .padding(0);
	  }

	  if (obj.data.seriesAmount === 1) {
	    obj.seriesHighlight = function () { return 0; };
	  }

	  var seriesGroup = node.append('g')
	    .attrs({
	      'class': function () {
	        var output = (obj.prefix) + "series_group";
	        if (obj.data.seriesAmount > 1) {
	          // If more than one series append a 'muliple' class so we can target
	          output += " " + (obj.prefix) + "multiple";
	        }
	        return output;
	      },
	      'transform': function () {
	        if (xScaleObj.obj.type === 'ordinal') {
	          return ("translate(" + (xScale.bandwidth() / 2) + ",0)");
	        }
	      }
	    });

	  var loop = function ( i ) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines

	    if (i !== obj.seriesHighlight()) {

	      var l = line().curve(getCurve(obj.options.interpolation))
	        .defined(function (d) { return !isNaN(d.series[i].val); })
	        .x(function (d) { return xScale(d.key); })
	        .y(function (d) { return yScale(d.series[i].val); });

	      var pathRef = seriesGroup.append('path')
	        .datum(obj.data.data)
	        .attrs({
	          'd': l,
	          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	          'class': function () {
	            return ((obj.prefix) + "line " + (obj.prefix) + "line-" + i);
	          }
	        });
	    }

	  };

	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) loop( i );

	  var hLine = line().curve(getCurve(obj.options.interpolation))
	    .defined(function (d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function (d) { return xScale(d.key); })
	    .y(function (d) { return yScale(d.series[obj.seriesHighlight()].val); });

	  seriesGroup.append('path')
	    .datum(obj.data.data)
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'class': function () {
	        return ((obj.prefix) + "line " + (obj.prefix) + "line-" + (obj.seriesHighlight()) + " " + (obj.prefix) + "highlight");
	      },
	      'd': hLine
	    });

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };

	}

	function multiLineChart(node, obj) {

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  if (xScaleObj.obj.type === 'ordinal') {
	    xScale
	      .range([0, obj.dimensions.tickWidth()])
	      .padding(0);
	  }

	  if (obj.data.seriesAmount === 1) {
	    obj.seriesHighlight = function () { return 0; };
	  }

	  var seriesGroup = node.append('g')
	    .attrs({
	      'class': function () {
	        var output = (obj.prefix) + "series_group";
	        if (obj.data.seriesAmount > 1) {
	          // If more than one series append a 'muliple' class so we can target
	          output += " " + (obj.prefix) + "multiple";
	        }
	        return output;
	      },
	      'transform': function () {
	        if (xScaleObj.obj.type === 'ordinal') {
	          return ("translate(" + (xScale.bandwidth() / 2) + ",0)");
	        }
	      }
	    });

	  var loop = function ( i ) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines

	    if (i !== obj.seriesHighlight()) {

	      var l = line().curve(getCurve(obj.options.interpolation))
	        .defined(function (d) { return !isNaN(d.series[i].val); })
	        .x(function (d) { return xScale(d.key); })
	        .y(function (d) { return yScale(d.series[i].val); });

	      var pathRef = seriesGroup.append('path')
	        .datum(obj.data.data)
	        .attrs({
	          'd': l,
	          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	          'class': function () {
	            return ((obj.prefix) + "multiline " + (obj.prefix) + "multiline-" + i);
	          }
	        });
	    }

	  };

	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) loop( i );

	  var hLine = line().curve(getCurve(obj.options.interpolation))
	    .defined(function (d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function (d) { return xScale(d.key); })
	    .y(function (d) { return yScale(d.series[obj.seriesHighlight()].val); });

	  seriesGroup.append('path')
	    .datum(obj.data.data)
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'class': function () {
	        return ((obj.prefix) + "multiline " + (obj.prefix) + "multiline-" + (obj.seriesHighlight()) + " " + (obj.prefix) + "highlight");
	      },
	      'd': hLine
	    });

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    line: line
	  };

	}

	function areaChart(node, obj) {

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  if (xScaleObj.obj.type === 'ordinal') {
	    xScale
	      .range([0, obj.dimensions.tickWidth()])
	      .padding(0);
	  }

	  if (obj.data.seriesAmount === 1) {
	    obj.seriesHighlight = function () { return 0; };
	  }

	  var seriesGroup = node.append('g')
	    .attrs({
	      'class': function () {
	        var output = (obj.prefix) + "series_group";
	        if (obj.data.seriesAmount > 1) {
	          // If more than one series append a 'muliple' class so we can target
	          output += " " + (obj.prefix) + "multiple";
	        }
	        return output;
	      },
	      'transform': function () {
	        if (xScaleObj.obj.type === 'ordinal') {
	          return ("translate(" + (xScale.bandwidth() / 2) + ",0)");
	        }
	      }
	    });

	  var loop = function ( i ) {
	    // Dont want to include the highlighted item in the loop
	    // because we always want it to sit above all the other lines

	    if (i !== obj.seriesHighlight()) {

	      var a = area().curve(getCurve(obj.options.interpolation))
	        .defined(function (d) { return !isNaN(d.series[i].val); })
	        .x(function (d) { return xScale(d.key); })
	        .y0(yScale(0))
	        .y1(function (d) { return yScale(d.series[i].val); });

	      var l = line().curve(getCurve(obj.options.interpolation))
	        .defined(function (d) { return !isNaN(d.series[i].val); })
	        .x(function (d) { return xScale(d.key); })
	        .y(function (d) { return yScale(d.series[i].val); });

	      var pathRef = seriesGroup.append('path')
	        .datum(obj.data.data)
	        .attrs({
	          'd': a,
	          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	          'class': function () {
	            return ((obj.prefix) + "fill " + (obj.prefix) + "fill-" + i);
	          }
	        });

	      seriesGroup.append('path')
	        .datum(obj.data.data)
	        .attrs({
	          'd': l,
	          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	          'class': function () {
	            return ((obj.prefix) + "line " + (obj.prefix) + "line-" + i);
	          }
	        });
	    }

	  };

	  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) loop( i );

	  var hArea = area().curve(getCurve(obj.options.interpolation))
	    .defined(function (d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function (d) { return xScale(d.key); })
	    .y0(yScale(0))
	    .y1(function (d) { return yScale(d.series[obj.seriesHighlight()].val); });

	  var hLine = line().curve(getCurve(obj.options.interpolation))
	    .defined(function (d) { return !isNaN(d.series[obj.seriesHighlight()].val); })
	    .x(function (d) { return xScale(d.key); })
	    .y(function (d) { return yScale(d.series[obj.seriesHighlight()].val); });

	  seriesGroup.append('path')
	    .datum(obj.data.data)
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'class': function () {
	        return ((obj.prefix) + "fill " + (obj.prefix) + "fill-" + (obj.seriesHighlight()) + " " + (obj.prefix) + "highlight");
	      },
	      'd': hArea
	    });

	  seriesGroup.append('path')
	    .datum(obj.data.data)
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'class': function () {
	        return ((obj.prefix) + "line " + (obj.prefix) + "line-" + (obj.seriesHighlight()) + " " + (obj.prefix) + "highlight");
	      },
	      'd': hLine
	    });

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    hLine: hLine,
	    hArea: hArea,
	    line: line,
	    area: area
	  };

	}

	function stackedAreaChart(node, obj) {

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  if (xScaleObj.obj.type === 'ordinal') {
	    xScale
	      .range([0, obj.dimensions.tickWidth()])
	      .padding(0);
	  }

	  if (obj.data.seriesAmount === 1) {
	    obj.seriesHighlight = function () { return 0; };
	  }

	  node.classed(((obj.prefix) + "stacked"), true);

	  var seriesGroup = node.append('g')
	    .attrs({
	      'class': function () {
	        var output = (obj.prefix) + "series_group";
	        if (obj.data.seriesAmount > 1) {
	          // If more than one series append a 'muliple' class so we can target
	          output += " " + (obj.prefix) + "multiple";
	        }
	        return output;
	      },
	      'transform': function () {
	        if (xScaleObj.obj.type === 'ordinal') {
	          return ("translate(" + (xScale.bandwidth() / 2) + ",0)");
	        }
	      }
	    });

	  var series = seriesGroup.selectAll(("g." + (obj.prefix) + "series"))
	    .data(obj.data.stackedData)
	    .enter().append('g')
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'class': function (d, i) {
	        var output = (obj.prefix) + "series " + (obj.prefix) + "series-" + i;
	        if (i === obj.seriesHighlight()) { output += " " + (obj.prefix) + "highlight"; }
	        return output;
	      }
	    });

	  var a = area().curve(getCurve(obj.options.interpolation))
	    .defined(function (d) { return !isNaN(d[0] + d[1]); })
	    .x(function (d) { return xScale(d.data[obj.data.keys[0]]); })
	    .y0(function (d) { return yScale(d[0]); })
	    .y1(function (d) { return yScale(d[1]); });

	  var l = line().curve(getCurve(obj.options.interpolation))
	    .defined(function (d) { return !isNaN(d[0] + d[1]); })
	    .x(function (d) { return xScale(d.data[obj.data.keys[0]]); })
	    .y(function (d) { return yScale(d[1]); });

	  series.append('path')
	    .attr('class', function (d, i) {
	      var output = (obj.prefix) + "fill " + (obj.prefix) + "fill-" + i;
	      if (i === obj.seriesHighlight()) { output += " " + (obj.prefix) + "highlight"; }
	      return output;
	    })
	    .attr('d', a);

	  series.append('path')
	    .attr('class', function (d, i) { return ((obj.prefix) + "line " + (obj.prefix) + "line-" + i); })
	    .attr('d', l);

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    line: line,
	    area: area
	  };

	}

	function columnChart(node, obj) {

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  var singleColumn;

	  switch (obj.xAxis.scale) {
	    case 'time':
	      singleColumn = obj.dimensions.tickWidth() / (timeInterval(obj.data.data) + 1) / obj.data.seriesAmount;
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - (singleColumn * obj.data.seriesAmount))];
	      axisCleanup(node, obj, xAxisObj, yAxisObj);
	      break;
	    case 'ordinal-time':
	      singleColumn = xScale.step();
	      break;
	    case 'ordinal':
	      singleColumn = xScale.bandwidth() / obj.data.seriesAmount;
	      break;
	  }

	  var seriesGroup = node.append('g')
	    .attr('class', function () {
	      var output = (obj.prefix) + "series_group";
	      if (obj.data.seriesAmount > 1) { output += " " + (obj.prefix) + "multiple"; }
	      return output;
	    })
	    .attr('transform', ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"));

	  var series = [], columnItems = [];

	  var loop = function ( i ) {

	    var seriesItem = seriesGroup.append('g').attr('class', ((obj.prefix) + "series-" + i));

	    var columnItem = seriesItem
	      .selectAll(("." + (obj.prefix) + "column"))
	      .data(obj.data.data).enter()
	      .append('g')
	      .attrs({
	        'class': ((obj.prefix) + "column " + (obj.prefix) + "column-" + i),
	        'data-series': i,
	        'data-key': function (d) { return d.key; },
	        'data-legend': function () { return obj.data.keys[i + 1]; },
	        'transform': function (d) {
	          if (obj.xAxis.scale !== 'ordinal-time') {
	            return ("translate(" + (xScale(d.key)) + ",0)");
	          }
	        }
	      });

	    columnItem.append('rect')
	      .attrs({
	        'class': function (d) {
	          return d.series[i].val < 0 ? ((obj.prefix) + "negative") : ((obj.prefix) + "positive");
	        },
	        'x': function (d) {
	          if (obj.xAxis.scale !== 'ordinal-time') {
	            return i * singleColumn;
	          } else {
	            return xScale(d.key);
	          }
	        },
	        'y': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return yScale(Math.max(0, d.series[i].val));
	          }
	        },
	        'height': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return Math.abs(yScale(d.series[i].val) - yScale(0));
	          }
	        },
	        'width': function () {
	          if (obj.xAxis.scale !== 'ordinal-time') {
	            return singleColumn;
	          } else {
	            return singleColumn / obj.data.seriesAmount;
	          }
	        }
	      });

	    if (obj.data.seriesAmount > 1) {

	      var columnOffset = obj.dimensions.bands.offset;

	      columnItem.selectAll('rect')
	        .attrs({
	          'x': function (d) {
	            if (obj.xAxis.scale !== 'ordinal-time') {
	              return ((i * singleColumn) + (singleColumn * (columnOffset / 2)));
	            } else {
	              return xScale(d.key) + (i * (singleColumn / obj.data.seriesAmount));
	            }
	          },
	          'width': function () {
	            if (obj.xAxis.scale !== 'ordinal-time') {
	              return (singleColumn - (singleColumn * columnOffset));
	            } else {
	              return singleColumn / obj.data.seriesAmount;
	            }
	          }
	        });
	    }

	    series.push(seriesItem);
	    columnItems.push(columnItem);

	  };

	  for (var i = 0; i < obj.data.seriesAmount; i++) loop( i );

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleColumn: singleColumn,
	    columnItems: columnItems
	  };

	}

	function barChart(node, obj) {

	  // because the elements will be appended in reverse due to the
	  // bar chart operating on the y-axis, need to reverse the dataset
	  obj.data.data.reverse();

	  var yScaleObj = new scaleManager(obj, 'yAxis'),
	    yScale = yScaleObj.scale;

	  var totalBarHeight, barLabelOffset;

	  if (obj.exportable && obj.exportable.barLabelOffset) {
	    barLabelOffset = obj.exportable.barLabelOffset;
	  } else {
	    barLabelOffset = obj.dimensions.barLabelOffset;
	  }

	  // need this for fixed-height bars
	  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
	    var bands = obj.dimensions.bands;
	    var step = obj.dimensions.barHeight / ((bands.padding * -1) + 1);
	    totalBarHeight = (step * obj.data.data.length * obj.data.seriesAmount) - (step * bands.padding) + (step * bands.outerPadding * 2);
	    yScale.range([totalBarHeight, 0]);
	    obj.dimensions.yAxisHeight = function () { return totalBarHeight; };
	  }

	  var yAxisObj = new axisManager(node, obj, yScale, 'yAxis');

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    xScale = xScaleObj.scale;

	  var seriesGroup = node.append('g')
	    .attr('class', function () {
	      var output = (obj.prefix) + "series_group";
	      if (obj.data.seriesAmount > 1) { output += " " + (obj.prefix) + "multiple"; }
	      return output;
	    })
	    .attr('transform', ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"));

	  var singleBar = yScale.bandwidth() / obj.data.seriesAmount;

	  var series = [], barItems = [];

	  var widestText = { width: null, height: null };

	  var loop = function ( i ) {

	    var seriesItem = seriesGroup.append('g').attr('class', ((obj.prefix) + "series-" + i));

	    var barItem = seriesItem
	      .selectAll(("." + (obj.prefix) + "bar"))
	      .data(obj.data.data).enter()
	      .append('g')
	      .attrs({
	        'class': ((obj.prefix) + "bar " + (obj.prefix) + "bar-" + i),
	        'data-series': i,
	        'data-key': function (d) { return d.key; },
	        'data-legend': function () { return obj.data.keys[i + 1]; },
	        'transform': function (d) { return ("translate(0," + (yScale(d.key)) + ")"); }
	      });

	    barItem.append('rect')
	      .attrs({
	        'class': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return d.series[i].val < 0 ? 'negative' : 'positive';
	          }
	        },
	        'width': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return Math.abs(xScale(d.series[i].val) - xScale(0));
	          }
	        },
	        'x': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return xScale(Math.min(0, d.series[i].val));
	          }
	        },
	        'y': i * singleBar,
	        'height': singleBar
	      });

	    barItem.append('text')
	      .attrs({
	        'x': 0,
	        'y': (i * singleBar),
	        'class': ((obj.prefix) + "bar-label")
	      })
	      .text(function (d, j) {
	        if (d.series[i].val && d.series[i].val !== '__undefined__') {
	          var val = setTickFormat(obj.xAxis.format, d.series[i].val);
	          if (i === 0 && j === obj.data.data.length - 1) {
	            val = (obj.xAxis.prefix || '') + val + (obj.xAxis.suffix || '');
	          }
	          return val;
	        }
	      })
	      .each(function() {
	        if (Math.ceil(this.getComputedTextLength()) > widestText.width) {
	          widestText.width = Math.ceil(this.getComputedTextLength());
	        }
	        if (this.getBBox().height > widestText.height) {
	          widestText.height = this.getBBox().height;
	        }
	      });

	    if (obj.data.seriesAmount > 1) {
	      var barOffset = obj.dimensions.bands.offset;
	      barItem
	        .attr('transform', function (d) {
	          var offset = i * (singleBar * (barOffset / 2));
	          return ("translate(0," + (yScale(d.key) + offset) + ")");
	        });
	    }

	    series.push(seriesItem);
	    barItems.push(barItem);

	  };

	  for (var i = 0; i < obj.data.seriesAmount; i++) loop( i );

	  xScale.range([0, obj.dimensions.tickWidth() - widestText.width - barLabelOffset]);

	  var loop$1 = function ( i ) {
	    series[i].selectAll(("." + (obj.prefix) + "bar rect"))
	      .attrs({
	        'width': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return Math.abs(xScale(d.series[i].val) - xScale(0));
	          }
	        },
	        'x': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return xScale(Math.min(0, d.series[i].val));
	          }
	        }
	      });

	    series[i].selectAll(("." + (obj.prefix) + "bar-label"))
	      .attrs({
	        'x': function (d) {
	          if (d.series[i].val && d.series[i].val !== '__undefined__') {
	            return xScale(Math.max(0, d.series[i].val)) + barLabelOffset;
	          }
	        },
	        'y': function () { return i * singleBar + Math.ceil(singleBar / 2); }
	      });
	  };

	  for (var i$1 = 0; i$1 < series.length; i$1++) loop$1( i$1 );

	  node.append('line')
	    .style('shape-rendering', 'crispEdges')
	    .attrs({
	      'class': ((obj.prefix) + "zero-line"),
	      'y1': yScale.range()[0],
	      'y2': yScale.range()[1],
	      'x1': xScale(0),
	      'x2': xScale(0),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)")
	    });

	  if (!obj.exportable || !obj.exportable.height) {

	    obj.dimensions.computedHeight = function() { return node.node().getBoundingClientRect().height; };

	    // fixed height, so transform accordingly and modify the dimension function and parent rects
	    select(node.node().parentNode)
	      .attr('height', function () {
	        var margin = obj.dimensions.margin;
	        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
	      });

	    select(node.node().parentNode).select(("." + (obj.prefix) + "bg"))
	      .attr('height', obj.dimensions.computedHeight());

	  }

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleBar: singleBar,
	    barItems: barItems
	  };

	}

	function stackedBarChart(node, obj) {

	  // because the elements will be appended in reverse due to the
	  // bar chart operating on the y-axis, need to reverse the dataset
	  obj.data.data.reverse();

	  var yScaleObj = new scaleManager(obj, 'yAxis'),
	    yScale = yScaleObj.scale;

	  var totalBarHeight;

	  // need this for fixed-height bars
	  if (!obj.exportable || (obj.exportable && !obj.exportable.dynamicHeight)) {
	    var bands = obj.dimensions.bands;
	    var step = obj.dimensions.barHeight / ((bands.padding * -1) + 1);
	    totalBarHeight = (step * obj.data.data.length) - (step * bands.padding) + (step * bands.outerPadding * 2);
	    yScale.range([totalBarHeight, 0]);
	    obj.dimensions.yAxisHeight = function () { return totalBarHeight; };
	  }

	  var yAxisObj = new axisManager(node, obj, yScale, 'yAxis');

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    xScale = xScaleObj.scale;

	  var seriesGroup = node.append('g')
	    .attr('class', function () {
	      var output = (obj.prefix) + "series_group";
	      if (obj.data.seriesAmount > 1) { output += " " + (obj.prefix) + "multiple"; }
	      return output;
	    })
	    .attr('transform', ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"));

	  var singleBar = yScale.bandwidth();

	  var widestText = { value: null, width: null, height: null };

	  var series = seriesGroup.selectAll(("g." + (obj.prefix) + "series"))
	    .data(obj.data.stackedData)
	    .enter().append('g')
	    .attr('class', function (d, i) { return ((obj.prefix) + "series " + (obj.prefix) + "series-" + i); });

	  var barItem = series
	    .append('g')
	    .attrs({
	      'class': function (d, i) { return ((obj.prefix) + "bar " + (obj.prefix) + "bar-" + i); },
	      'data-legend': function (d) { return d.key; },
	    });

	  var rect = barItem.selectAll('rect')
	    .data(function (d) { return d; })
	    .enter().append('rect')
	    .attrs({
	      'data-key': function (d) { return d.data[obj.data.keys[0]]; },
	      'y': function (d) { return yScale(d.data[obj.data.keys[0]]); },
	      'x': function (d) { return xScale(d[0]); },
	      'width': function (d) { return Math.abs(xScale(d[1]) - xScale(d[0])); },
	      'height': singleBar
	    });

	  var textGroup = seriesGroup.append('g')
	    .attr('class', ((obj.prefix) + "bar-labels"));

	  var lastStack = obj.data.stackedData[obj.data.stackedData.length - 1];

	  var text = textGroup.selectAll(("." + (obj.prefix) + "bar-label"))
	    .data(function () {
	      return [].concat(yScale.domain()).reverse().map(function (d) {
	        var data = obj.data.data.filter(function (item) { return item.key === d; })[0];
	        return {
	          key: d,
	          value: data.series.reduce(function (a, b) {
	            return (typeof a === 'number' ? a : Number(a.val)) + Number(b.val);
	          })
	        };
	      });
	    })
	    .enter().append('text')
	    .attrs({
	      'class': function (d, i) { return ((obj.prefix) + "bar-label " + (obj.prefix) + "bar-label-" + i); },
	      'data-legend': function (d) { return d.key; },
	      'x': function (d, i) { return xScale(Math.max(0, lastStack[i][1])); },
	      'y': function (d) { return yScale(d.key) + Math.ceil(singleBar / 2); }
	    })
	    .text(function (d, i) {
	      var val = setTickFormat(obj.xAxis.format, d.value);
	      if (i === 0) {
	        val = (obj.xAxis.prefix || '') + val + (obj.xAxis.suffix || '');
	      }
	      return val;
	    })
	    .each(function(d) {
	      if (d.value > widestText.value) {
	        widestText.value = d.value;
	        widestText.width = Math.ceil(this.getComputedTextLength());
	      }
	      if (this.getBBox().height > widestText.height) {
	        widestText.height = this.getBBox().height;
	      }
	    });

	  xScale.range([0, obj.dimensions.tickWidth() - widestText.width - obj.dimensions.barLabelOffset]);

	  rect
	    .attrs({
	      'x': function (d) { return xScale(d[0]); },
	      'width': function (d) { return Math.abs(xScale(d[1]) - xScale(d[0])); }
	    });

	  text
	    .attrs({
	      'x': function (d) {
	        return xScale(Math.max(0, d.value)) + obj.dimensions.barLabelOffset;
	      }
	    });

	  node.append('line')
	    .style('shape-rendering', 'crispEdges')
	    .attrs({
	      'class': ((obj.prefix) + "zero-line"),
	      'y1': yScale.range()[0],
	      'y2': yScale.range()[1],
	      'x1': xScale(0),
	      'x2': xScale(0),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)")
	    });

	  if (!obj.exportable) {

	    obj.dimensions.computedHeight = function() { return node.node().getBoundingClientRect().height; };

	    // fixed height, so transform accordingly and modify the dimension function and parent rects
	    select(node.node().parentNode)
	      .attr('height', function () {
	        var margin = obj.dimensions.margin;
	        return obj.dimensions.computedHeight() + margin.top + margin.bottom;
	      });

	    select(node.node().parentNode).select(("." + (obj.prefix) + "bg"))
	      .attr('height', obj.dimensions.computedHeight());

	  }

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    singleBar: singleBar,
	    barItem: barItem,
	    rect: rect,
	    textGroup: textGroup,
	    text: text
	  };

	}

	function stackedColumnChart(node, obj) {

	  var yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScale = yScaleObj.scale,
	    xScale = xScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  var singleColumn;

	  switch (obj.xAxis.scale) {
	    case 'time':
	      singleColumn = obj.dimensions.tickWidth() / (timeInterval(obj.data.data) + 1);
	      xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];
	      axisCleanup(node, obj, xAxisObj, yAxisObj);
	      break;
	    case 'ordinal-time':
	      singleColumn = xScale.step();
	      break;
	    case 'ordinal':
	      singleColumn = xScale.bandwidth();
	      break;
	  }

	  var seriesGroup = node.append('g')
	    .attr('class', function () {
	      var output = (obj.prefix) + "series_group";
	      if (obj.data.seriesAmount > 1) { output += " " + (obj.prefix) + "multiple"; }
	      return output;
	    })
	    .attr('transform', function () {
	      return ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)");
	    });

	  var series = seriesGroup.selectAll(("g." + (obj.prefix) + "series"))
	    .data(obj.data.stackedData)
	    .enter().append('g')
	    .attr('class', function (d, i) { return ((obj.prefix) + "series " + (obj.prefix) + "series-" + i); });

	  var columnItem = series
	    .append('g')
	    .attrs({
	      'class': function (d, i) { return ((obj.prefix) + "column " + (obj.prefix) + "column-" + i); },
	      'data-legend': function (d) { return d.key; },
	    });

	  var rect = columnItem.selectAll('rect')
	    .data(function (d) { return d; })
	    .enter().append('rect')
	    .attrs({
	      'data-key': function (d) { return d.data[obj.data.keys[0]]; },
	      'x': function (d) { return xScale(d.data[obj.data.keys[0]]); },
	      'y': function (d) { return yScale(Math.max(0, d[1])); },
	      'height': function (d) { return Math.abs(yScale(d[1]) - yScale(d[0])); },
	      'width': singleColumn
	    });

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    series: series,
	    rect: rect,
	    singleColumn: singleColumn
	  };

	}

	function scatterplotChart(node, obj) {

	  var xScaleObj = new scaleManager(obj, 'xAxis'),
	    yScaleObj = new scaleManager(obj, 'yAxis'),
	    xScale = xScaleObj.scale, yScale = yScaleObj.scale;

	  var xAxisObj = new axisManager(node, obj, xScaleObj.scale, 'xAxis'),
	    yAxisObj = new axisManager(node, obj, yScaleObj.scale, 'yAxis');

	  axisCleanup(node, obj, xAxisObj, yAxisObj);

	  addZeroLine(obj, node, yAxisObj, 'yAxis');

	  var seriesGroup = node.append('g')
	    .attr('class', ((obj.prefix) + "series_group"));

	  var dotItems = seriesGroup
	    .selectAll(("." + (obj.prefix) + "dot"))
	    .data(obj.data.data).enter()
	    .append('circle')
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'class': function (d) {
	        var output = (obj.prefix) + "dot";
	        if (obj.data.groups) {
	          var groupIndex = obj.data.groups.indexOf(d.group);
	          output += " " + (obj.prefix) + "dot-" + groupIndex;
	        } else {
	          output += " " + (obj.prefix) + "dot-0";
	        }
	        return output;
	      },
	      'data-key': function (d) { return d.key; },
	      'data-group': function (d) { return d.group; },
	      'cx': function (d) { return xScale(d.series[0].val); },
	      'cy': function (d) { return yScale(d.series[1].val); },
	      'r': obj.dimensions.scatterplotRadius
	    });

	  return {
	    xScaleObj: xScaleObj,
	    yScaleObj: yScaleObj,
	    xAxisObj: xAxisObj,
	    yAxisObj: yAxisObj,
	    seriesGroup: seriesGroup,
	    dotItems: dotItems
	  };

	}

	function plot(node, obj) {
	  switch(obj.options.type) {
	    case 'line':
	      return lineChart(node, obj);
	    case 'multiline':
	      return multiLineChart(node, obj);
	    case 'area':
	      return obj.options.stacked ? stackedAreaChart(node, obj) : areaChart(node, obj);
	    case 'bar':
	      return obj.options.stacked ? stackedBarChart(node, obj) : barChart(node, obj);
	    case 'column':
	      return obj.options.stacked ? stackedColumnChart(node, obj) : columnChart(node, obj);
	    case 'scatterplot':
	      return scatterplotChart(node, obj);
	    default:
	      return lineChart(node, obj);
	  }
	}

	function nopropagation() {
	  event.stopImmediatePropagation();
	}

	function noevent() {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	function nodrag(view) {
	  var root = view.document.documentElement,
	      selection$$1 = select(view).on("dragstart.drag", noevent, true);
	  if ("onselectstart" in root) {
	    selection$$1.on("selectstart.drag", noevent, true);
	  } else {
	    root.__noselect = root.style.MozUserSelect;
	    root.style.MozUserSelect = "none";
	  }
	}

	function yesdrag(view, noclick) {
	  var root = view.document.documentElement,
	      selection$$1 = select(view).on("dragstart.drag", null);
	  if (noclick) {
	    selection$$1.on("click.drag", noevent, true);
	    setTimeout(function() { selection$$1.on("click.drag", null); }, 0);
	  }
	  if ("onselectstart" in root) {
	    selection$$1.on("selectstart.drag", null);
	  } else {
	    root.style.MozUserSelect = root.__noselect;
	    delete root.__noselect;
	  }
	}

	function constant$5(x) {
	  return function() {
	    return x;
	  };
	}

	function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
	  this.target = target;
	  this.type = type;
	  this.subject = subject;
	  this.identifier = id;
	  this.active = active;
	  this.x = x;
	  this.y = y;
	  this.dx = dx;
	  this.dy = dy;
	  this._ = dispatch;
	}

	DragEvent.prototype.on = function() {
	  var value = this._.on.apply(this._, arguments);
	  return value === this._ ? this : value;
	};

	// Ignore right-click, since that should open the context menu.
	function defaultFilter() {
	  return !event.button;
	}

	function defaultContainer() {
	  return this.parentNode;
	}

	function defaultSubject(d) {
	  return d == null ? {x: event.x, y: event.y} : d;
	}

	function defaultTouchable() {
	  return "ontouchstart" in this;
	}

	function drag() {
	  var filter = defaultFilter,
	      container = defaultContainer,
	      subject = defaultSubject,
	      touchable = defaultTouchable,
	      gestures = {},
	      listeners = dispatch("start", "drag", "end"),
	      active = 0,
	      mousedownx,
	      mousedowny,
	      mousemoving,
	      touchending,
	      clickDistance2 = 0;

	  function drag(selection$$1) {
	    selection$$1
	        .on("mousedown.drag", mousedowned)
	      .filter(touchable)
	        .on("touchstart.drag", touchstarted)
	        .on("touchmove.drag", touchmoved)
	        .on("touchend.drag touchcancel.drag", touchended)
	        .style("touch-action", "none")
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
	  }

	  function mousedowned() {
	    if (touchending || !filter.apply(this, arguments)) return;
	    var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
	    if (!gesture) return;
	    select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
	    nodrag(event.view);
	    nopropagation();
	    mousemoving = false;
	    mousedownx = event.clientX;
	    mousedowny = event.clientY;
	    gesture("start");
	  }

	  function mousemoved() {
	    noevent();
	    if (!mousemoving) {
	      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
	      mousemoving = dx * dx + dy * dy > clickDistance2;
	    }
	    gestures.mouse("drag");
	  }

	  function mouseupped() {
	    select(event.view).on("mousemove.drag mouseup.drag", null);
	    yesdrag(event.view, mousemoving);
	    noevent();
	    gestures.mouse("end");
	  }

	  function touchstarted() {
	    if (!filter.apply(this, arguments)) return;
	    var touches$$1 = event.changedTouches,
	        c = container.apply(this, arguments),
	        n = touches$$1.length, i, gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = beforestart(touches$$1[i].identifier, c, touch, this, arguments)) {
	        nopropagation();
	        gesture("start");
	      }
	    }
	  }

	  function touchmoved() {
	    var touches$$1 = event.changedTouches,
	        n = touches$$1.length, i, gesture;

	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches$$1[i].identifier]) {
	        noevent();
	        gesture("drag");
	      }
	    }
	  }

	  function touchended() {
	    var touches$$1 = event.changedTouches,
	        n = touches$$1.length, i, gesture;

	    if (touchending) clearTimeout(touchending);
	    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
	    for (i = 0; i < n; ++i) {
	      if (gesture = gestures[touches$$1[i].identifier]) {
	        nopropagation();
	        gesture("end");
	      }
	    }
	  }

	  function beforestart(id, container, point, that, args) {
	    var p = point(container, id), s, dx, dy,
	        sublisteners = listeners.copy();

	    if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
	      if ((event.subject = s = subject.apply(that, args)) == null) return false;
	      dx = s.x - p[0] || 0;
	      dy = s.y - p[1] || 0;
	      return true;
	    })) return;

	    return function gesture(type) {
	      var p0 = p, n;
	      switch (type) {
	        case "start": gestures[id] = gesture, n = active++; break;
	        case "end": delete gestures[id], --active; // nobreak
	        case "drag": p = point(container, id), n = active; break;
	      }
	      customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
	    };
	  }

	  drag.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$5(!!_), drag) : filter;
	  };

	  drag.container = function(_) {
	    return arguments.length ? (container = typeof _ === "function" ? _ : constant$5(_), drag) : container;
	  };

	  drag.subject = function(_) {
	    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$5(_), drag) : subject;
	  };

	  drag.touchable = function(_) {
	    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$5(!!_), drag) : touchable;
	  };

	  drag.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? drag : value;
	  };

	  drag.clickDistance = function(_) {
	    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
	  };

	  return drag;
	}

	function constant$6(x) {
	  return function() {
	    return x;
	  };
	}

	function BrushEvent(target, type, selection) {
	  this.target = target;
	  this.type = type;
	  this.selection = selection;
	}

	function nopropagation$1() {
	  event.stopImmediatePropagation();
	}

	function noevent$1() {
	  event.preventDefault();
	  event.stopImmediatePropagation();
	}

	var MODE_DRAG = {name: "drag"},
	    MODE_SPACE = {name: "space"},
	    MODE_HANDLE = {name: "handle"},
	    MODE_CENTER = {name: "center"};

	var X = {
	  name: "x",
	  handles: ["e", "w"].map(type),
	  input: function(x, e) { return x && [[x[0], e[0][1]], [x[1], e[1][1]]]; },
	  output: function(xy) { return xy && [xy[0][0], xy[1][0]]; }
	};

	var Y = {
	  name: "y",
	  handles: ["n", "s"].map(type),
	  input: function(y, e) { return y && [[e[0][0], y[0]], [e[1][0], y[1]]]; },
	  output: function(xy) { return xy && [xy[0][1], xy[1][1]]; }
	};

	var cursors = {
	  overlay: "crosshair",
	  selection: "move",
	  n: "ns-resize",
	  e: "ew-resize",
	  s: "ns-resize",
	  w: "ew-resize",
	  nw: "nwse-resize",
	  ne: "nesw-resize",
	  se: "nwse-resize",
	  sw: "nesw-resize"
	};

	var flipX = {
	  e: "w",
	  w: "e",
	  nw: "ne",
	  ne: "nw",
	  se: "sw",
	  sw: "se"
	};

	var flipY = {
	  n: "s",
	  s: "n",
	  nw: "sw",
	  ne: "se",
	  se: "ne",
	  sw: "nw"
	};

	var signsX = {
	  overlay: +1,
	  selection: +1,
	  n: null,
	  e: +1,
	  s: null,
	  w: -1,
	  nw: -1,
	  ne: +1,
	  se: +1,
	  sw: -1
	};

	var signsY = {
	  overlay: +1,
	  selection: +1,
	  n: -1,
	  e: null,
	  s: +1,
	  w: null,
	  nw: -1,
	  ne: -1,
	  se: +1,
	  sw: +1
	};

	function type(t) {
	  return {type: t};
	}

	// Ignore right-click, since that should open the context menu.
	function defaultFilter$1() {
	  return !event.button;
	}

	function defaultExtent() {
	  var svg = this.ownerSVGElement || this;
	  return [[0, 0], [svg.width.baseVal.value, svg.height.baseVal.value]];
	}

	// Like d3.local, but with the name “__brush” rather than auto-generated.
	function local$1(node) {
	  while (!node.__brush) if (!(node = node.parentNode)) return;
	  return node.__brush;
	}

	function empty$1(extent) {
	  return extent[0][0] === extent[1][0]
	      || extent[0][1] === extent[1][1];
	}

	function brushX() {
	  return brush$1(X);
	}

	function brushY() {
	  return brush$1(Y);
	}

	function brush$1(dim) {
	  var extent = defaultExtent,
	      filter = defaultFilter$1,
	      listeners = dispatch(brush, "start", "brush", "end"),
	      handleSize = 6,
	      touchending;

	  function brush(group) {
	    var overlay = group
	        .property("__brush", initialize)
	      .selectAll(".overlay")
	      .data([type("overlay")]);

	    overlay.enter().append("rect")
	        .attr("class", "overlay")
	        .attr("pointer-events", "all")
	        .attr("cursor", cursors.overlay)
	      .merge(overlay)
	        .each(function() {
	          var extent = local$1(this).extent;
	          select(this)
	              .attr("x", extent[0][0])
	              .attr("y", extent[0][1])
	              .attr("width", extent[1][0] - extent[0][0])
	              .attr("height", extent[1][1] - extent[0][1]);
	        });

	    group.selectAll(".selection")
	      .data([type("selection")])
	      .enter().append("rect")
	        .attr("class", "selection")
	        .attr("cursor", cursors.selection)
	        .attr("fill", "#777")
	        .attr("fill-opacity", 0.3)
	        .attr("stroke", "#fff")
	        .attr("shape-rendering", "crispEdges");

	    var handle = group.selectAll(".handle")
	      .data(dim.handles, function(d) { return d.type; });

	    handle.exit().remove();

	    handle.enter().append("rect")
	        .attr("class", function(d) { return "handle handle--" + d.type; })
	        .attr("cursor", function(d) { return cursors[d.type]; });

	    group
	        .each(redraw)
	        .attr("fill", "none")
	        .attr("pointer-events", "all")
	        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)")
	        .on("mousedown.brush touchstart.brush", started);
	  }

	  brush.move = function(group, selection$$1) {
	    if (group.selection) {
	      group
	          .on("start.brush", function() { emitter(this, arguments).beforestart().start(); })
	          .on("interrupt.brush end.brush", function() { emitter(this, arguments).end(); })
	          .tween("brush", function() {
	            var that = this,
	                state = that.__brush,
	                emit = emitter(that, arguments),
	                selection0 = state.selection,
	                selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(this, arguments) : selection$$1, state.extent),
	                i = interpolate(selection0, selection1);

	            function tween(t) {
	              state.selection = t === 1 && empty$1(selection1) ? null : i(t);
	              redraw.call(that);
	              emit.brush();
	            }

	            return selection0 && selection1 ? tween : tween(1);
	          });
	    } else {
	      group
	          .each(function() {
	            var that = this,
	                args = arguments,
	                state = that.__brush,
	                selection1 = dim.input(typeof selection$$1 === "function" ? selection$$1.apply(that, args) : selection$$1, state.extent),
	                emit = emitter(that, args).beforestart();

	            interrupt(that);
	            state.selection = selection1 == null || empty$1(selection1) ? null : selection1;
	            redraw.call(that);
	            emit.start().brush().end();
	          });
	    }
	  };

	  function redraw() {
	    var group = select(this),
	        selection$$1 = local$1(this).selection;

	    if (selection$$1) {
	      group.selectAll(".selection")
	          .style("display", null)
	          .attr("x", selection$$1[0][0])
	          .attr("y", selection$$1[0][1])
	          .attr("width", selection$$1[1][0] - selection$$1[0][0])
	          .attr("height", selection$$1[1][1] - selection$$1[0][1]);

	      group.selectAll(".handle")
	          .style("display", null)
	          .attr("x", function(d) { return d.type[d.type.length - 1] === "e" ? selection$$1[1][0] - handleSize / 2 : selection$$1[0][0] - handleSize / 2; })
	          .attr("y", function(d) { return d.type[0] === "s" ? selection$$1[1][1] - handleSize / 2 : selection$$1[0][1] - handleSize / 2; })
	          .attr("width", function(d) { return d.type === "n" || d.type === "s" ? selection$$1[1][0] - selection$$1[0][0] + handleSize : handleSize; })
	          .attr("height", function(d) { return d.type === "e" || d.type === "w" ? selection$$1[1][1] - selection$$1[0][1] + handleSize : handleSize; });
	    }

	    else {
	      group.selectAll(".selection,.handle")
	          .style("display", "none")
	          .attr("x", null)
	          .attr("y", null)
	          .attr("width", null)
	          .attr("height", null);
	    }
	  }

	  function emitter(that, args) {
	    return that.__brush.emitter || new Emitter(that, args);
	  }

	  function Emitter(that, args) {
	    this.that = that;
	    this.args = args;
	    this.state = that.__brush;
	    this.active = 0;
	  }

	  Emitter.prototype = {
	    beforestart: function() {
	      if (++this.active === 1) this.state.emitter = this, this.starting = true;
	      return this;
	    },
	    start: function() {
	      if (this.starting) this.starting = false, this.emit("start");
	      return this;
	    },
	    brush: function() {
	      this.emit("brush");
	      return this;
	    },
	    end: function() {
	      if (--this.active === 0) delete this.state.emitter, this.emit("end");
	      return this;
	    },
	    emit: function(type) {
	      customEvent(new BrushEvent(brush, type, dim.output(this.state.selection)), listeners.apply, listeners, [type, this.that, this.args]);
	    }
	  };

	  function started() {
	    if (event.touches) { if (event.changedTouches.length < event.touches.length) return noevent$1(); }
	    else if (touchending) return;
	    if (!filter.apply(this, arguments)) return;

	    var that = this,
	        type = event.target.__data__.type,
	        mode = (event.metaKey ? type = "overlay" : type) === "selection" ? MODE_DRAG : (event.altKey ? MODE_CENTER : MODE_HANDLE),
	        signX = dim === Y ? null : signsX[type],
	        signY = dim === X ? null : signsY[type],
	        state = local$1(that),
	        extent = state.extent,
	        selection$$1 = state.selection,
	        W = extent[0][0], w0, w1,
	        N = extent[0][1], n0, n1,
	        E = extent[1][0], e0, e1,
	        S = extent[1][1], s0, s1,
	        dx,
	        dy,
	        moving,
	        shifting = signX && signY && event.shiftKey,
	        lockX,
	        lockY,
	        point0 = mouse(that),
	        point = point0,
	        emit = emitter(that, arguments).beforestart();

	    if (type === "overlay") {
	      state.selection = selection$$1 = [
	        [w0 = dim === Y ? W : point0[0], n0 = dim === X ? N : point0[1]],
	        [e0 = dim === Y ? E : w0, s0 = dim === X ? S : n0]
	      ];
	    } else {
	      w0 = selection$$1[0][0];
	      n0 = selection$$1[0][1];
	      e0 = selection$$1[1][0];
	      s0 = selection$$1[1][1];
	    }

	    w1 = w0;
	    n1 = n0;
	    e1 = e0;
	    s1 = s0;

	    var group = select(that)
	        .attr("pointer-events", "none");

	    var overlay = group.selectAll(".overlay")
	        .attr("cursor", cursors[type]);

	    if (event.touches) {
	      group
	          .on("touchmove.brush", moved, true)
	          .on("touchend.brush touchcancel.brush", ended, true);
	    } else {
	      var view = select(event.view)
	          .on("keydown.brush", keydowned, true)
	          .on("keyup.brush", keyupped, true)
	          .on("mousemove.brush", moved, true)
	          .on("mouseup.brush", ended, true);

	      nodrag(event.view);
	    }

	    nopropagation$1();
	    interrupt(that);
	    redraw.call(that);
	    emit.start();

	    function moved() {
	      var point1 = mouse(that);
	      if (shifting && !lockX && !lockY) {
	        if (Math.abs(point1[0] - point[0]) > Math.abs(point1[1] - point[1])) lockY = true;
	        else lockX = true;
	      }
	      point = point1;
	      moving = true;
	      noevent$1();
	      move();
	    }

	    function move() {
	      var t;

	      dx = point[0] - point0[0];
	      dy = point[1] - point0[1];

	      switch (mode) {
	        case MODE_SPACE:
	        case MODE_DRAG: {
	          if (signX) dx = Math.max(W - w0, Math.min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
	          if (signY) dy = Math.max(N - n0, Math.min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
	          break;
	        }
	        case MODE_HANDLE: {
	          if (signX < 0) dx = Math.max(W - w0, Math.min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
	          else if (signX > 0) dx = Math.max(W - e0, Math.min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
	          if (signY < 0) dy = Math.max(N - n0, Math.min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
	          else if (signY > 0) dy = Math.max(N - s0, Math.min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
	          break;
	        }
	        case MODE_CENTER: {
	          if (signX) w1 = Math.max(W, Math.min(E, w0 - dx * signX)), e1 = Math.max(W, Math.min(E, e0 + dx * signX));
	          if (signY) n1 = Math.max(N, Math.min(S, n0 - dy * signY)), s1 = Math.max(N, Math.min(S, s0 + dy * signY));
	          break;
	        }
	      }

	      if (e1 < w1) {
	        signX *= -1;
	        t = w0, w0 = e0, e0 = t;
	        t = w1, w1 = e1, e1 = t;
	        if (type in flipX) overlay.attr("cursor", cursors[type = flipX[type]]);
	      }

	      if (s1 < n1) {
	        signY *= -1;
	        t = n0, n0 = s0, s0 = t;
	        t = n1, n1 = s1, s1 = t;
	        if (type in flipY) overlay.attr("cursor", cursors[type = flipY[type]]);
	      }

	      if (state.selection) selection$$1 = state.selection; // May be set by brush.move!
	      if (lockX) w1 = selection$$1[0][0], e1 = selection$$1[1][0];
	      if (lockY) n1 = selection$$1[0][1], s1 = selection$$1[1][1];

	      if (selection$$1[0][0] !== w1
	          || selection$$1[0][1] !== n1
	          || selection$$1[1][0] !== e1
	          || selection$$1[1][1] !== s1) {
	        state.selection = [[w1, n1], [e1, s1]];
	        redraw.call(that);
	        emit.brush();
	      }
	    }

	    function ended() {
	      nopropagation$1();
	      if (event.touches) {
	        if (event.touches.length) return;
	        if (touchending) clearTimeout(touchending);
	        touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
	        group.on("touchmove.brush touchend.brush touchcancel.brush", null);
	      } else {
	        yesdrag(event.view, moving);
	        view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
	      }
	      group.attr("pointer-events", "all");
	      overlay.attr("cursor", cursors.overlay);
	      if (state.selection) selection$$1 = state.selection; // May be set by brush.move (on start)!
	      if (empty$1(selection$$1)) state.selection = null, redraw.call(that);
	      emit.end();
	    }

	    function keydowned() {
	      switch (event.keyCode) {
	        case 16: { // SHIFT
	          shifting = signX && signY;
	          break;
	        }
	        case 18: { // ALT
	          if (mode === MODE_HANDLE) {
	            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
	            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
	            mode = MODE_CENTER;
	            move();
	          }
	          break;
	        }
	        case 32: { // SPACE; takes priority over ALT
	          if (mode === MODE_HANDLE || mode === MODE_CENTER) {
	            if (signX < 0) e0 = e1 - dx; else if (signX > 0) w0 = w1 - dx;
	            if (signY < 0) s0 = s1 - dy; else if (signY > 0) n0 = n1 - dy;
	            mode = MODE_SPACE;
	            overlay.attr("cursor", cursors.selection);
	            move();
	          }
	          break;
	        }
	        default: return;
	      }
	      noevent$1();
	    }

	    function keyupped() {
	      switch (event.keyCode) {
	        case 16: { // SHIFT
	          if (shifting) {
	            lockX = lockY = shifting = false;
	            move();
	          }
	          break;
	        }
	        case 18: { // ALT
	          if (mode === MODE_CENTER) {
	            if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
	            if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
	            mode = MODE_HANDLE;
	            move();
	          }
	          break;
	        }
	        case 32: { // SPACE
	          if (mode === MODE_SPACE) {
	            if (event.altKey) {
	              if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
	              if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
	              mode = MODE_CENTER;
	            } else {
	              if (signX < 0) e0 = e1; else if (signX > 0) w0 = w1;
	              if (signY < 0) s0 = s1; else if (signY > 0) n0 = n1;
	              mode = MODE_HANDLE;
	            }
	            overlay.attr("cursor", cursors[type]);
	            move();
	          }
	          break;
	        }
	        default: return;
	      }
	      noevent$1();
	    }
	  }

	  function initialize() {
	    var state = this.__brush || {selection: null};
	    state.extent = extent.apply(this, arguments);
	    state.dim = dim;
	    return state;
	  }

	  brush.extent = function(_) {
	    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$6([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), brush) : extent;
	  };

	  brush.filter = function(_) {
	    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$6(!!_), brush) : filter;
	  };

	  brush.handleSize = function(_) {
	    return arguments.length ? (handleSize = +_, brush) : handleSize;
	  };

	  brush.on = function() {
	    var value = listeners.on.apply(listeners, arguments);
	    return value === listeners ? brush : value;
	  };

	  return brush;
	}

	function constant$7(x) {
	  return function() {
	    return x;
	  };
	}

	function x$1(d) {
	  return d[0];
	}

	function y$1(d) {
	  return d[1];
	}

	function RedBlackTree() {
	  this._ = null; // root node
	}

	function RedBlackNode(node) {
	  node.U = // parent node
	  node.C = // color - true for red, false for black
	  node.L = // left node
	  node.R = // right node
	  node.P = // previous node
	  node.N = null; // next node
	}

	RedBlackTree.prototype = {
	  constructor: RedBlackTree,

	  insert: function(after, node) {
	    var parent, grandpa, uncle;

	    if (after) {
	      node.P = after;
	      node.N = after.N;
	      if (after.N) after.N.P = node;
	      after.N = node;
	      if (after.R) {
	        after = after.R;
	        while (after.L) after = after.L;
	        after.L = node;
	      } else {
	        after.R = node;
	      }
	      parent = after;
	    } else if (this._) {
	      after = RedBlackFirst(this._);
	      node.P = null;
	      node.N = after;
	      after.P = after.L = node;
	      parent = after;
	    } else {
	      node.P = node.N = null;
	      this._ = node;
	      parent = null;
	    }
	    node.L = node.R = null;
	    node.U = parent;
	    node.C = true;

	    after = node;
	    while (parent && parent.C) {
	      grandpa = parent.U;
	      if (parent === grandpa.L) {
	        uncle = grandpa.R;
	        if (uncle && uncle.C) {
	          parent.C = uncle.C = false;
	          grandpa.C = true;
	          after = grandpa;
	        } else {
	          if (after === parent.R) {
	            RedBlackRotateLeft(this, parent);
	            after = parent;
	            parent = after.U;
	          }
	          parent.C = false;
	          grandpa.C = true;
	          RedBlackRotateRight(this, grandpa);
	        }
	      } else {
	        uncle = grandpa.L;
	        if (uncle && uncle.C) {
	          parent.C = uncle.C = false;
	          grandpa.C = true;
	          after = grandpa;
	        } else {
	          if (after === parent.L) {
	            RedBlackRotateRight(this, parent);
	            after = parent;
	            parent = after.U;
	          }
	          parent.C = false;
	          grandpa.C = true;
	          RedBlackRotateLeft(this, grandpa);
	        }
	      }
	      parent = after.U;
	    }
	    this._.C = false;
	  },

	  remove: function(node) {
	    if (node.N) node.N.P = node.P;
	    if (node.P) node.P.N = node.N;
	    node.N = node.P = null;

	    var parent = node.U,
	        sibling,
	        left = node.L,
	        right = node.R,
	        next,
	        red;

	    if (!left) next = right;
	    else if (!right) next = left;
	    else next = RedBlackFirst(right);

	    if (parent) {
	      if (parent.L === node) parent.L = next;
	      else parent.R = next;
	    } else {
	      this._ = next;
	    }

	    if (left && right) {
	      red = next.C;
	      next.C = node.C;
	      next.L = left;
	      left.U = next;
	      if (next !== right) {
	        parent = next.U;
	        next.U = node.U;
	        node = next.R;
	        parent.L = node;
	        next.R = right;
	        right.U = next;
	      } else {
	        next.U = parent;
	        parent = next;
	        node = next.R;
	      }
	    } else {
	      red = node.C;
	      node = next;
	    }

	    if (node) node.U = parent;
	    if (red) return;
	    if (node && node.C) { node.C = false; return; }

	    do {
	      if (node === this._) break;
	      if (node === parent.L) {
	        sibling = parent.R;
	        if (sibling.C) {
	          sibling.C = false;
	          parent.C = true;
	          RedBlackRotateLeft(this, parent);
	          sibling = parent.R;
	        }
	        if ((sibling.L && sibling.L.C)
	            || (sibling.R && sibling.R.C)) {
	          if (!sibling.R || !sibling.R.C) {
	            sibling.L.C = false;
	            sibling.C = true;
	            RedBlackRotateRight(this, sibling);
	            sibling = parent.R;
	          }
	          sibling.C = parent.C;
	          parent.C = sibling.R.C = false;
	          RedBlackRotateLeft(this, parent);
	          node = this._;
	          break;
	        }
	      } else {
	        sibling = parent.L;
	        if (sibling.C) {
	          sibling.C = false;
	          parent.C = true;
	          RedBlackRotateRight(this, parent);
	          sibling = parent.L;
	        }
	        if ((sibling.L && sibling.L.C)
	          || (sibling.R && sibling.R.C)) {
	          if (!sibling.L || !sibling.L.C) {
	            sibling.R.C = false;
	            sibling.C = true;
	            RedBlackRotateLeft(this, sibling);
	            sibling = parent.L;
	          }
	          sibling.C = parent.C;
	          parent.C = sibling.L.C = false;
	          RedBlackRotateRight(this, parent);
	          node = this._;
	          break;
	        }
	      }
	      sibling.C = true;
	      node = parent;
	      parent = parent.U;
	    } while (!node.C);

	    if (node) node.C = false;
	  }
	};

	function RedBlackRotateLeft(tree, node) {
	  var p = node,
	      q = node.R,
	      parent = p.U;

	  if (parent) {
	    if (parent.L === p) parent.L = q;
	    else parent.R = q;
	  } else {
	    tree._ = q;
	  }

	  q.U = parent;
	  p.U = q;
	  p.R = q.L;
	  if (p.R) p.R.U = p;
	  q.L = p;
	}

	function RedBlackRotateRight(tree, node) {
	  var p = node,
	      q = node.L,
	      parent = p.U;

	  if (parent) {
	    if (parent.L === p) parent.L = q;
	    else parent.R = q;
	  } else {
	    tree._ = q;
	  }

	  q.U = parent;
	  p.U = q;
	  p.L = q.R;
	  if (p.L) p.L.U = p;
	  q.R = p;
	}

	function RedBlackFirst(node) {
	  while (node.L) node = node.L;
	  return node;
	}

	function createEdge(left, right, v0, v1) {
	  var edge = [null, null],
	      index = edges.push(edge) - 1;
	  edge.left = left;
	  edge.right = right;
	  if (v0) setEdgeEnd(edge, left, right, v0);
	  if (v1) setEdgeEnd(edge, right, left, v1);
	  cells[left.index].halfedges.push(index);
	  cells[right.index].halfedges.push(index);
	  return edge;
	}

	function createBorderEdge(left, v0, v1) {
	  var edge = [v0, v1];
	  edge.left = left;
	  return edge;
	}

	function setEdgeEnd(edge, left, right, vertex) {
	  if (!edge[0] && !edge[1]) {
	    edge[0] = vertex;
	    edge.left = left;
	    edge.right = right;
	  } else if (edge.left === right) {
	    edge[1] = vertex;
	  } else {
	    edge[0] = vertex;
	  }
	}

	// Liang–Barsky line clipping.
	function clipEdge(edge, x0, y0, x1, y1) {
	  var a = edge[0],
	      b = edge[1],
	      ax = a[0],
	      ay = a[1],
	      bx = b[0],
	      by = b[1],
	      t0 = 0,
	      t1 = 1,
	      dx = bx - ax,
	      dy = by - ay,
	      r;

	  r = x0 - ax;
	  if (!dx && r > 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dx > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = x1 - ax;
	  if (!dx && r < 0) return;
	  r /= dx;
	  if (dx < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dx > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  r = y0 - ay;
	  if (!dy && r > 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  } else if (dy > 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  }

	  r = y1 - ay;
	  if (!dy && r < 0) return;
	  r /= dy;
	  if (dy < 0) {
	    if (r > t1) return;
	    if (r > t0) t0 = r;
	  } else if (dy > 0) {
	    if (r < t0) return;
	    if (r < t1) t1 = r;
	  }

	  if (!(t0 > 0) && !(t1 < 1)) return true; // TODO Better check?

	  if (t0 > 0) edge[0] = [ax + t0 * dx, ay + t0 * dy];
	  if (t1 < 1) edge[1] = [ax + t1 * dx, ay + t1 * dy];
	  return true;
	}

	function connectEdge(edge, x0, y0, x1, y1) {
	  var v1 = edge[1];
	  if (v1) return true;

	  var v0 = edge[0],
	      left = edge.left,
	      right = edge.right,
	      lx = left[0],
	      ly = left[1],
	      rx = right[0],
	      ry = right[1],
	      fx = (lx + rx) / 2,
	      fy = (ly + ry) / 2,
	      fm,
	      fb;

	  if (ry === ly) {
	    if (fx < x0 || fx >= x1) return;
	    if (lx > rx) {
	      if (!v0) v0 = [fx, y0];
	      else if (v0[1] >= y1) return;
	      v1 = [fx, y1];
	    } else {
	      if (!v0) v0 = [fx, y1];
	      else if (v0[1] < y0) return;
	      v1 = [fx, y0];
	    }
	  } else {
	    fm = (lx - rx) / (ry - ly);
	    fb = fy - fm * fx;
	    if (fm < -1 || fm > 1) {
	      if (lx > rx) {
	        if (!v0) v0 = [(y0 - fb) / fm, y0];
	        else if (v0[1] >= y1) return;
	        v1 = [(y1 - fb) / fm, y1];
	      } else {
	        if (!v0) v0 = [(y1 - fb) / fm, y1];
	        else if (v0[1] < y0) return;
	        v1 = [(y0 - fb) / fm, y0];
	      }
	    } else {
	      if (ly < ry) {
	        if (!v0) v0 = [x0, fm * x0 + fb];
	        else if (v0[0] >= x1) return;
	        v1 = [x1, fm * x1 + fb];
	      } else {
	        if (!v0) v0 = [x1, fm * x1 + fb];
	        else if (v0[0] < x0) return;
	        v1 = [x0, fm * x0 + fb];
	      }
	    }
	  }

	  edge[0] = v0;
	  edge[1] = v1;
	  return true;
	}

	function clipEdges(x0, y0, x1, y1) {
	  var i = edges.length,
	      edge;

	  while (i--) {
	    if (!connectEdge(edge = edges[i], x0, y0, x1, y1)
	        || !clipEdge(edge, x0, y0, x1, y1)
	        || !(Math.abs(edge[0][0] - edge[1][0]) > epsilon$3
	            || Math.abs(edge[0][1] - edge[1][1]) > epsilon$3)) {
	      delete edges[i];
	    }
	  }
	}

	function createCell(site) {
	  return cells[site.index] = {
	    site: site,
	    halfedges: []
	  };
	}

	function cellHalfedgeAngle(cell, edge) {
	  var site = cell.site,
	      va = edge.left,
	      vb = edge.right;
	  if (site === vb) vb = va, va = site;
	  if (vb) return Math.atan2(vb[1] - va[1], vb[0] - va[0]);
	  if (site === va) va = edge[1], vb = edge[0];
	  else va = edge[0], vb = edge[1];
	  return Math.atan2(va[0] - vb[0], vb[1] - va[1]);
	}

	function cellHalfedgeStart(cell, edge) {
	  return edge[+(edge.left !== cell.site)];
	}

	function cellHalfedgeEnd(cell, edge) {
	  return edge[+(edge.left === cell.site)];
	}

	function sortCellHalfedges() {
	  for (var i = 0, n = cells.length, cell, halfedges, j, m; i < n; ++i) {
	    if ((cell = cells[i]) && (m = (halfedges = cell.halfedges).length)) {
	      var index = new Array(m),
	          array = new Array(m);
	      for (j = 0; j < m; ++j) index[j] = j, array[j] = cellHalfedgeAngle(cell, edges[halfedges[j]]);
	      index.sort(function(i, j) { return array[j] - array[i]; });
	      for (j = 0; j < m; ++j) array[j] = halfedges[index[j]];
	      for (j = 0; j < m; ++j) halfedges[j] = array[j];
	    }
	  }
	}

	function clipCells(x0, y0, x1, y1) {
	  var nCells = cells.length,
	      iCell,
	      cell,
	      site,
	      iHalfedge,
	      halfedges,
	      nHalfedges,
	      start,
	      startX,
	      startY,
	      end,
	      endX,
	      endY,
	      cover = true;

	  for (iCell = 0; iCell < nCells; ++iCell) {
	    if (cell = cells[iCell]) {
	      site = cell.site;
	      halfedges = cell.halfedges;
	      iHalfedge = halfedges.length;

	      // Remove any dangling clipped edges.
	      while (iHalfedge--) {
	        if (!edges[halfedges[iHalfedge]]) {
	          halfedges.splice(iHalfedge, 1);
	        }
	      }

	      // Insert any border edges as necessary.
	      iHalfedge = 0, nHalfedges = halfedges.length;
	      while (iHalfedge < nHalfedges) {
	        end = cellHalfedgeEnd(cell, edges[halfedges[iHalfedge]]), endX = end[0], endY = end[1];
	        start = cellHalfedgeStart(cell, edges[halfedges[++iHalfedge % nHalfedges]]), startX = start[0], startY = start[1];
	        if (Math.abs(endX - startX) > epsilon$3 || Math.abs(endY - startY) > epsilon$3) {
	          halfedges.splice(iHalfedge, 0, edges.push(createBorderEdge(site, end,
	              Math.abs(endX - x0) < epsilon$3 && y1 - endY > epsilon$3 ? [x0, Math.abs(startX - x0) < epsilon$3 ? startY : y1]
	              : Math.abs(endY - y1) < epsilon$3 && x1 - endX > epsilon$3 ? [Math.abs(startY - y1) < epsilon$3 ? startX : x1, y1]
	              : Math.abs(endX - x1) < epsilon$3 && endY - y0 > epsilon$3 ? [x1, Math.abs(startX - x1) < epsilon$3 ? startY : y0]
	              : Math.abs(endY - y0) < epsilon$3 && endX - x0 > epsilon$3 ? [Math.abs(startY - y0) < epsilon$3 ? startX : x0, y0]
	              : null)) - 1);
	          ++nHalfedges;
	        }
	      }

	      if (nHalfedges) cover = false;
	    }
	  }

	  // If there weren’t any edges, have the closest site cover the extent.
	  // It doesn’t matter which corner of the extent we measure!
	  if (cover) {
	    var dx, dy, d2, dc = Infinity;

	    for (iCell = 0, cover = null; iCell < nCells; ++iCell) {
	      if (cell = cells[iCell]) {
	        site = cell.site;
	        dx = site[0] - x0;
	        dy = site[1] - y0;
	        d2 = dx * dx + dy * dy;
	        if (d2 < dc) dc = d2, cover = cell;
	      }
	    }

	    if (cover) {
	      var v00 = [x0, y0], v01 = [x0, y1], v11 = [x1, y1], v10 = [x1, y0];
	      cover.halfedges.push(
	        edges.push(createBorderEdge(site = cover.site, v00, v01)) - 1,
	        edges.push(createBorderEdge(site, v01, v11)) - 1,
	        edges.push(createBorderEdge(site, v11, v10)) - 1,
	        edges.push(createBorderEdge(site, v10, v00)) - 1
	      );
	    }
	  }

	  // Lastly delete any cells with no edges; these were entirely clipped.
	  for (iCell = 0; iCell < nCells; ++iCell) {
	    if (cell = cells[iCell]) {
	      if (!cell.halfedges.length) {
	        delete cells[iCell];
	      }
	    }
	  }
	}

	var circlePool = [];

	var firstCircle;

	function Circle() {
	  RedBlackNode(this);
	  this.x =
	  this.y =
	  this.arc =
	  this.site =
	  this.cy = null;
	}

	function attachCircle(arc) {
	  var lArc = arc.P,
	      rArc = arc.N;

	  if (!lArc || !rArc) return;

	  var lSite = lArc.site,
	      cSite = arc.site,
	      rSite = rArc.site;

	  if (lSite === rSite) return;

	  var bx = cSite[0],
	      by = cSite[1],
	      ax = lSite[0] - bx,
	      ay = lSite[1] - by,
	      cx = rSite[0] - bx,
	      cy = rSite[1] - by;

	  var d = 2 * (ax * cy - ay * cx);
	  if (d >= -epsilon2$1) return;

	  var ha = ax * ax + ay * ay,
	      hc = cx * cx + cy * cy,
	      x = (cy * ha - ay * hc) / d,
	      y = (ax * hc - cx * ha) / d;

	  var circle = circlePool.pop() || new Circle;
	  circle.arc = arc;
	  circle.site = cSite;
	  circle.x = x + bx;
	  circle.y = (circle.cy = y + by) + Math.sqrt(x * x + y * y); // y bottom

	  arc.circle = circle;

	  var before = null,
	      node = circles._;

	  while (node) {
	    if (circle.y < node.y || (circle.y === node.y && circle.x <= node.x)) {
	      if (node.L) node = node.L;
	      else { before = node.P; break; }
	    } else {
	      if (node.R) node = node.R;
	      else { before = node; break; }
	    }
	  }

	  circles.insert(before, circle);
	  if (!before) firstCircle = circle;
	}

	function detachCircle(arc) {
	  var circle = arc.circle;
	  if (circle) {
	    if (!circle.P) firstCircle = circle.N;
	    circles.remove(circle);
	    circlePool.push(circle);
	    RedBlackNode(circle);
	    arc.circle = null;
	  }
	}

	var beachPool = [];

	function Beach() {
	  RedBlackNode(this);
	  this.edge =
	  this.site =
	  this.circle = null;
	}

	function createBeach(site) {
	  var beach = beachPool.pop() || new Beach;
	  beach.site = site;
	  return beach;
	}

	function detachBeach(beach) {
	  detachCircle(beach);
	  beaches.remove(beach);
	  beachPool.push(beach);
	  RedBlackNode(beach);
	}

	function removeBeach(beach) {
	  var circle = beach.circle,
	      x = circle.x,
	      y = circle.cy,
	      vertex = [x, y],
	      previous = beach.P,
	      next = beach.N,
	      disappearing = [beach];

	  detachBeach(beach);

	  var lArc = previous;
	  while (lArc.circle
	      && Math.abs(x - lArc.circle.x) < epsilon$3
	      && Math.abs(y - lArc.circle.cy) < epsilon$3) {
	    previous = lArc.P;
	    disappearing.unshift(lArc);
	    detachBeach(lArc);
	    lArc = previous;
	  }

	  disappearing.unshift(lArc);
	  detachCircle(lArc);

	  var rArc = next;
	  while (rArc.circle
	      && Math.abs(x - rArc.circle.x) < epsilon$3
	      && Math.abs(y - rArc.circle.cy) < epsilon$3) {
	    next = rArc.N;
	    disappearing.push(rArc);
	    detachBeach(rArc);
	    rArc = next;
	  }

	  disappearing.push(rArc);
	  detachCircle(rArc);

	  var nArcs = disappearing.length,
	      iArc;
	  for (iArc = 1; iArc < nArcs; ++iArc) {
	    rArc = disappearing[iArc];
	    lArc = disappearing[iArc - 1];
	    setEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
	  }

	  lArc = disappearing[0];
	  rArc = disappearing[nArcs - 1];
	  rArc.edge = createEdge(lArc.site, rArc.site, null, vertex);

	  attachCircle(lArc);
	  attachCircle(rArc);
	}

	function addBeach(site) {
	  var x = site[0],
	      directrix = site[1],
	      lArc,
	      rArc,
	      dxl,
	      dxr,
	      node = beaches._;

	  while (node) {
	    dxl = leftBreakPoint(node, directrix) - x;
	    if (dxl > epsilon$3) node = node.L; else {
	      dxr = x - rightBreakPoint(node, directrix);
	      if (dxr > epsilon$3) {
	        if (!node.R) {
	          lArc = node;
	          break;
	        }
	        node = node.R;
	      } else {
	        if (dxl > -epsilon$3) {
	          lArc = node.P;
	          rArc = node;
	        } else if (dxr > -epsilon$3) {
	          lArc = node;
	          rArc = node.N;
	        } else {
	          lArc = rArc = node;
	        }
	        break;
	      }
	    }
	  }

	  createCell(site);
	  var newArc = createBeach(site);
	  beaches.insert(lArc, newArc);

	  if (!lArc && !rArc) return;

	  if (lArc === rArc) {
	    detachCircle(lArc);
	    rArc = createBeach(lArc.site);
	    beaches.insert(newArc, rArc);
	    newArc.edge = rArc.edge = createEdge(lArc.site, newArc.site);
	    attachCircle(lArc);
	    attachCircle(rArc);
	    return;
	  }

	  if (!rArc) { // && lArc
	    newArc.edge = createEdge(lArc.site, newArc.site);
	    return;
	  }

	  // else lArc !== rArc
	  detachCircle(lArc);
	  detachCircle(rArc);

	  var lSite = lArc.site,
	      ax = lSite[0],
	      ay = lSite[1],
	      bx = site[0] - ax,
	      by = site[1] - ay,
	      rSite = rArc.site,
	      cx = rSite[0] - ax,
	      cy = rSite[1] - ay,
	      d = 2 * (bx * cy - by * cx),
	      hb = bx * bx + by * by,
	      hc = cx * cx + cy * cy,
	      vertex = [(cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay];

	  setEdgeEnd(rArc.edge, lSite, rSite, vertex);
	  newArc.edge = createEdge(lSite, site, null, vertex);
	  rArc.edge = createEdge(site, rSite, null, vertex);
	  attachCircle(lArc);
	  attachCircle(rArc);
	}

	function leftBreakPoint(arc, directrix) {
	  var site = arc.site,
	      rfocx = site[0],
	      rfocy = site[1],
	      pby2 = rfocy - directrix;

	  if (!pby2) return rfocx;

	  var lArc = arc.P;
	  if (!lArc) return -Infinity;

	  site = lArc.site;
	  var lfocx = site[0],
	      lfocy = site[1],
	      plby2 = lfocy - directrix;

	  if (!plby2) return lfocx;

	  var hl = lfocx - rfocx,
	      aby2 = 1 / pby2 - 1 / plby2,
	      b = hl / plby2;

	  if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;

	  return (rfocx + lfocx) / 2;
	}

	function rightBreakPoint(arc, directrix) {
	  var rArc = arc.N;
	  if (rArc) return leftBreakPoint(rArc, directrix);
	  var site = arc.site;
	  return site[1] === directrix ? site[0] : Infinity;
	}

	var epsilon$3 = 1e-6;
	var epsilon2$1 = 1e-12;
	var beaches;
	var cells;
	var circles;
	var edges;

	function triangleArea(a, b, c) {
	  return (a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]);
	}

	function lexicographic(a, b) {
	  return b[1] - a[1]
	      || b[0] - a[0];
	}

	function Diagram(sites, extent) {
	  var site = sites.sort(lexicographic).pop(),
	      x,
	      y,
	      circle;

	  edges = [];
	  cells = new Array(sites.length);
	  beaches = new RedBlackTree;
	  circles = new RedBlackTree;

	  while (true) {
	    circle = firstCircle;
	    if (site && (!circle || site[1] < circle.y || (site[1] === circle.y && site[0] < circle.x))) {
	      if (site[0] !== x || site[1] !== y) {
	        addBeach(site);
	        x = site[0], y = site[1];
	      }
	      site = sites.pop();
	    } else if (circle) {
	      removeBeach(circle.arc);
	    } else {
	      break;
	    }
	  }

	  sortCellHalfedges();

	  if (extent) {
	    var x0 = +extent[0][0],
	        y0 = +extent[0][1],
	        x1 = +extent[1][0],
	        y1 = +extent[1][1];
	    clipEdges(x0, y0, x1, y1);
	    clipCells(x0, y0, x1, y1);
	  }

	  this.edges = edges;
	  this.cells = cells;

	  beaches =
	  circles =
	  edges =
	  cells = null;
	}

	Diagram.prototype = {
	  constructor: Diagram,

	  polygons: function() {
	    var edges = this.edges;

	    return this.cells.map(function(cell) {
	      var polygon = cell.halfedges.map(function(i) { return cellHalfedgeStart(cell, edges[i]); });
	      polygon.data = cell.site.data;
	      return polygon;
	    });
	  },

	  triangles: function() {
	    var triangles = [],
	        edges = this.edges;

	    this.cells.forEach(function(cell, i) {
	      if (!(m = (halfedges = cell.halfedges).length)) return;
	      var site = cell.site,
	          halfedges,
	          j = -1,
	          m,
	          s0,
	          e1 = edges[halfedges[m - 1]],
	          s1 = e1.left === site ? e1.right : e1.left;

	      while (++j < m) {
	        s0 = s1;
	        e1 = edges[halfedges[j]];
	        s1 = e1.left === site ? e1.right : e1.left;
	        if (s0 && s1 && i < s0.index && i < s1.index && triangleArea(site, s0, s1) < 0) {
	          triangles.push([site.data, s0.data, s1.data]);
	        }
	      }
	    });

	    return triangles;
	  },

	  links: function() {
	    return this.edges.filter(function(edge) {
	      return edge.right;
	    }).map(function(edge) {
	      return {
	        source: edge.left.data,
	        target: edge.right.data
	      };
	    });
	  },

	  find: function(x, y, radius) {
	    var that = this, i0, i1 = that._found || 0, n = that.cells.length, cell;

	    // Use the previously-found cell, or start with an arbitrary one.
	    while (!(cell = that.cells[i1])) if (++i1 >= n) return null;
	    var dx = x - cell.site[0], dy = y - cell.site[1], d2 = dx * dx + dy * dy;

	    // Traverse the half-edges to find a closer cell, if any.
	    do {
	      cell = that.cells[i0 = i1], i1 = null;
	      cell.halfedges.forEach(function(e) {
	        var edge = that.edges[e], v = edge.left;
	        if ((v === cell.site || !v) && !(v = edge.right)) return;
	        var vx = x - v[0], vy = y - v[1], v2 = vx * vx + vy * vy;
	        if (v2 < d2) d2 = v2, i1 = v.index;
	      });
	    } while (i1 !== null);

	    that._found = i0;

	    return radius == null || d2 <= radius * radius ? cell.site : null;
	  }
	};

	function voronoi() {
	  var x$$1 = x$1,
	      y$$1 = y$1,
	      extent = null;

	  function voronoi(data) {
	    return new Diagram(data.map(function(d, i) {
	      var s = [Math.round(x$$1(d, i, data) / epsilon$3) * epsilon$3, Math.round(y$$1(d, i, data) / epsilon$3) * epsilon$3];
	      s.index = i;
	      s.data = d;
	      return s;
	    }), extent);
	  }

	  voronoi.polygons = function(data) {
	    return voronoi(data).polygons();
	  };

	  voronoi.links = function(data) {
	    return voronoi(data).links();
	  };

	  voronoi.triangles = function(data) {
	    return voronoi(data).triangles();
	  };

	  voronoi.x = function(_) {
	    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$7(+_), voronoi) : x$$1;
	  };

	  voronoi.y = function(_) {
	    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$7(+_), voronoi) : y$$1;
	  };

	  voronoi.extent = function(_) {
	    return arguments.length ? (extent = _ == null ? null : [[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]], voronoi) : extent && [[extent[0][0], extent[0][1]], [extent[1][0], extent[1][1]]];
	  };

	  voronoi.size = function(_) {
	    return arguments.length ? (extent = _ == null ? null : [[0, 0], [+_[0], +_[1]]], voronoi) : extent && [extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]];
	  };

	  return voronoi;
	}

	function bisectData(data, keyVal, stacked, xKey) {
	  if (stacked) {
	    var arr = [];
	    var bisectFn = bisector(function (d) { return d.data[xKey]; }).left;
	    for (var i = 0; i < data.length; i++) {
	      arr.push(bisectFn(data[i], keyVal));
	    }
	    return arr;
	  } else {
	    var bisectFn$1 = bisector(function (d) { return d.key; }).left;
	    return bisectFn$1(data, keyVal);
	  }
	}

	function cursorPos(overlay) {
	  return {
	    x: mouse(overlay.node())[0],
	    y: mouse(overlay.node())[1]
	  };
	}

	function getTipData(obj, cursor) {

	  // TODO:
	  // need to standardize output of this between standard and stacked data.
	  // right now tipData for regular data looks like this: { key: Date, series: [] }
	  // while for stacked it's an array like [[y0, y1, data: {}]]

	  var scale, scaleType, cursorVal;

	  if (obj.options.type === 'bar') {
	    scale = obj.rendered.plot.yScaleObj.scale.copy();
	    scale.domain(scale.domain().reverse());
	    scaleType = obj.rendered.plot.yScaleObj.obj.type;
	    cursorVal = cursor.y;
	  } else {
	    scale = obj.rendered.plot.xScaleObj.scale;
	    scaleType = obj.rendered.plot.xScaleObj.obj.type;
	    cursorVal = cursor.x;
	  }

	  var xVal, tipData;

	  if (scaleType === 'ordinal-time' || scaleType === 'ordinal') {

	    var step = scale.step(),
	      domainPosition = Math.floor(cursorVal / step);

	    if (domainPosition >= scale.domain().length) {
	      xVal = scale.domain()[scale.domain().length - 1];
	    } else {
	      xVal = scale.domain()[domainPosition];
	    }

	    for (var i = 0; i < obj.data.data.length; i++) {
	      if (xVal === obj.data.data[i].key) {
	        tipData = obj.data.data[i];
	        break;
	      }
	    }

	    return tipData;

	  }

	  xVal = scale.invert(cursorVal);

	  if (obj.options.stacked && obj.options.type === 'area') {
	    var data = obj.data.stackedData.map(function (item) {
	      return item.sort(function (a, b) {
	        return a.data[obj.data.keys[0]] - b.data[obj.data.keys[0]];
	      });
	    });
	    var i$1 = bisectData(data, xVal, obj.options.stacked, obj.data.keys[0]);

	    var arr = [];
	    var refIndex;

	    for (var k = 0; k < data.length; k++) {
	      if (refIndex) {
	        arr.push(data[k][refIndex]);
	      } else {
	        var d0 = data[k][i$1[k] - 1],
	          d1 = data[k][i$1[k]];
	        refIndex = xVal - d0.data[obj.data.keys[0]] > d1.data[obj.data.keys[0]] - xVal ? i$1[k] : (i$1[k] - 1);
	        arr.push(data[k][refIndex]);
	      }
	    }

	    tipData = arr;

	  } else {
	    var data$1 = obj.data.data.sort(function (a, b) { return a.key - b.key; }),
	      i$2 = bisectData(data$1, xVal),
	      d0$1 = data$1[i$2 - 1],
	      d1$1 = data$1[i$2];

	    if (d0$1 && d1$1) {
	      tipData = xVal - d0$1.key > d1$1.key - xVal ? d1$1 : d0$1;
	    } else {
	      tipData = d0$1 ? d0$1 : d1$1;
	    }

	  }

	  return tipData;

	}

	function showTips(tipNodes, obj) {

	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(((obj.prefix) + "active"), true);
	  }

	  if (tipNodes.yTipLine) {
	    tipNodes.yTipLine.classed(((obj.prefix) + "active"), true);
	  }

	  if (tipNodes.tipCircle) {
	    tipNodes.tipCircle.classed(((obj.prefix) + "active"), true);
	  }

	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(((obj.prefix) + "active"), true);
	  }

	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(((obj.prefix) + "active"), true);
	  }

	  var annoData = obj.annotations;

	  var hasAnnotations = annoData && (
	    (annoData.highlight && annoData.highlight.length) ||
	    (annoData.text && annoData.text.length) ||
	    (annoData.range && annoData.range.length) ||
	    (annoData.pointer && annoData.pointer.length)
	  );

	  if (hasAnnotations) {
	    obj.rendered.annotations.annoNode.classed(((obj.prefix) + "muted"), true);
	    obj.rendered.container
	      .selectAll(("." + (obj.prefix) + "annotation_range"))
	      .classed(((obj.prefix) + "muted"), true);
	  }

	}

	function hideTips(tipNodes, obj) {

	  if (obj.options.type === 'column' || obj.options.type === 'bar' || obj.options.type === 'scatterplot') {
	    obj.rendered.plot.seriesGroup
	      .selectAll(("." + (obj.prefix) + "muted"))
	      .classed(((obj.prefix) + "muted"), false);

	    obj.rendered.plot.seriesGroup
	      .selectAll(("." + (obj.prefix) + "active"))
	      .classed(((obj.prefix) + "active"), false);

	    obj.rendered.container
	      .selectAll(("." + (obj.prefix) + "axis-group line"))
	      .classed(((obj.prefix) + "muted"), false);
	  }

	  if (tipNodes.xTipLine) {
	    tipNodes.xTipLine.classed(((obj.prefix) + "active"), false);
	  }

	  if (tipNodes.yTipLine) {
	    tipNodes.yTipLine.classed(((obj.prefix) + "active"), false);
	  }

	  if (tipNodes.tipCircle) {
	    tipNodes.tipCircle.classed(((obj.prefix) + "active"), false);
	  }

	  if (tipNodes.tipBox) {
	    tipNodes.tipBox.classed(((obj.prefix) + "active"), false);
	  }

	  if (tipNodes.tipPathCircles) {
	    tipNodes.tipPathCircles.classed(((obj.prefix) + "active"), false);
	  }

	  var annoData = obj.annotations;

	  var hasAnnotations = annoData && (
	    (annoData.highlight && annoData.highlight.length) ||
	    (annoData.text && annoData.text.length) ||
	    (annoData.range && annoData.range.length) ||
	    (annoData.pointer && annoData.pointer.length)
	  );

	  if (hasAnnotations) {
	    obj.rendered.annotations.annoNode.classed(((obj.prefix) + "muted"), false);
	    obj.rendered.container
	      .selectAll(("." + (obj.prefix) + "annotation_range"))
	      .classed(((obj.prefix) + "muted"), false);
	  }

	}

	function mouseIdle(tipNodes, obj) {
	  return setTimeout(function () {
	    hideTips(tipNodes, obj);
	  }, obj.tipTimeout);
	}

	var timeout$2;

	function tipsManager(node, obj) {

	  var fns = {
	    line: lineChartTips,
	    multiline: lineChartTips,
	    area: obj.options.stacked ? stackedAreaChartTips : areaChartTips,
	    column: obj.options.stacked ? stackedColumnChartTips : columnChartTips,
	    bar: obj.options.stacked ? stackedBarChartTips : barChartTips,
	    scatterplot: scatterplotChartTips
	  };

	  var dataRef = obj.options.type === 'multiline' ? [obj.data.data[0].series[0]] : obj.data.data[0].series,
	    tipNodes = appendTipGroup(node, obj);

	  appendTipElements(node, obj, tipNodes, dataRef);

	  if (obj.options.type === 'bar') {
	    tipNodes.tipGroup.remove();
	    tipNodes.xTipLine.remove();
	    tipNodes.yTipLine.remove();
	    tipNodes.tipBox.remove();
	    tipNodes.tipPathCircles.remove();
	  }

	  var voronoiDiagram;

	  if (obj.options.type === 'scatterplot') {
	    voronoiDiagram = voronoi()
	      .x(function (d) { return obj.rendered.plot.xScaleObj.scale(d.series[0].val); })
	      .y(function (d) { return obj.rendered.plot.yScaleObj.scale(d.series[1].val); })(obj.data.data);

	  }

	  switch (obj.options.type) {
	    case 'line':
	    case 'multiline':
	    case 'area':
	    case 'column':
	    case 'bar':
	    case 'scatterplot':
	      tipNodes.overlay = tipNodes.tipNode
	        .append('rect')
	        .attrs({
	          'class': ((obj.prefix) + "tip_overlay"),
	          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	          'width': obj.dimensions.tickWidth(),
	          'height': obj.dimensions.yAxisHeight()
	        });
	      tipNodes.overlay
	        .on('mouseover', function () { return showTips(tipNodes, obj); })
	        .on('mouseout', function () { return hideTips(tipNodes, obj); })
	        .on('mousemove', function () {
	          showTips(tipNodes, obj);
	          clearTimeout(timeout$2);
	          timeout$2 = mouseIdle(tipNodes, obj);
	          return fns[obj.options.type](tipNodes, obj, voronoiDiagram);
	        });
	      break;
	  }

	}

	function appendTipGroup(node, obj) {

	  var svg = select(node.node().parentNode),
	    chartNode = select(node.node().parentNode.parentNode),
	    legendIcon = chartNode.select(("." + (obj.prefix) + "legend_item_icon")).node(),
	    radius = legendIcon ? legendIcon.getBoundingClientRect().width / 2 : 0;

	  var tipNode = svg.append('g')
	    .attrs({
	      'transform': ("translate(" + (obj.dimensions.margin.left) + "," + (obj.dimensions.margin.top) + ")"),
	      'class': ((obj.prefix) + "tip")
	    })
	    .classed(((obj.prefix) + "tip_stacked"), function () {
	      return obj.options.stacked ? true : false;
	    });

	  var xTipLine = tipNode.append('g')
	    .attr('class', ((obj.prefix) + "tip_line-x"))
	    .classed(((obj.prefix) + "active"), false);

	  xTipLine.append('line');

	  var yTipLine = select(null),
	    tipCircle = select(null);

	  if (obj.options.type === 'scatterplot') {
	    yTipLine = tipNode.append('g')
	      .attr('class', ((obj.prefix) + "tip_line-y"))
	      .classed(((obj.prefix) + "active"), false);

	    yTipLine.append('line');

	    tipCircle = tipNode.append('g')
	      .attrs({
	        'class': ((obj.prefix) + "tip_circle-xy"),
	        'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)")
	      })
	      .classed(((obj.prefix) + "active"), false);

	    tipCircle.append('circle')
	      .attr('r', obj.dimensions.scatterplotRadius);
	  }

	  var tipBox = tipNode.append('g')
	    .attrs({
	      'class': ((obj.prefix) + "tip_box"),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)")
	    });

	  var tipRect = tipBox.append('rect')
	    .attrs({
	      'class': ((obj.prefix) + "tip_rect"),
	      'transform': ("translate(0, " + (obj.dimensions.tipOffset.horizontal) + ")"),
	      'width': 1,
	      'height': 1
	    });

	  var tipGroup = tipBox.append('g')
	    .attr('class', ((obj.prefix) + "tip_group"));

	  var tipPathCircles = tipNode.append('g')
	    .attr('class', ((obj.prefix) + "tip_path-circle-group"));

	  var tipTextX = tipGroup
	    .insert('g', ':first-child')
	    .attr('class', ((obj.prefix) + "tip_text-x-group"))
	    .append('text')
	    .attrs({
	      'class': ((obj.prefix) + "tip_text-x"),
	      'x': 0,
	      'y': 0,
	      'dy': '1em'
	    });

	  return {
	    svg: svg,
	    tipNode: tipNode,
	    xTipLine: xTipLine,
	    yTipLine: yTipLine,
	    tipCircle: tipCircle,
	    tipBox: tipBox,
	    tipRect: tipRect,
	    tipGroup: tipGroup,
	    legendIcon: legendIcon,
	    tipPathCircles: tipPathCircles,
	    radius: radius,
	    tipTextX: tipTextX
	  };

	}

	function appendTipElements(node, obj, tipNodes, dataRef) {

	  var tipTextGroupContainer = tipNodes.tipGroup
	    .append('g')
	    .attr('class', ((obj.prefix) + "tip_text-group-container"));

	  var tipTextGroups = tipTextGroupContainer
	    .selectAll(("." + (obj.prefix) + "tip_text-group"))
	    .data(dataRef)
	    .enter()
	    .append('g')
	    .attr('class', function (d, i) {
	      return ((obj.prefix) + "tip_text-group " + (obj.prefix) + "tip_text-group-" + i);
	    });

	  var lineHeight;

	  tipTextGroups.append('text')
	    .text(function (d) { return d.val; })
	    .attrs({
	      'class': function (d, i) {
	        return ((obj.prefix) + "tip_text " + (obj.prefix) + "tip_text-" + i);
	      },
	      'data-series': function (d) { return d.key; },
	      'x': (tipNodes.radius * 2) + (tipNodes.radius / 1.5),
	      'y': function(d, i) {
	        lineHeight = lineHeight || parseInt(select(this).style('line-height'));
	        return (i + 1) * lineHeight;
	      },
	      'dy': '1em'
	    });

	  if (obj.options.type !== 'scatterplot') {
	    tipTextGroups
	      .append('circle')
	      .attrs({
	        'class': function (d, i) {
	          return ((obj.prefix) + "tip_circle " + (obj.prefix) + "tip_circle-" + i);
	        },
	        'r': tipNodes.radius,
	        'cx': tipNodes.radius,
	        'cy': function (d, i) {
	          return ((i + 1) * lineHeight) + (tipNodes.radius * 1.5);
	        }
	      });
	  }

	  tipNodes.tipPathCircles.selectAll('circle')
	    .data(dataRef)
	    .enter()
	    .append('circle')
	    .attrs({
	      'class': function (d, i) {
	        return ((obj.prefix) + "tip_path-circle " + (obj.prefix) + "tip_path-circle-" + i);
	      },
	      'r': tipRadius
	    });

	  return tipTextGroups;

	}

	function lineChartTips(tipNodes, obj) {
	  var cursor = cursorPos(tipNodes.overlay),
	    tipData = getTipData(obj, cursor);

	  var isUndefined = 0;

	  for (var i = 0; i < tipData.series.length; i++) {
	    if (tipData.series[i].val === '__undefined__') {
	      isUndefined++;
	      break;
	    }
	  }

	  var hasData = !isUndefined || isUndefined !== tipData.series.length;

	  if (!hasData) { return; }

	  var domain = obj.rendered.plot.xScaleObj.scale.domain(),
	    ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

	  tipNodes.tipGroup.selectAll(("." + (obj.prefix) + "tip_text-group text"))
	    .data(tipData.series)
	    .text(function (d) {
	      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
	      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
	      if ((d.val || d.val === 0) && d.val !== '__undefined__') {
	        return obj.yAxis.prefix + setTickFormat(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	      } else {
	        return 'n/a';
	      }
	    })
	    .classed(((obj.prefix) + "muted"), function (d) {
	      return (!(d.val || d.val === 0) || d.val === '__undefined__');
	    });

	  var bandwidth = 0;

	  if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
	    tipNodes.tipTextX
	      .text(function () { return tipDateFormatter(ctx, obj.monthsAbr, tipData.key); });
	  } else {
	    tipNodes.tipTextX
	      .text(tipData.key);
	    bandwidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
	  }

	  tipNodes.tipGroup
	    .selectAll(("." + (obj.prefix) + "tip_text-group"))
	    .data(tipData.series)
	    .classed(((obj.prefix) + "active"), function (d) { return d.val ? true : false; });

	  tipNodes.tipGroup
	    .attr('transform', function () {
	      // tipbox pointing left or right
	      var xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right';
	      return ("translate(" + (obj.dimensions.tipPadding[xDirection]) + "," + (obj.dimensions.tipPadding.top) + ")");
	    });

	  tipNodes.tipPathCircles
	    .selectAll(("." + (obj.prefix) + "tip_path-circle"))
	    .data(tipData.series)
	    .classed(((obj.prefix) + "active"), function (d) {
	      return d.val && d.val !== '__undefined__';
	    })
	    .attrs({
	      'cx': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
	      'cy': function (d) {
	        if (d.val && d.val !== '__undefined__') {
	          return obj.rendered.plot.yScaleObj.scale(d.val);
	        }
	      }
	    });

	  tipNodes.tipRect
	    .attrs({
	      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	    });

	  tipNodes.xTipLine.select('line')
	    .attrs({
	      'x1': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
	      'x2': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
	      'y1': 0,
	      'y2': obj.dimensions.yAxisHeight()
	    });

	  tipNodes.tipBox
	    .attr('transform', function() {
	      var x;
	      if (cursor.x > obj.dimensions.tickWidth() / 2) {
	        // tipbox pointing left
	        x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - this.getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
	      } else {
	        // tipbox pointing right
	        x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
	      }
	      return ("translate(" + x + "," + (obj.dimensions.tipOffset.vertical) + ")");
	    });

	}

	function areaChartTips(tipNodes, obj) {
	  // area tips implementation is currently
	  // *exactly* the same as line tips, so…
	  lineChartTips(tipNodes, obj);
	}

	function stackedAreaChartTips(tipNodes, obj) {

	  var cursor = cursorPos(tipNodes.overlay),
	    tipData = getTipData(obj, cursor);

	  var isUndefined = 0;

	  for (var i = 0; i < tipData.length; i++) {
	    if (tipData[i].val === '__undefined__') {
	      isUndefined++;
	      break;
	    }
	  }

	  var hasData = !isUndefined || isUndefined !== tipData.series.length;

	  if (!hasData) { return; }

	  var domain = obj.rendered.plot.xScaleObj.scale.domain(),
	    ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

	  tipNodes.tipGroup.selectAll(("." + (obj.prefix) + "tip_text-group text"))
	    .data(function () {
	      if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
	        return tipData;
	      } else {
	        return tipData.series;
	      }
	    })
	    .text(function (d, i) {
	      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
	      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
	      if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
	        if (d.val || d.val === 0) {
	          return obj.yAxis.prefix + setTickFormat(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	        } else {
	          return 'n/a';
	        }
	      } else {
	        var text;
	        for (var k = 0; k < tipData.length; k++) {
	          if (i === 0) {
	            if (!isNaN(d[0] + d[1])) {
	              text = obj.yAxis.prefix + setTickFormat(obj.yAxis.format, d.data[obj.data.keys[i + 1]]) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = 'n/a';
	              break;
	            }
	          } else if (k === i) {
	            var hasUndefined = 0;
	            for (var j = 0; j < i; j++) {
	              if (isNaN(d[0] + d[1])) {
	                hasUndefined++;
	                break;
	              }
	            }
	            if (!hasUndefined && !isNaN(d[0] + d[1])) {
	              text = obj.yAxis.prefix + setTickFormat(obj.yAxis.format, d.data[obj.data.keys[i + 1]]) + obj.yAxis.suffix;
	              break;
	            } else {
	              text = 'n/a';
	              break;
	            }
	          }
	        }
	        return text;
	      }
	    });

	  var bandwidth = 0;

	  if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
	    tipNodes.tipTextX
	      .text(function () { return tipDateFormatter(ctx, obj.monthsAbr, tipData.key ? tipData.key : tipData[0].data[obj.data.keys[0]]); });
	  } else {
	    tipNodes.tipTextX
	      .text(tipData.key);
	    bandwidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
	  }

	  tipNodes.tipGroup
	    .selectAll(("." + (obj.prefix) + "tip_text-group"))
	    .data(function () {
	      if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
	        return tipData;
	      } else {
	        return tipData.series;
	      }
	    })
	    .classed(((obj.prefix) + "active"), function (d, i) {
	      if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
	        return d.val ? true : false;
	      } else {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (isNaN(d[0] + d[1])) {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (!hasUndefined && !isNaN(d[0] + d[1])) {
	          return true;
	        } else {
	          return false;
	        }
	      }
	    });

	  tipNodes.tipGroup
	    .attr('transform', function () {
	      // tipbox pointing left or right
	      var xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right';
	      return ("translate(" + (obj.dimensions.tipPadding[xDirection]) + "," + (obj.dimensions.tipPadding.top) + ")");
	    });

	  tipNodes.tipPathCircles
	    .selectAll(("." + (obj.prefix) + "tip_path-circle"))
	    .data(function () {
	      if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
	        return tipData;
	      } else {
	        return tipData.series;
	      }
	    })
	    .classed(((obj.prefix) + "active"), function (d, i) {
	      if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
	        return d.val ? true : false;
	      } else {
	        var hasUndefined = 0;
	        for (var j = 0; j < i; j++) {
	          if (isNaN(d[0] + d[1])) {
	            hasUndefined++;
	            break;
	          }
	        }
	        if (!hasUndefined && !isNaN(d[0] + d[1])) {
	          return true;
	        } else {
	          return false;
	        }
	      }
	    })
	    .attrs({
	      'cx': function (d) {
	        var xData;
	        if (obj.rendered.plot.xScaleObj.obj.type !== 'time') {
	          xData = tipData.key;
	        } else {
	          xData = d.data[obj.data.keys[0]];
	        }
	        return obj.rendered.plot.xScaleObj.scale(xData) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2);
	      },
	      'cy': function (d) {
	        var yData;
	        if (obj.rendered.plot.xScaleObj.obj.type !== 'time') {
	          var index = obj.data.data.indexOf(obj.data.data.filter(function (a) {
	            return a.key === tipData.key;
	          })[0]);
	          var stackedPoint = obj.data.stackedData[obj.data.keys.indexOf(d.key) - 1];
	          yData = stackedPoint[index][1];
	        } else {
	          yData = d[1];
	        }
	        if (!isNaN(yData)) {
	          return obj.rendered.plot.yScaleObj.scale(yData);
	        }
	      }
	    });

	  tipNodes.tipRect
	    .attrs({
	      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	    });

	  var xPos;

	  if (obj.rendered.plot.xScaleObj.obj.type === 'time') {
	    xPos = tipData[0].data[obj.data.keys[0]];
	  } else {
	    xPos = tipData.key;
	  }

	  tipNodes.xTipLine.select('line')
	    .attrs({
	      'x1': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
	      'x2': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
	      'y1': 0,
	      'y2': obj.dimensions.yAxisHeight()
	    });

	  tipNodes.tipBox
	    .attr('transform', function() {
	      var x;
	      if (cursor.x > obj.dimensions.tickWidth() / 2) {
	        // tipbox pointing left
	        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - this.getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
	      } else {
	        // tipbox pointing right
	        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal + (bandwidth / 2);
	      }
	      return ("translate(" + x + "," + (obj.dimensions.tipOffset.vertical) + ")");
	    });

	}

	function columnChartTips(tipNodes, obj) {

	  var cursor = cursorPos(tipNodes.overlay),
	    tipData = getTipData(obj, cursor);

	  tipNodes.tipGroup.selectAll(("." + (obj.prefix) + "tip_text-group text"))
	    .data(tipData.series)
	    .text(function (d) {
	      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
	      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
	      if ((d.val || d.val === 0) && d.val !== '__undefined__') {
	        return obj.yAxis.prefix + setTickFormat(obj.yAxis.format, d.val) + obj.yAxis.suffix;
	      } else {
	        return 'n/a';
	      }
	    })
	    .classed(((obj.prefix) + "muted"), function (d) {
	      return (!(d.val || d.val === 0) || d.val === '__undefined__');
	    });

	  obj.rendered.plot.seriesGroup.selectAll('rect')
	    .classed(((obj.prefix) + "muted"), true);

	  if (obj.options.stacked) {
	    obj.rendered.plot.seriesGroup.selectAll(("[data-key=\"" + (tipData.key) + "\"]"))
	      .classed(((obj.prefix) + "muted"), false);
	  } else {
	    obj.rendered.plot.seriesGroup.selectAll(("[data-key=\"" + (tipData.key) + "\"] rect"))
	      .classed(((obj.prefix) + "muted"), false);
	  }

	  tipNodes.tipGroup
	    .selectAll(("." + (obj.prefix) + "tip_text-group"))
	    .data(tipData.series)
	    .classed(((obj.prefix) + "active"), function (d) { return d.val ? true : false; });

	  if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
	    tipNodes.tipTextX.text(tipData.key);
	  } else {
	    var domain = obj.rendered.plot.xScaleObj.scale.domain(),
	      ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);

	    tipNodes.tipTextX
	      .text(function () { return tipDateFormatter(ctx, obj.monthsAbr, tipData.key); });
	  }

	  tipNodes.tipGroup
	    .attr('transform', function () {
	      // tipbox pointing left or right
	      var xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right';
	      return ("translate(" + (obj.dimensions.tipPadding[xDirection]) + "," + (obj.dimensions.tipPadding.top) + ")");
	    });

	  tipNodes.tipRect
	    .attrs({
	      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	    });

	  tipNodes.tipBox
	    .attr('transform', function() {
	      var x;

	      if (cursor.x > obj.dimensions.tickWidth() / 2) {
	        // tipbox pointing left

	        var colWidth;

	        if (!obj.rendered.plot.xScaleObj.scale.bandwidth) {
	          colWidth = obj.rendered.plot.singleColumn;
	        } else {
	          colWidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
	        }

	        x = obj.rendered.plot.xScaleObj.scale(tipData.key)  + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - obj.dimensions.tipOffset.horizontal - this.getBoundingClientRect().width + colWidth;

	      } else {
	        // tipbox pointing right
	        x = obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	      }
	      return ("translate(" + x + "," + (obj.dimensions.tipOffset.vertical) + ")");
	    });

	}

	function stackedColumnChartTips(tipNodes, obj) {
	  // stacked column tips implementation is the same
	  // as column tips except for one line, so…
	  columnChartTips(tipNodes, obj);
	}

	function barChartTips(tipNodes, obj) {

	  var cursor = cursorPos(tipNodes.overlay),
	    tipData = getTipData(obj, cursor),
	    isStacked = obj.options.stacked;

	  obj.rendered.plot.seriesGroup
	    .selectAll('rect')
	    .classed(((obj.prefix) + "muted"), true);

	  obj.rendered.plot.seriesGroup
	    .selectAll(("." + (obj.prefix) + "bar-label"))
	    .classed(((obj.prefix) + "muted"), true);

	  obj.rendered.plot.seriesGroup
	    .selectAll(("[data-key=\"" + (tipData.key) + "\"]" + (isStacked ? '' : ' rect')))
	    .classed(((obj.prefix) + "muted"), false);

	  obj.rendered.plot.seriesGroup
	    .selectAll(("[data-" + (isStacked ? 'legend' : 'key') + "=\"" + (tipData.key) + "\"]" + (isStacked ? '' : (" ." + (obj.prefix) + "bar-label"))))
	    .classed(((obj.prefix) + "muted"), false);

	}

	function stackedBarChartTips(tipNodes, obj) {
	  // stacked bar tips implementation is almost exactly the same
	  // as bar tips except for one condition, so…
	  barChartTips(tipNodes, obj);
	}

	function scatterplotChartTips(tipNodes, obj, voronoiDiagram) {
	  var cursor = cursorPos(tipNodes.overlay),
	    tipData = voronoiDiagram.find(cursor.x, cursor.y);

	  if (!tipData) { return; }

	  var dataGroup = tipData.data.group ? obj.data.groups.indexOf(tipData.data.group) : 0;

	  obj.rendered.plot.seriesGroup
	    .selectAll(("." + (obj.prefix) + "dot"))
	    .classed(((obj.prefix) + "muted"), true)
	    .classed(((obj.prefix) + "active"), false);

	  obj.rendered.container
	    .selectAll(("." + (obj.prefix) + "axis-group line"))
	    .classed(((obj.prefix) + "muted"), true);

	  obj.rendered.plot.seriesGroup
	    .selectAll(("[data-key=\"" + (tipData.data.key) + "\"]"))
	    .classed(((obj.prefix) + "muted"), false)
	    .classed(((obj.prefix) + "active"), true);

	  var xPos = tipData.data.series[0].val,
	    yPos = tipData.data.series[1].val;

	  tipNodes.xTipLine.select('line')
	    .attrs({
	      'x1': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	      'x2': obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
	      'y1': 0,
	      'y2': obj.dimensions.yAxisHeight()
	    });

	  tipNodes.yTipLine.select('line')
	    .attrs({
	      'x1': obj.dimensions.computedWidth() - obj.dimensions.tickWidth(),
	      'x2': obj.dimensions.computedWidth(),
	      'y1': obj.rendered.plot.yScaleObj.scale(tipData.data.series[1].val),
	      'y2': obj.rendered.plot.yScaleObj.scale(tipData.data.series[1].val)
	    });

	  tipNodes.tipCircle.select('circle')
	    .attrs({
	      'class': '',
	      'cx': obj.rendered.plot.xScaleObj.scale(xPos),
	      'cy': obj.rendered.plot.yScaleObj.scale(tipData.data.series[1].val)
	    })
	    .classed(((obj.prefix) + "tip_circle-xy-" + dataGroup), true);

	  var isTimeScale = obj.xAxis.scale === 'time' || obj.xAxis.scale === 'ordinal-time';

	  var domain, ctx;

	  if (isTimeScale) {
	    domain = obj.rendered.plot.xScaleObj.scale.domain();
	    ctx = timeDiff(domain[0], domain[domain.length - 1], 8, obj.data);
	  }

	  tipNodes.tipGroup.selectAll(("." + (obj.prefix) + "tip_text-group text"))
	    .data(tipData.data.series)
	    .attr('x', 0)
	    .text(function (d, i) {
	      var rhs;
	      if (i === 0 && isTimeScale) {
	        rhs = tipDateFormatter(ctx, obj.monthsAbr, tipData.data.series[0].val);
	      } else {
	        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
	        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
	        rhs = "" + (obj.yAxis.prefix) + (setTickFormat(obj.yAxis.format, d.val)) + (obj.yAxis.suffix);
	      }
	      if ((d.val || d.val === 0) && d.val !== '__undefined__') {
	        return ((d.key) + ": " + rhs);
	      } else {
	        return 'n/a';
	      }
	    })
	    .classed(((obj.prefix) + "muted"), function (d) {
	      return (!(d.val || d.val === 0) || d.val === '__undefined__');
	    });

	  tipNodes.tipTextX
	    .text(tipData.data.key);

	  tipNodes.tipGroup
	    .selectAll(("." + (obj.prefix) + "tip_text-group"))
	    .data(tipData.data.series)
	    .classed(((obj.prefix) + "active"), function (d) { return d.val ? true : false; });

	  tipNodes.tipGroup
	    .attr('transform', function () {
	      // tipbox pointing left or right, and top or bottom
	      var xDirection = cursor.x > obj.dimensions.tickWidth() / 2 ? 'left' : 'right',
	        yDirection = cursor.y > obj.dimensions.yAxisHeight() / 2 ? 'top' : 'bottom';
	      return ("translate(" + (obj.dimensions.tipPadding[xDirection]) + "," + (obj.dimensions.tipPadding[yDirection]) + ")");
	    });

	  tipNodes.tipRect
	    .attrs({
	      'width': tipNodes.tipGroup.node().getBoundingClientRect().width + obj.dimensions.tipPadding.left + obj.dimensions.tipPadding.right,
	      'height': tipNodes.tipGroup.node().getBoundingClientRect().height + obj.dimensions.tipPadding.top + obj.dimensions.tipPadding.bottom
	    });

	  tipNodes.tipBox
	    .attr('transform', function() {
	      var x, y;

	      if (cursor.y > obj.dimensions.yAxisHeight() / 2) {
	        // tipbox pointing up
	        y = obj.rendered.plot.yScaleObj.scale(yPos) - this.getBoundingClientRect().height - obj.dimensions.tipOffset.vertical;
	      } else {
	        // tipbox pointing down
	        y = obj.rendered.plot.yScaleObj.scale(yPos) + obj.dimensions.tipOffset.vertical;
	      }

	      if (cursor.x > obj.dimensions.tickWidth() / 2) {
	        // tipbox pointing left
	        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight - this.getBoundingClientRect().width - obj.dimensions.tipOffset.horizontal;
	      } else {
	        // tipbox pointing right
	        x = obj.rendered.plot.xScaleObj.scale(xPos) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + obj.dimensions.tipOffset.horizontal;
	      }
	      return ("translate(" + x + "," + y + ")");
	    });

	}

	function tipDateFormatter(ctx, months, data) {

	  var dMonth,
	    dDate,
	    dYear,
	    dHour,
	    dMinute,
	    dStr;

	  var d = data;

	  switch (ctx) {
	    case 'years':
	      dStr = d.getFullYear();
	      break;
	    case 'monthly':
	      dMonth = months[d.getMonth()];
	      dYear = d.getFullYear();
	      dStr = dMonth + " " + dYear;
	      break;
	    case 'months':
	      dMonth = months[d.getMonth()];
	      dDate = d.getDate();
	      dYear = d.getFullYear();
	      dStr = dMonth + " " + dDate + ", " + dYear;
	      break;
	    case 'weeks':
	    case 'days':
	      dMonth = months[d.getMonth()];
	      dDate = d.getDate();
	      dYear = d.getFullYear();
	      dStr = dMonth + " " + dDate;
	      break;
	    case 'hours': {

	      dDate = d.getDate();
	      dHour = d.getHours();
	      dMinute = d.getMinutes();

	      var dHourStr,
	        dMinuteStr;

	      // Convert from 24h time
	      var suffix = (dHour >= 12) ? 'p.m.' : 'a.m.';

	      if (dHour === 0) {
	        dHourStr = 12;
	      } else if (dHour > 12) {
	        dHourStr = dHour - 12;
	      } else {
	        dHourStr = dHour;
	      }

	      // Make minutes follow Globe style
	      if (dMinute === 0) {
	        dMinuteStr = '';
	      } else if (dMinute < 10) {
	        dMinuteStr = ":0" + dMinute;
	      } else {
	        dMinuteStr = ":" + dMinute;
	      }

	      dStr = "" + dHourStr + dMinuteStr + " " + suffix;

	      break;
	    }
	    default:
	      dStr = d;
	      break;
	  }

	  return dStr;

	}

	function annotation(node, obj) {

	  var annoData = obj.annotations;

	  var hasAnnotations = annoData && (
	    (annoData.highlight && annoData.highlight.length) ||
	    (annoData.text && annoData.text.length) ||
	    (annoData.range && annoData.range.length) ||
	    (annoData.pointer && annoData.pointer.length)
	  );

	  var annoNode, annoEditable;

	  if (hasAnnotations) {
	    annoNode = select(node.node().parentNode)
	      .append('g')
	      .attrs({
	        'transform': ("translate(" + (obj.dimensions.margin.left) + "," + (obj.dimensions.margin.top) + ")"),
	        'class': ((obj.prefix) + "annotations")
	      });
	  }

	  if (annoData.range && annoData.range.length) { range$1(annoNode, obj); }
	  if (annoData.highlight && annoData.highlight.length) { highlight(annoNode, obj); }
	  if (annoData.pointer && annoData.pointer.length) { pointer(annoNode, obj); }
	  if (annoData.text && annoData.text.length) { text(annoNode, obj); }

	  var isTextAndScatterplot = obj.options.type === 'scatterplot' &&
	    obj.annotationHandlers &&
	    obj.annotationHandlers.type === 'text';

	  if (obj.editable && obj.annotationHandlers && obj.annotationHandlers.type) {
	    // insert either behind `graph` element for text scatterplots,
	    // or behind annotations element for everything else
	    annoEditable = select(node.node().parentNode)
	      .insert('g', isTextAndScatterplot ? ("." + (obj.prefix) + "graph") : ("." + (obj.prefix) + "annotations"))
	      .attrs({
	        transform: ("translate(" + (obj.dimensions.margin.left) + "," + (obj.dimensions.margin.top) + ")"),
	        class: ((obj.prefix) + "annotation-editable-group")
	      });

	    if (obj.annotationHandlers.type === 'range') { editableRange(annoEditable, obj); }
	    if (obj.annotationHandlers.type === 'text') { editableText(annoEditable, obj); }
	    if (obj.annotationHandlers.type === 'pointer') { editablePointer(annoEditable, obj); }

	  }

	  return {
	    annoNode: annoNode,
	    annoEditable: annoEditable
	  };

	}

	function highlight(annoNode, obj) {

	  var h = obj.annotations.highlight;

	  if (obj.options.type === 'bar' || obj.options.type === 'column') {
	    var ref = obj.rendered.plot[((obj.options.type) + "Items")][0];
	    if (ref && obj.data.seriesAmount === 1) {
	      h.map(function (highlightObj) {
	        ref
	          .filter(function (d) { return d.key.toString() === highlightObj.key; })
	          .select('rect')
	          .style('fill', highlightObj.color);
	      });
	    }
	  }

	}

	function range$1(annoNode, obj) {
	  var r = obj.annotations.range;

	  r.map(function (rangeObj, i) {
	    var handlers = obj.annotationHandlers;
	    var skip;
	    if (handlers && handlers.type === 'range' && isNumeric(handlers.currId)) {
	      skip = handlers.currId;
	    }
	    if (skip !== i) {
	      drawRangeAnnotation(obj, rangeObj, i, annoNode);
	    }
	  });
	}

	function drawRangeAnnotation(obj, rangeObj, i, annoNode) {
	  var scale = obj.rendered.plot[((rangeObj.axis) + "ScaleObj")].scale,
	    scaleType = obj.rendered.plot[((rangeObj.axis) + "ScaleObj")].obj.type;

	  var start, end;

	  if (scaleType === 'linear') {
	    start = Number(rangeObj.start);
	    if ('end' in rangeObj) { end = Number(rangeObj.end); }
	  } else {
	    start = new Date(rangeObj.start);
	    if ('end' in rangeObj) { end = new Date(rangeObj.end); }
	  }

	  var attrs = {
	    'class': function () {
	      var output = (obj.prefix) + "annotation_range " + (obj.prefix) + "annotation_range-" + i;
	      if ('end' in rangeObj) {
	        output += " " + (obj.prefix) + "annotation_range-rect";
	      } else {
	        output += " " + (obj.prefix) + "annotation_range-line";
	      }
	      return output;
	    },
	    transform: ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)")
	  };

	  var type, rangeNode;

	  var isColumnAndX = obj.options.type === 'column' && rangeObj.axis === 'x';

	  var offset = isColumnAndX ? obj.rendered.plot.singleColumn : 0;

	  if ('end' in rangeObj) {
	    type = 'rect';
	    var rangeVals = [scale(start), scale(end)].sort(function (a, b) { return a - b; });

	    // adjust width to account for column width if necessary
	    rangeVals[1] = rangeVals[1] + offset;
	    attrs.x = rangeObj.axis === 'x' ? rangeVals[0] : 0;
	    attrs.y = rangeObj.axis === 'x' ? 0 : rangeVals[0];
	    attrs.width = rangeObj.axis === 'x' ? Math.abs(rangeVals[1] - rangeVals[0]) : obj.dimensions.tickWidth();
	    attrs.height = rangeObj.axis === 'x' ? obj.dimensions.yAxisHeight() : Math.abs(rangeVals[1] - rangeVals[0]);
	    rangeNode = obj.rendered.container.insert(type, ':first-child');
	  } else {
	    type = 'line';

	    // cancels out offsetting for leftmost column)
	    var sameStarts = new Date(start).toString() === scale.domain()[0].toString();
	    if (isColumnAndX && sameStarts) { offset = 0; }
	    attrs.x1 = rangeObj.axis === 'x' ? scale(start) + offset : 0;
	    attrs.x2 = rangeObj.axis === 'x' ? scale(start) + offset : obj.dimensions.tickWidth();
	    attrs.y1 = rangeObj.axis === 'x' ? 0 : scale(start);
	    attrs.y2 = rangeObj.axis === 'x' ? obj.dimensions.yAxisHeight() : scale(start);
	    rangeNode = annoNode.append(type);
	  }

	  rangeNode.attrs(attrs);

	  if (rangeObj.color) {
	    rangeNode.style('end' in rangeObj ? 'fill' : 'stroke', rangeObj.color);
	  }
	}

	function editableRange(annoEditable, obj) {

	  var hasRangePassedFromInterface =
	    (obj.annotationHandlers.rangeType === 'area' && obj.annotationHandlers.rangeStart && obj.annotationHandlers.rangeEnd) ||
	    (obj.annotationHandlers.rangeType === 'line' && obj.annotationHandlers.rangeStart);

	  if (obj.rendered.plot[((obj.annotationHandlers.rangeAxis) + "ScaleObj")].scale === 'ordinal') {
	    return;
	  }

	  var brush$$1 = (obj.annotationHandlers.rangeAxis === 'x' ? brushX : brushY)()
	    .handleSize(3)
	    .extent([
	      [0, 0],
	      [obj.dimensions.tickWidth(), obj.dimensions.yAxisHeight()]
	    ])
	    .on('start', function() {
	      select(this).classed('inuse', true);
	    })
	    .on('brush', function() {
	      select(this).classed('inuse', true);
	    })
	    .on('end', function() {
	      brushed(event, obj, this);
	    });

	  var brushSel = annoEditable
	    .append('g')
	    .attrs({
	      'class': ((obj.prefix) + "brush " + (obj.prefix) + "brush-" + (obj.annotationHandlers.rangeType)),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	    })
	    .call(brush$$1);

	  brushSel.selectAll('.selection')
	    .on('mousedown touchstart', function () { return brushSel.classed('brushmove', true); });

	  var scale = obj.rendered.plot[((obj.annotationHandlers.rangeAxis) + "ScaleObj")].scale,
	    scaleType = obj.rendered.plot[((obj.annotationHandlers.rangeAxis) + "ScaleObj")].obj.type,
	    isTime = scaleType === 'time' || scaleType === 'ordinal-time';

	  if (hasRangePassedFromInterface) {
	    var move;

	    var start = obj.annotationHandlers.rangeStart,
	      end = obj.annotationHandlers.rangeEnd,
	      isColumnAndX = obj.options.type === 'column' && obj.annotationHandlers.rangeAxis === 'x';

	    var offset = isColumnAndX ? obj.rendered.plot.singleColumn : 0;

	    if (obj.annotationHandlers.rangeType === 'line') {
	      var sameStarts = new Date(start).toString() === scale.domain()[0].toString();
	      if (isColumnAndX && sameStarts) { offset = 0; }
	      move = getBrushFromCenter(obj, scale(isTime ? new Date(start) : Number(start)) + offset);
	    } else {
	      move = [
	        scale(isTime ? new Date(start) : Number(start)),
	        scale(isTime ? new Date(end) : Number(end)) + offset
	      ];

	    }

	    brushSel = brushSel.call(brush$$1.move, move);
	  }

	  if (obj.annotationHandlers.rangeType === 'line') {
	    brushSel
	      .selectAll('.overlay')
	      .each(function (d) { return d.type = 'selection'; }) // Treat overlay interaction as move
	      .on('mousedown touchstart', function() {
	        brushCentered(this, obj, brush$$1); // Recenter before brushing
	      });
	  }

	}

	function getBrushFromCenter(obj, centerValue) {
	  var d = 2, // Use a fixed width when recentering
	    axis = obj.annotationHandlers.rangeAxis,
	    dim = axis === 'x' ? obj.dimensions.tickWidth() : obj.dimensions.yAxisHeight(),
	    d0 = centerValue - d / 2,
	    d1 = centerValue + d / 2,
	    move = d1 > dim ? [dim - d, dim] : d0 < 0 ? [0, d] : [d0, d1];

	  return move;
	}

	function brushCentered(node, obj, brush$$1) {
	  var axis = obj.annotationHandlers.rangeAxis,
	    cursor = cursorPos(select(node))[axis],
	    move = getBrushFromCenter(obj, cursor);

	  select(node.parentNode).call(brush$$1.move, move);
	}

	function brushed(e, obj, node) {

	  var r = obj.annotationHandlers;

	  // !event.sourceEvent happens when clicking-to-select on a line
	  // event.sourceEvent && event.sourceEvent.type !== 'mouseup' happens when releasing after drag on a line or area
	  if (!event.sourceEvent) { return; }
	  if (event.sourceEvent && event.sourceEvent.type !== 'mouseup') { return; }

	  var data,
	    id = isNumeric(obj.annotationHandlers.currId) ? obj.annotationHandlers.currId : obj.annotations.range.length;

	  if (!e.selection || !select(node).classed('inuse')) {
	    data = null;
	  } else {

	    var axis = r.rangeAxis,
	      accessor = scaleAccessor(axis, obj),
	      sel = e.selection,
	      xScale = obj.rendered.plot.xScaleObj.scale,
	      startVal = r.rangeType === 'line' ? sel[0] + ((sel[1] - sel[0]) / 2) : sel[0],
	      endVal = sel[1];

	    var start = accessor(startVal),
	      end;

	    if (r.rangeType === 'area') {
	      // if it's a column, need to nudge it over to cover the end of the column
	      var xEndVal = obj.options.type === 'column' ? endVal - obj.rendered.plot.singleColumn : endVal;
	      end = accessor(xEndVal);
	    }

	    if (r.rangeType === 'line') {
	      var isFirstValue = start.toString() === xScale.domain()[0].toString();
	      // need to nudge start value over if column, except if it's the very first col
	      if (!isFirstValue) {
	        var xStartVal = obj.options.type === 'column' ? startVal - obj.rendered.plot.singleColumn : startVal;
	        start = accessor(xStartVal);
	      }
	    }

	    data = { axis: axis };

	    // if has r.rangeStart and target of event was the overlay
	    // rect we're creating a new range, so increment id by 1
	    if (r.rangeStart && typeof event.sourceEvent.target === 'object') {
	      var brushMoving = select(node).classed('brushmove');
	      // need to determine if brush is just moving, handle is moving, or it's a new brush
	      if (r.rangeType === 'area') {
	        var usingHandles = start.toString() === r.rangeStart || end.toString() === r.rangeEnd;
	        if (!usingHandles && !brushMoving) { id++; }
	      }

	      if (r.rangeType === 'line' && !brushMoving) { id++; }
	    }

	    if (r.rangeType === 'area') {
	      data.start = start;
	      data.end = end;
	      if (start === end) { data = null; }
	    } else {
	      data.start = start;
	    }
	  }

	  select(node).classed('inuse brushmove', false);

	  if (r && r.rangeHandler) { r.rangeHandler(data, id); }

	}

	function scaleAccessor(axis, obj) {

	  var scaleObj = obj.rendered.plot[(axis + "ScaleObj")];

	  var fn;

	  if (scaleObj.obj.type === 'linear') {
	    fn = function (d) { return scaleObj.scale.invert(d); };
	  }

	  if (scaleObj.obj.type === 'time' || scaleObj.obj.type === 'ordinal-time') {
	    fn = function (d) { return getTipData(obj, { x: d }).key; };
	  }

	  return fn;
	}

	function text(annoNode, obj) {
	  var t = obj.annotations.text;
	  t.map(function (textObj, i) {
	    var handlers = obj.annotationHandlers;
	    var skip;
	    if (handlers && handlers.type === 'text' && isNumeric(handlers.currId)) {
	      skip = handlers.currId;
	    }
	    if (skip !== i) {
	      var config = generateTextAnnotationConfig(textObj, annoNode, obj);
	      drawTextAnnotation(i, config, obj);
	    }
	  });
	}

	function generateTextAnnotationConfig(d, annoNode, obj, pos) {

	  var position = pos || {};

	  if (d.position) {
	    position.x = d.position.x * obj.dimensions.tickWidth();
	    position.y = d.position.y * obj.dimensions.yAxisHeight();
	  }

	  var config = {
	    annoNode: annoNode,
	    text: d.text || d.key,
	    position: position || null,
	    'text-align': d['text-align'] || 'middle',
	    valign: d.valign || 'top',
	    color: d.color
	  };

	  switch(config['text-align']) {
	    case 'left':
	      config['text-align'] = 'start';
	      break;
	    case 'middle':
	      config['text-align'] = 'middle';
	      break;
	    case 'right':
	      config['text-align'] = 'end';
	      break;
	  }

	  switch(config.valign) {
	    case 'top':
	      config.valign = 'hanging';
	      break;
	    case 'middle':
	      config.valign = 'central';
	      break;
	    case 'bottom':
	      config.valign = 'baseline';
	      break;
	  }

	  return config;

	}

	function drawTextAnnotation(i, config, obj) {

	  var textNode = config.annoNode
	    .append('text')
	    .text(config.text)
	    .attrs({
	      'class': ((obj.prefix) + "annotation_text " + (obj.prefix) + "annotation_text-" + i),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	      'x': config.position.x,
	      'y': config.position.y,
	      'text-anchor': config['text-align'],
	      'dominant-baseline': config.valign
	    });

	  if (config.color) { textNode.style('fill', config.color); }

	  var lines = 1;

	  // wrap text as needed
	  if ((config.text).indexOf('\n') !== -1) {
	    textNode.call(wrapAnnoText);
	    lines = config.text.split(/\r\n|\r|\n/).length;
	  }

	  var textMeasurement = textNode.node().getBoundingClientRect();

	  var tspanHeight = textMeasurement.height / lines;

	  if (lines > 1) {
	    if (config.valign === 'central') {
	      textNode.attr('y', Number(textNode.attr('y')) - (textMeasurement.height - tspanHeight) / 2);
	    }
	    if (config.valign === 'baseline') {
	      textNode.attr('y', Number(textNode.attr('y')) + tspanHeight - textMeasurement.height);
	    }
	  }

	  // y bounds positioning

	  if (Number(textNode.attr('y')) < 0) {
	    textNode.attr('y', 0);
	  }

	  if (Number(textNode.attr('y')) > obj.dimensions.computedHeight() - textMeasurement.height) {
	    textNode.attr('y', obj.dimensions.computedHeight() - textMeasurement.height);
	  }

	  // x bounds positioning

	  if (config['text-align'] === 'start') {
	    if (textNode.attr('x') > obj.dimensions.computedWidth() - textMeasurement.width) {
	      textNode.attr('x', obj.dimensions.computedWidth() - textMeasurement.width);
	      textNode.selectAll('tspan').attr('x', obj.dimensions.computedWidth() - textMeasurement.width);
	    }
	  }

	  if (config['text-align'] === 'middle') {
	    // clipped on left
	    if (Number(textNode.attr('x')) < textMeasurement.width / 2) {
	      textNode.attr('x', textMeasurement.width / 2);
	      textNode.selectAll('tspan').attr('x', textMeasurement.width / 2);
	    }
	    // clipped on right
	    if (Number(textNode.attr('x')) > obj.dimensions.computedWidth() - (textMeasurement.width / 2)) {
	      textNode.attr('x', obj.dimensions.computedWidth() - (textMeasurement.width / 2));
	      textNode.selectAll('tspan').attr('x', obj.dimensions.computedWidth() - (textMeasurement.width / 2));
	    }
	  }

	  if (config['text-align'] === 'end') {
	    if (textNode.attr('x') < textMeasurement.width) {
	      textNode.attr('x', textMeasurement.width);
	      textNode.selectAll('tspan').attr('x', textMeasurement.width);
	    }
	  }
	}

	function editableText(annoEditable, obj) {
	  var this$1 = this;


	  if (obj.options.type === 'scatterplot') {
	    var xScale = obj.rendered.plot.xScaleObj.scale,
	      yScale = obj.rendered.plot.yScaleObj.scale;
	    obj.rendered.plot.dotItems
	      .on('click', function (d) {
	        obj.annotationHandlers.textText = d.key;
	        obj.annotationHandlers.textX = xScale(d.series[0].val) / obj.dimensions.tickWidth();
	        obj.annotationHandlers.textY = yScale(d.series[1].val) / obj.dimensions.yAxisHeight();
	        appendTextInput(obj, this$1);
	      });
	  }

	  var textSel = annoEditable
	    .append('g')
	    .attrs({
	      'class': ((obj.prefix) + "text"),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	    });

	  var hasText = isNumeric(obj.annotationHandlers.textX) && isNumeric(obj.annotationHandlers.textY) && obj.annotationHandlers.textText;

	  textSel
	    .append('rect')
	    .attrs({
	      class: ((obj.prefix) + "text-rect"),
	      x: 0,
	      y: 0,
	      width: obj.dimensions.tickWidth(),
	      height: obj.dimensions.yAxisHeight()
	    })
	    .on('click', function() {
	      if (hasText && obj.annotationHandlers.textHandler) {
	        obj.annotationHandlers.textHandler(null);
	      } else {
	        appendTextInput(obj, this);
	      }
	    });

	  if (hasText) { appendTextInput(obj, this); }

	}

	function appendTextInput(obj, node) {

	  var dragFn = drag()
	    .on('drag', function() { textDrag(obj, this); })
	    .on('end', function() { textDragEnd(obj, this); });

	  var position = { x: 0, y: 0 };

	  if (isNumeric(obj.annotationHandlers.textX) && isNumeric(obj.annotationHandlers.textY)) {
	    position.x = Number(obj.annotationHandlers.textX) * obj.dimensions.tickWidth();
	    position.y = Number(obj.annotationHandlers.textY) * obj.dimensions.yAxisHeight();
	  } else {
	    var cursor = cursorPos(select(node));
	    position.x = cursor.x;
	    position.y = cursor.y;
	  }

	  var parentContainer = select(obj.rendered.container.node().parentNode.parentNode);

	  var htmlContainer = parentContainer.select(("." + (obj.prefix) + "annotation-text-input"));

	  if (!htmlContainer.node()) {
	    htmlContainer = parentContainer
	      .insert('div', ("." + (obj.prefix) + "chart_source"))
	      .attr('class', ((obj.prefix) + "annotation-text-input"));
	  }

	  htmlContainer
	    .styles({
	      top: ((obj.dimensions.headerHeight + obj.dimensions.margin.top) + "px"),
	      left: ((obj.dimensions.computedWidth() - obj.dimensions.tickWidth() + obj.dimensions.margin.left) + "px"),
	      width: ((obj.dimensions.tickWidth()) + "px"),
	      height: ((obj.dimensions.yAxisHeight()) + "px")
	    });

	  var editableTextBox = htmlContainer.select(("." + (obj.prefix) + "annotation-text-edit-box"));

	  if (!editableTextBox.node()) {
	    editableTextBox = htmlContainer
	      .append('div')
	      .attr('class', ((obj.prefix) + "annotation-text-edit-box"));
	  }

	  editableTextBox
	    .styles(setTextPosition(obj, position))
	    .call(dragFn);

	  var editableText = editableTextBox.select(("." + (obj.prefix) + "annotation-text-edit"));

	  if (!editableText.node()) {
	    editableText = editableTextBox
	      .append('p')
	      .attr('class', ((obj.prefix) + "annotation-text-edit"));
	  }

	  editableText
	    .attr('contentEditable', true)
	    .on('focusout', function() {
	      textDragEnd(obj, this.parentNode);
	      if (!this.innerText) { htmlContainer.remove(); }
	    })
	    .on('click', setEditableTextCaret);

	  if (obj.annotationHandlers.textText) {
	    editableText.node().innerText = obj.annotationHandlers.textText;
	  } else{
	    editableText.each(setEditableTextCaret);
	  }

	}

	function setTextPosition(obj, position) {

	  var styles = {},
	    origin = { x: '0%', y: '0%' },
	    translate = { x: '0px', y: '0px' };

	  switch (obj.annotationHandlers['text-align']) {
	    case 'left':
	      styles[obj.annotationHandlers['text-align']] = (position.x) + "px";
	      styles['text-align'] = obj.annotationHandlers['text-align'];
	      break;
	    case 'middle':
	      styles.left = (position.x) + "px";
	      origin.x = '50%';
	      translate.x = '-50%';
	      styles['text-align'] = 'center';
	      break;
	    case 'right':
	      styles[obj.annotationHandlers['text-align']] = (obj.dimensions.tickWidth() - position.x) + "px";
	      styles['text-align'] = obj.annotationHandlers['text-align'];
	      break;
	  }

	  switch (obj.annotationHandlers.valign) {
	    case 'top':
	      styles[obj.annotationHandlers.valign] = (position.y) + "px";
	      break;
	    case 'middle':
	      styles.top = (position.y) + "px";
	      origin.y = '50%';
	      translate.y = '-50%';
	      break;
	    case 'bottom':
	      styles[obj.annotationHandlers.valign] = (obj.dimensions.yAxisHeight() - position.y) + "px";
	      break;
	  }

	  styles['transform-origin'] = (origin.x) + " " + (origin.y);
	  styles.transform = "translate(" + (translate.x) + "," + (translate.y) + ")";

	  return styles;
	}

	function setEditableTextCaret() {
	  if (event && event.defaultPrevented) { return; }
	  var range = document.createRange();
	  range.selectNodeContents(this);
	  range.collapse(false);
	  var selection$$1 = window.getSelection();
	  selection$$1.removeAllRanges();
	  selection$$1.addRange(range);
	}

	function textDrag(obj, node) {

	  var styles = {};

	  switch (obj.annotationHandlers['text-align']) {
	    case 'left':
	    case 'middle':
	      styles.left = (parseFloat(node.style.left) + event.dx) + "px";
	      break;
	    case 'right':
	      styles.right = (parseFloat(node.style.right) - event.dx) + "px";
	      break;
	  }

	  switch (obj.annotationHandlers.valign) {
	    case 'top':
	    case 'middle':
	      styles.top = (parseFloat(node.style.top) + event.dy) + "px";
	      break;
	    case 'bottom':
	      styles.bottom = (parseFloat(node.style.bottom) - event.dy) + "px";
	      break;
	  }

	  select(node).styles(styles);
	}

	function textDragEnd(obj, node) {

	  if (!node.innerText) { return; }

	  var t = obj.annotationHandlers,
	    position = {
	      x: null,
	      y: null
	    };

	  switch (t['text-align']) {
	    case 'left':
	      position.x = parseFloat(node.style[t['text-align']]);
	      break;
	    case 'middle':
	      position.x = parseFloat(node.style.left);
	      break;
	    case 'right':
	      position.x = obj.dimensions.tickWidth() - parseFloat(node.style[t['text-align']]);
	      break;
	  }

	  switch (t.valign) {
	    case 'top':
	      position.y = parseFloat(node.style[t.valign]);
	      break;
	    case 'middle':
	      position.y = parseFloat(node.style.top);
	      break;
	    case 'bottom':
	      position.y = obj.dimensions.yAxisHeight() - parseFloat(node.style[t.valign]);
	      break;
	  }

	  position.x = roundToPrecision(position.x / obj.dimensions.tickWidth(), 4);
	  position.y = roundToPrecision(position.y / obj.dimensions.yAxisHeight(), 4);

	  position.x = Math.max(0, Math.min(1, position.x));
	  position.y = Math.max(0, Math.min(1, position.y));

	  var data = {
	    text: node.innerText.trim(),
	    position: position
	  };

	  // id either already exists for a previously-generated text item (via obj.annotationHandlers.currId) OR it's brand new

	  var id = isNumeric(obj.annotationHandlers.currId) ? obj.annotationHandlers.currId : obj.annotations.text.length;

	  if (t && t.textHandler) { t.textHandler(data, id); }

	}

	function pointer(annoNode, obj) {
	  var p = obj.annotations.pointer;

	  if (p.length) { appendMarker(annoNode.node().parentNode, obj); }

	  p.map(function (pointerObj, i) {
	    var handlers = obj.annotationHandlers;
	    var skip;
	    if (handlers && handlers.type === 'pointer' && isNumeric(handlers.currId)) {
	      skip = handlers.currId;
	    }
	    if (skip !== i) {
	      var data = pointerObj.position.map(function (d) {
	        return {
	          x: Math.max(0, Math.min(obj.dimensions.tickWidth(), d.x * obj.dimensions.tickWidth())),
	          y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), d.y * obj.dimensions.yAxisHeight()))
	        };
	      });

	      var midpoint = calculateMidpoint(data, parseFloat(pointerObj.curve));

	      annoNode
	        .append('path')
	        .datum([data[0], midpoint, data[1]])
	        .attrs({
	          transform: ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	          class: ((obj.prefix) + "pointer-path " + (obj.prefix) + "pointer-path-" + i),
	          'marker-end': ("url(#" + (obj.prefix) + "arrow)"),
	          d: pointerLine()
	        });
	    }
	  });
	}

	function editablePointer(annoEditable, obj) {

	  var p = obj.annotationHandlers;

	  appendMarker(annoEditable.node().parentNode, obj, true);

	  var dragFn = drag()
	    .on('start', function() { pointerDragStart(obj, pointerSel, this); })
	    .on('drag', function() { pointerDrag(obj, pointerSel, this); })
	    .on('end', function() { pointerDragEnd(obj, pointerSel, this); });

	  var pointerSel = annoEditable
	    .append('g')
	    .attrs({
	      'class': ((obj.prefix) + "pointer"),
	      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
	    });

	  var pointerPositions = [{
	    x: isNumeric(p.pointerX1) ? Number(p.pointerX1) : 0,
	    y: isNumeric(p.pointerY1) ? Number(p.pointerY1) : 0
	  }, {
	    x: isNumeric(p.pointerX2) ? Number(p.pointerX2) : 0,
	    y: isNumeric(p.pointerY2) ? Number(p.pointerY2) : 0
	  }].map(function (d) {
	    return {
	      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), d.x * obj.dimensions.tickWidth())),
	      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), d.y * obj.dimensions.yAxisHeight()))
	    };
	  });

	  var midpoint = calculateMidpoint(pointerPositions, Number(p.pointerCurve));

	  var pointerSelRect = pointerSel
	    .append('rect')
	    .attrs({
	      x: 0,
	      y: 0,
	      width: obj.dimensions.tickWidth(),
	      height: obj.dimensions.yAxisHeight()
	    });

	  var pointerHasData = pointerPositions[0].x || pointerPositions[0].y || pointerPositions[1].x || pointerPositions[1].y;

	  pointerSel
	    .append('path')
	    .datum([pointerPositions[0], midpoint, pointerPositions[1]])
	    .attrs({
	      class: ((obj.prefix) + "pointer-handle-path"),
	      'marker-end': ("url(#" + (obj.prefix) + "arrow-editable)"),
	      d: pointerHasData ? pointerLine() : null
	    });

	  pointerSel
	    .selectAll(("." + (obj.prefix) + "pointer-handle"))
	    .data(pointerPositions).enter()
	    .append('circle')
	    .attrs({
	      class: function (d, i) { return ((obj.prefix) + "pointer-handle " + (obj.prefix) + "pointer-handle_" + (i === 0 ? 'start' : 'end')); },
	      cx: function (d) { return d.x; },
	      cy: function (d) { return d.y; },
	      r: 2.5
	    })
	    .style('opacity', function (d, i) { return i === 0 && pointerHasData ? 1 : 0; })
	    .call(dragFn);

	  pointerSelRect.call(dragFn);

	}

	function pointerDragStart(obj, node, currNode) {

	  node.style('opacity', null);

	  var selection$$1;

	  if (select(currNode).classed(((obj.prefix) + "pointer-handle"))) {
	    selection$$1 = select(currNode);
	  } else {
	    selection$$1 = node.selectAll(("." + (obj.prefix) + "pointer-handle"));
	  }

	  selection$$1
	    .style('opacity', null)
	    .datum({
	      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), event.x)),
	      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), event.y))
	    })
	    .attrs({
	      cx: function (d) { return d.x; },
	      cy: function (d) { return d.y; }
	    });
	}

	function pointerDrag(obj, node, currNode) {

	  var p = obj.annotationHandlers;

	  var selection$$1;

	  if (select(currNode).classed(((obj.prefix) + "pointer-handle"))) {
	    selection$$1 = select(currNode);
	  } else {
	    selection$$1 = node.select(("." + (obj.prefix) + "pointer-handle_end"));
	  }

	  selection$$1
	    .datum(function() {
	      var x = parseFloat(select(this).attr('cx')) + event.dx,
	        y = parseFloat(select(this).attr('cy')) + event.dy;
	      return {
	        x: Math.max(0, Math.min(obj.dimensions.tickWidth(), x)),
	        y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), y))
	      };
	    })
	    .attrs({
	      cx: function (d) { return d.x; },
	      cy: function (d) { return d.y; }
	    });

	  var data = node.selectAll(("." + (obj.prefix) + "pointer-handle")).data(),
	    midpoint = calculateMidpoint(data, Number(p.pointerCurve));

	  node.select(("." + (obj.prefix) + "pointer-handle-path"))
	    .datum([data[0], midpoint, data[1]])
	    .attr('d', pointerLine());
	}

	function pointerDragEnd(obj, node, currNode) {

	  var p = obj.annotationHandlers;

	  var selection$$1;

	  if (select(currNode).classed(((obj.prefix) + "pointer-handle"))) {
	    selection$$1 = select(currNode);
	  } else {
	    selection$$1 = node.select(("." + (obj.prefix) + "pointer-handle_end"));
	  }

	  selection$$1
	    .datum({
	      x: Math.max(0, Math.min(obj.dimensions.tickWidth(), event.x)),
	      y: Math.max(0, Math.min(obj.dimensions.yAxisHeight(), event.y))
	    })
	    .attrs({
	      cx: function (d) { return d.x; },
	      cy: function (d) { return d.y; }
	    });

	  var data = node.selectAll(("." + (obj.prefix) + "pointer-handle")).data(),
	    midpoint = calculateMidpoint(data, Number(p.pointerCurve));

	  var path = node.select(("." + (obj.prefix) + "pointer-handle-path"))
	    .datum([data[0], midpoint, data[1]])
	    .attr('d', pointerLine());

	  var id;

	  if (currNode.nodeName === 'rect') {
	    // then it's a new pointer
	    id = obj.annotations.pointer.length;
	  } else {
	    id = isNumeric(obj.annotationHandlers.currId) ? obj.annotationHandlers.currId : obj.annotations.pointer.length;
	  }

	  var pathLength = path.node().getTotalLength();

	  // path needs to be at least 5px long, or it resets
	  var pointerData = pathLength < 5 ? null : data.map(function (d) { return ({
	    x: roundToPrecision(d.x / obj.dimensions.tickWidth(), 4),
	    y: roundToPrecision(d.y / obj.dimensions.yAxisHeight(), 4)
	  }); });

	  if (pointerData === null) { node.style('opacity', pointerData === null ? 0 : 1); }

	  if (p && p.pointerHandler) { p.pointerHandler(pointerData, id); }

	}

	function calculateMidpoint(d, pct) {

	  var sign = d[1].x > d[0].x ? -1 * Math.sign(pct) : 1 * Math.sign(pct),
	    // plots a point at the center of a line between start and end points
	    minMid = {
	      x: ((d[1].x - d[0].x) / 2) + d[0].x,
	      y: ((d[1].y - d[0].y) / 2) + d[0].y
	    },
	    // plots a point at the 90deg point (i.e. an isoceles right triangle) between start and end points
	    maxMid = {
	      x: minMid.x + (sign * ((d[1].y - d[0].y) / 2)),
	      y: minMid.y + (sign * -1 * ((d[1].x - d[0].x) / 2))
	    };

	  // interpolate between two positions
	  return object(minMid, maxMid)(Math.abs(pct));
	}

	function pointerLine() {
	  return line()
	    .curve(curveBasis)
	    .x(function (d) { return d.x; })
	    .y(function (d) { return d.y; });
	}

	function appendMarker(node, obj, editActive) {
	  select(node)
	    .insert('defs', ':first-child')
	    .append('marker')
	    .attrs({
	      id: ((obj.prefix) + "arrow" + (editActive ? '-editable' : '')),
	      viewBox: '0 0 100 80',
	      refX: 20,
	      refY: 40,
	      markerWidth: 8,
	      markerHeight: 6.4,
	      orient: 'auto'
	    })
	    .append('path')
	    .attr('d', 'M100,40L0 80 23.7 40 0 0 z')
	    .attr('class', ((obj.prefix) + "arrow-head"));
	}

	function shareData(node, obj) {

	  var chartContainer = select(node);

	  var chartMeta = chartContainer.select(("." + (obj.prefix) + "chart_meta"));

	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', ((obj.prefix) + "chart_meta"));
	  }

	  var chartDataBtn = chartMeta
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_meta_btn"))
	    .html('data');

	  var chartData = chartContainer
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_data"));

	  var chartDataCloseBtn = chartData
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_data_close"))
	    .html('&#xd7;');

	  var chartDataTable = chartData
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_data_inner"));

	  chartData
	    .append('h2')
	    .html(obj.heading);

	  var chartDataNav = chartData
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_data_nav"));

	  var csvDLBtn = chartDataNav
	    .append('a')
	    .attr('class', ((obj.prefix) + "chart_data_btn csv"))
	    .html('download csv');

	  csvToTable(chartDataTable, obj.data.csv);

	  chartDataBtn.on('click', function () {
	    chartData.classed(((obj.prefix) + "active"), true);
	  });

	  chartDataCloseBtn.on('click', function () {
	    chartData.classed(((obj.prefix) + "active"), false);
	  });

	  csvDLBtn.on('click', function() {
	    select(this)
	      .attrs({
	        'href': ("data:text/plain;charset=utf-8," + (encodeURIComponent(obj.data.csv))),
	        'download': ("data_" + (obj.id) + ".csv")
	      });
	  });

	  return {
	    meta_nav: chartMeta,
	    data_panel: chartData
	  };

	}

	function social$1(node, obj) {

	  var socialOptions = [];

	  for (var prop in obj.social) {
	    if (obj.social[prop]) {
	      switch (obj.social[prop].label) {
	        case 'Twitter':
	          obj.social[prop].url = constructTwitterURL(obj);
	          obj.social[prop].popup = true;
	          break;
	        case 'Facebook':
	          obj.social[prop].url = constructFacebookURL(obj);
	          obj.social[prop].popup = true;
	          break;
	        case 'Email':
	          obj.social[prop].url = constructMailURL(obj);
	          obj.social[prop].popup = false;
	          break;
	        case 'SMS':
	          obj.social[prop].url = constructSMSURL(obj);
	          obj.social[prop].popup = false;
	          break;
	        default:
	          console.log('Incorrect social item definition.');
	      }
	      socialOptions.push(obj.social[prop]);
	    }
	  }

	  var chartContainer = select(node);

	  var chartMeta = chartContainer.select(("." + (obj.prefix) + "chart_meta"));

	  if (chartMeta.node() === null) {
	    chartMeta = chartContainer
	      .append('div')
	      .attr('class', ((obj.prefix) + "chart_meta"));
	  }

	  var chartSocialBtn = chartMeta
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_meta_btn"))
	    .html('share');

	  var chartSocial = chartContainer
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_social"));

	  var chartSocialCloseBtn = chartSocial
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_social_close"))
	    .html('&#xd7;');

	  var chartSocialOptions = chartSocial
	    .append('div')
	    .attr('class', ((obj.prefix) + "chart_social_options"));

	  chartSocialOptions
	    .append('h3')
	    .html('Share this chart:');

	  chartSocialBtn.on('click', function () {
	    chartSocial.classed(((obj.prefix) + "active"), true);
	  });

	  chartSocialCloseBtn.on('click', function () {
	    chartSocial.classed(((obj.prefix) + "active"), false);
	  });

	  var itemAmount = socialOptions.length;

	  for (var i = 0; i < itemAmount; i++) {
	    chartSocialOptions
	      .selectAll(("." + (obj.prefix) + "social-item"))
	      .data(socialOptions)
	      .enter()
	      .append('div')
	      .attr('class', ((obj.prefix) + "social-item"))
	      .html(function (d) {
	        if (!d.popup) {
	          return ("<a href='" + (d.url) + "'><img class='" + (obj.prefix) + "social-icon' src='" + (d.icon) + "' title='" + (d.label) + "'></a>");
	        } else {
	          return ("<a class='" + (obj.prefix) + "js-share' href='" + (d.url) + "'><img class='" + (obj.prefix) + "social-icon' src='" + (d.icon) + "' title='" + (d.label) + "'></a>");
	        }
	      });
	  }

	  if (obj.image && obj.image.enable) {
	    chartSocialOptions
	      .append('div')
	      .attr('class', ((obj.prefix) + "image-url"))
	      .attr('contentEditable', 'true')
	      .html(getThumbnailPath(obj));
	  }

	  var sharePopup = document.querySelectorAll(("." + (obj.prefix) + "js-share"));

	  if (sharePopup) {
	    [].forEach.call(sharePopup, function (anchor) {
	      anchor.addEventListener('click', function(e) {
	        e.preventDefault();
	        windowPopup(this.href, 600, 620);
	      });
	    });
	  }

	  return {
	    meta_nav: chartMeta
	  };

	}

	function windowPopup(url, width, height) {

	  // calculate the position of the popup so it’s centered on the screen
	  var left = (screen.width / 2) - (width / 2),
	    top = (screen.height / 2) - (height / 2);

	  window.open(
	    url,
	    '',
	    ("menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left)
	  );
	}

	function constructFacebookURL(obj){
	  var base = 'https://www.facebook.com/dialog/share?',
	    redirect = obj.social.facebook.redirect;
	  var url = "app_id=" + (obj.social.facebook.appID) + "&amp;display=popup&amp;title=" + (obj.heading) + "&amp;description=From%20article" + (document.title) + "&amp;href=" + (window.location.href) + "&amp;redirect_uri=" + redirect;
	  if (obj.image && obj.image.enable) { url += "&amp;picture=" + (getThumbnailPath(obj)); }
	  return ("" + base + url);
	}

	function constructMailURL(obj){
	  var base = 'mailto:?';
	  var thumbnail = (obj.image && obj.image.enable) ? ("%0A" + (getThumbnailPath(obj))) : '';
	  return (base + "subject=" + (obj.heading) + "&amp;body=" + (obj.heading) + thumbnail + "%0Afrom article: " + (document.title) + "%0A" + (window.location.href));
	}

	function constructSMSURL(obj){
	  var base = 'sms:';
	  var url = "&body=Check%20out%20this%20chart: " + (obj.heading);
	  if (obj.image && obj.image.enable) {  url += "%20" + (getThumbnailPath(obj)); }
	  return ("" + base + url);
	}

	function constructTwitterURL(obj){
	  var base = 'https://twitter.com/intent/tweet?',
	    hashtag = (obj.social.twitter.hashtag) ? ("&amp;hashtags=" + (obj.social.twitter.hashtag)) : '',
	    via = (obj.social.twitter.via) ? ("&amp;via=" + (obj.social.twitter.via)) : '';
	  var url = "url=" + (window.location.href) + via + "&amp;text=" + (encodeURI(obj.heading)) + hashtag;
	  if (obj.image && obj.image.enable) {  url += "%20" + (getThumbnailPath(obj)); }
	  return ("" + base + url);
	}

	/**
	 * Custom code function that can be invoked to modify chart elements after chart drawing has occurred.
	 * @param  {Object} node         The main container group for the chart.
	 * @param  {Object} chartRecipe  Object that contains settings for the chart.
	 * @param  {Object} rendered     An object containing references to all rendered chart elements, including axes, scales, paths, nodes, and so forth.
	 * @return {Object}              Optional.
	 */
	function custom(node, chartRecipe, rendered) {

	  // With this function, you can access all elements of a chart and modify
	  // them at will. For instance: you might want to play with colour
	  // interpolation for a multi-series line chart, or modify the width and position
	  // of the x- and y-axis ticks. With this function, you can do all that!

	  // If you can, it's good Chart Tool practice to return references to newly
	  // created nodes and d3 objects so they be accessed later — by a dispatcher
	  // event, for instance.
	  return;

	}

	var ChartManager = function ChartManager(container, obj) {

	  this.recipe = recipe(obj);

	  this.recipe.rendered = {};

	  var rendered = this.recipe.rendered;

	  // check that each section is needed

	  if (this.recipe.options.head || this.recipe.options.qualifier) {
	    rendered.header = header(container, this.recipe);
	  }

	  if (this.recipe.options.footer) {
	    rendered.footer = footer(container, this.recipe);
	  }

	  var node = base(container, this.recipe);

	  rendered.container = node;

	  rendered.plot = plot(node, this.recipe);

	  if (this.recipe.options.annotations) {
	    rendered.annotations = annotation(node, this.recipe, rendered);
	  }

	  if (this.recipe.options.tips) {
	    rendered.tips = tipsManager(node, this.recipe);
	  }

	  if (!this.recipe.editable && !this.recipe.exportable) {
	    if (this.recipe.options.share_data) {
	      rendered.shareData = shareData(container, this.recipe);
	    }
	    if (this.recipe.options.social) {
	      rendered.social = social$1(container, this.recipe);
	    }
	  }

	  if (this.recipe.CUSTOM) {
	    rendered.custom = custom(node, this.recipe, rendered);
	  }

	};

	var root$2 = typeof window !== 'undefined' ? window : undefined;

	var ChartTool = (function ChartTool() {

	  var charts = [],
	    dispatcher = dispatch('start', 'finish', 'redraw', 'mouseOver', 'mouseMove', 'mouseOut', 'click');

	  var dispatchFunctions;

	  function createChart(cont, chart, callback) {
	    var this$1 = this;


	    dispatcher.call('start', this, chart);

	    if (chart.data.chart.drawStart) { chart.data.chart.drawStart(); }

	    var obj = clearObj(chart),
	      container = clearChart(cont);

	    var exportable = chart.data.chart.exportable;

	    obj.data.width = exportable ? exportable.width : getBounding(container, 'width');
	    obj.dispatch = dispatcher;

	    var chartObj, error;

	    try {
	      chartObj = new ChartManager(container, obj);
	      obj.chartObj = chartObj;

	      select(container)
	        .on('click', function () { return dispatcher.call('click', this$1, chartObj); })
	        .on('mouseover', function () { return dispatcher.call('mouseOver', this$1, chartObj); })
	        .on('mousemove', function () { return dispatcher.call('mouseMove', this$1, chartObj); })
	        .on('mouseout', function () { return dispatcher.call('mouseOut', this$1, chartObj); });

	      dispatcher.call('finish', this, chartObj);
	    } catch(e) {
	      error = e;
	      console.log(error);
	      generateThumb(container, obj);
	    }

	    if (chart.data.chart.drawFinished) { chart.data.chart.drawFinished(); }

	    if (callback) { callback(); }

	  }

	  function readChart(id) {
	    for (var i = 0; i < charts.length; i++) {
	      if (charts[i].id === id) {
	        return charts[i];
	      }
	    }
	  }

	  function listCharts(charts) {
	    var chartsArr = [];
	    for (var i = 0; i < charts.length; i++) {
	      chartsArr.push(charts[i].id);
	    }
	    return chartsArr;
	  }

	  function updateChart(id, obj) {
	    var container = "." + (chartSettings.baseClass) + "[data-chartid=" + (chartSettings.prefix) + id + "]";
	    createChart(container, { id: id, data: obj });
	  }

	  function destroyChart(id) {
	    var container;
	    if (!isElement(id)) {
	      var obj;
	      for (var i = 0; i < charts.length; i++) {
	        if (charts[i].id === id) {
	          obj = charts[i];
	        }
	      }
	      container = "." + (chartSettings.baseClass) + "[data-chartid=" + (obj.id) + "]";
	      clearObj(obj);
	    } else {
	      container = id;
	    }
	    clearChart(container);
	  }

	  function createLoop(resizeEvent) {
	    if (root$2.ChartTool.length || resizeEvent) {
	      var chartList = root$2.ChartTool.length ? root$2.ChartTool : charts;
	      var loop = function ( i ) {
	        var chart = chartList[i];
	        var matchedCharts = (void 0);
	        if (charts.length) {
	          matchedCharts = charts.filter(function (c) { return c.id === chart.id; });
	        }
	        if (!matchedCharts || !matchedCharts.length) {
	          charts.push(chart);
	        }
	        var container = "." + (chartSettings.baseClass) + "[data-chartid=" + (chart.id) + "]";
	        createChart(container, chart);
	      };

	      for (var i = 0; i < chartList.length; i++) loop( i );
	    }
	  }

	  function initializer() {
	    var this$1 = this;

	    dispatchFunctions = root$2.__charttooldispatcher || [];
	    for (var prop in dispatchFunctions) {
	      if (dispatchFunctions.hasOwnProperty(prop)) {
	        if (Object.keys(dispatcher._).indexOf(prop) > -1) {
	          dispatcher.on(prop, dispatchFunctions[prop]);
	        } else {
	          console.log(("Chart Tool does not offer a dispatcher of type " + prop + ". For available dispatcher types, please see the ChartTool.dispatch() method."));
	        }
	      }
	    }
	    var debouncer = debounce$1(createLoop, true, chartSettings.debounce, root$2);
	    var eventListener = (isMobile.phone || isMobile.tablet) ? 'orientationchange' : 'resize';
	    select(root$2)
	      .on((eventListener + "." + (chartSettings.prefix) + "debounce"), function () {
	        dispatcher.call('redraw', this$1, charts);
	        debouncer();
	      });
	    if (root$2.ChartTool) { createLoop(); }
	  }

	  return {
	    init: function(preloadedCharts) {
	      if (!this.initialized) {
	        if (preloadedCharts && preloadedCharts.length) {
	          preloadedCharts.map(function (p) { return charts.push(p); });
	        }
	        initializer();
	        this.initialized = true;
	      }
	    },
	    // similar to the push method, except this is explicitly invoked by the user
	    create: function (container, obj, cb) {
	      return createChart(container, obj, cb);
	    },
	    // push is basically the same as the create method, except for embed-based charts only
	    push: function (obj, cb) {
	      var container = "." + (chartSettings.baseClass) + "[data-chartid=" + (obj.id) + "]";
	      createChart(container, obj, cb);
	    },
	    read: function (id) {
	      return readChart(id);
	    },
	    list: function () {
	      return listCharts(charts);
	    },
	    update: function (id, obj) {
	      return updateChart(id, obj);
	    },
	    destroy: function (id) {
	      return destroyChart(id);
	    },
	    dispatch: function () {
	      return Object.keys(dispatcher);
	    },
	    parse: parse,
	    version: chartSettings.version,
	    build: chartSettings.build,
	    wat: function () {
	      console.log(("ChartTool v" + (chartSettings.version) + " is a free, open-source chart generator and front-end library maintained by The Globe and Mail. For more information, check out our GitHub repo: https://github.com/globeandmail/chart-tool"));
	    }
	  };

	})();

	if (root$2) {
	  ChartTool.init(root$2.ChartTool);
	  root$2.ChartTool = ChartTool;
	}

	return ChartTool;

})));
//# sourceMappingURL=chart-tool.js.map
