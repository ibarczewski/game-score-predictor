import { authenticateUser } from "../../lib/server-utils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const authResult = await authenticateUser(username, password);

    if (!authResult) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(authResult);
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
