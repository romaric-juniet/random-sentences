'use strict';

String.prototype.capitalize = function () {
  return this.length > 0 ? this[0].toUpperCase() + this.slice(1) : '';
}

class Node {
  constructor (nGram) {
    this.nGram = nGram;
    this.edges = new Map();
    this.occurrences = 0;
  }
  addEdge(nGram)  {
    if (!this.edges.has(nGram)) {
      this.edges.set(nGram, 0);
    }
    this.edges.set(nGram, this.edges.get(nGram)+1);
    this.occurrences++;
  }
  generateNext() {
    const number = Math.floor(this.occurrences*Math.random()); 
    let i = 0;
    let node = null;
    const nodesArray = [...this.edges];
    for (var j = 0 ; i <= number && j < nodesArray.length ; j++) {
      node = nodesArray[j]; 
      i += node[1];
    };
    return node[0];
  }
}

// Split a string into word-level 1-grams
function splitInWords(text) {
  return text.replace(/[^a-zA-Z0-9. ]/g, ' ')
//  .replace(/([^A-Z])\./g, '$1 .')
  .replace(/\s+/g,' ')
  .trim()
  .toLowerCase()
  .split(' ');
}


var main = function(text, order) {
  const words = splitInWords(text)
  const sentences = [];

  let nodes = new Map();
  for(let i = 0; i <= words.length - order; i++) {
    const nGram = words.slice(i, i+order).join(' ');
    if (!nodes.has(nGram)) {
      nodes.set(nGram, new Node(nGram));
    }

    nodes.get(nGram).addEdge(words[i + order] || null);
  }

  const sortedNodes = new Map([...nodes].sort((a,b) => a[1].occurrences > b[1].occurrences ? 1 : a[1].occurrences < b[1].occurrences ? -1 : 0).reverse());

  // TODO: Select begining according to probabilities
  for (let i in Array.from(Array(10).keys())) {
    const endSentences = [...sortedNodes.keys()].filter(key => key.endsWith('.'));
    const randomBeginingKey = endSentences[Math.floor(endSentences.length*Math.random())];
    if (sortedNodes.get(randomBeginingKey)) {
      let generatedWord = sortedNodes.get(randomBeginingKey).generateNext();
      let sentence = splitInWords(randomBeginingKey);
      while (generatedWord && !generatedWord.endsWith(".")) {
        const generatedNode = sortedNodes.get(sentence.slice(-order).join(' '))
        generatedWord = generatedNode ? generatedNode.generateNext() : ".";
        sentence.push(generatedWord);
      }
      sentences.push(sentence.slice(order).join(' ').capitalize());
    }
  }

  return sentences;
}

module.exports = {
  main
};