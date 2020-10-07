document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.game-container');
  const ball = document.querySelector('.ball');
  const user = document.querySelector('.user');
  const ai = document.querySelector('.ai');
  const aiScore = document.querySelector('.aiScore');
  const userScore = document.querySelector('.userScore');
  const blockHeight = 85;
  const blockWidth = 12;
  const halfBlockHeight = blockHeight / 2;
  const areaHeight = 600;
  const areaWith = 900;
  const ballRadius = 15;

  // some sounds
  const hitSound = new Audio('../sounds/hitSound.wav');
  const scoreSound = new Audio('../sounds/scoreSound.wav');
  const wallHitSound = new Audio('../sounds/wallHitSound.wav');

  let topPositionOfBall = 300;
  let leftPositionOfBall = 450;
  let topSpeedOfBall = 10;
  let leftSpeedOfBall = 0;
  let userPosition = 0;
  let aiPosition = 0;
  let speedOfUSer = 0;
  let speedOfAi = 0;
  let score1 = 0;
  let score2 = 0;
  //Speed Boost
  let boost = 0;

  //Trail things
  let left = ball.offsetLeft;
  let shadows = [];
  let delta = 4;

  // Ai player Active
  player1Ai = false;
  player2Ai = false;

  //add event
  document.addEventListener('keydown', controlDown);
  document.addEventListener('keyup', controlUp);

  //Ai Bot Activation
  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 79) {
      if (player1Ai === true) {
        player1Ai = false;
      } else {
        player1Ai = true;
      }
      console.log(player1Ai);
    }
    if (e.keyCode === 80) {
      if (player2Ai === true) {
        player2Ai = false;
      } else {
        player2Ai = true;
      }
      console.log(player2Ai);
    }
  });

  function startBall() {
    topPositionOfBall = 300;
    leftPositionOfBall = 450;
    if (Math.random() < 0.5) {
      var side = 1;
    } else {
      var side = -1;
    }

    boost = 0;
    leftSpeedOfBall = side * (Math.random() * 2 + 3);
    topSpeedOfBall = Math.random() * -2 - 3;
  }

  function controlDown(e) {
    //w
    if (e.keyCode === 87) {
      speedOfUSer = -10;
    }
    // s
    if (e.keyCode === 83) {
      speedOfUSer = 10;
    }
    //up arrow
    if (e.keyCode === 38) {
      speedOfAi = -10;
    }
    //down arrow
    if (e.keyCode === 40) {
      speedOfAi = 10;
    }
  }

  function controlUp(e) {
    //w
    if (e.keyCode === 87) {
      speedOfUSer = 0;
    }
    // s
    if (e.keyCode === 83) {
      speedOfUSer = 0;
    }
    //up arrow
    if (e.keyCode === 38) {
      speedOfAi = 0;
    }
    //down arrow
    if (e.keyCode === 40) {
      speedOfAi = 0;
    }
  }

  //End Game Scenee
  function gameOver() {
    if (score1 >= 5) {
      boost = 0;
      ball.style.display = 'none';

      setTimeout(() => {
        alert('User 1 Win');
        resetGame();
      }, 25);
    }
    if (score2 >= 5) {
      boost = 0;
      ball.style.display = 'none';

      setTimeout(() => {
        alert('User 1 Win');
        resetGame();
      }, 25);
    }
  }

  //Reseting Game
  function resetGame() {
    score1 = 0;
    score2 = 0;
    ball.style.display = '';
    boost = 0;
  }

  // Push Local Storage
  function pushScoreToLocal(s1, s2) {
    localStorage.setItem('score1', s1);
    localStorage.setItem('score2', s2);
  }

  //Set From Local Storage
  function setScoreFromLocal() {
    if (
      localStorage.getItem('score1') >= 5 ||
      localStorage.getItem('score2') >= 5
    ) {
      score1 = 0;
    } else {
      score1 = localStorage.getItem('score1');
      score2 = localStorage.getItem('score2');
    }
  }

  //Trail Effect
  function fly() {
    var shadow = ball.cloneNode();
    shadow.classList.add('shadow');
    shadow.style.backgroundColor = '#ce1891';
    document.querySelector('.game-container').appendChild(shadow);
    setTimeout(function () {
      shadow.style.backgroundColor = '#62247b';
    }, 1);

    shadows.push(shadow);
    if (shadows.length > 100) {
      shadows[0].parentNode.removeChild(shadows[0]);
      shadows.shift();
    }
    if (
      left + delta > document.body.offsetWidth - ball.offsetWidth ||
      left < 0
    ) {
      delta = -delta;
    }
    left += delta;
    ball.style.left = left + 'px';
  }

  //Ai Players
  function botKevin() {
    aiPosition += (topPositionOfBall - (aiPosition + halfBlockHeight)) * 0.09;
  }
  function botConnor() {
    userPosition +=
      (topPositionOfBall - (userPosition + halfBlockHeight)) * 0.18;
  }

  window.setInterval(function show() {
    // Key Control
    if (player1Ai == true) {
      botConnor();
    }
    if (player2Ai == true) {
      botKevin();
    }

    topPositionOfBall += topSpeedOfBall;
    leftPositionOfBall += leftSpeedOfBall;

    //stop block - top Leaving Area
    if (userPosition <= 1) {
      userPosition = 1;
    }
    if (aiPosition <= 1) {
      aiPosition = 1;
    }

    //stop block - bottom Leaving Area
    if (userPosition >= areaHeight - blockHeight) {
      userPosition = areaHeight - blockHeight;
    }
    if (aiPosition >= areaHeight - blockHeight) {
      aiPosition = areaHeight - blockHeight;
    }

    //Ball bounce off The Wall
    if (
      topPositionOfBall <= 10 ||
      topPositionOfBall >= areaHeight - ballRadius
    ) {
      topSpeedOfBall = -topSpeedOfBall;
      wallHitSound.play();
    }

    //Ball bounce off The User
    if (leftPositionOfBall <= blockWidth) {
      if (
        topPositionOfBall > userPosition &&
        topPositionOfBall < userPosition + blockHeight
      ) {
        boost++;
        leftSpeedOfBall = -leftSpeedOfBall + 1;
        topSpeedOfBall = topSpeedOfBall + 1;
        hitSound.play();
      } else {
        score2++;
        scoreSound.play();
        setTimeout(() => {
          gameOver();
          pushScoreToLocal(score1, score2);
        }, 25);

        startBall();
      }
    }

    //Ball bounce off The Ai
    if (leftPositionOfBall >= areaWith - ballRadius - blockWidth) {
      if (
        topPositionOfBall > aiPosition &&
        topPositionOfBall < aiPosition + blockHeight
      ) {
        boost++;
        leftSpeedOfBall = -leftSpeedOfBall - 1;
        topSpeedOfBall = topSpeedOfBall + 1;
        hitSound.play();
      } else {
        score1++;
        scoreSound.play();
        setTimeout(() => {
          gameOver();
          pushScoreToLocal(score1, score2);
        }, 25);
        startBall();
      }
    }

    //Tail Efect Start
    if (boost >= 5) {
      fly();
    }

    userPosition += speedOfUSer;
    aiPosition += speedOfAi;

    user.style.top = userPosition + 'px';
    ai.style.top = aiPosition + 'px';

    ball.style.top = topPositionOfBall + 'px';
    ball.style.left = leftPositionOfBall + 'px';

    userScore.innerHTML = score1.toString();
    aiScore.innerHTML = score2.toString();
  }, 1000 / 60);

  setScoreFromLocal();
  startBall();
});
