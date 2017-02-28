/* Chart Tool v1.2.2-0 | https://github.com/globeandmail/chart-tool | MIT */
var ChartToolInit = (function () {
'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

var namespace = function(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
};

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

var creator = function(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
};

var nextId = 0;

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

var selection_on = function(typename, value, capture) {
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
};

var sourceEvent = function() {
  var current = event, source;
  while (source = current.sourceEvent) current = source;
  return current;
};

var point = function(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
};

var mouse = function(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};

function none() {}

var selector = function(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
};

var selection_select = function(select) {
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
};

function empty() {
  return [];
}

var selectorAll = function(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
};

var selection_selectAll = function(select) {
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
};

var selection_filter = function(match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

var sparse = function(update) {
  return new Array(update.length);
};

var selection_enter = function() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
};

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

var constant$1 = function(x) {
  return function() {
    return x;
  };
};

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

var selection_data = function(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant$1(value);

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
};

var selection_exit = function() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
};

var selection_merge = function(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
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
};

var selection_order = function() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
};

var selection_sort = function(compare) {
  if (!compare) compare = ascending;

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
};

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

var selection_call = function() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
};

var selection_nodes = function() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
};

var selection_node = function() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
};

var selection_size = function() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
};

var selection_empty = function() {
  return !this.node();
};

var selection_each = function(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
};

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

var selection_attr = function(name, value) {
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
};

var window$1 = function(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
};

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

var selection_style = function(name, value, priority) {
  var node;
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : window$1(node = this.node())
          .getComputedStyle(node, null)
          .getPropertyValue(name);
};

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

var selection_property = function(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
};

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

var selection_classed = function(name, value) {
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
};

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

var selection_text = function(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
};

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

var selection_html = function(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
};

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function() {
  return this.each(raise);
};

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

var selection_lower = function() {
  return this.each(lower);
};

var selection_append = function(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
};

function constantNull() {
  return null;
}

var selection_insert = function(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
};

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

var selection_remove = function() {
  return this.each(remove);
};

var selection_datum = function(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
};

function dispatchEvent(node, type, params) {
  var window = window$1(node),
      event = window.CustomEvent;

  if (event) {
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

var selection_dispatch = function(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
};

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
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
};

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
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
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

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var ascending$1 = function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
};

var bisector = function(compare) {
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
};

function ascendingComparator(f) {
  return function(d, x) {
    return ascending$1(f(d), x);
  };
}

var ascendingBisect = bisector(ascending$1);
var bisectRight = ascendingBisect.right;

var number = function(x) {
  return x === null ? NaN : +x;
};

var extent = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b,
      c;

  if (f == null) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
    while (++i < n) if ((b = array[i]) != null) {
      if (a > b) a = b;
      if (c < b) c = b;
    }
  }

  else {
    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
    while (++i < n) if ((b = f(array[i], i, array)) != null) {
      if (a > b) a = b;
      if (c < b) c = b;
    }
  }

  return [a, c];
};

var array = Array.prototype;

var slice = array.slice;
var map = array.map;

var constant$2 = function(x) {
  return function() {
    return x;
  };
};

var identity = function(x) {
  return x;
};

var range = function(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
};

var e10 = Math.sqrt(50);
var e5 = Math.sqrt(10);
var e2 = Math.sqrt(2);

var ticks = function(start, stop, count) {
  var step = tickStep(start, stop, count);
  return range(
    Math.ceil(start / step) * step,
    Math.floor(stop / step) * step + step / 2, // inclusive
    step
  );
};

function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}

var sturges = function(values) {
  return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
};

var threshold = function(array, p, f) {
  if (f == null) f = number;
  if (!(n = array.length)) return;
  if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
  if (p >= 1) return +f(array[n - 1], n - 1, array);
  var n,
      h = (n - 1) * p,
      i = Math.floor(h),
      a = +f(array[i], i, array),
      b = +f(array[i + 1], i + 1, array);
  return a + (b - a) * (h - i);
};

var max = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;

  if (f == null) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = array[i]) != null && b > a) a = b;
  }

  else {
    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
  }

  return a;
};

var min = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;

  if (f == null) {
    while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = array[i]) != null && a > b) a = b;
  }

  else {
    while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
    while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
  }

  return a;
};

