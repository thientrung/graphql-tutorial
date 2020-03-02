import jwt from "jsonwebtoken";

const getUserId = req => {
  const header = req.req.header('authorization');

  if (!header) {
    throw new Error("Authentication required");
  }

  const token = header.replace("Bearer", "");
  const decoded = jwt.verify(token, "thisismysecret");

  return decoded.userId;
};

export default getUserId;
