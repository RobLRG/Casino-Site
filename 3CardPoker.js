const moneyDisplay = document.getElementById("money")
const messageBox = document.getElementById("messageBox")

const betHolder = document.getElementById("betContainer")
const betDisplay = document.createElement("div")
betHolder.appendChild(betDisplay)

class Card {
    constructor(suits, numbers, values) {
        this.suits = suits
        this.numbers = numbers
        this.values = values
    }
}

class Deck {
    constructor() {
        this.cards = []
    }

    build() {
        const suits = ["♥️", "♠️", "♦️", "♣️"]
        const values = [14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < values.length; j++) {
                this.cards.push(new Card(suits[i], numbers[j], values[j]))
            }
        }
    }

    shuffle() {
        for (let i = 0; i < 1000; i++) {
            let l = Math.floor((Math.random() * this.cards.length));
            let k = Math.floor((Math.random() * this.cards.length));
            let t = this.cards[l];
            this.cards[l] = this.cards[k];
            this.cards[k] = t;
        }
        console.log(this.cards)
    }

    draw() {
        let drawnCard = this.cards.pop()
        return drawnCard
    }

}

class Player {
    constructor(name) {
        this.name = name
        this.cards = []
        this.score = 0
        this.money = 1000
    }

    draw(deck) {
        let card = deck.draw()
        this.cards.push(card)
        if (this.name != "CPU the Destroyer") {
            displayCardFaceDown("cardHolder")
        } else if (this.name == "CPU the Destroyer") {
            displayCardFaceDown("oppHolder")
        }
        console.log(this.cards)
    }

    flip() {
        let cards = this.cards

        let dv
        if (this.name == "CPU the Destroyer") {
            dv = document.getElementById("oppHolder")
        } else {
            dv = document.getElementById("cardHolder")
        }

        while (dv.firstChild) {
            dv.removeChild(dv.firstChild)
        }

        for (const card of cards) {
            let cardInfo = card.numbers
            let cardInfoS = card.suits


            let cardElement = document.createElement("div")
            let topnum = document.createElement("h1")
            let botnum = document.createElement("h1")
            let suitDisplay = document.createElement("h1")


            cardElement.classList.add("card")
            dv.appendChild(cardElement)

            cardElement.appendChild(topnum)
            topnum.classList.add("topnum")
            topnum.innerHTML = cardInfo

            cardElement.appendChild(botnum)
            botnum.classList.add("botnum")
            botnum.innerHTML = cardInfo

            cardElement.appendChild(suitDisplay)
            suitDisplay.classList.add("suit")
            suitDisplay.innerHTML = cardInfoS

            if ((card.suits == "♥️") || (card.suits == "♦️")) {
                cardElement.classList.add("redBorder")
                topnum.classList.add("red")
                botnum.classList.add("red")
                suitDisplay.classList.add("red")
            } else {
                cardElement.classList.add("blackBorder")
                topnum.classList.add("black")
                botnum.classList.add("black")
                suitDisplay.classList.add("black")
            }

        }
    }
}

class Game {
    constructor(player1, player2) {
        this.player1 = player1
        this.player2 = player2
        this.deck = new Deck()
        this.anteUp = false
        this.dealt = false
    }
    setup() {
        this.dealt = false
        this.anteUp = false
        moneyDisplay.innerHTML = this.player1.money

        this.deck.build()
        this.deck.shuffle()

        this.createButtons()
        betDisplay.innerHTML = 0

        for (let i = 0; i < 3; i++) {
            this.player1.draw(this.deck)
            this.player2.draw(this.deck)
        }

    }

    createButtons() {

        let dv = document.getElementById("container")

        let btn5 = document.createElement("button")
        let text5 = document.createTextNode("add Bet")
        btn5.appendChild(text5)
        btn5.onclick = () => {
            this.addBet()
        }
        btn5.classList.add("button")
        btn5.setAttribute("id", "betButton")
        dv.appendChild(btn5)

        let btn = document.createElement("button")
        let text = document.createTextNode("Ante-Up")
        btn.appendChild(text)
        btn.onclick = () => {
            this.antePlayBet()
        }
        btn.classList.add("button")
        btn.setAttribute("id", "anteUp")
        dv.appendChild(btn)

        let btn2 = document.createElement("button")
        let text2 = document.createTextNode("Pair Plus")
        btn2.appendChild(text2)
        btn2.onclick = () => {
            this.pairPlusBet()
        }
        btn2.classList.add("button")
        btn2.setAttribute("id", "pairPlus")
        dv.appendChild(btn2)

        let btn3 = document.createElement("button")
        let text3 = document.createTextNode("play")
        btn3.appendChild(text3)
        btn3.onclick = () => {
            if (betDisplay.innerHTML != "0") {
                this.player1.flip()
                this.player2.flip()
                this.player1.money = this.player1.money - parseInt(betDisplay.innerHTML)
                moneyDisplay.innerHTML = this.player1.money
                betDisplay.innerHTML = parseInt(betDisplay.innerHTML) * 2
                document.getElementById("buttonContainer").style.display = "none"
                this.calculateWinner()
            } else if (messageBox.style.display == "none") {
                messageBox.style.display = "block"
                let message = document.createElement("h1")
                let text = document.createTextNode("Please input a bet!")
                message.appendChild(text)
                messageBox.appendChild(message)
            }

        }
        btn3.classList.add("button")
        btn3.setAttribute("id", "play")
        dv.appendChild(btn3)


        let btn4 = document.createElement("button")
        let text4 = document.createTextNode("fold")
        btn4.appendChild(text4)
        btn4.onclick = () => {
            if (betDisplay.innerHTML != "0") {
                this.player1.flip()
                this.player2.flip()
                document.getElementById("buttonContainer").style.display = "none"
            } else if (messageBox.style.display == "none") {
                messageBox.style.display = "block"
                let message = document.createElement("h1")
                let text = document.createTextNode("Please input a bet!")
                message.appendChild(text)
                messageBox.appendChild(message)
            }
        }
        btn4.classList.add("button")
        btn4.setAttribute("id", "fold")
        dv.appendChild(btn4)
    }

