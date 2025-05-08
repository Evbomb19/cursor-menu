
/*
* Custom menu that uses the browser cursor
*/
//% block="Cursor Menu"
//% icon="\uf245"
//% color=221
//% groups=["Menu","Buttons","Miscellaneous"]
//% blockGap=8
namespace cursormenu {

    /*
    * Instructions on how to use the cursor menu
    */
    //% block="Instructions"
    //% group="Miscellaneous"
    //% weight="10"
    export function readInstructions() {
        game.splash("This is a custom menu that", "uses the browser cursor");
        game.splash("You'll need to import the", "browser events extension");
        game.splash("When you click on a button", "it's action will be called");
        game.splash("In order to change a", "button inside it's action");
        game.splash("You will need to use it's", `menu's "get" function`);
        game.splash("Also, use showText instead", "of game.splash");
        game.splash("Give me feedback on", "what to improve!");
        game.splash("Hope you enjoy!   :)");
    }

    export class Button extends Sprite {
        public text: String;
        public action: Function;
        public moveWhenPressed: boolean;
        public inMenu: Menu;
        public defaultImage: Image;

        constructor(img: Image, x: number, y: number, z: number, text?: string, moveWhenPressed?: boolean) {
            let defaultImg = img.clone();
            img.printCenter(text, img.height / 2 - 3, 1, image.font5);
            super(img);

            this.defaultImage = defaultImg;

            this.setFlag(SpriteFlag.Ghost, true);
            this.setFlag(SpriteFlag.Invisible, true);

            if (text == undefined) {
                text = "";
            }
            if (moveWhenPressed == undefined) {
                moveWhenPressed = true;
            }

            this.setPosition(x, y);
            this.text = text;
            this.moveWhenPressed = moveWhenPressed;
            this.z = z;
        }

        public setText(text: string) {
            this.text = text;
            let img = this.defaultImage.clone();
            img.printCenter(text, img.height / 2 - 3, 1, image.font5);
            this.setImage(img);
        }

        public setAction(action: () => void) {
            this.action = action;
        }
        public addToAction(addition: () => void) {
            this.action = function () {
                this.action();
                addition();
            }
        }

        /*
        * @param action
        * @param button
        */
        //% block="Set Action: $action on Button: $button"
        //% group="Buttons"
        public static _setAction(action: () => void, button: Button) {
            button.action = action;
        }

        public toString(): string {
            if (this.text.length == 0) {
                return this.x + ", " + this.y;
            }
            return this.text + ", " + this.x + ", " + this.y;
        }
    }

    export class Menu {
        public buttons: Button[];
        public title: String;
        public isOpen = false;
        public enabled = true;

        constructor(buttons: Button[], title?: String) {
            this.buttons = buttons;
            if (title == undefined) {
                title = "";
            }
            this.title = title;
            for (let b of this.buttons) {
                b.inMenu = this;
            }
            this.open();
            menus.push(this);
        }

        public open() {
            if (this.isOpen) {
                return;
            }
            for (let i = 0; i < this.buttons.length; i++) {
                let b = this.buttons[i];
                b.setFlag(SpriteFlag.Ghost, false);
                b.setFlag(SpriteFlag.Invisible, false);
            }
            this.isOpen = true;
        }
        public close() {
            if (!this.isOpen) {
                return;
            }
            for (let i = 0; i < this.buttons.length; i++) {
                let b = this.buttons[i];
                b.setFlag(SpriteFlag.Ghost, true);
                b.setFlag(SpriteFlag.Invisible, true);
            }
            this.isOpen = false;
        }

        public get(index: number): Button {
            return this.buttons.get(index);
        }
        public addButton(button: Button) {
            this.buttons.push(button);
        }
        public removeButton(button: Button) {
            this.buttons.removeElement(button);
        }
        public removeIndex(index: number): Button {
            return this.buttons.removeAt(index);
        }

        public disable() {
            this.enabled = false;
        }
        public enable() {
            this.enabled = true;
        }
        public setEnabled(enabled: boolean) {
            this.enabled = enabled;
        }

        public discard() {
            menus.removeElement(this);
        }

        public toString(): string {
            let s = "";
            for (let i = 0; i < this.buttons.length; i++) {
                s += this.buttons.get(i).toString();
                if (i < this.buttons.length - 1) {
                    s += "\n";
                }
            }
            return s;
        }
    }

    let menus: Menu[] = [];

    //% block="All Menus"
    //% group="Miscellaneous"
    export function getMenus(): Menu[] {
        return menus;
    }

