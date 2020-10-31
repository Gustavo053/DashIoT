const { ipcRenderer } = require('electron');

let port = document.getElementById('port').value;
let database = document.getElementById('database').value;
let broker = document.getElementById('broker').value;

let action;
let execAction;
let scriptRubyAnalog;
let scriptRubyDigital;
//variável de leitura HIGH or LOW da escrita digital
let writeDigitalValue;

function readValues() {
    let valueTypeAction = document.querySelectorAll('.bt-standard-select');
    valueTypeAction.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            //pega a escolha da ação do usuário (analógica ou digital)
            action = element.getAttribute('typeAction');
            console.log(action);
        });
    });

    let valueExecAction = document.querySelectorAll('.bt-action-select');
    valueExecAction.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            //pega a escolha da execução do usuário (leitura, escrita ou leitura e escrita)
            execAction = element.getAttribute('option');
            //pega os scripts para a execução
            scriptRubyAnalog = element.getAttribute('data-analog-script');
            scriptRubyDigital = element.getAttribute('data-digital-script');
            console.log(execAction);
            console.log(scriptRubyAnalog);
        });
    });

    let writeValues = document.querySelectorAll('.bt-digital-value');
    writeValues.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();

            //pega a escrita digital (1 ou 0 / HIGH or LOW)
            writeDigitalValue = element.getAttribute('data-value');
        });
    });
}

//Essa função ler os valores de execução que o usuário escolheu.
readValues();

//Esse código pega o evento de click do botão enviar, restaura o comportamente 
//e chama a função passando o dado para o background.
document.getElementById('enviar').addEventListener('click', (event) => {
    event.preventDefault();

    //verifica qual foi a escolha (analógica/digital) e qual a ação que será executada
    if (action == 'analog') {
        if (execAction == 'read') {
            let readPin = document.getElementById('pinReadAnalog').value;
            let data = scriptRubyAnalog + ' ' + readPin;
            console.log(data);
            // envioMsg(data);
        } else if (execAction == 'write') {
            let writePin = document.getElementById('pinWriteAnalog').value;
            let value = document.getElementById('value').value;
            let channel1 = document.getElementById('channel1').value;
            console.log(value);
            console.log(channel1);
            let resolution1 = document.getElementById('resolution1').value;

            //validação do canal
            if (!channel1 || channel1 == undefined || channel1 == null) {
                channel1 = '0';
            }

            //validação da resolução
            if (!resolution1 || resolution1 == 'undefined' || resolution1 == null) {
                resolution1 = '10';
            }

            //validação se os valores não vieram null
            if ((!value || value == 'undefined' || value == null) || (writePin == 'undefined' || writePin == null)) {
                alert('It is necessary to pass a value');
            } else {
                let data = scriptRubyAnalog + ' ' + writePin + ' ' + value + ' ' + channel1 + ' ' + resolution1;
                console.log(data);
                // envioMsg(data);
            }
        } else if (execAction == 'readAndWrite') {
            let readPin = document.getElementById('pinReadWriteAnalog1').value;
            let writePin = document.getElementById('pinReadWriteAnalog2').value;
            let channel2 = document.getElementById('channel2').value;
            let resolution2 = document.getElementById('resolution2').value;

            //validação do canal
            if (!channel2 || channel2 == 'undefined' || channel2 == null) {
                channel2 = '0';
            }

            //validação da resolução
            if (!resolution2 || resolution2 == 'undefined' || resolution2 == null) {
                resolution2 = '10';
            }

            if ((readPin == 'undefined' || readPin == null) || (writePin == 'undefined' || writePin == null)) {
                alert('It is necessary to pass the pins');
            } else {
                let data = scriptRubyAnalog + ' ' + readPin + ' ' + writePin + ' ' + channel2 + ' ' + resolution2;
                console.log(data);
                // envioMsg(data);
            }
        }
    } else if (action == 'digital') {
        if (execAction == 'read') {
            let readPin = document.getElementById('pinReadDigital').value;

            let data = scriptRubyDigital + ' ' + readPin;
            console.log(data);
            // envioMsg(data); do usuário
        } else if (execAction == 'write') {
            let writePin = document.getElementById('pinWriteDigital').value;

            let data = scriptRubyDigital + ' ' + writePin + ' ' + writeDigitalValue;
            console.log(data);
            // envioMsg(data);
        } else if (execAction == 'readAndWrite') {
            let readPin = document.getElementById('pinReadWriteDigital1').value;
            let writePin = document.getElementById('pinReadWriteDigital2').value;

            let data = scriptRubyDigital + ' ' + readPin + ' ' + writePin;
            console.log(data);
            // envioMsg(data);
        }
    }

    // let data;

    // let read = document.getElementById('leitura').value;
    // let write = document.getElementById('escrita').value

    // data = read + " " + porta + " " + leitura + " " + escrita;
    // console.log(data);

    // envioMsg(data);
});

//Esse código pega o evento de click do botão parar, restaura o comportamento e 
//chama a função passando o dado para o background.
document.getElementById('parar').addEventListener('click', (event) => {
    event.preventDefault();
    envioMsg('^C');
});

function envioMsg(data) {
    //envia uma mensagem através do canal send-message para o backend, enviando o dado de execução
    ipcRenderer.send('send-message', data);
}

function parar(data) {
    //envia uma mensagem através do canal send-message para o backend, mandando parar a execução
    ipcRenderer.send('send-message', data);
}