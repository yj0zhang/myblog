/*
 * We have Web Inspectors (Firebug, Developer Tools, Dragonfly etc)
 * We have WebGL Inspector
 * Shouldn't we have a Three.js Inspector
 *
 * Want to know how to use this? Visit http://zz85.github.com/zz85-bookmarklets/
 *
 * @author zz85 github.com/zz85 | www.lab4games.net/zz85/blog | twitter.com/blurspline
 */

// javascript:(function(){var script=document.createElement('script');script.type='text/javascript';script.src='js/ThreeInspector.js';document.body.appendChild(script);})()

/*
 * Features + CHANGE LIST HISTORY:
 *	widget - draggable, snappable, resizable
 *	introspecting scene
 *	auto/guess names
 *	closure
 *	prevent select
 * 	close / minimize widget
 *	improvements to interface and layout
 *	("smart" expansion + debug to console ++)
 *	Updating of values into scene graph, YEAH!
 *	Scrubber interface for changing values!!
 *	X-axis scrubber for big value changes!
 *	Disabled x-axis for some usabiltiy - maybe use a keyboard shortcut?
 *	added toggle autorefresh values
 *	added maxwait of 10 seconds
 *	Title typo correction by @mrdoob
 *	Add rescan Scenes
 *	Open inspector in new window - however css bugs in webkit!
 *	add link for feature requests
 *	When dragging to scrub values, hold Shift for large changes, and Ctrl for small changes
 *	remove from scene.
 *	Added light colors and intensity
 *	Simple properties pane
 *	Visibility checkbox
 *	Draggable Controls
 *  Detect Cameras
 *  Basic Material Uniforms Inspector
 *	Object Dump Inspector
 *  Shadow Dom support for compartmentalizing styling
 *	color picker for lights, materials
 *
 *	TODO
 *	- poll/bind add/remove changes?
 * 	- Stats: geometry / faces / vertices count
 *	- integrate gui.js + director.js + timeliner.js + rstats.js?
 *	- create interactive examples for three.js
 *	- use css for collapsing and expanding divs?
 *	- materials editor
 *	- geometry editor
 *	- shape editor
 *	- mouse wheel? / runner? / Shift on document?
 *	- rescan without reloading...
 *  - npm module
 *  - more types eg. slider / booleans
 *  - texture inspector
 *  - checkboxes and slider types.
 */

