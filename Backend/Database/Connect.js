const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/taskApp';


const options = {
    useUnifiedTopology: true,
};

mongoose.connect(dbURI, options).then(() => console.log("Connection Successfully")).catch((err) => console.log(err))