credentials = require('./credentials.json');
var mysql = require("mysql");

credentials.host = "ids";
var connection = mysql.createConnection(credentials);

connection.connect(function(err){
if(err){
console.log("Problems with MySQL: " + err);
}else {
console.log("Conneced to Database.");
}});

connection.query('SHOW DATABASES', function(err, rows, fields){
var holder=0;
if(err){
console.log('Error looking up databases');
return;}
for(i=0;i<rows.length;i++){
holder++;
KnowDataBase(rows[i].Database, holder == rows.length);
}});

function findTableFields(DB, TableName, holder, RowsLeft){
connection.query('DESCRIBE ' + DB + '.' + TableName, function(noTable, rowTable, TableFeilds){
if(noTable){
console.log("Error No Table" + noTable);
return;}
console.log("---|"+DB + "\n" + "......|" + DB + "." + TableName + ">");
for(i=0;i<rowTable.length;i++){
console.log("\tFieldName: `"+ rowTable[i].Field + "` \t" + "(" + rowTable[i].Type + ")");}
if (holder&&RowsLeft) {
connection.end();}
});}

function findTables(DB,tableList,holder){
var RowsLeft=0;
for(i=0;i<tableList.length;i++){
RowsLeft++;
var query = "Tables_in_" + DB;
var table1 = tableList[i][query];
findTableFields(DB, table1, holder, RowsLeft == tableList.length);
}}

function KnowDataBase(name, holder){
connection.query('SHOW TABLES FROM ' + name, function(errDB, rowsDB, fieldsDB){
if(errDB){
console.log("this is the error: " + errDB);
return;}
findTables(name, rowsDB, holder);
});}

