import React from 'react';
import {constructMeaning} from "./utilities"

export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            search:"",
            favourite: false
        }

        this.returnHandler= this.returnHandler.bind(this);
        this.searchWord= this.searchWord.bind(this);
        this.searchChangeHandler= this.searchChangeHandler.bind(this);
    }


    searchChangeHandler(e){
        this.setState({search: e.target.value})
    }

    searchWord(e){
        this.props.searchWord(this.state.search);
    }

    returnHandler(e) {
        if (e.keyCode === 13){

            this.searchWord();
        }
    }

    componentDidMount() {
        this.search.focus();

    }

    render() {
        let {search,wordSummery,meaningNotFound} = this.props;
        let meaning = constructMeaning(wordSummery);
        return (
            [<div key="search-input" className='search-input'>
                <input type="text" autoFocus id="search-word" onKeyDown={this.returnHandler}
                       ref={(input) => this.search = input }
                       placeholder="enter your word..."
                       onChange={this.searchChangeHandler}
                       value={this.state.search}
                />
                <button className="button-search" onClick={this.searchWord}>→</button>

            </div>,
                <div key="word-meaning" className="word-meaning" style={{display: search ? "block" : "none"}}>
                    <h2>{search} <span
                        className={"favourite-word " + (wordSummery.favourite ? "favourite " : "" )}
                        onClick={this.props.toggleFavourite}>★ </span></h2>
                    {
                        !meaningNotFound ? meaning : ("Sorry we couldn't find anything about " + search)
                    }
                </div>]
        )
    }
}
