import dotenv from "dotenv";
import OpenAI from "openai";
import readline from "readline";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get user input
const getUserInput = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (input) => {
      resolve(input);
    });
  });
};

// Display a menu for users to choose options
async function showMenu() {
  console.clear();
  console.log("\n=== Interactive Prompt Playground ===");
  console.log("Model: gpt-3.5-turbo (fixed)");
  console.log("\n1. Single prompt test");
  console.log("2. Parameter comparison test");
  console.log("3. Full parameter grid test");
  console.log("4. Exit");

  const choice = await getUserInput("\nSelect an option (1-4): ");

  switch (choice) {
    case "1":
      await runSinglePrompt();
      break;
    case "2":
      await runParameterComparison();
      break;
    case "3":
      await runFullParameterGrid();
      break;
    case "4":
      console.log("Goodbye!");
      rl.close();
      return;
    default:
      console.log("Invalid option, please try again.");
      await showMenu();
  }

  // After each operation, return to the menu unless exiting
  if (choice !== "4") {
    await getUserInput("\nPress Enter to return to menu...");
    await showMenu();
  }
}

// Run a single prompt with configurable parameters
async function runSinglePrompt() {
  console.clear();
  console.log("\n=== Single Prompt Test ===");
  console.log("Model: gpt-3.5-turbo");

  const systemPrompt = await getUserInput("Enter system prompt: ");
  const userPrompt = await getUserInput(
    "Enter user prompt (product to describe): "
  );
  const temperature = parseFloat(
    await getUserInput("Enter temperature (0.0-2.0): ")
  );
  const maxTokens = parseInt(await getUserInput("Enter max tokens: "));
  const presencePenalty = parseFloat(
    await getUserInput("Enter presence penalty (-2.0-2.0): ")
  );
  const frequencyPenalty = parseFloat(
    await getUserInput("Enter frequency penalty (-2.0-2.0): ")
  );
  const stopSequences = (
    await getUserInput(
      "Enter stop sequences (comma separated or leave blank): "
    )
  )
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  console.log("\nGenerating response...");

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
      stop: stopSequences.length > 0 ? stopSequences : undefined,
    });

    console.log("\n=== Response ===");
    console.log(chatCompletion.choices[0].message.content);

    console.log("\n--- Token Usage ---");
    console.log(`Prompt tokens: ${chatCompletion.usage.prompt_tokens}`);
    console.log(`Completion tokens: ${chatCompletion.usage.completion_tokens}`);
    console.log(`Total tokens: ${chatCompletion.usage.total_tokens}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run parameter comparison test with a grid of outputs
async function runParameterComparison() {
  console.clear();
  console.log("\n=== Parameter Comparison Test ===");
  console.log("Model: gpt-3.5-turbo");

  const systemPrompt = await getUserInput("Enter system prompt: ");
  const userPrompt = await getUserInput(
    "Enter user prompt (product to describe): "
  );

  const temperatures = [0.0, 0.7, 1.2];
  const maxTokensOptions = [50, 150, 300];
  const presencePenalties = [0.0, 1.5];
  const frequencyPenalties = [0.0, 1.5];

  // Ask user which parameter to vary
  console.log("\nWhich parameter would you like to vary?");
  console.log("1. Temperature");
  console.log("2. Max Tokens");
  console.log("3. Presence Penalty");
  console.log("4. Frequency Penalty");

  const paramChoice = await getUserInput("\nSelect parameter (1-4): ");

  let results = [];
  let paramValues = [];
  let paramName = "";

  console.log("\nGenerating responses...");

  // Set default values
  const defaultConfig = {
    temperature: 0.7,
    max_tokens: 150,
    presence_penalty: 0.0,
    frequency_penalty: 0.0,
  };

  switch (paramChoice) {
    case "1":
      paramValues = temperatures;
      paramName = "Temperature";
      break;
    case "2":
      paramValues = maxTokensOptions;
      paramName = "Max Tokens";
      break;
    case "3":
      paramValues = presencePenalties;
      paramName = "Presence Penalty";
      break;
    case "4":
      paramValues = frequencyPenalties;
      paramName = "Frequency Penalty";
      break;
    default:
      console.log("Invalid choice, defaulting to Temperature");
      paramValues = temperatures;
      paramName = "Temperature";
  }

  // Generate responses for each parameter value
  for (const value of paramValues) {
    const config = { ...defaultConfig };

    // Set the varying parameter
    switch (paramChoice) {
      case "1":
        config.temperature = value;
        break;
      case "2":
        config.max_tokens = value;
        break;
      case "3":
        config.presence_penalty = value;
        break;
      case "4":
        config.frequency_penalty = value;
        break;
    }

    try {
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        presence_penalty: config.presence_penalty,
        frequency_penalty: config.frequency_penalty,
      });

      results.push({
        value,
        response: chatCompletion.choices[0].message.content,
        tokens: chatCompletion.usage.total_tokens,
      });

      console.log(`Completed test with ${paramName}: ${value}`);
    } catch (error) {
      console.error(`Error with ${paramName} ${value}:`, error.message);
      results.push({
        value,
        response: "ERROR: " + error.message,
        tokens: 0,
      });
    }
  }

  // Display results in a table format
  console.log("\n=== Results ===");
  console.log(`\nVarying parameter: ${paramName}`);
  console.log("-".repeat(100));

  for (const result of results) {
    console.log(`\n${paramName}: ${result.value}`);
    console.log("-".repeat(50));
    console.log(result.response);
    console.log("-".repeat(50));
    console.log(`Total tokens: ${result.tokens}`);
    console.log("-".repeat(100));
  }

  // Ask if user wants to save results
  const saveChoice = await getUserInput(
    "\nDo you want to save these results? (y/n): "
  );

  if (saveChoice.toLowerCase() === "y") {
    await saveResults(
      "gpt-3.5-turbo",
      systemPrompt,
      userPrompt,
      paramName,
      results
    );
  }
}

// Run full parameter grid test as specified in the task
async function runFullParameterGrid() {
  console.clear();
  console.log("\n=== Full Parameter Grid Test ===");
  console.log("Model: gpt-3.5-turbo");
  console.log(
    "This will test all parameter combinations as specified in the task.\n"
  );

  const systemPrompt = await getUserInput("Enter system prompt: ");
  const userPrompt = await getUserInput(
    "Enter user prompt (product to describe): "
  );

  // Task-specified parameter values
  const temperatures = [0.0, 0.7, 1.2];
  const maxTokensOptions = [50, 150, 300];
  const presencePenalties = [0.0, 1.5];
  const frequencyPenalties = [0.0, 1.5];

  console.log("\nGenerating responses for all parameter combinations...");
  console.log(
    `Total combinations: ${
      temperatures.length *
      maxTokensOptions.length *
      presencePenalties.length *
      frequencyPenalties.length
    }`
  );

  let results = [];
  let completedTests = 0;
  const totalTests =
    temperatures.length *
    maxTokensOptions.length *
    presencePenalties.length *
    frequencyPenalties.length;

  for (const temperature of temperatures) {
    for (const maxTokens of maxTokensOptions) {
      for (const presencePenalty of presencePenalties) {
        for (const frequencyPenalty of frequencyPenalties) {
          completedTests++;
          console.log(
            `Progress: ${completedTests}/${totalTests} - Testing T:${temperature}, MT:${maxTokens}, PP:${presencePenalty}, FP:${frequencyPenalty}`
          );

          try {
            const chatCompletion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature,
              max_tokens: maxTokens,
              presence_penalty: presencePenalty,
              frequency_penalty: frequencyPenalty,
            });

            results.push({
              temperature,
              maxTokens,
              presencePenalty,
              frequencyPenalty,
              response: chatCompletion.choices[0].message.content,
              tokens: chatCompletion.usage.total_tokens,
              promptTokens: chatCompletion.usage.prompt_tokens,
              completionTokens: chatCompletion.usage.completion_tokens,
            });
          } catch (error) {
            console.error(
              `Error with combination T:${temperature}, MT:${maxTokens}, PP:${presencePenalty}, FP:${frequencyPenalty}:`,
              error.message
            );
            results.push({
              temperature,
              maxTokens,
              presencePenalty,
              frequencyPenalty,
              response: "ERROR: " + error.message,
              tokens: 0,
              promptTokens: 0,
              completionTokens: 0,
            });
          }

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    }
  }

  // Display results in a comprehensive grid
  console.log("\n=== Parameter Grid Results ===");
  console.log(
    "Legend: T=Temperature, MT=Max Tokens, PP=Presence Penalty, FP=Frequency Penalty\n"
  );

  // Create a table-like display
  console.log(
    "| T | MT | PP | FP | Tokens | Response Preview (first 100 chars) |"
  );
  console.log("|---|----|----|----|----|-----|");

  for (const result of results) {
    const preview =
      result.response.substring(0, 100).replace(/\n/g, " ") +
      (result.response.length > 100 ? "..." : "");
    console.log(
      `| ${result.temperature} | ${result.maxTokens} | ${result.presencePenalty} | ${result.frequencyPenalty} | ${result.tokens} | ${preview} |`
    );
  }

  // Ask if user wants to save results
  const saveChoice = await getUserInput(
    "\nDo you want to save the full grid results? (y/n): "
  );

  if (saveChoice.toLowerCase() === "y") {
    await saveGridResults("gpt-3.5-turbo", systemPrompt, userPrompt, results);
  }
}

// Helper function to select model (keeping for backwards compatibility, but always returns gpt-3.5-turbo)
async function selectModel() {
  return "gpt-3.5-turbo";
}

// Helper function to save results to a file
async function saveResults(
  model,
  systemPrompt,
  userPrompt,
  paramName,
  results
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `results_${paramName
    .toLowerCase()
    .replace(/\s+/g, "_")}_${timestamp}.md`;
  const filePath = path.join(process.cwd(), filename);

  let content = `# Parameter Comparison Results\n\n`;
  content += `- **Model**: ${model}\n`;
  content += `- **System Prompt**: ${systemPrompt}\n`;
  content += `- **User Prompt**: ${userPrompt}\n`;
  content += `- **Varying Parameter**: ${paramName}\n\n`;

  content += `## Results\n\n`;

  for (const result of results) {
    content += `### ${paramName}: ${result.value}\n\n`;
    content += "```\n";
    content += result.response + "\n";
    content += "```\n\n";
    content += `Total tokens: ${result.tokens}\n\n`;
    content += "---\n\n";
  }
  fs.writeFileSync(filePath, content);
  console.log(`Results saved to: ${filePath}`);
}

