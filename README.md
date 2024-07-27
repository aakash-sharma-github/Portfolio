# My Portfolio Project

This is a personal portfolio project built with Next.js, showcasing various web and full-stack development projects. The portfolio includes features like displaying GitHub statistics, project details, attractive homepage, resume section, contact form, and more. This README provides an overview of the project's features, setup instructions, and usage.

## Features

- **Dynamic Project Slider**: View different projects with details, stack technologies, and GitHub links.
- **GitHub Stats**: Displays the number of GitHub repositories and commits using GitHub's GraphQL API.
- **Responsive Design**: Optimized for both desktop and mobile views.
- **Animations**: Uses Framer Motion for smooth animations and transitions.
- **Contact Page**: Allows users to send emails via the contact form using Nodemailer.
- **Toast Notifications**: Provides user feedback with Sonner for toast notifications.
- **Particle Design**: Adds interactive particle effects with tsParticles.
- **Component Library**: Utilizes Shadcn for reusable components.

## Technologies Used

- **Next.js**: For server-side rendering and static site generation.
- **React**: For building the user interface.
- **Framer Motion**: For animations.
- **Tailwind CSS**: For styling.
- **Axios**: For making HTTP requests.
- **GraphQL**: For fetching GitHub data efficiently.
- **Nodemailer**: For sending emails from the contact page.
- **Sonner**: For toast notifications.
- **tsParticles**: For particle effects.
- **Shadcn**: For component library.

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)

### Clone the Repository

```bash
git clone https://github.com/aakash-sharma-github/Portfolio.git
cd Portfolio
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```makefile
GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=your-github-token
SMTP_EMAIL=your-email
SMTP_EMAIL_PASSWORD=your-google-app-password
```

Replace `your-github-username`, `your-github-token`, and email-related variables with your credentials.

### Running the Development Server

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Viewing Projects

Navigate to the main page to see a slider with different projects. Each project includes details, stack technologies, and links to GitHub repositories.

### Viewing GitHub Stats

The portfolio fetches GitHub statistics, including the total number of repositories and commits. This data is fetched from the GitHub GraphQL API.

### Contact Page

Use the contact page to send emails. Ensure the Nodemailer configuration is set up correctly in your `.env` file.

### Customizing the Project

- **Projects**: Update the `projects` array in the `work` component to add or modify project details.
- **GitHub Stats**: Modify the `fetchGitHubStats` function in the API route to customize how data is fetched and processed.
- **Contact Form**: Update Nodemailer settings in the API route to fit your email provider's requirements.
- **Styling**: Update styles in the `tailwind.config.js` or modify component styles directly.
- **Particles**: Customize particle effects using tsParticles configuration.
- **Toasts**: Adjust Sonner toast settings as needed.
- **Components**: Use Shadcn components to enhance UI consistency.

## Troubleshooting

- **GitHub API Errors**: Verify that the GitHub token and username are correctly configured and have the necessary permissions.
- **Email Sending Issues**: Ensure that Nodemailer settings and environment variables are correctly configured.

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!

## License

This project is open-source.
