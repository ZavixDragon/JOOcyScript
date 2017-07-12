//Entities

class Entity {
    constructor(elementType = "") {
        this.id = generateId();
        this.traits = new Map();
        this.elementType = elementType;
        this.isAlive = false;
    }

    addTrait(trait) {
        this.traits.set(trait.type, trait);
        if (this.isAlive)
            trait.apply(this.getElement());
    }

    removeTrait(traitName) {
        if (this.isAlive)
            this.traits.get(traitName).remove(this.getElement());
        this.traits.delete(traitName);
    }

    arise() {
        let element = document.createElement(this.elementType);
        element.id = this.id;
        for (let trait of this.traits.values())
            trait.apply(element);
        this.isAlive = true;
        return element;
    }

    die() {
        let life = this.getElement();
        life.parentNode.removeChild(life);
        this.isAlive = false;
    }

    getTraitByName(traitName = "") {
        return this.traits.get(traitName);
    }

    getElement() {
        return document.getElementById(this.id);
    }
}

function CreateImage(source = "") {
    let entity = new Entity("img");
    new Source(source).attach(entity);
    return entity;
}

function CreateButton(onClick = () => {}) {
    let entity = new Entity("button");
    new ClickEvent(onClick).attach(entity);
    return entity;
}

function CreateContainer(entities = []) {
    let entity = new Entity("div");
    new Contents(entities).attach(entity);
    return entity;
}

function CreateTextInput() {
    let entity = new Entity("input");
    new Type("text").attach(entity);
    return entity;
}

function CreateNumberInput() {
    let entity = new Entity("input");
    new Type("number").attach(entity);
    return entity;
}

function CreateFileInput() {
    let entity = new Entity("input");
    new Type("file").attach(entity);
    return entity;
}

function CreateComboBox(options = []) {
    let entity = new Entity("select");
    new Contents(options).attach(entity);
    return entity;
}

function CreateOption(value = "") {
    let entity = new Entity("option");
    new Value(value).attach(entity);
    return entity;
}

function CreateImageDropbox() {
    let dropBox = new Entity("div");
    let image = CreateImage("../images/placeholder.png");
    new Content(image).attach(dropBox);
    new DragEnterEvent((event) => event.preventDefault()).attach(dropBox);
    new DragOverEvent((event) => event.preventDefault()).attach(dropBox);
    new DropEvent((event) => {
        event.preventDefault();
        let imageFile = event.dataTransfer.files[0];
        let reader = new FileReader();
        reader.onload = (event) => {
            image.getElement().src = event.target.result;
        };
        reader.readAsDataURL(imageFile);
    }).attach(dropBox);
    return dropBox;
}

function CreateLabel(text = "") {
    let entity = new Entity("label");
    new Text(text).attach(entity);
    return entity;
}

function CreateLink(link = "") {
    let entity = new Entity("a");
    new Site(link).attach(entity);
    return entity;
}

function CreateCheckbox(onChange = (event) => {}) {
    let entity = new Entity("input");
    new Type("checkbox").attach(entity);
    new ChangeEvent(onChange).attach(entity);
    return entity;
}

function CreateSpan() {
    return new Entity("span");
}

function CreatePasswordInput() {
    let entity = new Entity("input");
    new Type("password").attach(entity);
    return entity;
}

//Traits

function Style(style) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "Style";
    this.apply = (element) => element.className = style;
    this.remove = (element) => element.removeAttribute("class");
}

function Content(entity) {
    //inherit Unique Trait
    this.attach = (entity) => {
        if (this.attachedEntity)
            this.attachedEntity.removeTrait(this.type);
        this.attachedEntity = entity;
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntity = undefined;
        entity.removeTrait(this.type);
    };
    //
    this.type = "Content";
    this.content = entity;
    this.apply = (element) => element.appendChild(this.content.arise());
    this.remove = (element) => this.content.die();
}

function Source(source) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "Source";
    this.apply = (element) => element.src = source;
    this.remove = (element) => element.removeAttribute("src");
}

