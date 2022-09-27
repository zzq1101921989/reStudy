export default class CreateTaskQueue {
    constructor() {
        this.queue = []
    }
    pushTask(task) {
        this.queue.push(task)
    }
    getTask() {
        return this.queue.shift()
    }
    isEmpty() {
        return this.queue.length === 0
    }
}