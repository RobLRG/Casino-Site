


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

class fakeDeck {
    constructor() {
        this.cards = []
    }

    build() {
        const suits = ["♥️", "♥️", "♥️", "♣️"]
        const values = [14, 3, 3]
        const numbers = ["A", "3", "3"]

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
        this.pairPlus = false
        this.dealt = false
        this.folded = false
    }
    setup() {

        const betDisplay = document.getElementById("betDisplay")
        const pairDisplay = document.getElementById("pairDisplay")

        const moneyDisplay = document.getElementById("money")
        this.dealt = false
        this.pairPlus = false
        this.folded = false
        pairDisplay.innerHTML = "No Pair-Plus Bonus"
        moneyDisplay.innerHTML = this.player1.money

        this.deck.build()
        this.deck.shuffle()
        betDisplay.innerHTML = 0


        this.createButtons()

        for (let i = 0; i < 3; i++) {
            this.player1.draw(this.deck)
            this.player2.draw(this.deck)
        }

    }

    createButtons() {

        const betDisplay = document.getElementById("betDisplay")

        const moneyDisplay = document.getElementById("money")
        const messageBox = document.getElementById("messageBox")


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
                let player1Hand = this.findHandValue(this.player1)
                let player2Hand = this.findHandValue(this.player2)
                this.findWinner(player1Hand, player2Hand)
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
                this.folded = true
                this.player1.flip()
                this.player2.flip()
                let player1Hand = this.findHandValue(this.player1)
                let player2Hand = this.findHandValue(this.player2)
                this.findWinner(player1Hand, player2Hand)
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

        const betButton = document.getElementById("betButton")
        const betDisplay = document.getElementById("betDisplay")
        const messageBox = document.getElementById("messageBox")

        if (betDisplay.innerHTML != "0") {
            if (this.dealt == false) {
                betButton.setAttribute("disabled", "true")
                console.log("ante up")
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

        const pairDisplay = document.getElementById("pairDisplay")


        if (this.dealt == false && this.pairPlus == false) {
            console.log("pair plus")
            this.pairPlus = true
            pairDisplay.innerHTML = "Pair-Plus Bonus ++"
        } else if (this.dealt == false && this.pairPlus == true) {
            console.log("not pair plus")
            this.pairPlus = false
            pairDisplay.innerHTML = "No Pair-Plus Bonus"
        }
    }



    addBet() {
        const messageBox = document.getElementById("messageBox")
        const betDisplay = document.getElementById("betDisplay")

        const moneyDisplay = document.getElementById("money")

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
                this.player1.money = this.player1.money + parseInt(betDisplay.innerHTML)
                this.player1.money = this.player1.money - amount
                moneyDisplay.innerHTML = this.player1.money
                betDisplay.innerHTML = amount
                container.style.display = "none"
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }
                messageBox.style.display = "none"
                while (messageBox.firstChild) {
                    messageBox.removeChild(messageBox.firstChild)
                }
            }
            return false
        }
        container.appendChild(input)
    }

    findHandValue(player) {
        let straightFlush = false
        let ofAKind = false
        let straight = false
        let flush = false
        let pair = false

        //if u have straight flush, u win pretty much unless opp has straight flush with higher card

        //if u have 3 of kind all that matters is high card and if opp has straight flush

        //if u have a straight all that matters is high card 

        //if u have pair, u can only have a pair and a flush

        //if u have 3 of kind u cant have pair, straight or straight flush


        //find flush
        let cardArr = sortArray(player.cards)

        let d = 0
        let h = 0
        let c = 0
        let s = 0

        for (let i = 0; i < cardArr.length; i++) {
            if (cardArr[i].suits == "♥️") {
                h = h + 1
            } else if (cardArr[i].suits == "♠️") {
                s = s + 1
            } else if (cardArr[i].suits == "♦️") {
                d = d + 1
            } else if (cardArr[i].suits == "♣️") {
                c = c + 1
            }
        }

        if ((h == 3) || (d == 3) || (c == 3) || (s == 3)) {
            flush = true
        }

        //find highcard
        let highCard = cardArr[0]
        let highCard2 = cardArr[1]
        let highCard3 = cardArr[2]

        //find straight 

        let card1Val = cardArr[0].values
        let card2Val = cardArr[1].values
        let card3Val = cardArr[2].values


        if ((card1Val - 1 == card2Val && card1Val - 2 == card3Val)) {
            straight = true
        } else if (cardArr[0].numbers == "A" && cardArr[1].numbers == "3" && cardArr[2].numbers == "2") {
            straight = true
        }

        //find straight flush

        if (straight == true && flush == true) {
            straightFlush = true
        }

        //find 3 of a kind

        if (card1Val == card2Val && card1Val == card3Val) {
            ofAKind = true
        } else if (card1Val == card2Val || card1Val == card3Val || card2Val == card3Val) {
            pair = true
        }

        let handValue = { highCard, highCard2, highCard3, straightFlush, ofAKind, straight, flush, pair }
        return handValue
    }

    findWinner(hand, hand2) {
        let betMultiplier = 2

        let winner

        let handHigh = hand.highCard.values
        let handHigh2 = hand.highCard2.values
        let handHigh3 = hand.highCard3.values
        let handSFlush = hand.straightFlush
        let hand3Kind = hand.ofAKind
        let handStraight = hand.straight
        let handFlush = hand.flush
        let handPair = hand.pair

        let hand2High = hand2.highCard.values
        let hand2High2 = hand2.highCard2.values
        let hand2High3 = hand2.highCard3.values
        let hand2SFlush = hand2.straightFlush
        let hand23Kind = hand2.ofAKind
        let hand2Straight = hand2.straight
        let hand2Flush = hand2.flush
        let hand2Pair = hand2.pair

        if ((this.pairPlus && handSFlush) ||
            (this.pairPlus && hand3Kind) ||
            (this.pairPlus && handStraight) ||
            (this.pairPlus && handFlush) ||
            (this.pairPlus && handPair)) {
            betMultiplier = 3
            console.log("3")
        } else if (this.pairPlus) {
            betMultiplier = 1
            console.log("1")
        }

        if (handSFlush && !hand2SFlush) {
            console.log("player 1 wins")
            winner = this.player1
        } else if (!handSFlush && hand2SFlush) {
            console.log("player 2 wins")
            winner = this.player2
        } else if (handSFlush && hand2SFlush) {
            //hand High checking
            if (handHigh > hand2High) {
                console.log("player 1 wins")
                winner = this.player1
            } else if (handHigh == hand2High) {
                console.log("draw")
                winner = "noone"
            } else {
                console.log("player 2 wins")
                winner = this.player2
            }
            //end of hand High Checking
        } else if (hand3Kind && !hand23Kind) {
            console.log("player 1 wins")
            winner = this.player1
        } else if (!hand3Kind && hand23Kind) {
            console.log("player 2 wins")
            winner = this.player2
        } else if (hand3Kind && hand23Kind) {
            //hand High checking
            if (handHigh > hand2High) {
                console.log("player 1 wins")
                winner = this.player1
            } else if (handHigh == hand2High) {
                console.log("draw")
                winner = "noone"
            } else {
                console.log("player 2 wins")
                winner = this.player2
            }
            //end of hand High Checking
        } else if (handStraight && !hand2Straight) {
            console.log("player 1 wins")
            winner = this.player1
        } else if (!handStraight && hand2Straight) {
            console.log("player 2 wins")
            winner = this.player2
        } else if (handStraight && hand2Straight) {
            //hand High checking
            if (handHigh > hand2High) {
                console.log("player 1 wins")
                winner = this.player1
            } else if (handHigh == hand2High) {
                console.log("draw")
                winner = "noone"
            } else {
                console.log("player 2 wins")
                winner = this.player2
            }
            //end of hand High Checking
        } else if (handFlush && !hand2Flush) {
            console.log("player 1 wins")
            winner = this.player1
        } else if (!handFlush && hand2Flush) {
            console.log("player 2 wins")
            winner = this.player2
        } else if (handFlush && hand2Flush) {
            //hand High checking
            if (handHigh > hand2High) {
                console.log("player 1 wins")
                winner = this.player1
            } else if (handHigh == hand2High) {
                if (handHigh2 > hand2High2) {
                    console.log("player 1 wins")
                    winner = this.player1
                } else if (handHigh2 == hand2High2) {
                    if (handHigh3 > hand2High3) {
                        console.log("player 1 wins")
                        winner = this.player1
                    } else {
                        console.log("player 2 wins")
                        winner = this.player2
                    }
                } else {
                    console.log("player 2 wins")
                    winner = this.player2
                }
            } else {
                console.log("player 2 wins")
                winner = this.player2
            }
            //end of hand High Checking
        } else if (handPair && !hand2Pair) {
            console.log("player 1 wins")
            winner = this.player1
        } else if (!handPair && hand2Pair) {
            console.log("player 2 wins")
            winner = this.player2
        } else if (handPair && hand2Pair) {
            //hand High checking
            if (handHigh > hand2High) {
                console.log("player 1 wins")
                winner = this.player1
            } else if (handHigh == hand2High) {
                if (handHigh2 > hand2High2) {
                    console.log("player 1 wins")
                    winner = this.player1
                } else if (handHigh2 == hand2High2) {
                    if (handHigh3 > hand2High3) {
                        console.log("player 1 wins")
                        winner = this.player1
                    } else {
                        console.log("player 2 wins")
                        winner = this.player2
                    }
                } else {
                    console.log("player 2 wins")
                    winner = this.player2
                }
            } else {
                console.log("player 2 wins")
                winner = this.player2
            }
            //end of hand High Checking
        } else if (handHigh > hand2High) {
            console.log("player 1 wins")
            // betMultiplier = 2
            winner = this.player1
        } else if (handHigh == hand2High) {
            if (handHigh2 > hand2High2) {
                console.log("player 1 wins")
                // betMultiplier = 2
                winner = this.player1
            } else if (handHigh2 == hand2High2) {
                if (handHigh3 > hand2High3) {
                    console.log("player 1 wins")
                    // betMultiplier = 2
                    winner = this.player1
                } else {
                    console.log("player 2 wins")
                    // betMultiplier = 2
                    winner = this.player2
                }
            } else {
                console.log("player 2 wins")
                // betMultiplier = 2
                winner = this.player2
            }
        } else {
            console.log("player 2 wins")
            // betMultiplier = 2
            winner = this.player2
        }
        //end of hand High Checking
        if (!this.folded) {
            winner.money = winner.money + (parseInt(betDisplay.innerHTML) * betMultiplier)
        }
        this.showEndScreen(winner.name)
    }

    showEndScreen(winner) {

        let container = document.getElementById("finito")
        container.style.display = "block"
        let message = document.createElement("h2")
        message.setAttribute("id", "winMessage")
        let text;
        if (this.folded && winner == "CPU the Destroyer") {
            text = document.createTextNode(`${winner} wins! Good Fold!`)
        } else if (this.folded && winner != "CPU the destroyer") {
            text = document.createTextNode(`${winner} wins! Bad Fold`)
        } else {
            text = document.createTextNode(`${winner} wins!`)
        }
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

        const betDisplay = document.getElementById("betDisplay")

        this.player1.cards = []
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
}

