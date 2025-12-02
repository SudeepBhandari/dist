@echo off
echo Deploying to GitHub...

:: Add all changes
git add .

:: Commit changes
git commit -m "Auto-update website"

:: Push to GitHub
git push

echo Deployment complete!
pause
