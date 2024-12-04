import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap } from "azle";
import express from "express";
import { time } from "azle";

/**
 * This type represents an ArtToken, which is an NFT (Non-Fungible Token) representing digital art.
 */
class ArtToken {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  price: number;
  createdAt: Date;
  updatedAt: Date | null;
}

const artTokensStorage = StableBTreeMap<string, ArtToken>(0);

const app = express();
app.use(express.json());

// Endpoint to create a new ArtToken (NFT)
app.post("/arttokens", (req, res) => {
  const artToken: ArtToken = {
    id: uuidv4(),
    createdAt: getCurrentDate(),
    ...req.body,
  };
  artTokensStorage.insert(artToken.id, artToken);
  res.json(artToken);
});

// Endpoint to retrieve all ArtTokens
app.get("/arttokens", (req, res) => {
  res.json(artTokensStorage.values());
});

// Endpoint to retrieve a specific ArtToken by ID
app.get("/arttokens/:id", (req, res) => {
  const artTokenId = req.params.id;
  const artTokenOpt = artTokensStorage.get(artTokenId);
  if (!artTokenOpt) {
    res.status(404).send(`The ArtToken with ID ${artTokenId} not found`);
  } else {
    res.json(artTokenOpt);
  }
});

// Endpoint to update an ArtToken by ID
app.put("/arttokens/:id", (req, res) => {
  const artTokenId = req.params.id;
  const artTokenOpt = artTokensStorage.get(artTokenId);
  if (!artTokenOpt) {
    res
      .status(400)
      .send(`Couldn't update the ArtToken with ID ${artTokenId}. ArtToken not found`);
  } else {
    const artToken = artTokenOpt;
    const updatedArtToken = {
      ...artToken,
      ...req.body,
      updatedAt: getCurrentDate(),
    };
    artTokensStorage.insert(artToken.id, updatedArtToken);
    res.json(updatedArtToken);
  }
});

// Endpoint to delete an ArtToken by ID
app.delete("/arttokens/:id", (req, res) => {
  const artTokenId = req.params.id;
  const deletedArtToken = artTokensStorage.remove(artTokenId);
  if (!deletedArtToken) {
    res
      .status(400)
      .send(`Couldn't delete the ArtToken with ID ${artTokenId}. ArtToken not found`);
  } else {
    res.json(deletedArtToken);
  }
});

// Start the Express server
app.listen(8000, () => {
  console.log("ArtToken server running on http://localhost:8000");
});

function getCurrentDate() {
  const timestamp = new Number(time());
  return new Date(timestamp.valueOf() / 1000_000);
}
