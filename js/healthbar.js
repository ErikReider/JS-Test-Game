/**@type {HTMLDivElement} */
var healthBar;

//TEMPORARY! SHOULD BE IN CANVAS INSTEAD OF IN HTML
function setHealthBar(damage) {
    if (typeof (damage) != typeof (0)) damage = 0;
    let hp = parseInt(healthBar.style.width);
    let deltaDamage = hp - damage;
    if (deltaDamage > 0) {
        healthBar.style.width = `${deltaDamage}%`;
    } else{
        healthBar.style.width = `${0}%`;
        //DIE
    }
}