function length(d) {
  return d.length;
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

function createObject() {
  return {};
}

function setObject(object, key, value) {
  object[key] = value;
}

function createMap() {
  return map$1();
}

function setMap(map, key, value) {
  map.set(key, value);
}

function Set() {}

var proto = map$1.prototype;

Set.prototype = set$1.prototype = {
  constructor: Set,
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

function set$1(object, f) {
  var set = new Set;

  // Copy constructor.
  if (object instanceof Set) object.each(function(value) { set.add(value); });

  // Otherwise, assume it’s an array.
  else if (object) {
    var i = -1, n = object.length;
    if (f == null) while (++i < n) set.add(object[i]);
    else while (++i < n) set.add(f(object[i], i, object));
  }

  return set;
}

var array$1 = Array.prototype;

var map$3 = array$1.map;
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

function point$1() {
  return pointish(band().paddingInner(1));
}

var define = function(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
};

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex3 = /^#([0-9a-f]{3})$/;
var reHex6 = /^#([0-9a-f]{6})$/;
var reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$");
var reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$");
var reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$");
var reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$");
var reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$");
var reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

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

var Kn = 18;
var Xn = 0.950470;
var Yn = 1;
var Zn = 1.088830;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;

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

var A = -0.14861;
var B = +1.78277;
var C = -0.29227;
var D = -0.90649;
var E = +1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;

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

function basis(t1, v0, v1, v2, v3) {
  var t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

var constant$3 = function(x) {
  return function() {
    return x;
  };
};

function linear$1(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function hue(a, b) {
  var d = b - a;
  return d ? linear$1(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant$3(isNaN(a) ? b : a);
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$3(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear$1(a, d) : constant$3(isNaN(a) ? b : a);
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

var array$2 = function(a, b) {
  var nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x = new Array(nb),
      c = new Array(nb),
      i;

  for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
  for (; i < nb; ++i) c[i] = b[i];

  return function(t) {
    for (i = 0; i < na; ++i) c[i] = x[i](t);
    return c;
  };
};

var date = function(a, b) {
  var d = new Date;
  return a = +a, b -= a, function(t) {
    return d.setTime(a + b * t), d;
  };
};

var interpolateNumber = function(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
};

var object = function(a, b) {
  var i = {},
      c = {},
      k;

  if (a === null || typeof a !== "object") a = {};
  if (b === null || typeof b !== "object") b = {};

  for (k in b) {
    if (k in a) {
      i[k] = interpolateValue(a[k], b[k]);
    } else {
      c[k] = b[k];
    }
  }

  return function(t) {
    for (k in i) c[k] = i[k](t);
    return c;
  };
};

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");

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

var interpolateString = function(a, b) {
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
};

var interpolateValue = function(a, b) {
  var t = typeof b, c;
  return b == null || t === "boolean" ? constant$3(b)
      : (t === "number" ? interpolateNumber
      : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
      : b instanceof color ? interpolateRgb
      : b instanceof Date ? date
      : Array.isArray(b) ? array$2
      : isNaN(b) ? object
      : interpolateNumber)(a, b);
};

var interpolateRound = function(a, b) {
  return a = +a, b -= a, function(t) {
    return Math.round(a + b * t);
  };
};

var degrees = 180 / Math.PI;

var identity$2 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

var decompose = function(a, b, c, d, e, f) {
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
};

var cssNode;
var cssRoot;
var cssView;
var svgNode;

function parseCss(value) {
  if (value === "none") return identity$2;
  if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
  cssNode.style.transform = value;
  value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(",");
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

function parseSvg(value) {
  if (value == null) return identity$2;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$2;
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
var rho2 = 2;
var rho4 = 4;
var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

// p0 = [ux0, uy0, w0]
// p1 = [ux1, uy1, w1]

function cubehelix$1(hue$$1) {
  return (function cubehelixGamma(y) {
    y = +y;

    function cubehelix$$1(start, end) {
      var h = hue$$1((start = cubehelix(start)).h, (end = cubehelix(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(Math.pow(t, y));
        start.opacity = opacity(t);
        return start + "";
      };
    }

    cubehelix$$1.gamma = cubehelixGamma;

    return cubehelix$$1;
  })(1);
}

cubehelix$1(hue);
var cubehelixLong = cubehelix$1(nogamma);

var constant$4 = function(x) {
  return function() {
    return x;
  };
};

var number$1 = function(x) {
  return +x;
};

var unit = [0, 1];

function deinterpolateLinear(a, b) {
  return (b -= (a = +a))
      ? function(x) { return (x - a) / b; }
      : constant$4(b);
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
      interpolate$$1 = interpolateValue,
      clamp = false,
      piecewise,
      output,
      input;

  function rescale() {
    piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
    output = input = null;
    return scale;
  }

  function scale(x) {
    return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
  }

  scale.invert = function(y) {
    return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
  };

  scale.domain = function(_) {
    return arguments.length ? (domain = map$3.call(_, number$1), rescale()) : domain.slice();
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
var formatDecimal = function(x, p) {
  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
  var i, coefficient = x.slice(0, i);

  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x.slice(i + 1)
  ];
};

var exponent = function(x) {
  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
};

var formatGroup = function(grouping, thousands) {
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
};

var formatDefault = function(x, p) {
  x = x.toPrecision(p);

  out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
    switch (x[i]) {
      case ".": i0 = i1 = i; break;
      case "0": if (i0 === 0) i0 = i; i1 = i; break;
      case "e": break out;
      default: if (i0 > 0) i0 = 0; break;
    }
  }

  return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
};

var prefixExponent;

var formatPrefixAuto = function(x, p) {
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
};

var formatRounded = function(x, p) {
  var d = formatDecimal(x, p);
  if (!d) return x + "";
  var coefficient = d[0],
      exponent = d[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
};

var formatTypes = {
  "": formatDefault,
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

// [[fill]align][sign][symbol][0][width][,][.precision][type]
var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

var formatSpecifier = function(specifier) {
  return new FormatSpecifier(specifier);
};

function FormatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

  var match,
      fill = match[1] || " ",
      align = match[2] || ">",
      sign = match[3] || "-",
      symbol = match[4] || "",
      zero = !!match[5],
      width = match[6] && +match[6],
      comma = !!match[7],
      precision = match[8] && +match[8].slice(1),
      type = match[9] || "";

  // The "n" type is an alias for ",g".
  if (type === "n") comma = true, type = "g";

  // Map invalid types to the default format.
  else if (!formatTypes[type]) type = "";

  // If zero fill is specified, padding goes after sign and before digits.
  if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

  this.fill = fill;
  this.align = align;
  this.sign = sign;
  this.symbol = symbol;
  this.zero = zero;
  this.width = width;
  this.comma = comma;
  this.precision = precision;
  this.type = type;
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
      + this.type;
};

var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

function identity$3(x) {
  return x;
}

var formatLocale = function(locale) {
  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
      currency = locale.currency,
      decimal = locale.decimal;

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
        type = specifier.type;

    // Compute the prefix and suffix.
    // For SI-prefix, the suffix is lazily computed.
    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

    // What format function should we use?
    // Is this an integer type?
    // Can this type generate exponential notation?
    var formatType = formatTypes[type],
        maybeSuffix = !type || /[defgprs%]/.test(type);

    // Set the default precision if not specified,
    // or clamp the specified precision to the supported range.
    // For significant precision, it must be in [1, 21].
    // For fixed precision, it must be in [0, 20].
    precision = precision == null ? (type ? 6 : 12)
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

        // Convert negative to positive, and compute the prefix.
        // Note that -0 is not less than 0, but 1 / -0 is!
        var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

        // Perform the initial formatting.
        value = formatType(value, precision);

        // If the original value was negative, it may be rounded to zero during
        // formatting; treat this as (positive) zero.
        if (valueNegative) {
          i = -1, n = value.length;
          valueNegative = false;
          while (++i < n) {
            if (c = value.charCodeAt(i), (48 < c && c < 58)
                || (type === "x" && 96 < c && c < 103)
                || (type === "X" && 64 < c && c < 71)) {
              valueNegative = true;
              break;
            }
          }
        }

        // Compute the prefix and suffix.
        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

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
        case "<": return valuePrefix + value + valueSuffix + padding;
        case "=": return valuePrefix + padding + value + valueSuffix;
        case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
      }
      return padding + valuePrefix + value + valueSuffix;
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
};

var locale$1;
var format;
var formatPrefix;

defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""]
});

function defaultLocale(definition) {
  locale$1 = formatLocale(definition);
  format = locale$1.format;
  formatPrefix = locale$1.formatPrefix;
  return locale$1;
}

var precisionFixed = function(step) {
  return Math.max(0, -exponent(Math.abs(step)));
};

var precisionPrefix = function(step, value) {
  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
};

var precisionRound = function(step, max) {
  step = Math.abs(step), max = Math.abs(max) - step;
  return Math.max(0, exponent(max) - exponent(step)) + 1;
};

var tickFormat = function(domain, count, specifier) {
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
};

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
    var d = domain(),
        i = d.length - 1,
        n = count == null ? 10 : count,
        start = d[0],
        stop = d[i],
        step = tickStep(start, stop, n);

    if (step) {
      step = tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
      d[0] = Math.floor(start / step) * step;
      d[i] = Math.ceil(stop / step) * step;
      domain(d);
    }

    return scale;
  };

  return scale;
}

function linear() {
  var scale = continuous(deinterpolateLinear, interpolateNumber);

  scale.copy = function() {
    return copy(scale, linear());
  };

  return linearish(scale);
}

function identity$1() {
  var domain = [0, 1];

  function scale(x) {
    return +x;
  }

  scale.invert = scale;

  scale.domain = scale.range = function(_) {
    return arguments.length ? (domain = map$3.call(_, number$1), scale) : domain.slice();
  };

  scale.copy = function() {
    return identity$1().domain(domain);
  };

  return linearish(scale);
}

var nice = function(domain, interval) {
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
};

function deinterpolate(a, b) {
  return (b = Math.log(b / a))
      ? function(x) { return Math.log(x / a) / b; }
      : constant$4(b);
}

function reinterpolate(a, b) {
  return a < 0
      ? function(t) { return -Math.pow(-b, t) * Math.pow(-a, 1 - t); }
      : function(t) { return Math.pow(b, t) * Math.pow(a, 1 - t); };
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : function(x) { return Math.pow(base, x); };
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
}

function reflect(f) {
  return function(x) {
    return -f(-x);
  };
}

function log() {
  var scale = continuous(deinterpolate, reinterpolate).domain([1, 10]),
      domain = scale.domain,
      base = 10,
      logs = logp(10),
      pows = powp(10);

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) logs = reflect(logs), pows = reflect(pows);
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function(count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.round(i) - 1, j = Math.round(j) + 1;
      if (u > 0) for (; i < j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i < j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = format(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function() {
    return domain(nice(domain(), {
      floor: function(x) { return pows(Math.floor(logs(x))); },
      ceil: function(x) { return pows(Math.ceil(logs(x))); }
    }));
  };

  scale.copy = function() {
    return copy(scale, log().base(base));
  };

  return scale;
}

function raise$1(x, exponent) {
  return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
}

function pow() {
  var exponent = 1,
      scale = continuous(deinterpolate, reinterpolate),
      domain = scale.domain;

  function deinterpolate(a, b) {
    return (b = raise$1(b, exponent) - (a = raise$1(a, exponent)))
        ? function(x) { return (raise$1(x, exponent) - a) / b; }
        : constant$4(b);
  }

  function reinterpolate(a, b) {
    b = raise$1(b, exponent) - (a = raise$1(a, exponent));
    return function(t) { return raise$1(a + b * t, 1 / exponent); };
  }

  scale.exponent = function(_) {
    return arguments.length ? (exponent = +_, domain(domain())) : exponent;
  };

  scale.copy = function() {
    return copy(scale, pow().exponent(exponent));
  };

  return linearish(scale);
}

function quantile$$1() {
  var domain = [],
      range$$1 = [],
      thresholds = [];

  function rescale() {
    var i = 0, n = Math.max(1, range$$1.length);
    thresholds = new Array(n - 1);
    while (++i < n) thresholds[i - 1] = threshold(domain, i / n);
    return scale;
  }

  function scale(x) {
    if (!isNaN(x = +x)) return range$$1[bisectRight(thresholds, x)];
  }

  scale.invertExtent = function(y) {
    var i = range$$1.indexOf(y);
    return i < 0 ? [NaN, NaN] : [
      i > 0 ? thresholds[i - 1] : domain[0],
      i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
    ];
  };

  scale.domain = function(_) {
    if (!arguments.length) return domain.slice();
    domain = [];
    for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
    domain.sort(ascending$1);
    return rescale();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice$1.call(_), rescale()) : range$$1.slice();
  };

  scale.quantiles = function() {
    return thresholds.slice();
  };

  scale.copy = function() {
    return quantile$$1()
        .domain(domain)
        .range(range$$1);
  };

  return scale;
}

function quantize$1() {
  var x0 = 0,
      x1 = 1,
      n = 1,
      domain = [0.5],
      range$$1 = [0, 1];

  function scale(x) {
    if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
  }

  function rescale() {
    var i = -1;
    domain = new Array(n);
    while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
    return scale;
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
  };

  scale.range = function(_) {
    return arguments.length ? (n = (range$$1 = slice$1.call(_)).length - 1, rescale()) : range$$1.slice();
  };

  scale.invertExtent = function(y) {
    var i = range$$1.indexOf(y);
    return i < 0 ? [NaN, NaN]
        : i < 1 ? [x0, domain[0]]
        : i >= n ? [domain[n - 1], x1]
        : [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return quantize$1()
        .domain([x0, x1])
        .range(range$$1);
  };

  return linearish(scale);
}

function threshold$1() {
  var domain = [0.5],
      range$$1 = [0, 1],
      n = 1;

  function scale(x) {
    if (x <= x) return range$$1[bisectRight(domain, x, 0, n)];
  }

  scale.domain = function(_) {
    return arguments.length ? (domain = slice$1.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : domain.slice();
  };

  scale.range = function(_) {
    return arguments.length ? (range$$1 = slice$1.call(_), n = Math.min(domain.length, range$$1.length - 1), scale) : range$$1.slice();
  };

  scale.invertExtent = function(y) {
    var i = range$$1.indexOf(y);
    return [domain[i - 1], domain[i]];
  };

  scale.copy = function() {
    return threshold$1()
        .domain(domain)
        .range(range$$1);
  };

  return scale;
}

var t0$1 = new Date;
var t1$1 = new Date;

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
    var range = [];
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(new Date(+start)); while (offseti(start, step), floori(start), start < stop)
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) while (--step >= 0) while (offseti(date, 1), !test(date)) {} // eslint-disable-line no-empty
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

var durationSecond$1 = 1e3;
var durationMinute$1 = 6e4;
var durationHour$1 = 36e5;
var durationDay$1 = 864e5;
var durationWeek$1 = 6048e5;

var second = newInterval(function(date) {
  date.setTime(Math.floor(date / durationSecond$1) * durationSecond$1);
}, function(date, step) {
  date.setTime(+date + step * durationSecond$1);
}, function(start, end) {
  return (end - start) / durationSecond$1;
}, function(date) {
  return date.getUTCSeconds();
});

var minute = newInterval(function(date) {
  date.setTime(Math.floor(date / durationMinute$1) * durationMinute$1);
}, function(date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function(start, end) {
  return (end - start) / durationMinute$1;
}, function(date) {
  return date.getMinutes();
});

var minutes = minute.range;

var hour = newInterval(function(date) {
  var offset = date.getTimezoneOffset() * durationMinute$1 % durationHour$1;
  if (offset < 0) offset += durationHour$1;
  date.setTime(Math.floor((+date - offset) / durationHour$1) * durationHour$1 + offset);
}, function(date, step) {
  date.setTime(+date + step * durationHour$1);
}, function(start, end) {
  return (end - start) / durationHour$1;
}, function(date) {
  return date.getHours();
});

var hours = hour.range;

var day = newInterval(function(date) {
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setDate(date.getDate() + step);
}, function(start, end) {
  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationDay$1;
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
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute$1) / durationWeek$1;
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
  date.setTime(+date + step * durationMinute$1);
}, function(start, end) {
  return (end - start) / durationMinute$1;
}, function(date) {
  return date.getUTCMinutes();
});

var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour$1);
}, function(start, end) {
  return (end - start) / durationHour$1;
}, function(date) {
  return date.getUTCHours();
});

var utcDay = newInterval(function(date) {
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCDate(date.getUTCDate() + step);
}, function(start, end) {
  return (end - start) / durationDay$1;
}, function(date) {
  return date.getUTCDate() - 1;
});

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek$1;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

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
    "H": formatHour24,
    "I": formatHour12,
    "j": formatDayOfYear,
    "L": formatMilliseconds,
    "m": formatMonthNumber,
    "M": formatMinutes,
    "p": formatPeriod,
    "S": formatSeconds,
    "U": formatWeekNumberSunday,
    "w": formatWeekdayNumber,
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
    "H": formatUTCHour24,
    "I": formatUTCHour12,
    "j": formatUTCDayOfYear,
    "L": formatUTCMilliseconds,
    "m": formatUTCMonthNumber,
    "M": formatUTCMinutes,
    "p": formatUTCPeriod,
    "S": formatUTCSeconds,
    "U": formatUTCWeekNumberSunday,
    "w": formatUTCWeekdayNumber,
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
    "H": parseHour24,
    "I": parseHour24,
    "j": parseDayOfYear,
    "L": parseMilliseconds,
    "m": parseMonthNumber,
    "M": parseMinutes,
    "p": parsePeriod,
    "S": parseSeconds,
    "U": parseWeekNumberSunday,
    "w": parseWeekdayNumber,
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
          i = parseSpecifier(d, specifier, string += "", 0);
      if (i != string.length) return null;

      // The am-pm flag is 0 for AM, and 1 for PM.
      if ("p" in d) d.H = d.H % 12 + d.p * 12;

      // Convert day-of-week and week-of-year to day-of-year.
      if ("W" in d || "U" in d) {
        if (!("w" in d)) d.w = "W" in d ? 1 : 0;
        var day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
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

var pads = {"-": "", "_": " ", "0": "0"};
var numberRe = /^\s*\d+/;
var percentRe = /^%/;
var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

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

function parseWeekdayNumber(d, string, i) {
  var n = numberRe.exec(string.slice(i, i + 1));
  return n ? (d.w = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberSunday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
  return n ? (d.U = +n[0], i + n[0].length) : -1;
}

function parseWeekNumberMonday(d, string, i) {
  var n = numberRe.exec(string.slice(i));
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
  var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
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

function parseLiteralPercent(d, string, i) {
  var n = percentRe.exec(string.slice(i, i + 1));
  return n ? i + n[0].length : -1;
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

function formatMonthNumber(d, p) {
  return pad(d.getMonth() + 1, p, 2);
}

function formatMinutes(d, p) {
  return pad(d.getMinutes(), p, 2);
}

function formatSeconds(d, p) {
  return pad(d.getSeconds(), p, 2);
}

function formatWeekNumberSunday(d, p) {
  return pad(sunday.count(year(d), d), p, 2);
}

function formatWeekdayNumber(d) {
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

function formatUTCMonthNumber(d, p) {
  return pad(d.getUTCMonth() + 1, p, 2);
}

function formatUTCMinutes(d, p) {
  return pad(d.getUTCMinutes(), p, 2);
}

function formatUTCSeconds(d, p) {
  return pad(d.getUTCSeconds(), p, 2);
}

function formatUTCWeekNumberSunday(d, p) {
  return pad(utcSunday.count(utcYear(d), d), p, 2);
}

function formatUTCWeekdayNumber(d) {
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

var locale$2;
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
  locale$2 = formatLocale$1(definition);
  timeFormat = locale$2.format;
  timeParse = locale$2.parse;
  utcFormat = locale$2.utcFormat;
  utcParse = locale$2.utcParse;
  return locale$2;
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

var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationMonth = durationDay * 30;
var durationYear = durationDay * 365;

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
    [second$$1,  1,      durationSecond],
    [second$$1,  5,  5 * durationSecond],
    [second$$1, 15, 15 * durationSecond],
    [second$$1, 30, 30 * durationSecond],
    [minute$$1,  1,      durationMinute],
    [minute$$1,  5,  5 * durationMinute],
    [minute$$1, 15, 15 * durationMinute],
    [minute$$1, 30, 30 * durationMinute],
    [  hour$$1,  1,      durationHour  ],
    [  hour$$1,  3,  3 * durationHour  ],
    [  hour$$1,  6,  6 * durationHour  ],
    [  hour$$1, 12, 12 * durationHour  ],
    [   day$$1,  1,      durationDay   ],
    [   day$$1,  2,  2 * durationDay   ],
    [  week,  1,      durationWeek  ],
    [ month$$1,  1,      durationMonth ],
    [ month$$1,  3,  3 * durationMonth ],
    [  year$$1,  1,      durationYear  ]
  ];

  function tickFormat(date) {
    return (second$$1(date) < date ? formatMillisecond
        : minute$$1(date) < date ? formatSecond
        : hour$$1(date) < date ? formatMinute
        : day$$1(date) < date ? formatHour
        : month$$1(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year$$1(date) < date ? formatMonth
        : formatYear)(date);
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
        step = tickStep(start, stop, interval);
        interval = millisecond$$1;
      }
    }

    return step == null ? interval : interval.every(step);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(map$3.call(_, number$2)) : domain().map(date$1);
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

var scaleTime = function() {
  return calendar(year, month, sunday, day, hour, minute, second, millisecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
};

var colors = function(s) {
  return s.match(/.{6}/g).map(function(x) {
    return "#" + x;
  });
};

colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

var rainbow = cubehelix();

function sequential(interpolator) {
  var x0 = 0,
      x1 = 1,
      clamp = false;

  function scale(x) {
    var t = (x - x0) / (x1 - x0);
    return interpolator(clamp ? Math.max(0, Math.min(1, t)) : t);
  }

  scale.domain = function(_) {
    return arguments.length ? (x0 = +_[0], x1 = +_[1], scale) : [x0, x1];
  };

  scale.clamp = function(_) {
    return arguments.length ? (clamp = !!_, scale) : clamp;
  };

  scale.interpolator = function(_) {
    return arguments.length ? (interpolator = _, scale) : interpolator;
  };

  scale.copy = function() {
    return sequential(interpolator).domain([x0, x1]).clamp(clamp);
  };

  return linearish(scale);
}

var CUSTOM = false;
var prefix$1 = "ct-";
var monthsAbr = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec.","Jan."];
var debounce = 500;
var tipTimeout = 5000;
var ratioMobile = 1.15;
var ratioDesktop = 0.65;
var dateFormat = "%Y-%m-%d";
var timeFormat$1 = "%H:%M";
var margin = {"top":10,"right":3,"bottom":0,"left":0};
var tipOffset = {"vertical":2,"horizontal":1};
var tipPadding = {"top":4,"right":9,"bottom":4,"left":9};
var tipRadius = 3.5;
var yAxis = {"display":true,"scale":"linear","ticks":"auto","orient":"right","format":"comma","prefix":"","suffix":"","min":"","max":"","rescale":false,"nice":true,"paddingRight":9,"tickLowerBound":3,"tickUpperBound":8,"tickGoal":5,"widthThreshold":420,"dy":"","textX":0,"textY":0};
var xAxis = {"display":true,"scale":"time","ticks":"auto","orient":"bottom","format":"auto","prefix":"","suffix":"","min":"","max":"","rescale":false,"nice":false,"rangePoints":1,"tickTarget":6,"ticksSmall":4,"widthThreshold":420,"dy":0.7,"barOffset":9,"upper":{"tickHeight":7,"textX":6,"textY":7},"lower":{"tickHeight":12,"textX":6,"textY":2}};
var barHeight = 25;
var barLabelOffset = 6;
var bands = {"padding":0.12,"offset":0.06,"outerPadding":0.06};

var social = {"facebook":{"label":"Facebook","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-facebook.svg","redirect":"","appID":""},"twitter":{"label":"Twitter","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-social-twitter.svg","via":"","hashtag":""},"email":{"label":"Email","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mail.svg"},"sms":{"label":"SMS","icon":"https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-telephone.svg"}};
var image = {"enable":false,"base_path":"charts/thumbnails","expiration":30000,"filename":"thumbnail","extension":"png","thumbnailWidth":460};

var version = "1.2.2";
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
  deck: '',
  index: '',
  hasHours: false,
  social: social,
  baseClass: ((prefix$1) + "chart"),
  customClass: '',

  options: {
    type: 'line',
    interpolation: 'linear',
    stacked: false,
    expanded: false,
    head: true,
    deck: false,
    qualifier: true,
    legend: true,
    footer: true,
    x_axis: true,
    y_axis: true,
    tips: false,
    annotations: false,
    range: false,
    series: false,
    share_data: true,
    social: true
  },

  range: {},
  series: {},
  xAxis: xAxis,
  yAxis: yAxis,

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
      var ratioScale = linear().range([300, 900]).domain([this.width * this.ratioMobile, this.width * this.ratioDesktop]);
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
    bands: {
      padding: bands.padding,
      offset: bands.offset,
      outerPadding: bands.outerPadding
    }
  }

};

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

var dsv = function(delimiter) {
  var reFormat = new RegExp("[\"" + delimiter + "\n]"),
      delimiterCode = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns;
    return rows;
  }

  function parseRows(text, f) {
    var EOL = {}, // sentinel value for end-of-line
        EOF = {}, // sentinel value for end-of-file
        rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // the current line number
        t, // the current token
        eol; // is the current token followed by EOL?

    function token() {
      if (I >= N) return EOF; // special case: end of file
      if (eol) return eol = false, EOL; // special case: end of line

      // special case: quotes
      var j = I, c;
      if (text.charCodeAt(j) === 34) {
        var i = j;
        while (i++ < N) {
          if (text.charCodeAt(i) === 34) {
            if (text.charCodeAt(i + 1) !== 34) break;
            ++i;
          }
        }
        I = i + 2;
        c = text.charCodeAt(i + 1);
        if (c === 13) {
          eol = true;
          if (text.charCodeAt(i + 2) === 10) ++I;
        } else if (c === 10) {
          eol = true;
        }
        return text.slice(j + 1, i).replace(/""/g, "\"");
      }

      // common case: find next delimiter or newline
      while (I < N) {
        var k = 1;
        c = text.charCodeAt(I++);
        if (c === 10) eol = true; // \n
        else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
        else if (c !== delimiterCode) continue;
        return text.slice(j, I - k);
      }

      // special case: last token before EOF
      return text.slice(j);
    }

    while ((t = token()) !== EOF) {
      var a = [];
      while (t !== EOL && t !== EOF) {
        a.push(t);
        t = token();
      }
      if (f && (a = f(a, n++)) == null) continue;
      rows.push(a);
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
        : reFormat.test(text += "") ? "\"" + text.replace(/\"/g, "\"\"") + "\""
        : text;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatRows: formatRows
  };
};

var csv = dsv(",");

var csvParse = csv.parse;
var csvParseRows = csv.parseRows;

var tsv = dsv("\t");

var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;

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
    else if (!(l01_2 > epsilon)) {}

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

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Otherwise, draw an arc!
    else {
      if (da < 0) da = da % tau + tau;
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

var constant$5 = function(x) {
  return function constant() {
    return x;
  };
};

var epsilon$1 = 1e-12;
var pi$1 = Math.PI;
var halfPi = pi$1 / 2;
var tau$1 = 2 * pi$1;

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

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

var curveLinear = function(context) {
  return new Linear(context);
};

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

var line = function() {
  var x$$1 = x,
      y$$1 = y,
      defined = constant$5(true),
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
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$5(+_), line) : x$$1;
  };

  line.y = function(_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$5(+_), line) : y$$1;
  };

  line.defined = function(_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$5(!!_), line) : defined;
  };

  line.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
};

var area = function() {
  var x0 = x,
      x1 = null,
      y0 = constant$5(0),
      y1 = y,
      defined = constant$5(true),
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
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$5(+_), x1 = null, area) : x0;
  };

  area.x0 = function(_) {
    return arguments.length ? (x0 = typeof _ === "function" ? _ : constant$5(+_), area) : x0;
  };

  area.x1 = function(_) {
    return arguments.length ? (x1 = _ == null ? null : typeof _ === "function" ? _ : constant$5(+_), area) : x1;
  };

  area.y = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$5(+_), y1 = null, area) : y0;
  };

  area.y0 = function(_) {
    return arguments.length ? (y0 = typeof _ === "function" ? _ : constant$5(+_), area) : y0;
  };

  area.y1 = function(_) {
    return arguments.length ? (y1 = _ == null ? null : typeof _ === "function" ? _ : constant$5(+_), area) : y1;
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
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$5(!!_), area) : defined;
  };

  area.curve = function(_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), area) : curve;
  };

  area.context = function(_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), area) : context;
  };

  return area;
};

