async function handleGenerate() {
  const input = document.getElementById("userInput").value;
  const errorBox = document.getElementById("errorBox");
  const diagramContainer = document.getElementById("diagramContainer");
  const output = document.getElementById("output");
  const mermaidCode = document.getElementById("mermaidCode");

  errorBox.style.display = "none";
  output.innerHTML = "⏳ Generating...";
  diagramContainer.style.display = "none";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // ✅ Updated model
        messages: [
          {
            role: "user",
            content: `Create a simple concept mind map using Mermaid.js format for the following concept. Only return the raw Mermaid code (no Markdown). Input:\n\n"${input}"`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Something went wrong.");
    }

    const result = await response.json();
    let mermaidText = result.choices[0].message.content.trim();

    // ✅ Remove triple backticks and "mermaid" keyword if included
    mermaidText = mermaidText.replace(/```mermaid|```/g, "").trim();

    // ✅ Show in textarea and render in HTML
    mermaidCode.value = mermaidText;
    output.innerHTML = `<pre class="mermaid">${mermaidText}</pre>`;

    // ✅ Initialize Mermaid
    mermaid.initialize({ startOnLoad: false });
    mermaid.init(undefined, output);

    diagramContainer.style.display = "block";
  } catch (err) {
    errorBox.textContent = `❌ ${err.message}`;
    errorBox.style.display = "block";
    output.innerHTML = "";
  }
}

function copyMermaidCode() {
  const code = document.getElementById("mermaidCode");
  code.select();
  document.execCommand("copy");
  alert("✅ Mermaid code copied to clipboard!");
}

function downloadPNG() {
  alert("📸 PNG export not implemented yet.");
}
