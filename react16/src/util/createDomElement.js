export default function createDomElement (fiber) {
    if (fiber.type === 'text') {
        return document.createTextNode(fiber.props.textContent);
    } else if (typeof fiber.type === 'string') {
        return document.createElement(fiber.type);
        updateNodeElementAttr(newElement, fiber.props)
    }
}