const { app, BrowserWindow, Menu } = require('electron')
let win;
let splash;
let path = require('path');

const application = require('./application');

function createWindow () {
  
  //Janela de loading
  splash = new BrowserWindow({ 
    width: 300, 
    height: 300,
    transparent:true,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    frame: false
  });

  splash.loadFile('splash.html')

  // Criar uma janela de navegação.
  win = new BrowserWindow({
    width: 600,
    height: 350,
    resizable: false,
    show: false,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitido quando a janela é fechada.
  win.on('closed', () => {
    // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
    // em um array, se seu app suporta várias janelas, este é o momento
    // quando você deve excluir o elemento correspondente.
    win = null
  })

  application.start();

  win.once('ready-to-show', () => {
    setTimeout(function(){ 
        splash.close();
        splash = null;
        win.show();
    }, 3000);
  })

}

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e está pronto para criar a janela browser.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
Menu.setApplicationMenu(null);
app.on('ready', createWindow)

// Finaliza quando todas as janelas estiverem fechadas.
app.on('window-all-closed', () => {
  // No macOS é comum para aplicativos e sua barra de menu 
  // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// Neste arquivo, você pode incluir o resto do seu aplicativo especifico do processo
// principal. Você também pode colocar eles em arquivos separados e requeridos-as aqui.