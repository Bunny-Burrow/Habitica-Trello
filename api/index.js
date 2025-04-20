export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    name: "Habitica Sync",
    description: "Sync Trello cards to Habitica.",
    author: "Jose Guzman",
    capabilities: ["card-buttons"],
    connectors: {
      iframe: {
        url: "/index.html"
      }
    }
  });
}
