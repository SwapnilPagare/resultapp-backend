console.log("server runing");
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(methodOverride());
app.use(cors());

app.listen(process.env.PORT || 8080);

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "swapnil"
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS studentdb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  con.query("USE studentdb", function (err, result) {
    if (err) throw err;
    console.log("using");
  });

  var sql = "CREATE TABLE IF NOT EXISTS studentinfo (fname VARCHAR(255),lname VARCHAR(255),id VARCHAR(255),roll INT,batch VARCHAR(9),phone VARCHAR(20),email VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });

  var sql2 = "CREATE TABLE IF NOT EXISTS studentresult (fname VARCHAR(255),lname VARCHAR(255),id VARCHAR(255),engobtain VARCHAR(255),engoutof VARCHAR(255),mathsobtain VARCHAR(255),mathsoutof VARCHAR(255),phyobtain VARCHAR(255),phyoutof VARCHAR(255),chemobtain VARCHAR(255),chemoutof VARCHAR(255),bioobtain VARCHAR(255),biooutof VARCHAR(255))";
  con.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("ResultTable created");
  });

  var sql3 = "CREATE TABLE IF NOT EXISTS classresult (cname VARCHAR(255),cengobtain VARCHAR(255),cengoutof VARCHAR(255),cmathsobtain VARCHAR(255),cmathsoutof VARCHAR(255),cphyobtain VARCHAR(255),cphyoutof VARCHAR(255),cchemobtain VARCHAR(255),cchemoutof VARCHAR(255),cbioobtain VARCHAR(255),cbiooutof VARCHAR(255))";
  con.query(sql3, function (err, result) {
    if (err) throw err;
    console.log("ClassTable created");
  });

});

app.post("/i", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello i");
  con.query("SELECT id FROM studentinfo WHERE id=" + mysql.escape(parseInt((JSON.stringify(request.body.id).slice(1, -1)))), function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    if (result[0] != undefined) {
      console.log("This Student Id Already Exists!");
      response.send({ "status": "Already Exists" });
    } else {
      console.log("You can add it.");
      response.send({ "status": "Proceed" });
      var insert_sql = "INSERT INTO studentinfo (fname,lname,id,roll,batch,phone,email) VALUES (" + mysql.escape((JSON.stringify(request.body.fname).slice(1, -1))) + "," + mysql.escape((JSON.stringify(request.body.lname).slice(1, -1))) + "," + mysql.escape((parseInt((JSON.stringify(request.body.id).slice(1, -1))))) + "," + mysql.escape((parseInt((JSON.stringify(request.body.roll).slice(1, -1))))) + "," + mysql.escape((JSON.stringify(request.body.batch).slice(1, -1))) + "," + mysql.escape(((JSON.stringify(request.body.phone).slice(1, -1)))) + "," + mysql.escape((JSON.stringify(request.body.email).slice(1, -1))) + ")";
      con.query(insert_sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });

      var insert_result_sql = "INSERT INTO studentresult (fname,lname,id,engobtain,engoutof,mathsobtain,mathsoutof,phyobtain,phyoutof,chemobtain,chemoutof,bioobtain,biooutof) VALUES (" + mysql.escape((JSON.stringify(request.body.fname).slice(1, -1))) + "," + mysql.escape((JSON.stringify(request.body.lname).slice(1, -1))) + "," + mysql.escape((parseInt((JSON.stringify(request.body.id).slice(1, -1))))) + ",'Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added')";
      con.query(insert_result_sql, function (err, result) {
        if (err) throw err;
        console.log("1 result record inserted");
      });
    }
  });
});

app.post("/li", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello li");
  con.query("SELECT id FROM studentinfo WHERE id=" + mysql.escape(parseInt((JSON.stringify(request.body.id).slice(1, -1)))) + " AND fname= " + mysql.escape(((JSON.stringify(request.body.fname).slice(1, -1)))) + " AND lname=" + mysql.escape(((JSON.stringify(request.body.lname).slice(1, -1)))), function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
    if (result[0] == undefined) {
      console.log("This Student Id Not Exists!");
      response.send({ "status": "Not Exists" });
    } else {
      console.log("You can log-in.");
      response.send({ "status": "Proceed" });
    }
  });
});

