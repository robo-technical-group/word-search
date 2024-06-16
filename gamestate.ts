/**
 * Current game state
 */
/**
 * Interface that can be translated to/from JSON.
 */
interface IGameState {
    gameMode: GameMode
}

class GameState {
    private static readonly KEY_PREFIX: string = 'jst_'
    private static readonly SAVE_TEXT: string = 'SAVE GAME'

    private gameMode: GameMode

    constructor() {
        this.gameMode = GameMode.NotReady
    }

    /**
     * Public properties
     */
    public get Mode(): GameMode {
        return this.gameMode
    }

    public set Mode(value: GameMode) {
        this.gameMode = value
    }

    public get State(): IGameState {
        return {
            gameMode: this.gameMode,
        }
    }

    /**
     * Public methods
     */
    public static addSystemMenuItem(handler: () => void): void {
        if (infoScreens.addMenuOption != undefined) {
            infoScreens.addMenuOption(GameState.SAVE_TEXT, assets.image`saveIcon`, handler)
        }
    }

    public static delete(filename: string): void {
        if (filename.indexOf(GameState.KEY_PREFIX) != 0) {
            filename = GameState.KEY_PREFIX + filename
        }
        if (settings.exists(filename)) {
            settings.remove(filename)
        }
    }

    public static exists(filename: string): boolean {
        if (filename.indexOf(GameState.KEY_PREFIX) != 0) {
            filename = GameState.KEY_PREFIX + filename
        }
        return settings.exists(filename)
    }

    public static list(): string[] {
        return settings.list(GameState.KEY_PREFIX).map((value: string, index: number) =>
            value.slice(GameState.KEY_PREFIX.length)
        )
    }

    public static loadFromSetting(key: string): GameState {
        if (key.indexOf(GameState.KEY_PREFIX) != 0) {
            key = GameState.KEY_PREFIX + key
        }
        if (settings.exists(key)) {
            let toReturn: GameState = new GameState()
            if (toReturn.loadState(settings.readJSON(key))) {
                return toReturn
            } else {
                return null
            }
        } else {
            return null
        }
    }

    /**
     * Return false if game state cannot be loaded.
     */
    public loadState(state: any): boolean {
        if (typeof state != 'object') {
            return false
        }
        if (typeof state.gameMode == 'number') {
            this.gameMode = state.gameMode
        } else {
            this.gameMode = GameMode.NotReady
        }
        return true
    }

    public static rename(oldname: string, newname: string): boolean {
        if (oldname.indexOf(GameState.KEY_PREFIX) != 0) {
            oldname = GameState.KEY_PREFIX + oldname
        }
        if (newname.indexOf(GameState.KEY_PREFIX) != 0) {
            newname = GameState.KEY_PREFIX + newname
        }
        if (!settings.exists(oldname) || settings.exists(newname)) {
            return false
        }
        settings.writeJSON(newname, settings.readJSON(oldname))
        settings.remove(oldname)
        return true
    }

    /**
     * Destroy resources that are not automatically released by the garbage collector.
     * For example, if any sprites are created within the game state, then they need
     * + to be destroyed.
     */
    public release(): void {
        return
    }

    public save(filename: string): void {
        if (filename.indexOf(GameState.KEY_PREFIX) == -1) {
            filename = GameState.KEY_PREFIX + filename
        }
        settings.writeJSON(filename, this.State)
    }

    public static savesExist(): boolean {
        return settings.list(GameState.KEY_PREFIX).length > 0
    }
}

namespace GameStateUI {
    enum ManageActions {
        Rename,
        Delete,
    }

    const DELETE_CONFIRM: string = 'Delete saved game?'
    const DELETED_FILE: string = '--Deleted--'
    const FILENAME_PROMPT: string = 'Enter filename.'
    const GAME_SAVE_CONFIRM: string = 'Game saved!'
    const GAME_SAVE_CANCEL: string = 'Game save cancelled.'
    const GAME_SAVE_EMPTY: string = 'No game saves found.'
    const LOAD_ERROR: string = 'Error loading file'
    const LOAD_TITLE: string = 'Select game to load.'
    const MANAGE_MENU_TITLE: string = 'A=Rename B=Delete'
    const RENAME_EXISTS: string = 'New name already exists.'
    const RENAME_PROMPT: string = 'Enter new name.'
    const TEXT_CLOSE: string = '--Close menu--'
    const Z: number = 255

    let controllerMenu: miniMenu.MenuSprite = null
    let isManageVisible: boolean = false
    let fileMenu: miniMenu.MenuSprite = null
    let fileToLoad: string = ''
    let manageMenu: miniMenu.MenuSprite = null

