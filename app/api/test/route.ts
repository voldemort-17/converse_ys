import clientPromise from "@/lib/mongdb";

export async function GET() {
  try {
    // Try connecting
    const client = await clientPromise;
    const db = client.db("admin"); // admin DB always exists

    // Run a simple command to check server status
    const result = await db.command({ ping: 1 });

    if (result.ok === 1) {
      return Response.json({ connected: true, message: "MongoDB connection successful" });
    }

    return Response.json({ connected: false, message: "MongoDB ping failed" });
  } finally{
    console.log('happy');
  };
}
