var Token = require("../token");

module.exports = function(stream) {
  stream.each(function() {
    Token.current_token = this
    
    if(this.blockType != "function") return

    var class_name = this.class_name
    var super_class = this.super_class


    var curly = this

    var _super = curly.next.find(function() {
      if(this.text == "super") return true
      if(this.matching == curly) return false
      if(this.blockType == "function") return this.matching.next
    })

    if(_super) {
      var brack = _super.nextNW()

      if(brack.lbracket) {

        brack.nextNW() != brack.matching
          ? brack.after("this, ")
          : brack.after("this")
        brack.before(".call")
      }
      else {
        _super.after("(this, arguments)")
        brack = _super.nextNW()
        brack.before(".apply")
      }
      
      if(this.class_name) {
        _super.replaceWith(this.class_name + ".__super__")
      } else {

        var eq = curly.blockTypeNode.prevNW()
        if(!eq.assign) throw "don't know which method to call for super"
        var method = eq.prevNW()
        
        var start = method.expressionStart();
        var text = start.collectText(method);
        var methodText = method.text;
        
        if (text === "this.constructor." + methodText) {
          _super.replaceWith("this.__super__." + methodText)
        } else if (text === "this." + methodText) {
          _super.replaceWith("this.constructor.prototype." + methodText)
        } else if (/^\w+\./.test(text)) {
          chain = text.match(/(\w+\.)/g);
          _super.replaceWith(chain.join('') + "__super__." + methodText)
        } else // Don't know if this will ever hit...
          _super.replaceWith("this.constructor.prototype." + methodText)
          
          /*
          if(text.match(".prototype.")) {
            caller = text.split(".prototype.")[0]
          } else {
            caller = text + ".constructor" //replace(/\.$/,"")
          }
          //*/
      }
    }
    else {
      if(this.class_name && this.super_class && this.inserted_body) {
        curly.nextNW().before(" " + this.class_name + ".__super__.constructor.apply(this, arguments)")
      }
    }
  })
}



