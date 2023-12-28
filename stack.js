class Stack {
	constructor () {
		this.top = null;
	}
	push (value) {
		if (this.top == null) {
			this.top = new Node(value);
			return;
		}
		let current = this.top;
		this.top = new Node(value);
		this.top.next = current;
	}
	pop () {
		let currentValue = this.top.value;
		this.top = this.top.next;
		return currentValue;
	}
	isEmpty () {
		if (this.top == null)
			return true;
		return false;
	}
}
class Node {
	constructor (value) {
		this.value = value;
		this.next = null;
	}
}
export default Stack;