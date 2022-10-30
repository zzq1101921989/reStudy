/**
 * 实例化类组件
 * @param {*} fiber 
 */
export default function createClassComponentInstance (fiber) {
    const instance = new fiber.type(fiber.props)
    return instance;
}