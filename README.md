# Interactive Prompt Playground

A configurable playground for testing different OpenAI API parameters and comparing outputs across different settings. Built specifically for analyzing how different parameters affect GPT-3.5-turbo responses when generating product descriptions.

## Features

- **Single Prompt Testing**: Test individual prompts with custom parameters
- **Parameter Comparison**: Compare responses by varying one parameter at a time
- **Full Parameter Grid**: Test all combinations of the specified parameter values
- **Automatic Result Export**: Save results to markdown files for documentation
- **Fixed Model**: Uses GPT-3.5-turbo exclusively for consistent testing

## Parameter Testing Values

As specified in the task requirements:

| Parameter         | Test Values   |
| ----------------- | ------------- |
| temperature       | 0.0, 0.7, 1.2 |
| max_tokens        | 50, 150, 300  |
| presence_penalty  | 0.0, 1.5      |
| frequency_penalty | 0.0, 1.5      |

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/shivammchaudhary1/interactive-prompt-playground.git
cd interactive-prompt-playground
```

2. Install dependencies:

```bash
npm install
```

3. Set up your OpenAI API key:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file

```bash
cp .env.example .env
# Edit .env and add your API key
```

4. Run the playground:

```bash
npm start
```

## Usage Guide

### Menu Options

1. **Single Prompt Test**: Test a single prompt with custom parameter values
2. **Parameter Comparison Test**: Compare responses by varying one parameter while keeping others constant
3. **Full Parameter Grid Test**: Test all combinations of the specified parameter values (36 total combinations)
4. **Exit**: Close the application

### Example Usage

For product description testing, you might use:

- **System Prompt**: "You are a marketing copywriter. Write compelling product descriptions that highlight key features and benefits."
- **User Prompt**: "iPhone 15 Pro"

## Sample Output Grid

The application generates comprehensive grids showing how different parameters affect the output. Here's an example from testing iPhone 15 Pro descriptions:

| Temperature | Max Tokens | Presence Penalty | Frequency Penalty | Total Tokens | Response Preview                                                                            |
| ----------- | ---------- | ---------------- | ----------------- | ------------ | ------------------------------------------------------------------------------------------- |
| 0.0         | 50         | 0.0              | 0.0               | 65           | The iPhone 15 Pro features the powerful A17 Pro chip, delivering exceptional performance... |
| 0.0         | 50         | 0.0              | 1.5               | 63           | iPhone 15 Pro showcases cutting-edge A17 Pro technology, enabling seamless multitasking...  |
| 0.7         | 150        | 0.0              | 0.0               | 165          | The iPhone 15 Pro represents Apple's most advanced smartphone technology, featuring...      |
| 1.2         | 50         | 1.5              | 1.5               | 65           | Discover iPhone 15 Pro's groundbreaking A17 Pro technology, engineered for exceptional...   |

_See `sample_parameter_grid_results.md` for complete grid output with all 36 parameter combinations._

## Results Analysis

### Parameter Effects Observed

**Temperature Impact:**

- **0.0**: Produces deterministic, consistent responses with identical outputs for the same input
- **0.7**: Provides balanced creativity while maintaining coherence and factual accuracy
- **1.2**: Generates more creative and varied responses but with potential for less focused content

**Max Tokens Impact:**

- **50**: Creates brief, punchy descriptions focusing on key highlights
- **150**: Allows for moderate detail with good feature coverage
- **300**: Enables comprehensive descriptions with detailed explanations and multiple benefits

**Presence Penalty Impact:**

- **0.0**: Natural language patterns with typical repetition for emphasis
- **1.5**: Reduces repetitive phrasing, encouraging more diverse vocabulary and sentence structures

**Frequency Penalty Impact:**

- **0.0**: Standard word frequency distribution following natural language patterns
- **1.5**: Minimizes word repetition, leading to more varied and sophisticated language choices

### Key Insights

The combination of parameters creates distinct output styles. Lower temperature with higher token limits produces consistent, detailed descriptions. Higher temperature with penalties creates more creative, varied content. The sweet spot for product descriptions appears to be moderate temperature (0.7) with sufficient tokens (150-300) and light penalties for engaging, informative content.

## 2-Paragraph Reflection

**Parameter Impact Analysis**: Through systematic testing of different parameter combinations, distinct patterns emerge in how each setting influences the model's output behavior. Temperature proves to be the most dramatic factor, with 0.0 producing identical, deterministic responses while 1.2 generates more creative and varied language. The presence and frequency penalties work synergistically to reduce repetitive phrasing and encourage vocabulary diversity, with higher penalty values (1.5) leading to more sophisticated and less redundant descriptions. Max tokens primarily controls response length and detail level, with 50 tokens creating punchy highlights, 150 tokens providing balanced coverage, and 300 tokens enabling comprehensive product descriptions.

**Optimal Configuration Discovery**: The testing reveals that balanced parameter settings typically produce the most effective product descriptions for marketing purposes. A temperature of 0.7 strikes an optimal balance between consistency and creativity, ensuring factual accuracy while maintaining engaging language variation. Moderate token limits (150-300) allow sufficient space for persuasive copy without becoming verbose, while light penalties (0.0-1.5) prevent excessive repetition without sacrificing natural language flow. The most compelling descriptions emerged from combinations that preserved the model's natural storytelling ability while introducing enough variation to avoid monotonous corporate speak, suggesting that moderate parameter values often outperform extreme settings for commercial content generation.

## File Structure

```
interactive-prompt-playground/
├── playground.js          # Main application file
├── package.json          # Node.js dependencies and scripts
├── .env.example         # Environment variable template
├── .env                 # Your API key (create this)
├── README.md            # This file
└── results_*.md         # Generated result files
```

## Requirements

- Node.js (v14 or higher)
- OpenAI API key
- Internet connection for API calls

## Error Handling

The application includes comprehensive error handling for:

- Invalid API keys
- Network connectivity issues
- Rate limiting
- Invalid parameter values
- API response errors

## Contributing

Feel free to submit issues and enhancement requests!

```