app.get('/vs', (req, res) => {

  con.query("SELECT * FROM studentinfo", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.post("/editfname", (request, response) => {
  console.log(JSON.stringify(request.body.newfname).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var fnamesql = "UPDATE studentinfo SET fname =" + mysql.escape(JSON.stringify(request.body.newfname).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  var rfnamesql = "UPDATE studentresult SET fname =" + mysql.escape(JSON.stringify(request.body.newfname).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));

  con.query(fnamesql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  con.query(rfnamesql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " result record(s) updated");
  });
});

app.post("/editlname", (request, response) => {
  console.log(JSON.stringify(request.body.newlname).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var lnamesql = "UPDATE studentinfo SET lname =" + mysql.escape(JSON.stringify(request.body.newlname).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  var rlnamesql = "UPDATE studentresult SET lname =" + mysql.escape(JSON.stringify(request.body.newlname).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));

  con.query(lnamesql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
  con.query(rlnamesql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " result record(s) updated");
  });
});

app.post("/editid", (request, response) => {
  console.log(JSON.stringify(request.body.newid).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");

  con.query("SELECT id FROM studentinfo WHERE id=" + mysql.escape(parseInt((JSON.stringify(request.body.newid).slice(1, -1)))), function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    if (result[0] != undefined) {
      console.log("This Student Id Already Exists!");

    } else {
      console.log("You can add it.");

      var idsql = "UPDATE studentinfo SET id =" + mysql.escape(parseInt(JSON.stringify(request.body.newid).slice(1, -1))) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
      var ridsql = "UPDATE studentresult SET id =" + mysql.escape(parseInt(JSON.stringify(request.body.newid).slice(1, -1))) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));

      con.query(idsql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      });

      con.query(ridsql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
      });
    }
  });

});

