/**
 * Controller event handlers
 */
function pressA(player: number = 1): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                startGame()
            }
            break

        case GameMode.Main:
            break
    }   // switch (g_state.Mode)
}

function pressB(player: number = 1): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1 && GameState.list().length > 0) {
                GameStateUI.load()
            }
            break

        case GameMode.Main:
            break
    }   // switch (g_state.Mode)
}

function pressDown(player: number = 1): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                startGame()
            }
            break

        case GameMode.Main:
            break
    }   // switch (g_state.Mode)
}

function pressLeft(player: number = 1): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                startGame()
            }
            break

        case GameMode.Main:
            break
    }   // switch (g_state.Mode)
}

function pressMenu(): void {
    if (PauseMenu.menuVisible()) {
        PauseMenu.release()
    } else {
        PauseMenu.show()
    }
}

function pressRight(player: number = 1): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                startGame()
            }
            break

        case GameMode.Main:
            break
    }   // switch (g_state.Mode)
}

function pressUp(player: number = 1) {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                startGame()
            }
            break

        case GameMode.Main:
            break
    }   // switch (g_state.Mode)
}

/**
 * Single player version
 */
controller.A.onEvent(ControllerButtonEvent.Pressed, () => pressA())
controller.B.onEvent(ControllerButtonEvent.Pressed, () => pressB())
controller.down.onEvent(ControllerButtonEvent.Pressed, () => pressDown())
controller.left.onEvent(ControllerButtonEvent.Pressed, () => pressLeft())
controller.right.onEvent(ControllerButtonEvent.Pressed, () => pressRight())
controller.up.onEvent(ControllerButtonEvent.Pressed, () => pressUp())
controller.menu.onEvent(ControllerButtonEvent.Pressed, () => pressMenu())

/**
 * Multiplayer version
 */
/*
// Player 1
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(1))
controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(1))
controller.player1.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(1))
controller.player1.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(1))
controller.player1.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(1))
controller.player1.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(1))
controller.menu.onEvent(ControllerButtonEvent.Pressed, () => pressMenu())

// Player 2
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(2))
controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(2))
controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(2))
controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(2))
controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(2))
controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(2))

// Player 3
controller.player3.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(3))
controller.player3.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(3))
controller.player3.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(3))
controller.player3.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(3))
controller.player3.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(3))
controller.player3.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(3))

// Player 4
controller.player4.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(4))
controller.player4.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(4))
controller.player4.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(4))
controller.player4.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(4))
controller.player4.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(4))
controller.player4.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(4))
*/