    antePlayBet() {
        if (betDisplay.innerHTML != "0") {
            if (this.dealt == false) {
                console.log("ante up")
                this.anteUp = true
                this.player1.flip()
                this.dealt = true
            }
        } else if (messageBox.style.display == "none") {
            messageBox.style.display = "block"
            let message = document.createElement("h1")
            let text = document.createTextNode("Please input a bet!")
            message.appendChild(text)
            messageBox.appendChild(message)
        }
    }

    pairPlusBet() {
        if (betDisplay.innerHTML != "0") {
            if (this.dealt == false) {
                console.log("pair plus")
                this.anteUp = false
                for (let i = 0; i < 3; i++) {
                    this.player1.draw(this.deck)
                    this.player2.draw(this.deck)
                }
                this.dealt = true
            }
        } else if (messageBox.style.display == "none") {
            messageBox.style.display = "block"
            let message = document.createElement("h1")
            let text = document.createTextNode("Please input a bet!")
            message.appendChild(text)
            messageBox.appendChild(message)
        }

    }

    addBet() {
        let container = document.getElementById("bets")
        container.style.display = "block"
        let message = document.createElement("h2")
        message.setAttribute("id", "betMessage")
        let text = document.createTextNode(`Please choose a bet amount`)
        message.appendChild(text)
        container.appendChild(message)

        let input = document.createElement("form")
        input.setAttribute("id", "form")
        let inputBox = document.createElement("input")
        inputBox.setAttribute("type", "text")
        inputBox.setAttribute("id", "betAmount")
        inputBox.setAttribute("name", "betAmount")
        let submitButton = document.createElement("input")
        submitButton.setAttribute("type", "submit")
        input.appendChild(inputBox)
        input.appendChild(submitButton)
        input.onsubmit = () => {
            let amount = parseInt(inputBox.value)
            if (amount <= this.player1.money) {
                this.player1.money = this.player1.money - amount
                moneyDisplay.innerHTML = this.player1.money
                betDisplay.innerHTML = amount
                container.style.display = "none"
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }
            }
            return false
        }
        container.appendChild(input)
    }

    calculateWinner() {
        console.log("calculating winner")
    }
}

function displayCard(card) {
    let cardInfo = card.numbers
    let cardInfoS = card.suits

    let dv = document.getElementById("cardHolder")

    let cardElement = document.createElement("div")
    let topnum = document.createElement("h1")
    let botnum = document.createElement("h1")
    let suitDisplay = document.createElement("h1")


    cardElement.classList.add("card")
    dv.appendChild(cardElement)

    cardElement.appendChild(topnum)
    topnum.classList.add("topnum")
    topnum.innerHTML = cardInfo

    cardElement.appendChild(botnum)
    botnum.classList.add("botnum")
    botnum.innerHTML = cardInfo

    cardElement.appendChild(suitDisplay)
    suitDisplay.classList.add("suit")
    suitDisplay.innerHTML = cardInfoS

    if ((card.suits == "♥️") || (card.suits == "♦️")) {
        cardElement.classList.add("redBorder")
        topnum.classList.add("red")
        botnum.classList.add("red")
        suitDisplay.classList.add("red")
    } else {
        cardElement.classList.add("blackBorder")
        topnum.classList.add("black")
        botnum.classList.add("black")
        suitDisplay.classList.add("black")
    }
}

function displayCardFaceDown(id) {
    let dv = document.getElementById(id)
    let crd = document.createElement("div")
    let crdArt = document.createElement("h1")
    crdArt.innerHTML = "§"
    crdArt.classList.add("cardArt")
    crd.classList.add("cardBack")
    dv.appendChild(crd)
    crd.appendChild(crdArt)
}

let name = prompt("please enter a name", "human")

const game = new Game(new Player(name), new Player("CPU the Destroyer"))
game.setup()
