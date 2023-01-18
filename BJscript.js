const moneyDisplay = document.getElementById("money")
const messageBox = document.getElementById("messageBox")


const scoreHolder = document.getElementById("scoreContainer")
const scoreDisplay = document.createElement("div")
scoreHolder.appendChild(scoreDisplay)

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
        const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
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
        this.money = localStorage.getItem("storedMoney")
    }

    draw(deck) {
        messageBox.style.display = "none"
        while (messageBox.firstChild) {
            messageBox.removeChild(messageBox.firstChild)
        }
        let card = deck.draw()
        this.cards.push(card)
        if (this.name != "CPU the Destroyer") {
            displayCard(card)
        } else if (this.name == "CPU the Destroyer") {
            displayCPUCard()
        }
        console.log(this.cards)
        this.addValues()
    }

    addValues() {
        let added = 0
        for (const elem of this.cards) {
            let value = elem.values
            added = added + value
        }
        for (const cards of this.cards) {
            let symbol = cards.numbers
            if (symbol == "A" && added > 21) {
                added = added - 10
            }
        }
        this.score = added

        if (this.name != "CPU the Destroyer") {
            scoreDisplay.innerHTML = this.score
        }

        console.log(this.score)
    }
}

class Game {
    constructor(player1, player2) {
        this.player1 = player1
        this.player2 = player2
        this.deck = new Deck
    }

    setup() {
        moneyDisplay.innerHTML = this.player1.money
        this.deck.build()
        this.deck.shuffle()
        console.log(this.player1.name)
        for (let i = 0; i < 2; i++) {
            this.player1.draw(this.deck)
        }
        console.log(this.player2.name)
        for (let i = 0; i < 2; i++) {
            this.player2.draw(this.deck)
        }

        this.createButtons()

        this.player1.addValues()
        this.player2.addValues()

        if (this.player2.name == "CPU the Destroyer") {
            this.calculateCPUMoves()
        }

        betDisplay.innerHTML = 0
    }

    calculateCPUMoves() {
        let com = this.player2
        for (let i = 0; i < 100; i++) {
            if (com.score <= 15) {
                com.draw(this.deck)
            }
        }
    }


    findWinner() {
        messageBox.style.display = "none"
        while (messageBox.firstChild) {
            messageBox.removeChild(messageBox.firstChild)
        }
        let winner;
        let player1Score = this.player1.score
        let player2Score = this.player2.score

        if (player1Score > player2Score && player1Score <= 21) {
            winner = this.player1.name
            this.player1.money = this.player1.money + (parseInt(betDisplay.innerHTML) * 2)
        } else if (player2Score > player1Score && player2Score <= 21) {
            winner = this.player2.name
        } else if (player1Score > 21 && player2Score <= 21) {
            winner = this.player2.name
        } else if (player2Score > 21 && player1Score <= 21) {
            winner = this.player1.name
            this.player1.money = this.player1.money + (parseInt(betDisplay.innerHTML) * 2)
        }
        else if (player1Score == player2Score || (player1Score > 21 && player2Score > 21)) {
            winner = "noone"
            this.player1.money = this.player1.money + parseInt(betDisplay.innerHTML)
        }

        console.log(`${winner} wins`)

        localStorage.setItem("storedMoney", this.player1.money)
        this.showEndScreen(winner)
    }

    createButtons() {
        let btn = document.createElement("button")
        let text = document.createTextNode("Hit")
        btn.appendChild(text)
        let dv = document.getElementById("container")
        btn.onclick = () => {
            if (betDisplay.innerHTML != "0") {
                this.player1.draw(this.deck)
            } else if (messageBox.style.display == "none") {
                messageBox.style.display = "block"
                let message = document.createElement("h1")
                let text = document.createTextNode("Please input a bet!")
                message.appendChild(text)
                messageBox.appendChild(message)
            }
        }
        btn.classList.add("button")
        dv.appendChild(btn)

        let btn2 = document.createElement("button")
        let text2 = document.createTextNode("Hold")
        btn2.appendChild(text2)
        btn2.onclick = () => {
            if (betDisplay.innerHTML != "0") {
                this.findWinner()
            } else if (messageBox.style.display == "none") {
                messageBox.style.display = "block"
                let message = document.createElement("h1")
                let text = document.createTextNode("Please input a bet!")
                message.appendChild(text)
                messageBox.appendChild(message)
            }
        }
        btn2.classList.add("button")
        dv.appendChild(btn2)

        let btn3 = document.createElement("button")
        let text3 = document.createTextNode("add Bet")
        btn3.appendChild(text3)
        btn3.onclick = () => {
            this.addBet()
        }
        btn3.classList.add("button")
        dv.appendChild(btn3)
    }

    showEndScreen(winner) {
        this.turnOverCards()

        let container = document.getElementById("finito")
        container.style.display = "block"
        let message = document.createElement("h2")
        message.setAttribute("id", "winMessage")
        let text = document.createTextNode(`${winner} wins!`)
        message.appendChild(text)
        container.appendChild(message)

        let button = document.createElement("button")
        let buttonText = document.createTextNode("Play Again")
        button.appendChild(buttonText)
        button.classList.add("button")
        button.onclick = () => {
            this.reset()
        }
        container.appendChild(button)
    }

    reset() {
        this.player1.score = 0
        this.player1.cards = []
        this.player2.score = 0
        this.player2.cards = []
        this.deck.cards = []

        let btnCont = document.getElementById("container")
        while (btnCont.firstChild) {
            btnCont.removeChild(btnCont.firstChild)
        }

        let cardCont = document.getElementById("cardHolder")
        while (cardCont.firstChild) {
            cardCont.removeChild(cardCont.firstChild)
        }

        let oppCardCont = document.getElementById("oppHolder")
        while (oppCardCont.firstChild) {
            oppCardCont.removeChild(oppCardCont.firstChild)
        }

        scoreDisplay.innerHTML = ""
        betDisplay.innerHTML = 0

        let fin = document.getElementById("finito")

        while (fin.firstChild) {
            fin.removeChild(fin.firstChild)
        }
        fin.style.display = "none"

        if (this.player1.money > 0) {
            this.setup()
        } else {
            window.location.href = "gameOver.html"
        }

    }

    turnOverCards() {
        let oppCards = this.player2.cards


        let dv = document.getElementById("oppHolder")

        while (dv.firstChild) {
            dv.removeChild(dv.firstChild)
        }

        for (const card of oppCards) {
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
}

// let name = prompt("please enter a name", "human")

const game = new Game(new Player("Player"), new Player("CPU the Destroyer"))
game.setup()

function displayCPUCard() {
    let dv = document.getElementById("oppHolder")
    let crd = document.createElement("div")
    let crdArt = document.createElement("h1")
    crdArt.innerHTML = "§"
    crdArt.classList.add("cardArt")
    crd.classList.add("cardBack")
    dv.appendChild(crd)
    crd.appendChild(crdArt)
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
