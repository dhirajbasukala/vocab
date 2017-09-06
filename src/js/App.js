import React from 'react';
import 'es6-promise';
import fetch from 'isomorphic-fetch';
import '../style/styles.scss';
import History from './history';
import About from './about';
import Search from './search';

import {Route, Link, Switch} from 'react-router-dom'
class App extends React.Component {
    constructor() {
        super();
        this.state = {
            search: "",
            pronunciation: null,
            meaning: [],
            meaningNotFound: false,
            wordsHistory: {
                words:[],
                meanings:{}
            },
            hydrating: false,
            wordSummery: {},
            favourite: false,
        }
        this.searchWord = this.searchWord.bind(this);
        this.findDefinition = this.findDefinition.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
        this.gotoHistory = this.gotoHistory.bind(this);
        this.gotoSearch = this.gotoSearch.bind(this);
    }

    toggleFavourite() {

        let {wordSummery, wordsHistory} = this.state;

        //update favourite flag
        wordSummery.favourite = !wordSummery.favourite;

        if (wordSummery.favourite) {
            if (wordsHistory.words.indexOf(this.state.search)=== -1) {
                wordsHistory.words.push(this.state.search);
                wordsHistory.meanings[this.state.search]= wordSummery;
            }
        }
        else {
            let indexOfWord = wordsHistory.words.indexOf(this.state.search);
            wordsHistory.words.splice(indexOfWord,1);
            delete wordsHistory.words[this.state.search];

        }
        localStorage.wordsHistory = JSON.stringify(wordsHistory);
        this.setState({wordSummery, wordsHistory})
    }

    componentDidMount() {
        let persistentHistory = localStorage.getItem("wordsHistory");
        if (persistentHistory) {
            this.setState({wordsHistory: JSON.parse(persistentHistory)})
        }
        else {
            localStorage.setItem("wordsHistory", JSON.stringify(this.state.wordsHistory));
        }
    }

    searchWord(word) {
        this.setState({hydrating: true});

        let wordsHistory = this.state.wordsHistory;

        //fetch cached data
        if (wordsHistory.words.indexOf(word)>-1)
            this.setState({wordSummery: wordsHistory.meanings[word], hydrating: false, search: word});
        else {

            fetch("http://api.pearson.com/v2/dictionaries/dictionary/entries?headword=" + word)
                .then(response => response.json())
                .then(res => {
                        //stop loading/activity indicator
                        this.setState({hydrating: false});
                        //get actual object with definition
                        let filteredResults = res.results.filter(r => r.headword === word.toLowerCase())

                        if (filteredResults === 0) {
                            this.setState({meaningNotFound: true})
                        }
                        let pronunciation = [];
                        let wordSummery = {}

                        //loop thru the objects to find the word summery
                        filteredResults.forEach(f => {
                            if (f.pronunciations)
                                if (pronunciation.indexOf(f.pronunciations) > -1)
                                    pronunciation.push(f.pronunciations)

                            //avoid this part of speech if it has no definitino or is translation
                            if (!f.senses || !f.senses[0] || !f.senses[0].definition || f.senses[0].translations)
                                return;

                            this.findDefinition(f, wordSummery);

                        })

                        wordSummery.pronunciation = pronunciation;
                        wordSummery.favourite = false;

                        this.setState({search: word, wordSummery});
                    }
                )
        }

    }

    findDefinition(f, wordSummery) {


        if (!wordSummery[f.part_of_speech])
            wordSummery[f.part_of_speech] = [];

        let sense = f.senses[0];
        let v = {}
        v.definition = typeof sense.definition === "object" ? sense.definition.join(" ,") : sense.definition;
        v.example = sense.examples ? sense.examples.map(e => e.text).join(" ;") : null;

        let duplicate = false;
        wordSummery[f.part_of_speech].forEach(type => {
            if (type.definition === v.definition) {
                duplicate = true;
                if (type.example) {
                    type.example += " ; " + v.example;
                }
                else
                    type.example = v.example;
            }

        });

        if (!duplicate) {
            wordSummery[f.part_of_speech].push(v);
        }
    }

    render() {

        return (
            <div className="search">
                <h1>
                    <Link to="/">Vocab <span>/və(ʊ)ˈkab/</span></Link>
                </h1>
                <div className="top-links">
                    <Link to="/history" className="history-data">history</Link>
                    <Link to="/about" className="about">about</Link>

                </div>
                <Switch>
                    <Route path="/history" render={this.gotoHistory}/>
                    <Route path="/about" render={this.gotoAbout}/>
                    <Route path="/" render={this.gotoSearch}/>
                </Switch>


                <div className={   this.state.hydrating ? "cssload-container  loading" : "cssload-container "}>
                    <div className="cssload-whirlpool">
                    </div>
                </div>
            </div>)
    }

    gotoHistory(props) {
        return (
            <History
                wordsHistory={this.state.wordsHistory}

            />
        )
    }


    gotoAbout(props) {
        return (
            <About/>
        )
    }

    gotoSearch(props) {
        return (
            <Search
                search={this.state.search}
                favourite={this.state.favourite}
                wordSummery={this.state.wordSummery}
                meaningNotFound={ this.state.meaningNotFound}

                searchWord={this.searchWord}
                toggleFavourite={ this.toggleFavourite}

            />
        )

    }
}


export default App;