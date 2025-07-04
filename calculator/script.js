class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.shouldResetScreen = false;
        
        this.previousOperandElement = document.getElementById('previous-operand');
        this.currentOperandElement = document.getElementById('current-operand');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
    
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
            
           
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleButtonClick(e.target);
                }
            });
        });
        
    
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
    }
    
    handleButtonClick(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
      
        this.addButtonPressEffect(button);
        
        if (action === 'clear') {
            this.clear();
        } else if (action === 'delete') {
            this.delete();
        } else if (action === 'operator') {
            this.chooseOperation(value);
        } else if (action === 'equals') {
            this.compute();
        } else if (value) {
            this.appendNumber(value);
        }
        
        this.updateDisplay();
    }
    
    handleKeyboardInput(e) {
        const key = e.key;
        
  
        if (key >= '0' && key <= '9' || key === '.') {
            this.appendNumber(key);
        } else if (key === '+' || key === '-') {
            this.chooseOperation(key);
        } else if (key === '*') {
            this.chooseOperation('*');
        } else if (key === '/') {
            e.preventDefault();
            this.chooseOperation('/');
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            this.compute();
        } else if (key === 'Backspace') {
            e.preventDefault();
            this.delete();
        } else if (key === 'Escape') {
            this.clear();
        } else if (key === '%') {
            this.chooseOperation('%');
        }
        
        this.updateDisplay();
    }
    
    addButtonPressEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }
    
    delete() {
        if (this.shouldResetScreen) {
            this.clear();
            return;
        }
        
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }
    
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.shouldResetScreen = true;
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }
    
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbol}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
    
    getOperationSymbol(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            case '%': return '%';
            default: return operation;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});

window.addEventListener('load', () => {
    const calculator = document.querySelector('.calculator');
    calculator.style.opacity = '0';
    calculator.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        calculator.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        calculator.style.opacity = '1';
        calculator.style.transform = 'translateY(0)';
    }, 100);
}); 