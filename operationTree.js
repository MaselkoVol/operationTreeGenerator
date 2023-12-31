import Stack from "./stack.js";

const unaryOperators = ["√", "~"];
const binaryOperators = ["+", "-", "*", "/", "^"];
const operators = unaryOperators.concat(binaryOperators);

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
function isNumber(str) {
	str = str.trim();
	if (str[0] == "π" && str.length == 1)
		return true;
	if (str[0] == "e" && str.length == 1)
		return true;
	for (let i = 0; i < str.length; i++) {
		if (!digits.includes(str[i]))
			return false;
	}
	return true;
}

class Node {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.isComplited = false;
		this.rightLength = 0;
		this.leftLength = 0;
		this.level = 1;
		this.x = 0;
		this.y = 0;
	}
}

class OperationTree {
	constructor() {
		this.height = 0;
		this.width = 0;
		this.leftWidth = 0;
		this.root = null;
	}
	add(value) {
		if (this.root == null) {
			this.root = new Node(value);
			this.setLengthAndSize();
			return;
		}
		let current = this.root;
		// for every iteration, I choose where will I go
		while (true) {
			// if root children are complited, return. For correct operation tree there is no need in this check
			if (this.root.isComplited) {
				this.setLengthAndSize();
				return;
			}
			// if cur element has empty left child, put value into it. And if value is number, mark left child as complited
			if (current.left == null) {
				current.left = new Node(value);
				if (isNumber(current.left.value))
					current.left.isComplited = true;
				this.setLengthAndSize();
				return;
			}
			// if cur element has complited left branch, and has empty right child, put value into it.
			// And if value is number, mark right child as complited
			if (current.left.isComplited && current.right == null) {
				// if cur element is unary operator and has left child complited, mark cur element as complited and return to root element
				if (unaryOperators.includes(current.value) && current.left.isComplited) {
					console.log("hallo");
					current.isComplited = true;
					current = this.root;
					continue;
				}
				current.right = new Node(value);
				if (isNumber(current.right.value))
					current.right.isComplited = true;
				this.setLengthAndSize();
				return;
			}

			// if cur element has left child and branch of left child is not complited, change cur element to it
			if (!current.left.isComplited) {
				current = current.left;
				continue;
			}
			// if cur element has complited left child, and right child of cur element is not complited, change cur element to it
			if (!current.right.isComplited) {
				current = current.right;
				continue;
			}
			// if cur element has every child complited, mark cur element as complited and return to root element
			if (current.left.isComplited && current.right.isComplited) {
				current.isComplited = true;
				current = this.root;
				continue;
			}
		}
	}
	setLengthAndSize() {
		let stack = new Stack();
		let allElements = new Stack();
		stack.push(this.root);
		let current = null;
		let maxLevel = 1;
		this.root.level = 1;
		while (!stack.isEmpty()) {
			current = stack.pop();
			allElements.push(current);
			if (current.left != null) {
				current.left.level = current.level + 1;
				stack.push(current.left);
			}
			if (current.right != null) {
				current.right.level = current.level + 1;
				stack.push(current.right);
			}
			if (current.level > maxLevel) {
				maxLevel = current.level;
			}
		}
		while (!allElements.isEmpty()) {
			current = allElements.pop();
			if (isNumber(current.value)) {
				current.leftLength = 0;
				current.rightLength = 0;
				continue;
			}
			if (current.left != null) {
				if (current.left.right != null) {
					let leftTotalLength = 0;
					let subCurrent = current.left.right;
					while (subCurrent.left != null) {
						leftTotalLength += subCurrent.leftLength;
						subCurrent = subCurrent.left;
					}
					subCurrent = current.left.right;
					while (subCurrent.right != null) {
						leftTotalLength += subCurrent.rightLength;
						subCurrent = subCurrent.right;
					}
					current.leftLength = leftTotalLength + 2;
				} else {
					current.leftLength = 1;
				}
			}
			if (current.right != null) {
				if (current.right.left != null) {
					let rightTotalLength = 0;
					let subCurrent = current.right.left;
					while (subCurrent.left != null) {
						rightTotalLength += subCurrent.leftLength;
						subCurrent = subCurrent.left;
					}
					subCurrent = current.right.left;
					while (subCurrent.right != null) {
						rightTotalLength += subCurrent.rightLength;
						subCurrent = subCurrent.right;
					}
					current.rightLength = rightTotalLength + 2;
				} else {
					current.rightLength = 1;
				}
			}
		}
		this.height = maxLevel;
		let maxWidth = 0;
		current = this.root;
		while (current.left != null) {
			maxWidth += current.leftLength;
			current = current.left;
		}
		this.leftWidth = maxWidth;

		current = this.root;
		while (current.right != null) {
			maxWidth += current.rightLength;
			current = current.right;
		}
		this.width = maxWidth;
	}
}

export default OperationTree;