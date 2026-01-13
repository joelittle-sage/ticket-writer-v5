export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { template, input } = req.body;

  return res.status(200).json({
    html: `
      <h2>TEST OK</h2>
      <p><strong>Template:</strong></p>
      <pre>${template}</pre>
      <p><strong>Input:</strong></p>
      <p>${input}</p>
    `,
  });
}
