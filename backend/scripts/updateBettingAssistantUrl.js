const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });

const Project = require('../models/Project');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codebyceddb';

async function updateBettingAssistantUrl() {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  const result = await Project.findOneAndUpdate(
    { title: { $regex: /betting|smart.*sport/i } },
    { demoLink: 'https://betgistics.com/' },
    { new: true }
  );

  if (result) {
    console.log(`Updated project: "${result.title}"`);
    console.log(`demoLink is now: ${result.demoLink}`);
  } else {
    console.log('No matching project found. Listing all projects:');
    const all = await Project.find({}, 'title demoLink');
    all.forEach(p => console.log(` - "${p.title}": ${p.demoLink}`));
  }

  await mongoose.disconnect();
}

updateBettingAssistantUrl().catch(err => {
  console.error(err);
  process.exit(1);
});
