const { app, BrowserWindow } = require('electron');
const path = require('path');
require('./backend/background');

function createWindow() {
    //Cria uma janela de navegação
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        title: 'Dashboard',
        icon: path.join(__dirname, 'public/img/Loading-page.svg'),
        webPreferences: {
            nodeIntegration: true
        }
    });

    // e carrega o arquivo index.html do seu aplicativo.
    win.loadFile('public/index.html');

    // Abrir o DevTools (aba de ferramentas para desenvolvedores).
    win.webContents.openDevTools();
}

// Este método será chamado quando Electron terminar de inicializar
// e também estiver pronto para criar novas janelas do navegador.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.on('ready', () => createWindow());

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});