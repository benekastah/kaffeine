var Token = require("../token");

module.exports = function(stream) {

  stream.each(function() {
    Token.current_token = this
    
    if(this.text == "#") {

      if(this.prev.word && !this.myText().match(/^ /)) return // no whitepsace next to a word
      
      
      if(this.next.word) {
        if(this.myText().match(/ $/) /*|| !this.next.text.match(/^[0-9]+$/)*/) {
          return
        }
//        console.log("X", this.next.text)
//        if() return // no whitepsace next to a word
      }
      
      var closure = this.findClosure();
      
      hash_args = "_hash_args";
      //closure.after(hash_args + " = Array.prototype.slice.call(arguments, 0);")
      closure.vars[hash_args] = "Array.prototype.slice.call(arguments, 0)"
      var word = hash_args
      
      if (this.next.klass === "word") {
        word += "['" + this.next.text + "']"
        this.next.remove();
        ret = this.next.next
      } else
         ret = this.next
         
      this.replaceWith(word)
      return ret
    }
  })
}

