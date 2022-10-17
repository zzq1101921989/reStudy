import updateNodeElementAttr from './updateNodeElementAttr';

/**
 * 当fiber中的tag === host_component的时候就需要创建dom元素
 * @param {*} fiber 
 */
export default function createStateNode (fiber) {
    let newElement = null;
    if (fiber.type === 'text') {
        newElement = document.createTextNode(fiber.props.textContent);
    } else {
        newElement = document.createElement(fiber.type);
        updateNodeElementAttr(newElement, fiber.props)
    }

    return newElement
}