import Image from 'next/image';
import { Component, useEffect } from 'react';

import SlimeWalkU from '../assets/slime/U_Walk.png';
import SlimeDeathU from '../assets/slime/U_Death.png';

import SlimeWalkD from '../assets/slime/D_Walk.png';
import SlimeDeathD from '../assets/slime/D_Death.png';

import SlimeWalkS from '../assets/slime/S_Walk.png';
import SlimeDeathS from '../assets/slime/S_Death.png';

import OgreAttackU from '../assets/ogre/U_Attack.png';
import OgreWalkU from '../assets/ogre/U_Walk.png';
import OgreDeathU from '../assets/ogre/U_Death.png';

import OgreAttackD from '../assets/ogre/D_Attack.png';
import OgreWalkD from '../assets/ogre/D_Walk.png';
import OgreDeathD from '../assets/ogre/D_Death.png';

import OgreAttackS from '../assets/ogre/S_Attack.png';
import OgreWalkS from '../assets/ogre/S_Walk.png';
import OgreDeathS from '../assets/ogre/S_Death.png';

import WolfAttackU from '../assets/wolf/U_Attack.png';
import WolfWalkU from '../assets/wolf/U_Walk.png';
import WolfDeathU from '../assets/wolf/U_Death.png';

import WolfAttackD from '../assets/wolf/D_Attack.png';
import WolfWalkD from '../assets/wolf/D_Walk.png';
import WolfDeathD from '../assets/wolf/D_Death.png';

import WolfAttackS from '../assets/wolf/S_Attack.png';
import WolfWalkS from '../assets/wolf/S_Walk.png';
import WolfDeathS from '../assets/wolf/S_Death.png';

import BeeWalkU from '../assets/bee/U_Walk.png';
import BeeDeathU from '../assets/bee/U_Death.png';

import BeeWalkD from '../assets/bee/D_Walk.png';
import BeeDeathD from '../assets/bee/D_Death.png';

import BeeWalkS from '../assets/bee/S_Walk.png';
import BeeDeathS from '../assets/bee/S_Death.png';

const ANIMATION_SPEED = 6;

interface EntityProps {
  frame: number; // the frame number
  positionX?: number;
  positionY?: number;
  species: string;
  speed?: number;
  size?: number;
  playerX?: number;
  playerY?: number;
  bot?: number;
  tileSpeed?: number;
  death: number;
}

interface EntityState {
  positionX: number; // Amount of pixels away from left of screen
  positionY: number; // Amount of pixels away form top of screen
  species: string; // Ogre, Wolf, Bee, Slime
  speed: number; // how fast is the entity
  size: number; // how big is the entity
  moveUp: boolean; // is the player moving up?
  moveLeft: boolean; // ...
  moveDown: boolean; // ...
  moveRight: boolean; // ...
  direction: string; //which direction is the entity facing
}

class Entity extends Component<EntityProps, EntityState> {
  constructor(props: EntityProps) {
    super(props);

    this.state = {
      positionX: this.props.positionX ? this.props.positionX : 0,
      positionY: this.props.positionY ? this.props.positionY : 0,
      species: this.props.species,
      //default speeds
      speed:
        this.props.speed !== null
          ? this.props.speed
          : this.props.species == 'Ogre'
          ? 2
          : this.props.species == 'Wolf'
          ? 5
          : this.props.species == 'Bee'
          ? 5
          : 3,
      size: this.props.size ? this.props.size : 80,
      moveUp: false,
      moveLeft: false,
      moveDown: false,
      moveRight: false,
      direction: 'up',
    };
  }

  moveUp = () => {
    this.setState({ moveUp: true });
    this.setState({ direction: 'up' });
  };
  moveLeft = () => {
    this.setState({ moveLeft: true });
    this.setState({ direction: 'left' });
  };
  moveDown = () => {
    this.setState({ moveDown: true });
    this.setState({ direction: 'down' });
  };
  moveRight = () => {
    this.setState({ moveRight: true });
    this.setState({ direction: 'right' });
  };

  stopMoveUp = () => {
    if (this.state.moveUp == true) {
      this.setState({ moveUp: false });
      if (this.state.moveLeft) this.setState({ direction: 'left' });
      else if (this.state.moveDown) this.setState({ direction: 'down' });
      else if (this.state.moveRight) this.setState({ direction: 'right' });
    }
  };
  stopMoveLeft = () => {
    if (this.state.moveLeft == true) {
      this.setState({ moveLeft: false });
      if (this.state.moveUp) this.setState({ direction: 'up' });
      else if (this.state.moveDown) this.setState({ direction: 'down' });
      else if (this.state.moveRight) this.setState({ direction: 'right' });
    }
  };
  stopMoveDown = () => {
    if (this.state.moveDown == true) {
      this.setState({ moveDown: false });
      if (this.state.moveUp) this.setState({ direction: 'up' });
      else if (this.state.moveLeft) this.setState({ direction: 'left' });
      else if (this.state.moveRight) this.setState({ direction: 'right' });
    }
  };
  stopMoveRight = () => {
    if (this.state.moveRight == true) {
      this.setState({ moveRight: false });
      if (this.state.moveUp) this.setState({ direction: 'up' });
      else if (this.state.moveLeft) this.setState({ direction: 'left' });
      else if (this.state.moveDown) this.setState({ direction: 'down' });
    }
  };

