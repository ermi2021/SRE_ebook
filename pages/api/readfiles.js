// pages/api/readfiles.js
import fs from "fs";
import path from "path";
import getConfig from "next/config";

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => {
  const pdfImages = [];
  const { serverRuntimeConfig } = getConfig();

  const dirRelativeToPublicFolder = "";

  const dir = path.join(
    serverRuntimeConfig.PROJECT_ROOT,
    "../pdfImages",
    dirRelativeToPublicFolder
  );

  const files = fs.readdirSync(dir, { encoding: "base64" });
  const filenames = fs.readdirSync(dir);
  const readFil = fs.readFile(dir);

  const images = filenames.map((name) =>
    fs.readFileSync(path.join(dir, name), {
      encoding: "base64",
    })
  );
  res.statusCode = 200;
  res.json(images);
};