// Helper function to save grid results to a file
async function saveGridResults(model, systemPrompt, userPrompt, results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `parameter_grid_results_${timestamp}.md`;
  const filePath = path.join(process.cwd(), filename);

  let content = `# Parameter Grid Test Results\n\n`;
  content += `- **Model**: ${model}\n`;
  content += `- **System Prompt**: ${systemPrompt}\n`;
  content += `- **User Prompt**: ${userPrompt}\n`;
  content += `- **Test Date**: ${new Date().toISOString()}\n\n`;

  content += `## Parameter Grid Results\n\n`;
  content += `Total combinations tested: ${results.length}\n\n`;

  // Create markdown table
  content += `| Temperature | Max Tokens | Presence Penalty | Frequency Penalty | Total Tokens | Response |\n`;
  content += `|-------------|------------|------------------|-------------------|--------------|----------|\n`;

  for (const result of results) {
    const response = result.response.replace(/\|/g, "\\|").replace(/\n/g, " ");
    content += `| ${result.temperature} | ${result.maxTokens} | ${result.presencePenalty} | ${result.frequencyPenalty} | ${result.tokens} | ${response} |\n`;
  }

  content += `\n## Analysis Summary\n\n`;
  content += `### Temperature Effects:\n`;
  content += `- **0.0**: Deterministic, consistent responses\n`;
  content += `- **0.7**: Balanced creativity and coherence\n`;
  content += `- **1.2**: Higher creativity and variation\n\n`;

  content += `### Max Tokens Effects:\n`;
  content += `- **50**: Brief, concise responses\n`;
  content += `- **150**: Moderate detail\n`;
  content += `- **300**: Detailed responses\n\n`;

  content += `### Presence Penalty Effects:\n`;
  content += `- **0.0**: Natural repetition patterns\n`;
  content += `- **1.5**: Reduced repetition, more diverse vocabulary\n\n`;

  content += `### Frequency Penalty Effects:\n`;
  content += `- **0.0**: Natural word frequency\n`;
  content += `- **1.5**: Reduced word repetition, more varied language\n\n`;

  fs.writeFileSync(filePath, content);
  console.log(`Grid results saved to: ${filePath}`);
}

async function main() {
  try {
    await showMenu();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the readline interface
    rl.close();
  }
}

main();