var descending$1 = function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
};

var identity$4 = function(d) {
  return d;
};

var curveRadialLinear = curveRadial(curveLinear);

function Radial(curve) {
  this._curve = curve;
}

Radial.prototype = {
  areaStart: function() {
    this._curve.areaStart();
  },
  areaEnd: function() {
    this._curve.areaEnd();
  },
  lineStart: function() {
    this._curve.lineStart();
  },
  lineEnd: function() {
    this._curve.lineEnd();
  },
  point: function(a, r) {
    this._curve.point(r * Math.sin(a), r * -Math.cos(a));
  }
};

function curveRadial(curve) {

  function radial(context) {
    return new Radial(curve(context));
  }

  radial._curve = curve;

  return radial;
}

function radialLine(l) {
  var c = l.curve;

  l.angle = l.x, delete l.x;
  l.radius = l.y, delete l.y;

  l.curve = function(_) {
    return arguments.length ? c(curveRadial(_)) : c()._curve;
  };

  return l;
}

var circle = {
  draw: function(context, size) {
    var r = Math.sqrt(size / pi$1);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau$1);
  }
};

var noop$1 = function() {};

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

function Bundle(context, beta) {
  this._basis = new Basis(context);
  this._beta = beta;
}

Bundle.prototype = {
  lineStart: function() {
    this._x = [];
    this._y = [];
    this._basis.lineStart();
  },
  lineEnd: function() {
    var x = this._x,
        y = this._y,
        j = x.length - 1;

    if (j > 0) {
      var x0 = x[0],
          y0 = y[0],
          dx = x[j] - x0,
          dy = y[j] - y0,
          i = -1,
          t;

      while (++i <= j) {
        t = i / j;
        this._basis.point(
          this._beta * x[i] + (1 - this._beta) * (x0 + t * dx),
          this._beta * y[i] + (1 - this._beta) * (y0 + t * dy)
        );
      }
    }

    this._x = this._y = null;
    this._basis.lineEnd();
  },
  point: function(x, y) {
    this._x.push(+x);
    this._y.push(+y);
  }
};

