const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Demo resource data
let resources = [
  {
    id: "i-101",
    name: "Development Server",
    type: "EC2",
    cpu: 3,
    cost: 120,
    protected: false,
    status: "Running"
  },
  {
    id: "i-102",
    name: "Production Server",
    type: "EC2",
    cpu: 75,
    cost: 350,
    protected: true,
    status: "Running"
  },
  {
    id: "vol-103",
    name: "Unused Storage",
    type: "EBS",
    cpu: 0,
    cost: 45,
    protected: false,
    status: "Available"
  },
  {
    id: "i-104",
    name: "Testing Server",
    type: "EC2",
    cpu: 5,
    cost: 90,
    protected: false,
    status: "Running"
  }
];

// Home
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to FinOpsReaper Backend API"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running successfully"
  });
});

// Get all resources
app.get("/api/resources", (req, res) => {
  res.json(resources);
});

// Add a new resource
app.post("/api/resources", (req, res) => {
  const { id, name, type, cpu, cost, protected: isProtected, status } = req.body;

  if (!id || !name || !type) {
    return res.status(400).json({
      message: "ID, name and type are required"
    });
  }

  const newResource = {
    id,
    name,
    type,
    cpu: Number(cpu) || 0,
    cost: Number(cost) || 0,
    protected: Boolean(isProtected),
    status: status || "Running"
  };

  resources.push(newResource);

  res.status(201).json({
    message: "Resource added successfully",
    resource: newResource
  });
});

// Run scan
app.post("/api/scan", (req, res) => {
  const idleResources = resources.filter(
    resource => resource.cpu < 10 && !resource.protected
  );

  const totalWaste = idleResources.reduce(
    (sum, resource) => sum + resource.cost,
    0
  );

  res.json({
    totalResources: resources.length,
    idleCount: idleResources.length,
    protectedCount: resources.filter(r => r.protected).length,
    estimatedMonthlyWaste: totalWaste,
    idleResources
  });
});

app.listen(PORT, () => {
  console.log(
    `FinOpsReaper backend running at http://localhost:${PORT}`
  );
});