function Contents(entities) {
    //inherit Unique Trait
    this.attach = (entity) => {
        if (this.attachedEntity)
            this.attachedEntity.removeTrait(this.type);
        this.attachedEntity = entity;
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntity = undefined;
        entity.removeTrait(this.type);
    };
    //
    this.type = "Contents";
    this.entities = entities;
    this.apply = (element) => {
        for (let entity of this.entities)
            element.appendChild(entity.arise());
    };
    this.remove = (element) => {
        for (let entity of this.entities)
            entity.die();
    };
    this.add = (entity) => {
        this.entities.push(entity);
        if (this.attachedEntity && this.attachedEntity.isAlive)
            this.attachedEntity.getElement().appendChild(entity.arise());
    };
    this.clear = () => {
        for (let entity of this.entities)
            this.drop(entity);
    };
    this.drop = (entity) => {
        this.entities = this.entities.filter(x => x.id !== entity.id);
        if (this.attachedEntity && this.attachedEntity.isAlive)
            entity.die();
    };
}

function Type(type) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "Type";
    this.apply = (element) => element.type = type;
    this.remove = (element) => element.removeAttribute("type");
}

function Value(value) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "Value";
    this.apply = (element) => element.value = value;
    this.remove = (element) => element.removeAttribute("value");
}

function Text(text) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "Text";
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
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "Site";
    this.apply = (element) => element.href = href;
    this.remove = (element) => element.removeAttribute("href");
}

function MaxLength(length = 0) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "MaxLength";
    this.apply = (element) => element.maxLength = length;
    this.remove = (element) => element.removeAttribute("maxLength");
}

function ExplicitStyle(style) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "ExplicitStyle";
    this.apply = (element) => element.style = style;
    this.remove = (element) => element.removeAttribute("style");
}

function ChangeEvent(onChange) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "ChangeEvent";
    this.apply = (element) => element.onchange = (event) => onChange(event);
    this.remove = (element) => element.removeAttribute("onchange");
}

function ClickEvent(onClick) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "ClickEvent";
    this.apply = (element) => element.onclick = (event) => onClick(event);
    this.remove = (element) => element.removeAttribute("onclick");
}

function LostFocusEvent(onLostFocus) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "LostFocusEvent";
    this.apply = (element) => element.onblur = (event) => onLostFocus(event);
    this.remove = (element) => element.removeAttribute("onblur");
}

function KeyDownEvent(onKeyDown) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "KeyDownEvent";
    this.apply = (element) => element.onkeydown = (event) => onKeyDown(event);
    this.remove = (element) => element.removeAttribute("onkeydown");
}

function KeyUpEvent(onKeyUp) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "KeyUpEvent";
    this.apply = (element) => element.onkeyup = (event) => onKeyUp(event);
    this.remove = (element) => element.removeAttribute("onkeyup");
}

function MouseDownEvent(onMouseDown) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "MouseDownEvent";
    this.apply = (element) => element.onmousedown = (event) => onMouseDown(event);
    this.remove = (element) => element.removeAttribute("onmousedown");
}

function MouseUpEvent(onMouseUp) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "MouseUpEvent";
    this.apply = (element) => element.onmouseup = (event) => onMouseUp(event);
    this.remove = (element) => element.removeAttribute("onmouseup");
}

function DragOverEvent(onDragOver) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "DragOverEvent";
    this.apply = (element) => element.ondragover = (event) => onDragOver(event);
    this.remove = (element) => element.removeAttribute("ondragover");
}

function DropEvent(onDrop) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "DropEvent";
    this.apply = (element) => element.ondrop = (event) => onDrop(event);
    this.remove = (element) => element.removeAttribute("ondrop");
}

function DragEnterEvent(onDragEnter) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "DragEnterEvent";
    this.apply = (element) => element.ondragenter = (event) => onDragEnter(event);
    this.remove = (element) => element.removeAttribute("ondragenter");
}

function LoadEvent(onLoad) {
    //inherit Constant Trait
    this.attachedEntities = [];
    this.attach = (entity) => {
        this.attachedEntities.push(entity);
        entity.addTrait(this);
    };
    this.detach = (entity) => {
        this.attachedEntities.remove(entity);
        entity.removeTrait(this.type);
    };
    //
    this.type = "LoadEvent";
    this.apply = (element) => element.onload = (event) => onLoad(event);
    this.remove = (element) => element.removeAttribute("onload");
}

//Utils

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

Array.prototype.remove = function(item) {
    let i = this.indexOf(item);
    this.splice(i, 1);
}