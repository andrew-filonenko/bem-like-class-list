var toString = Object.prototype.toString;

function BEM(initialBlock, opts) {

  opts                = opts || {};
  var bem             = {};
  var state           = {};

  state.initialBlock  = initialBlock;
  state.classList     = opts.classList     || [];
  state.currentBlock  = initialBlock;
  state.elemSeparator = opts.elemSeparator || '__';
  state.modSeparator  = opts.modSeparator  || '--';
  state.currentElem   = opts.currentElem   || null;

  bem.root =  root;
  function root() {
    state.classList.push(state.currentBlock);
    return bem;
  };

  bem.b     = block;
  bem.block = block;
  function block(block) {
    state.currentBlock = block;
    state.currentElem = null;
    return bem;
  };

  bem.e    = elem;
  bem.elem = elem;
  function elem(elem) {
    state.currentElem = elem;
    var elemClass = state.currentBlock + state.elemSeparator + elem;
    state.classList.push(elemClass);
    return bem;
  };

  bem.m   = mod;
  bem.mod = mod;
  function mod(modName) {
    var base = !state.currentElem
          ? state.currentBlock
          : state.currentBlock + state.elemSeparator + state.currentElem;
    state.classList.push(
      [base, modName].join(state.modSeparator)
    );
    return bem;
  }

  bem.modIf = modIf;
  function modIf(modName, predicat) {
    if (predicat) mod(modName);
    return bem;
  }

  bem.modkv = modkv;
  function modkv(k, v) {
    var base = !state.currentElem
          ? state.currentBlock
          : state.currentBlock + state.elemSeparator + state.currentElem;

    state.classList.push(
      [base, k, v].join(state.modSeparator)
    );
    
    return bem;
  }

  bem.c         = className;
  bem.className = className;
  function className(className, predicat) {
    if (className && (predicat == null || predicat)) {
      state.classList.push(className);
    } 
    return bem;
  };

  bem.j    = join;
  bem.join = join;
  function join() {
    var res = state.classList.join(' ');
    state.currentBlock = initialBlock;
    state.currentElem = null;
    state.classList = [];
    return res;
  };

  function endsWith() {
    var args = Array.prototype.slice.call(arguments);
    var method = args.shift();
    var prevState = JSON.stringify(state);
    return function bem() {
      var prev = JSON.parse(prevState);
      return BEM(prev.initialBlock, prev)[method]
        .apply(null, arguments)
        .join();
    };
  }

  bem.endElem  = endsWith.bind(null, 'elem');
  bem.endMod   = endsWith.bind(null, 'mod');
  bem.endClass = endsWith.bind(null, 'className');

  return bem;
};


module.exports = BEM; 
