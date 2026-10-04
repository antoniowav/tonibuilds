export const themes = ["tokyo-night", "catppuccin", "gruvbox", "rose-pine", "nord", "plum"] as const;
export type Theme = (typeof themes)[number];

// Runs before first paint (inlined in <head>), so a saved theme doesn't flash.
export const themeScript = `try{var t=localStorage.getItem("theme");if(${JSON.stringify(themes)}.indexOf(t)>0)document.documentElement.dataset.theme=t}catch(e){}`;
