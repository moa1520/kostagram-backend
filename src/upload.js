import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-northeast-2"
});

const upload = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "kostagram",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

export const uploadMiddleware = upload.single("file");
export const uploadMiddlewareMulti = upload.array("file", 5);

export const uploadController = (req, res) => {
  const {
    file: { location }
  } = req;
  res.json({ location });
};

export const uploadControllerMulti = (req, res) => {
  const { files } = req;
  let location = [];
  files.map(file => {
    location.push(file.location);
  });
  console.log(location);
  res.json({ location });
};
