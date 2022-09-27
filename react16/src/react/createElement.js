
export default function createElement(type, props, ...children) {
    const newChildren = [].concat(...children).reduce((acc, next) => {
        if (next !== false && next !== true && next !== null) {
            if (next instanceof Object) {
                acc.push(next)
            } else {
                acc.push(createElement('text', {textContent: next}))
            }
        }
        return acc
    }, [])

    return {
        type,
        props: {
            ...props,
            children: newChildren
        },
    }
}