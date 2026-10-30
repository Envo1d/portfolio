export const covers = [
  ['Alpine dusk', '#142b52', '#8f73d9'],
  ['Ocean', '#064e60', '#38b9bf'],
  ['Desert', '#783c4b', '#e8b982'],
  ['Forest', '#173b32', '#7ba692'],
  ['Aurora', '#30265f', '#d987bc'],
  ['Sunrise', '#844c6d', '#f9af75'],
].map(([name, dark, light], index) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${dark}"/><stop offset="1" stop-color="${light}"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h1600v1000H0z"/><circle cx="1200" cy="240" r="100" fill="white" opacity=".3"/><path d="M0 760 400 300 720 650 1100 380 1600 820v180H0Z" fill="${dark}" opacity=".6"/><path d="m0 920 560-350 360 290 420-230 260 180v190H0Z" fill="${dark}" opacity=".7"/></svg>`
  const url = `data:image/svg+xml,${encodeURIComponent(svg)}`

  return { id: `cover-${index}`, name, url }
})
