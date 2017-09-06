import React from 'react';



export default class About extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        console.log(this.props)
        return (
            [<h2 key="historyHeading"> About </h2>,
                <div key="23">
                    Vocab is simple word meaning searching app. It makes it's search in pearson dictionary.
You can make the word you searched favourite by clicking the <span>★</span> icon. The favourite words are saved in the history section which you can visit later.</div>]
        )
    }
}
