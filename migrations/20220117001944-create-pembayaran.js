'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pembayaran', {
      id_pembayaran: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_petugas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model : "petugas",
          key: "id_petugas"
        }
      },
      nisn: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model : "siswa",
          key: "nisn"
        }
      },
      tanggal_bayar: {
        type: Sequelize.DATE
      },
      bulan_bayar: {
        type: Sequelize.STRING
      },
      tahun_bayar: {
        type: Sequelize.STRING
      },
      jumlah_bayar: {
        type: Sequelize.INTEGER
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pembayaran');
  }
};