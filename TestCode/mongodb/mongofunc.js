const MongoClient = require('mongodb').MongoClient;
const assert = require('assert'); //assert error when failed

const url = 'mongodb://127.0.0.1:27012';
// mongodb://localhost:27017/gogamesphnompenh  对不上url，没创建一个新的

const dbName = 'gogamesphnompenh';

MongoClient.connect(url, function(err,client){
	assert.equal(null,err);
	console.log("connected successfully to mongodb");

	const db = client.db(dbName);

	db.collection("posts", function(err, collection){
		var list = [
		{title:"我爱玩马里奥",tag:"game"},
		{title:"我喜欢node js编程",tag:"it"},
		{title:"我会用MongoDB",tag:"it"}
		];
		collection.insert(list, function(err,result){
			assert.equal(null,err);
			client.close();
		});
	}); 
});

