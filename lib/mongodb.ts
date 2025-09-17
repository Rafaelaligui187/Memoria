import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
if (!uri) throw new Error("Please add MONGODB_URI to your .env.local")

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // Reuse connection during hot reloads
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri)
    ;(global as any)._mongoClientPromise = client.connect()
  }
  clientPromise = (global as any)._mongoClientPromise
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise
