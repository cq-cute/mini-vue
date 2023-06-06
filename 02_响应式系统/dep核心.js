class Dep{
    constructor() {
        this.subscribers = new Set();
    }

    addEffect(effect) {
        this.subscribers.add(effect)
    }

    notify() {
        this.subscribers.forEach(effect => {
            effect();
        })
    }
}

const info = { name: 'haha' };

const dep = new Dep();

dep.addEffect(() => {
    console.log(info.name)
});

dep.addEffect(() => {
    console.log(info.name + 'q')
});

info.name = 'hehe';

dep.notify();

