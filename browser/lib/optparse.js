require.module('lib/optparse', function(exports, require) {
//////////////////////


//from coffeescript

(function(){
  var LONG_FLAG, MULTI_FLAG, OPTIONAL, OptionParser, SHORT_FLAG, buildRule, buildRules, normalizeArguments;
  // A simple **OptionParser** class to parse option flags from the command-line.
  // Use it like so:
  //     parser:  new OptionParser switches, helpBanner
  //     options: parser.parse process.argv
  exports.OptionParser = (function() {
    OptionParser = function(rules, banner) {
      this.banner = banner;
      this.rules = buildRules(rules);
      return this;
    };
    // Initialize with a list of valid options, in the form:
    //     [short-flag, long-flag, description]
    // Along with an an optional banner for the usage help.
    // Parse the list of arguments, populating an `options` object with all of the
    // specified options, and returning it. `options.arguments` will be an array
    // containing the remaning non-option arguments. This is a simpler API than
    // many option parsers that allow you to attach callback actions for every
    // flag. Instead, you're responsible for interpreting the options object.
    OptionParser.prototype.parse = function(args) {
      var _a, _b, _c, arg, isOption, matchedRule, options, rule;
      options = {
        arguments: []
      };
      args = normalizeArguments(args);
      while ((arg = args.shift())) {
        isOption = !!(arg.match(LONG_FLAG) || arg.match(SHORT_FLAG));
        matchedRule = false;
        _b = this.rules;
        for (_a = 0, _c = _b.length; _a < _c; _a++) {
          rule = _b[_a];
          if (rule.shortFlag === arg || rule.longFlag === arg) {
            options[rule.name] = rule.hasArgument ? args.shift() : true;
            matchedRule = true;
            break;
          }
        }
        if (isOption && !matchedRule) {
          throw new Error(("unrecognized option: " + arg));
        }
        if (!(isOption)) {
          options.arguments.push(arg);
        }
      }
      return options;
    };
    // Return the help text for this **OptionParser**, listing and describing all
    // of the valid options, for `--help` and such.
    OptionParser.prototype.help = function() {
      var _a, _b, _c, _d, i, letPart, lines, rule, spaces;
      lines = ['Available options:'];
      if (this.banner) {
        lines.unshift(("" + this.banner + "\n"));
      }
      _b = this.rules;
      for (_a = 0, _c = _b.length; _a < _c; _a++) {
        rule = _b[_a];
        spaces = 15 - rule.longFlag.length;
        spaces = spaces > 0 ? (function() {
          _d = [];
          for (i = 0; i <= spaces; i += 1) {
            _d.push(' ');
          }
          return _d;
        })().join('') : '';
        letPart = rule.shortFlag ? rule.shortFlag + ', ' : '    ';
        lines.push(("  " + letPart + rule.longFlag + spaces + rule.description));
      }
      return "\n" + (lines.join('\n')) + "\n";
    };
    return OptionParser;
  })();
  // Helpers
  // -------
  // Regex matchers for option flags.
  LONG_FLAG = /^(--\w[\w\-]+)/;
  SHORT_FLAG = /^(-\w)/;
  MULTI_FLAG = /^-(\w{2,})/;
  OPTIONAL = /\[(.+)\]/;
  // Build and return the list of option rules. If the optional *short-flag* is
  // unspecified, leave it out by padding with `null`.
  buildRules = function(rules) {
    
    var r = [], i, tuple;

    for (i = 0; i < rules.length; i++) {
      tuple = rules[i];

      if (tuple.length < 3) {
        tuple.unshift(null);
      }
      r.push(buildRule.apply(this, tuple));
    }
    return r;
  };
  // Build a rule from a `-o` short flag, a `--output [DIR]` long flag, and the
  // description of what the option does.
  buildRule = function(shortFlag, longFlag, description) {
    var match;
    match = longFlag.match(OPTIONAL);
    longFlag = longFlag.match(LONG_FLAG)[1];
    return {
      name: longFlag.substr(2),
      shortFlag: shortFlag,
      longFlag: longFlag,
      description: description,
      hasArgument: !!(match && match[1])
    };
  };
  // Normalize arguments by expanding merged flags into multiple flags. This allows
  // you to have `-wl` be the same as `--watch --lint`.
  normalizeArguments = function(args) {
    var _a, _b, _c, _d, _e, _f, arg, l, match, result;
    args = args.slice(0);
    result = [];
    _b = args;
    for (_a = 0, _c = _b.length; _a < _c; _a++) {
      arg = _b[_a];
      if ((match = arg.match(MULTI_FLAG))) {
        _e = match[1].split('');
        for (_d = 0, _f = _e.length; _d < _f; _d++) {
          l = _e[_d];
          result.push('-' + l);
        }
      } else {
        result.push(arg);
      }
    }
    return result;
  };
})();



/////////////////////////
})