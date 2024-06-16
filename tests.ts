namespace Tests {
    export const TESTING_KEY: string = 'CURRENT_TEST'
    const TITLE: string = '** TESTING MODE **'
    const INSTRUCTIONS: string = 'Stop tests in system menu.'

    export function run(): void {
        let currTest: number = 0
        if (settings.exists(TESTING_KEY)) {
            currTest = settings.readNumber(TESTING_KEY)
        } else {
            settings.writeNumber(TESTING_KEY, currTest)
        }

        switch (currTest) {
            default:
                // Restart tests upon reboot
                currTest = -1
                splash('No tests found. Why not write some!')
                break
        }

        currTest++
        settings.writeNumber(TESTING_KEY, currTest)
    }

    function splash(message: string): void {
        game.showLongText(TITLE + '\n' + message + '\n' + INSTRUCTIONS,
            DialogLayout.Full)
    }
}
