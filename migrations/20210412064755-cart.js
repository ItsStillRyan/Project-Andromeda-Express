'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable('cart', {
        id: { type: 'int', primaryKey: true, autoIncrement: true, unsigned: true  },
        quantity: { type: 'int', unsigned: true },
        // users_id: {
        //     type: 'int',
        //     notNull: true,
        //     foreignKey: {
        //         name: 'cart_user_fk',
        //         table: 'users',
        //         rules: {
        //             onDelete: 'cascade',
        //             onUpdate: 'cascade'
        //         },
        //     }
        // },
        // telescope_id: {
        //     type: 'int',
        //     notNull: true,
        //     foreignKey: {
        //         name: 'cart_telescope_fk',
        //         table: 'telescopes',
        //         rules: {
        //             onDelete: 'cascade',
        //             onUpdate: 'restrict'
        //         }
        //     }
        // }

    })
};
exports.up = function (db) {
    return db.createTable('cart', {
        id: {
            type: 'int',
            unsigned: true,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: 'int',
            unsigned: true
        },
        telescope_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'cart_telescope_fk',
                table: 'telescopes',
                mapping: 'id',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT'
                }
            }
        },
        users_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'cart_users_fk',
                table: 'users',
                mapping: 'id',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            }
        }
    });
};
exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
