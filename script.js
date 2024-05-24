"use strict";
let arr = [];
let c = 0;
let set = new Set();
let flags = new Set();
let nomovebool = false;
let shovelselected = true;
let flagsplaced = 0;
let firstmove = true;
const mines = 50;

function newgame() {
  helpgrid();
  makegrid();
  markmines();
  attachEventListeners(); // Add event listeners after creating the grid
}
newgame();

function attachEventListeners() {
  document.querySelectorAll(".boxes").forEach((box, ind) => {
    box.addEventListener("click", boxClickHandler);
  });
}

function checkwin() {
  console.log("checking");
  let x = mines;
  document.querySelectorAll(".boxes").forEach((box, ind) => {
    if (
      (arr.indexOf(ind) !== -1 && flags.has(ind) === true) ||
      (arr.indexOf(ind) !== -1 && set.has(ind) === true)
    ) {
      // console.log(x);
      console.log(set);
      x--;
    }
  });
  if (x === 0) {
    console.log("gud");
    return true;
  } else {
    console.log("bad");
    return false;
  }
  stopTimer();
}

function endgame() {
  console.log("checked");
  document.querySelector(".resetbtn").innerHTML = "Winner";
  stopTimer();
  nomove();
}

function boxClickHandler() {
  let ind = parseInt(this.dataset.index); // Get index of clicked box
  console.log(ind);
  if (shovelselected === true) {
    if (arr.indexOf(ind) !== -1) {
      //mine found
      if(firstmove===true){ // first move \\
        let safeIndex;
      	let x=ind;
      	for(let i=0;i<320;i++){
      		if(arr.indexOf(i)===-1){
            safeIndex=i;
      			// arr.remove(i-);
      			break;
      		}
      	}
        arr.splice(arr.indexOf(ind), 1);
        arr.push(safeIndex);
        let m = calcdanger(ind);
        this.innerHTML = `<div class="outbox">
							<button class="inbox">
							${m}
							</button>
					</div>`;
        // opensur(ind);
        set.add(ind);
        firstmove=false;
        startTimer();
        return;
      }
      document.querySelectorAll(".boxes").forEach((box, index) => {
        if (arr.indexOf(index) !== -1) {
          box.innerHTML = `<div class="outbox">
																			<button class="inbox">
																					<img src="images/mine.png" alt="flag">
																			</button>
																	</div>`;
        }
        stopTimer();
      });

      if (!nomovebool) {
        nomove();
      }
      // endgame();
    } else {
      // not mine
      if(firstmove===true){
        firstmove=false;
        startTimer();
      } 
      if (!nomovebool) {
        let m = calcdanger(ind);
        if (m === 0) {
          set.add(ind);
          this.innerHTML = `<div class="outbox">
							<button class="empty">
							</button>
					</div>`;
          opensur(ind);
        } else {
          // set.add(ind);
          this.innerHTML = `<div class="outbox">
							<button class="inbox">
							${m}
							</button>
					</div>`;
        }
      }
    }
    if (set.size + mines === 320) {
      if (checkwin() === true) {
        endgame();
      }
    }
  } else {
    //if flag selected
    if (arr.indexOf(ind) !== -1 && !flags.has(ind)) {
      flagsplaced++;
      flags.add(ind);
      this.innerHTML = `<div class="outbox">
						<button class="inbox">
								<img class="flag" src="images/flagori.jpg" alt="flag">
						</button>
				</div>`;
      console.log("Flag placed at", ind);
    } else if (arr.indexOf(ind) !== -1 && flags.has(ind)) {
      flagsplaced--;
      flags.delete(ind);
      this.innerHTML = `<div class="outbox">
						<button class="inbox">
						</button>
				</div>`;
      console.log("Flag removed from", ind);
    } else if (set.has(ind) === false && !flags.has(ind)) {
      // Check if flag already placed
      flagsplaced++;
      flags.add(ind);
      this.innerHTML = `<div class="outbox">
						<button class="inbox">
								<img class="flag" src="images/flagori.jpg" alt="flag">
						</button>
				</div>`;
      console.log("Flag placed at", ind);
    } else if (set.has(ind) === false && flags.has(ind)) {
      flagsplaced--;
      flags.delete(ind);
      this.innerHTML = `<div class="outbox">
						<button class="inbox">
						</button>
				</div>`;
      console.log("Flag removed from", ind);
    }
    if (flagsplaced === mines) {
      if (checkwin() === true) {
        endgame();
      }
    }
  }
}

document.querySelector(".togglebtn").style.justifyContent = "flex-end";
document.querySelector(".togglebtn").addEventListener("click", () => {
  if (
    document.querySelector(".togglebtn").style.justifyContent === "flex-start"
  ) {
    shovelselected = true;
    document.querySelector(".togglebtn").style.justifyContent = "flex-end";
    document.querySelector(
      ".togbtn"
    ).innerHTML = `<img src="images/shovel.jpg" alt="flag">`;
  } else {
    //flexend
    shovelselected = false;
    document.querySelector(".togglebtn").style.justifyContent = "flex-start";
    document.querySelector(
      ".togbtn"
    ).innerHTML = `<img src="images/flagori.jpg" alt="flag">`;
    document.querySelector(".togglebtn img").style.height = "50px";
    document.querySelector(".togglebtn img").style.width = "50px";
  }
});

function nomove() {
  console.log("nomove");
  document.querySelectorAll(".boxes").forEach((box, ind) => {
    if (arr.indexOf(ind) !== -1) {
      nomovebool = true;
    }
    let inboxdata = box.innerHTML;
    box.addEventListener("click", () => {
      box.innerHTML = inboxdata;
    });
  });
}

document.querySelector(".resetbtn").addEventListener("click", () => {
  nomovebool = false;
  console.log("reset");
  arr = [];
  c = 0;
  set = new Set();
  flags.clear();
  firstmove = true;
  // shovelselected=true;
  flagsplaced = 0;
  let grid = document.querySelector(".grid");
  document.querySelector(".resetbtn").innerHTML = "Reset";
  grid.innerHTML = "";
  newgame();
});

function calcdanger(ind) {
  let m = 0;
  if ((ind + 1) % 16 === 0) {
    if (arr.indexOf(ind - 16) != -1) {
      m++;
      // set.add(ind - 16);
    }
    if (arr.indexOf(ind + 16) != -1) {
      m++;
      // set.add(ind + 16);
    }
    if (arr.indexOf(ind - 17) != -1) {
      m++;
      // set.add(ind - 17);
    }
    if (arr.indexOf(ind + 15) != -1) {
      m++;
      // set.add(ind + 15);
    }
    if (arr.indexOf(ind - 1) != -1) {
      m++;
      // set.add(ind - 1);
    }
  } else if (ind % 16 === 0) {
    if (arr.indexOf(ind - 16) != -1) {
      m++;
      // set.add(ind - 16);
    }
    if (arr.indexOf(ind - 15) != -1) {
      m++;
      // set.add(ind - 15);
    }
    if (arr.indexOf(ind + 1) != -1) {
      m++;
      // set.add(ind + 1);
    }
    if (arr.indexOf(ind + 16) != -1) {
      m++;
      // set.add(ind + 16);
    }
    if (arr.indexOf(ind + 17) != -1) {
      m++;
      // set.add(ind + 17);
    }
  } else {
    if (arr.indexOf(ind - 16) != -1) {
      m++;
      // set.add(ind - 16);
    }
    if (arr.indexOf(ind - 15) != -1) {
      m++;
      // set.add(ind - 15);
    }
    if (arr.indexOf(ind + 1) != -1) {
      m++;
      // set.add(ind + 1);
    }
    if (arr.indexOf(ind + 16) != -1) {
      m++;
      // set.add(ind + 16);
    }
    if (arr.indexOf(ind + 17) != -1) {
      m++;
      // set.add(ind + 17);
    }
    if (arr.indexOf(ind - 17) != -1) {
      m++;
      // set.add(ind - 17);
    }
    if (arr.indexOf(ind + 15) != -1) {
      m++;
      // set.add(ind + 15);
    }
    if (arr.indexOf(ind - 1) != -1) {
      m++;
      // set.add(ind - 1);
    }
  }
  return m;
}

function helpzero(i, box) {
  if (set.has(i) === false) {
    let m = calcdanger(i);
    set.add(i);
    if (m === 0) {
      box.innerHTML = `<div class="outbox">
					<button class="empty">
					</button>
					</div>`;
      opensur(i);
    } else if (m > 0) {
      box.innerHTML = `<div class="outbox">
                                    <button class="inbox">
                                            ${m}
                                    </button>
                                </div>`;
    }
  }
}

function opensur(ind) {
  document.querySelectorAll(".boxes").forEach((box, i) => {
    if (ind % 16 === 0) {
      //first col
      if (
        i === ind - 15 ||
        i === ind - 16 ||
        i === ind + 16 ||
        i === ind + 17 ||
        i === ind + 1
      ) {
        helpzero(i, box);
      }
    } else if ((ind + 1) % 16 === 0) {
      //last row
      if (
        i === ind + 15 ||
        i === ind - 16 ||
        i === ind + 16 ||
        i === ind - 17 ||
        i === ind - 1
      ) {
        helpzero(i, box);
      }
    } else {
      if (
        i === ind - 15 ||
        i === ind - 16 ||
        i === ind - 17 ||
        i === ind - 1 ||
        i === ind + 15 ||
        i === ind + 16 ||
        i === ind + 17 ||
        i === ind + 1
      ) {
        helpzero(i, box);
      }
    }
  });
}

function helpgrid() {
  let gridhtml = "";
  let g = document.querySelector(".grid");
  for (let i = 0; i < 20 * 16; i++) {
    gridhtml += `<div class="boxes" data-index="${i}"></div>`;
  }
  g.innerHTML = gridhtml;
  // console.log("helped");
}

function makegrid() {
  let boxes = document.querySelectorAll(".boxes");
  boxes.forEach((box, ind) => {
    box.innerHTML = `<div class="outbox">
        <button class="inbox">
        </button>
        </div>`;
  });
  // console.log("made");
}

function markmines() {
  for (let i = 0; i < mines; i++) {
    let random = Math.random() * (20 * 16);
    if (arr.indexOf(Math.trunc(random)) == -1) {
      arr.push(Math.trunc(random));
    } else {
      while (arr.indexOf(Math.trunc(random)) != -1) {
        random = Math.random() * (20 * 16);
      }
      arr.push(Math.trunc(random));
    }
  }
  console.log(arr);
  // console.log("placed");
}

const timer = document.getElementById("stopwatch");
var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
  if (stoptime == true) {
    stoptime = false;
    timerCycle();
  }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}

function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10 ) {
      sec = "0" + sec;
    }
    if (min < 10 ) {
      min = "0" + min;
    }
    if (hr < 10 ) {
      hr = "0" + hr;
    }

    timer.innerHTML = hr + ":" + min + ":" + sec;

    setTimeout("timerCycle()", 1000);
  }
}
function resetTimer() {
  timer.innerHTML = "00:00:00";
  stoptime = true;
  hr = 0;
  sec = 0;
  min = 0;
}
