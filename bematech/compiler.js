'use strict';

const fs          = require('fs');
const parseString = require('xml2js').parseString;
const util        = require('util');
const handlebars  = require('./handlebars')();
const async       = require('async');
const commands    = require('./commands');

module.exports = {

  // @name constructor
  // @description Cria nova conexão com socket através da porta e ip
  // @params {Object} options - IP e porta
  // @returns {Promise}
  compile(options) {
    return new Promise((resolve, reject) => {
      this._loadTemplate(options).then((xml) => {
        this._compileTemplate(xml, options).then((result) => {
          this._readNodes(result).then((result) => {
            resolve(result);
          });
        });
      });
    });
  },

  // @name constructor
  // @description Cria nova conexão com socket através da porta e ip
  // @params {Object} options - IP e porta
  // @returns {Promise}
  _loadTemplate(options) {
    return new Promise((resolve) => {
      return fs.readFile(`${__dirname}/layouts/${options.layout}.xml`, (error, xml) => {
        if(error) {
          console.log(error);
          // TODO
        }
        return resolve(xml);
      });
    });

  },

  // @name constructor
  // @description Cria nova conexão com socket através da porta e ip
  // @params {Object} options - IP e porta
  // @returns {Promise}
  _compileTemplate(xml, options) {
    return new Promise((resolve) => {

       // Compila handlebars, com possíveis dados vindos de fora
      let tmpl = handlebars.compile(xml.toString());
      let compiledTmpl = tmpl(options.data);

      parseString(compiledTmpl, (err, result) => {
        if(err) {
          console.log(err);
        }
        resolve(result);
      });
    });
  },

  // @name constructor
  // @description Cria nova conexão com socket através da porta e ip
  // @params {Object} options - IP e porta
  // @returns {Promise}
  _readNodes(xml) {
    let content = "";

    return new Promise((resolve, reject) => {

      // Itera elemento por elemento
      // Usa async forçando processamento sincrono para evitar erros
      async.eachSeries(xml.root.line, function iterator(line, callback) {
        commands.reset().then((result) => {
          content += result;

          // Se elemento não tiver nenhuma formatação, imprime conteudo
          if(typeof line === 'string') {
            content+= `${line}\n`;

            // Continua processamento
            callback();

          // Elemento tem formatação
          } else {

            // Formata elemento
            commands.format(line.$).then((result) => {
              content+= `${result.commands}${line._}${result.display}`;
              callback();
            });
          }
        });
      }, function done() {
        if(xml.root.$) {
          commands.format(xml.root.$).then((result) => {
            content+= `${result.commands}`;
            resolve(content);
          });
        } else {
          resolve(content);
        }
      });
    });
  }
};