app.post("/editroll", (request, response) => {
  console.log(JSON.stringify(request.body.newroll).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var rollsql = "UPDATE studentinfo SET roll =" + mysql.escape(parseInt(JSON.stringify(request.body.newroll).slice(1, -1))) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(rollsql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/editbatch", (request, response) => {
  console.log(JSON.stringify(request.body.newbatch).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var batchsql = "UPDATE studentinfo SET batch =" + mysql.escape(JSON.stringify(request.body.newbatch).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(batchsql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/editphone", (request, response) => {
  console.log(JSON.stringify(request.body.newphone).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var phonesql = "UPDATE studentinfo SET phone =" + mysql.escape(JSON.stringify(request.body.newphone).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(phonesql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/editemail", (request, response) => {
  console.log(JSON.stringify(request.body.newemail).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var emailsql = "UPDATE studentinfo SET email =" + mysql.escape(JSON.stringify(request.body.newemail).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(emailsql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/delete", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello delete");
  con.query("DELETE FROM studentinfo WHERE id=" + mysql.escape(parseInt((JSON.stringify(request.body.id).slice(1, -1)))) + " AND fname= " + mysql.escape(((JSON.stringify(request.body.fname).slice(1, -1)))) + " AND lname=" + mysql.escape(((JSON.stringify(request.body.lname).slice(1, -1)))), function (err, result, fields) {
    if (err) throw err;
  });
});

app.post("/sresult", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello li");
  con.query("SELECT * FROM studentresult WHERE id=" + mysql.escape(parseInt((JSON.stringify(request.body.id).slice(1, -1)))) + " AND fname= " + mysql.escape(((JSON.stringify(request.body.fname).slice(1, -1)))) + " AND lname=" + mysql.escape(((JSON.stringify(request.body.lname).slice(1, -1)))), function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
    response.send(result);
  });
});

app.post("/eng", (request, response) => {
  console.log(JSON.stringify(request.body.emarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var markssql = "UPDATE studentresult SET engobtain =" + mysql.escape(JSON.stringify(request.body.emarks).slice(1, -1)) + ",engoutof=" + mysql.escape(JSON.stringify(request.body.eoutof).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(markssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/maths", (request, response) => {
  console.log(JSON.stringify(request.body.mmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var markssql = "UPDATE studentresult SET mathsobtain =" + mysql.escape(JSON.stringify(request.body.mmarks).slice(1, -1)) + ",mathsoutof=" + mysql.escape(JSON.stringify(request.body.moutof).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(markssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/phy", (request, response) => {
  console.log(JSON.stringify(request.body.pmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var markssql = "UPDATE studentresult SET phyobtain =" + mysql.escape(JSON.stringify(request.body.pmarks).slice(1, -1)) + ",phyoutof=" + mysql.escape(JSON.stringify(request.body.poutof).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(markssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/chem", (request, response) => {
  console.log(JSON.stringify(request.body.cmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var markssql = "UPDATE studentresult SET chemobtain =" + mysql.escape(JSON.stringify(request.body.cmarks).slice(1, -1)) + ",chemoutof=" + mysql.escape(JSON.stringify(request.body.coutof).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(markssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/bio", (request, response) => {
  console.log(JSON.stringify(request.body.bmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.id).slice(1, -1) + "hello edit 2");
  var markssql = "UPDATE studentresult SET bioobtain =" + mysql.escape(JSON.stringify(request.body.bmarks).slice(1, -1)) + ",biooutof=" + mysql.escape(JSON.stringify(request.body.boutof).slice(1, -1)) + " WHERE id = " + mysql.escape(parseInt(JSON.stringify(request.body.id).slice(1, -1)));
  con.query(markssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});


app.post("/ic", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello i");
  con.query("SELECT cname FROM classresult WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1))), function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    if (result[0] != undefined) {
      console.log("This Class Already Exists!");
    } else {
      console.log("You can add it.");

      var insert_class_sql = "INSERT INTO classresult (cname,cengobtain,cengoutof,cmathsobtain,cmathsoutof,cphyobtain,cphyoutof,cchemobtain,cchemoutof,cbioobtain,cbiooutof) VALUES (" + mysql.escape(((JSON.stringify(request.body.cname).slice(1, -1)))) + ",'Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added','Not_Added')";
      con.query(insert_class_sql, function (err, result) {
        if (err) throw err;
        console.log("1 result record inserted");
      });
    }
  });
});

app.get('/vc', (req, res) => {

  con.query("SELECT * FROM classresult", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

app.post("/cdelete", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello cdelete");
  con.query("DELETE FROM classresult WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1))), function (err, result, fields) {
    if (err) throw err;
  });
});

app.post("/cresult", (request, response) => {
  console.log(JSON.stringify(request.body) + "hello cr");
  con.query("SELECT * FROM classresult WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1))), function (err, result, fields) {
    if (err) throw err;
    console.log(result[0]);
    response.send(result);
  });
});

app.post("/ceng", (request, response) => {
  console.log(JSON.stringify(request.body.emarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.cname).slice(1, -1) + "hello edit 2");
  var cmarkssql = "UPDATE classresult SET cengobtain =" + mysql.escape(JSON.stringify(request.body.emarks).slice(1, -1)) + ",cengoutof=" + mysql.escape(JSON.stringify(request.body.eoutof).slice(1, -1)) + " WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1)));
  con.query(cmarkssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/cmaths", (request, response) => {
  console.log(JSON.stringify(request.body.mmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.cname).slice(1, -1) + "hello edit 2");
  var cmarkssql = "UPDATE classresult SET cmathsobtain =" + mysql.escape(JSON.stringify(request.body.mmarks).slice(1, -1)) + ",cmathsoutof=" + mysql.escape(JSON.stringify(request.body.moutof).slice(1, -1)) + " WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1)));
  con.query(cmarkssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/cphy", (request, response) => {
  console.log(JSON.stringify(request.body.pmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.cname).slice(1, -1) + "hello edit 2");
  var cmarkssql = "UPDATE classresult SET cphyobtain =" + mysql.escape(JSON.stringify(request.body.pmarks).slice(1, -1)) + ",cphyoutof=" + mysql.escape(JSON.stringify(request.body.poutof).slice(1, -1)) + " WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1)));
  con.query(cmarkssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/cchem", (request, response) => {
  console.log(JSON.stringify(request.body.cmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.cname).slice(1, -1) + "hello edit 2");
  var cmarkssql = "UPDATE classresult SET cchemobtain =" + mysql.escape(JSON.stringify(request.body.cmarks).slice(1, -1)) + ",cchemoutof=" + mysql.escape(JSON.stringify(request.body.coutof).slice(1, -1)) + " WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1)));
  con.query(cmarkssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/cbio", (request, response) => {
  console.log(JSON.stringify(request.body.bmarks).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.cname).slice(1, -1) + "hello edit 2");
  var cmarkssql = "UPDATE classresult SET cbioobtain =" + mysql.escape(JSON.stringify(request.body.bmarks).slice(1, -1)) + ",cbiooutof=" + mysql.escape(JSON.stringify(request.body.boutof).slice(1, -1)) + " WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1)));
  con.query(cmarkssql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});

app.post("/editcname", (request, response) => {
  console.log(JSON.stringify(request.body.newcname).slice(1, -1) + "hello edit");
  console.log(JSON.stringify(request.body.cname).slice(1, -1) + "hello edit 2");
  var cnamesql = "UPDATE classresult SET cname =" + mysql.escape(JSON.stringify(request.body.newcname).slice(1, -1)) + " WHERE cname=" + mysql.escape((JSON.stringify(request.body.cname).slice(1, -1)));
  con.query(cnamesql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
});