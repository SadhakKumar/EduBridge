import { Request, Response } from "express";
import { ObjectId, GridFSBucketReadStream } from "mongodb";
import { gridfsBucket } from "../service/database.service";

export const getPdfFileById = async (req: Request, res: Response) => {
  try {
    const fileId = new ObjectId(req.params.fileId);

    const file = await gridfsBucket.find({ _id: fileId }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Create a read stream
    const readStream: GridFSBucketReadStream =
      gridfsBucket.openDownloadStream(fileId);

    // Set the response headers
    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   'inline; filename="' + file[0].filename + '"'
    // );

    // Pipe the read stream to the response
    readStream.pipe(res);
  } catch (error) {
    console.error("Error streaming file:", error);
    res.status(500).send("Error streaming file");
  }
};
