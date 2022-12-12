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

class HumanPlayer {
    constructor() {
        this.playerCards = []
    }

    hit(deck) {
        this.playerCards.push(deck.draw())
        console.log(this.playerCards)
    }
}

const deck = new Deck()
deck.build()
deck.shuffle()

function addButton() {
    let btn = document.createElement("button")
    let text = document.createTextNode("Draw Card")
    btn.appendChild(text)
    let dv = document.getElementById("container")
    btn.onclick = () => {
        let card = deck.draw()
        console.log(card)
        displayCard(card)
    }
    dv.appendChild(btn)

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

let player = new HumanPlayer()
player.hit(deck)

document.addEventListener("DOMContentLoaded", addButton)