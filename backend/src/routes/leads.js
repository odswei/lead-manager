const express = require("express");
const { Lead, LEAD_STATUSES } = require("../models/Lead");

const router = express.Router();

router.get("/", async (_request, response) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  response.json(leads);
});

router.post("/", async (request, response) => {
  const { name, email, status } = request.body;

  if (!name || !email) {
    return response.status(400).json({
      message: "name and email are required"
    });
  }

  if (status && !LEAD_STATUSES.includes(status)) {
    return response.status(400).json({
      message: "status must be one of the allowed values"
    });
  }

  try {
    const lead = await Lead.create({
      name,
      email,
      status: status || "New"
    });

    return response.status(201).json(lead);
  } catch (error) {
    if (error && error.code === 11000) {
      return response.status(409).json({
        message: "A lead with this email already exists"
      });
    }

    if (error && error.name === "ValidationError") {
      return response.status(400).json({
        message: error.message
      });
    }

    return response.status(500).json({
      message: "Failed to create lead"
    });
  }
});

module.exports = router;
