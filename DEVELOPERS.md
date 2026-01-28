# Developers Read This

## Games

Game files are located in folder `jqrg-games/games/`

Game images are located in folder `game-images/games/` or `game-images/collections/`

> To add a game, you can look at the layout of the games in `jqrg-games/index.html`.
> 
> You need both game file and game image to add a game.
> 
> _ALT_ value is __required__ to display the text on a game image.

## /page/ & /loader/?content

The source code for these are in `github.com/jimmyqrg/loader/` and `github.com/jimmyqrg/page`.

### How to use /loader/

Example:
> `https://jimmyqrg.github.io/loader/?content=https://www.example.com` [go](https://jimmyqrg.github.io/loader/?content=https://www.example.com)

## Javascript code

They are located in folder `js/`

including:

> 1. `authority.js` ban unauthorized people from entering testing areas
> 2. `blacklist.js` ban pausd.org
> 3. `cursor.js` displays and animates the cursor in pages, the cursor assets are in folder `cursor/`
> 4. `mainPageCloak.js` changes the title and the favicon of the page to Home | Schoology
> 5. `openGame.js` is the script that opens the game when a game is clicked
> 6. `panicKey.js` if you press RIGHT SHIFT, it redirects to pausd.schoology.com, allows customization (customization is in `/index.html`)
> 7. `preventOpen.js` link this script if somehow a page is wrongly `window.open`ing.
> 8. `style.js` it's the script that supports `css/main.css`, without it, a lot of the styles won't work.
> 9. `updateDomainUrl.js` & `currentDomain.js` total trash, ignore them.

### authority.js

Use it by linking the script: `<script src="/js/authority.js">`.

### blacklist.js

Use it by linking the script: `<script src="/js/authority.js">`, doesn't really work that well.

### cursor.js

Use it by linking the script: `<script src="/js/cursor.js">`.

### mainPageCloak.js

Use it by linking the script: `<script src="/js/authority.js">`.

### openGame.js

Link the script: `<script src="/js/openGame.js">`.

Use: `openGame('https://www.example.com')`

Example usage:

```
<button onclick="openGame('https://www.example.com')">
  CLICK ME
</button>
```

### panicKey.js

Use it by linking the script: `<script src="/js/panicKey.js">`

### preventOpen.js

Use it by linking the script: `<script src="/js/preventOpen.js">`

### style.js

Use it by linking the script: `<script src="/js/style.js">`

REQUIREMENT: `<link rel="stylesheet" href="/css/main.css">`
