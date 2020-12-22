const { ipcRenderer } = require('electron');

let action;
let execAction;
let scriptRubyAnalog;
let scriptRubyDigital;
//variável de leitura HIGH or LOW da escrita digital
let writeDigitalValue;


function envioMsg(data) {
    //envia uma mensagem através do canal send-message para o backend, enviando o dado de execução
    ipcRenderer.send('send-message', data);
    //envia uma mensagem através do canal plot-action para o backend, enviando o tipo de plotagem
    ipcRenderer.send('plot-data', action);
}

function persistence(command) {
    ipcRenderer.send('data-persistence', command);
}

function readValues() {
    let valueTypeAction = document.querySelectorAll('.bt-standard-select');
    valueTypeAction.forEach(element => {
        element.addEventListener('click', event => {
            // event.preventDefault();
            //pega a escolha da ação do usuário (analógica ou digital)
            action = element.getAttribute('typeAction');
            console.log(action);
        });
    });

    let valueExecAction = document.querySelectorAll('.bt-action-select');
    valueExecAction.forEach(element => {
        element.addEventListener('click', event => {
            // event.preventDefault();
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

    readValues();

    let port = document.getElementById('port').value;
    let broker = document.getElementById('broker').value;

    if (!port || port == undefined || port == null) {
        alert('Port is not defined');
        return;
    }

    //verifica qual foi a escolha (analógica/digital) e qual a ação que será executada
    if (action == 'analog') {
        if (execAction == 'read') {
            let readPin = document.getElementById('pinReadAnalog').value;

            if (!broker || typeof broker == undefined || broker == null) {
                broker = '';
            }

            let data = scriptRubyAnalog + ' ' + readPin + ' ' + port + ' ' + broker;
            console.log(data);
            envioMsg(data);
        } else if (execAction == 'write') {
            let writePin = document.getElementById('pinWriteAnalog').value;
            let value = document.getElementById('value').value;
            let channel1 = document.getElementById('channel1').value;
            console.log(value);
            console.log(channel1);
            let resolution1 = document.getElementById('resolution1').value;

            if (!broker || typeof broker == undefined || broker == null) {
                broker = '';
            }

            //validação do canal
            if (!channel1 || typeof channel1 == undefined || channel1 == null) {
                channel1 = '0';
            }

            //validação da resolução
            if (!resolution1 || typeof resolution1 == undefined || resolution1 == null) {
                resolution1 = '10';
            }

            //validação se os valores não vieram null
            if ((!value || typeof value == undefined || value == null || value > 1023) || (!writePin || typeof writePin == undefined || writePin == null)) {
                alert('It is necessary to pass a value (max 1023) and write pin');
                return;
            } else {
                let data = scriptRubyAnalog + ' ' + writePin + ' ' + value + ' ' + channel1 + ' ' + resolution1 + ' ' + port + ' ' + broker;
                console.log(data);
                envioMsg(data);
            }
        } else if (execAction == 'readAndWrite') {
            let readPin = document.getElementById('pinReadWriteAnalog1').value;
            let writePin = document.getElementById('pinReadWriteAnalog2').value;
            let channel2 = document.getElementById('channel2').value;
            let resolution2 = document.getElementById('resolution2').value;

            if (!broker || typeof broker == undefined || broker == null) {
                broker = '';
            }

            //validação do canal
            if (!channel2 || typeof channel2 == undefined || channel2 == null) {
                channel2 = '0';
            }

            //validação da resolução
            if (!resolution2 || typeof resolution2 == undefined || resolution2 == null) {
                resolution2 = '12';
            }

            if ((typeof readPin == undefined || readPin == null) || (typeof writePin == undefined || writePin == null)) {
                alert('It is necessary to pass the pins');
            } else {
                let data = scriptRubyAnalog + ' ' + readPin + ' ' + writePin + ' ' + channel2 + ' ' + resolution2 + ' ' + port + ' ' + broker;
                console.log(data);
                envioMsg(data);
            }
        }
    } else if (action == 'digital') {
        if (execAction == 'read') {
            let readPin = document.getElementById('pinReadDigital').value;

            if (!broker || typeof broker == undefined || broker == null) {
                broker = '';
            }

            let data = scriptRubyDigital + ' ' + readPin + ' ' + port + ' ' + broker;
            console.log(data);
            envioMsg(data);
        } else if (execAction == 'write') {
            let writePin = document.getElementById('pinWriteDigital').value;

            if (!broker || typeof broker == undefined || broker == null) {
                broker = '';
            }

            let data = scriptRubyDigital + ' ' + writePin + ' ' + writeDigitalValue + ' ' + port + ' ' + broker;
            console.log(data);
            envioMsg(data);
        } else if (execAction == 'readAndWrite') {
            let readPin = document.getElementById('pinReadWriteDigital1').value;
            let writePin = document.getElementById('pinReadWriteDigital2').value;

            if (!broker || typeof broker == undefined || broker == null) {
                broker = '';
            }

            let data = scriptRubyDigital + ' ' + readPin + ' ' + writePin + ' ' + port + ' ' + broker;
            console.log(data);
            envioMsg(data);
        }
    }

    //desativa o botão para que o usuário não possa apertar novamente até parar a execução atual
    let buttonSubmit = document.querySelector('#enviar');

    buttonSubmit.style.backgroundColor = 'gray';
    buttonSubmit.setAttribute('disabled', true);
});

document.getElementById('start').addEventListener('click', event => {
    event.preventDefault();
    persistence('start');

    let buttonStart = document.querySelector('#start');
    buttonStart.style.backgroundColor = 'gray';
    buttonStart.setAttribute('disabled', true);
});

document.getElementById('stop').addEventListener('click', event => {
    event.preventDefault();
    persistence('stop');

    let buttonStart = document.querySelector('#start');
    buttonStart.style.backgroundColor = 'transparent';
    buttonStart.removeAttribute('disabled');
});

//Esse código pega o evento de click do botão parar, restaura o comportamento e 
//chama a função passando o dado para o background.
document.getElementById('parar').addEventListener('click', (event) => {
    event.preventDefault();
    envioMsg('^C');


    //quando o usuário para a execução, ele ativa novamente o botão
    let buttonSubmit = document.querySelector('#enviar');

    buttonSubmit.style.backgroundColor = '#00B288';
    buttonSubmit.removeAttribute('disabled');
});