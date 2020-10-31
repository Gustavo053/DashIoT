let btStandardSelect = document.querySelectorAll('.bt-standard-select');
let btActionSelect = document.querySelectorAll('.bt-action-select')
let valueDigital = document.querySelectorAll('.bt-digital-value');

//Adiciona a classe no botão ativado (botão selecionado) do tipo de 
//dado que irá ser manuseado (analógico digital)
btStandardSelect.forEach(element => {
    element.addEventListener('click', () => {
        for(let i = 0; i < btStandardSelect.length; i++) {
            btStandardSelect[i].classList.remove('bt-selected');
        }
        element.classList.add('bt-selected');
    });
});

//Adiciona a classe no botão ativado (botão selecionado) do tipo de
//ação que irá ser executado (escrita, leitura, leitura e escrita)
btActionSelect.forEach(element => {
    element.addEventListener('click', () => {
        for(let i = 0; i < btActionSelect.length; i++) {
            btActionSelect[i].classList.remove('bt-selected');
        }
        if (element.getAttribute('option') == 'plot') {
            element.classList.add('bt-selected-2');
        } else {
            element.classList.add('bt-selected');
        }
    });
});

//Adiciona a classe no valor escolhido pelo usuário na escrita digital
//HIGH or LOW (1 ou 0 / ligado ou desligado)
valueDigital.forEach(element => {
    element.addEventListener('click', () => {
        for(let i = 0; i < valueDigital.length; i++) {
            valueDigital[i].classList.remove('bt-selected');
        }
        element.classList.add('bt-selected');
    });
});

