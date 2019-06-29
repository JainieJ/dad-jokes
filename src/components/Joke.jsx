import React, { Component } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Emoji } from "emoji-mart";
import "./Joke.css";
const emoji = ["unamused", "confused", "blush", "grinning", "laughing", "joy"];
const colors = [
  "#dd1010",
  "#dd6c10",
  "#f3f341",
  "#26fb26",
  "#42ec42",
  "#008000"
];

class Joke extends Component {
  handleIncrement = () => {
    this.props.incrementScore(this.props.j.id, 1);
  };
  handleDecrement = () => {
    this.props.decrementScore(this.props.j.id, -1);
  };
  getEmoji = () => {
    const { score } = this.props.j;
    if (score < 0) {
      return emoji[0];
    } else if (score < 3) {
      return emoji[1];
    } else if (score < 5) {
      return emoji[2];
    } else if (score < 8) {
      return emoji[3];
    } else if (score < 10) {
      return emoji[4];
    } else {
      return emoji[5];
    }
  };
  getColor = () => {
    const { score } = this.props.j;
    if (score < 0) {
      return colors[0];
    } else if (score < 3) {
      return colors[1];
    } else if (score < 5) {
      return colors[2];
    } else if (score < 8) {
      return colors[3];
    } else if (score < 10) {
      return colors[4];
    } else {
      return colors[5];
    }
  };
  render() {
    const {
      j: { joke, score }
    } = this.props;
    const borderColor = `3px solid ${this.getColor()}`;
    return (
      <div className="Joke">
        <div className="Joke-buttons">
          <FaThumbsUp onClick={this.handleIncrement} className="Joke-icons" />
          <span className="Joke-votes" style={{ border: borderColor }}>
            {score}
          </span>
          <FaThumbsDown onClick={this.handleDecrement} className="Joke-icons" />
        </div>
        <div className="Joke-text">{joke}</div>
        <div className="Joke-smiley">
          <Emoji emoji={this.getEmoji()} set="emojione" size={50} />
        </div>
      </div>
    );
  }
}

export default Joke;
