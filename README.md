# County map

The goal of this workshop is to build a chloropleth map (https://en.wikipedia.org/wiki/Choropleth_map) of US counties displaying a dataset of your choice. The `data` folder contains three example datasets: broadband access by county, mask use by county during covid and unemployment by county in 2016. These are merely examples, and you are free to use other datasets if you wish, but you need
to make sure that they are in `.csv` format and contain statistics at the COUNTY level.

A skeleton project has already been set up in vanilla Javascript. Your task is to build this map using a rendering library of your choice (popular choices include `d3`, `maplibre` and `leaflet`) using a coding agent. The rest of this readme details how to get the project running.

## Setting up a local server

This project needs to be served over HTTP. **Don't double-click `index.html`.** That opens it as `file://`, the browser refuses to let the page read your own local files, and the error message will talk about CORS, which is not the problem.

Pick whichever of these options you can get working fastest. They all do the same thing.

---

### Option 1 — VS Code Live Server (no install if you already have VS Code)

If you're using VS Code or Cursor for your coding agent, this is the shortest
path.

1. Extensions sidebar (`Cmd/Ctrl + Shift + X`), search **Live Server**, install
   the one by Ritwick Dey.
2. Open this project folder in the editor.
3. Right-click `index.html` → **Open with Live Server**.

It opens a browser at something like `http://127.0.0.1:5500`.

## Option 2 - Node

Go to <https://nodejs.org/en/download> and take the **LTS** build, which the
page offers by default. Don't take "Current" — you want the boring one.

- **macOS** — the `.pkg` installer, or `brew install node` if you use Homebrew.
- **Windows** — the `.msi` installer, or `winget install OpenJS.NodeJS.LTS`.
- **Linux** — your distro's package manager, or
  [nvm](https://github.com/nvm-sh/nvm) if you want to avoid `sudo`.

**Close your terminal and open a new one afterwards.** The installer adds Node
to your PATH, and an already-open terminal won't see it. 

Then in your terminal, open this directory and run 
```bash
npx serve
```

The first run asks to download the `serve` package — answer `y`. That one step
needs internet; everything else in this project works offline. It then prints a
URL, usually `http://localhost:3000`.

## Change one thing

The top of `src/app.js` is a config block. Point it at a different column or a
different CSV and the whole app follows:

```js
const DATASET = {
  file: "./data/unemployment-2016-county.csv",
  key: "fips",       // the 5-digit county FIPS
  value: "unemp",    // the number to map
  isRate: true,
  ...
};
```

## Three things that will bite you

**FIPS codes are strings.** `"01001"` is Autauga County, Alabama. The number
`1001` is nothing. Any tool that guesses column types will eat the leading zero
and silently drop every county in the first several states. The map still
renders. It looks fine.

**A count is not a rate.** Colour counties by *number* of unemployed people and
you have drawn a map of where people live — Los Angeles County will be darkest
every single time, for every subject. Divide by something first.

## Working with agents 

You're not expected to write much of this. You are expected to say what it should do and tell whether it did.

## Starting with Claude Code
First, you'll need an account: Claude Code needs a Pro, Max, Team, or Enterprise plan, or a Console (API) account. The free Claude.ai plan does not include Claude Code access. Sign up at claude.ai and pick a plan at claude.com/pricing.

Before paying: if your university has a Claude for Education agreement, signing in with your school email may already give you Pro-level access. 

### Installation

The installer is self-contained.

macOS:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows Powershell:
```
irm https://claude.ai/install.ps1 | iex
```

Checking that it works:
```bash
claude --version
```

and then simply run `claude` inside this directory.

### Prompting hints
**Open with constraints**, or you'll get a React app and a build step:

> Plain JavaScript, ES modules, straight in the browser. No bundler, no npm
> install, no framework. Don't add a dependency I didn't name — if you think I need one, say so and stop.

**Paste four real rows of the CSV**, not a description of it. "County data with
a FIPS code" gets you a numeric key and a broken map.

**Ask for the check, not just the code:**

> Return the count of features that matched and the keys that didn't. I want to
> see the failures, not have them handled quietly.

**Make it explain before it writes:**

> Before any code: in two sentences, how are you keying this join and why?

You may not be able to audit the code. You can audit the reasoning.
