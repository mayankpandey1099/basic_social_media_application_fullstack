require("dotenv").config();


const express = require("express");
const path = require('path');
const cors = require('cors');
const sequelize = require('./database');

const Post = require("./models/Post");
const Comment = require("./models/Comment");


const app  = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

const userRoute = require('./routes/userRoute');
app.use('/api/create-post', userRoute);

Comment.belongsTo(Post, {
    foreignKey: "PostId", 
    onDelete: "CASCADE",
});
Post.hasMany(Comment, {
    foreignKey: 'PostId',
    onDelete: 'CASCADE',
});

const port = process.env.PORT || 3000;

sequelize.sync()
.then(() =>{
    console.log("the database is connected successfully");
    app.listen(port, () => {
      console.log(`The port is running on ${port}`);
    });
    app.get("*",(req, res) => {
        res.sendFile(path.join(__dirname, 'public', "index.html"));
    });  
})
.catch((err) =>{
    console.log("Error connecting to the database:", err);
})

