import express from "express";
import "dotenv/config";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { and, eq } from "drizzle-orm";
import { favoritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT || 5001;
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.post("/api/favorites", async (req, res) => {
    try {
 const { userId, recipeId, title, image, cookTime, servings } = req.body; 

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newFavorite = await db.insert(favoritesTable).values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings
    }).returning();
    res.status(201).json(newFavorite[0]);
  } catch (error) {
console.error("Error adding favorite recipe:", error);
    res.status(500).json({ message: "Error adding favorite recipe" });
  }
});

app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userFavorites = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.userId, userId));

    res.status(200).json(userFavorites);
  } catch (error) {
    console.log("Error fetching the favorites", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoritesTable)
      .where(
        and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});