(function () {
  var SCOPE = self; // self this window
  // console.log('scope', SCOPE);

  var autoUpdateDiv;
  var targetDom;
  var allInspectedObjectReferences = [];
  var allInspectedMaterialReferences = [];

  var materialsToInspect = [];
  var materialNamesToInspect = [];

  function getPropertiesPane() {
    if (ThreeInspector.sidePane && !ThreeInspector.sidePane.isClosed) {
      return ThreeInspector.sidePane;
    }

    ThreeInspector.sidePane = new Widget(
      "Properties",
      "threePropertiesPane",
      targetDom
    );
    ThreeInspector.sidePane.setSize(window.innerWidth - 480, 264);
    ThreeInspector.sidePane.setPosition(
      450,
      window.innerHeight - ThreeInspectorWidget.div.clientHeight
    );
    return ThreeInspector.sidePane;
  }

  function scanWindow() {
    if (typeof THREE == "undefined") {
      ThreeInspectorWidget.setStatus("Three.js not found.");
      ThreeInspectorWidget.add("Three.js not found.");
      return false;
    }

    var sceneGraph;

    var sceneNames = []; // variable names
    var sceneReferences = []; // pointers to object

    var aScene, children;

    var divNewWindow = document.createElement("span");
    divNewWindow.innerHTML = "<a>Open in New Window</a> ";
    divNewWindow.onclick = function () {
      ThreeInspector.newWindow = true;
      ThreeInspector.start();
    };

    ThreeInspectorWidget.contents.appendChild(divNewWindow);

    var divRequests = document.createElement("span");
    divRequests.innerHTML =
      '| <a href="https://github.com/zz85/zz85-bookmarklets/issues" target="_blank">Feature requests</a><br/>';

    ThreeInspectorWidget.contents.appendChild(divRequests);

    autoUpdateDiv = document.createElement("span");
    autoUpdateDiv.innerHTML =
      'Auto-Refresh Values: <a class="threeInspectorChildrenBubble">OFF</a>. ';
    autoUpdateDiv.onclick = autoRefresh;

    ThreeInspectorWidget.contents.appendChild(autoUpdateDiv);

    var divRescan = document.createElement("span");
    divRescan.innerHTML = "| <a>Rescan All Scenes</a><br/>";
    divRescan.onclick = ThreeInspector.start;

    ThreeInspectorWidget.contents.appendChild(divRescan);

    var divDraggable = document.createElement("span");
    divDraggable.innerHTML = "<a> *new* Enable Draggable Objects</a><br/>";
    divDraggable.onclick = function () {
      if (THREE.DragControls) {
        new THREE.DragControls(camera, scene, renderer.domElement);
      } else {
        var script = document.createElement("script");

        script.type = "text/javascript";
        script.src =
          "https://cdn.rawgit.com/zz85/ThreeLabs/master/DragControls.js";
        document.body.appendChild(script);
        script.onload = function () {
          var dragcontrols = new THREE.DragControls(
            camera,
            scene,
            renderer.domElement
          );
        };
      }
    };

    ThreeInspectorWidget.contents.appendChild(divDraggable);

    var others = 0;
    for (var w in SCOPE) {
      var anItem = SCOPE[w];
      if (
        anItem instanceof THREE.Camera &&
        allInspectedObjectReferences.indexOf(anItem) === -1
      ) {
        addInspectChild(anItem, ThreeInspectorWidget.contents, w); // others
        others++;
      }

      if (anItem instanceof THREE.Material) {
        materialsToInspect.push(anItem);
        materialNamesToInspect.push(w);
      }
    }

    // Start searching for scopes
    for (var w in SCOPE) {
      aScene = SCOPE[w];
      if (aScene instanceof THREE.Scene) {
        sceneNames.push(w);
        sceneReferences.push(aScene);
        children = aScene.children;

        var ul = document.createElement("ul");
        ul.innerHTML =
          ' &lt;THREE.Scene&gt; <span class="threeInspectorChildrenBubble">' +
          children.length +
          "</span> children";

        if (aScene.fog)
          ul.appendChild(createColorLineItem("fog", aScene.fog.color));

        var expander = document.createElement("a");
        expander.innerHTML = "+ <b>" + w + "</b>";
        expander.onclick = expandScene(ul, aScene, w);
        ul.insertBefore(expander, ul.firstChild);

        var debug = document.createElement("a");
        debug.innerHTML = " &#191; ";
        debug.onclick = debugObject(aScene);
        ul.appendChild(debug);

        // Expand automatically
        if (children.length < 300) {
          expander.onclick();
        }

        ThreeInspectorWidget.contents.appendChild(ul);
      }
    }

    // ThreeInspectorWidget.setStatus(sceneNames.length + ' three.js scenes found.');

    materialsToInspect.forEach(function (material, i) {
      if (allInspectedMaterialReferences.indexOf(material) > -1) return;

      allInspectedMaterialReferences.push(material);
      addInspectChild(material, ThreeInspectorWidget.contents, "material " + i);
      others++;
    });
  }

  // Function callbacks

  function debugObject(obj) {
    return function () {
      console.log(obj);
    };
  }

  var watchBindings = [];
  var autoRefreshing;

  function registerBindings(target, property, view) {
    watchBindings.push({ target: target, property: property, view: view });
  }

  function refreshValues() {
    var c = 0,
      start = Date.now();

    // console.log('refresh!');

    var target, property, view, subscription, value;
    for (var i = 0, il = watchBindings.length; i < il; i++) {
      subscription = watchBindings[i];
      target = subscription.target;
      property = subscription.property;
      view = subscription.view;

      value = target[property];

      if (value != view.value) {
        view.value = value;
        // c++;
      }
    }
    // console.log('refreshed!',c, Date.now() - start);
  }

  function autoRefresh() {
    if (autoRefreshing) {
      clearInterval(autoRefreshing);
      autoRefreshing = null;
      autoUpdateDiv.innerHTML =
        'Auto-Refresh Values: <a class="threeInspectorChildrenBubble">OFF</a> ';
    } else {
      autoRefreshing = setInterval(refreshValues, 300);
      autoUpdateDiv.innerHTML =
        'Auto-Refresh Values: <a class="threeInspectorChildrenBubble">ON</a> ';
    }
  }

  function expandScene(ul, scene, w) {
    return function () {
      if (!ul._inspected) {
        // load children
        inspectChildren(scene, ul, w);
        return;
      }

      var tags = ul.getElementsByTagName("li");

      if (!ul._collapsed) {
        for (var i = 0, il = tags.length; i < il; i++) {
          tags[i].style.display = "none";
        }

        ul._collapsed = true;
      } else {
        for (var i = 0, il = tags.length; i < il; i++) {
          tags[i].style.display = "block";
        }

        ul._collapsed = false;
      }
    };
  }

  function updateNameCallback(nameField, target) {
    return function () {
      target.name = nameField.value;
    };
  }

  function valueChangeCallback(target, property, view, optional_callback) {
    return function (e) {
      // console.log('value changed!',e, target);
      target[property] = parseFloat(view.value);
      if (optional_callback) optional_callback(target[property]);
    };
  }

  function createCheckbox(object, property) {
    var valueField = document.createElement("input");
    valueField.type = "checkbox";
    valueField.checked = object[property];

    valueField.onchange = function (e) {
      object[property] = valueField.checked;
    };

    return valueField;
  }

  function createField(object, property, optional_callback) {
    var valueField = document.createElement("input");
    valueField.className = "threeInspectorValueField";
    valueField.type = "text";
    valueField.value = object[property];

    valueField.onchange = valueChangeCallback(
      object,
      property,
      valueField,
      optional_callback
    );

    registerBindings(object, property, valueField);

    var y, x;
    var downY, downX, downValue, number;

    var defaultMultiplier = 0.1;
    var multiplierY = defaultMultiplier;
    var multiplierX = 0.01;

    function onMouseDown(event) {
      event.stopImmediatePropagation();

      y = event.clientY;
      x = event.clientX;
      downY = y;
      downX = x;
      downValue = parseFloat(valueField.value);

      targetDom.addEventListener("mousemove", onMouseMove, false);
      targetDom.addEventListener("mouseup", onMouseUp, false);
      targetDom.addEventListener("keydown", onDocumentKeyDown, false);
      targetDom.addEventListener("keyup", onDocumentKeyUp, false);
      return false;
    }

    function onDocumentKeyDown(event) {
      switch (event.keyCode) {
        case 16:
          // shift
          multiplierY = 10;
          break;
        case 17:
          // control
          multiplierY = 0.01;
          break;
        case 18:
          // Alt
          break;
        case 91:
          // Cmd
          break;
      }
    }

    function onDocumentKeyUp(event) {
      switch (event.keyCode) {
        case 16:
          // shift
          multiplierY = defaultMultiplier;
          break;
        case 17:
          // control
          multiplierY = defaultMultiplier;
          break;
        case 18:
          // Alt
          multiplierY = defaultMultiplier;
          break;
        case 91:
          // Cmd
          break;
      }
    }

    function onMouseMove(event) {
      y = event.clientY;
      x = event.clientX;

      number = downValue - (y - downY) * multiplierY;

      valueField.value = number;
      valueField.onchange();
    }

    function onMouseUp(event) {
      targetDom.removeEventListener("mousemove", onMouseMove, false);
      targetDom.removeEventListener("mouseup", onMouseUp, false);
      targetDom.removeEventListener("keydown", onDocumentKeyDown, false);
      targetDom.removeEventListener("keyup", onDocumentKeyUp, false);

      onMouseMove(event);
      // valueField.focus();
      valueField.select();
      multiplierY = defaultMultiplier;
    }

    valueField.addEventListener("mousedown", onMouseDown, false);

    return valueField;
  }

  function inspectChildren(scene, dom) {
    var i, il;
    var maxWait = 10 * 1000; // 10 seconds wait

    var children = scene.children,
      child;

    var startTime = Date.now();

    if (!dom._lastInspected) {
      dom._lastInspected = 0;
    }

    for (i = dom._lastInspected, il = children.length; i < il; i++) {
      if (Date.now() - startTime > maxWait) {
        // We break out of loops if the wait is too long for ultra long lists.
        dom._lastInspected = i;
        ThreeInspectorWidget.setStatus("Time out loading children...");
        // Then again, probably we should only "inspect" items being clicked on for best performance
        return;
      }

      child = children[i];
      addInspectChild(child, dom, i);
    }

    dom._inspected = true;
    ThreeInspectorWidget.setStatus("");
  }

  //
  // dom helper
  //
  function createLineItem(name, children) {
    var d = document.createElement("li");
    var padding = 15 - Math.min(15, name.length);
    d.innerHTML = name + ":" + new Array(padding).join("&nbsp");

    if (arguments.length > 1) {
      for (var a = 1; a < arguments.length; a++) {
        d.appendChild(arguments[a]);
      }
    }

    return d;
  }

  function colorPicker(color, r, g, b) {
    // TODO add watch bindings for color picker
    // registerBindings(object, property, valueField);

    var picker = document.createElement("input");
    picker.type = "color";

    picker.onchange = function (e) {
      color.setStyle(this.value);
      r.value = color.r;
      g.value = color.g;
      b.value = color.b;
    };

    return picker;
  }

  function createColorLineItem(name, color) {
    var d = createLineItem(name);

    var r, g, b, picker;

    r = createField(color, "r", colorChanged);
    g = createField(color, "g", colorChanged);
    b = createField(color, "b", colorChanged);
    picker = colorPicker(color, r, g, b);

    function colorChanged() {
      picker.value = "#" + color.getHexString();
    }

    d.appendChild(r);
    d.appendChild(g);
    d.appendChild(b);
    d.appendChild(picker);

    colorChanged();

    return d;
  }

  function addInspectChild(child, dom, i) {
    var zlass,
      subclass = [];

    for (var t in THREE) {
      if (child.constructor === THREE[t]) {
        zlass = "THREE." + t;
      }

      if (typeof THREE[t] == "function" && child instanceof THREE[t]) {
        subclass.push("THREE." + t);
      }
    }

    if (!zlass) {
      if (subclass.length > 0) zlass = subclass[subclass.length - 1];
      else zlass = "unknown type";
    }

    var name = child.name;
    if (!name || name == "") {
      // to scan global scope for names if not found?
      for (var w in SCOPE) {
        if (SCOPE[w] == child) {
          name = w;
          break;
        }
      }

      // Perhaps we could use the auto generated ID as name
      if (!name || name == "") {
        name = "id_" + child.id;
      }

      if (materialsToInspect.indexOf(child) > -1) {
        name = materialNamesToInspect[materialsToInspect.indexOf(child)];
      }

      child.name = name;
    }

    var nameField = document.createElement("input");
    nameField.className = "threeInspectorNameField";
    nameField.type = "text";
    nameField.value = name;

    nameField.onchange = updateNameCallback(nameField, child);

    var li = document.createElement("li");
    li.innerHTML = " &lt;" + zlass + "&gt;";
    li.className = "threeInspectorSceneObject";

    var indexText = document.createTextNode(i + ": ");
    li.insertBefore(nameField, li.firstChild);
    li.insertBefore(indexText, li.firstChild);
    // li.appendChild(nameField);

    var debug = document.createElement("a");
    debug.innerHTML = " &#191; ";
    debug.onclick = debugObject(child);
    li.appendChild(debug);

    var viewproperties = document.createElement("a");
    viewproperties.innerHTML = " <i>[more]</i> ";
    viewproperties.onclick = objProperties(child, zlass, subclass, child.id);
    li.appendChild(viewproperties);

    var remove = document.createElement("a");
    remove.innerHTML = " <i>[remove]</i> ";
    remove.onclick = removeObj(child);
    li.appendChild(remove);

    var objectProps = document.createElement("ul");

    // THREE.Line ParticleSystems
    var isMesh = child instanceof THREE.Mesh,
      isLight = child instanceof THREE.Light,
      isCamera = child instanceof THREE.Camera,
      isObject = child instanceof THREE.Object3D,
      isSprite = child instanceof THREE.Sprite;
    var d;

    if (isObject) {
      allInspectedObjectReferences.push(child);
    }

    if (isMesh) {
      materialsToInspect.push(child.material);
      materialNamesToInspect.push(name + ".material");
    }

    if (child instanceof THREE.Material) {
      // allInspectedMaterialReferences.push(child);
      for (var k in child) {
        var color = child[k];
        if (color instanceof THREE.Color) {
          // color, ambient, emissive
          d = createColorLineItem(k, color);
          objectProps.appendChild(d);
        }
      }

      for (var u in child.uniforms) {
        var uniform = child.uniforms[u];

        switch (uniform.type) {
          case "i":
          case "f":
            d = createLineItem(u, createField(uniform, "value"));
            objectProps.appendChild(d);
            break;
          case "c":
            d = createColorLineItem(u, uniform.value);
            objectProps.appendChild(d);
            break;
          case "v2":
            d = createLineItem(
              u,
              createField(uniform.value, "x"),
              createField(uniform.value, "y")
            );
            objectProps.appendChild(d);
            break;
          case "v3":
            d = createLineItem(
              u,
              createField(uniform.value, "x"),
              createField(uniform.value, "y"),
              createField(uniform.value, "z")
            );
            objectProps.appendChild(d);
            break;
          case "i":
            d = createLineItem(
              u,
              createField(uniform.value, "x"),
              createField(uniform.value, "y"),
              createField(uniform.value, "z")
            );
            objectProps.appendChild(d);
            break;

          // TODO
          // i, fv, fv1, v2v, mv4, t
          default:
          // console.log(uniform);
        }
      }
    }

    if (isSprite) {
      d = createLineItem("rotation", createField(child, "rotation"));
      objectProps.appendChild(d);

      d = createLineItem("rotation3d");
      d.appendChild(createField(child.rotation3d, "x"));
      d.appendChild(createField(child.rotation3d, "y"));
      d.appendChild(createField(child.rotation3d, "z"));

      objectProps.appendChild(d);
    }

    if (isCamera) {
      d = createLineItem("fov");
      d.appendChild(
        createField(child, "fov", function () {
          camera.updateProjectionMatrix();
        })
      );
      objectProps.appendChild(d);

      d = createLineItem(
        "near, far",
        createField(child, "near", function () {
          camera.updateProjectionMatrix();
        }),
        createField(child, "far", function () {
          camera.updateProjectionMatrix();
        })
      );

      objectProps.appendChild(d);
    }

    if (child.opacity !== undefined) {
      d = createLineItem("opacity");
      d.appendChild(createField(child, "opacity"));
      objectProps.appendChild(d);
    }

    if (isLight) {
      d = createColorLineItem("color", child.color);
      objectProps.appendChild(d);

      if (child.intensity) {
        d = createLineItem("intensity");
        d.appendChild(createField(child, "intensity"));
        objectProps.appendChild(d);
      }
    }

    if (isObject) {
      // Visibility

      d = createLineItem("visible");
      var checkbox = createCheckbox(child, "visible");
      d.appendChild(checkbox);
      objectProps.appendChild(d);

      // Position

      d = createLineItem("position");
      d.appendChild(createField(child.position, "x"));
      d.appendChild(createField(child.position, "y"));
      d.appendChild(createField(child.position, "z"));

      objectProps.appendChild(d);

      // Rotation

      if (!isSprite) {
        d = createLineItem("rotation");
        d.appendChild(createField(child.rotation, "x"));
        d.appendChild(createField(child.rotation, "y"));
        d.appendChild(createField(child.rotation, "z"));

        objectProps.appendChild(d);
      }

      d = createLineItem("scale");
      d.appendChild(createField(child.scale, "x"));
      d.appendChild(createField(child.scale, "y"));
      d.appendChild(createField(child.scale, "z"));

      objectProps.appendChild(d);
      // console.log('material', child.material);
    }

    ///
    // Children
    ///

    var noOfChildren = "";
    var haveChildren = child.children && child.children.length > 0;
    if (haveChildren) {
      noOfChildren =
        ' <span class="threeInspectorChildrenBubble">' +
        child.children.length +
        "</span> children";
    }

    if (haveChildren) {
      var ul = document.createElement("ul");

      var expander = document.createElement("a");
      expander.innerHTML = "+" + noOfChildren;
      expander.onclick = expandScene(ul, child, name);
      ul.appendChild(expander);

      objectProps.appendChild(ul);
    }

    li.appendChild(objectProps);
    dom.appendChild(li);
  }

  function removeObj(obj) {
    return function () {
      console.log(obj);
      obj.parent.remove(obj);
    };
  }

  function objProperties(child, zlass, subclass, id) {
    return function () {
      getPropertiesPane().add("<br/>Detected THREE Type: " + zlass + "<br/>");
      getPropertiesPane().add(
        "Detected THREE super classes: " + subclass.join(",") + "<br/>"
      );
      getPropertiesPane().add("Object ID: " + id + "<br/>");

      function checkAndAdd(property, label) {
        if (child[property] !== undefined) {
          getPropertiesPane().add(label + child[property] + "<br/>");
        }
      }

      if (child.geometry) {
        getPropertiesPane().add(
          "Geometry: Face count - " + child.geometry.faces.length + "<br/>"
        );
        getPropertiesPane().add(
          "Geometry: Vertex count - " + child.geometry.vertices.length + "<br/>"
        );
      }

      if (child instanceof THREE.Camera) {
        checkAndAdd("fov", "Camera: FOV - ");
        checkAndAdd("far", "Camera: Far - ");
        checkAndAdd("near", "Camera: Near - ");
        checkAndAdd("aspect", "Camera: Aspect - ");
      }

      if (child instanceof THREE.Light) {
        checkAndAdd("intensity", "Light: intensity - ");
        checkAndAdd("distance", "Light: distance - ");
        checkAndAdd("castShadow", "Light: castShadow - ");
        checkAndAdd("target", "Light: target - ");
      }

      if (child.material) {
        if (child.material.opacity) {
          getPropertiesPane().add(
            "Opactiy: " + child.material.opacity + "<br/>"
          );
        }

        if (child.material.transparent) {
          getPropertiesPane().add(
            "Transparency: " + child.material.transparent + "<br/>"
          );
        }
      }

      if (child.color) {
        getPropertiesPane().add(
          "Color: HEX - #" + child.color.getHex().toString(16) + "<br/>"
        );
        getPropertiesPane().add(
          "Color: RGB - " + child.color.getStyle() + "<br/>"
        );
      }
    };
  }

  // Three Inspector styles
  var styles =
    "\
	#threeInspectorWidget {\
		all:initial;\
		cursor:default;\
	}\
	#threeInspectorWidget a {\
		text-decoration: none;\
		cursor:pointer;\
	}\
	#threeInspectorWidget ul {\
		list-style: none; padding-left: 10px;\
		padding-top:0;\
	}\
	#threeInspectorWidget li {\
		padding-left: 10px;\
		padding-top:0;\
		padding-bottom: 0\
	}\
	\
	.threeInspectorChildrenBubble {\
		border-radius: 4px;\
		background-color: rgba(100, 100, 100, 0.8);\
		color: rgb(220, 220,220);\
		padding: 0 3px 0 3px;\
	}\
	.threeInspectorNameField {\
		font-weight: bold;\
		padding: 0 4px 0 4px;\
		background:transparent;\
		resize:none;\
		border: 0;\
		width: 50px;\
		border-bottom: 1px dotted #bbb;\
	}\
	.threeInspectorNameField:hover {\
		\
		border-bottom: 1px dotted grey;\
	}\
	.threeInspectorValueField {\
		border-radius: 4px;\
		background-color: rgba(100, 100, 100, 0.8);\
		color: rgb(220, 220,220);\
		padding: 0 3px 0 3px;\
		margin: 0 3px 0 3px;\
		resize:none;\
		border: 0;\
		width: 50px;\
		cursor:row-resize;\
	}\
	#threeInspectorWidget input:focus {\
		outline: none;\
	}\
	\
	#threeInspectorWidget li.threeInspectorSceneObject {\
		padding-top: 6px;\
	}\
	::-webkit-scrollbar {\
		width: 12px;  /* for vertical scrollbars */\
		height: 12px; /* for horizontal scrollbars */\
	}\
	::-webkit-scrollbar-track {\
		background: rgba(0, 0, 0, 0.1);\
	}\
	::-webkit-scrollbar-thumb {\
		background: rgba(0, 0, 0, 0.3);\
	}\
";

  // Windowing Widget experiment

  function Widget(title, id, targetDom, method) {
    var me = this;
    targetDom = targetDom === undefined ? document.body : targetDom;

    var cssCommons =
      "font-family:monospace;\
		font-size: 11.5px;\
		background-color: rgba(255,255,255,0.6);\
		color: #333;\
		text-shadow: 0px 1px 2px #ccc;";

    var cssWidget =
      "border: 1px solid rgba(100,100,100,0.5);\
		position: fixed;\
		top: 100px;\
		left: 190px;\
		z-index: 1985;";

    var cssWidgetTitle =
      "background-color: grey;\
		font-weight: bold;\
		background: linear-gradient(to bottom, #fff 0%, #ddd 100%);\
		text-align: center;\
		cursor: move;\
		padding: 2px 12px 2px 12px;";

    var cssWidgetContent =
      "padding: 2px 10px 2px 10px;\
		text-align: left;\
		overflow: auto;\
		resize: both; \
		left: 0;\
		right: 0;\
		min-width: 200px;\
		min-height: 100px;\
		width: 480px;\
		height: 260px;";

    var cssWidgetStatus =
      "position: absolute;\
		float: right;\
		background-color: #eee;\
		opacity: 0.8;\
		bottom: 0;\
		right: 30;\
		padding: 2px 15px 2px 15px;";

    var divWidget = document.createElement("div");
    targetDom.body.appendChild(divWidget);

    var divWidgetTitle = document.createElement("div");
    var divWidgetContent = document.createElement("div");
    var divWidgetStatus = document.createElement("div");

    divWidget.id = id;

    var divWidget2 = divWidget;

    if (method === "shadowDom") {
      var shadowRoot = divWidget.createShadowRoot();
      divWidget2 = shadowRoot;

      styles = styles.replace(/#threeInspectorWidget/g, function () {
        return ":host";
      });
      divWidget2.innerHTML = "<style>" + styles + "</style>";
    } else if (method === "iframe") {
      iframe = document.createElement("iframe");
      iframe.src = "about:blank";
      divWidget.appendChild(iframe);

      iframe.frameBorder = "0";
      iframe.scrolling = "no";
      iframe.marginWidth = "0";
      iframe.marginHeight = "0";
      iframe.hspace = "0";
      iframe.vspace = "0";
      iframe.allowTransparency = "true";
      iframe.contentDocument.write("<html><body></body></html>");
      iframe.contentDocument.close();
      iframe.seamless = "seamless"; // !! http://benvinegar.github.io/seamless-talk/#/39

      divWidget2 = iframe.contentDocument.body;
      var style = document.createElement("style");
      style.innerHTML = styles.replace(/#threeInspectorWidget/g, "");
      divWidget2.appendChild(style);
      divWidget2.style.cssText = cssCommons;
      // hack to use content in frame instead!
      divWidgetContent = divWidget2;
      divWidget2 = divWidget;
    }

    divWidget.style.cssText = cssWidget + cssCommons;

    divWidgetTitle.style.cssText = cssWidgetTitle;
    divWidgetContent.style.cssText = cssWidgetContent;
    divWidgetStatus.style.cssText = cssWidgetStatus;

    divWidget2.appendChild(divWidgetTitle);
    divWidget2.appendChild(divWidgetContent);
    divWidget2.appendChild(divWidgetStatus);

    // Event listeners
    divWidgetTitle.addEventListener("mousedown", onMouseDown, false);
    divWidgetTitle.addEventListener("mouseup", onMouseUp, false);

    var snapDistance = 15;

    var currentLeft = 0,
      currentTop = 0;
    var x, y, offsetX, offsetY;

    var startTop, startLeft;
    var offsetFromBottom, offsetFromRight;

    function onMouseDown(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      x = e.clientX;
      y = e.clientY;

      offsetX = e.offsetX !== undefined ? e.offsetX : e.layerX;
      offsetY = e.offsetY !== undefined ? e.offsetY : e.layerY;

      startTop = divWidget.offsetTop;
      startLeft = divWidget.offsetLeft;

      offsetFromBottom = divWidget.clientHeight - offsetY;
      offsetFromRight = divWidget.clientWidth - offsetX;

      targetDom.addEventListener("mousemove", onMouseMove, false);

      return false;
    }

    function onMouseMove(e) {
      // Snap to edge
      if (Math.abs(e.clientY - offsetY) < snapDistance) {
        currentTop = 0;
      } else if (
        Math.abs(e.clientY + offsetFromBottom - window.innerHeight) <
        snapDistance
      ) {
        currentTop = window.innerHeight - divWidget.clientHeight;
      } else {
        currentTop = startTop + (e.clientY - y);
      }

      if (Math.abs(e.clientX - offsetX) < snapDistance) {
        currentLeft = 0;
      } else if (
        Math.abs(e.clientX + offsetFromRight - window.innerWidth) < snapDistance
      ) {
        currentLeft = window.innerWidth - divWidget.clientWidth;
      } else {
        currentLeft = startLeft + (e.clientX - x);
      }

      divWidget.style.left = currentLeft + "px";
      divWidget.style.top = currentTop + "px";

      return false;
    }

    function onMouseUp(e) {
      targetDom.removeEventListener("mousemove", onMouseMove, false);
      return false;
    }

    // APIs

    this.setTitle = function (title) {
      divWidgetTitle.innerHTML = title;

      var close = document.createElement("a");
      close.innerHTML = " X ";
      close.onclick = this.close;

      var min = document.createElement("a");
      min.innerHTML = " &ndash; ";
      min.onclick = this.toggle;

      var span = document.createElement("span");
      span.style.cssText = "padding: 0 10px 0 10px; float: right;";

      span.appendChild(min);
      span.appendChild(close);

      divWidgetTitle.appendChild(span);
    };

    this.setStatus = function (status) {
      divWidgetStatus.innerHTML = status;
    };

    this.setContent = function (content) {
      divWidgetContent.innerHTML = content;
    };

    this.setSize = function (width, height) {
      divWidgetContent.style.width = width + "px";
      divWidgetContent.style.height = height + "px";
    };

    this.setPosition = function (x, y) {
      divWidget.style.left = x + "px";
      divWidget.style.top = y + "px";
    };

    this.hide = function () {
      divWidgetContent.style.display = "none";
      divWidgetStatus.style.display = "none";
      this.isHidden = true;
    };

    this.show = function () {
      divWidgetContent.style.display = "block";
      divWidgetStatus.style.display = "block";
      this.isHidden = false;
    };

    this.toggle = function () {
      if (!me.isHidden) {
        me.hide();
      } else {
        me.show();
      }
    };

    this.add = function (content) {
      divWidgetContent.innerHTML += content;
    };

    /* this.clear
	while (node.hasChildNodes()) {
	    node.removeChild(node.lastChild);
	}
	*/

    this.close = function () {
      if (me.isClosed) return;

      targetDom.body.removeChild(divWidget);
      delete this;

      me.isClosed = true;
    };

    this.contents = divWidgetContent;
    this.div = divWidget;

    title = title == undefined ? "Untitled" : title;
    this.setTitle(title);

    return this;
  }

  // Main entry

  var ThreeInspector = {},
    ThreeInspectorWidget;

  ThreeInspector.start = function () {
    // Destory previous copy of ThreeInspector.
    if (window.ThreeInspector) {
      window.ThreeInspector.destory();
      newWindow = true;
    }

    // Inject this copy into window.ThreeInspector namespace
    ThreeInspector.version = "5a";

    if (ThreeInspector.newWindow) {
      // new window
      var opener = window.open(
        "",
        "threeInspectorWindow",
        "width=800,height=400" +
          ",menubar=no" +
          ",toolbar=no" +
          ",status=no" +
          ",location=no" +
          ",scrollbars=no" +
          ",resizable=yes"
      );
      // left=

      // opener.focus();
      targetDom = opener.document;

      var style = document.createElement("style");
      style.innerHTML = styles;
      targetDom.body.appendChild(style);

      ThreeInspectorWidget = new Widget(
        "Three.js Inspector " + ThreeInspector.version,
        "threeInspectorWidget",
        targetDom
      );
      ThreeInspectorWidget.setPosition(0, 0);
      ThreeInspectorWidget.setSize(780, 380);

      opener.document.close();

      ThreeInspector.opener = opener;
    } else {
      targetDom = document;

      var shadowRoot = !!document.body.createShadowRoot;
      var iframe = false;

      var type = shadowRoot ? "shadowDom" : iframe ? "iframe" : "dom";

      if (type == "dom") {
        var style = document.createElement("style");
        style.innerHTML = styles;
        targetDom.body.appendChild(style);
      }

      console.log("method", type);

      ThreeInspectorWidget = new Widget(
        "Three.js Inspector " + ThreeInspector.version,
        "threeInspectorWidget",
        targetDom,
        type
      );
      ThreeInspectorWidget.setSize(420, 264);
      ThreeInspectorWidget.setPosition(
        0,
        window.innerHeight - ThreeInspectorWidget.div.clientHeight
      );
    }

    scanWindow() && autoRefresh();
    window.ThreeInspector = ThreeInspector;
  };

  //  Destory ThreeInspector. Stop timers. Close widgets.
  ThreeInspector.destory = function () {
    if (ThreeInspector.opener) {
      ThreeInspector.opener.close();
    }

    ThreeInspectorWidget.close();
    if (ThreeInspector.sidePane) ThreeInspector.sidePane.close();

    if (autoRefreshing) {
      clearInterval(autoRefreshing);
      autoRefreshing = null;
    }
  };

  ThreeInspector.start();
})();
