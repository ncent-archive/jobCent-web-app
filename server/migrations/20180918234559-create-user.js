'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            uuid: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            username: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            publicKey: {
                type: Sequelize.STRING,
                allowNull: false
            },
            privateKey: {
                type: Sequelize.STRING,
                allowNull: false
            },
            otpKey: {
                type: Sequelize.STRING
            },
            otpExp: {
                type: Sequelize.INTEGER
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