3. Create a `.env` file with your OpenAI API key:

```

OPENAI_API_KEY=your_api_key_here

````

4. Run the playground:

```bash
node playground.js
````

## Sample Results

Here's an example of product descriptions generated with varying temperature settings:

### Parameter Test: Temperature

| Temperature | Output                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0         | The iPhone 14 Pro Max is Apple's flagship smartphone featuring a 6.7-inch Super Retina XDR display with ProMotion technology, an A16 Bionic chip for exceptional performance, and a professional camera system with 48MP main camera. It offers all-day battery life, Crash Detection, Emergency SOS via satellite, and comes in four premium finishes. With advanced security features like Face ID and the new Dynamic Island interface, it represents Apple's most sophisticated iPhone to date.                                                                                                                                                                                                                                                                                                                                                                                   |
| 0.7         | The iPhone 14 Pro Max delivers cutting-edge innovation in a sleek, sophisticated package. Featuring Apple's most advanced A16 Bionic chip, this premium smartphone offers lightning-fast performance alongside stunning photography capabilities with its 48MP main camera and improved low-light performance. The always-on display with Dynamic Island transforms how you interact with notifications, while the durable design with Ceramic Shield and water resistance ensures longevity. Capture cinema-quality video, enjoy all-day battery life, and stay connected with 5G capabilities - all in a device that combines power with elegant design.                                                                                                                                                                                                                            |
| 1.2         | Meet the iPhone 14 Pro Max – where breathtaking innovation meets boundless creativity! This revolutionary device boasts a mesmerizing 6.7" Super Retina XDR display that dances with vibrant colors and brings content to life with incredible clarity. The game-changing 48MP camera system captures magical moments with stunning detail, even in challenging lighting, while the blazing-fast A16 Bionic chip effortlessly powers through everything from intensive gaming to professional video editing. Experience the imaginative Dynamic Island interface that transforms notifications into delightful interactions, and enjoy peace of mind with potentially life-saving features like Crash Detection and Emergency SOS via satellite. With its gorgeous titanium finish and all-day battery life, this isn't just a smartphone – it's your passport to digital wonderland! |

## Parameter Reflection

The temperature parameter had the most dramatic effect on output variation. At 0.0, the model produced concise, factual descriptions focusing on technical specifications. At 0.7 (the default), descriptions became more detailed and somewhat creative while maintaining accuracy. At 1.2, the descriptions were highly creative, enthusiastic, and marketing-oriented, using more colorful language and emotional appeals.

Max token variations primarily affected the length of responses, with higher values allowing for more comprehensive descriptions including additional features, use cases, and marketing angles. Presence penalty at higher values (1.5) reduced repetition of concepts and encouraged the model to explore different aspects of the product rather than focusing heavily on technical specifications. Similarly, frequency penalty at 1.5 diversified the vocabulary used, resulting in more unique word choices and creative phrasing compared to the more straightforward language at 0.0.
