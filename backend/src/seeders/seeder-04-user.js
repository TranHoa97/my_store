'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert(
      "user",
      [
        {
          username: "admin",
          email: "admin@gmail.com",
          phone: "0123456789 ",
          address: "HN",
          password: "$2b$10$H8BaS6.Krhs3seEobvdrNeoqMwt3aEbLMhBoZwlIqtNIazth1h.su",
          group_id: 1,
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user', null, {});
  }
};
