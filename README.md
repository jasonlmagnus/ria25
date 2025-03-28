<h1 align="center" style="font-weight: bold">
  Open Custom GPT
  <br>
    <h3 align="center">The no-code platform for building Custom GPT using Assistant api</h3>
  <br>
  
</h1>

**Open Custom GPT** provides a user-friendly solution to quickly setup a custom GPT and add to your site.

### Youtube Tutorial -> https://www.youtube.com/watch?v=2S38vkMubrg

## Key Features 🎯

- **Fast and Efficient**: Designed with speed and efficiency at its core. Open Custom GPT ensures rapid speed of building a GPT.
- **Secure**: Your data, your control. Always. Self-hosted and never shared with others
- **Open Source**: Open source and free to use.
- **Share/Embed**: Share/Embed your project with your users directly and give access to your information
- **Monetization**: Gate your Custom GPT behind a paywall and earn money

## Convert your existing Custom GPT to host on your site

To convert your existing Custom GPT to host on your site,

- Copy the instructions from the Configure Tab
- Paste them in the Open Custom GPT instructions section
- Enable Code Interpreter, Dall E or File retrieval similar to your Custom GPT
- Upload any files you added to Custom GPT
- Setup any custom functions you added in your Custom GPT in Open Custom GPT

### Stack

- Next.js
- OpenAI
- Tailwind

### Run the project locally

Minimum requirements to run the projects locally

- Node.js v18
- OpenAI API Key

```shell
npm install

npm run build

npm run dev

# visit http://localhost:3000
```

### Hosted version of Open Custom GPT

If you don't want to setup locally and wish to use a hosted version, you can start from https://customgpt.thesamur.ai/

Streaming support now added in hosted version

## Contribute 🤝

Did you get a pull request? Open it, and we'll review it as soon as possible.

- [Open Issues](https://github.com/SamurAIGPT/Open-Custom-GPT/issues)
- [Open Pull Requests](https://github.com/SamurAIGPT/Open-Custom-GPT/pulls)

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Community

Join the discord community https://discord.gg/3sbpBxVZyH to get support with setting up your Custom GPT

## Data Processing Scripts 📊

The project includes scripts for processing survey data located in the `scripts/` directory:

### Main Processing Script

`scripts/index-all.js` - Primary script for processing all survey data:

- **Input**: Uses `scripts/data/merged data-Table 1.csv`
- **Output**: Generates multiple JSON files in `scripts/output/`:
  - Individual country data files:
    - `global_data.json`
    - `uk_data.json`
    - `usa_data.json`
    - `australia_data.json`
    - `india_data.json`
    - `brazil_data.json`
    - `saudi_uae_data.json`
  - Processing report: `processing_report_[timestamp].json`

### Interactive Country Processing

`scripts/index-country-json.js` - Interactive script for processing individual country data:

- Prompts for input file name
- Processes single country CSV files from `scripts/data/`
- Outputs timestamped JSON file in `scripts/output/`

### Directory Structure

```
scripts/
├── data/                           # Input CSV files
│   ├── merged data-Table 1.csv     # Combined dataset
│   └── [country]-Table 1.csv       # Individual country files
└── output/                         # Generated JSON files
    ├── [country]_data.json         # Processed country data
    └── processing_report_[timestamp].json  # Processing metadata
```

### Processing Report

Each processing run generates a report containing:

- Timestamp of processing
- Input file path
- List of generated output files
- Record counts for each country

To process all data at once:

```shell
node scripts/index-all.js
```

To process a single country:

```shell
node scripts/index-country-json.js
```

## Deployment Trigger

Last updated: March 13, 2025 - 08:36
