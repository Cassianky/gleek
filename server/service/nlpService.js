import natural from "natural";
import aposToLexForm from "apos-to-lex-form";
import SpellCorrector from "spelling-corrector";
import stopword from "stopword";

export const getSentiment = (review) => {
  const spellCorrector = new SpellCorrector();
  spellCorrector.loadDictionary();
  const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
  const negations = ["not", "no", "never", "none", "nobody", "nowhere"];

  const lexedReview = aposToLexForm(review);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, "");

  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  const filteredReview = stopword.removeStopwords(tokenizedReview);

  const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

  const overallSentiment = analyzer.getSentiment(filteredReview);

  const positiveKeywords = [];
  const negativeKeywords = [];
  const neutralKeywords = [];
  const keyWords = [];
  let skip = false;

  for (let i = 0; i < filteredReview.length; i++) {
    let token = filteredReview[i];
    let newWord = [];
    if (skip) {
      skip = false;
      continue;
    }
    if (negations.includes(token)) {
      newWord.push(token, filteredReview[i + 1]);
      skip = true;
    } else {
      newWord.push(token);
    }

    const tokenAnalysis = analyzer.getSentiment(newWord);
    const add = newWord.join(" ");
    if (tokenAnalysis > 0) {
      positiveKeywords.push(add);
      keyWords.push({ word: add, sentiment: "POSITIVE" });
    } else if (tokenAnalysis < 0) {
      negativeKeywords.push(add);
      keyWords.push({ word: add, sentiment: "NEGATIVE" });
    }
    // } else {
    //   neutralKeywords.push(add);
    //   keyWords.push({ word: add, sentiment: "NEUTRAL" });
    // }
  }

  const analysis = {
    overallSentiment,
    keyWords,
  };
  return analysis;
};

export const analyzeFeedback = (activityLiked, activityImprovements) => {
  const activityLikedKeyWords = getSentiment(activityLiked);
  const activityImprovementsKeyWords = getSentiment(activityImprovements);
  return { activityLikedKeyWords, activityImprovementsKeyWords };
};
