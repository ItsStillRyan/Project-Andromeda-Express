'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('userDetails', {
      id: {type:'int', unsigned:true, primaryKey:true, autoIncrement:true},
      fname: {type: 'string', length: 100},
      lName: {type: 'string', length: 100},
      contact: {type: 'int'},
      email: {type: 'string'},
      address: {type: 'string'},
      postalCode: {type: 'int'},
  })
};

exports.down = function(db) {
  return db.dropTable('userDetails')
};

exports._meta = {
  "version": 1
};
