const express = require('express');
const mongoose = require('mongoose');
const Post = require('./model/post');
const app = express();

app.use(express.json())

// connecting to database
mongoose.connect('mongodb://127.0.0.1:27017/Simple_Blog_API');

const database = mongoose.connection;

// Check connection
database.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for errors
database.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});




// create post and save post to database
app.post('/posts',async (req, res) =>{
  const {title, body, author} = req.body;
 try {
  if (typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof author !== 'string'){
    return res.status(500).json({error: 'title, body and author must be a string'});
  }
   const post = await Post.create(req.body)
   res.status(200).json(post);

 } catch (error) {
  console.log(error.message);
  res.status(500).json({message: error.message})
 }

})

//get posts
app.get('/posts', async (req, res) =>{
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({message: error.message})
  }
})
// get single post
app.get('/posts/:id', async(req, res) =>{
  try {
    const {id} = req.params;
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// update post

app.put('/posts/:id', async(req, res)=>{
  try {
    const {id} = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    if(!post){
      return res.status(404).json({message: `cannot find post with ID ${id}`});
}
const updatedPost = await Post.findById(id);
res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// delete post
app.delete('/posts/:id', async(req, res)=>{
  try {
    const {id} = req.params;
    const post = await Post.findByIdAndDelete(id);
    if(!post){
      return res.status(404).json({message: `cannot find post with ID ${id}`})
   }
   res.status(200).json(post);
   
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})


// routes

app.get('/', (req, res) =>{
    res.send('Hello Grace')
})

app.get('/blog', (req, res) =>{
    res.send('Hello Blog, my name is Grace')
})
app.listen(3000, ()=>{
    console.log('App is running on port 3000')
})

