import express, { json } from "express";
import cors from "cors";
import multer, { memoryStorage } from "multer";
import { get, insertFreightRate } from "./dbOperations.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json()); // to parse incoming JSON requests
// Set up multer
const storage = memoryStorage(); // or use diskStorage for file saving
const upload = multer({ storage });

// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileBuffer = req.file.buffer; // raw file data
    const jsonString = fileBuffer.toString("utf-8"); // convert buffer to string
    const jsonData = JSON.parse(jsonString); // now it's a JavaScript object
    const result = await insertFreightRate(jsonData);
    if(result.status){
      res.status(201).json({status: true, message: result.message});
    }else{
      res.status(500).json({status: false, message: "something went wrong!"});
    }
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/allFreightRate", async(req,res)=>{
   const result =  await get();
   res.status(200).json({
    status: true,
    message : "All data",
    data: result
   })
})

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
