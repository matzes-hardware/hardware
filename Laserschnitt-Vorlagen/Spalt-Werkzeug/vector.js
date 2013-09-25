
Vector = function(x, y) {
    
    var instance = {
            x: x,
            y: y,
            length: Math.sqrt( Math.pow(x,2) + Math.pow(y,2) )
    }
    
    /*
     * v = (x y)
     * o = (a b)
     * x*a + y*b = 0
     * a = 1
     * x = -y*b
     * b = -x/y 
     */
    instance.getOrthogonalVector = function() {
        return Vector(1, -this.x/this.y);;
    }

    instance.normalized = function() {
        return Vector(this.x/this.length, this.y/this.length);
    }
    
    instance.multiply = function(a) {
        return Vector(this.x*a, this.y*a);
    }
    
    instance.string = function() {
        return '('+this.x+', '+this.y+')';
    }
    
    return instance;
}
