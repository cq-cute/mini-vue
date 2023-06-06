const createApp=(root) => {
    return {
        mount: (selector) => {
            const parentEl = document.querySelector(selector);

            let mounted = false;
            let oldValue = null;

            watchEffect(() => {
                if (!mounted) {
                    oldValue = root.render();
                    mount(oldValue, parentEl);
                    mounted=true
                } else {
                    const newValue = root.render();
                    patch(oldValue, newValue);
                    oldValue = newValue;
                }
            })
        }
    }
}