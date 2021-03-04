function vibrateButton(secs){
    window.navigator.vibrate(secs);
}

class Stack {
    constructor(){
        this.items=[];
    }

    push(elem){
        this.items.push(elem);
    }
    pop(){
        if (this.items.length == 0) 
            return "Underflow"; 
        return this.items.pop(); 
    }
}
