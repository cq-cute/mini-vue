const h = (tag, props, children) => {

    return {
        tag,
        props,
        children,
    }
}

const mount = (vNode, container) => {
    // vnode -> element
  // 1.创建出真实的原生, 并且在vnode上保留el
    const el = document.createElement(vNode.tag);
    vNode.el = el;
    
    // 2.处理props
    if (vNode.props) {
        for (key in vNode.props) {
            const value = vNode.props[key];
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                el.setAttribute(key,value)
            }
        }
    }

    // 3.处理children
    if (vNode.children) {
        if (typeof vNode.children === 'string') {
            el.textContent = vNode.children;
        } else {
            vNode.children.forEach((item) => {
                mount(item,el)
            })
        }
    }

    container.appendChild(el)
}

const patch = (vNode1, vNode2) => {
    if (vNode1.tag !== vNode2.tag) {
        const parentEl = vNode1.el.parentElement;
        parentEl.removeChild(vNode1.el);

        mount(vNode2,parentEl)
    } else {
        // 1.取出element对象, 并且在v2中进行保存
        const el = vNode2.el = vNode1.el;

        // 2.处理props
        const props1 = vNode1.props ?? {};
        const props2 = vNode2.props ?? {};

        // 2.1.获取所有的newProps添加到el
        for (key in props2) {
            const value = props2[key];
            if (key.startsWith('on')) {
                el.addEventListener(key.slice(2).toLowerCase(),value)
            } else {
                if (props1[key] !== value) {
                    el.setAttribute(key, value);
                }
            }
        }

        // 2.2.删除旧的props
        for (key in props1) {
            // 事件函数地址不同，会重复添加事件，所以必须移除旧的事件
            if (key.startsWith('on')) {
                el.removeEventListener(key.slice(2).toLowerCase(), props1[key])
            }

            if (!(key in props2)) {
                el.removeAttribute(key, props1[key]);
            }
        }

        // 3.处理children
        const children1 = vNode1.children ?? [];
        const children2 = vNode2.children ?? [];

        // 1. newChildren本身是一个string
        if (typeof children2 === 'string') {
            if (typeof children1 === 'string') {
                if (children1 !== children2) {
                    el.textContent = children2;
                }
            } else {
                el.innerHTML = children2;
            }
        } else {
            // 2. newChildren本身是一个数组
            if (typeof children1 === 'string') {
                el.innerHTML = '';

                children2.forEach(item => {
                    mount(item,el)
                })
            } else {
                // oldChildren: [v1, v2, v3, v8, v9]
                // newChildren: [v1, v5, v6]
                // 1.前面有相同节点的原生进行patch操作
                const length = Math.min(children1.length, children2.length);

                for (let i = 0; i < length; i++){
                    patch(children1[i], children2[i]);
                }

                // 2.newChildren.length < oldChildren.length
                if (children1.length > children2.length) {
                    children1.slice(length).forEach(item => {
                        el.removeChild(item)
                    })
                }

                // 3.newChildren.length > oldChildren.length
                if (children1.length < children2.length) {
                    children2.forEach(item => {
                        mount(item,el)
                    })
                }
            }
        }
    }
}

