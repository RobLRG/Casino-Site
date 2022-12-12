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
    }

    draw(deck) {
        let card = deck.draw()
        this.cards.push(card)
        displayCard(card)
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
        let winner;
        let player1Score = this.player1.score
        let player2Score = this.player2.score

        if (player1Score > player2Score && player1Score <= 21) {
            winner = this.player1.name
        } else if (player2Score > player1Score && player2Score <= 21) {
            winner = this.player2.name
        } else if (player1Score > 21 && player2Score <= 21) {
            winner = this.player2.name
        } else if (player2Score > 21 && player1Score <= 21) {
            winner = this.player1.name
        }
        else if (player1Score == player2Score || (player1Score > 21 && player2Score > 21)) {
            winner = "noone"
        }

        console.log(`${winner} wins`)

    }

    createButtons() {
        let btn = document.createElement("button")
        let text = document.createTextNode("Hit")
        btn.appendChild(text)
        let dv = document.getElementById("container")
        btn.onclick = () => {
            this.player1.draw(this.deck)
            // this.player2.draw(this.deck)
        }
        dv.appendChild(btn)

        let btn2 = document.createElement("button")
        let text2 = document.createTextNode("Hold")
        btn2.appendChild(text2)
        btn2.onclick = () => {
            this.findWinner()
        }
        dv.appendChild(btn2)
    }




}


let name = prompt("please enter a name", "human")

const game = new Game(new Player(name), new Player("CPU the Destroyer"))
game.setup()

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
