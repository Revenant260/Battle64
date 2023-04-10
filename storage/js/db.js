var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/battle64";



module.exports.conn = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.close();
        if (err) throw err;
        var dbo = db.db("battle64");
        dbo.createCollection(data, function(err, res) {
          if (err) throw err;
          db.close();
          return "Collection created!"
        });
      });
}

module.exports.coll = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        dbo.createCollection("customers", function(err, res) {
          if (err) throw err;
          db.close();
          return "Collection created!"
        });
      }); 
}

module.exports.ins = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        var myobj = { name: "Company Inc", address: "Highway 37" };
        dbo.collection("customers").insertOne(myobj, function(err, res) {
          if (err) throw err;
          db.close();
          return "1 document inserted"
        });
      }); 
}

module.exports.idins = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        var myobj = [
          { _id: 154, name: 'Chocolate Heaven'},
          { _id: 155, name: 'Tasty Lemon'},
          { _id: 156, name: 'Vanilla Dream'}
        ];
        dbo.collection("products").insertMany(myobj, function(err, res) {
          if (err) throw err;
          db.close();
          return res
        });
      }); 
}

module.exports.mins = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        var myobj = [
          { name: 'John', address: 'Highway 71'},
          { name: 'Peter', address: 'Lowstreet 4'},
          { name: 'Amy', address: 'Apple st 652'},
          { name: 'Hannah', address: 'Mountain 21'},
          { name: 'Michael', address: 'Valley 345'},
          { name: 'Sandy', address: 'Ocean blvd 2'},
          { name: 'Betty', address: 'Green Grass 1'},
          { name: 'Richard', address: 'Sky st 331'},
          { name: 'Susan', address: 'One way 98'},
          { name: 'Vicky', address: 'Yellow Garden 2'},
          { name: 'Ben', address: 'Park Lane 38'},
          { name: 'William', address: 'Central st 954'},
          { name: 'Chuck', address: 'Main Road 989'},
          { name: 'Viola', address: 'Sideway 1633'}
        ];
        dbo.collection("customers").insertMany(myobj, function(err, res) {
          if (err) throw err;
          db.close();
          return "Number of documents inserted: " + res.insertedCount
        });
      }); 
}

module.exports.get = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        var query = { address: "Park Lane 38" };
        dbo.collection("customers").find(query).toArray(function(err, result) {
          if (err) throw err;
          db.close();
          return result
        });
      }); 
}

module.exports.updt = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        var myquery = { address: "Valley 345" };
        var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
        dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          db.close();
          return "1 document updated"
        });
      });
}

module.exports.del = function(ip, data) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("battle64");
        var myquery = { address: 'Mountain 21' };
        dbo.collection("customers").deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          db.close();
          return "1 document deleted"
        });
      }); 
}