import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


let tweets = [];


function replaceHashtagsWithLinks(text) {
  const regex = /#(\w+)/g;
  const replaceFunc = (match, hashtag) => {
    return `<a href="/api/tweet?hashtag=${hashtag}">${match}</a>`;
  };
  return text.replace(regex, replaceFunc);
}

app.get('/', (req, res) => {
  res.render('index', { tweets, replaceHashtagsWithLinks });
});

app.post('/api/tweet', (req, res) => {
  const { text } = req.body;
  const date = new Date().toISOString();
  const tweet = { text, date };
  tweets.push(tweet);
  res.redirect('/');
});

app.get('/api/tweet', (req, res) => {
  const { hashtag } = req.query;
  const filteredTweets = tweets.filter((tweet) => {
    return tweet.text.includes(hashtag);
  });
  res.json(filteredTweets);
});

app.get('/api/tweets', (req, res) => {
  const { search } = req.query;
  const filteredTweets = tweets.filter((tweet) => {
    return tweet.text.includes(search);
  });
  res.json(filteredTweets);
});

app.post('/api/delete/:tweetId', (req, res) => {
  try {
    const { tweetId } = req.params;
    // Filtra e rimuovi il tweet con l'ID specificato
    tweets = tweets.filter((tweet) => tweet.date !== tweetId);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
