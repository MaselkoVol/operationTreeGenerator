import Stack from "./stack.js";
let Operators = {
	E: "e",
	PI: "π",
	POWER: "^",
	ROOT: "√",
	PLUS: "+",
	MINUS: "-",
	MULTIPLY: "*",
	DIVIDE: "/",
	DOT: ".",
	LEFT_PARENTHESIS: "(",
	RIGHT_PARENTHESIS: ")",
	get SIGNIFICANCE() {
		return [[this.PLUS, this.MINUS], [this.MULTIPLY, this.DIVIDE], [this.POWER, this.ROOT]]
	}
}

class OperationManager {
	constructor(initExpression) {
		this.initExpression = initExpression;
	}
	convertToPolish() {
		if (this.initExpression == "")
			return null;
		let curExpressions = new Stack();
		let polishExpression = new Stack();
		curExpressions.push(this.initExpression);
		let pos;
		let expression;
		// Loop to go deeper in splitting operations
		while (!curExpressions.isEmpty()) {
			expression = curExpressions.pop();
			// Deleting parenthesis in expression if it is fully covered by them
			if (
				expression.slice(expression.length - 1) === Operators.RIGHT_PARENTHESIS &&
				this.findEndOfRightParenthesis(expression, expression.length - 1) === 0
			) {
				expression = expression.slice(1, expression.length - 1);
			}

			// If it is an operator, the current expression is already split
			pos = this.findPositionOfRightLeastValuableOperator(expression);
			if (pos === -1) {
				polishExpression.push(expression);
			} else {
				if (this.unaryMinusCheck(expression,pos)) {
					polishExpression.push("~");
				} else {
					polishExpression.push(expression.slice(pos, pos + 1));
				}
				if (expression.slice(pos + 1) != "")
					curExpressions.push(expression.slice(pos + 1))
				if (expression.slice(0, pos) != "")
					curExpressions.push(expression.slice(0, pos))
			}
		}
		let res = new Stack();
		while (!polishExpression.isEmpty()) {
			res.push(polishExpression.pop());
		}
		return res;
	}

	findEndOfRightParenthesis(expression, i) {
		let pos = i;
		let parenthesisCounter = 1;

		while (parenthesisCounter !== 0 && i >= 0) {
			i--;

			if (expression.slice(i, i + 1) === Operators.RIGHT_PARENTHESIS) {
				parenthesisCounter++;
			} else if (expression.slice(i, i + 1) === Operators.LEFT_PARENTHESIS) {
				parenthesisCounter--;
			}

			pos = i;
		}

		return pos;
	}

	getOperatorSignificance(expression) {
		for (let k = 0; k < Operators.SIGNIFICANCE.length; k++) {
			for (let j = 0; j < Operators.SIGNIFICANCE[k].length; j++) {
				if (expression === Operators.SIGNIFICANCE[k][j]) {
					return k;
				}
			}
		}
		return -1;
	}

	findPositionOfRightLeastValuableOperator(expression) {
		let pos = -1;
		let leastIndex = Operators.SIGNIFICANCE.length;
		let curChar;
		for (let i = expression.length - 1; i >= 0 && leastIndex !== 0; i--) {
			curChar = expression.slice(i, i + 1);

			// If there is a parenthesis in expression - skip it
			if (curChar === Operators.RIGHT_PARENTHESIS) {
				let parenthesisCounter = 1;

				while (parenthesisCounter !== 0) {
					i--;

					if (expression.slice(i, i + 1) === Operators.RIGHT_PARENTHESIS) {
						parenthesisCounter++;
					} else if (expression.slice(i, i + 1) === Operators.LEFT_PARENTHESIS) {
						parenthesisCounter--;
					}
				}
			}

			for (let k = 0; k < Operators.SIGNIFICANCE.length; k++) {
				for (let j = 0; j < Operators.SIGNIFICANCE[k].length; j++) {
					if (curChar === Operators.SIGNIFICANCE[k][j] && leastIndex > k) {
						// Check on unary minus
						if (this.unaryMinusCheck(expression, i) && leastIndex === Operators.SIGNIFICANCE.length) {
							pos = i;
							continue;
						}

						leastIndex = k;
						pos = i;
					}
				}
			}
		}

		return pos;
	}

	unaryMinusCheck(expression, pos) {
		if (pos === -1) return false;
		if (
			expression.slice(pos, pos + 1) === Operators.MINUS &&
			(pos === 0 || expression.slice(pos - 1, pos) === Operators.LEFT_PARENTHESIS)
		) {
			return true;
		}

		return false;
	}
}
export default OperationManager;