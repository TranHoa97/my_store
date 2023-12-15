'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('variant', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING
            },
            price: {
                type: Sequelize.STRING
            },
            quantity: {
                type: Sequelize.STRING
            },
            sold: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            slug: {
                type: Sequelize.STRING
            },
            ram: {
                type: Sequelize.STRING
            },
            storage: {
                type: Sequelize.STRING
            },
            cpu: {
                type: Sequelize.STRING
            },
            display: {
                type: Sequelize.STRING
            },
            graphics: {
                type: Sequelize.STRING
            },
            weight: {
                type: Sequelize.STRING
            },
            product_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: "product",
                    key: 'id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                allowNull: false
            },
            updatedAt: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                allowNull: false
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('variant');
    }
};