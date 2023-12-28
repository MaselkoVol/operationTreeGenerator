import OperationTree from "./operationTree.js";
import Stack from "./stack.js";

let operators = {
	plus: "+",
	minus: "-",
	divide: "/",
	multiply: "*",
	unaryMinus: "~",
	power: "^",
	root: "√",
}
// finding parameters
const myKeysValues = window.location.search;
const urlParams = new URLSearchParams(myKeysValues);
let field = urlParams.get("field");
let expression = null;
if (field != null) {
	expression = field.split(" ");
	for (let i = 0; i < expression.length; i++) {
		if (operators[expression[i]] != undefined)
			expression[i] = operators[expression[i]];
	}
}


let fullScreenButton = document.querySelector(".fullscreen");
let areaContainer = document.querySelector(".area");
let area = document.querySelector(".area__content");
let fullScreenButtonIsClicked = false;
let yTopOffset = 0;


fullScreenButton.addEventListener("click", function () {
	if (!fullScreenButtonIsClicked) {
		yTopOffset = window.pageYOffset;
		areaContainer.classList.add("_area__fullscreen");
		document.body.classList.add("_locked");
		area.classList.add("_area__content__fullscreen");
		if (window.innerWidth / window.innerHeight > 2)
			forAreaMoreThanTwoToOne();
	} else {
		areaContainer.classList.remove("_area__fullscreen");
		document.body.classList.remove("_locked");
		area.classList.remove("_area__content__fullscreen");
		areaContainer.style.width = 100 + "%";
		areaContainer.style.height = 0;
		areaContainer.style.paddingBottom = "50%";
		window.scrollTo(0, yTopOffset);
	}
	fullScreenButtonIsClicked = !fullScreenButtonIsClicked;
})
window.addEventListener('resize', function () {
	if (fullScreenButtonIsClicked) {
		if (window.innerWidth / window.innerHeight > 2) {
			forAreaMoreThanTwoToOne();
		} else {
			areaContainer.style.width = 100 + "%";
			areaContainer.style.height = 0;
			areaContainer.style.paddingBottom = "50%";
		}
	}
});
function forAreaMoreThanTwoToOne() {
	areaContainer.style.width = 2 / (window.innerWidth / window.innerHeight) * 100 + "%";
	areaContainer.style.height = 100 + "%";
	areaContainer.style.paddingBottom = 0;
}

let expressionField = document.getElementById("expression-field");
let expressionForm = document.getElementById("expression");

expressionForm.addEventListener("submit", function (event) {
	event.preventDefault();
	let field = expressionField.value;
})


let plusButton = document.querySelector(".plus");
let minusButton = document.querySelector(".minus");
let canvas = document.getElementById("canvas");

// creating operation tree
let operationTree = new OperationTree();
if (expression != null) {
	for (let i = 0; i < expression.length; i++) {
		operationTree.add(expression[i]);
	}
}
canvas.width = 2000;
canvas.height = canvas.width / 2;
let minSize = 100;
let size;
let borderSize = 50;
if (canvas.width / (operationTree.width + 1) > canvas.height / operationTree.height) {
	size = canvas.height / operationTree.height;
	if (size < minSize) {
		canvas.height = minSize / size * canvas.height;
		canvas.width = canvas.height * 2;
		size = minSize;
	}
	size -= canvas.width / operationTree.height / borderSize;
} else {
	size = canvas.width / (operationTree.width + 1);
	if (size < minSize) {
		canvas.width = minSize / size * canvas.width;
		canvas.height = canvas.width / 2;
		size = minSize;
	}
	size -= canvas.width / operationTree.width / borderSize;
}
console.log(canvas.width, canvas.height);
let ctx = canvas.getContext("2d");


let zoom = 500;
plusButton.addEventListener("click", function () {
	let initWidth = canvas.clientWidth;
	let initHeight = canvas.clientHeight;

	let width = canvas.clientWidth + zoom;
	canvas.style.width = width + "px";
	canvas.style.height = width / 2 + "px";
	area.scrollLeft += (area.scrollLeft + area.clientWidth / 2) * (canvas.clientWidth / initWidth - 1);
	area.scrollTop += (area.scrollTop + area.clientHeight / 2) * (canvas.clientHeight / initHeight - 1);
})

minusButton.addEventListener("click", function () {
	let initXpos = area.scrollLeft + area.clientWidth / 2;
	let initYpos = area.scrollTop + area.clientHeight / 2;
	let initWidth = canvas.clientWidth;
	let initHeight = canvas.clientHeight;

	let width = canvas.clientWidth - zoom;
	if (width <= area.clientWidth + 30) {
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		return;
	}
	canvas.style.width = width + "px";
	canvas.style.height = width / 2 + "px";
	area.scrollLeft -= initXpos * (1 - canvas.clientWidth / initWidth);
	area.scrollTop -= initYpos * (1 - canvas.clientHeight / initHeight);
})


function drawElement(x, y, size, text) {
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(x, y, size * 0.95, 0, Math.PI * 2, false)
	ctx.stroke();
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(x, y, size * 0.95, 0, Math.PI * 2, false)
	ctx.fill();
	let fontSize = size / text.length / 2 + size / 2.5;
	ctx.font = "bold " + fontSize + "px Calibri";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"
	if (text.length <= 7) {
		if (text == "*" || text == "^" || text == "~") {
			ctx.fillText(text, x, y + fontSize / 4);
			return;
		}
		ctx.fillText(text, x, y + fontSize / 15);
		return;
	}
	let height = Math.ceil(text.length / 7);
	for (let i = 0; i < text.length; i += 7) {
		let curText = text.slice(i, i + 7);
		ctx.fillText(curText, x, y - (height - 1) * fontSize / 2.5 + i * fontSize / 8, size * 1.8);
	}
}

// drawing tree
ctx.lineWidth = size / 20;
let stack = new Stack();
operationTree.root.x = canvas.width / 2 - operationTree.width * size / 2 + size * operationTree.leftWidth;
operationTree.root.y = canvas.height / 2 - size * (operationTree.height - 1) / 2;
stack.push(operationTree.root);
let current = null;
while (!stack.isEmpty()) {
	current = stack.pop();
	if (current.right != null) {
		current.right.x = current.x + current.rightLength * size;
		current.right.y = current.y + size;
		stack.push(current.right);
		ctx.beginPath();
		ctx.moveTo(current.x, current.y);
		ctx.lineTo(current.right.x, current.right.y);
		ctx.stroke();
	}
	if (current.left != null) {
		current.left.x = current.x - current.leftLength * size;
		current.left.y = current.y + size;
		stack.push(current.left);
		ctx.beginPath();
		ctx.moveTo(current.x, current.y);
		ctx.lineTo(current.left.x, current.left.y);
		ctx.stroke();
	}
	drawElement(current.x, current.y, size / 2, current.value);
}

