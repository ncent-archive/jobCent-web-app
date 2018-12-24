'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            hash: {
                type: Sequelize.STRING
            },
            publicKey: {
                type: Sequelize.STRING
            },
            privateKey: {
                type: Sequelize.STRING
            },
            otpKey: {
                type: Sequelize.STRING
            },
            otpExp: {
                type: Sequelize.BIGINT
            },
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            company: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};