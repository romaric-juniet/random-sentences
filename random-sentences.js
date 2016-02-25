/*
 * Generate 10 random sentences from an input text.
 * Build a graph of n-grams and their successors
 */
'use strict';

String.prototype.capitalize = function () {
  return this.length > 0 ? this[0].toUpperCase() + this.slice(1) : '';
}

// Node of the graph. Representes one n-gram.
// Edges are maps of each 1-gram successor of the n-gram
class Node {
  constructor (nGram) {
    // N-gram of the node.
    this.nGram = nGram;

    // Edges of the n-gram: Each successors of the n-gram of the node
    // Map with key=1-gram successor of the n-gram of the node
    //          value=Number of occurences of this 1-gram after the n-gram of the node
    this.edges = new Map();

    // Number of occurences of the N-grams. Equals the sum of each value of this.edges
    this.occurrences = 0;
  }

  // Add an edge (a 1-gram) to the node
  addEdge(nGram)  {
    if (!this.edges.has(nGram)) {
      this.edges.set(nGram, 0);
    }
    this.edges.set(nGram, this.edges.get(nGram)+1);
    this.occurrences++;
  }

  // Get a random next 1-gram, respecting to the frequencies
  generateNext() {
    // Random number between 0 and the number of occurences
    const randomNumber = Math.floor(this.occurrences*Math.random()); 

    // The randomly picked node
    let node = null;

    // The array of nodes to pick from
    const nodesArray = [...this.edges];

    // Loop on the array, adding the number of occurences of each node, until reaching the random number.
    for (let iRandomNumber = 0, iArray = 0; iRandomNumber <= randomNumber && iArray < nodesArray.length ; iArray++) {
      // Get the node pointed by the array iterator
      node = nodesArray[iArray]; 

      // Increase the pointer of the random number by the number of occurences of this node
      iRandomNumber += node[1];
    };

    // Return the 1-gram of the randomly picked node
    return node[0];
  }
}

// Split a string into word-level 1-grams. Lots to improve here.
function splitInWords(text) {
  return text.replace(/[^a-zA-Z0-9. ]/g, ' ')
    .replace(/\s+/g,' ')
    .trim()
    .toLowerCase()
    .split(' ');
}

/*
 * Generate 10 random sentences from an input text.
 * Build a graph of n-grams and their successors
 * Text = input text to generate from
 * Order = order of the n-gram
 */
var main = function(text, order) {
  // Split the input text in words
  const words = splitInWords(text);

  // Generated sentences
  let sentences = [];

  // Build the graph. The grap is a map of nodes. A node is identified by its n-gram
  let nodes = new Map();
  for(let i = 0; i <= words.length - order; i++) {
    const nGram = words.slice(i, i+order).join(' ');
    if (!nodes.has(nGram)) {
      nodes.set(nGram, new Node(nGram));
    }

    nodes.get(nGram).addEdge(words[i + order] || null);
  }

  // Sort the n-grams by occurences
  const sortedNodes = new Map([...nodes].sort((a,b) => a[1].occurrences > b[1].occurrences ? 1 : a[1].occurrences < b[1].occurrences ? -1 : 0).reverse());

  // TODO: Select begining according to probabilities
  // Generate 10 random sentences
  for (let i in Array.from(Array(10).keys())) {
    // Get all the n-grams that end sentences
    const endSentences = [...sortedNodes.keys()].filter(key => key.endsWith('.'));

    // Pick a random ending n-gram
    const randomBeginingKey = endSentences[Math.floor(endSentences.length*Math.random())];

    // Generate the sentence
    if (sortedNodes.get(randomBeginingKey)) {
      // Generate the first 1-gram
      let generatedWord = sortedNodes.get(randomBeginingKey).generateNext();

      // Generated sentence
      let sentence = splitInWords(randomBeginingKey);

      // Continue the sentence until we reach an end of sentence (dot)
      while (generatedWord && !generatedWord.endsWith(".")) {
        // Build the n-gram
        const generatedNode = sortedNodes.get(sentence.slice(-order).join(' '));

        // Add the new generated node. If there is no node, we reached the end of the sentence
        generatedWord = generatedNode ? generatedNode.generateNext() : ".";
        sentence.push(generatedWord);
      }

      // Push our new sentence to the returned array
      sentences.push(sentence.slice(order).join(' ').capitalize());
    }
  }

  return sentences;
}

module.exports = {
  main
};