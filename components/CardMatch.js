import React from 'react'
import concat from 'lodash/concat'

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
    //Define function bindings
    this.shuffleCards = this.shuffleCards.bind(this);
    this.pickCard = this.pickCard.bind(this);
    this.state = {
      currentCards: [],
      selectedCards: [],
      matchedCards: []
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
    let shuffledObjects = shuffled.map((card) => {
      return {type: card, position: "unselected"}
    });
    //TODO getting warning here, need to check if component has mounted
    this.setState(prevState => ({
      currentCards: shuffledObjects,
    }));
  }
  pickCard(cardIndex) {
    if (!this.state.matchedCards.includes(cardIndex)) {
      //Define temp variables to check if click is valid
      let curSelectedCards = concat(this.state.selectedCards, cardIndex);
      let tempCurrentCards = this.state.currentCards;
      //Set clicked card temporarily to selected, select most recently added card
      tempCurrentCards[curSelectedCards[curSelectedCards.length-1]].position = "selected";
      if (curSelectedCards.length == cardsToMatch) {
        //Set state to show user card has been clicked
        this.setState({
          currentCards: tempCurrentCards
        })
        //Check for match, update accordingly
        setTimeout(() => {
          //isMatch returns the corrected tempCurrentCards if no match found
          tempCurrentCards = this.isMatch(curSelectedCards, tempCurrentCards);
          curSelectedCards = [];
          this.setState({
            selectedCards: curSelectedCards,
            currentCards: tempCurrentCards
          });
        }, 750);
      }
      else {
        //First of selected cards, show card face
        tempCurrentCards[curSelectedCards[0]].position = "selected";
        this.setState({
          selectedCards: curSelectedCards,
          currentCards: tempCurrentCards
        })
      }
    }
  }
  isMatch(candidateSelectedCards, candidateCurrentCards) {
    //Get rank of both cards
    let cardRank1 = candidateCurrentCards[candidateSelectedCards[0]].type.slice(-1);
    let cardRank2 = candidateCurrentCards[candidateSelectedCards[1]].type.slice(-1);

    console.log("COMPARING TWO CARDS: ", cardRank1, cardRank2);
    if (cardRank1 == cardRank2) {
      //Selected cards form a pair
      let newmatchedCards = concat(this.state.matchedCards, candidateSelectedCards);
      candidateCurrentCards[candidateSelectedCards[0]].position = "hidden";
      candidateCurrentCards[candidateSelectedCards[1]].position = "hidden";
      console.log("NEW MATCHED CARDS: ", newmatchedCards);
      this.setState({
        matchedCards: newmatchedCards
      });
      return candidateCurrentCards;
    }
    else {
      //Reset position of the two selected cards
      candidateCurrentCards[candidateSelectedCards[0]].position = "unselected";
      candidateCurrentCards[candidateSelectedCards[1]].position = "unselected";
      return candidateCurrentCards;
    }
  }
  resetGame() {

  }
  render() {
    let cardIndex = 0;
    let clickEvent = this.pickCard;
    return (
      <div className="card-match-app">
        <Stats matchedCards={this.state.matchedCards} cards={this.state.currentCards}/>
        <div className="cards">
          {this.state.currentCards.map((card) => {
            return <Card key={cardIndex}
                         index={cardIndex++}
                         type={card.type}
                         position={card.position}
                         clickEvent={clickEvent}/>
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
    this.processClick = this.processClick.bind(this);
  }
  processClick() {
    //Pass in cardIndex to parent click function
    if (this.props.clickEvent !== null) {
      this.props.clickEvent(this.props.index);
    }
  }
  render() {
    return (
      <div data-index={this.props.index}
           data-cardtype={this.props.type}
           onClick={this.clickMe}
           className={"card card--"+this.props.type}
           onClick={this.processClick}>
        <div className={"card--"+this.props.position}>
          <p>{this.props.position=="unselected" ? "card_back" : this.props.type}</p>
          <div className={this.props.position=="unselected" ? "card_back" : "card_front"}></div>
        </div>
      </div>
    )
  }
}

class Stats extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div className="stats">
        <h3>Total Matched Pairs: {this.props.matchedCards.length==0 ? 0 : this.props.matchedCards.length/2}</h3>
        <h3>Matched Pairs: </h3>
        <div className="cards matched">
          {this.props.matchedCards.length==0 ? "None" :
            this.props.matchedCards.map((cardIndex) => {
            return <Card key={this.props.cards[cardIndex].type}
                         index={cardIndex}
                         type={this.props.cards[cardIndex].type}
                         position={"selected"}
                         clickEvent={null}/>
          })}
        </div>
      </div>
    )
  }
}

class Controls extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div className="controls">
      </div>
    )
  }
}


export default CardMatch