function sortArray(array) {
    let sorted = []

    let card1 = array.pop()
    let card2 = array.pop()
    let card3 = array.pop()

    let card1Val = card1.values
    let card2Val = card2.values
    let card3Val = card3.values
    let largest = Math.max(card1Val, card2Val, card3Val)

    if (largest == card1Val) {
        sorted.push(card1)
        let nxtLargest = Math.max(card2Val, card3Val)
        if (nxtLargest == card2Val) {
            sorted.push(card2)
            sorted.push(card3)
        } else if (nxtLargest == card3Val) {
            sorted.push(card3)
            sorted.push(card2)
        }
    } else if (largest == card2Val) {
        sorted.push(card2)
        let nxtLargest = Math.max(card1Val, card3Val)
        if (nxtLargest == card1Val) {
            sorted.push(card1)
            sorted.push(card3)
        } else if (nxtLargest == card3Val) {
            sorted.push(card3)
            sorted.push(card1)
        }
    } else if (largest == card3Val) {
        sorted.push(card3)
        let nxtLargest = Math.max(card2Val, card1Val)
        if (nxtLargest == card2Val) {
            sorted.push(card2)
            sorted.push(card1)
        } else if (nxtLargest == card1Val) {
            sorted.push(card1)
            sorted.push(card2)
        }
    }

    return sorted

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

// let name = prompt("please enter a name", "human")

const game = new Game(new Player("player"), new Player("CPU the Destroyer"))
game.setup()

//module.exports = { Game, Player, Deck, Card, sortArray }