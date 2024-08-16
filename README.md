This is a [LlamaIndex](https://www.llamaindex.ai/) project using [Next.js](https://nextjs.org/) bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

# CardScraper

CardScraper is a Next.js application that integrates with the eBay API to scrape and display information about baseball cards. It utilizes the Next.js App Router, custom utility functions, and API routes to provide a seamless experience for users interested in tracking and analyzing baseball card prices. The application is designed to be deployed on Vercel, leveraging its edge functions and serverless capabilities for optimal performance.

## Features

- **Next.js App Router**: The app uses the Next.js App Router to manage routes and render components dynamically.
- **eBay API Integration**: Fetches data from the eBay API to retrieve real-time information about baseball cards.
- **Custom Utility Functions**: Utility functions are used to handle tasks like extracting search terms and managing OAuth tokens.
- **Vercel Deployment**: The application is designed to be easily deployed on Vercel, utilizing its serverless and edge function capabilities.
- **Secure API Keys**: Requires an eBay API key to function, with secure handling of environment variables via Vercel's secret management.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed on your machine.
- **Vercel Account**: For deployment and managing environment variables.
- **eBay Developer Account**: You'll need to obtain an API key from the [eBay Developer Portal](https://developer.ebay.com/).

## Installation

1. **Clone the Repository**:   
    ```
    git clone https://github.com/doctor-ew/next-llama-ebay.git cd next-llama-ebay
    ```
    
2. **Install Dependencies**:
    
    The project uses `pnpm` for package management. Install it if you haven't already, and then install the project dependencies:
    
    ```
    pnpm install
    ```
    
3. **Configure Environment Variables**:

    Create a `.env.local` file in the root directory to store your eBay API key and any other environment-specific configurations:
    
    ```
    EBAY_API_KEY=your_ebay_api_key_here
    ```
    
    ***Make sure to also add this key as a secret in your Vercel project settings.***
    
4. **Run the Development Server**:
    
    Start the Next.js development server:
    
    ```
    pnpm dev
    ```
    
    The app will be available at `http://localhost:3000`.
    

## Project Structure

- **app/api/ebay/route.ts**: This is the primary API route that interacts with the eBay API. It utilizes the `fetchCardPrices.ts` utility to fetch data and `getEbayOAuthToken.ts` to handle OAuth authentication.
    
- **utils/**: This directory contains utility functions such as:
    
    - **extractSearchTerm.ts**: Extracts and refines search terms for better query results.
    - **fetchCardPrices.ts**: Fetches card prices from eBay using the API.
    - **getEbayOAuthToken.ts**: Handles OAuth token retrieval and management.
- **pages/**: Contains the main application pages and layout configurations.
    
- **components/**: Houses React components for the user interface, such as buttons, chat sections, and input fields.
    
- **config/**: Contains configuration files like `tools.json` which can be extended for future needs.
    
- **public/**: Static files like images and icons are stored here.
    
- **next.config.mjs**: Configuration file for Next.js, including webpack customizations and integration with LlamaIndex for specific use cases.
    

## Deployment

The application is designed to be deployed on Vercel. Follow these steps to deploy:

1. **Connect to Vercel**:
    
    You can connect your GitHub repository to Vercel directly, and it will automatically deploy when you push changes.
    
2. **Add Environment Variables**:
    
    Add your eBay API key and any other necessary environment variables to the Vercel project:
    
    - Go to the Vercel dashboard.
    - Select your project.
    - Navigate to the "Environment Variables" section.
    - Add the `EBAY_API_KEY` variable.
3. **Deploy**:
    
    Vercel will automatically detect your Next.js app and deploy it using serverless functions for API routes.
    
    After deployment, you can access your application via the Vercel-provided URL.
    

## Known Issues

- **Unsupported Modules on Edge Functions**: Due to limitations in Vercel Edge Functions, certain Node.js modules like `sharp` and `onnxruntime-node` are not supported. Ensure these are only used in serverless functions or replace them with alternatives.
    
- **Module Not Found Errors**: If you encounter "Module not found" errors during the build process, ensure that the required modules are installed and that they are being used in the correct environment (Edge vs. Serverless).
    

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your enhancements.

## License

This project is licensed under the MIT License.

---

_README authored by Bob the GPT, your trusty coding copilot._