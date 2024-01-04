let turn=0;
let crowCount=7; 
let killedCount=0;
let allCrowsInGame = false;
let winningFlag = 0;
const crowCol = "#C351FF";
const vultureCol = "#F28781";
const grey = "#A7A7A7";
let isVultureInitialised = 0;
let logger = "";

var c = document.getElementById("playground");
var ctx1 = c.getContext("2d");
ctx1.moveTo(450, 75);
ctx1.lineTo(200, 700);
ctx1.stroke();

var ctx2 = c.getContext("2d");
ctx2.moveTo(450, 75);
ctx2.lineTo(700, 700);
ctx2.stroke();

var ctx3 = c.getContext("2d");
ctx3.moveTo(700, 700);
ctx3.lineTo(100, 300);
ctx3.stroke();

var ctx4 = c.getContext("2d");
ctx4.moveTo(100, 300);
ctx4.lineTo(800, 300);
ctx4.stroke();

var ctx5 = c.getContext("2d");
ctx5.lineTo(200, 700);
ctx5.moveTo(100, 300);
ctx5.stroke();

const circleArray = [
    { x: 450, y: 75, id:"circle-1", status:0 },
    { x: 100, y: 300, id:"circle-2", status:0 },
    { x: 360, y: 300, id:"circle-3", status:0 },
    { x: 540, y: 300, id:"circle-4", status:0 },
    { x: 800, y: 300, id:"circle-5", status:0 },
    { x: 305, y: 435, id:"circle-6", status:0 },
    { x: 595, y: 435, id:"circle-7", status:0 },
    { x: 450, y: 530, id:"circle-8", status:0 },
    { x: 200, y: 700, id:"circle-9", status:0 },
    { x: 700, y: 700, id:"circle-10", status:0 }
];

const crowMoves = {
    0: [2,3],
    1: [2,5],
    2: [0,1,3,5],
    3: [0,2,4,6],
    4: [3,6],
    5: [1,2,7,8],
    6: [3,4,7,9],
    7: [5,6,8,9],
    8: [5,7],
    9: [6,7]
}; 

const vultureMoves = {
    0: [2,3],
    1: [2,5],
    2: [0,1,3,5],
    3: [0,2,4,6],
    4: [3,6],
    5: [1,2,7,8],
    6: [3,4,7,9],
    7: [5,6,8,9],
    8: [5,7],
    9: [6,7]
}; 

circleArray.forEach( point => {
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(point.x, point.y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = grey;
    ctx.fill();
});

document.getElementById("playground").addEventListener("click", getCoordinatesOfCircle);

(function (){
    var textFile = null,
    makeTextFile = function (text) {
        var data = new Blob([text], {type: 'text/plain'});
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };

    document.getElementById("downloadHere").addEventListener('click', function () {
        var link = document.createElement('a');
        link.setAttribute('download', 'logs.txt');
        link.href = makeTextFile(logger);
        document.body.appendChild(link);

        window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
            });
        
    }, false);
})();



function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
}

function getCoordinatesOfCircle(event) {
    let rect = document.getElementById('playground').getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    logger = logger + "Click recorded at x: " + x + " y: " + y + "\n";
    populateColorStatus(x,y);
    isFinished();
    populateCrowsCard();
    populateTurnCard();
    populateWinCard();
}

