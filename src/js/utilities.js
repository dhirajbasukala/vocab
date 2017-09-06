/**
 * Created by dhiraj on 8/31/17.
 */

import React from 'react';

export const constructMeaning = function(wordSummery){
    let meaning = []

    if (wordSummery.pronunciation && wordSummery.pronunciation.length) {
        meaning.push(<label key="pronunciation">Pronunciation</label>)
        wordSummery.pronunciation.forEach((p, index) => {
            meaning.push(<span key={index}> /{p[0].ipa}/ {p[0].lang && p[0].lang }</span>)
        })
    }

    for (let key in wordSummery) {

        switch (key) {
            case "adjective":
            case "noun":
            case "adverb":
            case "verb": {
                meaning.push(<label key={key}>{key}</label>)
                wordSummery[key].forEach((v, index) => {
                    meaning.push(<div key={key+ "-"+index }><p>{v.definition }</p> {v.example ?
                        <span>eg. {v.example}</span> : "" }
                    </div>)
                })
                break;
            }
            default: {

                break;
            }
        }
    }

    return meaning

}