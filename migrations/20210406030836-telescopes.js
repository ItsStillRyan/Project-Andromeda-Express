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
  return db.createTable('telescopes', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      name: {type: 'string', length:200},
      description: {type:'text'},
      stock: {type: 'smallint'},
      price: {type: 'smallint'},
      weight: {type: 'int'},
      userLevel: {type: 'string', length:50},
      imagingType: {type: 'string', length:100},
      opticalDesign: {type: 'string', length:100},
      apertureRange: {type: 'string', length:100},
      fratioRange: {type: 'string', length:100}
      
  })
};

exports.down = function(db) {
  return db.dropTable('telescopes');
};

exports._meta = {
  "version": 1
};
