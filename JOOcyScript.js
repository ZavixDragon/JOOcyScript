//Entities

function Entity(elementType) {
    let id = generateId();

    this.isAlive = false;

    this.add = (arg) => {
        let trait = arg instanceof Function ? arg(this) : arg;
        if (this[trait.constructor.name] !== undefined)
            this.removeTrait(trait);
        this[trait.constructor.name] = trait;
        if (this.isAlive)
            trait.apply(this.getElement());
        return this;
    };

    this.remove = (arg) => {
        let traitName = typeof arg === 'string' || arg instanceof String ? arg : arg.constructor.name;
        if (this.isAlive)
            this[traitName].remove(this.getElement());
        delete this[traitName];
        return this;
    };

    this.print = () => {
        if (this.isAlive)
            throw "This can't be printed because it already has been printed";
        document.body.appendChild(this.getElement());
        this.isAlive = true;
    };

    this.printAt = (id) => {
        if (this.isAlive)
            throw "This can't be printed because it already has been printed";
        document.getElementById(id).appendChild(this.getElement());
        this.isAlive = true;
    };

    this.erase = () => {
        if (!this.isAlive)
            throw "This can't be erased because it has not been printed or already was erased";
        let element = this.getElement();
        this.getElement().parentNode.removeChild(element);
        this.isAlive = false;
    };

    this.getElement = () => {
        if (this.isAlive)
            return document.getElementById(id);
        let element = document.createElement(elementType);
        element.id = this.id;
        for (let trait of this)
            if (trait.apply !== undefined && trait.remove !== undefined)
                trait.apply(element);
        return element;
    };
}

function createImage(source = "") {
    return new Entity("img").add(new Source(source));
}

function createButton(onClick = () => {}) {
    return new Entity("button").add(new ClickEvent(onClick));
}

function createContainer(entities = []) {
    return new Entity("div").add(entity => new Contents(entity, entities));
}

function createTextInput() {
    return new Entity("input").add(new Type("text"));
}

function createNumberInput() {
    return new Entity("input").add(new Type("number"));
}

function createFileInput() {
    return new Entity("input").add(new Type("file"));
}

function createComboBox(options = []) {
    return new Entity("select").add(x => new Contents(x, options));
}

function createOption(value = "") {
    return new Entity("option").add(new Value(value));
}

function createImageDropbox() {
    let image = CreateImage("../images/placeholder.png");
    return new Entity("div")
        .add(new Content(image))
        .add(new DragEnterEvent((event) => event.preventDefault()))
        .add(new DragOverEvent((event) => event.preventDefault()))
        .add(new DropEvent((event) => {
            event.preventDefault();
            let imageFile = event.dataTransfer.files[0];
            let reader = new FileReader();
            reader.onload = (event) => {
                image.getElement().src = event.target.result;
            };
            reader.readAsDataURL(imageFile);
        }));
}

function createLabel(text = "") {
    return new Entity("label").add(new Text(text));
}

function createLink(link = "") {
    return new Entity("a").add(new Site(link));
}

function createCheckbox(onChange = (event) => {}) {
    return new Entity("input").add(new Type("checkbox")).add(new ChangeEvent(onChange()));
}

function createPasswordInput() {
    return new Entity("input").add(new Type("password"));
}

//Traits

function Style(style) {
    this.apply = (element) => element.className = style;
    this.remove = (element) => element.removeAttribute("class");
}

function Content(entity) {
    this.apply = (element) => element.appendChild(entity.getElement());
    this.remove = () => entity.erase();
}

function Source(source) {
    this.apply = (element) => element.src = source;
    this.remove = (element) => element.removeAttribute("src");
}

function Contents(parent, entities) {
    this.apply = (element) => {
        for (let entity of entities)
            element.appendChild(entity.getElement());
    };

    this.remove = () => {
        for (let entity of entities)
            entity.erase();
    };

    this.add = (entity) => {
        entities.push(entity);
        if (parent.isAlive)
            parent.getElement().appendChild(entity.getElement());
    };

    this.clear = () => {
        for (let entity of entities)
            this.drop(entity);
    };

    this.drop = (entity) => {
        entities = entities.filter(x => x.id !== entity.id);
        if (parent.isAlive)
            entity.erase();
    };
}

function Type(type) {
    this.apply = (element) => element.type = type;
    this.remove = (element) => element.removeAttribute("type");
}

function Value(value) {
    this.apply = (element) => element.value = value;
    this.remove = (element) => element.removeAttribute("value");
}

function Text(text) {
    this.apply = (element) =>  element.appendChild(document.createTextNode(text));
    this.remove = (element) => {
        let child = element.firstChild;
        while(child) {
            if (child.nodeType == 3)
                element.removeChild(child);
            child = child.nextSibling;
        }
    }
}

function Site(href = "") {
    this.apply = (element) => element.href = href;
    this.remove = (element) => element.removeAttribute("href");
}

function MaxLength(length = 0) {
    this.apply = (element) => element.maxLength = length;
    this.remove = (element) => element.removeAttribute("maxLength");
}

function ExplicitStyle(style) {
    this.apply = (element) => element.style = style;
    this.remove = (element) => element.removeAttribute("style");
}

function ChangeEvent(onChange) {
    this.apply = (element) => element.onchange = (event) => onChange(event);
    this.remove = (element) => element.removeAttribute("onchange");
}

function Event(eventName, onEvent) {
    this.apply = (element) => element[eventName] = onEvent;
    this.remove = (element) => element.removeAttribute(eventName);
}

function ClickEvent(onClick) {
    Event.call(this, "onclick", onClick);
}

function LostFocusEvent(onLostFocus) {
    Event.call(this, "onblur", onLostFocus);
}

function KeyDownEvent(onKeyDown) {
    Event.call(this, "onkeydown", onKeyDown);
}

function KeyUpEvent(onKeyUp) {
    Event.call(this, "onkeyup", onKeyUp);
}

function MouseDownEvent(onMouseDown) {
    Event.call(this, "onmousedown", onMouseDown);
}

function MouseUpEvent(onMouseUp) {
    Event.call(this, "onmouseup", onMouseUp);
}

function DragOverEvent(onDragOver) {
    Event.call(this, "ondragover", onDragOver);
}

function DropEvent(onDrop) {
    Event.call(this, "ondrop", onDrop);
}

function DragEnterEvent(onDragEnter) {
    Event.call(this, "ondragenter", onDragEnter);
}

function LoadEvent(onLoad) {
    Event.call(this, "onload", onLoad);
}

//Utils

//TODO: make this an object
var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
function generateId() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
}