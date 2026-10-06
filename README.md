# GNF Converter

A responsive **Greibach Normal Form (GNF) Converter** mini-project for Theory of Computation.

## Features
- Enter a Context-Free Grammar using `->` or `→`.
- Use `|` for alternatives.
- Convert and display the original grammar, production matrix, transformation steps, final grammar, and GNF validation.
- Load the sample grammar.
- Download the conversion result as a text file.
- Install as a **PWA** on supported Windows, Android, and iPhone browsers.
- Works offline after the first successful load.
- Windows desktop build through Electron.
- Android APK build through Capacitor and GitHub Actions.

## Web app

After GitHub Pages is enabled for the repository, the application is available from the repository's **Settings → Pages** deployment URL.

## Install on phone
Open the deployed web app in Chrome/Edge on Android and choose **Install app / Add to Home screen**.  
On iPhone, open it in Safari and use **Share → Add to Home Screen**.

## Windows app
The GitHub Actions workflow builds a Windows installer when a `v*` tag is pushed. The installer is available under the workflow's **Artifacts**.

## Android APK
The same workflow builds a debug APK. It is available under the workflow's **Artifacts**.

## Important scope
This project is an educational GNF converter. The current transformation engine performs leading-variable substitution and then validates the terminal-first GNF condition. Grammars requiring additional formal transformations such as complete left-recursion elimination, epsilon-production removal, or unit-production elimination may still require further transformation.

## Example
```
S -> AB
A -> aA | a
B -> bB | b
```
