@echo off
echo ========================================
echo Formwork local setup
echo ========================================
echo.
echo This will install packages and start the website.
echo If it says npm is not recognised, install Node.js LTS first.
echo.
pause
npm install
if %errorlevel% neq 0 (
  echo.
  echo Something went wrong during npm install.
  echo Copy the error and send it to ChatGPT.
  pause
  exit /b %errorlevel%
)
echo.
echo Starting Formwork...
echo Open http://localhost:3000 in your browser.
echo.
npm run dev
pause
