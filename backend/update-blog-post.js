const mongoose = require('mongoose');
const Blog = require('./models/Blog');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://cedrickcarter:cedrickcarter@cluster0.mongodb.net/codebyced?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Find the blog post with hub1.png
    Blog.find({ coverImage: { $regex: 'hub1.png', $options: 'i' } })
      .then(blogs => {
        if (blogs.length === 0) {
          console.log('No blog post found with hub1.png as coverImage');
          mongoose.disconnect();
          return;
        }
        
        console.log(`Found ${blogs.length} blog post(s) with hub1.png as coverImage`);
        
        // Update each blog post to be published
        const updatePromises = blogs.map(blog => {
          console.log(`Updating blog post: ${blog._id} - ${blog.title}`);
          return Blog.findByIdAndUpdate(
            blog._id,
            { published: true },
            { new: true }
          );
        });
        
        Promise.all(updatePromises)
          .then(updatedBlogs => {
            console.log('Updated blog posts:', updatedBlogs);
            mongoose.disconnect();
          })
          .catch(err => {
            console.error('Error updating blog posts:', err);
            mongoose.disconnect();
          });
      })
      .catch(err => {
        console.error('Error finding blog posts:', err);
        mongoose.disconnect();
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  }); 