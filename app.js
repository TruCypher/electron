const electron = require('electron');

const url = require('url');
const path = require('path');


const {app, BrowserWindow, Menu, ipcMain} = electron;

//hello
//SET EVN
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;
const setting = {
    minWidth:400,
    minHeight:800,
    alwaysOnTop:true,
    frame:true,
    thickFrame:false,
}

app.on('ready', function() {
    //create window app is listening

    mainWindow = new BrowserWindow(setting);

    //load html

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: 'file',
        slashes: true
    }));

    //Quit app

    mainWindow.on('close',function(){
        app.quit();
    })

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);

}) //app.onEnd

//handle and create add widow
function createAddWindow() {

   addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    });

   //load html

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: 'file',
        slashes: true
    }));

    //set menu only for this BrowserWindow
    addWindow.setMenu(Menu.buildFromTemplate([
        {
            label:'DevToold',
            submenu:[
                {role:'toggledevtools'},
                {role:'reload'}
            ]
        }
    ]));

    //garbade coollection
    addWindow.on('close', function() {
        addWindow = null;
    })
}


//catch item:add
ipcMain.on('item:add',(e,item) => {
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});

//create template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: "Add Item",
                click() {
                    createAddWindow();
                }
            },
            {
                label: "Clear Item",
                click()
                {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];


if(process.platform == 'darwin')
    mainMenuTemplate.push({});


if(process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'DeveloperTools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow)
                {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            } ]
    });
}