    /*
    * @param buttons
    */
    //% block="Create Menu With Buttons $buttons"
    //% blockSetVariable="menu"
    //% group="Menu"
    export function newMenu(buttons: Button[]): Menu {
        return new Menu(buttons);
    }

    /*
    * Create a new Button
    * @param img
    * @param x
    * @param y
    * @param z
    * @param text
    * @param moveWhenPressed
    */
    //% block="Button  img: %img=screen_image_picker x: $x y: $y z: $z text: $text moveWhenPressed: $moveWhenPressed"
    //% blockSetVariable="button"
    //% inlineInputMode=inline
    //% group="Buttons"
    export function newButton(img: Image, x: number, y: number, z: number, text?: string, moveWhenPressed?: boolean): Button {
        return new Button(img, x, y, z, text, moveWhenPressed);
    }

    /*
    * Use this function instead of the game splash function (The splash function still works but it's buggy)
    * @param topText
    * @param bottomText
    */
    //% block="Show Text $topText $bottomText"
    //% topText.shadow=text
    //% bottomText.shadow=text
    //% group="Miscellaneous"
    export function showText(topText: string, bottomText?: string) {
        let enabledMenus: Menu[] = [];
        for (let m of menus) {
            if (m.enabled == true) {
                enabledMenus.push(m);
                m.disable();
            }
        }
        let leftClick = leftClickPressA;
        leftClickPressA = true;

        if (bottomText != undefined) {
            game.splash(topText, bottomText);
        } else {
            game.splash(topText);
        }

        leftClickPressA = leftClick
        for (let m of enabledMenus) {
            m.enable();
        }
    }

    let cursor = img`
        1 . . . . . .
        1 1 . . . . .
        1 f 1 . . . .
        1 f f 1 . . .
        1 f f f 1 . .
        1 f f f f 1 .
        1 f f f f f 1
        1 f f f f f 1
        1 f f f f 1 .
        1 f 1 f f 1 .
        . 1 . 1 f f 1
        . . . 1 f f 1
        . . . . 1 1 .
    `;
    game.setDialogCursor(cursor);

    /*
    * A cursor that I made
    */
    //% block="Cursor Image"
    //% group="Miscellaneous"
    export function cursorImage() {
        return cursor;
    }


    let noButtonPressed: Function = function () { };

    /*
    * Run a function everytime you click NOT on a button
    * @param funct
    */
    //% block="On click on no button"
    //% group="Miscellaneous"
    export function ifNoButtonPressed(funct: () => {}) {
        noButtonPressed = funct;
    }


    let buttonPressed: Button;
    let leftClickPressA = false;

    /*
    * If true then A will be pressed
    * every time you left click
    * @param pressA
    */
    //% block="Left Click Also Presses A $pressA"
    //% group="Miscellaneous"
    export function leftClickPressesA(pressA: boolean) {
        leftClickPressA = pressA;
    }

    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x: number, y: number) {
        if (leftClickPressA) {
            controller.A.setPressed(true);
        }
        let overlap = false;
        let mousePos = sprites.create(img`1`);
        mousePos.setPosition(x, y);
        for (let m of menus) {
            if (m.isOpen && m.enabled) {
                for (let b of m.buttons) {
                    if (b.overlapsWith(mousePos)) {
                        overlap = true;
                        mousePos.destroy();
                        if (b.moveWhenPressed) {
                            b.y += 2;
                        }
                        buttonPressed = b;
                        return;
                    }
                }
            }
        }
        mousePos.destroy();
        if (!overlap) {
            noButtonPressed();
        }
    });
    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Released, function (x: number, y: number) {
        if (leftClickPressA) {
            controller.A.setPressed(false);
        }
        if (buttonPressed != null) {
            let mousePos = sprites.create(img`1`);
            mousePos.setPosition(x, y);
            if (mousePos.overlapsWith(buttonPressed)) {
                mousePos.destroy();
                if (buttonPressed.moveWhenPressed) {
                    buttonPressed.y -= 2;
                }
                let a = buttonPressed.action;
                buttonPressed = null;
                a();
            }
            mousePos.destroy();
        }
    });
    forever(function() {
        if (buttonPressed != null && browserEvents.MouseLeft.isPressed()) {
            let mousePos = sprites.create(img`1`);
            mousePos.setPosition(browserEvents.mouseX(), browserEvents.mouseY());
            if (!mousePos.overlapsWith(buttonPressed)) {
                if (buttonPressed.moveWhenPressed) {
                    buttonPressed.y -= 2;
                }
                buttonPressed = null;
            }
            mousePos.destroy();
        }
    });
}

