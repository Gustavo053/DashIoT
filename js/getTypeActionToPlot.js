let elementPlotAcion = document.querySelectorAll('.bt-standard-select');

let typeActionPlot;

//Verifica qual a opção que o usuário escolheu (analógico ou digital) para enviar
//para a plotagem de dados
module.exports = () => {
    elementPlotAcion.forEach(element => {
        element.addEventListener('click', () => {
            typeActionPlot = element.getAttribute('typeAction');
            return typeActionPlot
        });
    });
};