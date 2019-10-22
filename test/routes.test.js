const Bootcamp = require('../models/Bootcamp');
const { MongoClient } = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URI, {
      useNewUrlParser: true
    });
    db = await connection.db(global.bootcamp);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  test('Should fetch all bootcamps', async () => {
    const bootcamps = await Bootcamp.findOne({
      _id: '5dc6c20bd241963cc4ee151d'
    });
    expect(bootcamps.name).toEqual('Devworks Bootcamp');
  });
});
