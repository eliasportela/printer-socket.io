'use strict';

const net           = require('net');
const compiler      = require('./compiler');
const socketTimeout = 2500;

let Printer = class Printer {

  // @name constructor
  // @description Cria nova conexão com socket através da porta e ip
  // @params {Object} options - IP e porta
  // @returns {Promise}
  constructor(options) {

    // Abre socket e seta timeout
    this.client = new net.Socket();
    this.client.setTimeout(socketTimeout);

    return new Promise((resolve, reject) => {

      // Connecta usando porta e ip
      this.client.connect(options.port, options.ip, () => {
        return resolve(this);
      });

      // Trata timeout da impressora
      this.client.on('timeout', (exception) => {
        return reject({ description: 'Não foi possível conectar com a impressora ou ela foi desligada', code: 301 });
      });

      this.client.on('error', (exception) => {
        return reject({ description: 'Não foi possível conectar com a impressora ou ela foi desligada', code: 302 });
      });
    });
  }

  // @name print
  // @description Imprime dados vindos de um cliente
  // @params {Object} Contem layout e dados (opcionais)
  // @returns {Promise}
  print(options) {
    return new Promise((resolve, reject) => {
      return compiler.compile(options).then((content) => {
        for(let i = 0; i < options.copies; i++) {
          this.client.write(content);
        }

        return resolve();
      });
    });
  }
}

module.exports = Printer;