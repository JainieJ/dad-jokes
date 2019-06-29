import React, { Component } from "react";
import Joke from "./Joke";
import _ from "lodash";
import { Emoji } from "emoji-mart";
import { FaLaugh } from "react-icons/fa";
import "./JokeList.css";

const URL = "https://icanhazdadjoke.com/";
const header = { Accept: "application/json" };

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };
  constructor(props) {
    super(props);
    this.fetchJokes = this.fetchJokes.bind(this);
  }
  state = {
    jokes: [],
    loading: true
  };
  async componentDidMount() {
    const storageData = JSON.parse(localStorage.getItem("jokes"));
    // if there is data in storage push it to the state
    if (storageData) {
      this.setState({ jokes: storageData, loading: false });
      return;
    }
    //otherwise send an ajax request and store the result in state
    const newJokes = await this.fetchJokes();
    this.setState(st => {
      return { jokes: [...st.jokes, ...newJokes], loading: false };
    });
  }
  async componentDidUpdate() {
    //code block for new jokes request
    if (this.state.loading) {
      const newJokes = await this.fetchJokes();
      const allJokes = _.unionBy(this.state.jokes, newJokes, "id");
      this.setState({ jokes: allJokes, loading: false });
    }
    //code block for getting jokes from the storage
    else {
      localStorage.setItem("jokes", JSON.stringify(this.state.jokes));
    }
  }
  handleVote = (id, delta) => {
    const jokes = this.state.jokes.map(joke => {
      return joke.id !== id ? joke : { ...joke, score: joke.score + delta };
    });
    this.setState({ jokes });
  };
  getNewJokes = () => {
    this.setState({ loading: true });
  };
  async fetchJokes() {
    try {
      let newJokes = [];
      while (newJokes.length < this.props.numJokesToGet) {
        const response = await fetch(URL, {
          headers: header
        });
        const respJSON = await response.json();
        const newJoke = { id: respJSON.id, joke: respJSON.joke, score: 0 };
        //not to push repeating jokes
        if (!newJokes.find(j => j.id === newJoke.id)) {
          newJokes.push(newJoke);
        }
      }
      return newJokes;
    } catch (e) {
      alert(e);
    }
  }
  render() {
    const sortedJokes = this.state.jokes.sort((a, b) => b.score - a.score);
    const jokes = sortedJokes.map(j => (
      <Joke
        key={j.id}
        j={j}
        incrementScore={this.handleVote}
        decrementScore={this.handleVote}
      />
    ));
    return (
      <section className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <div className="Jokelist-emoji">
            <Emoji emoji="joy" set="emojione" size={100} />
          </div>
          <button onClick={this.getNewJokes} className="JokeList-getmore">
            Get New Jokes
          </button>
        </div>
        <div className="Jokelist-jokes">
          {this.state.loading ? (
            <div className="JokeList-spinner">
              <FaLaugh className="Jokelist-spinning-icon" />
              <h1 className="JokeList-title">Loading...</h1>
            </div>
          ) : (
            jokes
          )}
        </div>
      </section>
    );
  }
}

export default JokeList;
