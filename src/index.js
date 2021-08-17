var power = false,
options = {
    game_tick_interval: 33.33333333333,

    screen_limit: {
        min_w: 0, max_w: 290, 
        min_h: 0, max_h: 145 
    },

    offscreen_render_cutoff: 15,

    player_color: 'green', 
    obstacle_color: 'red', 
    projectile_color: 'green', 

    player_movement_rate: { x: 8, y: 4 }, 
    obstacle_movement_rate: 2, //{ x: 4, y: 2 },
    projectile_movement_rate: 8,

    obstacle_count_limit: 5,
}, 
buttons = { 
    w: false, a: false, s: false, d: false,  
    n: false, m: false,
}, 
html_body = document.getElementById('html_body');

html_body.addEventListener('keydown', (e) => {
if (Object.keys(buttons).includes(e.key)) {
    buttonDown(e.key);
}
});

html_body.addEventListener('keyup', (e) => {
if (Object.keys(buttons).includes(e.key)) {
    buttonUp(e.key);
}
});

async function main() {
var canvas_data = {
        player: {
            x: options.screen_limit.max_w / 2, 
            y: options.screen_limit.max_h - 10
        }, 
        obstacles: [],
        fwd_projectiles: [],
        rev_projectiles: [],
    }, 
    points = 0;

while (power === true) {
    
    // #region non-player data update

        // #region collisions

            canvas_data.obstacles.forEach(o => {
                canvas_data.fwd_projectiles.forEach(p => {
                    if (p.x >= o.x && p.x < o.x + 2) {
                        canvas_data.obstacles.splice(canvas_data.obstacles.indexOf(o), 1);
                        points += 1;
                        updatePointsDisplay(points);
                    }
                })

                canvas_data.rev_projectiles.forEach(p => {
                    if (p.x >= o.x && p.x < o.x + 2) {
                        canvas_data.obstacles.splice(canvas_data.obstacles.indexOf(o), 1);
                        points += 1;
                        updatePointsDisplay(points);
                    }
                })

                if (((+ (o.x >= canvas_data.player.x)) + (+ (o.x <= canvas_data.player.x + 10))) + ((+ (o.y >= canvas_data.player.y)) + (+ (o.y <= canvas_data.player.y + 5))) === 4) {
                    gameOver(points);
                }
            })

        // #endregion 

        // #region projectiles

            canvas_data.fwd_projectiles.forEach(p => {
                if (p.y <= options.screen_limit.max_h + 5 && p.y >= options.screen_limit.min_h - 5) {
                    p.y = p.y - options.projectile_movement_rate;
                } else { 
                    canvas_data.fwd_projectiles.splice(canvas_data.fwd_projectiles.indexOf(p), 1);
                }
            })

            canvas_data.rev_projectiles.forEach(p => {
                if (p.y <= options.screen_limit.max_h + 5 && p.y >= options.screen_limit.min_h - 5) {
                    p.y = p.y + options.projectile_movement_rate;
                } else { 
                    canvas_data.rev_projectiles.splice(canvas_data.rev_projectiles.indexOf(p), 1);
                }
            })

        // #endregion

        // #region obstacles
        
            canvas_data.obstacles.forEach(o => {
                var r_offset = Math.floor(Math.random() * (20 - 10 + 1) + 10);

                if (
                    ((+ (o.x + options.offscreen_render_cutoff > options.screen_limit.min_w - r_offset)) + (+ (o.x + options.offscreen_render_cutoff < options.screen_limit.max_w + r_offset)) === 2 
                    && 
                    (+ (o.y + options.offscreen_render_cutoff > options.screen_limit.min_h - r_offset)) + (+ (o.y + options.offscreen_render_cutoff < options.screen_limit.max_h + r_offset)) === 2)) {   
                    switch (o.heading) {
                        case 'n': 
                            o.y = o.y - options.obstacle_movement_rate / 2;
                        break;
                        case 'e': 
                            o.x = o.x + options.obstacle_movement_rate;
                        break;
                        case 's': 
                            o.y = o.y + options.obstacle_movement_rate / 2;
                        break;
                        case 'w': 
                            o.x = o.x - options.obstacle_movement_rate;
                        break;
                        default:
                        break;
                    }
                } else { 
                    canvas_data.obstacles.splice(canvas_data.obstacles.indexOf(o), 1);
                }
            })

            if (canvas_data.obstacles.length < options.obstacle_count_limit) {
                var oh = ['n', 'e', 's', 'w'][Math.floor(Math.random() * 4)], ox, oy,
                    r_offset = Math.floor(Math.random() * (5 - 10 + 1) + 5);

                switch (oh) {
                    case 'n':
                        ox = Math.floor(Math.random() * options.screen_limit.max_w) + r_offset;
                        oy = options.screen_limit.max_h + 10;
                    break;
                    case 'e': 
                        ox = options.screen_limit.min_w - 10;
                        oy = Math.floor(Math.random() * options.screen_limit.max_h) + r_offset;
                    break;
                    case 's': 
                        ox = Math.floor(Math.random() * options.screen_limit.max_w) + r_offset;
                        oy = options.screen_limit.min_h - 10;
                    break;
                    case 'w': 
                        ox = options.screen_limit.max_w + 10;
                        oy = Math.floor(Math.random() * options.screen_limit.max_h) + r_offset;
                    break;
                    default:
                    break;
                }

                canvas_data.obstacles.push({ x: ox, y: oy, heading: oh });
            }

        // #endregion 

    // #endregion 

    // #region player input loop 

        // y 
        if (buttons.w === true) {
            var new_w = canvas_data.player.y - options.player_movement_rate.y;
            if (new_w >= options.screen_limit.min_h && new_w <= options.screen_limit.max_h) {
                canvas_data.player.y = new_w;
            }
        } else if (buttons.s === true) {
            var new_s = canvas_data.player.y + options.player_movement_rate.y;
            if (new_s >= options.screen_limit.min_h && new_s <= options.screen_limit.max_h) {
                canvas_data.player.y = new_s;
            }
        } 
        
        // x
        if (buttons.a === true) {
            var new_a = canvas_data.player.x - options.player_movement_rate.x;
            if (new_a >= options.screen_limit.min_w && new_a <= options.screen_limit.max_w) {
                canvas_data.player.x = new_a;
            }
        } else if (buttons.d === true) {
            var new_d = canvas_data.player.x + options.player_movement_rate.x;
            if (new_d >= options.screen_limit.min_w && new_d <= options.screen_limit.max_w) {
                canvas_data.player.x = new_d;
            }
        } 
        
        // fire projectile
        if (buttons.n === true) { // + fwd projectile
            if (canvas_data.fwd_projectiles.length < 10) {
                canvas_data.fwd_projectiles.push({ x: canvas_data.player.x, y: canvas_data.player.y});
            }
        } else if (buttons.m === true) { // + rev projectile
            if (canvas_data.rev_projectiles.length < 10) {
                canvas_data.rev_projectiles.push({ x: canvas_data.player.x, y: canvas_data.player.y});
            }
        }

    // #endregion

    // draw 
    draw(canvas_data);

    // framelimit
    await sleep(options.game_tick_interval);
}
}

