import { USER_NUMBER_COLLECTION } from "../../../data-access/collections.js";
import { connectToScenesDB } from "../../../data-access/db.js";

export const getAndIncrementUserNumber = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(USER_NUMBER_COLLECTION);

  const result = await collection.findOneAndUpdate(
    { _id: "userNumber" }, // Identifier for the counter document
    { $inc: { value: 1 } }, // Increment the 'value' field by 1
    {
      returnDocument: "after", // Return the document after the update
      upsert: true, // Create the document if it doesn't exist
    },
  );

  return result.value;
};

export const resetUserNumberCollection = async () => {
  const db = await connectToScenesDB();
  const collection = db.collection(USER_NUMBER_COLLECTION);

  const collectionExists = await db
    .listCollections({ name: USER_NUMBER_COLLECTION })
    .hasNext();

  if (!collectionExists) await db.createCollection(USER_NUMBER_COLLECTION);

  // Reset or create the counter document
  await collection.updateOne(
    { _id: "userNumber" },
    { $set: { value: 1 } },
    { upsert: true },
  );
};
