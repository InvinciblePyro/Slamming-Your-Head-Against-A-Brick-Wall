class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClassOrInstance, data = null, extra = null) {
        // If it's a function returning an instance (arrow function like: () => scene)
        if (typeof sceneClassOrInstance === 'function' && sceneClassOrInstance.prototype === undefined) {
            this.scene = sceneClassOrInstance(); // call the function to get the instance
        }
        // If it's a Scene subclass
        else if (typeof sceneClassOrInstance === 'function' && sceneClassOrInstance.prototype instanceof Scene) {
            this.scene = extra ? new sceneClassOrInstance(this, extra) : new sceneClassOrInstance(this);
        }
        // Already an instance
        else {
            this.scene = sceneClassOrInstance;
        }

        this.scene.create(data);
    }



    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}