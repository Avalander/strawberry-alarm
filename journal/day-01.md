# Day 1

Today I have started working on the Week of Awesome challenge. **Strawberry Alert** is a working title generated randomly and very unlikely to change due to time constraints.

## The Project

The themes I want to try are *Alien invasion* and *Castles*. My intention is to create a side scroller where the hero must defend her castle from an alien invasion.

With this project I want to explore whether functional reactive programming can be successfully used in games. I intend to capture the user input and time effects into streams, apply map-reduce to these streams to generate the game state, and finally render that game state to the screen.

I will be happy if I can deliver something playable by the end of the week. Unfortunately, this week I'm back to work after vacation and I've got a few social commitments that I must honour, so I expect to be able to dedicate only about twelve hours more to the project.

So far, I have managed to put together a parallax background and the walking animation for the hero sprite.

## The Art

So far, I am using a hero sprite and castle tiles created by [Jetrel](https://opengameart.org/content/castle-platformer). I still need to find sprites for the alien enemies.

## The Tools

I will target the browser and create my game using JavaScript. My weapons of choice are:
- [pixi.js](http://www.pixijs.com/): a rendering library for WebGL and Canvas.
- [cyclejs](https://cycle.js.org/): a functional reactive framework. 
- [xstream](https://github.com/staltz/xstream): a stream library designed to work well with cyclejs.

## The Links

The code is available on GitHub and, since it is a browser game, I will deploy my daily progress so that you guys can try it out.

- GitHub: [https://github.com/Avalander/strawberry-alarm](https://github.com/Avalander/strawberry-alarm)
- Game: [http://woa.avalander.com/](http://woa.avalander.com/)