    export function load(): void {
        g_state.Mode = GameMode.NotReady
        let menuItems: miniMenu.MenuItem[] = []
        if (menuItems.length > 10) {
            menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        }
        for (let f of GameState.list()) {
            menuItems.push(miniMenu.createMenuItem(f))
        }
        menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        fileMenu = miniMenu.createMenuFromArray(menuItems)
        fileMenu.setTitle(LOAD_TITLE)
        setCommonSettings(fileMenu)
        fileMenu.onButtonPressed(controller.A, loadFileSelected)
        g_state.Mode = GameMode.PauseMenu
    }

    function loadFileSelected(selection: string, selectedIndex: number): void {
        if (selectedIndex >= GameState.list().length ||
            selection == TEXT_CLOSE) {
            // User selected to close menu without selecting a file.
            fileMenu.close()
            g_state.Mode = GameMode.Attract
            return
        }
        let newGame: GameState = GameState.loadFromSetting(selection)
        if (newGame == null) {
            game.splash(LOAD_ERROR + ' ' + selection)
            return
        }
        fileMenu.close()
        Attract.splashScreen.release()
        let oldState: GameState = g_state
        g_state = newGame
        oldState.release()
        switch (newGame.Mode) {
            case GameMode.Main:
            default:
                // For now, just start a new game.
                startGame()
                break
        }
    }

    export function manage(): void {
        if (isManageVisible) {
            return
        }
        if (GameState.list().length == 0) {
            game.splash(GAME_SAVE_EMPTY)
            return
        }
        if (PauseMenu.menuVisible()) {
            PauseMenu.hide()
        }
        let menuItems: miniMenu.MenuItem[] = []
        for (let f of GameState.list()) {
            menuItems.push(miniMenu.createMenuItem(f))
        }
        menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        manageMenu = miniMenu.createMenuFromArray(menuItems)
        manageMenu.setTitle(MANAGE_MENU_TITLE)
        setCommonSettings(manageMenu)
        manageMenu.onButtonPressed(controller.A, manageMenuSelectedA)
        manageMenu.onButtonPressed(controller.B, manageMenuSelectedB)
        isManageVisible = true
    }

    function manageMenuSelected(selection: string, selectedIndex: number, action: ManageActions): void {
        if (selection == TEXT_CLOSE) {
            manageMenu.close()
            if (PauseMenu.menuRunning()) {
                PauseMenu.show()
            }
            isManageVisible = false
            return
        }
        manageMenu.buttonEventsEnabled = false
        switch (action) {
            case ManageActions.Delete:
                if (game.ask(DELETE_CONFIRM, selection)) {
                    GameState.delete(selection)
                    manageMenu.items[selectedIndex].text = DELETED_FILE
                }
                break

            case ManageActions.Rename:
                let n: string | undefined = game.askForString(selection +
                    ' ' + RENAME_PROMPT)
                if (n == undefined) {
                    break
                }
                if (GameState.rename(selection, n)) {
                    manageMenu.items[selectedIndex].text = n
                } else {
                    game.splash(RENAME_EXISTS)
                }
                break
        }
        manageMenu.buttonEventsEnabled = true
    }

    function manageMenuSelectedA(selection: string, selectedIndex: number) {
        manageMenuSelected(selection, selectedIndex, ManageActions.Rename)
    }

    function manageMenuSelectedB(selection: string, selectedIndex: number) {
        manageMenuSelected(selection, selectedIndex, ManageActions.Delete)
    }

    export function save(gameModeToSave: GameMode): void {
        let filename: string | undefined = game.askForString(FILENAME_PROMPT)
        if (filename == undefined) {
            game.splash(GAME_SAVE_CANCEL)
            return
        }
        let currMode: GameMode = g_state.Mode
        g_state.Mode = gameModeToSave
        g_state.save(filename)
        g_state.Mode = currMode
        game.splash(GAME_SAVE_CONFIRM)
    }

    function setCommonSettings(m: miniMenu.MenuSprite) {
        m.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 140)
        m.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 100)
        m.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Foreground, Color.White)
        m.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Background, Color.Wine)
        m.top = 10
        m.left = 10
        m.z = Z
    }
}

namespace GameStateTests {
    export function start() {
        // Try to initialize game state with an incomplete object.
        let s: any = {
            players: [
                {
                    name: 'Robo',
                    controllerId: 1,
                    avatar: 9,
                }, {
                    name: 'Xander',
                    controllerId: 2,
                    avatar: 6,
                }, {
                    name: 'Lex',
                    controllerId: 3,
                    avatar: 2,
                }, {
                    name: 'Solar',
                    controllerId: 4,
                    avatar: 1,
                },
            ],
        }
        g_state.loadState(s)
        startGame()
    }
}
