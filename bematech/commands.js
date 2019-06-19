'use strict';

const async    = require('async');
const util    = require('util');
const methods = ['align', 'fontSize', 'textTransform', 'cut'];

module.exports = {

  // @description Reseta formatação de texto
  // @returns {Promise}
  reset() {
    let commands = "";

    return new Promise((resolve, reject) => {
      for(let i in methods) {
        commands += _commands[methods[i]]();
      }

      resolve(commands);
    });
  },

  format(options) {
    let commands = "";
    let display = "\n";

    return new Promise((resolve, reject) => {

      async.forEachOf(options, function(values, attr, callback) {

        values = values.replace(/ /g,'').split(',');
        let params = {};

        async.forEachOf(values, (value, key, _callback) => {
          params[value] = true;

          if(_commands[attr] && attr !== 'display') {
            commands += _commands[attr](params);
          }

          if(attr === 'display' && value === 'inline') {
            display = "";
          }

          _callback();
        }, function done() {
          callback();
        });
      }, function done() {
        resolve({ commands: commands, display: display });
      });
    });
  }
};

let _commands = {

  // @description Corta papel
  // @params {Object} corte total ou não
  // @returns {String}
  cut(options) {
    if(!options) options = {};

    if(options.full) {
      return `${String.fromCharCode(27)}${String.fromCharCode(105)}`;
    }

    if(options.half) {
      return `${String.fromCharCode(27)}${String.fromCharCode(109)}`;
    }

    return "";
  },

  // @description Alinha texto
  // @params {Object} left / center / right
  // @returns {String}
  align(options) {
    if(!options) options = {};
    let value;

    if(options.right) {
      value = 2;
    } else if(options.center) {
      value = 1;
    } else {
      value = 0;
    }

    return `${String.fromCharCode(27)}${String.fromCharCode(97)}${String.fromCharCode(value)}`;
  },


  fontSize(options) {
    if(!options) options = {};
    let value;

    if(options.large) {
      return `${String.fromCharCode(27)}${String.fromCharCode(86)}`
    } else if(options.expanded) {
      return `${String.fromCharCode(27)}${String.fromCharCode(87)}${String.fromCharCode(49)}`;
    } else {
      return `${String.fromCharCode(27)}${String.fromCharCode(87)}${String.fromCharCode(0)}`
    }
  },

  textTransform(options) {
    if(!options) options = {};
    let commands = "";

    // Texto sublinado
    commands+= options.underline ?
      `${String.fromCharCode(27)}${String.fromCharCode(45)}${String.fromCharCode(1)}` :
        `${String.fromCharCode(27)}${String.fromCharCode(45)}${String.fromCharCode(0)}`;

    // commands+= options.condensed ?
    //   `${String.fromCharCode(15)}` :
    //     `${String.fromCharCode(12)}`;

    // Texto em italico
    commands+= options.italic ?
      `${String.fromCharCode(27)}${String.fromCharCode(52)}` :
        `${String.fromCharCode(27)}${String.fromCharCode(53)}`;

    // Texto em italico
    commands+= options.bold ?
      `${String.fromCharCode(27)}${String.fromCharCode(69)}` :
        `${String.fromCharCode(27)}${String.fromCharCode(70)}`;

    return commands
  },

  margin(options) {
    if(!options) options = {};

    if(options.right) {
      return `${String.fromCharCode(27)}${String.fromCharCode(81)}${String.fromCharCode(options.right)}`;
    }

    if(options.left) {
      return `${String.fromCharCode(27)}${String.fromCharCode(81)}${String.fromCharCode(options.left)}`;
    }
  }
};