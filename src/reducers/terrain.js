import { sprite } from 'drivers/pixi-driver'

import { spritesheet, terrain as terrainConfig } from 'config'


const initTile = ({ texture }) => sprite({
	texture: [ spritesheet, texture ],
	props: {
		width: terrainConfig.tile.size,
		height: terrainConfig.tile.size,
		position: { x: 0, y: 0 },
	}
})

export const terrainReducer = ({ terrain_tiles }, [{ player, terrain }]) => {
	terrain_tiles = terrain_tiles || terrain.map(initTile)
	for (let i=0; i<terrain.length; i++) {
		terrain_tiles[i].props.position.x = terrain[i].x - (player.x - 50)
		terrain_tiles[i].props.position.y = terrain[i].y
		terrain_tiles[i].props.visible = terrain[i].visible
	}
	return { terrain_tiles }
}
