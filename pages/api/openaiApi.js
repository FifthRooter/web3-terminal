// pages/api/openaiApi.js

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: false,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("OpenAI API error:", errorDetails);
      return res.status(500).json({ message: "OpenAI API error" });
    }

    const json = await response.json();
    res.status(200).json(json.choices[0].message.content);
  } catch (error) {
    console.error("Error in openaiApi handler:", error);
    res.status(500).json({ message: "An error occurred" });
  }
}
