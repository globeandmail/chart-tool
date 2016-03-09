# Chart Tool's front end API

Chart Tool's front end library binds itself to the window and exposes a basic API that can be used to add, remove, update or manipulate charts. 

----------
   
### Methods

All methods are bound to the `ChartTool` object, which is itself bound to the `window`.

#### `init()`

Automatically runs when the library first loads. `init` will look for all embed codes already on the page and use them to draw charts.


#### `create(container, obj)`

Given a container and Chart Tool embed code, the library will create a new chart.


#### `read(id)`

Reads data for any chart with a given `id`.


#### `list()`

Lists all charts currently on the page.


#### `update(id, obj)`

Redraw a chart based on its `id`.


#### `destroy(id)`

Destroy and remove a chart based on its `id`.


#### `dispatch()`

Lists all available `d3.dispatch` functions.


#### `wat()`

Returns some general information about the Chart Tool library.



### Custom events

Chart Tool also fires a series of custom events using [d3.dispatch](https://github.com/mbostock/d3/wiki/Internals#d3_dispatch). 

To use the `dispatch` events, place a `<script>` tag **before** both `d3` and the Chart Tool library have been loaded, then hook into the dispatcher functions by adding your behaviour to a `__charttooldispatcher` object bound to the window. We recommend using closures to ensure that your dispatcher functions don't pollute the global scope.

For example:

```html
<script type="text/javascript">
  (function(root) {
    root.__charttooldispatcher = root.__charttooldispatcher || {};
    var dispatcher = root.__charttooldispatcher;
    dispatcher.start = function(d) {
      console.log("Chart starts being drawn");
    };
    dispatcher.finish = function(d) {
      console.log("Chart of id " + d.id + " is finished drawing!");
    };
  })(this);
</script>

<script src="d3.min.js"></script>
<script src="bundle.min.js"></script>
```

When the Chart Tool library loads, it'll find the dispatcher functions under `window.__charttooldispatcher` and fire those functions at the appropriate time. These dispatcher events are useful for changing aspects of your chart before or after it's already been drawn. As an example, the bar labels on [this chart](http://www.theglobeandmail.com/report-on-business/economy/currencies/how-148-currencies-fared-against-the-loonie-in-2015/article27994400/) are drawn using a `dispatcher.finish` hook.

Available dispatcher events include:


#### `start`

The `start` event fires when a chart is first being drawn, and returns the object being used to draw the chart.


#### `finish`

The `finish` event fires when Chart Tool finishes drawing a chart, and returns the final rendered chart object, including references to parsed data, graph nodes, and so on.


#### `redraw`

The `redraw` event fires when the window is resized, and returns a list of all charts on the page.


#### `mouseOver`

The 'mouseOver' event fires on any `mouseover` event on the chart container, and returns a reference to the container and the rendered chart object.


#### `mouseMove`

The 'mouseMove' event fires on any `mousemove` event on the chart container, and returns a reference to the container and the rendered chart object.


#### `mouseOut`

The 'mouseOut' event fires on any `mouseout` event on the chart container, and returns a reference to the container and the rendered chart object.


#### `click`

The 'click' event fires on any `click` event on the chart container, and returns a reference to the container and the rendered chart object.
