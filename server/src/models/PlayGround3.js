class BPE {
  constructor(corpus, vocab_size = 100) {
      this.corpus = corpus;
      this.vocab_size = vocab_size;
      this.vocab = new Set();
      this.merges = {};
  }

  tokenize(text) {
      return text.split(" "); // Simple space tokenization
  }

  get_stats(corpus) {
      const pairs = {};
      for (const word of corpus) {
          const symbols = word.split("");
          for (let i = 0; i < symbols.length - 1; i++) {
              const pair = symbols[i] + symbols[i + 1];
              pairs[pair] = (pairs[pair] || 0) + 1;
          }
      }
      return pairs;
  }

  merge_vocab(pair, v_in) {
      const v_out = {};
      const bigram = new RegExp(pair.split("").join("\\s*"), "g");
      for (const word of Object.keys(v_in)) {
          const w_out = word.replace(bigram, pair);
          v_out[w_out] = v_in[word];
      }
      return v_out;
  }

  train() {
      let vocab = {};
      for (const word of this.corpus) {
          vocab[word] = (vocab[word] || 0) + 1;
          word.split("").forEach(char => this.vocab.add(char));
      }

      let 
      i = 0;
      while (this.vocab.size < this.vocab_size) {
          const pairs = this.get_stats(Object.keys(vocab));
          const best_pair = Object.keys(pairs).reduce((a, b) => pairs[a] > pairs[b] ? a : b, '');

          if (!pairs[best_pair]) {
              break; // No more pairs to merge
          }
        
          if (this.vocab.has(best_pair)) {
            continue; // Skip if pair already in vocab
          }

          vocab = this.merge_vocab(best_pair, vocab);
          this.vocab.add(best_pair);
          this.merges[best_pair] = i;
          i++;
        
          if (this.vocab.size >= this.vocab_size) {
            break; // Stop if vocab size exceeds limit
          }
      }
      console.log(this.merges)
      this.vocabulary = Array.from(this.vocab);
  }

  encode(text) {
      let tokens = this.tokenize(text);
      tokens = tokens.map(token => {
          for (const merge in this.merges) {
              const regex = new RegExp(merge.split("").join("\\s*"), "g");
              token = token.replace(regex, merge);
          }
          return token;
      });
      return tokens;
  }
}

// Example Usage
const corpus = [
  "This is the Hugging Face Course.",
  "This chapter is about tokenization.",
  "This section shows several tokenizer algorithms.",
  "Hopefully, you will be able to understand how they are trained and generate tokens.",
];

const bpe = new BPE(corpus, 200);
bpe.train();
const encoded = bpe.encode("This is a test about the Course.");
console.log(encoded);
console.log(bpe.vocabulary);
