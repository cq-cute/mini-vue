class Dep {
    constructor() {
        this.subscriber = new Set();
    }

    addEffect() {
        if (activeEffect) {
            this.subscriber.add(activeEffect)
        }
    }

    notify() {
        this.subscriber.forEach((effect) => {
            effect();
        })
    }
}

let activeEffect = null;
const watchEffect=(effect) => {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

const targetMap = new WeakMap();
const getDep = (obj, key) => {
    // 1.根据对象(obj)取出对应的Map对象
    let objMap = targetMap.get(obj);

    if (!objMap) {
        objMap = new Map();
        targetMap.set(obj, objMap);
    }

    // 2.取出具体的dep对象
    let keyDep = objMap.get(key);
    if (!keyDep) {
        keyDep = new Dep();
        objMap.set(key,keyDep)
    };

    return keyDep;
}

const reactive = (obj) => {
    Object.keys(obj).forEach(key => {
        const dep = getDep(obj, key);
        let value = obj[key];

        Object.defineProperty(obj, key, {
            get() {
                dep.addEffect();

                return value;
            },
            set(newValue) {
                if (value !== newValue) {
                    value = newValue;
                    dep.notify();
                }
            }
        })
    });

    return obj
}

const info = reactive({ name: 'why', age: 14 });

watchEffect(()=>{
    console.log(info.name)
});

watchEffect(() => {
    console.log(info.age)
});

watchEffect(() => {
    console.log(info.name, info.age)
});

setTimeout(() => {
    info.name = 'test';
},1000)

