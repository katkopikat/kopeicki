class PubSub {
  constructor() {
    this.handlers = {};
  }

  getEventHandlers(event) {
    if (!this.handlers[event]) this.handlers[event] = [];
    return this.handlers[event];
  }

  subscribe(event, handler) {
    this.getEventHandlers(event).push(handler);
  }

  publish(event, ...args) {
    this.getEventHandlers(event).map((handler) => handler(...args));
  }
}

const pubsub = new PubSub();

export default pubsub;
