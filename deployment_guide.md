# Deployment Guide: Hosting on GitHub

I have initialized a local Git repository for your portfolio website. Follow these steps to complete the deployment to GitHub.

## Step 1: Configure Git Identity
Open your terminal in the `dist` folder and run the following commands (replace with your details):

```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

## Step 2: Commit Your Files
Now that Git knows who you are, commit the files I prepared:

```bash
git commit -m "Initial commit: Portfolio website"
```

## Step 3: Create a Repository on GitHub
1. Log in to your [GitHub account](https://github.com).
2. Click the **+** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `portfolio` or `sudip-portfolio`).
4. Make it **Public**.
5. Do **not** initialize with README, .gitignore, or license (we already have them).
6. Click **Create repository**.

## Step 4: Push to GitHub
Copy the commands provided by GitHub under "…or push an existing repository from the command line" and run them in your terminal. They will look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 5: Enable GitHub Pages
1. Go to your repository **Settings** tab.
2. Scroll down to the **Pages** section (or click **Pages** in the left sidebar).
3. Under **Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and `/ (root)`.
5. Click **Save**.

Your website will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` in a few minutes!

## Important Note
The **Admin Panel** (`/admin.html`) and **Contact Form** will **not work** fully on GitHub Pages because they require a backend server. The public-facing portfolio will work fine as a static site.
