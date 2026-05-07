import { connectToScenesDB } from "../../data-access/db.js";

export const getSceneRecordManager = (collectionName) => {
  return {
    saveRecord: async (data) => {
      const db = await connectToScenesDB();
      const collection = db.collection(collectionName);

      const record = {
        ...data,
        createdOn: new Date(),
      };

      await collection.insertOne(record);
    },

    getRecords: async (top) => {
      const db = await connectToScenesDB();
      const collection = db.collection(collectionName);

      const cursor = collection
        .find({}, { projection: { _id: 0 } })
        .sort({ createdOn: -1 });

      if (typeof top === "number" && top > 0) {
        cursor.limit(top);
      }

      return await cursor.toArray();
    },

    resetCollection: async () => {
      const db = await connectToScenesDB();

      const collectionExists = await db
        .listCollections({ name: collectionName })
        .hasNext();

      collectionExists
        ? await db.collection(collectionName).deleteMany({})
        : await db.createCollection(collectionName);

      console.log(`✅ ${collectionName} reset.`);
    },
  };
};
