class Dep{
    constructor() {
        this.subscribers = new Set();
    }

    addEffect() {
        if (activeEffect) {
            this.subscribers.add(activeEffect)
        }
    }

    notify() {
        this.subscribers.forEach(item => {
            item();
        })
    }
}

let activeEffect=null
const watchEffect = (effect) => {
    activeEffect = effect;
    effect();
    activeEffect=null
}

const targetMap = new WeakMap();

const getDep = (obj, key) => {
    let objMap = targetMap.get(obj);

    if (!objMap) {
        objMap = new Map();

        targetMap.set(obj,objMap)
    }

    let keyDep = objMap.get(key);
    if (!keyDep) {
        keyDep = new Dep();

        objMap.set(key,keyDep)
    };

    return keyDep;
}

const reactive = (obj) => {
    return new Proxy(obj, {
        get(target,key) {
            const dep = getDep(target, key);

            dep.addEffect();
            return target[key]
        },
        set(target, key, newValue) {
            const dep = getDep(target, key);
            target[key] = newValue;

            dep.notify();
        }
    })
}

const info = reactive({ name: 'text', age: 18 });

watchEffect(() => {
    console.log(info.age)
});

info.age = 10;
