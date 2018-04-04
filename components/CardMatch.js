import React from 'react'
import concat from 'lodash/concat'

const cards = [ "Diamond A", "Club A", "Heart A", "Spade A",
                "Diamond 2", "Club 2", "Heart 2", "Spade 2",
                "Diamond 3", "Club 3", "Heart 3", "Spade 3",
                "Diamond 4", "Club 4", "Heart 4", "Spade 4",
                "Diamond 5", "Club 5", "Heart 5", "Spade 5",
                "Diamond 6", "Club 6", "Heart 6", "Spade 6",
                "Diamond 7", "Club 7", "Heart 7", "Spade 7",
                "Diamond 8", "Club 8", "Heart 8", "Spade 8",
                "Diamond 9", "Club 9", "Heart 9", "Spade 9",
                "Diamond 10", "Club 10", "Heart 10", "Spade 10",
                "Diamond J", "Club J", "Heart J", "Spade J",
                "Diamond Q", "Club Q", "Heart  Q", "Spade Q",
                "Diamond K", "Club K", "Heart K", "Spade K" ];



const cardsToMatch = 2;

class CardMatch extends React.Component {
  constructor() {
    super();
    //Define function bindings
    this.shuffleCards = this.shuffleCards.bind(this);
    this.pickCard = this.pickCard.bind(this);
    this.toggleAiMode = this.toggleAiMode.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.ignoreUserClicks = false;
    this.state = {
      currentCards: [],
      selectedCards: [],
      matchedCards: [],
      compPlayerMemory: [],
      compMatchedCards: [],
      ai: false
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
  //TODO Extend this function to handle computer player
  pickCard(cardIndex) {
    if (this.ignoreUserClicks !== true) {
      if (!this.state.matchedCards.includes(cardIndex)) {
        //Define temp variables to check if click is valid
        let curSelectedCards = concat(this.state.selectedCards, cardIndex);
        let tempCurrentCards = this.state.currentCards;
        //Set clicked card temporarily to selected, select most recently added card
        tempCurrentCards[curSelectedCards[curSelectedCards.length-1]].position = "selected";
        if (curSelectedCards.length == cardsToMatch) {
          //Check that selected cards are different
          if (curSelectedCards[0] !== curSelectedCards[1]) {
            //Set state to show user card has been clicked
            this.setState({
              currentCards: tempCurrentCards
            })
            this.ignoreUserClicks = true;
            //Check for match, update accordingly
            setTimeout(() => {
              //isMatch returns the corrected tempCurrentCards if no match found
              tempCurrentCards = this.isMatch(curSelectedCards, tempCurrentCards);
              curSelectedCards = [];
              this.setState({
                selectedCards: curSelectedCards,
                currentCards: tempCurrentCards
              });
              this.ignoreUserClicks = false;
            }, 750);
          }
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
  toggleAiMode() {
    this.setState(prevState => ({
      ai: !prevState.ai
    }));
  }
  render() {
    let cardIndex = 0;
    let clickEvent = this.pickCard;
    let toggleEvent = this.toggleAiMode;
    let resetEvent = this.resetGame;
    return (
      <div className="card-match-app">
        <Stats matchedCards={this.state.matchedCards} cards={this.state.currentCards} aimode={this.state.ai} aiMatchedCards={this.state.compMatchedCards}/>
        <div className="cards">
          {this.state.currentCards.map((card) => {
            return <Card key={cardIndex}
                         index={cardIndex++}
                         type={card.type}
                         position={card.position}
                         clickEvent={clickEvent}
                         ignoreUserClicks={this.state.ignoreUserClicks} />
          })}
        </div>
        <Controls resetEvent={resetEvent} toggleEvent={toggleEvent} aimode={this.state.ai} />
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
    if (this.props.clickEvent !== null && this.props.ignoreUserClicks !== true) {
      this.props.clickEvent(this.props.index);
    }
  }
  render() {
    return (
      <div data-index={this.props.index}
           data-cardtype={this.props.type}
           onClick={this.processClick}
           className={"card card--"+this.props.type}>
        <div className={"card--"+this.props.position}>
          <p>{this.props.position=="unselected" ? "CARD" : this.props.type}</p>
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
        <h3>AI Matched Pairs: {this.props.aimode ? this.props.aiMatchedCards.length/2 : "AI Turned Off..."}</h3>
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
    this.processClick = this.processClick.bind(this);
  }
  processClick() {
    this.props.toggleEvent();
  }
  render() {
    return (
      <div className="controls">
        <div className="toggleai"
             onClick={this.processClick}>
          <button>{this.props.aimode ? "Turn Off AI" : "Turn On AI"}</button>
        </div>
      </div>
    )
  }
}

export default CardMatch
