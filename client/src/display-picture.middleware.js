

/* capitalize first two character */

export const capitalizeFirstTwoCharacter = (value)=>{
    return value.charAt(0).toUpperCase()+value.charAt(1).toUpperCase();
}


/* based on the first two character of the name sets background color for the display picture */

export const dp_background_setter = (name, container) => {//import to know
    switch (true) {
        case /^[A-Ea-e]$/.test(name.charAt(0)):
            if(container){
                container.style.background = "linear-gradient(135deg, #fddb92, #d1fdff)";
            }
            document.querySelectorAll('#navbar-user-dp, #posting-dp').forEach(function(el) {
                el.style.background = "linear-gradient(135deg, #fddb92, #d1fdff)";
            });
            break;

        case /^[F-Jf-j]$/.test(name.charAt(0)):
            if(container){
                container.style.background = "linear-gradient(135deg, #a2c0cc, #fceea7)";
            }
            document.querySelectorAll('#navbar-user-dp, #posting-dp').forEach(function(el) {
                el.style.background = "linear-gradient(135deg, #a2c0cc, #fceea7)";
            });
            break;

        case /^[K-Ok-o]$/.test(name.charAt(0)): 
            if(container){
                container.style.background = "linear-gradient(135deg, #a8edea, #fed6e3)";
            }
            document.querySelectorAll('#navbar-user-dp, #posting-dp').forEach(function(el) {
                el.style.background = "linear-gradient(135deg, #a8edea, #fed6e3)";
            });
            break;

        case /^[P-Tp-t]$/.test(name.charAt(0)):
            if(container){
                container.style.background = "linear-gradient(135deg, #fddb92, #d1fdff)";
            }
            document.querySelectorAll('#navbar-user-dp, #posting-dp').forEach(function(el) {
                el.style.background = "linear-gradient(135deg, #fddb92, #d1fdff)";
            });     
            break;

        case /^[U-Zu-z]$/.test(name.charAt(0)):
            if(container){
                container.style.background = "linear-gradient(135deg, #d1fbd0, #fbd1b7)";
            }
            document.querySelectorAll('#navbar-user-dp, #posting-dp').forEach(function(el) {
                el.style.background = "linear-gradient(135deg, #d1fbd0, #fbd1b7)";
            });
            break;

        default:
            if(container){
                container.style.background = "#ffd3fd";
            }
            document.querySelectorAll('#navbar-user-dp, #posting-dp').forEach(function(el) {
                el.style.background = "#ffd3fd";
            });
    }

    return;
}
