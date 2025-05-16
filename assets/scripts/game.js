/*  main.js
 *  ─────────────────────────────────────────────
 *  Phaser-3 “Cat Catcher” with:
 *    • Main-menu scene (Play / Credits / Quit)
 *    • Credits scene (Back button)
 *    • Game scene (your original quiz logic)
 *    • Winning scene (Retry / Main-menu)
 *  Assets are streamed from the Phaser Labs CDN,
 *  so no local image files are required.
 *  Folder structure:
 *    ├── index.html   (loads phaser & main.js)
 *    └── js
 *        └── main.js  (← this file)
 *  ───────────────────────────────────────────── */

const GAME_WIDTH  = 760;
const GAME_HEIGHT = 400;

/* ────────── SCENE: MAIN MENU ────────── */
class MenuScene extends Phaser.Scene {
  constructor () { super('MenuScene'); }

  create () {
    const titleStyle   = { font: '60px Arial', fill: '#ffffff' };
    const buttonStyle  = { font: '50px Arial', fill: '#fffb03' };

    this.add.text(GAME_WIDTH / 2, 50, 'CAT CATCHER', titleStyle).setOrigin(0.5);

    /* helper to build a centered, clickable text button */
    const makeButton = (y, label, onClick) => {
      const btn = this.add.text(GAME_WIDTH / 2, y, label, buttonStyle)
                          .setOrigin(0.5)
                          .setInteractive({ useHandCursor: true });
      btn.on('pointerdown', onClick);
      return btn;
    };

    makeButton(100, 'PLAY',   () => this.scene.start('GameScene'));
    makeButton(220, 'CREDITS', () => this.scene.start('CreditsScene'));
    makeButton(340, 'QUIT',   () => alert('You exited the game ❌'));
  }
}

/* ────────── SCENE: CREDITS ────────── */
class CreditsScene extends Phaser.Scene {
  constructor () { super('CreditsScene'); }

  create () {
    const textStyle   = { font: '48px Arial', fill: '#ffffff' };
    const buttonStyle = { font: '48px Arial', fill: '#fffb03' };

    this.add.text(GAME_WIDTH / 2, 200, 'FULL NAME:  JM KURT D. GORDUIZ', textStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 280, 'SECTION:    BSCS - 2A',           textStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 360, 'PROGRAM:    BS Computer Science', textStyle).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 520, 'BACK', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('MenuScene'));
  }
}

/* ────────── SCENE: GAME ────────── */
class GameScene extends Phaser.Scene {
  constructor () { super('GameScene'); }

  preload () {
    this.load.image('background', 'https://labs.phaser.io/assets/skies/sky4.png');
    this.load.image('player',     'https://labs.phaser.io/assets/sprites/knight.png');
    this.load.image('goal',       'https://labs.phaser.io/assets/sprites/star.png');
  }

  create () {
    /* background */
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    /* player */
    this.player = this.physics.add.sprite(250, 600, 'player')
                               .setCollideWorldBounds(true)
                               .setScale(0.5);

    /* goal */
    this.goal = this.physics.add.sprite(550, 290, 'goal');

    /* score text */
    this.score     = 0;
    this.scoreText = this.add.text(50, 50, 'Score: 0',
                      { font: '50px Arial', fill: '#fffb03' });

    /* cursor keys */
    this.cursors = this.input.keyboard.createCursorKeys();

    /* overlap (win) */
    this.physics.add.overlap(this.player, this.goal, () => {
      this.scene.start('WinScene', { finalScore: this.score });
    }, null, this);
  }

  update () {
    this.player.setVelocity(0);

    if (this.cursors.left.isDown)  { this.player.setVelocityX(-200); this.player.flipX = true;  }
    if (this.cursors.right.isDown) { this.player.setVelocityX( 200); this.player.flipX = false; }
    if (this.cursors.up.isDown)    { this.player.setVelocityY(-200); }
    if (this.cursors.down.isDown)  { this.player.setVelocityY( 200); }
  }
}

/* ────────── SCENE: WINNING ────────── */
class WinScene extends Phaser.Scene {
  constructor () { super('WinScene'); }

  init (data) { this.finalScore = data.finalScore || 0; }

  create () {
    const titleStyle  = { font: '25px Arial', fill: '#ffffff' };
    const buttonStyle = { font: '15px Arial', fill: '#fffb03' };

    this.add.text(GAME_WIDTH / 2, 30, 'YOU WON 🎉', titleStyle).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 160, `Final Score: ${this.finalScore}`, { font: '58px Arial', fill: '#ffffff' }).setOrigin(0.5);

    const makeButton = (y, label, onClick) => {
      this.add.text(GAME_WIDTH / 2, y, label, buttonStyle)
              .setOrigin(0.5)
              .setInteractive({ useHandCursor: true })
              .on('pointerdown', onClick);
    };

    makeButton(220, 'RETRY',     () => this.scene.start('GameScene'));
    makeButton(340, 'MAIN MENU', () => this.scene.start('MenuScene'));
  }
}

/* ────────── GAME CONFIG / LAUNCH ────────── */
const config = {
  type: Phaser.AUTO,
  width:  GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: { default: 'arcade', arcade: { debug: false } },
  scene:   [MenuScene, CreditsScene, GameScene, WinScene]
};

/* bootstrap Phaser */
new Phaser.Game(config);