  componentDidMount(): void {
    //Check when key is pressed and change direction/move
    const startPlayerMovement = (e: KeyboardEvent) => {
      if (e.key == 'w' && this.state.moveUp == false) this.moveUp();
      if (e.key == 'a' && this.state.moveLeft == false) this.moveLeft();
      if (e.key == 's' && this.state.moveDown == false) this.moveDown();
      if (e.key == 'd' && this.state.moveRight == false) this.moveRight();
    };

    //check if key stopped being pressed and stop moving
    const stopPlayerMovement = (e: KeyboardEvent) => {
      if (e.key == 'w') this.stopMoveUp();
      if (e.key == 'a') this.stopMoveLeft();
      if (e.key == 's') this.stopMoveDown();
      if (e.key == 'd') this.stopMoveRight();
    };

    //listen for keyboard at beginning of game
    window.addEventListener('keydown', startPlayerMovement);
    window.addEventListener('keyup', stopPlayerMovement);
  }

  componentDidUpdate(prevProps: EntityProps, prevState: EntityState) {
    //when speedBuff changes update this units speed
    if (prevProps.speed !== this.props.speed)
      this.setState({ speed: this.props.speed });
    //on death, reset player position
    if (prevProps.death !== this.props.death && this.props.death == 2) {
      this.setState({
        positionX: this.props.positionX,
        positionY: this.props.positionY,
      });
    }
    //Whenever Frame is updated run these functions
    if (prevProps.frame !== this.props.frame) {
      if (this.props.tileSpeed > 0) {
        // console.log(this.state.positionX);
        this.setState(prevState => ({
          positionX: prevState.positionX - this.props.tileSpeed,
        }));
      }
      //move up
      if (this.state.moveUp) {
        if (
          !this.state.moveLeft &&
          !this.state.moveDown &&
          !this.state.moveRight
        ) {
          this.setState(prevState => ({
            positionY: prevState.positionY - this.state.speed,
          }));
        } else
          this.setState(prevState => ({
            positionY:
              prevState.positionY - (this.state.speed * Math.sqrt(2)) / 2, // accounts for higher diagonal speed
          }));
      }
      //move left
      if (this.state.moveLeft) {
        if (
          !this.state.moveUp &&
          !this.state.moveDown &&
          !this.state.moveRight
        ) {
          this.setState(prevState => ({
            positionX: prevState.positionX - this.state.speed,
          }));
        } else
          this.setState(prevState => ({
            positionX:
              prevState.positionX - (this.state.speed * Math.sqrt(2)) / 2, // accounts for higher diagonal speed
          }));
      }
      //move down
      if (this.state.moveDown) {
        if (
          !this.state.moveUp &&
          !this.state.moveLeft &&
          !this.state.moveRight
        ) {
          this.setState(prevState => ({
            positionY: prevState.positionY + this.state.speed,
          }));
        } else
          this.setState(prevState => ({
            positionY:
              prevState.positionY + (this.state.speed * Math.sqrt(2)) / 2, // accounts for higher diagonal speed
          }));
      }
      //move right
      if (this.state.moveRight) {
        if (
          !this.state.moveUp &&
          !this.state.moveLeft &&
          !this.state.moveDown
        ) {
          this.setState(prevState => ({
            positionX: prevState.positionX + this.state.speed,
          }));
        } else
          this.setState(prevState => ({
            positionX:
              prevState.positionX + (this.state.speed * Math.sqrt(2)) / 2, // accounts for higher diagonal speed
          }));
      }
    }
  }

  render() {
    //is player moving at all?
    const isMoving =
      this.state.moveDown ||
      this.state.moveLeft ||
      this.state.moveUp ||
      this.state.moveRight;

    //determines which image is used
    const walkMap = {
      Slime: {
        up: SlimeWalkU,
        left: SlimeWalkS,
        down: SlimeWalkD,
        right: SlimeWalkS,
      },
      Ogre: {
        up: OgreWalkU,
        left: OgreWalkS,
        down: OgreWalkD,
        right: OgreWalkS,
      },
      Wolf: {
        up: WolfWalkU,
        left: WolfWalkS,
        down: WolfWalkD,
        right: WolfWalkS,
      },
      Bee: {
        up: BeeWalkU,
        left: BeeWalkS,
        down: BeeWalkD,
        right: BeeWalkS,
      },
    };

    //case where entity not moving not attacking and not dead
    let objectPosition: number = 0;

    //case where entity moves, look in assets to understand better
    if (isMoving || this.state.species == 'Bee')
      objectPosition =
        (Math.floor(this.props.frame / ANIMATION_SPEED) % 6) * 20;

    return (
      <div
        className="overflow-hidden absolute"
        style={{
          width: this.state.size,
          height: this.state.size,
          transform: `translate(${
            this.state.positionX - this.state.size / 2
          }px, ${this.state.positionY - (2 * this.state.size) / 3}px)`,
        }}
      >
        <Image
          priority
          unoptimized
          fill
          src={walkMap[this.state.species][this.state.direction]}
          alt={this.state.species}
          className="pointer-events-none"
          style={{
            WebkitTouchCallout: 'none',
            userSelect: 'none',
            objectFit: 'cover',
            objectPosition: objectPosition + '%',
            transform:
              this.state.direction == 'left' ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        />
      </div>
    );
  }
}

export default Entity;
