# Processor Architecture Comparison Tool

A unofficial comprehensive web-based tool for comparing IBM POWER, Intel x86, and IBM Mainframe processors, with a focus on migration sizing calculations.

## Overview

This tool provides a detailed comparison of different processor architectures, allowing users to:

1. **Compare Processors**: Analyze IBM POWER, Intel x86, and IBM Mainframe processors across various performance metrics
2. **Calculate Migration Sizing**: Determine the required resources for migrating workloads from mainframes to POWER or Intel platforms
3. **Explore Architecture Differences**: Learn about the architectural differences in virtualization, networking, and cloud capabilities

## Files in this Repository

- **enhanced-comparison-tool.html**: The main HTML file containing the user interface
- **processor-data.json**: JSON file containing processor specifications and performance data
- **workload-data.json**: JSON file containing workload types, migration data, and architecture comparisons
- **comparison-tool-script.js**: JavaScript file with the main functionality
- **comparison-tool-script-part2.js**: Additional JavaScript functionality
- **README.md**: This documentation file

## Setup Instructions

### Option 1: GitHub Pages (Recommended)

1. Fork this repository to your GitHub account
2. Enable GitHub Pages in the repository settings
3. Your comparison tool will be available at `https://[your-username].github.io/[repository-name]/`

### Option 2: Local Deployment

1. Clone this repository to your local machine
2. Due to browser security restrictions when loading local JSON files, you'll need to run a local web server:

   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js:
   ```bash
   # Install http-server if you haven't already
   npm install -g http-server
   
   # Run the server
   http-server
   ```

3. Access the tool at `http://localhost:8000/` or the port specified by your web server

## How to Use

### Processor Comparison

1. Select the tab for the processors you want to compare (POWER vs Intel, POWER vs Mainframe, etc.)
2. Choose specific processors from the dropdown menus
3. Select a workload type that matches your use case
4. Click "Compare Processors" to see detailed results

### Mainframe Migration Sizing

1. Enter your source mainframe MIPS capacity
2. Enter the current utilization percentage
3. Select the workload type or create a custom workload mix
4. Choose your target platform (POWER, Intel, or both)
5. Click "Calculate Migration Sizing" to get detailed sizing recommendations

### Architecture Comparison

Navigate through the tabs to explore different aspects of the architectures:
- **Virtualization**: Compare virtualization technologies across platforms
- **Network Architecture**: Explore networking capabilities and differences
- **Cloud & Virtualization**: Learn about cloud features and partitioning methods

## Customizing the Tool

### Adding New Processors

To add new processors, modify the `processor-data.json` file:

```json
{
  "powerProcessors": {
    "powerX": [
      {
        "id": "powerX_model",
        "name": "IBM POWERX (specs)",
        "cores": 24,
        "threads": 96,
        ...
      }
    ]
  }
}
```

### Updating Workload Types

To update workload definitions, modify the `workload-data.json` file:

```json
{
  "workloadTypes": [
    {
      "id": "new-workload",
      "name": "New Workload Type",
      "tpmPerMips": 100,
      "description": "Description of the workload",
      ...
    }
  ]
}
```

## Data Sources

The data used in this tool comes from:

- IBM's Large System Performance Reference (LSPR)
- Micro Focus testing on HP Integrity and HP ProLiant servers
- Published processor specifications from IBM and Intel
- Industry standard benchmarks and performance metrics
- HP Sizing Mainframe Workloads research paper

## Features

- **Detailed Processor Comparisons**: Side-by-side comparison of processor specifications
- **Visual Comparisons**: Charts and metrics showing relative performance
- **Workload-Specific Analysis**: Tailored comparison based on workload type
- **Migration Sizing Calculator**: Calculate required resources for mainframe migrations
- **Architecture Overview**: Detailed information on virtualization, networking, and cloud capabilities
- **Responsive Design**: Works on desktop and mobile devices

## Contributing

Contributions to improve the tool are welcome! Please feel free to submit issues or pull requests.
Author: Gregorio Mommm (Greg)

## License

This project is open source and available under the MIT License.
