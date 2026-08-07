@echo off
cd /d "%~dp0"
if not exist "index.html" ( echo  index.html absent. Lancez build.py & pause & exit /b 1 )
start "" "index.html"
