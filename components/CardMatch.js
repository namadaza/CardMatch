import React from 'react'

const cards = [ "diamondA", "clubA", "heartA", "spadeA",
                "diamond2", "club2", "heart2", "spade2",
                "diamond3", "club3", "heart3", "spade3",
                "diamond4", "club4", "heart4", "spade4",
                "diamond5", "club5", "heart5", "spade5",
                "diamond6", "club6", "heart6", "spade6",
                "diamond7", "club7", "heart7", "spade7",
                "diamond8", "club8", "heart8", "spade8",
                "diamond9", "club9", "heart9", "spade9",
                "diamond10", "club10", "heart10", "spade10",
                "diamondJ", "clubJ", "heartJ", "spadeJ",
                "diamondQ", "clubQ", "heartQ", "spadeQ",
                "diamondK", "clubK", "heartK", "spadeK" ];

const cardsToMatch = 2;

class CardMatch extends React.Component {
  constructor() {
    super();
    this.shuffleCards = this.shuffleCards.bind(this);
    this.pickCard = this.pickCard.bind(this);
    this.state = {
      currentCards: [],
      selectedPairs: [],
      gamesWon: 0,
      gameOver: true
    };
  }
  componentDidMount() {
    this.shuffleCards();
  }
  shuffleCards() {
    //Create copy of cards
    var shuffled = cards.slice();
    //Fisher-Yates shuffle
    var i = 0,
        j = 0,
        temp = null;
    for (i = shuffled.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    //Create object to hold if selected/unselected and card type
    let shuffledObjects = shuffled.map(function(card) {
      return {type: card, position: "unselected"}
    });
    //TODO getting warning here, need to check if component has mounted
    this.setState(prevState => ({
      currentCards: shuffledObjects,
      gameOver: !prevState.gameOver
    }));
  }
  resetMatch() {
  }
  pickCard() {
  }
  isMatch() {
  }
  render() {
    let cardIndex = 0;
    console.log("CURRENT CARDS: ", this.state.currentCards);
    return (
      <div className="card-match-app">
        <Stats />
        <div className="cards">
          {this.state.currentCards.map(function(card) {
            return <Card key={card.type} index={cardIndex++} type={card.type} position={card.position} />
          })}
        </div>
        <Controls resetFunction={this.resetMatch} />
      </div>
    )
  }
}

class Card extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div data-index={this.props.index}
           data-cardtype={this.props.type}
           onClick={this.clickMe}
           className={"card card--"+this.props.type}>
        <div className="card_inner">
          <p>{this.props.type}</p>
          <div className={this.props.position=="unselected" ? "card_back" : "card_front"}></div>
        </div>
      </div>
    )
  }
}

class Stats extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="stats">
        <h3>Stats section</h3>
      </div>
    )
  }
}

class Controls extends React.Component {
  constructor(props) {
    super();
  }
  resetMatch() {

  }
  render() {
    return (
      <div className="controls">
        <h3>Controls section</h3>
      </div>
    )
  }
}


export default CardMatch
