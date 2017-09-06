import React from 'react';
import {constructMeaning} from "./utilities"


export default class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordsHistory : this.props.wordsHistory || null,
            selectedWordIndex: 0
        }

    this.showWordMeaning= this.showWordMeaning.bind(this);
    }

    componentDidMount(){
        console.log("history data",this.state.wordsHistory,this.props.wordsHistory)
        if(this.state.wordsHistory.words.length === 0) {
            let persistentHistory = localStorage.getItem("wordsHistory");
            if (persistentHistory) {
                this.setState({wordsHistory: JSON.parse(persistentHistory)})
            }
            else {
                localStorage.setItem("wordsHistory", JSON.stringify(this.state.wordsHistory));
            }
        }
    }
    showWordMeaning(index){
        console.log("show word at ", index)
        if(this.state.selectedWordIndex === index)
            return;
        this.setState({selectedWordIndex: index})

    }

    render() {
        let {wordsHistory, selectedWordIndex} = this.state;
        return (
            <div className="content-container word-history ">
                <h2 key="historyHeading"> Favourite words.</h2>
                <div className="word-list">
                    <ul>
                        {
                            wordsHistory.words.map((w,index)=>{

                                return <li key={index}>
                                    <h2 onClick={this.showWordMeaning.bind(null,index)}>{w}</h2>
                                <div className="word-meaning" style={{"display": ( index === selectedWordIndex )  ? "block": "none"}}>


                                    {constructMeaning(wordsHistory.meanings[w])}
                                </div>
                                </li>
                            })

                        }
                    </ul>
                </div>
            </div>
        )
    }
}
