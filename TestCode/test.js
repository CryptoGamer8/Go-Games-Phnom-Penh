var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/gogamesphnompenh", function (err, db) {
    
    db.collection('Persons', function (err, collection) {
        
        collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
        collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
        collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });
        
        db.collection('Persons').count(function (err, count) {
            if (err) throw err;
            
            console.log('Total Rows: ' + count);
        });
    });       
});

test = () => {
    for (i = 0; i < 650; i+=3) {
        for (j = 0; j < 650; j += 3){
            timeElapse(i, j);
        }
    }
}

timeElapse = (top, left) => {
    startTime = new Date();
    board = document.getElementById("goboard");
    placePiece('black', top, left)
    endTime = new Date();
    console.log(endTime - startTime)
}