function draw(canvas_data) { // x, y, height, width, color
clear()
const context = document.getElementById('device_screen').getContext('2d');

context.fillStyle = options.player_color;
context.fillRect(canvas_data.player.x, canvas_data.player.y, 10, 5); // x, y, w, h

canvas_data.fwd_projectiles.forEach(p => {
    context.fillStyle = options.projectile_color;
    context.fillRect(p.x, p.y, 2, 4);
})

canvas_data.rev_projectiles.forEach(p => {
    context.fillStyle = options.projectile_color;
    context.fillRect(p.x, p.y, 2, 4);
})

canvas_data.obstacles.forEach(o => {
    context.fillStyle = options.obstacle_color;
    context.fillRect(o.x, o.y, 16, 8);
})
}

function updatePointsDisplay(amount) {
document.getElementById('score_display').innerHTML = amount;
}

function gameOver(final_score) {
alert(`Game Over! Final Score: ${final_score.toString()}`);
togglePower();
}

function clear() {
document.getElementById('device_screen').getContext('2d').clearRect(0, 0, 500, 500);
}

function buttonDown(btn) { 
document.getElementById(`btn_${btn}`).focus();
buttons[`${btn}`] = true;
}

function buttonUp(btn) { 
document.getElementById(`btn_${btn}`).blur();
buttons[`${btn}`] = false;
}

function togglePower() {
const device_screen = document.getElementById('device_screen');
power = !power;
if (power === true) {
    device_screen.style.backgroundColor = '#101010';
    main();
} else { 
    device_screen.style.backgroundColor = '#030303';
    clear();
}
document.getElementById('btn_power').blur();
}

const sleep = (time) => {
return new Promise((resolve) => {
    return setTimeout(function () {
        resolve();
    }, time);
});
}

main();