(function custom(beta) {

  function bundle(context) {
    return beta === 1 ? new Basis(context) : new Bundle(context, beta);
  }

  bundle.beta = function(beta) {
    return custom(+beta);
  };

  return bundle;
})(0.85);

function point$3(that, x, y) {
  that._context.bezierCurveTo(
    that._x1 + that._k * (that._x2 - that._x0),
    that._y1 + that._k * (that._y2 - that._y0),
    that._x2 + that._k * (that._x1 - x),
    that._y2 + that._k * (that._y1 - y),
    that._x2,
    that._y2
  );
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: point$3(this, this._x1, this._y1); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; this._x1 = x, this._y1 = y; break;
      case 2: this._point = 3; // proceed
      default: point$3(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCardinal = (function custom(tension) {

  function cardinal(context) {
    return new Cardinal(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalClosed(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalClosed.prototype = {
  areaStart: noop$1,
  areaEnd: noop$1,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
      default: point$3(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

(function custom(tension) {

  function cardinal(context) {
    return new CardinalClosed(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function CardinalOpen(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

CardinalOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
      case 3: this._point = 4; // proceed
      default: point$3(this, x, y); break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

(function custom(tension) {

  function cardinal(context) {
    return new CardinalOpen(context, tension);
  }

  cardinal.tension = function(tension) {
    return custom(+tension);
  };

  return cardinal;
})(0);

function point$4(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > epsilon$1) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > epsilon$1) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2: this._context.lineTo(this._x2, this._y2); break;
      case 3: this.point(this._x2, this._y2); break;
    }
    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; // proceed
      default: point$4(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCatmullRom = (function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomClosed(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomClosed.prototype = {
  areaStart: noop$1,
  areaEnd: noop$1,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 =
    this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3);
        this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3);
        this.point(this._x4, this._y4);
        this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; this._x3 = x, this._y3 = y; break;
      case 1: this._point = 2; this._context.moveTo(this._x4 = x, this._y4 = y); break;
      case 2: this._point = 3; this._x5 = x, this._y5 = y; break;
      default: point$4(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

(function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRomClosed(context, alpha) : new CardinalClosed(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

function CatmullRomOpen(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRomOpen.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 =
    this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a =
    this._l01_2a = this._l12_2a = this._l23_2a =
    this._point = 0;
  },
  lineEnd: function() {
    if (this._line || (this._line !== 0 && this._point === 3)) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0: this._point = 1; break;
      case 1: this._point = 2; break;
      case 2: this._point = 3; this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2); break;
      case 3: this._point = 4; // proceed
      default: point$4(this, x, y); break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

(function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRomOpen(context, alpha) : new CardinalOpen(context, 0);
  }

  catmullRom.alpha = function(alpha) {
    return custom(+alpha);
  };

  return catmullRom;
})(0.5);

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

function monotoneX(context) {
  return new MonotoneX(context);
}

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

var curveNatural = function(context) {
  return new Natural(context);
};

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

function stepBefore(context) {
  return new Step(context, 0);
}

function stepAfter(context) {
  return new Step(context, 1);
}

var slice$2 = Array.prototype.slice;

var none$1 = function(series, order) {
  if (!((n = series.length) > 1)) return;
  for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
    s0 = s1, s1 = series[order[i]];
    for (var j = 0; j < m; ++j) {
      s1[j][1] += s1[j][0] = isNaN(s0[j][1]) ? s0[j][0] : s0[j][1];
    }
  }
};

var none$2 = function(series) {
  var n = series.length, o = new Array(n);
  while (--n >= 0) o[n] = n;
  return o;
};

function stackValue(d, key) {
  return d[key];
}

var stack = function() {
  var keys = constant$5([]),
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
    return arguments.length ? (keys = typeof _ === "function" ? _ : constant$5(slice$2.call(_)), stack) : keys;
  };

  stack.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant$5(+_), stack) : value;
  };

  stack.order = function(_) {
    return arguments.length ? (order = _ == null ? none$2 : typeof _ === "function" ? _ : constant$5(slice$2.call(_)), stack) : order;
  };

  stack.offset = function(_) {
    return arguments.length ? (offset = _ == null ? none$1 : _, stack) : offset;
  };

  return stack;
};

function sum$1(series) {
  var s = 0, i = -1, n = series.length, v;
  while (++i < n) if (v = +series[i][1]) s += v;
  return s;
}

// defined in rollup.config.js
var bucket = "projects.buffalonews.com";

function debounce$1(fn, obj, timeout, root) {
  var timeoutID = -1;
  return function () {
    if (timeoutID > -1) { root.clearTimeout(timeoutID); }
    timeoutID = root.setTimeout(function () {
      fn(obj);
    }, timeout);
  };
}

function clearChart(cont) {
  var el = document.querySelector(cont);
  while (el && el.querySelectorAll('svg').length) {
    var svg = el.querySelectorAll('svg');
    svg[svg.length - 1].parentNode.removeChild(svg[svg.length - 1]);
  }
  while (el && el.querySelectorAll('div').length) {
    var div = el.querySelectorAll('div');
    div[div.length - 1].parentNode.removeChild(div[div.length - 1]);
  }
  return cont;
}

function clearObj(obj) {
  if (obj.chartObj) { obj.chartObj = undefined; }
  return obj;
}

function clearDrawn(drawn, obj) {
  if (drawn.length) {
    for (var i = drawn.length - 1; i >= 0; i--) {
      if (drawn[i].id === obj.id) {
        drawn.splice(i, 1);
      }
    }
  }
  return drawn;
}

function getBounding(selector$$1, dimension) {
  return document.querySelector(selector$$1).getBoundingClientRect()[dimension];
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

function wrapText(text, width) {
  text.each(function() {

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

function timeDiff(d1, d2, tolerance) {

  var diff = d2 - d1,
    time = new TimeObj();

  // returning the context
  if ((diff / time.year) > tolerance) { return 'years'; }
  else if ((diff / time.month) > tolerance) { return 'months'; }
  else if ((diff / time.week) > tolerance) { return 'weeks'; }
  else if ((diff / time.day) > tolerance) { return 'days'; }
  else if ((diff / time.hour) > tolerance) { return 'hours'; }
  else if ((diff / time.min) > tolerance) { return 'minutes'; }
  else { return 'days'; }
  // if none of these work i feel bad for you son
  // i've got 99 problems but an if/else ain't one

}

function timeInterval$$1(data) {

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
    case 'cardinal':
      return curveCardinal;
    case 'linear':
      return curveLinear;
    case 'step-before':
      return stepBefore;
    case 'step-after':
      return stepAfter;
    case 'monotone':
      return monotoneX;
    case 'catmull-rom':
      return curveCatmullRom;
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

function svgTest(root) {
  return !!root.document && !!root.document.createElementNS && !!root.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
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

function parse(csv, inputDateFormat, index, stacked) {

  var val;

  var firstVals = {};

  var headers = csvParseRows(csv.match(/^.*$/m)[0])[0];

  var data = csvParse(csv, function (d, i) {

    var obj = {};

    if (inputDateFormat) {
      var dateFormat = timeParse(inputDateFormat);
      obj.key = dateFormat(d[headers[0]]);
    } else {
      obj.key = d[headers[0]];
    }

    obj.series = [];

    for (var j = 1; j < headers.length; j++) {

      var key = headers[j];

      if (d[key] === 0 || d[key] === '') {
        d[key] = '__undefined__';
      }

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

  var seriesAmount = data[0].series.length;

  var stackedData;

  if (stacked && headers.length > 2) {
    var stackFn = stack().keys(headers.slice(1));
    stackedData = stackFn(range(data.length).map(function (i) {
      var o = {};
      o[headers[0]] = data[i].key;
      for (var j = 0; j < data[i].series.length; j++) {
        o[data[i].series[j].key] = data[i].series[j].val;
      }
      return o;
    }));
  }

  return {
    csv: csv,
    data: data,
    seriesAmount: seriesAmount,
    keys: headers,
    stackedData: stackedData
  };

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

function recipe(obj) {

  var t = extend$1(chartSettings);

  var embed = obj.data, chart = embed.chart;

  // I'm not a big fan of indenting stuff like t
  // (looking at you, Pereira), but I'm making an exception
  // in t case because my eyes were bleeding

  t.dispatch    = obj.dispatch;
  t.version     = embed.version                           || t.version;
  t.id          = obj.id                                  || t.id;
  t.heading     = embed.heading                           || t.heading;
  t.qualifier   = embed.qualifier                         || t.qualifier;
  t.source      = embed.source                            || t.source;
  t.deck        = embed.deck                              || t.deck;
  t.customClass = chart.class                             || t.customClass;
  t.xAxis       = extend$1(t.xAxis, chart.x_axis) || t.xAxis;
  t.yAxis       = extend$1(t.yAxis, chart.y_axis) || t.yAxis;

  var o = t.options, co = chart.options;

  // 'options' area of embed code
  o.type          = chart.options.type          || o.type;
  o.interpolation = chart.options.interpolation || o.interpolation;

  o.social      = !isUndefined(co.social) === true ? co.social           : o.social;
  o.share_data  = !isUndefined(co.share_data) === true ? co.share_data   : o.share_data;
  o.stacked     = !isUndefined(co.stacked) === true ? co.stacked         : o.stacked;
  o.expanded    = !isUndefined(co.expanded) === true ? co.expanded       : o.expanded;
  o.head        = !isUndefined(co.head) === true ? co.head               : o.head;
  o.deck        = !isUndefined(co.deck) === true ? co.deck               : o.deck;
  o.legend      = !isUndefined(co.legend) === true ? co.legend           : o.legend;
  o.qualifier   = !isUndefined(co.qualifier) === true ? co.qualifier     : o.qualifier;
  o.footer      = !isUndefined(co.footer) === true ? co.footer           : o.footer;
  o.x_axis      = !isUndefined(co.x_axis) === true ? co.x_axis           : o.x_axis;
  o.y_axis      = !isUndefined(co.y_axis) === true ? co.y_axis           : o.y_axis;
  o.tips        = !isUndefined(co.tips) === true ? co.tips               : o.tips;
  o.annotations = !isUndefined(co.annotations) === true ? co.annotations : o.annotations;
  o.range       = !isUndefined(co.range) === true ? co.range             : o.range;
  o.series      = !isUndefined(co.series) === true ? co.series           : o.series;
  o.index       = !isUndefined(co.indexed) === true ? co.indexed         : o.index;

  //  these are specific to the t object and don't exist in the embed
  t.baseClass        = embed.baseClass  || t.baseClass;
  t.dimensions.width = embed.width      || t.dimensions.width;
  t.prefix           = chart.prefix     || t.prefix;
  t.exportable       = chart.exportable || t.exportable;
  t.editable         = chart.editable   || t.editable;

  if (t.exportable) {
    t.dimensions.width = chart.exportable.width || embed.width || t.dimensions.width;
    if (chart.exportable.height) {
      t.dimensions.height = function() { return chart.exportable.height; };
    }
    t.dimensions.margin = chart.exportable.margin || t.dimensions.margin;
  }

  if (chart.hasHours) { t.dateFormat += " " + (t.timeFormat); }

  t.hasHours   = chart.hasHours   || t.hasHours;
  t.dateFormat = chart.dateFormat || t.dateFormat;

  t.dateFormat = inputDate(t.xAxis.scale, t.dateFormat, chart.date_format);
  t.data = parse(chart.data, t.dateFormat, o.index, o.stacked) || t.data;

  if (!t.data.stackedData) { o.stacked = false; }

  t.seriesHighlight = function () {
    return (t.data.seriesAmount && t.data.seriesAmount <= 1) ? 1 : 0;
  };

  return t;

}

var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1000;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function(f) { setTimeout(f, 17); };

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

var timeout$1 = function(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
};

var emptyOn = dispatch("start", "end", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

var schedule = function(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
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
};

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

function create(node, id, self) {
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

var interrupt = function(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
};

var selection_interrupt = function(name) {
  return this.each(function() {
    interrupt(this, name);
  });
};

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set$3(this, id),
        tween = schedule.tween;

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

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set$3(this, id),
        tween = schedule.tween;

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

    schedule.tween = tween1;
  };
}

var transition_tween = function(name, value) {
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
};

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set$3(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get$1(node, id).value[name];
  };
}

var interpolate$$1 = function(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
};

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

var transition_attr = function(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate$$1;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
};

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

var transition_attrTween = function(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
};

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

var transition_delay = function(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get$1(this.node(), id).delay;
};

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

var transition_duration = function(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get$1(this.node(), id).duration;
};

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set$3(this, id).ease = value;
  };
}

var transition_ease = function(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get$1(this.node(), id).ease;
};

var transition_filter = function(match) {
  if (typeof match !== "function") match = matcher$1(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
};

var transition_merge = function(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
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
};

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
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

var transition_on = function(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get$1(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
};

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

var transition_remove = function() {
  return this.on("end.remove", removeFunction(this._id));
};

var transition_select = function(select$$1) {
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
};

var transition_selectAll = function(select$$1) {
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
};

var Selection$1 = selection.prototype.constructor;

var transition_selection = function() {
  return new Selection$1(this._groups, this._parents);
};

function styleRemove$1(name, interpolate$$2) {
  var value00,
      value10,
      interpolate0;
  return function() {
    var style = window$1(this).getComputedStyle(this, null),
        value0 = style.getPropertyValue(name),
        value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
    return value0 === value1 ? null
        : value0 === value00 && value1 === value10 ? interpolate0
        : interpolate0 = interpolate$$2(value00 = value0, value10 = value1);
  };
}

function styleRemoveEnd(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, interpolate$$2, value1) {
  var value00,
      interpolate0;
  return function() {
    var value0 = window$1(this).getComputedStyle(this, null).getPropertyValue(name);
    return value0 === value1 ? null
        : value0 === value00 ? interpolate0
        : interpolate0 = interpolate$$2(value00 = value0, value1);
  };
}

function styleFunction$1(name, interpolate$$2, value) {
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
        : interpolate0 = interpolate$$2(value00 = value0, value10 = value1);
  };
}

var transition_style = function(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate$$1;
  return value == null ? this
          .styleTween(name, styleRemove$1(name, i))
          .on("end.style." + name, styleRemoveEnd(name))
      : this.styleTween(name, typeof value === "function"
          ? styleFunction$1(name, i, tweenValue(this, "style." + name, value))
          : styleConstant$1(name, i, value), priority);
};

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

var transition_styleTween = function(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
};

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

var transition_text = function(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction$1(tweenValue(this, "text", value))
      : textConstant$1(value == null ? "" : value + ""));
};

var transition_transition = function() {
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
};

var id = 0;

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
  return ++id;
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

var exponent$1 = 3;

var polyIn = (function custom(e) {
  e = +e;

  function polyIn(t) {
    return Math.pow(t, e);
  }

  polyIn.exponent = custom;

  return polyIn;
})(exponent$1);

var polyOut = (function custom(e) {
  e = +e;

  function polyOut(t) {
    return 1 - Math.pow(1 - t, e);
  }

  polyOut.exponent = custom;

  return polyOut;
})(exponent$1);

var polyInOut = (function custom(e) {
  e = +e;

  function polyInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }

  polyInOut.exponent = custom;

  return polyInOut;
})(exponent$1);

var b1 = 4 / 11;
var b2 = 6 / 11;
var b3 = 8 / 11;
var b4 = 3 / 4;
var b5 = 9 / 11;
var b6 = 10 / 11;
var b7 = 15 / 16;
var b8 = 21 / 22;
var b9 = 63 / 64;
var b0 = 1 / b1 / b1;



function bounceOut(t) {
  return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
}

var overshoot = 1.70158;

var backIn = (function custom(s) {
  s = +s;

  function backIn(t) {
    return t * t * ((s + 1) * t - s);
  }

  backIn.overshoot = custom;

  return backIn;
})(overshoot);

var backOut = (function custom(s) {
  s = +s;

  function backOut(t) {
    return --t * t * ((s + 1) * t + s) + 1;
  }

  backOut.overshoot = custom;

  return backOut;
})(overshoot);

var backInOut = (function custom(s) {
  s = +s;

  function backInOut(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }

  backInOut.overshoot = custom;

  return backInOut;
})(overshoot);

var tau$2 = 2 * Math.PI;
var amplitude = 1;
var period = 0.3;

var elasticIn = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

  function elasticIn(t) {
    return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
  }

  elasticIn.amplitude = function(a) { return custom(a, p * tau$2); };
  elasticIn.period = function(p) { return custom(a, p); };

  return elasticIn;
})(amplitude, period);

var elasticOut = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

  function elasticOut(t) {
    return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
  }

  elasticOut.amplitude = function(a) { return custom(a, p * tau$2); };
  elasticOut.period = function(p) { return custom(a, p); };

  return elasticOut;
})(amplitude, period);

var elasticInOut = (function custom(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau$2);

  function elasticInOut(t) {
    return ((t = t * 2 - 1) < 0
        ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
        : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
  }

  elasticInOut.amplitude = function(a) { return custom(a, p * tau$2); };
  elasticInOut.period = function(p) { return custom(a, p); };

  return elasticInOut;
})(amplitude, period);

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

var selection_transition = function(name) {
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
};

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var root$1 = [null];

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

var selection_attrs = function(map) {
  return (typeof map === "function" ? attrsFunction : attrsObject)(this, map);
};

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

var selection_styles = function(map, priority) {
  return (typeof map === "function" ? stylesFunction : stylesObject)(this, map, priority == null ? "" : priority);
};

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

var selection_properties = function(map) {
  return (typeof map === "function" ? propertiesFunction : propertiesObject)(this, map);
};

selection.prototype.attrs = selection_attrs;
selection.prototype.styles = selection_styles;
selection.prototype.properties = selection_properties;

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

  if (obj.heading !== '' || obj.editable) {
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

  if (obj.options.type === 'bar') {
    if (obj.qualifier !== '' || obj.editable) {
      qualifier = headerGroup
        .append('div')
        .attrs({
          'class': function () {
            var str = (obj.prefix) + "chart_qualifier " + (obj.prefix) + "chart_qualifier-bar";
            if (obj.editable) { str += ' editable-chart_qualifier'; }
            return str;
          },
          'contentEditable': function () { return obj.editable ? true : false; }
        })
        .text(obj.qualifier);
    }
  }

  var legend;

  if (obj.data.keys.length > 2) {

    legend = headerGroup.append('div')
      .classed(((obj.prefix) + "chart_legend"), true);

    var keys = obj.data.keys.slice();

    // get rid of the first item as it doesnt represent a series
    keys.shift();

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
      .attr('class', ((obj.prefix) + "legend_item_icon"));

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

var identity$5 = function(x) {
  return x;
};

var top = 1;
var right = 2;
var bottom = 3;
var left = 4;
var epsilon$2 = 1e-6;

function translateX(scale0, scale1, d) {
  var x = scale0(d);
  return "translate(" + (isFinite(x) ? x : scale1(d)) + ",0)";
}

function translateY(scale0, scale1, d) {
  var y = scale0(d);
  return "translate(0," + (isFinite(y) ? y : scale1(d)) + ")";
}

function center(scale) {
  var offset = scale.bandwidth() / 2;
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return scale(d) + offset;
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
      tickPadding = 3;

  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$5) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        transform = orient === top || orient === bottom ? translateX : translateY,
        range = scale.range(),
        range0 = range[0] + 0.5,
        range1 = range[range.length - 1] + 0.5,
        position = (scale.bandwidth ? center : identity$5)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text"),
        k = orient === top || orient === left ? -1 : 1,
        x, y = orient === left || orient === right ? (x = "x", "y") : (x = "y", "x");

    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("stroke", "#000"));

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
        .attr("stroke", "#000")
        .attr(x + "2", k * tickSizeInner)
        .attr(y + "1", 0.5)
        .attr(y + "2", 0.5));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "#000")
        .attr(x, k * spacing)
        .attr(y, 0.5)
        .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
          .attr("opacity", epsilon$2)
          .attr("transform", function(d) { return transform(position, this.parentNode.__axis || position, d); });

      tickEnter
          .attr("opacity", epsilon$2)
          .attr("transform", function(d) { return transform(this.parentNode.__axis || position, position, d); });
    }

    tickExit.remove();

    path
        .attr("d", orient === left || orient == right
            ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
            : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

    tick
        .attr("opacity", 1)
        .attr("transform", function(d) { return transform(position, position, d); });

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
  this.domain = setDomain(obj, axis);
  this.rangeType = 'range';
  this.range = setRange(obj, axisType);
  this.bands = obj.dimensions.bands;
  this.rangePoints = axis.rangePoints || 1.0;
};

function setScaleType(type) {
  switch (type) {
    case 'time': return scaleTime();
    case 'ordinal': return band();
    case 'ordinal-time': return point$1();
    case 'linear': return linear();
    default: return linear();
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

function setDomain(obj, axis) {

  var data = obj.data;
  var domain;

  switch(axis.scale) {
    case 'time':
      domain = setDateDomain(data, axis.min, axis.max);
      break;
    case 'linear':
      if (obj.options.type === 'area' || obj.options.type === 'column' || obj.options.type === 'bar') {
        domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked, true);
      } else {
        domain = setNumericalDomain(data, axis.min, axis.max, obj.options.stacked);
      }
      break;
    case 'ordinal':
    case 'ordinal-time':
      domain = setDiscreteDomain(data);
      break;
  }

  return domain;

}

function setDateDomain(data, min$$1, max$$1) {
  var startDate, endDate;
  if (min$$1 && max$$1) {
    startDate = min$$1;
    endDate = max$$1;
  } else {
    var dateRange = extent(data.data, function (d) { return d.key; });
    startDate = min$$1 || new Date(dateRange[0]);
    endDate = max$$1 || new Date(dateRange[1]);
  }
  return [startDate, endDate];
}

function setNumericalDomain(data, vmin, vmax, stacked, forceMaxVal) {

  var minVal, maxVal;

  var mArr = [];

  map$1(data.data, function (d) {
    for (var j = 0; j < d.series.length; j++) {
      mArr.push(Number(d.series[j].val));
    }
  });

  if (stacked) {
    maxVal = max(data.stackedData, function (layer) {
      return max(layer, function (d) { return d[1]; });
    });
  } else {
    maxVal = max(mArr);
  }

  minVal = min(mArr);

  if (vmin) {
    minVal = vmin;
  } else if (minVal > 0) {
    minVal = 0;
  }

  if (vmax) {
    maxVal = vmax;
  } else if (maxVal < 0 && forceMaxVal) {
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
  var interval = timeInterval$$1(context);
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
  }

  obj.dimensions.xAxisHeight = axisNode.node().getBBox().height;

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
      drawYAxis(obj, axis, axisNode, axisSettings);
      break;
    case 'ordinal':
      discreteAxis(axisNode, scale, axis, axisSettings, obj.dimensions);
      break;
  }

}

function drawYAxis(obj, axis, axisNode, axisSettings) {

  axis.scale().range([obj.dimensions.yAxisHeight(), 0]);

  axis.tickValues(tickFinderY(axis.scale(), axisSettings));

  axisNode.call(axis);

  axisNode.selectAll('g')
    .filter(function (d) { return d; })
    .classed(((obj.prefix) + "minor"), true);

  axisNode.selectAll('.tick text')
    .attr('transform', 'translate(0,0)')
    .call(updateTextY, axisNode, obj, axis, axisSettings)
    .call(repositionTextY, obj.dimensions, axisSettings.textX);
  /*axisNode.selectAll('.tick line')
    .attrs({
      'x1': obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight,
      'x2': obj.dimensions.computedWidth()
    });*/

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
    ticks$$1 = tickFinderX(domain, ctx, tickGoal);
  } else {
    ticks$$1 = tickFinderX(domain, ctx, axisSettings.ticksSmall);
  }

  if (obj.options.type !== 'column') {
    axis.tickValues(ticks$$1);
  } else {
    axis.ticks();
  }

  axisNode.call(axis);

  axisNode.selectAll('text')
    .attrs({
      'x': axisSettings.upper.textX,
      'y': axisSettings.upper.textY,
      'dy': ((axisSettings.dy) + "em")
    })
    .style('text-anchor', 'start')
    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);

  if (obj.options.type === 'column') { dropRedundantTicks(axisNode, ctx); }

  axisNode.selectAll('.tick')
    .call(dropTicks);

  axisNode.selectAll('line')
    .attr('y2', axisSettings.upper.tickHeight);

}

function discreteAxis(axisNode, scale, axis, axisSettings, dimensions) {

  axis.tickPadding(0);

  var bandWidth = scale.bandwidth();

  axisNode.call(axis);

  if (axisSettings.axisType === 'xAxis') {
    axisNode.selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dy', ((axisSettings.dy) + "em"))
      .call(wrapText, bandWidth);

    var xPos = -(bandWidth / 2) - ((scale.step() * dimensions.bands.padding) / 2);

    axisNode.selectAll('line')
      .attrs({
        'x1': xPos,
        'x2': xPos
      });

    axisNode.selectAll('line')
      .attr('y2', axisSettings.upper.tickHeight);

    var lastTick = axisNode.append('g')
      .attrs({
        'class': 'tick',
        'transform': ("translate(" + (dimensions.tickWidth() + (bandWidth / 2) + ((scale.step() * dimensions.bands.padding) / 2)) + ",0)")
      });

    lastTick.append('line')
      .attrs({
        'y2': axisSettings.upper.tickHeight,
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
      'x': axisSettings.upper.textX,
      'y': axisSettings.upper.textY,
      'dy': ((axisSettings.dy) + "em")
    })
    .style('text-anchor', 'start')
    .call(setTickFormatX, ctx, axisSettings.ems, obj.monthsAbr);

  var ordinalTickPadding;

  if (obj.dimensions.computedWidth() > obj.xAxis.widthThreshold) {
    ordinalTickPadding = 7;
  } else {
    ordinalTickPadding = 4;
  }

  axisNode.selectAll('.tick')
    .call(ordinalTimeTicks, axisNode, ctx, scale, ordinalTickPadding);

  axisNode.selectAll('line')
    .attr('y2', axisSettings.upper.tickHeight);

}

function setTickFormatX(selection$$1, ctx, ems, monthsAbr) {

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

function setTickFormatY(fmt, d) {
  // checking for a format and formatting y-axis values accordingly

  var currentFormat;

  switch (fmt) {
    case 'general':
      currentFormat = format('')(d);
      break;
    case 'si':
    case 'comma':
      if (isFloat(parseFloat(d))) {
        currentFormat = format(',.2f')(d);
      } else {
        currentFormat = format(',')(d);
      }
      break;
    case 'round1':
      currentFormat = format(',.1f')(d);
      break;
    case 'round2':
      currentFormat = format(',.2f')(d);
      break;
    case 'round3':
      currentFormat = format(',.3f')(d);
      break;
    case 'round4':
      currentFormat = format(',.4f')(d);
      break;
    default:
      currentFormat = format(',')(d);
      break;
  }

  return currentFormat;

}



function updateTextY(textNodes, axisNode, obj, axis, axisObj) {

  var arr = [];

  textNodes
    .attr('transform', 'translate(0,0)')
    .text(function (d, i) {
      var val = setTickFormatY(axisObj.format, d);
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

  obj.dimensions.labelWidth = max(arr);

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

function tickFinderX(domain, period, tickGoal) {

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

function tickFinderY(scale, tickSettings) {

  // In a nutshell:
  // Checks if an explicit number of ticks has been declared
  // If not, sets lower and upper bounds for the number of ticks
  // Iterates over those and makes sure that there are tick arrays where
  // the last value in the array matches the domain max value
  // if so, tries to find the tick number closest to tickGoal out of the winners,
  // and returns that arr to the scale for use

  var min$$1 = scale.domain()[0],
    max$$1 = scale.domain()[1];

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

      if (min$$1 < 0) {
        if ((tickCandidate[0] === min$$1) && (tickCandidate[tickCandidate.length - 1] === max$$1)) {
          arr.push(tickCandidate);
        }
      } else {
        if (tickCandidate[tickCandidate.length - 1] === max$$1) {
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

  axisManager(node, obj, yAxisObj.axis.scale(), 'yAxis');

  var scaleObj = {
    rangeType: 'range',
    range: xAxisObj.range || [0, obj.dimensions.tickWidth()],
    bands: obj.dimensions.bands,
    rangePoints: obj.xAxis.rangePoints
  };

  setRangeArgs(xAxisObj.axis.scale(), scaleObj);

  var prevXAxisHeight = obj.dimensions.xAxisHeight;

  var newXAxisObj = axisManager(node, obj, xAxisObj.axis.scale(), 'xAxis');

  newXAxisObj.node
    .attr('transform', ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", " + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")"));

  if (obj.xAxis.scale !== 'ordinal') {
    dropOversetTicks(newXAxisObj.node, obj.dimensions.tickWidth());
  }

  if (prevXAxisHeight !== obj.dimensions.xAxisHeight) {
    axisManager(node, obj, yAxisObj.axis.scale(), 'yAxis');
  }

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

  // Secondary array is used to store a reference to all series except for the highlighted item
  var secondaryArr = [];

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

      secondaryArr.push(pathRef);
    }

  };

  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) loop( i );

  // Loop through all the secondary series (all series except the highlighted one)
  // and set the colours in the correct order

  secondaryArr.reverse();

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

  // Secondary array is used to store a reference to all series except for the highlighted item
  var secondaryArr = [];

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

      secondaryArr.push(pathRef);
    }

  };

  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) loop( i );

  // Loop through all the secondary series (all series except the highlighted one)
  // and set the colours in the correct order

  secondaryArr.reverse();

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

  // Secondary array is used to store a reference to all series except for the highlighted item
  var secondaryArr = [];

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

      secondaryArr.push(pathRef);
    }

  };

  for (var i = obj.data.seriesAmount - 1; i >= 0; i--) loop( i );

  // Loop through all the secondary series (all series except the highlighted one)
  // and set the colours in the correct order

  secondaryArr.reverse();

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
      singleColumn = obj.dimensions.tickWidth() / (timeInterval$$1(obj.data.data) + 1) / obj.data.seriesAmount;
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
          if (d.series[i].val !== '__undefined__') {
            return yScale(Math.max(0, d.series[i].val));
          }
        },
        'height': function (d) {
          if (d.series[i].val !== '__undefined__') {
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
    obj.dimensions.yAxisHeight = totalBarHeight;
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
        'class': function (d) { return d.series[i].val < 0 ? 'negative' : 'positive'; },
        'width': function (d) { return Math.abs(xScale(d.series[i].val) - xScale(0)); },
        'x': function (d) { return xScale(Math.min(0, d.series[i].val)); },
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
        var val = setTickFormatY(obj.xAxis.format, d.series[i].val);
        if (i === 0 && j === obj.data.data.length - 1) {
          val = (obj.xAxis.prefix || '') + val + (obj.xAxis.suffix || '');
        }
        return val;
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
        'width': function (d) { return Math.abs(xScale(d.series[i].val) - xScale(0)); },
        'x': function (d) { return xScale(Math.min(0, d.series[i].val)); }
      });

    series[i].selectAll(("." + (obj.prefix) + "bar-label"))
      .attrs({
        'x': function (d) {
          return xScale(Math.max(0, d.series[i].val)) + barLabelOffset;
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
    obj.dimensions.yAxisHeight = totalBarHeight;
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
      'x': function (d, i) {
        return xScale(Math.max(0, lastStack[i][1]));
      },
      'y': function (d) { return yScale(d.key) + Math.ceil(singleBar / 2); }
    })
    .text(function (d, i) {
      var val = setTickFormatY(obj.xAxis.format, d.value);
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
      singleColumn = obj.dimensions.tickWidth() / (timeInterval$$1(obj.data.data) + 1);
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
    rect: rect
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
    default:
      return lineChart(node, obj);
  }
}

function qualifier(node, obj) {

  var qualifierBg, qualifierText;

  if (obj.options.type !== 'bar') {

    var yAxisNode = node.select(("." + (obj.prefix) + "yAxis"));

    if (obj.editable) {

      var foreignObject = yAxisNode.append('foreignObject')
        .attrs({
          'class': ((obj.prefix) + "fo " + (obj.prefix) + "qualifier"),
          'width': '100%'
        });

      var foreignObjectGroup = foreignObject.append('xhtml:div')
        .attr('xmlns', 'http://www.w3.org/1999/xhtml');

      var qualifierField = foreignObjectGroup.append('div')
        .attrs({
          'class': ((obj.prefix) + "chart_qualifier editable-chart_qualifier"),
          'contentEditable': true,
          'xmlns': 'http://www.w3.org/1999/xhtml'
        })
        .text(obj.qualifier);

      foreignObject
        .attrs({
          'width': qualifierField.node().getBoundingClientRect().width + 15,
          'height': qualifierField.node().getBoundingClientRect().height,
          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", " + (- (qualifierField.node().getBoundingClientRect().height) / 2) + ")")
        });

    } else {

      qualifierBg = yAxisNode.append('text')
        .attr('class', ((obj.prefix) + "chart_qualifier-text-bg"))
        .text(obj.qualifier)
        .attrs({
          'dy': '0.32em',
          'y': obj.yAxis.textY,
          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)")
        });

      qualifierText = yAxisNode.append('text')
        .attr('class', ((obj.prefix) + "chart_qualifier-text"))
        .text(obj.qualifier)
        .attrs({
          'dy': '0.32em',
          'y': obj.yAxis.textY,
          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ", 0)")
        });

    }

  }

  return {
    qualifierBg: qualifierBg,
    qualifierText: qualifierText
  };

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

    if (domainPosition > scale.domain().length) {
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

    // still need to handle ordinal stacking

    return tipData;

  }

  xVal = scale.invert(cursorVal);

  if (obj.options.stacked) {
    var data = obj.data.stackedData;
    var i$1 = bisectData(data, xVal, obj.options.stacked, obj.data.keys[0]);

    var arr = [];
    var refIndex;

    for (var k = 0; k < data.length; k++) {
      if (refIndex) {
        arr.push(data[k][refIndex]);
      } else {
        var d0 = data[k][i$1[k] - 1],
          d1 = data[k][i$1[k]];
        refIndex = xVal - d0.x > d1.x - xVal ? i$1[k] : (i$1[k] - 1);
        arr.push(data[k][refIndex]);
      }
    }

    tipData = arr;

  } else {
    var data$1 = obj.data.data,
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

  if (tipNodes.tipBox) {
    tipNodes.tipBox.classed(((obj.prefix) + "active"), true);
  }

  if (tipNodes.tipPathCircles) {
    tipNodes.tipPathCircles.classed(((obj.prefix) + "active"), true);
  }

}

function hideTips(tipNodes, obj) {

  if (obj.options.type === 'column' || obj.options.type === 'bar') {
    obj.rendered.plot.seriesGroup.selectAll(("." + (obj.prefix) + "muted"))
      .classed(((obj.prefix) + "muted"), false);
  }

  if (tipNodes.xTipLine) {
    tipNodes.xTipLine.classed(((obj.prefix) + "active"), false);
  }

  if (tipNodes.tipBox) {
    tipNodes.tipBox.classed(((obj.prefix) + "active"), false);
  }

  if (tipNodes.tipPathCircles) {
    tipNodes.tipPathCircles.classed(((obj.prefix) + "active"), false);
  }

}

function mouseIdle(tipNodes, obj) {
  return setTimeout(function () {
    hideTips(tipNodes, obj);
  }, obj.tipTimeout);
}

var timeout$2;

function tipsManager(node, obj) {

  var tipNodes = appendTipGroup(node, obj);

  var fns = {
    line: lineChartTips,
    multiline: lineChartTips,
    area: obj.options.stacked ? stackedAreaChartTips : areaChartTips,
    column: obj.options.stacked ? stackedColumnChartTips : columnChartTips,
    bar: obj.options.stacked ? stackedBarChartTips : barChartTips
  };

  var dataReference;

  if (obj.options.type === 'multiline') {
    dataReference = [obj.data.data[0].series[0]];
  } else {
    dataReference = obj.data.data[0].series;
  }

  var innerTipElements = appendTipElements(node, obj, tipNodes, dataReference);

  switch (obj.options.type) {
    case 'line':
    case 'multiline':
    case 'area':
    case 'column':
    case 'bar':
      tipNodes.overlay = tipNodes.tipNode.append('rect')
        .attrs({
          'class': ((obj.prefix) + "tip_overlay"),
          'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)"),
          'width': obj.dimensions.tickWidth(),
          'height': obj.dimensions.computedHeight()
        });

      tipNodes.overlay
        .on('mouseover', function () { showTips(tipNodes, obj); })
        .on('mouseout', function () { hideTips(tipNodes, obj); })
        .on('mousemove', function () {
          showTips(tipNodes, obj);
          clearTimeout(timeout$2);
          timeout$2 = mouseIdle(tipNodes, obj);
          return fns[obj.options.type](tipNodes, innerTipElements, obj);
        });

      break;
  }

}

function appendTipGroup(node, obj) {

  var svgNode = select(node.node().parentNode),
    chartNode = select(node.node().parentNode.parentNode);

  var tipNode = svgNode.append('g')
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

  var tipBox = tipNode.append('g')
    .attrs({
      'class': ((obj.prefix) + "tip_box"),
      'transform': ("translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)")
    });

  var tipRect = tipBox.append('rect')
    .attrs({
      'class': ((obj.prefix) + "tip_rect"),
      'transform': 'translate(0,0)',
      'width': 1,
      'height': 1
    });

  var tipGroup = tipBox.append('g')
    .attr('class', ((obj.prefix) + "tip_group"));

  var legendIcon = chartNode.select(("." + (obj.prefix) + "legend_item_icon")).node();

  var radius = legendIcon ? legendIcon.getBoundingClientRect().width / 2 : 0;

  var tipPathCircles = tipNode.append('g')
    .attr('class', ((obj.prefix) + "tip_path-circle-group"));

  var tipTextDate = tipGroup
    .insert('g', ':first-child')
    .attr('class', ((obj.prefix) + "tip_text-date-group"))
    .append('text')
    .attrs({
      'class': ((obj.prefix) + "tip_text-date"),
      'x': 0,
      'y': 0,
      'dy': '1em'
    });

  return {
    svg: svgNode,
    tipNode: tipNode,
    xTipLine: xTipLine,
    tipBox: tipBox,
    tipRect: tipRect,
    tipGroup: tipGroup,
    legendIcon: legendIcon,
    tipPathCircles: tipPathCircles,
    radius: radius,
    tipTextDate: tipTextDate
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

  tipNodes.tipPathCircles.selectAll('circle')
    .data(dataRef).enter()
    .append('circle')
    .attrs({
      'class': function (d, i) {
        return ((obj.prefix) + "tip_path-circle " + (obj.prefix) + "tip_path-circle-" + i);
      },
      'r': tipRadius
    });

  return tipTextGroups;

}

function lineChartTips(tipNodes, innerTipEls, obj) {

  var cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  var isUndefined = 0;

  for (var i = 0; i < tipData.series.length; i++) {
    if (tipData.series[i].val === '__undefined__') {
      isUndefined++;
      break;
    }
  }

  if (!isUndefined) {
    var domain = obj.rendered.plot.xScaleObj.scale.domain(),
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);
    tipNodes.tipGroup.selectAll(("." + (obj.prefix) + "tip_text-group text"))
      .data(tipData.series)
      .text(function (d) {
        if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
        if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
        if (d.val) {
          return obj.yAxis.prefix + setTickFormatY(obj.yAxis.format, d.val) + obj.yAxis.suffix;
        } else {
          return 'n/a';
        }
      });

    var bandwidth = 0;

    if (obj.rendered.plot.xScaleObj.obj.type !== 'ordinal') {
      tipNodes.tipTextDate
        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
    } else {
      tipNodes.tipTextDate
        .text(tipData.key);
      bandwidth = obj.rendered.plot.xScaleObj.scale.bandwidth();
    }

    tipNodes.tipGroup
      .selectAll(("." + (obj.prefix) + "tip_text-group"))
      .data(tipData.series)
      .classed(((obj.prefix) + "active"), function (d) { return d.val ? true : false; });

    tipNodes.tipGroup
      .attr('transform', function () {
        var x;
        if (cursor.x > obj.dimensions.tickWidth() / 2) {
          // tipbox pointing left
          x = obj.dimensions.tipPadding.left;
        } else {
          // tipbox pointing right
          x = obj.dimensions.tipPadding.right;
        }
        return ("translate(" + x + "," + (obj.dimensions.tipPadding.top) + ")");
      });

    tipNodes.tipPathCircles
      .selectAll(("." + (obj.prefix) + "tip_path-circle"))
        .data(tipData.series)
        .classed(((obj.prefix) + "active"), function (d) { return d.val ? true : false; })
        .attrs({
          'cx': obj.rendered.plot.xScaleObj.scale(tipData.key) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2),
          'cy': function (d) {
            if (d.val) { return obj.rendered.plot.yScaleObj.scale(d.val); }
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

}

function areaChartTips(tipNodes, innerTipEls, obj) {
  // area tips implementation is currently
  // *exactly* the same as line tips, so…
  lineChartTips(tipNodes, innerTipEls, obj);
}

function stackedAreaChartTips(tipNodes, innerTipEls, obj) {

  var cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  var isUndefined = 0;

  for (var i = 0; i < tipData.length; i++) {
    if (tipData[i].val === '__undefined__') {
      isUndefined++;
      break;
    }
  }

  if (!isUndefined) {

    var domain = obj.rendered.plot.xScaleObj.scale.domain(),
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);

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
          if (d.val) {
            return obj.yAxis.prefix + setTickFormatY(obj.yAxis.format, d.val) + obj.yAxis.suffix;
          } else {
            return 'n/a';
          }
        } else {
          var text;
          for (var k = 0; k < tipData.length; k++) {
            if (i === 0) {
              if (!isNaN(d[0] + d[1])) {
                text = obj.yAxis.prefix + setTickFormatY(obj.yAxis.format, d.data[obj.data.keys[i + 1]]) + obj.yAxis.suffix;
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
                text = obj.yAxis.prefix + setTickFormatY(obj.yAxis.format, d.data[obj.data.keys[i + 1]]) + obj.yAxis.suffix;
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
      tipNodes.tipTextDate
        .call(tipDateFormatter, ctx, obj.monthsAbr, tipData[0].data[obj.data.keys[0]]);
    } else {
      tipNodes.tipTextDate
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
        var x;
        if (cursor.x > obj.dimensions.tickWidth() / 2) {
          // tipbox pointing left
          x = obj.dimensions.tipPadding.left;
        } else {
          // tipbox pointing right
          x = obj.dimensions.tipPadding.right;
        }
        return ("translate(" + x + "," + (obj.dimensions.tipPadding.top) + ")");
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
            if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
              xData = tipData.key;
            } else {
              xData = d.data[obj.data.keys[0]];
            }
            return obj.rendered.plot.xScaleObj.scale(xData) + obj.dimensions.labelWidth + obj.dimensions.yAxisPaddingRight + (bandwidth / 2);
          },
          'cy': function (d) {
            var yData;
            if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
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

    if (obj.rendered.plot.xScaleObj.obj.type === 'ordinal') {
      xPos = tipData.key;
    } else {
      xPos = tipData[0].data[obj.data.keys[0]];
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

}

function columnChartTips(tipNodes, innerTipEls, obj) {

  var cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.selectAll(("." + (obj.prefix) + "tip_text-group text"))
    .data(tipData.series)
    .text(function (d) {
      if (!obj.yAxis.prefix) { obj.yAxis.prefix = ''; }
      if (!obj.yAxis.suffix) { obj.yAxis.suffix = ''; }
      if (d.val) {
        return obj.yAxis.prefix + setTickFormatY(obj.yAxis.format, d.val) + obj.yAxis.suffix;
      } else {
        return 'n/a';
      }
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
    tipNodes.tipTextDate.text(tipData.key);
  } else {
    var domain = obj.rendered.plot.xScaleObj.scale.domain(),
      ctx = timeDiff(domain[0], domain[domain.length - 1], 8);

    tipNodes.tipTextDate
    .call(tipDateFormatter, ctx, obj.monthsAbr, tipData.key);
  }

  tipNodes.tipGroup
    .attr('transform', function () {
      var x;
      if (cursor.x > obj.dimensions.tickWidth() / 2) {
        // tipbox pointing left
        x = obj.dimensions.tipPadding.left;
      } else {
        // tipbox pointing right
        x = obj.dimensions.tipPadding.right;
      }
      return ("translate(" + x + "," + (obj.dimensions.tipPadding.top) + ")");
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

function stackedColumnChartTips(tipNodes, innerTipEls, obj) {
  // stacked column tips implementation is the same
  // as column tips except for one line, so…
  columnChartTips(tipNodes, innerTipEls, obj);
}

function barChartTips(tipNodes, innerTipEls, obj) {

  var cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.style('display', 'none');

  obj.rendered.plot.seriesGroup.selectAll('rect')
    .classed(((obj.prefix) + "muted"), true);

  obj.rendered.plot.seriesGroup.selectAll(("." + (obj.prefix) + "bar-label"))
    .classed(((obj.prefix) + "muted"), true);

  obj.rendered.plot.seriesGroup.selectAll(("[data-key=\"" + (tipData.key) + "\"] rect"))
    .classed(((obj.prefix) + "muted"), false);

  obj.rendered.plot.seriesGroup.selectAll(("[data-key=\"" + (tipData.key) + "\"] ." + (obj.prefix) + "bar-label"))
    .classed(((obj.prefix) + "muted"), false);

}

function stackedBarChartTips(tipNodes, innerTipEls, obj) {

  var cursor = cursorPos(tipNodes.overlay),
    tipData = getTipData(obj, cursor);

  tipNodes.tipGroup.style('display', 'none');

  obj.rendered.plot.seriesGroup.selectAll('rect')
    .classed(((obj.prefix) + "muted"), true);

  obj.rendered.plot.seriesGroup.selectAll(("." + (obj.prefix) + "bar-label"))
    .classed(((obj.prefix) + "muted"), true);

  obj.rendered.plot.seriesGroup.selectAll(("[data-key=\"" + (tipData.key) + "\"]"))
    .classed(((obj.prefix) + "muted"), false);

  obj.rendered.plot.seriesGroup.selectAll(("[data-legend=\"" + (tipData.key) + "\"]"))
    .classed(((obj.prefix) + "muted"), false);


}

function tipDateFormatter(selection$$1, ctx, months, data) {

  var dMonth,
    dDate,
    dYear,
    dHour,
    dMinute;

  selection$$1.text(function () {
    var d = data;
    var dStr;
    switch (ctx) {
      case 'years':
        dStr = d.getFullYear();
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

  });

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
function custom$1(node, chartRecipe, rendered) {

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

  if (this.recipe.options.head) {
    rendered.header = header(container, this.recipe);
  }

  if (this.recipe.options.footer) {
    rendered.footer = footer(container, this.recipe);
  }

  var node = base(container, this.recipe);

  rendered.container = node;

  rendered.plot = plot(node, this.recipe);

  if (this.recipe.options.qualifier) {
    rendered.qualifier = qualifier(node, this.recipe);
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
    rendered.custom = custom$1(node, this.recipe, rendered);
  }

};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding
var aFunction = _aFunction;
var _ctx = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var isObject$1 = _isObject;
var document$1 = _global.document;
var is = isObject$1(document$1) && isObject$1(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!isObject$2(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject       = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive    = _toPrimitive;
var dP$1             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP$1(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var dP         = _objectDp;
var createDesc = _propertyDesc;
var _hide = _descriptors ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var global$1    = _global;
var core      = _core;
var ctx       = _ctx;
var hide      = _hide;
var PROTOTYPE = 'prototype';

var $export$1 = function(type, name, source){
  var IS_FORCED = type & $export$1.F
    , IS_GLOBAL = type & $export$1.G
    , IS_STATIC = type & $export$1.S
    , IS_PROTO  = type & $export$1.P
    , IS_BIND   = type & $export$1.B
    , IS_WRAP   = type & $export$1.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] : (global$1[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global$1)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export$1.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export$1.F = 1;   // forced
$export$1.G = 2;   // global
$export$1.S = 4;   // static
$export$1.P = 8;   // proto
$export$1.B = 16;  // bind
$export$1.W = 32;  // wrap
$export$1.U = 64;  // safe
$export$1.R = 128; // real proto method for `library` 
var _export = $export$1;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var toString = {}.toString;

var _cof = function(it){
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _cof;
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject$1 = _iobject;
var defined = _defined;
var _toIobject = function(it){
  return IObject$1(defined(it));
};

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength
var toInteger = _toInteger;
var min$1       = Math.min;
var _toLength = function(it){
  return it > 0 ? min$1(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var toInteger$1 = _toInteger;
var max$1       = Math.max;
var min$2       = Math.min;
var _toIndex = function(index, length){
  index = toInteger$1(index);
  return index < 0 ? max$1(index + length, 0) : min$2(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes
var toIObject$1 = _toIobject;
var toLength  = _toLength;
var toIndex   = _toIndex;
var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject$1($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var global$2 = _global;
var SHARED = '__core-js_shared__';
var store  = global$2[SHARED] || (global$2[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id$1 = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px).toString(36));
};

var shared = _shared('keys');
var uid    = _uid;
var _sharedKey = function(key){
  return shared[key] || (shared[key] = uid(key));
};

var has          = _has;
var toIObject    = _toIobject;
var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = _objectKeysInternal;
var enumBugKeys = _enumBugKeys;

var _objectKeys = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
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
var defined$1 = _defined;
var _toObject = function(it){
  return Object(defined$1(it));
};

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = _objectKeys;
var gOPS     = _objectGops;
var pIE      = _objectPie;
var toObject = _toObject;
var IObject  = _iobject;
var $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)
var $export = _export;

$export($export.S + $export.F, 'Object', {assign: _objectAssign});

var this$1 = undefined;
var index = (function (root) {

  'use strict';

  var Meteor = this$1 && this$1.Meteor || {},
    isServer = Meteor.isServer || undefined;

  if (!isServer) {

    if (root) {

      var ChartTool = (function ChartTool() {

        var charts = [];

        var dispatchFunctions, drawn = [];

        var dispatcher = dispatch('start', 'finish', 'redraw', 'mouseOver', 'mouseMove', 'mouseOut', 'click');

        function createChart(cont, chart, callback) {
          var this$1 = this;


          dispatcher.call('start', this, chart);

          if (chart.data.chart.drawStart) { chart.data.chart.drawStart(); }

          drawn = clearDrawn(drawn, chart);

          var obj = clearObj(chart);

          var container = clearChart(cont);

          obj.data.width = getBounding(container, 'width');
          obj.dispatch = dispatcher;

          var chartObj;

          if (svgTest(root)) {
            chartObj = new ChartManager(container, obj);
          } else {
            generateThumb(container, obj);
          }

          drawn.push({ id: obj.id, chartObj: chartObj });

          obj.chartObj = chartObj;

          select(container)
            .on('click', function () { return dispatcher.call('click', this$1, chartObj); })
            .on('mouseover', function () { return dispatcher.call('mouseOver', this$1, chartObj); })
            .on('mousemove', function () { return dispatcher.call('mouseMove', this$1, chartObj); })
            .on('mouseout', function () { return dispatcher.call('mouseOut', this$1, chartObj); });

          dispatcher.call('finish', this, chartObj);
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
          var container, obj;
          for (var i = 0; i < charts.length; i++) {
            if (charts[i].id === id) {
              obj = charts[i];
            }
          }
          container = "." + (chartSettings.baseClass) + "[data-chartid=" + (obj.id) + "]";
          clearDrawn(drawn, obj);
          clearObj(obj);
          clearChart(container);
        }

        function createLoop() {
          if (root.ChartTool.length) {
            for (var i = 0; i < root.ChartTool.length; i++) {
              charts.push(root.ChartTool[i]);
              var container = "." + (chartSettings.baseClass) + "[data-chartid=" + (root.ChartTool[i].id) + "]";
              createChart(container, root.ChartTool[i]);
            }
          }
        }

        function initializer() {
          dispatchFunctions = root.__charttooldispatcher || [];
          for (var prop in dispatchFunctions) {
            if (dispatchFunctions.hasOwnProperty(prop)) {
              if (Object.keys(dispatcher._).indexOf(prop) > -1) {
                dispatcher.on(prop, dispatchFunctions[prop]);
              } else {
                console.log(("Chart Tool does not offer a dispatcher of type " + prop + ". For available dispatcher types, please see the ChartTool.dispatch() method."));
              }
            }
          }
          var debouncer = debounce$1(createLoop, charts, chartSettings.debounce, root);
          select(root)
            .on(("resize." + (chartSettings.prefix) + "debounce"), debouncer)
            .on(("resize." + (chartSettings.prefix) + "redraw"), dispatcher.call('redraw', this, charts));
          if (root.ChartTool) { createLoop(); }
        }

        return {
          init: function() {
            if (!this.initialized) {
              initializer();
              this.initialized = true;
            }
          },
          create: function (container, obj, cb) {
            return createChart(container, obj, cb);
          },
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

      if (!root.Meteor) { ChartTool.init(); }
      root.ChartTool = ChartTool;

    }

  }

})(typeof window !== 'undefined' ? window : undefined);

return index;

}());
//# sourceMappingURL=chart-tool.js.map