function populateColorStatus(x_, y_){
    if(winningFlag==0){
        if(turn%2==0 && allCrowsInGame){
            moveTheLegitCrow(x_,y_);
            return;
        }
        let flag=0;
        if( x_>=(circleArray[0].x-30) && x_<=(circleArray[0].x+30) && 
            y_>=(circleArray[0].y-30) && y_<=(circleArray[0].y+30) ){  
                    if(turn%2==0){
                        if(allCrowsInGame){
                            turn++;
                            return;
                        }
                        if(circleArray[0].status==1 || circleArray[0].status==2){
                            alert("Invalid Move");
                            return;
                        }
                        crowCount--;
                        if(crowCount==0) allCrowsInGame = true;
                        circleArray[0].status = 1;
                    }  
                    else{
                        if(circleArray[0].status!=0){
                            alert("Invalid Move");
                            return;
                        }
                        let vultureIndex = whichCircleVulture();
                        if(vultureIndex==-1){
                            if(circleArray[0].status==1 || circleArray[0].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowColorLogic();
                            circleArray[0].status = 2;   
                        } else {
                            if(isThisPointAllowedForVulture(vultureIndex, 0)){
                                crowColorLogic();
                                circleArray[0].status = 2;
                            } else if(vultureIndex==5 || vultureIndex==6){
                                const toKillInd = toBeKilledIndex(0, vultureIndex);
                                if(circleArray[toKillInd].status!=1){
                                    alert("Invalid Move");
                                    return;
                                }
                                circleArray[toKillInd].status = 0;
                                killedCount++;
                                crowCount--;
                                crowColorLogic();
                                circleArray[0].status = 2;
                            } else {
                                alert("Invalid Move");
                                return;
                            }
                        }
                    } 
                    flag=1;
                } 
        else if( x_>=(circleArray[1].x-30) && x_<=(circleArray[1].x+30) && 
                y_>=(circleArray[1].y-30) && y_<=(circleArray[1].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[1].status==1 || circleArray[1].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[1].status = 1;
                        }  
                        else{
                            if(circleArray[1].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[1].status==1 || circleArray[1].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[1].status = 2;   
                            } else  {
                                if(isThisPointAllowedForVulture(vultureIndex, 1)){
                                    crowColorLogic();
                                    circleArray[1].status = 2;
                                }  else if(vultureIndex==3 || vultureIndex==7){
                                    const toKillInd = toBeKilledIndex(1, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[1].status = 2;
                                } else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        } 
                        flag=1;
                    }
        else if( x_>=(circleArray[2].x-30) && x_<=(circleArray[2].x+30) && 
                y_>=(circleArray[2].y-30) && y_<=(circleArray[2].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[2].status==1 || circleArray[2].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[2].status = 1;
                        }  
                        else{
                            if(circleArray[2].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[2].status==1 || circleArray[2].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[2].status = 2;   
                            } else {
                                if(isThisPointAllowedForVulture(vultureIndex, 2)){
                                    crowColorLogic();
                                    circleArray[2].status = 2;
                                } else if(vultureIndex==4 || vultureIndex==8){
                                    const toKillInd = toBeKilledIndex(2, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[2].status = 2;
                                } else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        } 
                        flag=1;
                    }
        else if( x_>=(circleArray[3].x-30) && x_<=(circleArray[3].x+30) && 
                y_>=(circleArray[3].y-30) && y_<=(circleArray[3].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[3].status==1 || circleArray[3].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[3].status = 1;
                        }  
                        else{
                            if(circleArray[3].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[3].status==1 || circleArray[3].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[3].status = 2;   
                            } else {
                                if(isThisPointAllowedForVulture(vultureIndex, 3)){
                                    crowColorLogic();
                                    circleArray[3].status = 2;
                                } else if(vultureIndex==1 || vultureIndex==9){
                                    const toKillInd = toBeKilledIndex(3, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[3].status = 2;
                                } else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        } 
                        flag=1;
                    }
        else if( x_>=(circleArray[4].x-30) && x_<=(circleArray[4].x+30) && 
                y_>=(circleArray[4].y-30) && y_<=(circleArray[4].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[4].status==1 || circleArray[4].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[4].status = 1;
                        }  
                        else{
                            if(circleArray[4].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[4].status==1 || circleArray[4].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[4].status = 2;   
                            } else  {
                                if(isThisPointAllowedForVulture(vultureIndex, 4)){
                                    crowColorLogic();
                                    circleArray[4].status = 2;
                                } else if(vultureIndex==2 || vultureIndex==7){
                                    const toKillInd = toBeKilledIndex(4, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[4].status = 2;
                                }  else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        } 
                        flag=1;
                    }
        else if( x_>=(circleArray[5].x-30) && x_<=(circleArray[5].x+30) && 
                y_>=(circleArray[5].y-30) && y_<=(circleArray[5].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[5].status==1 || circleArray[5].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[5].status = 1;
                        }  
                        else{
                            if(circleArray[5].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[5].status==1 || circleArray[5].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[5].status = 2;   
                            } else  {
                                if(isThisPointAllowedForVulture(vultureIndex, 5)){
                                    crowColorLogic();
                                    circleArray[5].status = 2;
                                } else if(vultureIndex==0 || vultureIndex==9){
                                    const toKillInd = toBeKilledIndex(5, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[5].status = 2;
                                }  else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        } 
                        flag=1;
                    }
        else if( x_>=(circleArray[6].x-30) && x_<=(circleArray[6].x+30) && 
                y_>=(circleArray[6].y-30) && y_<=(circleArray[6].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[6].status==1 || circleArray[6].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[6].status = 1;
                        }  
                        else{
                            if(circleArray[6].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[6].status==1 || circleArray[6].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[6].status = 2;   
                            } else  {
                                if(isThisPointAllowedForVulture(vultureIndex, 6)){
                                    crowColorLogic();
                                    circleArray[6].status = 2;
                                } else if(vultureIndex==0 || vultureIndex==8){
                                    const toKillInd = toBeKilledIndex(6, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[6].status = 2;  
                                }  else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        }
                        flag=1;
                    }
        else if( x_>=(circleArray[7].x-30) && x_<=(circleArray[7].x+30) && 
                y_>=(circleArray[7].y-30) && y_<=(circleArray[7].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[7].status==1 || circleArray[7].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[7].status = 1;
                        }  
                        else{
                            if(circleArray[7].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[7].status==1 || circleArray[7].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[7].status = 2;   
                            } else  {
                                if(isThisPointAllowedForVulture(vultureIndex, 7)){
                                    crowColorLogic();
                                    circleArray[7].status = 2;
                                } else if(vultureIndex==1 || vultureIndex==4){
                                    const toKillInd = toBeKilledIndex(7, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[7].status = 2;
                                }  else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        }
                        flag=1;
                    }
        else if( x_>=(circleArray[8].x-30) && x_<=(circleArray[8].x+30) && 
                y_>=(circleArray[8].y-30) && y_<=(circleArray[8].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[8].status==1 || circleArray[8].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[8].status = 1;
                        }  
                        else{
                            if(circleArray[8].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[8].status==1 || circleArray[8].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[8].status = 2;   
                            } else {
                                if(isThisPointAllowedForVulture(vultureIndex, 8)){
                                    crowColorLogic();
                                    circleArray[8].status = 2;
                                } else if(vultureIndex==2 || vultureIndex==6){
                                    const toKillInd = toBeKilledIndex(8, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[8].status = 2;    
                                }  else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        }
                        flag=1;
                    }
        else if( x_>=(circleArray[9].x-30) && x_<=(circleArray[9].x+30) && 
                y_>=(circleArray[9].y-30) && y_<=(circleArray[9].y+30) ){  
                        if(turn%2==0){
                            if(allCrowsInGame){
                                turn++;
                                return;
                            }
                            if(circleArray[9].status==1 || circleArray[9].status==2){
                                alert("Invalid Move");
                                return;
                            }
                            crowCount--;
                            if(crowCount==0) allCrowsInGame = true;
                            circleArray[9].status = 1;
                        }  
                        else{
                            if(circleArray[9].status!=0){
                                alert("Invalid Move");
                                return;
                            }
                            let vultureIndex = whichCircleVulture();
                            if(vultureIndex==-1){
                                if(circleArray[9].status==1 || circleArray[9].status==2){
                                    alert("Invalid Move");
                                    return;
                                }
                                crowColorLogic();
                                circleArray[9].status = 2;   
                            } else  {
                                if(isThisPointAllowedForVulture(vultureIndex, 9)){
                                    crowColorLogic();
                                    circleArray[9].status = 2;
                                } else if(vultureIndex==3 || vultureIndex==5){
                                    const toKillInd = toBeKilledIndex(9, vultureIndex);
                                    if(circleArray[toKillInd].status!=1){
                                        alert("Invalid Move");
                                        return;
                                    }
                                    circleArray[toKillInd].status = 0;
                                    killedCount++;
                                    crowColorLogic();
                                    circleArray[9].status = 2;
                                }  else {
                                    alert("Invalid Move");
                                    return;
                                }
                            }
                        }
                        flag=1;
                    }
        if(flag==1) turn++;
        populateColors();
    }
         
}

function crowColorLogic(){
    circleArray.forEach( point => {
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 30, 0, 2 * Math.PI);
        if(point.status==2){
            point.status=0;
            ctx.fillStyle = grey;
        } 
        ctx.fill();
    });
}

function populateColors(){
    circleArray.forEach( point => {
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 30, 0, 2 * Math.PI);
        if(point.status==1) ctx.fillStyle = crowCol;
        else if(point.status==2) ctx.fillStyle = vultureCol;
        else ctx.fillStyle = grey;
        ctx.fill();
    });
}

function moveTheLegitCrow(x_, y_){
    if(isAnyCrow5()==true){
        const circleIndex = whichCrow5();
        let legalMovesArr = crowMoves[circleIndex];
        for(i=0; i<legalMovesArr.length; ++i){
            if( x_>=(circleArray[legalMovesArr[i]].x-30) && x_<=(circleArray[legalMovesArr[i]].x+30) && 
            y_>=(circleArray[legalMovesArr[i]].y-30) && y_<=(circleArray[legalMovesArr[i]].y+30) ){
                if(circleArray[legalMovesArr[i]].status!=0){
                    alert("Invalid Move");
                    return;
                } else {
                    circleArray[circleIndex].status = 0;
                    circleArray[legalMovesArr[i]].status = 1;
                    turn++;
                    populateColors();
                }
            }
        }
    } else {
        if( x_>=(circleArray[0].x-30) && x_<=(circleArray[0].x+30) && 
        y_>=(circleArray[0].y-30) && y_<=(circleArray[0].y+30) ){
            if(circleArray[0].status!=1 ){
                alert("Invalid move"); 
                console.log("status: ", circleArray[0].status);
                return;
            } else circleArray[0].status=5
        } 
        else if( x_>=(circleArray[1].x-30) && x_<=(circleArray[1].x+30) && 
        y_>=(circleArray[1].y-30) && y_<=(circleArray[1].y+30) ){
            if(circleArray[1].status!=1){
                alert("Invalid move");
                console.log("status: ", circleArray[1].status);
                return;
            } else circleArray[1].status=5;
        }
        else if( x_>=(circleArray[2].x-30) && x_<=(circleArray[2].x+30) && 
        y_>=(circleArray[2].y-30) && y_<=(circleArray[2].y+30) ){
            if(circleArray[2].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[2].status);
                return;
            } else circleArray[2].status=5;
        }
        else if( x_>=(circleArray[3].x-30) && x_<=(circleArray[3].x+30) && 
        y_>=(circleArray[3].y-30) && y_<=(circleArray[3].y+30) ){
            if(circleArray[3].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[3].status);
                return;
            } else circleArray[3].status=5;
        } 
        else if( x_>=(circleArray[4].x-30) && x_<=(circleArray[4].x+30) && 
        y_>=(circleArray[4].y-30) && y_<=(circleArray[4].y+30) ){
            if(circleArray[4].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[4].status);
                return;
            } else circleArray[4].status=5;
        } 
        else if( x_>=(circleArray[5].x-30) && x_<=(circleArray[5].x+30) && 
        y_>=(circleArray[5].y-30) && y_<=(circleArray[5].y+30) ){
            if(circleArray[5].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[5].status);
                return;
            } else circleArray[5].status=5;
        } 
        else if( x_>=(circleArray[6].x-30) && x_<=(circleArray[6].x+30) && 
        y_>=(circleArray[6].y-30) && y_<=(circleArray[6].y+30) ){
            if(circleArray[6].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[6].status);
                return;
            } else circleArray[6].status=5;
        }
        else if( x_>=(circleArray[7].x-30) && x_<=(circleArray[7].x+30) && 
        y_>=(circleArray[7].y-30) && y_<=(circleArray[7].y+30) ){
            if(circleArray[7].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[7].status);
                return;
            } else circleArray[7].status=5;
        }
        else if( x_>=(circleArray[8].x-30) && x_<=(circleArray[8].x+30) && 
        y_>=(circleArray[8].y-30) && y_<=(circleArray[8].y+30) ){
            if(circleArray[8].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[8].status);
                return;
            } else circleArray[8].status=5;
        } 
        else if( x_>=(circleArray[9].x-30) && x_<=(circleArray[9].x+30) && 
        y_>=(circleArray[9].y-30) && y_<=(circleArray[9].y+30) ){
            if(circleArray[9].status!=1){
                alert("Invalid move"); 
                console.log("status: ", circleArray[9].status);
                return;
            } else circleArray[9].status=5;
        }
        
    }
}

function isAnyCrow5(){
    flag=0
    circleArray.forEach( point => {
        if(point.status==5){
            flag=1;  
        } 
    });
    return flag;
}

function whichCrow5(){
    let index=-1;
    circleArray.forEach( (point, i) => {
        if(point.status==5){
            index=i;  
        } 
    });
    return index;
}

function whichCircleVulture(){
    let index = -1;
    circleArray.forEach( (point, i) => {
        if(point.status==2){
            index=i;  
        } 
    });
    return index;
}

function isThisPointAllowedForVulture(vInd, toCheckInd){
    let res = false;
    let tempArr = vultureMoves[vInd];
    for(x=0; x<tempArr.length; ++x){
        if(tempArr[x]==toCheckInd){
            res = true;
            break;
        }
    }
    return res;
}

function toBeKilledIndex(currentIndex, vultureIndex){
    let res=-1;
    if(currentIndex==0 && vultureIndex==5) res=2;
    if(currentIndex==0 && vultureIndex==6) res=3;
    if(currentIndex==1 && vultureIndex==3) res=2;
    if(currentIndex==1 && vultureIndex==7) res=5;
    if(currentIndex==2 && vultureIndex==8) res=5;
    if(currentIndex==2 && vultureIndex==4) res=3;
    if(currentIndex==3 && vultureIndex==1) res=2;
    if(currentIndex==3 && vultureIndex==9) res=6;
    if(currentIndex==4 && vultureIndex==2) res=3;
    if(currentIndex==4 && vultureIndex==7) res=6;
    if(currentIndex==5 && vultureIndex==0) res=2;
    if(currentIndex==5 && vultureIndex==9) res=7;
    if(currentIndex==6 && vultureIndex==0) res=3;
    if(currentIndex==6 && vultureIndex==8) res=7;
    if(currentIndex==7 && vultureIndex==1) res=5;
    if(currentIndex==7 && vultureIndex==4) res=6;
    if(currentIndex==8 && vultureIndex==2) res=5;
    if(currentIndex==8 && vultureIndex==6) res=7;
    if(currentIndex==9 && vultureIndex==3) res=6;
    if(currentIndex==9 && vultureIndex==5) res=7;
    return res;
}

function isFinished(){
    if(killedCount>=4){
        winningFlag=1;
    } else if( isVultureTrapped() ){
        winningFlag=2;
    } else {
    }
}

function isVultureTrapped(){
    let vulIndex = whichCircleVulture();
    if(vulIndex==-1) return false;
    else {
        if(vulIndex==0){
            if( circleArray[2].status==1 && circleArray[3].status==1 
                && circleArray[5].status==1 && circleArray[6].status==1) return true;
        }
        else if(vulIndex==1){
            if( circleArray[2].status==1 && circleArray[3].status==1 
                && circleArray[5].status==1 && circleArray[7].status==1) return true;
        }
        else if(vulIndex==2){
            if( circleArray[0].status==1 && circleArray[1].status==1 
                && circleArray[3].status==1 && circleArray[4].status==1
                && circleArray[5].status==1 && circleArray[8].status==1) return true;
        }
        else if(vulIndex==3){
            if( circleArray[0].status==1 && circleArray[1].status==1 
                && circleArray[2].status==1 && circleArray[4].status==1
                && circleArray[6].status==1 && circleArray[9].status==1) return true;
        }
        else if(vulIndex==4){
            if( circleArray[2].status==1 && circleArray[3].status==1 
                && circleArray[6].status==1 && circleArray[7].status==1) return true;
        }
        else if(vulIndex==5){
            if( circleArray[0].status==1 && circleArray[1].status==1 
                && circleArray[2].status==1 && circleArray[7].status==1
                && circleArray[8].status==1 && circleArray[9].status==1) return true;
        }
        else if(vulIndex==6){
            if( circleArray[0].status==1 && circleArray[3].status==1 
                && circleArray[4].status==1 && circleArray[7].status==1
                && circleArray[8].status==1 && circleArray[9].status==1) return true;
        }
        else if(vulIndex==7){
            if( circleArray[1].status==1 && circleArray[4].status==1 
                && circleArray[5].status==1 && circleArray[6].status==1
                && circleArray[8].status==1 && circleArray[9].status==1) return true;
        }
        else if(vulIndex==8){
            if( circleArray[2].status==1 && circleArray[5].status==1 
                && circleArray[6].status==1 && circleArray[7].status==1) return true;
        }
        else if(vulIndex==9){
            if( circleArray[3].status==1 && circleArray[5].status==1 
                && circleArray[6].status==1 && circleArray[7].status==1) return true;
        }
    }
    return false;
}

function populateCrowsCard(){;
    document.getElementById("crowremain").innerHTML=killedCount;
}

function populateTurnCard(){
    let toShow = "";
    if(turn%2==0) toShow = "Crow's turn";
    else toShow = "Vulture's turn";
    document.getElementById("turnremain").innerHTML=toShow;
}

function populateWinCard(){
    let toShow = "";
    if(winningFlag==1) {
        toShow = "Vulture Wins!";
    }
    else if(winningFlag==2) {
        toShow = "Crows Win!";
    }
    else {
        toShow = "Go on...";
    }
    document.getElementById('winremain').innerHTML = toShow
}

function logInFile(){

}
